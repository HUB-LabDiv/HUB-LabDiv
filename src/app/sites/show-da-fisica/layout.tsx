import React from 'react';
import { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { ShowHeader } from '@/components/sites/show-da-fisica/layout/ShowHeader';
import { ShowBottomDock } from '@/components/sites/show-da-fisica/layout/ShowBottomDock';
import { ShowFooter } from '@/components/sites/show-da-fisica/layout/ShowFooter';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata: Metadata = {
    title: {
        template: '%s | Show de Física IFUSP',
        default: 'Show de Física | Instituto de Física da USP',
    },
    description: 'Espetáculo interativo de experimentos científicos do Instituto de Física da USP. Agendamento para escolas, catalogo de experimentos e interações ao vivo.',
};

export default function ShowDeFisicaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`show-da-fisica-root min-h-screen flex flex-col bg-transparent text-gray-900 dark:text-white ${orbitron.className} transition-colors duration-300 selection:bg-[#FFCC00] selection:text-black`}>
            {/* Definições CSS da Identidade Visual Neon Show de Física */}
            <style dangerouslySetInnerHTML={{__html: `
                .neon-text-blue {
                    color: #002ffe;
                    text-shadow: 0 0 10px rgba(0, 47, 254, 0.3);
                }
                .dark .neon-text-blue {
                    color: #fff;
                    text-shadow: 0 0 5px #002ffe, 0 0 10px #002ffe, 0 0 20px #002ffe, 0 0 40px #002ffe;
                }
                .neon-text-red {
                    color: #f60011;
                    text-shadow: 0 0 10px rgba(246, 0, 17, 0.3);
                }
                .dark .neon-text-red {
                    color: #fff;
                    text-shadow: 0 0 5px #f60011, 0 0 10px #f60011, 0 0 20px #f60011, 0 0 40px #f60011;
                }
                .neon-text-green {
                    color: #009900;
                    text-shadow: 0 0 10px rgba(1, 243, 0, 0.3);
                }
                .dark .neon-text-green {
                    color: #fff;
                    text-shadow: 0 0 5px #01f300, 0 0 10px #01f300, 0 0 20px #01f300, 0 0 40px #01f300;
                }
                .neon-text-yellow {
                    color: #b45309;
                    text-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
                }
                .dark .neon-text-yellow {
                    color: #fff;
                    text-shadow: 0 0 5px #FFCC00, 0 0 10px #FFCC00, 0 0 20px #FFCC00, 0 0 40px #FFCC00;
                }

                .neon-border-blue {
                    border: 2px solid #002ffe;
                    box-shadow: 0 4px 15px rgba(0, 47, 254, 0.2);
                }
                .dark .neon-border-blue {
                    border: 2px solid #002ffe;
                    box-shadow: 0 0 10px #002ffe, inset 0 0 10px #002ffe;
                }
                .neon-border-red {
                    border: 2px solid #f60011;
                    box-shadow: 0 4px 15px rgba(246, 0, 17, 0.2);
                }
                .dark .neon-border-red {
                    border: 2px solid #f60011;
                    box-shadow: 0 0 10px #f60011, inset 0 0 10px #f60011;
                }
                .neon-border-green {
                    border: 2px solid #01f300;
                    box-shadow: 0 4px 15px rgba(1, 243, 0, 0.2);
                }
                .dark .neon-border-green {
                    border: 2px solid #01f300;
                    box-shadow: 0 0 10px #01f300, inset 0 0 10px #01f300;
                }
                .neon-border-yellow {
                    border: 2px solid #FFCC00;
                    box-shadow: 0 4px 15px rgba(255, 204, 0, 0.2);
                }
                .dark .neon-border-yellow {
                    border: 2px solid #FFCC00;
                    box-shadow: 0 0 10px #FFCC00, inset 0 0 10px #FFCC00;
                }
            `}} />

            <ShowHeader />
            <main className="flex-1 w-full">
                {children}
            </main>
            <ShowBottomDock />
            <ShowFooter />
        </div>
    );
}
