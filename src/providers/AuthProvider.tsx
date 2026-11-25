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


import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { getAdminSessionRole } from '@/app/actions/admin';
import { getUpcomingAcademicEventsAction } from '@/app/actions/desktop';
import { getHubDesktopBridge } from '@/lib/desktop-bridge';

const processedAuthCodes = new Set<string>();

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
    const lastDesktopUserIdRef = useRef<string | null | undefined>(undefined);

    const syncDesktopSession = async (uid: string | null) => {
        const bridge = getHubDesktopBridge();
        if (!bridge) return;
        if (lastDesktopUserIdRef.current !== uid) {
            lastDesktopUserIdRef.current = uid;
            try {
                await bridge.setActiveSession({ userId: uid });
                if (uid) {
                    const res = await getUpcomingAcademicEventsAction({ daysAhead: 7 });
                    if (res.success && res.data) {
                        await bridge.syncAcademicEvents(res.data);
                    }
                }
            } catch {
                // Silencioso fora de contexto desktop confiável
            }
        }
    };

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

            if (!targetId) {
                const hasAdminCookie = getCookie('admin_session') || getCookie('admin_bypass');
                if (hasAdminCookie) {
                    const sessionRole = await getAdminSessionRole();
                    if (sessionRole.role) {
                        const { data: defaultProf } = await supabase
                            .from('profiles')
                            .select('id')
                            .or('email.eq.hublabdiv@gmail.com,username.eq.labdiv,username.eq.LabDiv')
                            .maybeSingle();
                        if (defaultProf) targetId = defaultProf.id;
                    }
                }
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
                    void syncDesktopSession(prof.id);
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
                void syncDesktopSession(realUser.id);
            } else {
                setUser(null);
                setProfile(null);
                void syncDesktopSession(null);
            }
        } catch (e) {
            console.error('Error loading auth:', e);
            setUser(null);
            setProfile(null);
            void syncDesktopSession(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setLoading(false);
                void syncDesktopSession(null);
                return;
            }
            if (
                event === 'SIGNED_IN' ||
                event === 'USER_UPDATED' ||
                event === 'INITIAL_SESSION' ||
                event === 'TOKEN_REFRESHED'
            ) {
                loadAuth();
            }
        });

        const resolveSafeTarget = (rawNext: string | null) => {
            if (!rawNext || rawNext === '/' || rawNext === '/login' || rawNext.startsWith('/login')) {
                return '/lab';
            }
            return rawNext.startsWith('/') ? rawNext : '/lab';
        };

        const exchangeCodeOnce = async (code: string, target: string) => {
            if (processedAuthCodes.has(code)) return;
            processedAuthCodes.add(code);
            const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && sessionData?.session) {
                await loadAuth();
                window.location.href = target;
            } else {
                window.location.href = '/login?error=auth_callback_error';
            }
        };

        // Handler global unificado para deep links no Capacitor (Android)
        let appListener: any = null;
        if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
            appListener = CapacitorApp.addListener('appUrlOpen', async (data: any) => {
                if (data.url && (data.url.startsWith('hublabdiv://') || data.url.includes('auth/callback'))) {
                    try {
                        await Browser.close();
                    } catch {}

                    try {
                        const originBase = window.location.origin.replace(/\/+$/, '') + '/';
                        const cleanUrl = data.url.replace('hublabdiv://', originBase);
                        const urlObj = new URL(cleanUrl);
                        const target = resolveSafeTarget(urlObj.searchParams.get('next'));

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
                            await exchangeCodeOnce(code, target);
                            return;
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

        // Handler global unificado para OAuth Loopback RFC 8252 + Deep Links no Desktop (Electron)
        const desktopBridge = getHubDesktopBridge();
        const offDesktopOAuth = desktopBridge?.onOAuthCallback(async (payload) => {
            try {
                let storedNext: string | null = null;
                try {
                    storedNext = sessionStorage.getItem('hub_oauth_next');
                    sessionStorage.removeItem('hub_oauth_next');
                } catch {}
                const target = resolveSafeTarget(storedNext);

                if (payload?.code) {
                    await exchangeCodeOnce(payload.code, target);
                    return;
                }
                if (payload?.error) {
                    window.location.href = `/login?error=${encodeURIComponent(payload.error)}`;
                }
            } catch (err) {
                console.error('Error in Desktop OAuth callback handler:', err);
            }
        });

        const offDesktopDeepLink = desktopBridge?.onDeepLink(async (rawUrl) => {
            if (!rawUrl || (!rawUrl.includes('auth/callback') && !rawUrl.includes('code='))) {
                return;
            }
            try {
                const originBase = window.location.origin.replace(/\/+$/, '') + '/';
                const urlObj = new URL(rawUrl.replace('hublabdiv://', originBase));
                const target = resolveSafeTarget(urlObj.searchParams.get('next'));
                const code = urlObj.searchParams.get('code');
                if (code) {
                    await exchangeCodeOnce(code, target);
                }
            } catch (err) {
                console.error('Error in Desktop deep link auth handler:', err);
            }
        });

        return () => {
            subscription.unsubscribe();
            if (appListener) {
                appListener.then((l: any) => l.remove());
            }
            offDesktopOAuth?.();
            offDesktopDeepLink?.();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
