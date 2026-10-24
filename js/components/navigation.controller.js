/**
 * Controlador de Navegación y Menú Móvil
 * Principios:
 *  - SRP: Responsabilidad exclusiva sobre el cambio de vistas/pasos y estado del menú móvil.
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class NavigationController {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.step1Element
     * @param {HTMLElement} options.step2Element
     * @param {HTMLElement} options.mobileMenuElement
     * @param {HTMLElement} options.burgerButton
     * @param {HTMLElement} options.burgerOpenIcon
     * @param {HTMLElement} options.burgerCloseIcon
     * @param {Function} [options.onStepChange] - Callback (stepNumber) => void
     */
    constructor({
      step1Element,
      step2Element,
      mobileMenuElement,
      burgerButton,
      burgerOpenIcon,
      burgerCloseIcon,
      onStepChange
    }) {
      this.step1El = step1Element;
      this.step2El = step2Element;
      this.mobileMenuEl = mobileMenuElement;
      this.burgerBtn = burgerButton;
      this.burgerOpenIcon = burgerOpenIcon;
      this.burgerCloseIcon = burgerCloseIcon;
      this.onStepChange = onStepChange || (() => {});
      this.currentStep = 1;

      this.initEvents();
    }

    initEvents() {
      if (this.burgerBtn) {
        this.burgerBtn.addEventListener('click', () => {
          const isClosed = this.mobileMenuEl ? this.mobileMenuEl.classList.contains('hidden') : false;
          this.setMobileMenu(isClosed);
        });
      }
    }

    setMobileMenu(isOpen) {
      if (!this.mobileMenuEl) return;

      this.mobileMenuEl.classList.toggle('hidden', !isOpen);
      this.mobileMenuEl.classList.toggle('flex', isOpen);

      if (this.burgerOpenIcon) {
        this.burgerOpenIcon.classList.toggle('hidden', isOpen);
      }
      if (this.burgerCloseIcon) {
        this.burgerCloseIcon.classList.toggle('hidden', !isOpen);
      }
      if (this.burgerBtn) {
        this.burgerBtn.setAttribute('aria-expanded', String(isOpen));
      }
    }

    goToStep(stepNumber) {
      this.currentStep = stepNumber;

      if (this.step1El) {
        this.step1El.classList.toggle('hidden', stepNumber !== 1);
        if (stepNumber === 1) {
          this.step1El.classList.remove('fade');
          void this.step1El.offsetWidth; // Reflow for restart animation
          this.step1El.classList.add('fade');
        }
      }

      if (this.step2El) {
        this.step2El.classList.toggle('hidden', stepNumber !== 2);
        if (stepNumber === 2) {
          this.step2El.classList.remove('fade');
          void this.step2El.offsetWidth;
          this.step2El.classList.add('fade');
        }
      }

      // Cerrar menú móvil al navegar
      this.setMobileMenu(false);

      // Desplazar al inicio suavemente
      window.scrollTo({ top: 0, behavior: 'smooth' });

      this.onStepChange(stepNumber);
    }

    getCurrentStep() {
      return this.currentStep;
    }
  }

  root.Creaweb.NavigationController = NavigationController;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationController;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
