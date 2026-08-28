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
import { fetchUserAcademicdata } from '@/app/actions/disciplines';
import { 
    X, Eye, Edit3, ChevronLeft, ChevronRight, Search, Plus, Trash2, Info, Loader2, BookOpen, 
    GraduationCap, CalendarDays, FileText, Table, Calendar, MessageSquareCode, Share2,
    RefreshCw, Undo2, Settings, ChevronDown, CalendarX, Bell
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import * as CalendarActions from '@/app/actions/calendar';
import { resetUserAcademicData } from '@/app/actions/calendar';
import { SubjectSelectorModal } from './SubjectSelectorModal';
import { BlockDetailsModal, BlockFormData } from './BlockDetailsModal';
import { JupiterSyncModal } from './JupiterSyncModal';
import { AbsencesModal } from './AbsencesModal';
import { CustomEventModal } from './CustomEventModal';

interface CalendarEvent {
    id: string;
    title: string;
    start: any;
    end: any;
    color?: string;
    extendedProps?: any;
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
}

const DISCIPLINE_COLORS = [
    { bg: '#3B82F6', border: '#2563EB', name: 'blue' },
    { bg: '#06B6D4', border: '#0891B2', name: 'cyan' },
    { bg: '#EAB308', border: '#CA8A04', name: 'yellow' },
    { bg: '#F97316', border: '#EA580C', name: 'orange' },
    { bg: '#EF4444', border: '#DC2626', name: 'red' },
];

const getStableColor = (id: string, title?: string) => {
    // Standardize seed: Always use the most unique ID available.
    // For academic: trial_id or code. For custom: block_id.
    const seed = id || title || 'default';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const colorIndex = Math.abs(hash) % DISCIPLINE_COLORS.length;
    return DISCIPLINE_COLORS[colorIndex];
};

const fixEncoding = (text: string) => {
    if (!text) return '';
    try {
        // If the text looks like Mojibake (contains specific corrupted patterns)
        // we convert it back to bytes and decode as UTF-8
        if (text.includes('Ã')) {
            const bytes = new Uint8Array(text.split('').map(c => c.charCodeAt(0)));
            return new TextDecoder('utf-8').decode(bytes);
        }
        return text;
    } catch (e) {
        return text;
    }
};

const formatEventWithRecurrence = (e: any): CalendarEvent => {
    const isRecurring = e.extendedProps?.type === 'aula' || e.extendedProps?.type === 'estudo';
    const startDate = new Date(e.start);
    const endDate = e.end ? new Date(e.end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    return {
        ...e,
        color: e.color || getStableColor(e.extendedProps?.sourceId || e.id, e.title).bg,
        ...(isRecurring ? {
            daysOfWeek: [startDate.getDay()],
            startTime: startDate.getHours().toString().padStart(2, '0') + ':' + startDate.getMinutes().toString().padStart(2, '0'),
            endTime: endDate.getHours().toString().padStart(2, '0') + ':' + endDate.getMinutes().toString().padStart(2, '0'),
        } : {})
    };
};

export default function FerramentasClient({ profile }: { profile: any }) {
    const [academicData, setAcademicData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [history, setHistory] = useState<CalendarEvent[][]>([]);
    const [customBlocks, setCustomBlocks] = useState<{id: string, title: string, duration: number}[]>([]);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [selectedBlockForModal, setSelectedBlockForModal] = useState<BlockFormData | null>(null);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isJupiterModalOpen, setIsJupiterModalOpen] = useState(false);
    const [isAbsencesModalOpen, setIsAbsencesModalOpen] = useState(false);
    const [isCustomEventModalOpen, setIsCustomEventModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [calendarStart, setCalendarStart] = useState('08:00');
    const [calendarEnd, setCalendarEnd] = useState('23:00');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [clipboard, setClipboard] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'view' | 'edit'>('edit');
    const [isMobile, setIsMobile] = useState(false);
    const [selectedBlockToAdd, setSelectedBlockToAdd] = useState<any>(null);
    const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const draggableRef = React.useRef<any>(null);
    const calendarRef = React.useRef<any>(null);
    const enrollmentListRef = React.useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const origStart = calendarStart;
        const origEnd = calendarEnd;

        let minH = 24;
        let maxH = 0;
        
        events.forEach(e => {
            const startH = new Date(e.start).getHours();
            if (startH < minH) minH = startH;
            
            let endH = startH;
            if (e.end) {
                endH = new Date(e.end).getHours();
                const endM = new Date(e.end).getMinutes();
                if (endM > 0) endH++; 
            } else {
                endH = startH + 2; 
            }
            if (endH > maxH) maxH = endH;
        });

        if (events.length === 0) {
            minH = 8;
            maxH = 18;
        }

        const paddedMin = Math.max(0, minH - 1);
        const paddedMax = Math.min(24, maxH + 1);

        setCalendarStart(`${paddedMin.toString().padStart(2, '0')}:00`);
        setCalendarEnd(`${paddedMax.toString().padStart(2, '0')}:00`);
        setIsExportModalOpen(false);

        // Wait to render
        setTimeout(() => {
            window.print();
            // Restore original settings after print dialog closes
            setTimeout(() => {
                setCalendarStart(origStart);
                setCalendarEnd(origEnd);
            }, 1000);
        }, 800);
    };

    const saveToHistory = () => {
        setHistory(prev => [JSON.parse(JSON.stringify(events)), ...prev].slice(0, 10));
    };

    const handleUndo = async () => {
        if (history.length === 0) return;
        
        const prevState = history[0];
        const currentState = [...events];
        setHistory(prev => prev.slice(1));

        // Visual Undo
        setEvents(prevState);
        
        toast.promise(
            (async () => {
                const prevIds = new Set(prevState.map(e => e.id));
                const currentIds = new Set(currentState.map(e => e.id));

                const toReinsert = prevState.filter(e => !currentIds.has(e.id));
                const toDelete = currentState.filter(e => !prevIds.has(e.id));
                const toRevert = prevState.filter(pe => {
                    const ce = currentState.find(c => c.id === pe.id);
                    return ce && (ce.start !== pe.start || ce.end !== pe.end);
                });

                const syncPromises = [];
                for (const event of toReinsert) syncPromises.push(CalendarActions.upsertCalendarEvent(event));
                for (const event of toDelete) syncPromises.push(CalendarActions.deleteCalendarEvent(event.id));
                for (const event of toRevert) syncPromises.push(CalendarActions.upsertCalendarEvent(event));

                await Promise.all(syncPromises);
            })(),
            {
                loading: 'Desfazendo alteração...',
                success: 'Alteração desfeita!',
                error: 'Erro ao sincronizar no servidor'
            }
        );
    };

    useEffect(() => {
        const handleKeys = async (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

            // Delete / Backspace
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEventIds.length > 0) {
                saveToHistory();
                const toDelete = [...selectedEventIds];
                setEvents(prev => prev.filter(ev => !toDelete.includes(ev.id)));
                setSelectedEventIds([]);
                await Promise.all(toDelete.map(id => CalendarActions.deleteCalendarEvent(id)));
                toast.success(`${toDelete.length > 1 ? toDelete.length + ' eventos removidos' : 'Evento removido'}`);
                return;
            }

            // Ctrl + C (Copy)
            if (e.ctrlKey && e.key.toLowerCase() === 'c' && selectedEventIds.length > 0) {
                setClipboard([...selectedEventIds]);
                toast.success(`${selectedEventIds.length > 1 ? selectedEventIds.length + ' eventos copiados' : 'Evento copiado'}`);
                return;
            }

            // Ctrl + V (Paste)
            if (e.ctrlKey && e.key.toLowerCase() === 'v' && clipboard.length > 0) {
                saveToHistory();
                const toDuplicate = events.filter(ev => clipboard.includes(ev.id));
                if (toDuplicate.length === 0) return;

                const newEvents: CalendarEvent[] = toDuplicate.map(ev => ({
                    ...ev,
                    id: Math.random().toString(), // Temp ID
                    title: `${ev.title} (Cópia)`
                }));

                setEvents(prev => [...prev, ...newEvents]);
                
                toast.promise(
                    Promise.all(newEvents.map(async (ev) => {
                        const res = await CalendarActions.upsertCalendarEvent(ev);
                        if (res.success && res.data) {
                            setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, id: res.data.id } : e));
                        }
                    })),
                    {
                        loading: 'Duplicando eventos...',
                        success: 'Eventos duplicados!',
                        error: 'Erro ao duplicar'
                    }
                );
                return;
            }

            // Ctrl + Z (Undo)
            if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                handleUndo();
            }
        };

        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [selectedEventIds, events, clipboard, history]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAddTurma = async (subject: any, turma: any) => {
        const DOW_MAP: Record<string, number> = {
            'dom': 0, 'seg': 1, 'ter': 2, 'qua': 3, 'qui': 4, 'sex': 5, 'sab': 6, 'sáb': 6
        };
        const today = new Date();
        const currentDay = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay);
        startOfWeek.setHours(0,0,0,0);

        const newEvents: CalendarEvent[] = [];
        let addedCount = 0;

        for (const h of turma.horarios) {
            const parts = h.toLowerCase().split(' ');
            if (parts.length >= 3) {
                const dayStr = parts[0];
                const startStr = parts[1];
                const endStr = parts[2];

                const dow = DOW_MAP[dayStr] ?? 1;
                const eventDate = new Date(startOfWeek);
                eventDate.setDate(startOfWeek.getDate() + dow);
                
                const startDateStr = `${eventDate.toISOString().split('T')[0]}T${startStr}:00`;
                const endDateStr = `${eventDate.toISOString().split('T')[0]}T${endStr}:00`;

                const seed = subject.codigo;
                let hash = 0;
                for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
                const colors = ['#3B82F6', '#EF4444', '#EAB308'];
                const color = colors[Math.abs(hash) % colors.length];

                const tempId = Math.random().toString();
                const durationHours = (new Date(endDateStr).getTime() - new Date(startDateStr).getTime()) / 3600000;
                
                const baseEvent = {
                    id: tempId,
                    title: subject.nome || subject.codigo,
                    start: startDateStr,
                    end: endDateStr,
                    color: color,
                    extendedProps: { type: 'aula', sourceId: subject.codigo, duration: durationHours.toString() }
                };
                const event = formatEventWithRecurrence(baseEvent);
                newEvents.push(event);
                addedCount++;

                // Add 1:1 study block (8h-22h)
                const durationMs = new Date(endDateStr).getTime() - new Date(startDateStr).getTime();
                const { start: studyStart, end: studyEnd } = calculateStudyTime(endDateStr, durationMs);
                
                const studyEvent = {
                    id: Math.random().toString(),
                    title: `📚 Estudo: ${subject.nome || subject.codigo}`,
                    start: studyStart,
                    end: studyEnd,
                    color: '#10B981',
                    extendedProps: { type: 'estudo', sourceId: subject.codigo, duration: (durationMs / 3600000).toString() }
                };
                newEvents.push(studyEvent);
            }
        }

        if (addedCount === 0) {
            toast.error('Nenhum horário válido encontrado na turma.');
            return;
        }

        setEvents(prev => [...prev, ...newEvents]);
        setIsSubjectModalOpen(false);
        toast.success(`Turma ${turma.codigo} de ${subject.codigo} adicionada à grade!`);

        for (const event of newEvents) {
            const res = await CalendarActions.upsertCalendarEvent(event);
            if (res.success && res.data) {
                 setEvents(prev => prev.map(e => e.id === event.id ? { ...e, id: res.data.id } : e));
            }
        }
    };

    const handleRemoveTurma = async (subjectCode: string) => {
        const toDelete = events.filter(e => e.extendedProps?.sourceId === subjectCode);
        if (toDelete.length === 0) return;

        setEvents(prev => prev.filter(e => e.extendedProps?.sourceId !== subjectCode));
        toast.success(`${subjectCode} removida da grade.`);

        const promises = toDelete.map(e => CalendarActions.deleteCalendarEvent(e.id));
        await Promise.all(promises);
    };

    const handleDeleteEvent = async (eventId: string) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setSelectedEventIds(prev => prev.filter(id => id !== eventId));
        toast.success('Evento removido!');
        await CalendarActions.deleteCalendarEvent(eventId);
    };

    const toggleCursando = async (e: React.MouseEvent, trailId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (isUpdating) return;
        setIsUpdating(trailId);

        try {
            const { error } = await supabase.rpc('toggle_trail_status', {
                p_trail_id: trailId,
                p_status: 'cursando'
            });

            if (error) throw error;

            toast('Removida do radar atual', { icon: '📡' });
            
            // Update local state
            setAcademicData((prev: any) => ({
                ...prev,
                inProgress: prev.inProgress.filter((p: any) => p.trail_id !== trailId)
            }));
            
        } catch (err) {
            console.error(err);
            toast.error('Erro ao atualizar radar');
        } finally {
            setIsUpdating(null);
        }
    };

    const calculateStudyTime = (endDateStr: string, durationMs: number) => {
        const bufferOffset = 3600000; // 1 hour buffer
        const studyStart = new Date(new Date(endDateStr).getTime() + bufferOffset);
        let studyEnd = new Date(studyStart.getTime() + durationMs);

        const startHour = 8;
        // Move to next day 08:00 if the study block would end after 22:30
        // (Assuming the user's calendar view ends at 23:00)
        const endsTooLate = studyEnd.getHours() >= 23 || (studyEnd.getHours() === 22 && studyEnd.getMinutes() > 30) || (studyEnd.getDate() !== studyStart.getDate());

        if (endsTooLate) {
            // Move to next day 08:00
            studyStart.setDate(studyStart.getDate() + 1);
            studyStart.setHours(startHour, 0, 0, 0);
            studyEnd = new Date(studyStart.getTime() + durationMs);
        }

        return {
            start: studyStart.toISOString(),
            end: studyEnd.toISOString()
        };
    };

    const handleReset = async () => {
        if (!confirm('🚨 ATENÇÃO: Isso apagará permanentemente todos os seus eventos da grade e blocos customizados. Deseja continuar?')) {
            return;
        }
        saveToHistory();

        setIsResetting(true);
        try {
            const res = await resetUserAcademicData();
            if (res.success) {
                // Fetch fresh data instead of reloading
                const eventsRes = await CalendarActions.getCalendarEvents();
                if (eventsRes.success && eventsRes.data) {
                    setEvents(eventsRes.data.map(formatEventWithRecurrence));
                }
                
                toast.success('Grade resetada! Suas aulas oficiais foram mantidas.');
            } else {
                toast.error(res.error || 'Erro ao resetar dados.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Erro crítico ao resetar dados.');
        } finally {
            setIsResetting(false);
        }
    };

    const handleAutoGenerateStudy = async () => {
        saveToHistory();
        setIsUpdating('auto-study');
        let generated = 0;
        const newEvents: CalendarEvent[] = [];

        for (const event of events) {
            if (event.extendedProps?.type === 'aula' || event.extendedProps?.type === 'custom') {
                const durationMs = new Date(event.end).getTime() - new Date(event.start).getTime();
                const { start: studyStart, end: studyEnd } = calculateStudyTime(event.end, durationMs);
                
                const cleanTitle = event.title.replace('🎓 Aula: ', '');
                const titleParts = cleanTitle.split(' - ');
                const subjectName = titleParts.length > 1 ? titleParts[1].trim() : titleParts[0].trim();
                const studyTitle = `📚 Estudo: ${subjectName}`;

                const alreadyExists = events.find(e => 
                    e.extendedProps?.type === 'estudo' && 
                    (event.extendedProps?.sourceId 
                        ? e.extendedProps?.sourceId === event.extendedProps?.sourceId 
                        : e.title === studyTitle) && 
                    Math.abs(new Date(e.start).getTime() - new Date(studyStart).getTime()) < 60000
                );

                if (!alreadyExists) {
                    const studyEvent: CalendarEvent = {
                        id: Math.random().toString(),
                        title: studyTitle,
                        start: studyStart,
                        end: studyEnd,
                        color: '#10B981',
                        extendedProps: { type: 'estudo', sourceId: event.extendedProps.sourceId, duration: (durationMs / 3600000).toString() }
                    };
                    newEvents.push(studyEvent);
                    generated++;
                }
            }
        }

        if (generated > 0) {
            setEvents(prev => [...prev, ...newEvents]);
            for (const sem of newEvents) {
                await CalendarActions.upsertCalendarEvent(sem);
            }
            const disciplinesNames = Array.from(new Set(newEvents.map(e => e.title.replace('📚 Estudo: ', ''))));
            toast.success(`${generated} blocos gerados para: ${disciplinesNames.join(', ')}`);
        } else {
            toast('Todos os blocos de estudo já estão na grade.', { icon: '✨' });
        }
        setIsUpdating(null);
    };


    const [isOfflineLoaded, setIsOfflineLoaded] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        let hasCache = false;

        // 1. Tenta carregar dados do cache local (Instant/Offline Fallback)
        try {
            const cachedEvents = localStorage.getItem('hub_offline_events');
            const cachedAcademic = localStorage.getItem('hub_offline_academic');
            const cachedBlocks = localStorage.getItem('hub_offline_custom_blocks');

            if (cachedEvents) {
                const parsed = JSON.parse(cachedEvents);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setEvents(parsed.map(formatEventWithRecurrence));
                    hasCache = true;
                }
            }
            if (cachedAcademic) {
                setAcademicData(JSON.parse(cachedAcademic));
                hasCache = true;
            }
            if (cachedBlocks) {
                setCustomBlocks(JSON.parse(cachedBlocks));
                hasCache = true;
            }

            if (hasCache) {
                setIsLoading(false);
                setIsOfflineLoaded(true);
            }
        } catch (e) {
            console.error('Erro ao ler cache do localStorage:', e);
        }

        // 2. Busca dados atualizados da rede (Online Sync)
        try {
            const academicRes = await fetchUserAcademicdata().catch(() => null);
            const calendarRes = await CalendarActions.getCalendarEvents().catch(() => null);
            const blocksRes = await CalendarActions.getCustomBlocks().catch(() => null);

            if (academicRes && 'success' in academicRes && academicRes.success && 'data' in academicRes && academicRes.data) {
                setAcademicData(academicRes.data);
                try {
                    localStorage.setItem('hub_offline_academic', JSON.stringify(academicRes.data));
                } catch (e) {}
            }

            if (calendarRes && 'success' in calendarRes && calendarRes.success && 'data' in calendarRes && calendarRes.data) {
                const verifiedEvents = (calendarRes.data as any[]).map(formatEventWithRecurrence);
                setEvents(verifiedEvents);
                try {
                    localStorage.setItem('hub_offline_events', JSON.stringify(calendarRes.data));
                } catch (e) {}
            }

            if (blocksRes && 'success' in blocksRes && blocksRes.success && 'data' in blocksRes && blocksRes.data) {
                setCustomBlocks(blocksRes.data as any);
                try {
                    localStorage.setItem('hub_offline_custom_blocks', JSON.stringify(blocksRes.data));
                } catch (e) {}
            }

            setIsOfflineLoaded(false);
        } catch (err) {
            console.warn('⚡ Modo Offline ativo. Grade horária exibida a partir da memória do dispositivo.', err);
            if (hasCache) {
                toast('Modo Offline: exibindo sua grade horária salva.', {
                    icon: '📡',
                    id: 'offline-grade-notice',
                    duration: 5000,
                    style: { background: '#1E1E1E', color: '#FFCC00', border: '1px solid #333' }
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Atualiza automaticamente o cache local sempre que a grade/eventos mudarem
    useEffect(() => {
        if (events && events.length > 0) {
            try {
                localStorage.setItem('hub_offline_events', JSON.stringify(events));
            } catch (e) {}
        }
    }, [events]);

    useEffect(() => {
        if (academicData) {
            try {
                localStorage.setItem('hub_offline_academic', JSON.stringify(academicData));
            } catch (e) {}
        }
    }, [academicData]);

    useEffect(() => {
        loadData();
    }, []);


    if (isLoading) {
        return (
            <div className="flex flex-col gap-8 animate-pulse p-6">
                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-white/5 rounded-[32px]" />
                    ))}
                </div>
                
                {/* Actions Skeleton */}
                <div className="flex gap-3 py-4">
                    <div className="h-12 w-32 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                    <div className="h-12 w-48 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                    <div className="h-12 w-40 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                </div>

                {/* Main Content Skeleton */}
                <div className="bg-gray-200 dark:bg-white/5 h-[600px] rounded-[40px]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 print:space-y-0 print:animate-none">
            <style jsx global>{`
                .fc { --fc-border-color: rgba(var(--brand-blue-rgb), 0.1); }
                .dark .fc { --fc-border-color: rgba(255, 255, 255, 0.03); }
                
                .fc-theme-standard .fc-scrollgrid { 
                    border: 0 !important; 
                }
                .fc-theme-standard td, .fc-theme-standard th {
                    border: 0 !important;
                }
                /* Re-enable major slot borders (solid) and minor (dashed via gradient) */
                .fc-timegrid-slots td {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
                }
                .fc-timegrid-slot-minor {
                    border-bottom: 0 !important;
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.15) 50%, transparent 50%) !important;
                    background-position: bottom !important;
                    background-size: 6px 1px !important;
                    background-repeat: repeat-x !important;
                }
                .fc-toolbar-chunk .fc-button {
                    border-radius: 9999px !important;
                    text-transform: lowercase !important;
                    font-weight: 800 !important;
                    padding: 8px 20px !important;
                    background-color: rgba(15, 71, 128, 0.1) !important;
                    border: 1px solid rgba(15, 71, 128, 0.2) !important;
                    color: #0F4780 !important;
                    margin: 0 6px !important;
                    transition: all 0.2s;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                .fc-toolbar-chunk .fc-button:hover, .fc-button-active {
                    background-color: #0F4780 !important;
                    color: white !important;
                }
                .fc-toolbar-title {
                    margin: 0 32px !important;
                    font-weight: 900 !important;
                    font-size: 1.25rem !important;
                }
                
                /* 🏆 Premium Dot Resizer: Only at the bottom */
                .fc-event-resizer {
                    width: 100% !important;
                    height: 12px !important;
                    background: transparent !important;
                    border: 0 !important;
                    box-shadow: none !important;
                    opacity: 1 !important;
                    right: 0 !important;
                    left: 0 !important;
                    bottom: -2px !important;
                    z-index: 50 !important;
                    cursor: ns-resize !important;
                }

                .fc-event-resizer-y-top {
                    display: none !important;
                }
                
                .fc-v-event {
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .fc-event-selected, .fc-event:active {
                    z-index: 100 !important;
                    transform: scale(1.02);
                }
                
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .fc .fc-timegrid-slot { height: 4em !important; }
                .fc-timegrid-slot-label { border-bottom: 0 !important; }
                
                .fc-v-event { 
                    border: 0 !important; 
                    border-radius: 12px !important; 
                    padding: 4px !important; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                    background-image: linear-gradient(135deg, rgba(255,255,255,0.2), transparent) !important;
                }
                .dark .fc-v-event {
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
                    background-image: linear-gradient(135deg, rgba(255,255,255,0.1), transparent) !important;
                }

                .fc-v-event .fc-event-main { 
                    color: white !important; 
                    font-weight: 800 !important; 
                    font-size: 7px !important;
                    text-transform: uppercase;
                    line-height: 1.0;
                    letter-spacing: -0.02em;
                    padding: 2px 4px !important;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                
                .fc-timegrid-axis-cushion, .fc-timegrid-slot-label-cushion { 
                    color: rgba(0, 0, 0, 0.4) !important; 
                    font-weight: 900 !important; 
                    font-size: 9px !important; 
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em;
                }
                .dark .fc-timegrid-axis-cushion, .dark .fc-timegrid-slot-label-cushion {
                    color: rgba(255, 255, 255, 0.2) !important;
                }

                .fc-col-header-cell, .fc-timegrid-axis, .fc-scrollgrid, .fc-theme-standard th {
                    background-color: transparent !important;
                    background: transparent !important;
                    border: 0 !important;
                }
                .dark .fc-col-header-cell, .dark .fc-timegrid-axis, .dark .fc-scrollgrid, .dark .fc-theme-standard th {
                    background-color: transparent !important;
                    background: transparent !important;
                    border: 0 !important;
                }

                .fc-col-header-cell-cushion { 
                    font-weight: 900 !important; 
                    font-size: 11px !important; 
                    text-transform: uppercase !important; 
                    letter-spacing: 0.1em !important; 
                    padding: 16px 0 !important; 
                    text-decoration: none !important;
                }
                
                .fc-day-sun .fc-col-header-cell-cushion { color: #888 !important; }
                .fc-day-mon .fc-col-header-cell-cushion, .fc-day-thu .fc-col-header-cell-cushion { color: #3b82f6 !important; }
                .fc-day-tue .fc-col-header-cell-cushion, .fc-day-fri .fc-col-header-cell-cushion { color: #ef4444 !important; }
                .fc-day-wed .fc-col-header-cell-cushion, .fc-day-sat .fc-col-header-cell-cushion { color: #eab308 !important; }

                .fc-timegrid-col.fc-day-sun, .fc-timegrid-col.fc-day-mon, .fc-timegrid-col.fc-day-thu { background-color: rgba(59, 130, 246, 0.25) !important; }
                .fc-timegrid-col.fc-day-tue, .fc-timegrid-col.fc-day-fri { background-color: rgba(239, 68, 68, 0.25) !important; }
                .fc-timegrid-col.fc-day-wed, .fc-timegrid-col.fc-day-sat { background-color: rgba(234, 179, 8, 0.25) !important; }

                .dark .fc-timegrid-col.fc-day-sun, .dark .fc-timegrid-col.fc-day-mon, .dark .fc-timegrid-col.fc-day-thu { background-color: rgba(59, 130, 246, 0.1) !important; }
                .dark .fc-timegrid-col.fc-day-tue, .dark .fc-timegrid-col.fc-day-fri { background-color: rgba(239, 68, 68, 0.1) !important; }
                .dark .fc-timegrid-col.fc-day-wed, .dark .fc-timegrid-col.fc-day-sat { background-color: rgba(234, 179, 8, 0.1) !important; }

                .fc-timegrid-now-indicator-line { border-color: #3b82f6 !important; border-width: 2px !important; opacity: 0.5; }
                .fc-timegrid-now-indicator-arrow { border-left-color: #3b82f6 !important; border-right-color: #3b82f6 !important; }
                .fc-scrollgrid { border: 0 !important; }
                .fc-timegrid-col.fc-day-today { background: rgba(59, 130, 246, 0.05) !important; }

                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    @page {
                        size: A4 landscape;
                        margin: 1cm;
                    }
                    html, body {
                        width: 100% !important;
                        background: white !important; 
                        color: black !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    nav, aside, footer, header, .print\:hidden, .fc-header-toolbar, 
                    .bg-gradient-to-br, .enrollment-section, #enrollment-list-container,
                    .glass-card > div > div:first-child,
                    button {
                        display: none !important;
                    }
                    /* Remove limitations do Modal do Cronograma para não cortar nas bordas */
                    .fixed.inset-0.z-\[100\] { position: relative !important; inset: auto !important; }
                    .absolute.inset-0.bg-background-dark\/80 { display: none !important; }
                    .relative.bg-\[\#1e1e1e\] { max-height: none !important; height: auto !important; overflow: visible !important; border: none !important; padding: 0 !important; box-shadow: none !important; margin: 0 !important; max-width: 100% !important; background: white !important; }
                    
                    .glass-card { background: white !important; border: 0 !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; }
                    .fc { background: white !important; height: auto !important; }
                    
                    /* Remove the forced white/gray backgrounds on events so their actual color shines through */
                    .fc-v-event { box-shadow: none !important; border: 1px solid rgba(0,0,0,0.1) !important; }
                    .fc-event-main { color: white !important; text-shadow: none !important; }
                    
                    .fc-col-header-cell-cushion, .fc-timegrid-axis-cushion, .fc-timegrid-slot-label-cushion { color: #333 !important; }
                    .main-content-layout { padding: 0 !important; margin: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important;}
                    .calendar-container { width: 100% !important; height: auto !important; overflow: visible !important; border: none !important; padding: 0 !important; background: white !important; zoom: 0.82; }
                    .fc-scroller { overflow: visible !important; height: auto !important; }
                    
                    #grade-horaria-actions { display: none !important; }
                }
            `}</style>

            <header className="flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
                <div className="space-y-2">
                    <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Grade <span className="text-brand-blue">Horária</span>
                    </h1>
                    <p className="text-gray-400 font-medium italic">Seu cockpit de navegação pelo IFUSP.</p>
                </div>

            </header>

            {/* Action Buttons - Premium Refined Layout */}
            <div id="grade-horaria-actions" data-tour="ferramentas-actions" className="flex flex-wrap items-center gap-3 py-4 border-t border-gray-100 dark:border-white/5">
                <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all disabled:opacity-50 shadow-sm group"
                    title="Resetar todos os dados de estudos"
                >
                    {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="inline">Resetar Grade</span>
                </button>
                <button
                    onClick={handleAutoGenerateStudy}
                    disabled={isUpdating === 'auto-study'}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-yellow hover:text-white transition-all disabled:opacity-50 shadow-sm group"
                    title="Gerar 1h de estudo para cada 1h de aula na grade"
                >
                    {isUpdating === 'auto-study' ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="inline">Gerar Estudos (1:1)</span>
                </button>
                <button
                    onClick={() => setIsJupiterModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50 shadow-sm group"
                    title="Sincronizar com sistema USP"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="inline">Sincronizar Júpiter</span>
                </button>
                <button
                    onClick={() => setIsAbsencesModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all disabled:opacity-50 shadow-sm group cursor-pointer"
                    title="Gerenciar e controlar faltas das disciplinas"
                >
                    <CalendarX className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="inline">Controle de Faltas</span>
                </button>
                <button
                    onClick={() => setIsCustomEventModalOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50 shadow-sm group cursor-pointer"
                    title="Adicionar Novo Evento ou Lembrete (Saúde, Lazer, Provas, Trabalho)"
                >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="inline">Novo Evento</span>
                </button>
            </div>


            <div className="bg-transparent min-h-[600px] rounded-[40px] overflow-hidden">
                <div className="p-8 h-full flex flex-col gap-12">
                    <div id="enrollment-drop-zone" className={`space-y-6 enrollment-section print:hidden transition-all duration-500 overflow-hidden ${viewMode === 'view' ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[2000px] opacity-100'}`}>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase text-brand-blue tracking-widest flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Turmas disponíveis
                            </h4>
                            <div className="flex items-center gap-4">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:block">
                                    Arraste os blocos abaixo para o cronograma
                                </p>
                                <button
                                    onClick={() => setIsSubjectModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#00A3FF]/10 text-[#00A3FF] border border-[#00A3FF]/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00A3FF] hover:text-white transition-all shrink-0"
                                >
                                    <Search className="w-3 h-3" />
                                    Buscar Turmas
                                </button>
                            </div>
                        </div>
                        
                        <div className="relative group/scroll">
                            <button
                                onClick={() => enrollmentListRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-10 p-2 bg-white dark:bg-card-dark rounded-full shadow-lg border border-gray-200 dark:border-gray-800 text-brand-blue transition-opacity flex"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => enrollmentListRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-10 p-2 bg-white dark:bg-card-dark rounded-full shadow-lg border border-gray-200 dark:border-gray-800 text-brand-blue transition-opacity flex"
                            >
                                <ChevronRight size={20} />
                            </button>
                            <div id="enrollment-list" ref={enrollmentListRef} className="flex flex-row overflow-x-auto snap-x gap-4 pb-4 scrollbar-hide scroll-smooth relative px-8 sm:px-0">
                                {customBlocks.map((block) => {
                                    const colorData = getStableColor(block.id, block.title);
                                    return (
                                        <div key={block.id} className="space-y-2 snap-start">
                                            <div 
                                                onClick={() => {
                                                    if (isMobile) {
                                                        if (selectedBlockToAdd?.id === block.id) {
                                                            setSelectedBlockToAdd(null);
                                                        } else {
                                                            const colorData = getStableColor(block.id, block.title);
                                                            setSelectedBlockToAdd({
                                                                id: Math.random().toString(),
                                                                title: block.title,
                                                                type: 'custom',
                                                                color: colorData.bg,
                                                                extendedProps: { code: null, type: 'custom', sourceId: block.id, trail_id: null, duration: block.duration.toString() }
                                                            });
                                                        }
                                                    }
                                                }}
                                                data-title={block.title}
                                                data-type="custom"
                                                data-id={block.id}
                                                data-color={colorData.bg}
                                                data-duration={block.duration.toString()}
                                                className={`group draggable-item p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing shadow-lg relative print:hidden sm:min-w-0 min-w-[240px] ${selectedBlockToAdd?.extendedProps?.sourceId === block.id ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : ''}`}
                                                style={{ 
                                                    borderLeft: `6px solid ${colorData.bg}`,
                                                    backgroundColor: `${colorData.bg}40`,
                                                    borderColor: `${colorData.bg}30`
                                                }}
                                            >
                                                <div className="text-[10px] font-black uppercase mb-1" style={{ color: colorData.bg }}>Customizado</div>
                                                <div className="text-xs font-bold text-gray-800 dark:text-white line-clamp-1">{fixEncoding(block.title)}</div>
                                                <div className="mt-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                                    Duração: {block.duration}h
                                                </div>

                                                {viewMode === 'edit' && (
                                                    <button
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            const res = await CalendarActions.deleteCustomBlock(block.id);
                                                            if (res.success) {
                                                                setCustomBlocks(prev => prev.filter(b => b.id !== block.id));
                                                                toast.success('Bloco removido');
                                                            } else {
                                                                toast.error('Erro ao remover bloco');
                                                            }
                                                        }}
                                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-brand-red/10 text-brand-red opacity-0 group-hover:opacity-100 hover:bg-brand-red hover:text-white transition-all"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {academicData?.inProgress?.length > 0 ? (
                                    academicData.inProgress.map((p: any) => {
                                        const seed = p.trail_id || p.course_code || p.id;
                                        const colorData = getStableColor(seed, p.learning_trails?.title);
                                        return (
                                            <div key={p.id} className="space-y-2 snap-start">
                                                <div 
                                                    onClick={() => {
                                                        if (isMobile) {
                                                            if (selectedBlockToAdd?.extendedProps?.sourceId === seed && selectedBlockToAdd?.extendedProps?.type === 'aula') {
                                                                setSelectedBlockToAdd(null);
                                                            } else {
                                                                setSelectedBlockToAdd({
                                                                    id: Math.random().toString(),
                                                                    title: `🎓 Aula: ${p.learning_trails?.title}`,
                                                                    type: 'aula',
                                                                    color: colorData.bg,
                                                                    extendedProps: { code: p.course_code, type: 'aula', sourceId: seed, trail_id: seed, duration: "02:00" }
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    data-title={p.learning_trails?.title}
                                                    data-code={p.course_code}
                                                    data-type="aula"
                                                    data-id={seed}
                                                    data-duration="02:00"
                                                    className={`group draggable-item p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing shadow-sm relative overflow-hidden print:hidden sm:min-w-0 min-w-[240px] ${selectedBlockToAdd?.extendedProps?.sourceId === seed && selectedBlockToAdd?.extendedProps?.type === 'aula' ? 'ring-2 ring-offset-2 ring-offset-black ring-white' : ''}`}
                                                    style={{ 
                                                        borderLeft: `6px solid ${colorData.bg}`,
                                                        backgroundColor: `${colorData.bg}40`,
                                                        borderColor: `${colorData.bg}30`
                                                    }}
                                                >
                                                    <div className="text-[10px] font-black uppercase mb-1" style={{ color: colorData.bg }}>{p.course_code || 'IFUSP'}</div>
                                                    <div className="text-xs font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-brand-blue transition-colors">
                                                        {fixEncoding(p.learning_trails?.title) || 'Disciplina'}
                                                    </div>
                                                    <div className="mt-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                                        Bloco: Aula
                                                    </div>

                                                    <button
                                                        onClick={(e) => toggleCursando(e, p.trail_id)}
                                                        disabled={isUpdating === p.trail_id}
                                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-brand-red/10 text-brand-red opacity-0 group-hover:opacity-100 hover:bg-brand-red hover:text-white transition-all disabled:opacity-50"
                                                        title="Remover matrícula"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                                <div 
                                                    onClick={() => {
                                                        setSelectedBlockForModal({
                                                            title: `📚 Estudo: ${p.learning_trails?.title}`,
                                                            type: 'estudo',
                                                            sourceId: seed,
                                                            daysOfWeek: [],
                                                            startTime: '10:00',
                                                            endTime: '12:00',
                                                            color: colorData.bg
                                                        });
                                                        setIsBlockModalOpen(true);
                                                    }}
                                                    data-title={p.learning_trails?.title}
                                                    data-code={p.course_code}
                                                    data-type="estudo"
                                                    data-id={seed}
                                                    data-duration="02:00"
                                                    className={`p-3 bg-gray-200 dark:bg-white/5 rounded-2xl border border-gray-300 dark:border-white/10 group hover:border-gray-400 dark:hover:border-white/30 transition-all cursor-pointer shadow-sm print:hidden`}
                                                >
                                                    <div className="text-[9px] font-bold text-gray-700 dark:text-gray-400 uppercase">
                                                        Bloco: Estudo
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex items-center justify-center p-12 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">Nenhuma matrícula identificada</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Cronograma Semanal</h3>
                            <div className="flex flex-col gap-2 items-end">
                                {/* Row 1: Excluir and Info */}
                                <div className="flex items-center gap-3">
                                    <div 
                                        id="calendar-trash"
                                        onClick={async () => {
                                            if (selectedEventIds.length > 0) {
                                                saveToHistory();
                                                const toDelete = [...selectedEventIds];
                                                setEvents(prev => prev.filter(e => !toDelete.includes(e.id)));
                                                setSelectedEventIds([]);
                                                await Promise.all(toDelete.map(id => CalendarActions.deleteCalendarEvent(id)));
                                                toast.success(`${toDelete.length > 1 ? toDelete.length + ' eventos removidos' : 'Evento removido'}`);
                                            } else if (isMobile) {
                                                toast.error('Selecione um bloco no calendário primeiro');
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-2xl transition-all hover:bg-brand-red hover:text-white cursor-pointer ${viewMode === 'view' ? 'hidden' : ''}`}
                                        title="Arraste aqui para excluir, ou clique após selecionar o bloco"
                                    >
                                        <Trash2 className="w-4 h-4 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Excluir</span>
                                    </div>
                                    <button
                                        onClick={handleUndo}
                                        disabled={history.length === 0}
                                        className={`p-2.5 rounded-2xl bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 hover:bg-brand-yellow hover:text-black transition-all active:scale-95 disabled:opacity-30 ${viewMode === 'view' ? 'hidden' : ''}`}
                                        title="Desfazer última alteração"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsHelpModalOpen(true)}
                                        className="p-2.5 rounded-2xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/20 transition-all active:scale-95"
                                        title="Como usar o cronograma?"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                </div>
                                {/* Row 2: Ver Cronograma and Exportar */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsSettingsOpen(true)}
                                        className="p-2.5 rounded-2xl bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red hover:text-white transition-all active:scale-95"
                                        title="Configurações de Horário"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsExportModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-blue/10 dark:bg-brand-blue/5 border border-brand-blue/20 dark:border-brand-blue/10 text-brand-blue rounded-2xl transition-all hover:bg-brand-blue hover:text-white"
                                        title="Exportar Calendário"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Exportar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                
                        <div data-tour="ferramentas-grade" className="bg-white dark:bg-background-dark p-6 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden print:overflow-visible transition-all">
                            <div className="overflow-x-auto custom-scrollbar pb-4">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr>
                                            <th className="p-3 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-gray-200 dark:border-white/10 w-24">Horário</th>
                                            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                                                <th key={day} className="p-3 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-gray-200 dark:border-white/10 text-center">{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            // Extract all unique time slots
                                            const timeSlots = new Set<string>();
                                            events.forEach(e => {
                                                const s = new Date(e.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                                const end = new Date(e.end || new Date(e.start).getTime() + 7200000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                                timeSlots.add(`${s} - ${end}`);
                                            });
                                            const sortedSlots = Array.from(timeSlots).sort();
                                            
                                            if (sortedSlots.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan={8} className="p-12 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                            Nenhum bloco cadastrado
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return sortedSlots.map(slot => {
                                                const [startStr, endStr] = slot.split(' - ');
                                                return (
                                                    <tr key={slot} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-3 text-[11px] font-black text-gray-400 dark:text-gray-500 tracking-wider whitespace-nowrap">
                                                            {startStr}<br/><span className="text-[9px] opacity-50">{endStr}</span>
                                                        </td>
                                                        {[1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
                                                            const cellEvents = events.filter(e => {
                                                                const s = new Date(e.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                                                const end = new Date(e.end || new Date(e.start).getTime() + 7200000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                                                if (`${s} - ${end}` !== slot) return false;
                                                                
                                                                if (e.daysOfWeek && Array.isArray(e.daysOfWeek)) {
                                                                    return e.daysOfWeek.includes(dayIdx);
                                                                }
                                                                return new Date(e.start).getDay() === dayIdx;
                                                            });

                                                            return (
                                                                <td key={dayIdx} className="p-2 align-top w-[12%]">
                                                                    <div className="flex flex-col gap-2">
                                                                        {cellEvents.map(e => (
                                                                            <div
                                                                                key={e.id}
                                                                                onClick={() => {
                                                                                    const isRecurring = e.extendedProps?.type === 'aula' || e.extendedProps?.type === 'estudo';
                                                                                    setSelectedBlockForModal({
                                                                                        id: e.id,
                                                                                        title: e.title,
                                                                                        type: e.extendedProps?.type || 'custom',
                                                                                        sourceId: e.extendedProps?.sourceId,
                                                                                        daysOfWeek: isRecurring && e.daysOfWeek ? e.daysOfWeek : [new Date(e.start).getDay()],
                                                                                        startTime: new Date(e.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                                                                                        endTime: new Date(e.end || new Date(e.start).getTime() + 7200000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                                                                                        color: e.color || '#3B82F6'
                                                                                    });
                                                                                    setIsBlockModalOpen(true);
                                                                                }}
                                                                                className="p-3 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm transition-all hover:scale-105 cursor-pointer relative overflow-hidden group/block"
                                                                                style={{ 
                                                                                    borderLeft: `4px solid ${e.color || '#3B82F6'}`,
                                                                                    backgroundColor: `${e.color || '#3B82F6'}15`,
                                                                                }}
                                                                            >
                                                                                <div className="text-[10px] sm:text-xs font-bold leading-tight text-gray-900 dark:text-white line-clamp-3">
                                                                                    {e.extendedProps?.code ? (
                                                                                        <>
                                                                                            <span className="opacity-70 font-mono text-[9px] block mb-0.5">{e.extendedProps.code}</span>
                                                                                            {e.title.replace('🎓 Aula: ', '').replace('📚 Estudo: ', '')}
                                                                                        </>
                                                                                    ) : (
                                                                                        e.title
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <BlockDetailsModal
                isOpen={isBlockModalOpen}
                onClose={() => {
                    setIsBlockModalOpen(false);
                    setSelectedBlockForModal(null);
                }}
                initialData={selectedBlockForModal}
                onDelete={async (id) => {
                    setEvents(prev => prev.filter(e => e.id !== id));
                    await CalendarActions.deleteCalendarEvent(id);
                    setIsBlockModalOpen(false);
                    toast.success('Bloco removido');
                }}
                onSave={async (data) => {
                    const tempId = data.id || Math.random().toString();
                    
                    const now = new Date();
                    const baseDate = new Date(now.setDate(now.getDate() - now.getDay())); // Last Sunday
                    baseDate.setHours(0,0,0,0);
                    
                    const [startH, startM] = data.startTime.split(':').map(Number);
                    const [endH, endM] = data.endTime.split(':').map(Number);
                    
                    const startDate = new Date(baseDate);
                    startDate.setHours(startH, startM);
                    
                    const endDate = new Date(baseDate);
                    endDate.setHours(endH, endM);

                    const newEvent = {
                        id: tempId,
                        title: data.title,
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        color: data.color,
                        daysOfWeek: data.daysOfWeek,
                        extendedProps: {
                            type: data.type,
                            sourceId: data.sourceId
                        }
                    };

                    if (data.id) {
                        setEvents(prev => prev.map(e => e.id === tempId ? newEvent : e));
                    } else {
                        setEvents(prev => [...prev, newEvent]);
                    }

                    setIsBlockModalOpen(false);
                    const res = await CalendarActions.upsertCalendarEvent(newEvent);
                    if (res.success && res.data) {
                        setEvents(prev => prev.map(e => e.id === tempId ? { ...e, id: res.data.id } : e));
                        toast.success('Bloco salvo!');
                    } else {
                        toast.error('Erro ao salvar no banco');
                    }
                }}
            />
            <SubjectSelectorModal
                isOpen={isSubjectModalOpen}
                onClose={() => setIsSubjectModalOpen(false)}
                onAddTurma={handleAddTurma}
                onRemoveTurma={handleRemoveTurma}
                currentEvents={events}
            />

            <JupiterSyncModal 
                isOpen={isJupiterModalOpen} 
                onClose={() => setIsJupiterModalOpen(false)}
                onSuccess={() => {
                    saveToHistory();
                    loadData();
                    toast.success('Grade sincronizada! Você pode desfazer se necessário.');
                }}
            />
            <AbsencesModal
                isOpen={isAbsencesModalOpen}
                onClose={() => setIsAbsencesModalOpen(false)}
                events={events}
            />
            <CustomEventModal
                isOpen={isCustomEventModalOpen}
                onClose={() => setIsCustomEventModalOpen(false)}
                onSave={async (eventData) => {
                    const tempId = eventData.id || Math.random().toString();
                    setEvents(prev => [...prev, eventData]);
                    
                    const res = await CalendarActions.upsertCalendarEvent(eventData);
                    if (res.success && res.data) {
                        setEvents(prev => prev.map(e => e.id === tempId ? { ...e, id: res.data.id } : e));
                        toast.success('Evento salvo com sucesso!');
                    } else {
                        toast.error('Erro ao salvar evento no banco.');
                    }

                    // Criar bloco personalizado para a lista de Turmas Disponíveis (Grade Horária)
                    if (eventData.title && eventData.start && eventData.end) {
                        const startMs = new Date(eventData.start).getTime();
                        const endMs = new Date(eventData.end).getTime();
                        const durationHours = (endMs - startMs) / (1000 * 60 * 60);
                        const validDuration = durationHours > 0 ? parseFloat(durationHours.toFixed(1)) : 2;

                        const blockRes = await CalendarActions.addCustomBlock(eventData.title, validDuration);
                        if (blockRes.success && blockRes.data) {
                            setCustomBlocks(prev => [blockRes.data, ...prev]);
                        }
                    }
                }}
            />
        </div>
    );
}
