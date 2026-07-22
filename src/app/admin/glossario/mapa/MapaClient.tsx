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


import React, { useCallback, useState, useEffect } from 'react';
import { 
    ReactFlow, 
    Controls, 
    Background, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge as flowAddEdge,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { updateNodePosition, addEdge, removeEdge } from '@/app/enviar/actions/glossaryActions';
import toast from 'react-hot-toast';

interface MapaClientProps {
    glossario: any[];
}

export default function MapaClient({ glossario }: MapaClientProps) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        // Inicializar nós a partir do glossário
        const initialNodes: Node[] = glossario.map((w: any) => ({
            id: w.id,
            position: { x: w.pos_x || 0, y: w.pos_y || 0 },
            data: { 
                label: (
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-brand-yellow uppercase tracking-widest text-[10px]">{w.termo}</span>
                    </div>
                )
            },
            style: {
                background: '#1E1E1E',
                color: '#fff',
                border: '1px solid rgba(255,204,0,0.5)',
                borderRadius: '8px',
                padding: '10px',
                width: 150,
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                cursor: 'grab'
            }
        }));

        // Inicializar arestas (edges)
        const initialEdges: Edge[] = [];
        glossario.forEach((w: any) => {
            if (w.edges && Array.isArray(w.edges)) {
                w.edges.forEach((e: any) => {
                    initialEdges.push({
                        id: e.id,
                        source: w.id,
                        target: e.target_id,
                        animated: true,
                        style: { stroke: 'rgba(255,204,0,0.5)', strokeWidth: 2 }
                    });
                });
            }
        });

        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [glossario]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        async (params: Connection) => {
            if (!params.source || !params.target) return;
            
            const toastId = toast.loading('Conectando palavras...');
            const res = await addEdge(params.source, params.target);
            if (res.success) {
                toast.success('Constelação conectada!', { id: toastId });
                setEdges((eds) => flowAddEdge({ ...params, animated: true, style: { stroke: 'rgba(255,204,0,0.5)', strokeWidth: 2 } }, eds));
            } else {
                toast.error('Erro ao conectar', { id: toastId });
            }
        },
        []
    );

    const onNodeDragStop = useCallback(
        async (event: any, node: Node) => {
            await updateNodePosition(node.id, node.position.x, node.position.y);
        },
        []
    );

    const onEdgesDelete = useCallback(
        async (deletedEdges: Edge[]) => {
            for (const edge of deletedEdges) {
                // Ignore temporary edges (reactflow local ids) if they somehow got here without db save
                if (!edge.id.includes('reactflow')) {
                    const toastId = toast.loading('Removendo conexão...');
                    await removeEdge(edge.id);
                    toast.success('Conexão removida', { id: toastId });
                }
            }
        },
        []
    );

    return (
        <div className="w-full h-[700px] border border-gray-800 rounded-xl overflow-hidden bg-[#0A0A0A] relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                onEdgesDelete={onEdgesDelete}
                fitView
                colorMode="dark"
            >
                <Background color="#333" gap={16} />
                <Controls className="bg-background-dark border border-gray-800 fill-white" />
            </ReactFlow>
            <div className="absolute top-4 left-4 bg-background-dark/80 backdrop-blur border border-white/10 p-4 rounded-xl max-w-sm pointer-events-none text-sm text-gray-300">
                <h3 className="font-bold text-white mb-2 uppercase tracking-widest text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-yellow">hub</span>
                    Construtor de Constelações
                </h3>
                <p>Arraste as palavras para organizar o universo semântico.</p>
                <p className="mt-1">Puxe uma linha da bolinha de uma palavra até outra para criar uma Constelação (conexão).</p>
                <p className="mt-1">Selecione uma linha e aperte Delete para remover a conexão.</p>
                <p className="mt-2 text-[10px] text-gray-500">*A posição é salva automaticamente ao soltar a palavra.</p>
            </div>
        </div>
    );
}
