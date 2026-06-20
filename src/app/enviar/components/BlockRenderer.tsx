import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
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

interface BlockRendererProps {
    block: Block;
    showPedagogicalTip?: boolean;
}

export function BlockRenderer({ block, showPedagogicalTip }: BlockRendererProps) {
    const { activeBlockId, setActiveBlock, removeBlock, moveBlock, previewMode } = useSubmissionStore();
    const isActive = activeBlockId === block.id;

    const handleWrapperClick = (e: React.MouseEvent) => {
        // Evitar que cliques dentro do bloco também fechem-no
        e.stopPropagation();
        if (!isActive && previewMode === 'edit') {
            setActiveBlock(block.id);
        }
    };

    const renderBlockContent = () => {
        switch (block.type) {
            case 'text': return <TextBlock block={block} isActive={isActive} />;
            case 'image': return <ImageBlock block={block} isActive={isActive} />;
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
            case 'context_political': return <ContextBlock block={block} isActive={isActive} />;
            case 'glossary': return null; // Deprecated as a standalone block, now a Modal tool
            default: return <div className="text-gray-400">Bloco não suportado: {block.type}</div>;
        }
    };

    return (
        <div 
            onClick={handleWrapperClick}
            className={`relative group mb-6 transition-all duration-300 rounded-2xl border p-1 
            ${isActive 
                ? 'border-brand-yellow/50 bg-gray-800/80 shadow-lg shadow-brand-yellow/5' 
                : 'border-transparent hover:border-gray-700/50 hover:bg-gray-800/30'}`}
        >
            {/* Bloco de Conteúdo */}
            <div className="w-full h-full bg-background-dark/50 backdrop-blur-md rounded-xl p-4 border border-gray-800/50">
                {renderBlockContent()}
            </div>

            {/* Lembrete Pedagógico */}
            {previewMode === 'edit' && showPedagogicalTip && (
                <div className="mt-3 mx-2 p-3 bg-brand-blue/10 border border-brand-blue/30 rounded-lg flex items-start gap-3">
                    <span className="material-symbols-outlined text-brand-blue shrink-0 mt-0.5">tips_and_updates</span>
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                        <strong className="text-white uppercase tracking-wider block mb-1">Dica de Comunicação Científica:</strong>
                        É recomendado adicionar um balão de <strong>Reflexão</strong>, <strong>Contexto</strong> ou <strong>Glossário</strong> logo após esta mídia para aumentar a interação e contextualização da leitura, instigando o raciocínio do público.
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
