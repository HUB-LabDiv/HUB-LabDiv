'use client';

import Link from 'next/link';
import { AppRoutes } from '@/types/navigation';
import { ColisorIcon } from '../icons/ColisorIcon';
import { USPLogo } from '../icons/USPLogo';
import { IFUSPLogo } from '../icons/IFUSPLogo';

export function Footer() {
    return (
        <footer className="bg-brand-blue border-t border-white/10 pt-16 pb-20 md:pb-8 text-white/90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/10 w-fit -ml-4">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <div className="absolute w-[60%] h-[75%] bg-brand-blue rounded-[2px] top-0 left-0 z-0 shadow-sm"></div>
                                <div className="absolute w-[60%] h-[75%] bg-brand-red rounded-[2px] bottom-0 right-0 z-0 translate-y-1 shadow-sm"></div>
                                <div className="absolute w-[60%] h-[60%] bg-brand-yellow rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-md border-2 border-white"></div>
                            </div>
                            <div className="flex flex-col -space-y-0.5">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-bukra font-bold text-xl text-white uppercase leading-tight">HUB</span>
                                    <span className="font-bukra font-black text-xl text-white leading-tight">LabDiv</span>
                                    <div className="flex flex-col items-center opacity-70">
                                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/15 text-white/70 ml-1">V3.2.0</span>
                                        <span className="text-[8px] font-black uppercase tracking-tighter ml-1 text-white/40">(BETA)</span>
                                    </div>
                                </div>
                                <span className="text-[8px] uppercase tracking-wider text-white/50 font-bukra font-medium">Física USP</span>
                            </div>
                            <div className="flex items-center gap-2.5 ml-1">
                                <div className="w-px h-7 bg-white/20"></div>
                                <IFUSPLogo size={42} className="text-white opacity-90" />
                            </div>
                        </div>
                        <p className="text-sm text-white/60 mb-6 leading-relaxed">
                            Hub de Comunicação Científica do Lab-Div - Um projeto para melhorar a comunicação do IFUSP e reunir em um FLUXO interativo o arquivo de material de divulgação do Lab-Div e de toda a comunidade — de dentro e fora do instituto.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xl">public</span></a>
                            <a href="#" className="text-white/50 hover:text-brand-yellow transition-colors bg-white/10 hover:bg-brand-yellow/20 w-10 h-10 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xl">camera_alt</span></a>
                            <a href="#" className="text-white/50 hover:text-brand-red transition-colors bg-white/10 hover:bg-brand-red/20 w-10 h-10 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-xl">alternate_email</span></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-l-4 border-white/40 pl-3">Navegação</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><span className="material-symbols-outlined text-xs">groups</span> Comunidade</Link></li>
                            <li><Link href="/explorar" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><ColisorIcon size={14} animate={false} /> O Grande Colisor do IF</Link></li>
                            <li><Link href="/ferramentas" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><span className="material-symbols-outlined text-xs">construction</span> Ferramentas acadêmicas</Link></li>
                            <li><Link href="/perguntas" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><span className="material-symbols-outlined text-xs">help_outline</span> Interação (Pergunte/Lab)</Link></li>
                            <li><Link href="/sobre" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><span className="material-symbols-outlined text-xs">info</span> LabDiv</Link></li>
                            <li><Link href="/admin" className="flex items-center gap-2 text-[10px] text-gray-400/50 dark:text-gray-600/50 hover:text-brand-blue-accent dark:hover:text-brand-blue-accent transition-colors mt-4"><span className="material-symbols-outlined text-[10px]">admin_panel_settings</span> Painel de Controle</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-l-4 border-white/40 pl-3">Responsável pelo site</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <span className="material-symbols-outlined text-sm mt-0.5 text-brand-blue-accent">person</span>
                                <div>
                                    <p className="font-medium text-white">João Paulo</p>
                                    <button
                                        onClick={() => {
                                            const email = "joaopaulostangorlini@usp.br";
                                            navigator.clipboard.writeText(email);
                                            import('react-hot-toast').then(m => m.toast.success('E-mail copiado!'));
                                            window.location.href = `mailto:${email}`;
                                        }}
                                        className="hover:text-brand-blue-accent transition-colors text-left"
                                    >
                                        joaopaulostangorlini@usp.br
                                    </button>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <span className="material-symbols-outlined text-sm mt-0.5 text-brand-blue-accent">phone</span>
                                <a href="https://wa.me/5511968401823" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue-accent transition-colors">
                                    (11) 96840-1823
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider border-l-4 border-brand-red pl-3">
                            <span className="text-white">LabDiv</span>
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <span className="material-symbols-outlined text-sm mt-0.5 text-brand-red">email</span>
                                <button
                                    onClick={() => {
                                        const email = "joaopaulostangorlini@usp.br";
                                        navigator.clipboard.writeText(email);
                                        import('react-hot-toast').then(m => m.toast.success('E-mail copiado!'));
                                        window.location.href = `mailto:${email}`;
                                    }}
                                    className="hover:text-brand-red transition-colors text-left"
                                >
                                    joaopaulostangorlini@usp.br
                                </button>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <span className="material-symbols-outlined text-sm mt-0.5 text-brand-red">language</span>
                                <a href="https://labdiv.notion.site" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">labdiv.notion.site</a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-white/60">
                                <span className="material-symbols-outlined text-sm mt-0.5 text-brand-red">place</span>
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
