'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { useMemo } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export type UserRoleCategory = 'aluno_usp' | 'pesquisador' | 'curioso';

export interface NavbarThirdAxisItem {
    label: string;
    href: string;
    color: string;
    dataTour: string;
}

export interface SidebarThirdAxisItem {
    name: string;
    href: string;
    iconName: string;
    color: 'brand-yellow' | 'brand-red';
    role: UserRoleCategory;
    dataTour: string;
}

export interface BottomNavThirdAxisItem {
    name: string;
    href: string;
    icon: string;
    color: 'brand-yellow' | 'brand-red';
    dataTour: string;
}

export function useUserRoleNavigation() {
    const { user: authUser, profile, loading } = useAuth();

    const userCategory: UserRoleCategory = useMemo(() => {
        if (!authUser) {
            return 'curioso';
        }

        const category = profile?.user_category;
        const isUspMember = Boolean(
            profile?.is_usp_member ||
            authUser.email?.endsWith('@usp.br') ||
            authUser.email?.endsWith('@if.usp.br')
        );

        if (['pesquisador', 'docente_pesquisador'].includes(category)) {
            return 'pesquisador';
        }

        if (isUspMember || ['aluno_usp', 'licenciatura', 'bacharelado', 'pos_graduacao'].includes(category)) {
            return 'aluno_usp';
        }

        return 'curioso';
    }, [authUser, profile]);

    const isAdult = useMemo(() => {
        return Boolean(profile?.is_adult === true);
    }, [profile]);

    const navbarThirdAxis: NavbarThirdAxisItem = useMemo(() => {
        switch (userCategory) {
            case 'pesquisador':
                return {
                    label: 'Pesquisa',
                    href: '/arena',
                    color: '#F14343',
                    dataTour: 'navbar-eixo-ferramentas',
                };
            case 'aluno_usp':
                return {
                    label: 'Ferramentas',
                    href: '/ferramentas',
                    color: '#FFCC00',
                    dataTour: 'navbar-eixo-ferramentas',
                };
            case 'curioso':
            default:
                return {
                    label: 'Ingressar',
                    href: '/ingresso',
                    color: '#FFCC00',
                    dataTour: 'navbar-eixo-ferramentas',
                };
        }
    }, [userCategory]);

    const sidebarThirdAxis: SidebarThirdAxisItem = useMemo(() => {
        switch (userCategory) {
            case 'pesquisador':
                return {
                    name: 'Observatório de Pesquisa',
                    href: '/arena',
                    iconName: 'visibility',
                    color: 'brand-red',
                    role: 'pesquisador',
                    dataTour: 'sidebar-eixo-ferramentas',
                };
            case 'aluno_usp':
                return {
                    name: 'Ferramentas Acadêmicas',
                    href: '/ferramentas',
                    iconName: 'construction',
                    color: 'brand-yellow',
                    role: 'aluno_usp',
                    dataTour: 'sidebar-eixo-ferramentas',
                };
            case 'curioso':
            default:
                return {
                    name: 'Como Ingressar',
                    href: '/ingresso',
                    iconName: 'school',
                    color: 'brand-yellow',
                    role: 'curioso',
                    dataTour: 'sidebar-eixo-ferramentas',
                };
        }
    }, [userCategory]);

    const bottomNavThirdAxis: BottomNavThirdAxisItem = useMemo(() => {
        switch (userCategory) {
            case 'pesquisador':
                return {
                    name: 'Pesquisa',
                    href: '/arena',
                    icon: 'visibility',
                    color: 'brand-red',
                    dataTour: 'mobile-eixo-ferramentas',
                };
            case 'aluno_usp':
                return {
                    name: 'Ferramentas',
                    href: '/ferramentas',
                    icon: 'construction',
                    color: 'brand-yellow',
                    dataTour: 'mobile-eixo-ferramentas',
                };
            case 'curioso':
            default:
                return {
                    name: 'Ingressar',
                    href: '/ingresso',
                    icon: 'school',
                    color: 'brand-yellow',
                    dataTour: 'mobile-eixo-ferramentas',
                };
        }
    }, [userCategory]);

    return {
        userCategory,
        isAdult,
        isLoading: loading,
        isLoggedIn: Boolean(authUser),
        navbarThirdAxis,
        sidebarThirdAxis,
        bottomNavThirdAxis,
    };
}
