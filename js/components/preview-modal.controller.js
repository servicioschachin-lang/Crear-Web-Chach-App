/**
 * Controlador del Modal de Vista Previa Interactiva de Plantillas
 * Principios:
 *  - SRP: Responsabilidad exclusiva sobre la previsualización interactiva de plantillas en iframe,
 *         control de dispositivos (desktop, tablet, móvil), recarga y confirmación de selección.
 *  - DIP: Depende de abstracciones inyectadas (UrlService, NotificationService).
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class PreviewModalController {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.modalElement
     * @param {HTMLElement} options.frameContainer
     * @param {HTMLIFrameElement} options.iframeElement
     * @param {HTMLElement} options.loaderElement
     * @param {HTMLElement} options.titleElement
     * @param {HTMLElement} options.urlElement
     * @param {HTMLElement} options.deviceDesktopBtn
     * @param {HTMLElement} options.deviceTabletBtn
     * @param {HTMLElement} options.deviceMobileBtn
     * @param {HTMLElement} options.openTabBtn
     * @param {HTMLElement} options.chooseBtn
     * @param {HTMLElement} options.reloadBtn
     * @param {NodeList|Array<HTMLElement>} [options.closeButtons]
     * @param {Object} [options.urlService]
     * @param {Object} [options.notificationService]
     * @param {Function} [options.onChoose]
     */
    constructor({
      modalElement,
      frameContainer,
      iframeElement,
      loaderElement,
      titleElement,
      urlElement,
      deviceDesktopBtn,
      deviceTabletBtn,
      deviceMobileBtn,
      openTabBtn,
      chooseBtn,
      reloadBtn,
      closeButtons = [],
      urlService,
      notificationService,
      onChoose
    }) {
      this.modalEl = modalElement;
      this.frameContainer = frameContainer;
      this.iframeEl = iframeElement;
      this.loaderEl = loaderElement;
      this.titleEl = titleElement;
      this.urlEl = urlElement;

      this.deviceDesktopBtn = deviceDesktopBtn;
      this.deviceTabletBtn = deviceTabletBtn;
      this.deviceMobileBtn = deviceMobileBtn;

      this.openTabBtn = openTabBtn;
      this.chooseBtn = chooseBtn;
      this.reloadBtn = reloadBtn;
      this.closeBtns = Array.from(closeButtons || []);

      this.urlService = urlService || root.Creaweb.UrlService;
      this.notificationService = notificationService;
      this.onChoose = onChoose || (() => {});

      this.currentRubro = null;
      this.currentDevice = 'desktop';

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

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
          this.close();
        }
      });

      // Botones de cierre
      this.closeBtns.forEach((btn) => {
        if (btn) {
          btn.addEventListener('click', () => this.close());
        }
      });

      // Conmutadores de dispositivo
      if (this.deviceDesktopBtn) {
        this.deviceDesktopBtn.addEventListener('click', () => this.setDevice('desktop'));
      }
      if (this.deviceTabletBtn) {
        this.deviceTabletBtn.addEventListener('click', () => this.setDevice('tablet'));
      }
      if (this.deviceMobileBtn) {
        this.deviceMobileBtn.addEventListener('click', () => this.setDevice('mobile'));
      }

      // Abrir en nueva pestaña
      if (this.openTabBtn) {
        this.openTabBtn.addEventListener('click', () => {
          if (this.currentRubro && this.currentRubro.url) {
            this.urlService.navigate(this.currentRubro.url, { newTab: true });
          }
        });
      }

      // Confirmar selección del rubro
      if (this.chooseBtn) {
        this.chooseBtn.addEventListener('click', () => {
          if (this.currentRubro) {
            const rubro = this.currentRubro;
            this.close();
            this.onChoose(rubro);
          }
        });
      }

      // Recargar iframe
      if (this.reloadBtn) {
        this.reloadBtn.addEventListener('click', () => {
          this.reload();
        });
      }

      // Manejo de carga del iframe
      if (this.iframeEl) {
        this.iframeEl.addEventListener('load', () => {
          this.hideLoader();
        });
      }
    }

    /**
     * Abre el modal de vista previa para el rubro dado
     * @param {Object} rubro
     */
    open(rubro) {
      if (!this.modalEl || !rubro) return;

      this.currentRubro = rubro;

      // Configurar título y datos
      if (this.titleEl) {
        this.titleEl.textContent = rubro.n || 'Plantilla de negocio';
      }

      const domain = this.urlService.extractDomain(rubro.url);
      if (this.urlEl) {
        this.urlEl.textContent = domain || 'Sitio demo';
      }

      // Restablecer modo a escritorio
      this.setDevice('desktop');

      // Cargar iframe
      this.showLoader();
      const previewUrl = this.urlService.getPreviewUrl(rubro.url);
      if (this.iframeEl) {
        this.iframeEl.src = previewUrl;
      }

      // Mostrar modal
      this.modalEl.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra el modal y limpia el iframe
     */
    close() {
      if (!this.modalEl) return;

      this.modalEl.classList.add('hidden');
      document.body.style.overflow = '';

      // Limpiar iframe para liberar memoria y detener scripts/audios
      if (this.iframeEl) {
        this.iframeEl.src = 'about:blank';
      }
      this.currentRubro = null;
    }

    /**
     * Recarga el contenido de la vista previa
     */
    reload() {
      if (!this.currentRubro || !this.iframeEl) return;
      this.showLoader();
      const previewUrl = this.urlService.getPreviewUrl(this.currentRubro.url);
      this.iframeEl.src = previewUrl;
    }

    /**
     * Cambia la vista del dispositivo (desktop, tablet, mobile)
     * @param {'desktop'|'tablet'|'mobile'} device
     */
    setDevice(device) {
      this.currentDevice = device;

      // Actualizar estilos activos de los botones
      const buttons = [
        { el: this.deviceDesktopBtn, key: 'desktop' },
        { el: this.deviceTabletBtn, key: 'tablet' },
        { el: this.deviceMobileBtn, key: 'mobile' }
      ];

      buttons.forEach(({ el, key }) => {
        if (!el) return;
        const isActive = key === device;
        el.classList.toggle('bg-blue-600', isActive);
        el.classList.toggle('text-white', isActive);
        el.classList.toggle('shadow-md', isActive);
        el.classList.toggle('text-white/60', !isActive);
        el.classList.toggle('hover:text-white', !isActive);
        el.setAttribute('aria-pressed', String(isActive));
      });

      if (!this.frameContainer) return;

      // Remover clases de dispositivo previas
      this.frameContainer.classList.remove(
        'device-desktop',
        'device-tablet',
        'device-mobile',
        'max-w-[768px]',
        'max-w-[390px]',
        'rounded-2xl',
        'rounded-[2.5rem]',
        'border-4',
        'border-[6px]',
        'border-slate-700/80',
        'shadow-2xl'
      );

      if (device === 'tablet') {
        this.frameContainer.classList.add(
          'device-tablet',
          'max-w-[768px]',
          'rounded-2xl',
          'border-4',
          'border-slate-700/80',
          'shadow-2xl'
        );
      } else if (device === 'mobile') {
        this.frameContainer.classList.add(
          'device-mobile',
          'max-w-[390px]',
          'rounded-[2.5rem]',
          'border-[6px]',
          'border-slate-700/80',
          'shadow-2xl'
        );
      } else {
        this.frameContainer.classList.add('device-desktop');
      }
    }

    showLoader() {
      if (this.loaderEl) {
        this.loaderEl.classList.remove('hidden');
        this.loaderEl.classList.add('flex');
      }
    }

    hideLoader() {
      if (this.loaderEl) {
        this.loaderEl.classList.add('hidden');
        this.loaderEl.classList.remove('flex');
      }
    }
  }

  root.Creaweb.PreviewModalController = PreviewModalController;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreviewModalController;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
