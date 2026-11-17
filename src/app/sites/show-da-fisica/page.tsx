import React from 'react';
import { Metadata } from 'next';
import { Block1HeroMarquee } from '@/components/sites/show-da-fisica/home/Block1HeroMarquee';
import { Block2BasicInfo } from '@/components/sites/show-da-fisica/home/Block2BasicInfo';
import { Block3CollabCarousel } from '@/components/sites/show-da-fisica/home/Block3CollabCarousel';
import { Block4PreShowBooking } from '@/components/sites/show-da-fisica/home/Block4PreShowBooking';
import { Block5LiveInteract } from '@/components/sites/show-da-fisica/home/Block5LiveInteract';
import { Block6NewsEventsMural } from '@/components/sites/show-da-fisica/home/Block6NewsEventsMural';
import { Block7TeamShowcase } from '@/components/sites/show-da-fisica/home/Block7TeamShowcase';

export const metadata: Metadata = {
    title: 'Show de Física | Início',
    description: 'Espetáculo interativo de experimentos científicos do Instituto de Física da USP.',
};

export default function ShowDeFisicaHomePage() {
    return (
        <div className="w-full flex flex-col">
            {/* Bloco 1: Introdução (Hero) com Letreiro Show de Física */}
            <Block1HeroMarquee />

            {/* Bloco 2: Informações Básicas (Conceito, História & Local, Funcionamento) */}
            <Block2BasicInfo />

            {/* Bloco 3: Feed Horizontal (Carrossel Social & Collabs do HUB) */}
            <Block3CollabCarousel />

            {/* Bloco 4: Orientações Pré-Show + Agendar / Montar seu Show */}
            <Block4PreShowBooking />

            {/* Bloco 5: Converse com o Show / Acompanhe a Apresentação Ao Vivo */}
            <Block5LiveInteract />

            {/* Bloco 6: Eventos, Oportunidades & Notícias do Show */}
            <Block6NewsEventsMural />

            {/* Bloco 7: Equipe do Show + Ponto de Acesso aos Bastidores */}
            <Block7TeamShowcase />
        </div>
    );
}

