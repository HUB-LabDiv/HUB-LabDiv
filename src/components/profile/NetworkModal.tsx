'use client';

import { useState, useEffect } from 'react';
import { X, UserMinus, ShieldAlert } from 'lucide-react';
import { fetchFollowersList, fetchFollowingList, removeFollower, unfollowUser } from '@/app/actions/submissions';
import { Avatar } from '@/components/ui/Avatar';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface NetworkProfile {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
    use_nickname: boolean;
}

interface NetworkModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    isViewingOwn: boolean;
    initialTab?: 'followers' | 'following';
}

export function NetworkModal({ isOpen, onClose, userId, isViewingOwn, initialTab = 'followers' }: NetworkModalProps) {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
    const [profiles, setProfiles] = useState<NetworkProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setActiveTab(initialTab);
    }, [isOpen, initialTab]);

    useEffect(() => {
        if (!isOpen) return;

        const loadContent = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'followers') {
                    const data = await fetchFollowersList(userId);
                    setProfiles(data);
                } else {
                    const data = await fetchFollowingList(userId);
                    setProfiles(data);
                }
            } catch (err) {
                console.error(err);
                toast.error('Erro ao carregar lista.');
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [isOpen, activeTab, userId]);

    if (!isOpen) return null;

    const handleRemoveFollower = async (targetId: string, name: string) => {
        if (!confirm(`Deseja remover ${name} dos seus seguidores?`)) return;

        const targetEl = document.getElementById(`profile-card-${targetId}`);
        if (targetEl) targetEl.style.opacity = '0.5';

        const res = await removeFollower(targetId);
        if (res.success) {
            toast.success('Seguidor removido.');
            setProfiles(prev => prev.filter(p => p.id !== targetId));
        } else {
            toast.error(res.error || 'Erro ao remover.');
            if (targetEl) targetEl.style.opacity = '1';
        }
    };

    const handleUnfollow = async (targetId: string, name: string) => {
        if (!confirm(`Deseja deixar de seguir ${name}?`)) return;

        const targetEl = document.getElementById(`profile-card-${targetId}`);
        if (targetEl) targetEl.style.opacity = '0.5';

        const res = await unfollowUser(targetId);
        if (res.success) {
            toast.success('Você deixou de seguir.');
            setProfiles(prev => prev.filter(p => p.id !== targetId));
        } else {
            toast.error(res.error || 'Erro ao deixar de seguir.');
            if (targetEl) targetEl.style.opacity = '1';
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#121212] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-[70vh]">
                
                {/* Header Actions */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rede</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 dark:border-gray-800">
                    <button 
                        onClick={() => setActiveTab('followers')}
                        className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-colors ${activeTab === 'followers' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                    >
                        Seguidores
                    </button>
                    <button 
                        onClick={() => setActiveTab('following')}
                        className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-colors ${activeTab === 'following' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                    >
                        Seguindo
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isLoading ? (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 animate-pulse bg-gray-50 dark:bg-white/5 rounded-2xl">
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : profiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
                            <ShieldAlert className="w-12 h-12 mb-4 text-gray-400" />
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {activeTab === 'followers' ? 'Nenhum seguidor encontrado.' : 'Não está seguindo ninguém.'}
                            </p>
                        </div>
                    ) : (
                        profiles.map((profile) => {
                            const displayName = profile.use_nickname && profile.username ? profile.username : profile.full_name;
                            return (
                                <div id={`profile-card-${profile.id}`} key={profile.id} className="flex items-center justify-between p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl">
                                    <Link href={`/lab?user=${profile.id}`} onClick={onClose} className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="relative">
                                            <Avatar src={profile.avatar_url} name={displayName} size="md" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {displayName}
                                            </p>
                                            {profile.username && (
                                                <p className="text-xs text-brand-blue truncate">
                                                    @{profile.username}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                    
                                    {isViewingOwn && (
                                        <div className="ml-2 shrink-0">
                                            {activeTab === 'followers' ? (
                                                <button 
                                                    onClick={() => handleRemoveFollower(profile.id, displayName)}
                                                    className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all"
                                                    title="Remover Seguidor"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleUnfollow(profile.id, displayName)}
                                                    className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all"
                                                    title="Deixar de seguir"
                                                >
                                                    <UserMinus className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}
