import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, FileText, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CustomEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: any) => void;
    initialDate?: Date | null;
}

const CATEGORIES = [
    { id: 'saude', label: 'Saúde & Bem-estar', color: '#10B981' },
    { id: 'lazer', label: 'Lazer & Hobbies', color: '#8B5CF6' },
    { id: 'prova', label: 'Prova / Exame', color: '#EF4444' },
    { id: 'trabalho', label: 'Trabalho / Estágio', color: '#F59E0B' },
    { id: 'custom', label: 'Outro', color: '#6B7280' },
];

export function CustomEventModal({ isOpen, onClose, onSave, initialDate }: CustomEventModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('10:00');
    const [reminder, setReminder] = useState(1440); // 1 day in minutes

    useEffect(() => {
        if (isOpen) {
            if (initialDate) {
                const year = initialDate.getFullYear();
                const month = String(initialDate.getMonth() + 1).padStart(2, '0');
                const day = String(initialDate.getDate()).padStart(2, '0');
                setDate(`${year}-${month}-${day}`);
                
                const hours = String(initialDate.getHours()).padStart(2, '0');
                const minutes = String(initialDate.getMinutes()).padStart(2, '0');
                setStartTime(`${hours}:${minutes}`);

                const endInitial = new Date(initialDate.getTime() + 2 * 60 * 60 * 1000);
                const endHours = String(endInitial.getHours()).padStart(2, '0');
                const endMinutes = String(endInitial.getMinutes()).padStart(2, '0');
                setEndTime(`${endHours}:${endMinutes}`);
            } else {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                setDate(`${year}-${month}-${day}`);
                setStartTime('08:00');
                setEndTime('10:00');
            }
            setTitle('');
            setDescription('');
            setCategory(CATEGORIES[0].id);
            setReminder(1440);
        }
    }, [isOpen, initialDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !date || !startTime || !endTime) {
            toast.error('Preencha os campos obrigatórios.');
            return;
        }

        const startIso = new Date(`${date}T${startTime}:00`).toISOString();
        const endIso = new Date(`${date}T${endTime}:00`).toISOString();
        const selectedCat = CATEGORIES.find(c => c.id === category);

        const eventData = {
            id: `temp-${Date.now()}`,
            title: title.trim(),
            start: startIso,
            end: endIso,
            color: selectedCat?.color || '#6B7280',
            extendedProps: {
                type: category,
                description: description.trim(),
                reminder_minutes: reminder
            }
        };

        onSave(eventData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-blue" />
                        Novo Evento
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="custom-event-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Título do Evento *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Prova de Física, Psicóloga..."
                                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Categoria</label>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        type="button"
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium border text-left transition-all ${
                                            category === cat.id 
                                                ? 'bg-white/10 border-white text-white' 
                                                : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
                                        }`}
                                        style={{ borderLeftColor: category === cat.id ? cat.color : undefined, borderLeftWidth: category === cat.id ? '4px' : '1px' }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Data *</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Início *</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Fim *</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase">Lembrete Push</label>
                                <select
                                    value={reminder}
                                    onChange={(e) => setReminder(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                                >
                                    <option value={0}>Sem lembrete</option>
                                    <option value={15}>15 minutos antes</option>
                                    <option value={30}>30 minutos antes</option>
                                    <option value={60}>1 hora antes</option>
                                    <option value={1440}>1 dia antes</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Descrição (Opcional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detalhes adicionais do evento..."
                                rows={3}
                                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none resize-none"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-white/5 bg-white/5 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="custom-event-form"
                        className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-brand-blue/20 flex items-center gap-2"
                    >
                        Salvar Evento
                    </button>
                </div>
            </div>
        </div>
    );
}
