/**
 * Controlador del Modal de Contacto
 * Principios:
 *  - SRP: Responsabilidad exclusiva sobre el ciclo de vida del modal (abrir, cerrar, accesibilidad, submit).
 *  - DIP: Depende de abstracciones de servicios (FormService, NotificationService) inyectadas.
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class ModalController {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.modalElement
     * @param {HTMLFormElement} options.formElement
     * @param {HTMLElement} options.submitButton
     * @param {HTMLElement} options.errorElement
     * @param {Object} options.formService
     * @param {Object} options.notificationService
     * @param {string} [options.endpointUrl]
     */
    constructor({
      modalElement,
      formElement,
      submitButton,
      errorElement,
      formService,
      notificationService,
      endpointUrl
    }) {
      this.modalEl = modalElement;
      this.formEl = formElement;
      this.submitBtn = submitButton;
      this.errorEl = errorElement;
      this.formService = formService;
      this.notificationService = notificationService;
      this.endpointUrl = endpointUrl;

      this.initEvents();
    }

    initEvents() {
      if (!this.modalEl) return;

      // Cerrar al hacer clic en el backdrop exterior
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.close();
        }
      });

      // Cerrar con tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
          this.close();
        }
      });

      // Manejo de envío del formulario
      if (this.formEl) {
        this.formEl.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    }

    open() {
      if (!this.modalEl) return;
      this.clearError();
      this.modalEl.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      // Autofocus en el primer campo
      const firstInput = this.modalEl.querySelector('input:not([type="hidden"]):not([style*="display:none"])');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 50);
      }
    }

    close() {
      if (!this.modalEl) return;
      this.modalEl.classList.add('hidden');
      document.body.style.overflow = '';
      this.clearError();
    }

    clearError() {
      if (this.errorEl) {
        this.errorEl.textContent = '';
        this.errorEl.classList.add('hidden');
      }
    }

    showError(msg) {
      if (this.errorEl) {
        this.errorEl.textContent = msg;
        this.errorEl.classList.remove('hidden');
      }
    }

    setSubmitting(isSubmitting) {
      if (this.submitBtn) {
        this.submitBtn.disabled = isSubmitting;
        this.submitBtn.textContent = isSubmitting ? 'Enviando...' : 'Enviar';
      }
    }

    async handleSubmit(e) {
      e.preventDefault();
      this.clearError();
      this.setSubmitting(true);

      const result = await this.formService.submit(this.formEl, this.endpointUrl);

      this.setSubmitting(false);

      if (result.success) {
        if (this.notificationService) {
          this.notificationService.show('¡Gracias! Te contactaremos pronto');
        }
        this.formEl.reset();
        this.close();
      } else {
        this.showError(result.message || 'Error al enviar el formulario.');
      }
    }
  }

  root.Creaweb.ModalController = ModalController;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalController;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
