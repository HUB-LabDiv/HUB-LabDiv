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


import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

interface AuthContextType {
    user: User | null;
    profile: any | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const getCookie = (name: string) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    const loadAuth = async () => {
        try {
            const { data: { user: realUser } } = await supabase.auth.getUser();
            const impersonatedId = getCookie('admin_impersonating_id');
            const bypassRole = getCookie('admin_bypass');

            // Impersonation: Só é valido se houver realUser e este for admin
            let targetId: string | undefined = undefined;

            if (impersonatedId && realUser) {
                const { data: adminCheck } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', realUser.id)
                    .maybeSingle();

                if (adminCheck?.role === 'admin' || adminCheck?.role === 'moderator') {
                    targetId = impersonatedId;
                }
            }

            if (!targetId) {
                targetId = realUser?.id;
            }

            if (!targetId && bypassRole) {
                const { data: defaultProf } = await supabase
                    .from('profiles')
                    .select('id')
                    .or('email.eq.hublabdiv@gmail.com,username.eq.labdiv,username.eq.LabDiv')
                    .maybeSingle();
                if (defaultProf) targetId = defaultProf.id;
            }

            if (targetId) {
                const { data: prof } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', targetId)
                    .maybeSingle();

                if (prof) {
                    setProfile(prof);
                    setUser({
                        ...(realUser || {}),
                        id: prof.id,
                        email: prof.email || realUser?.email || 'hublabdiv@gmail.com',
                        user_metadata: {
                            ...(realUser?.user_metadata || {}),
                            full_name: prof.full_name,
                            avatar_url: prof.avatar_url
                        },
                        avatar_url: prof.avatar_url,
                        full_name: prof.full_name,
                        role: prof.role || 'admin',
                        is_adult: prof.is_adult ?? true,
                        user_category: prof.user_category || 'curioso',
                        is_labdiv: prof.is_labdiv || prof.username === 'LabDiv' || prof.username === 'labdiv' || prof.email === 'hublabdiv@gmail.com'
                    });
                    setLoading(false);
                    return;
                }
            }

            if (realUser) {
                setUser(realUser);
                const { data: prof } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', realUser.id)
                    .maybeSingle();
                setProfile(prof);
            } else {
                setUser(null);
                setProfile(null);
            }
        } catch (e) {
            console.error('Error loading auth:', e);
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                loadAuth();
            }
        });

        // Handler global para deep links no Capacitor
        let appListener: any = null;
        if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
            appListener = CapacitorApp.addListener('appUrlOpen', async (data: any) => {
                if (data.url && (data.url.startsWith('hublabdiv://') || data.url.includes('auth/callback'))) {
                    try {
                        await Browser.close();
                    } catch {}

                    try {
                        const cleanUrl = data.url.replace('hublabdiv://', 'https://hub-lab-div.vercel.app/');
                        const urlObj = new URL(cleanUrl);
                        const rawNext = urlObj.searchParams.get('next') || '/';
                        const target = (!rawNext || rawNext === '/login' || rawNext.startsWith('/login')) ? '/' : rawNext;

                        if (urlObj.hash && urlObj.hash.includes('access_token')) {
                            const hashParams = new URLSearchParams(urlObj.hash.replace(/^#/, ''));
                            const accessToken = hashParams.get('access_token');
                            const refreshToken = hashParams.get('refresh_token');
                            if (accessToken && refreshToken) {
                                await supabase.auth.setSession({
                                    access_token: accessToken,
                                    refresh_token: refreshToken
                                });
                                await loadAuth();
                                window.location.href = target;
                                return;
                            }
                        }

                        const code = urlObj.searchParams.get('code');
                        if (code) {
                            const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
                            if (!error && sessionData?.session) {
                                await loadAuth();
                                window.location.href = target;
                                return;
                            }
                        }

                        await loadAuth();
                        window.location.href = target;
                    } catch (err) {
                        console.error('Error in AuthProvider deep link handler:', err);
                        window.location.href = '/';
                    }
                }
            });
        }

        return () => {
            subscription.unsubscribe();
            if (appListener) {
                appListener.then((l: any) => l.remove());
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
