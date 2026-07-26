'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */


import Link from 'next/link';
import Image from 'next/image';
import { AppRoutes } from '@/types/navigation';
import { ColisorIcon } from '../icons/ColisorIcon';
import { USPLogo } from '../icons/USPLogo';
import { IFUSPLogo } from '../icons/IFUSPLogo';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';

export function Footer() {
    const { institution } = usePersonalizacaoStore();

    return (
        <footer className="bg-brand-blue border-t border-white/10 pt-16 pb-20 md:pb-8 text-white/90 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl rounded-2xl px-4 py-3.5 border border-white/30 dark:border-white/10 shadow-2xl w-fit -ml-1">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                    src="/icone-HUBLabDiv.svg"
                                    alt="HUB LabDiv Logo"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col -space-y-0.5">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-bukra font-bold text-xl text-gray-900 dark:text-white uppercase leading-tight">HUB</span>
                                    <span className="font-bukra font-black text-xl text-gradient-brand leading-tight">LabDiv</span>
                                    <div className="flex flex-col items-center opacity-90">
                                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-brand-blue/10 dark:bg-white/10 text-brand-blue dark:text-gray-400 ml-1">V3.2.0</span>
                                        <span className="text-[8px] font-black uppercase tracking-tighter ml-1 text-brand-blue dark:text-gray-500">(BETA)</span>
                                    </div>
                                </div>
                                <span className="text-[8px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bukra font-medium">
                                    {institution === 'ime' ? 'IME-USP' : institution === 'iag' ? 'IAG-USP' : institution === 'igc' ? 'IGC-USP' : institution === 'io' ? 'IO-USP' : 'Física USP'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5 ml-1">
                                <div className="w-px h-7 bg-gray-200 dark:bg-white/15"></div>
                                {institution === 'ime' ? (
                                    <Image 
                                        src="/instituto_de_matemtica_e_estatstica_universidade_de_so_paulo_ime_usp_logo.jpeg"
                                        alt="IME USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                                        priority
                                    />
                                ) : institution === 'iag' ? (
                                    <Image 
                                        src="/2oj0z6xd_400x400.jpg"
                                        alt="IAG USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                                        priority
                                    />
                                ) : institution === 'igc' ? (
                                    <Image 
                                        src="/unnamed.jpg"
                                        alt="IGC USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                                        priority
                                    />
                                ) : institution === 'io' ? (
                                    <Image 
                                        src="/image.png"
                                        alt="IO USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-gray-200 dark:border-white/10"
                                        priority
                                    />
                                ) : (
                                    <IFUSPLogo size={42} className="text-brand-blue dark:text-brand-blue-accent opacity-95" />
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-white/80 mb-6 leading-relaxed">
                            Hub de Comunicação Científica do Lab-Div - Um projeto para melhorar a comunicação do {institution === 'ime' ? 'IME-USP' : institution === 'iag' ? 'IAG-USP' : institution === 'igc' ? 'IGC-USP' : institution === 'io' ? 'IO-USP' : 'IFUSP'} e reunir em um FLUXO interativo o arquivo de material de divulgação do Lab-Div e de toda a comunidade — de dentro e fora do instituto.
                        </p>

                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-l-4 border-white/40 pl-3">Navegação</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0">groups</span> Comunidade</Link></li>
                            <li><Link href="/gcif" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"><ColisorIcon size={20} animate={false} className="w-5 h-5 flex-shrink-0" /> O Grande Colisor do IF</Link></li>
                            <li><Link href="/sobre" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0">info</span> Sobre o HUB</Link></li>
                            <li><Link href="/ferramentas" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0">construction</span> Ferramentas acadêmicas</Link></li>
                            <li><Link href="/perguntas" className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0">help_outline</span> Central de interações</Link></li>

                            <li><Link href="/admin" className="flex items-center gap-3 text-[10px] text-white/60 hover:text-white transition-colors mt-4"><span className="material-symbols-outlined text-[16px] w-5 h-5 flex items-center justify-center flex-shrink-0">admin_panel_settings</span> Painel de Controle</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-l-4 border-white/40 pl-3">Responsável pelo site</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-white/80">
                                <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">person</span>
                                <div>
                                    <p className="font-medium text-white">João Stangorlini</p>
                                    <button
                                        onClick={() => {
                                            const email = "joaopaulostangorlini@usp.br";
                                            navigator.clipboard.writeText(email);
                                            import('react-hot-toast').then(m => m.toast.success('E-mail copiado!'));
                                            window.location.href = `mailto:${email}`;
                                        }}
                                        className="hover:underline transition-colors text-left"
                                    >
                                        joaopaulostangorlini@usp.br
                                    </button>
                                </div>
                            </li>

                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-l-4 border-white/60 pl-3">
                            <span className="font-black text-white">LabDiv</span>
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-white/80">
                                <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">school</span>
                                <div>
                                    <p className="text-[10px] text-white/60 mb-0.5">Docente responsável:</p>
                                    <p className="font-medium text-white">Prof. Caetano Miranda</p>
                                    <button
                                        onClick={() => {
                                            const email = "cmiranda@if.usp.br";
                                            navigator.clipboard.writeText(email);
                                            import('react-hot-toast').then(m => m.toast.success('E-mail copiado!'));
                                            window.location.href = `mailto:${email}`;
                                        }}
                                        className="hover:underline transition-colors text-left"
                                    >
                                        cmiranda@if.usp.br
                                    </button>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/80">
                                <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white">email</span>
                                <button
                                    onClick={() => {
                                        const email = "labdiv@usp.br";
                                        navigator.clipboard.writeText(email);
                                        import('react-hot-toast').then(m => m.toast.success('E-mail copiado!'));
                                        window.location.href = `mailto:${email}`;
                                    }}
                                    className="hover:text-brand-red transition-colors text-left"
                                >
                                    labdiv@usp.br
                                </button>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <svg className="w-5 h-5 mt-0.5 text-brand-red flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                <a href="https://www.instagram.com/labdiv.ifusp/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">@labdiv.ifusp</a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-brand-red">place</span>
                                <span className="leading-tight">Ed. Novo Milênio Instituto de Física, Universidade de São Paulo.<br />Rua do Matão, 1371, São Paulo - SP.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                 <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <USPLogo size={100} className="text-white opacity-80 hover:opacity-100 transition-opacity" />
                        <p className="text-xs text-white/40 font-open-sans">
                            © {new Date().getFullYear()} IFUSP. Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-white/40 border border-white/20 px-2 py-0.5 rounded font-bukra">V3.2.0</span>
                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">(BETA)</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-3 h-3 rounded-sm bg-brand-blue shadow-sm shadow-brand-blue/50"></div>
                            <div className="w-3 h-3 rounded-sm bg-brand-red shadow-sm shadow-brand-red/50"></div>
                            <div className="w-3 h-3 rounded-sm bg-brand-yellow shadow-sm shadow-brand-yellow/50"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
