import React from 'react';
import { AdminAIToggle } from '@/components/admin/ia/AdminAIToggle';
import { Sparkles, Bot } from 'lucide-react';

export const metadata = {
    title: 'Auto-Moderador IAMAI | Admin Panel',
};

export default function AdminIAPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 pb-32">
            <header className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-brand-blue flex items-center justify-center border-2 border-purple-500/20 shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white font-bukra">Moderação IA</h1>
                        <p className="text-sm text-gray-400 font-medium">Controle do Algoritmo Gemini (IAMAI)</p>
                    </div>
                </div>
            </header>

            <section className="bg-neutral-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <AdminAIToggle />
                </div>
            </section>
        </div>
    );
}
