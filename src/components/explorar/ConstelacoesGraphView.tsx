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


import React, { useState, useEffect } from 'react';
import { 
    ReactFlow, 
    Background, 
    Controls,
    Node,
    Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface GraphViewProps {
    glossario: any[];
}

export function ConstelacoesGraphView({ glossario }: GraphViewProps) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedWord, setSelectedWord] = useState<any | null>(null);

    useEffect(() => {
        const approvedWords = glossario.filter(w => !w.is_pending && !w.is_rejected);
        
        const initialNodes: Node[] = approvedWords.map((w: any) => ({
            id: w.id,
            position: { x: w.pos_x || Math.random() * 500, y: w.pos_y || Math.random() * 500 },
            data: { 
                label: (
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-brand-yellow uppercase tracking-widest text-xs">{w.termo}</span>
                    </div>
                ),
                wordData: w
            },
            style: {
                background: '#1E1E1E',
                color: '#fff',
                border: '2px solid rgba(255,204,0,0.5)',
                borderRadius: '50px', // Bolinhas
                padding: '10px 20px',
                minWidth: 100,
                boxShadow: '0 4px 15px rgba(255,204,0,0.2)',
                cursor: 'pointer'
            }
        }));

        const initialEdges: Edge[] = [];
        approvedWords.forEach((w: any) => {
            if (w.edges && Array.isArray(w.edges)) {
                w.edges.forEach((e: any) => {
                    initialEdges.push({
                        id: e.id,
                        source: w.id,
                        target: e.target_id,
                        animated: true,
                        style: { stroke: 'rgba(255,204,0,0.3)', strokeWidth: 2 }
                    });
                });
            }
        });

        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [glossario]);

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        setSelectedWord(node.data.wordData);
    };

    return (
        <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-gray-800 bg-[#0A0A0A] relative flex shadow-2xl">
            <div className="flex-1 h-full relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={onNodeClick}
                    fitView
                    nodesDraggable={true} // Pode arrastar só pra visualizar
                    nodesConnectable={false} // Não pode conectar
                    elementsSelectable={true}
                    colorMode="dark"
                >
                    <Background color="#222" gap={16} />
                    <Controls className="bg-black border border-gray-800 fill-white" />
                </ReactFlow>
            </div>
            
            {/* Painel Lateral com as Traduções ao clicar */}
            {selectedWord && (
                <div className="w-80 h-full bg-[#121212] border-l border-gray-800 p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-black uppercase text-brand-yellow tracking-widest">{selectedWord.termo}</h3>
                        <button onClick={() => setSelectedWord(null)} className="text-gray-500 hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-6">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Significado Acadêmico</span>
                        <p className="text-sm text-gray-300 leading-relaxed">{selectedWord.codificacao_academica}</p>
                    </div>

                    {selectedWord.signos_constelacoes?.filter((c: any) => !c.is_rejected && !c.is_pending).length > 0 && (
                        <div>
                            <h4 className="text-[11px] font-bold text-brand-blue uppercase tracking-widest mb-4">Traduções (Constelações)</h4>
                            <div className="flex flex-col gap-3">
                                {selectedWord.signos_constelacoes.filter((c: any) => !c.is_rejected && !c.is_pending).map((c: any) => (
                                    <div key={c.id} className="bg-brand-blue/5 p-4 rounded-xl border border-brand-blue/20">
                                        <span className="inline-block px-2 py-0.5 bg-brand-blue/20 text-brand-blue text-[10px] font-black uppercase rounded mb-2">
                                            {c.constelacao}
                                        </span>
                                        <p className="text-sm text-gray-400 italic">"{c.descodificacao}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
