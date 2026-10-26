/**
 * Vista / Renderizador del Catálogo de Plantillas
 * Principios:
 *  - SRP: Responsabilidad exclusiva sobre la creación y actualización del DOM para las tarjetas del catálogo.
 *  - ISP: Sólo expone métodos y eventos relevantes a la vista del catálogo.
 *  - DIP: Recibe el registro de iconos y callbacks mediante inyección de dependencias.
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class CatalogView {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.gridElement - Contenedor donde se insertan las tarjetas
     * @param {HTMLElement} options.emptyElement - Contenedor del mensaje de "sin resultados"
     * @param {Object} options.iconRegistry - Servicio/Registro de iconos
     * @param {Function} options.onSelect - Callback al seleccionar/elegir un rubro: (rubro) => void
     * @param {Function} [options.onPreview] - Callback para abrir vista previa interactiva: (rubro) => void
     */
    constructor({ gridElement, emptyElement, iconRegistry, onSelect, onPreview }) {
      this.gridEl = gridElement;
      this.emptyEl = emptyElement;
      this.iconRegistry = iconRegistry;
      this.onSelect = onSelect || (() => {});
      this.onPreview = onPreview || (() => {});
    }

    /**
     * Renderiza una lista de rubros en el grid
     * @param {Array<Object>} items
     */
    render(items = []) {
      if (!this.gridEl) return;

      this.gridEl.innerHTML = '';

      items.forEach((item) => {
        const isAvailable = Boolean(item.url && item.url.trim());
        const card = document.createElement('article');
        card.tabIndex = 0;
        card.className = 'glass lift rounded-2xl p-5 text-left flex flex-col gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-400 relative transition-all cursor-pointer';
        card.setAttribute('role', 'region');
        card.setAttribute('aria-label', `${item.n} - ${isAvailable ? 'Disponible con vista previa' : 'Próximamente'}`);

        const iconSvg = this.iconRegistry ? this.iconRegistry.getSvg(item.icon) : '';
        const eyeSvg = this.iconRegistry ? this.iconRegistry.getSvg('eye') : '';
        const arrowSvg = this.iconRegistry ? this.iconRegistry.getSvg('arrow-right') : '';

        if (isAvailable) {
          card.innerHTML = `
            <div class="flex items-start justify-between gap-2">
              <span class="w-12 h-12 rounded-xl bg-[#0d6efd]/25 text-blue-300 grid place-items-center text-2xl group-hover:scale-105 transition-transform shadow-inner">
                ${iconSvg}
              </span>
              <span class="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Disponible
              </span>
            </div>

            <div class="flex-1">
              <h3 class="font-semibold text-lg leading-snug text-white group-hover:text-blue-200 transition-colors">
                ${item.n}
              </h3>
              <p class="text-xs text-white/50 mt-1">Plantilla interactiva lista</p>
            </div>

            <div class="mt-auto pt-3 flex items-center gap-2 border-t border-white/10">
              <button type="button" class="btn-choose btn btn-primary !py-1.5 !px-3 text-xs w-full flex items-center justify-center gap-1" title="Elegir e ir al sitio">
                <span>Elegir</span>
                ${arrowSvg}
              </button>
            </div>
          `;

          // Botón directo para elegir (enlace directo)
          const btnChoose = card.querySelector('.btn-choose');
          if (btnChoose) {
            btnChoose.addEventListener('click', (e) => {
              e.stopPropagation();
              this.onSelect(item);
            });
          }

          // Clic en la tarjeta completa va directo al enlace
          card.addEventListener('click', () => {
            this.onSelect(item);
          });

          // Accesibilidad teclado
          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (e.target === card) {
                e.preventDefault();
                this.onSelect(item);
              }
            }
          });
        } else {
          card.innerHTML = `
            <div class="flex items-start justify-between gap-2">
              <span class="w-12 h-12 rounded-xl bg-slate-800/60 text-white/40 grid place-items-center text-2xl group-hover:scale-105 transition-transform">
                ${iconSvg}
              </span>
              <span class="text-xs font-semibold rounded-full px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/20">
                Próximamente
              </span>
            </div>

            <div class="flex-1">
              <h3 class="font-semibold text-lg leading-snug text-white/80 group-hover:text-white transition-colors">
                ${item.n}
              </h3>
              <p class="text-xs text-white/40 mt-1">En desarrollo</p>
            </div>

            <div class="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50 group-hover:text-blue-300 transition-colors">
              <span>Solicitar rubro</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          `;

          card.addEventListener('click', () => {
            this.onSelect(item);
          });

          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (e.target === card) {
                e.preventDefault();
                this.onSelect(item);
              }
            }
          });
        }

        this.gridEl.appendChild(card);
      });

      if (this.emptyEl) {
        this.emptyEl.classList.toggle('hidden', items.length > 0);
      }
    }
  }

  root.Creaweb.CatalogView = CatalogView;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatalogView;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
