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
     * @param {Function} options.onSelect - Callback al hacer clic en un rubro: (rubro) => void
     */
    constructor({ gridElement, emptyElement, iconRegistry, onSelect }) {
      this.gridEl = gridElement;
      this.emptyEl = emptyElement;
      this.iconRegistry = iconRegistry;
      this.onSelect = onSelect || (() => {});
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
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'glass lift rounded-2xl p-5 text-left flex flex-col gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-400';
        card.setAttribute('aria-label', `${item.n} - ${isAvailable ? 'Disponible' : 'Próximamente'}`);

        const iconSvg = this.iconRegistry ? this.iconRegistry.getSvg(item.icon) : '';
        const badgeClass = isAvailable
          ? 'bg-emerald-400/20 text-emerald-300'
          : 'bg-amber-400/20 text-amber-300';
        const badgeText = isAvailable ? 'Disponible' : 'Próximamente';

        card.innerHTML = `
          <span class="w-12 h-12 rounded-xl bg-[#0d6efd]/25 text-blue-300 grid place-items-center text-2xl group-hover:scale-105 transition-transform">
            ${iconSvg}
          </span>
          <span class="font-semibold leading-tight text-white group-hover:text-blue-200 transition-colors">
            ${item.n}
          </span>
          <span class="text-xs font-semibold rounded-full px-2.5 py-0.5 w-fit ${badgeClass}">
            ${badgeText}
          </span>
        `;

        card.addEventListener('click', () => {
          this.onSelect(item);
        });

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
