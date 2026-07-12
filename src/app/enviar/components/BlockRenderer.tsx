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

import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import CarouselBlock from './blocks/CarouselBlock';
import Model3DBlock from './blocks/Model3DBlock';
import QuizBlock from './blocks/QuizBlock';
import AudioBlock from './blocks/AudioBlock';
import ReflectionBlock from './blocks/ReflectionBlock';
import VideoBlock from './blocks/VideoBlock';
import PdfBlock from './blocks/PdfBlock';
import NotesBlock from './blocks/NotesBlock';
import DriveBlock from './blocks/DriveBlock';
import ContextBlock from './blocks/ContextBlock';
import ReferenceBlock from './blocks/ReferenceBlock';
import WebGameBlock from './blocks/WebGameBlock';
import WebPageBlock from './blocks/WebPageBlock';
import LinkBlock from './blocks/LinkBlock';

interface BlockRendererProps {
    block: Block;
    forcePreview?: boolean;
}

const getBlockTip = (type: string) => {
    switch(type) {
        case 'text': return "Use este bloco para desenvolver conceitos, explicar detalhes ou criar transições narrativas claras entre as mídias.";
        case 'image': return "Imagens fortes engajam o leitor. Certifique-se de que a imagem tenha boa resolução e agregue valor à explicação.";
        case 'carousel': return "Carrosséis são ótimos para passo a passo, evoluções ou galerias. Mantenha as fotos visualmente coerentes.";
        case '3d_object': return "Modelos 3D permitem exploração livre. Ideal para anatomia, moléculas ou arquitetura onde o espaço importa.";
        case 'video': return "Vídeos são ótimos para demonstrações práticas. Mantenha-os curtos e vá direto ao ponto.";
        case 'audio': return "Áudios podem conter explicações guiadas ou sons de experimentos reais para enriquecer a imersão.";
        case 'quiz': return "Quizzes ajudam a fixar o conhecimento. Formule perguntas que façam o leitor raciocinar, não apenas memorizar.";
        case 'reflection': return "Use para fazer provocações ou perguntas retóricas que conectem o conteúdo à vida do leitor.";
        case 'web_page': return "Incorpore páginas web relevantes, mas evite abusar. O leitor não deve precisar sair do HUB para entender o principal.";
        case 'pdf': return "Anexe materiais de apoio detalhados, como papers ou relatórios extensos para quem deseja se aprofundar.";
        case 'drive': return "Compartilhe pastas com materiais extras, datasets ou recursos complementares úteis para a comunidade.";
        case 'reference': return "Cite suas fontes de maneira clara. O rigor científico é fundamental na divulgação.";
        case 'notes': return "Adicione anotações de bastidores ou comentários da autoria que humanizam o processo científico.";
        case 'context_history': return "Conecte o tema a eventos históricos. A ciência não ocorre no vácuo, ela tem um passado.";
        case 'context_social': return "Mostre o impacto do tema na sociedade atual e como ele afeta diferentes grupos de pessoas.";
        case 'context_political': return "Explore as decisões políticas e regulamentações que permeiam ou foram afetadas por esta ciência.";
        case 'context_world_object': return "Explique como o mundo ao redor influencia, restringe ou molda as características deste objeto/teoria.";
        case 'context_object_world': return "Mostre como as descobertas sobre este objeto alteram o mundo, criam novas tecnologias ou mudam paradigmas.";
        case 'link': return "Este botão guiará o leitor para o próximo passo. Links do próprio HUB recebem destaque especial.";
        default: return "Explore as possibilidades deste bloco para enriquecer sua comunicação científica.";
    }
};

export function BlockRenderer({ block, forcePreview = false }: BlockRendererProps) {
    const { activeBlockId, setActiveBlock, removeBlock, moveBlock, previewMode: storePreviewMode } = useSubmissionStore();
    const actualPreviewMode = forcePreview ? 'preview' : storePreviewMode;
    const isActive = !forcePreview && activeBlockId === block.id;

    const handleWrapperClick = (e: React.MouseEvent) => {
        // Evitar que cliques dentro do bloco também fechem-no
        e.stopPropagation();
        if (!isActive && actualPreviewMode !== 'preview') {
            setActiveBlock(block.id);
        }
    };

    const renderBlockContent = () => {
        switch (block.type) {
            case 'text': return <TextBlock block={block} isActive={isActive} />;
            case 'image': return <ImageBlock block={block} isActive={isActive} />;
            case 'carousel': return <CarouselBlock block={block} isActive={isActive} />;
            case '3d_object': return <Model3DBlock block={block} isActive={isActive} />;
            case 'quiz': return <QuizBlock block={block} isActive={isActive} />;
            case 'audio': return <AudioBlock block={block} isActive={isActive} />;
            case 'reflection': return <ReflectionBlock block={block} isActive={isActive} />;
            case 'video': return <VideoBlock block={block} isActive={isActive} />;
            case 'web_game': return <WebGameBlock block={block} isActive={isActive} />;
            case 'web_page': return <WebPageBlock block={block} isActive={isActive} />;
            case 'pdf': return <PdfBlock block={block} isActive={isActive} />;
            case 'notes': return <NotesBlock block={block} isActive={isActive} />;
            case 'reference': return <ReferenceBlock block={block} isActive={isActive} />;
            case 'drive': return <DriveBlock block={block} isActive={isActive} />;
            case 'context_history': 
            case 'context_social': 
            case 'context_political': 
            case 'context_world_object':
            case 'context_object_world': return <ContextBlock block={block} isActive={isActive} />;
            case 'link': return <LinkBlock block={block} isActive={isActive} />;
            case 'glossary': return null; // Deprecated as a standalone block, now a Modal tool
            default: return <div className="text-gray-400">Bloco não suportado: {block.type}</div>;
        }
    };

    return (
        <div 
            onClick={handleWrapperClick}
            className={`relative group mb-8 mt-10 transition-all duration-300 rounded-2xl border p-1 
            ${isActive 
                ? 'border-brand-yellow/50 bg-gray-800/80 shadow-lg shadow-brand-yellow/5' 
                : 'border-transparent hover:border-gray-700/50 hover:bg-gray-800/30'}`}
        >
            {/* Bloco de Conteúdo */}
            <div className="w-full h-full bg-background-dark/50 backdrop-blur-md rounded-xl p-4 border border-gray-800/50">
                {renderBlockContent()}
            </div>

            {/* Dica Pedagógica Específica do Bloco */}
            {actualPreviewMode !== 'preview' && isActive && (
                <div className="mt-3 mx-2 p-3 bg-brand-blue/10 border border-brand-blue/30 rounded-lg flex items-start gap-3">
                    <span className="material-symbols-outlined text-brand-blue shrink-0 mt-0.5">tips_and_updates</span>
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                        <strong className="text-white uppercase tracking-wider block mb-1">Dica de Uso:</strong>
                        {getBlockTip(block.type)}
                    </p>
                </div>
            )}

            {/* Menu Contextual flutuante para reordenar/excluir (visível apenas quando ativo) */}
            {isActive && (
                <div className="absolute -right-2 -top-10 flex items-center gap-1 bg-gray-900 border border-gray-700/50 rounded-lg p-1.5 shadow-xl z-20">
                    <button 
                        onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                        className="p-1 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                        title="Mover para Cima"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                        className="p-1 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                        title="Mover para Baixo"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                    </button>
                    <div className="w-px h-4 bg-gray-700/50 mx-1"></div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                        className="p-1 hover:bg-brand-red/20 rounded-md text-gray-400 hover:text-brand-red transition-colors"
                        title="Excluir Bloco"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}
