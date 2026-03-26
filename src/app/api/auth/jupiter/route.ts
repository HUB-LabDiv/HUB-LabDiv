import { NextRequest, NextResponse } from 'next/server';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const maxDuration = 60;
import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminSupabase } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    let browser;
    try {
        const body = await req.json();
        const { nUsp, password } = body;

        if (!nUsp || !password) {
            return NextResponse.json({ success: false, error: 'Credenciais ausentes' }, { status: 400 });
        }

        const supabaseAdmin = createAdminSupabase();

        const isLocal = !process.env.VERCEL_ENV && process.env.NODE_ENV === 'development';
        const executablePath = isLocal
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : await chromium.executablePath();

        browser = await puppeteerCore.launch({
            // @ts-ignore
            args: isLocal ? ['--no-sandbox', '--disable-setuid-sandbox'] : chromium.args,
            // @ts-ignore
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            // @ts-ignore
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        } as any);
        
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
        );

        // 1. Go to Login page
        await page.goto('https://uspdigital.usp.br/jupiterweb/webLogin.jsp', { timeout: 30000 });

        // 2. Login
        await page.waitForSelector("input[name='codpes']");
        await page.type('input[name="codpes"]', nUsp);
        await page.type('input[name="senusu"]', password);
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.keyboard.press('Enter')
        ]);

        // Check for login error
        const isLoginFailed = await page.evaluate(() => {
            return document.body.innerText.includes('Usuário e/ou senha inválido(s)') || 
                   document.body.innerText.includes('Incorreto');
        });

        if (isLoginFailed) {
            throw new Error('Credenciais da USP inválidas. Verifique seu Nº USP e Senha.');
        }

        // 3. User is logged in. Get personal data: Course, Institute, Email, Year
        const userInfoJupiterLink = `https://uspdigital.usp.br/jupiterweb/uspDadosPessoaisMostrar?codmnu=4543`;
        await page.goto(userInfoJupiterLink, { waitUntil: 'load', timeout: 30000 });

        const userData = await page.evaluate(() => {
            const allFontsTexts = Array.from(document.querySelectorAll('font')).map((el) => el.textContent || '');
            const all77WidthFontTexts = Array.from(document.querySelectorAll("td[width='77%'] font")).map((el) => el.textContent || '');
            
            const name = all77WidthFontTexts[1] || 'Estudante USP';
            
            // Extracts course - searching dynamically because Jupiter layout changes
            const courseElement = document.querySelector('#curso');
            let jupiterWebCourse = '';
            if (courseElement) {
                const brokeCourseText = courseElement.textContent?.split(' - ') || [];
                for (const text of brokeCourseText) {
                    if (isNaN(Number(text))) {
                        jupiterWebCourse = text.trim();
                        break;
                    }
                }
            } else {
                // Fallback for course
                jupiterWebCourse = 'Curso USP';
            }

            const instituteElement = document.querySelector('#unidade');
            const jupiterWebInstitute = instituteElement?.textContent?.split(' - ')[1]?.trim() || '';

            const emails = allFontsTexts.filter((text) => text.includes('@'));
            const email = emails.find((e) => e.includes('usp.br')) || emails[0] || '';

            return { name, jupiterWebCourse, jupiterWebInstitute, email };
        });

        const emailToUse = userData.email || `${nUsp}@usp.br`;
        const generatedPassword = `${nUsp}LabDiv2024!`; // Fixed deterministic secure string since they use Júpiter to login

        // 4. Navigate to Grade Horária to sync schedule
        await page.goto('https://uspdigital.usp.br/jupiterweb/gradeHoraria?codmnu=4759', { waitUntil: 'load', timeout: 30000 });

        await page.waitForSelector('select').catch(() => null);
        const options = await page.evaluate(() => {
            const select = document.querySelector('select');
            if (!select) return [];
            return Array.from(select.querySelectorAll('option')).map(opt => (opt as HTMLOptionElement).value);
        });

        if (options.length > 0) {
            options.sort();
            await page.select('select', options[options.length - 1]);
        }

        const navPromise = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => null);
        const buscarBtn = await page.$('input[type="button"][value="Buscar"]');
        if (buscarBtn) {
            await buscarBtn.click();
            await navPromise;
        }

        async function scrapeGrade() {
            return await page.evaluate(() => {
                const events: Array<{ code: string, dayOfWeek: number, startTime: string, endTime: string }> = [];
                let rowIndex = 1;
                const codeRegex = /([A-Z]{2,4}\d{4})|(\d{7})/; // USP subject code format (MAC0110 or 4300112)
                
                while (document.getElementById(rowIndex.toString())) {
                    const row = document.getElementById(rowIndex.toString());
                    if (!row) break;

                    const startCell = row.querySelector('td:nth-child(1)')?.textContent?.trim() || '08:00';
                    const endCell = row.querySelector('td:nth-child(2)')?.textContent?.trim() || '10:00';
                    
                    for (let i = 3; i <= 8; i++) {
                        const subjectRaw = row.querySelector(`td:nth-child(${i})`)?.textContent?.trim();
                        if (subjectRaw) {
                            const match = subjectRaw.match(codeRegex);
                            if (match) {
                                events.push({
                                    code: match[0],
                                    dayOfWeek: i - 2,
                                    startTime: startCell,
                                    endTime: endCell
                                });
                            }
                        }
                    }
                    rowIndex++;
                }
                return events;
            });
        }

        let subjectsScraped = await scrapeGrade();

        // Fallback: If no subjects found in the last option, try the one before (last-1)
        if (subjectsScraped.length === 0 && options.length > 1) {
            await page.select('select', options[options.length - 2]);
            const navPromiseRetry = page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => null);
            const buscarBtnRetry = await page.$('input[type="button"][value="Buscar"]');
            if (buscarBtnRetry) {
                await buscarBtnRetry.click();
                await navPromiseRetry;
                await page.waitForSelector("tr[id='1']", { timeout: 10000 }).catch(() => null);
                subjectsScraped = await scrapeGrade();
            }
        }

        await browser.close();

        // 5. Create or Authenticate User via Supabase Admin
        // Check if user exists first to decide whether to create
        const { data: existingUserObj, error: existingError } = await supabaseAdmin.auth.admin.listUsers();
        let userAuthInfo = existingUserObj?.users.find(u => u.email === emailToUse);

        if (!userAuthInfo) {
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: emailToUse,
                password: generatedPassword,
                email_confirm: true,
                user_metadata: {
                    nUsp: nUsp,
                    name: userData.name,
                    course: userData.jupiterWebCourse,
                    institute: userData.jupiterWebInstitute,
                    full_name: userData.name,
                    is_usp: true
                }
            });

            if (createError && !createError.message.includes('already exists')) {
                throw createError;
            }
            userAuthInfo = newUser?.user || undefined;
        } else {
            // User exists (maybe from Google OAuth). We must set their password so signInWithPassword works.
            await supabaseAdmin.auth.admin.updateUserById(userAuthInfo.id, {
                password: generatedPassword,
                user_metadata: {
                    ...userAuthInfo.user_metadata,
                    nUsp: nUsp,
                    course: userData.jupiterWebCourse,
                    institute: userData.jupiterWebInstitute,
                    is_usp: true
                }
            });
        }

        // 6. Sign In the user directly (This generates Next.js cookies containing their session)
        const supabase = await createServerSupabase();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailToUse,
            password: generatedPassword,
        });

        if (authError) {
            throw new Error(`Erro ao gerar sessão local: ${authError.message}`);
        }

        const user = authData.user;

        // 7. Process scraped subjects and fetch names
        const scrapedCodes = Array.from(new Set(subjectsScraped.map(s => s.code)));
        const courseNames = new Map<string, string>();
        
        await Promise.all(scrapedCodes.map(async (code) => {
            try {
                const res = await fetch(`https://uspdigital.usp.br/jupiterweb/obterDisciplina?sgldis=${code}`);
                const buffer = await res.arrayBuffer();
                const decoder = new TextDecoder('iso-8859-1');
                const html = decoder.decode(buffer);
                
                const match = html.match(new RegExp(`Disciplina:\\s*${code}\\s*-\\s*([^<\\r\\n]+)`, 'i'));
                if (match && match[1]) {
                    courseNames.set(code, match[1].trim());
                } else {
                    courseNames.set(code, code);
                }
            } catch {
                courseNames.set(code, code);
            }
        }));

        const numSynced = subjectsScraped.length > 0 ? scrapedCodes.length : 0;

        return NextResponse.json({ 
            success: true, 
            message: `Autenticado com sucesso! Foram encontradas ${numSynced} disciplinas na sua grade oficial.`, 
            subjects: subjectsScraped,
            courseNames: Object.fromEntries(courseNames),
            user: {
                id: user.id,
                email: emailToUse,
                course: userData.jupiterWebCourse
            }
        });

    } catch (error: any) {
        if (browser) await browser.close();
        console.error('[Jupiter Auth Error]', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'Erro ao comunicar com sistema da USP.' 
        }, { status: 500 });
    }
}
