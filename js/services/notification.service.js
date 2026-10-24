/**
 * Servicio de Notificaciones (Toast)
 * Principios:
 *  - SRP: Responsabilidad exclusiva sobre la presentación de alertas y mensajes temporales al usuario.
 *  - LSP: Implementa un contrato estándar (show, hide) sustituible por cualquier otra implementación.
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class NotificationService {
    /**
     * @param {HTMLElement} toastElement - Elemento contenedor del toast en el DOM
     * @param {number} [duration=2800] - Tiempo en ms antes de ocultar
     */
    constructor(toastElement, duration = 2800) {
      this.toastEl = toastElement;
      this.duration = duration;
      this.timerId = null;
    }

    /**
     * Muestra un mensaje temporal tipo toast
     * @param {string} message - Texto a mostrar
     * @param {string} [iconName='info'] - Nombre del icono SVG
     */
    show(message, iconName = 'info') {
      if (!this.toastEl) return;

      const IconRegistry = root.Creaweb.IconRegistry;
      const iconHtml = IconRegistry ? IconRegistry.getSvg(iconName) : '';

      this.toastEl.innerHTML = `${iconHtml}<span>${message}</span>`;
      this.toastEl.classList.remove('hidden');
      this.toastEl.classList.add('flex');

      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.timerId = setTimeout(() => {
        this.hide();
      }, this.duration);
    }

    /**
     * Oculta el toast inmediatamente
     */
    hide() {
      if (!this.toastEl) return;
      this.toastEl.classList.add('hidden');
      this.toastEl.classList.remove('flex');
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    }
  }

  root.Creaweb.NotificationService = NotificationService;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationService;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
