"use client";

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


import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 🛰️ RouteFocusManager V6.0 (Accessibility First)
 * Gerencia o foco programático durante as navegações SPA do Next.js.
 * Garante que leitores de tela anunciem o novo título (H1) ao mudar de página.
 */
export function RouteFocusManager() {
  const pathname = usePathname();

  // ⌨️ Detecta quando o usuário está ativamente usando a tecla TAB para navegação
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
      }
    };

    const handlePointerInteraction = () => {
      document.body.classList.remove("user-is-tabbing");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handlePointerInteraction);
    window.addEventListener("touchstart", handlePointerInteraction, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handlePointerInteraction);
      window.removeEventListener("touchstart", handlePointerInteraction);
    };
  }, []);

  useEffect(() => {
    // Timeout de 100ms para garantir que a renderização do DOM do Next.js terminou
    const timeoutId = setTimeout(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        // Tornar o H1 programaticamente focável se ele ainda não for
        if (!h1.hasAttribute("tabindex")) {
          h1.setAttribute("tabindex", "-1");
        }
        h1.focus({ preventScroll: true });
        
        // Log para auditoria de acessibilidade em ambiente de dev
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[A11y] Focus sent to H1: ${h1.innerText}`);
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
