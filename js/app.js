/**
 * Aplicación Principal - Bootstrap y Orquestador de Dependencias
 * Principios SOLID aplicados:
 *  - SRP: Responsabilidad exclusiva sobre la inicialización, inyección de dependencias y enlace de eventos generales.
 *  - OCP: Las funcionalidades y vistas se extienden mediante componentes modulares sin alterar el núcleo.
 *  - LSP: Servicios de notificación y formularios cumplen interfaces intercambiables.
 *  - ISP: Componentes reciben únicamente las dependencias y opciones que requieren.
 *  - DIP: La aplicación orquesta módulos abstractos desacoplados del DOM estático.
 */
(function (root) {
  'use strict';

  const {
    CONFIG,
    RUBROS_DATA,
    IconRegistry,
    UrlService,
    NotificationService,
    CatalogService,
    FormService,
    CatalogView,
    ModalController,
    PreviewModalController,
    NavigationController
  } = root.Creaweb || {};

  class App {
    constructor() {
      this.services = {};
      this.components = {};
    }

    init() {
      // 1. Renderizar iconos SVG declarativos iniciales
      IconRegistry.paint();

      // 2. Inicializar servicios del sistema (DIP / SRP)
      const toastEl = document.getElementById('toast');
      this.services.notification = new NotificationService(toastEl, CONFIG.toastDuration);
      this.services.catalog = new CatalogService(RUBROS_DATA);
      this.services.form = new FormService(CONFIG.links.formEndpoint);

      // 3. (Rubros/plantillas eliminados: la app se comunica solo por enlaces)

      // 4. Inicializar controlador del modal de vista previa interactiva (SRP / DIP)
      if (PreviewModalController) {
        this.components.previewModal = new PreviewModalController({
          modalElement: document.getElementById('previewModal'),
          frameContainer: document.getElementById('previewFrameContainer'),
          iframeElement: document.getElementById('previewIframe'),
          loaderElement: document.getElementById('previewLoader'),
          titleElement: document.getElementById('previewTitle'),
          urlElement: document.getElementById('previewUrl'),
          deviceDesktopBtn: document.getElementById('deviceDesktop'),
          deviceTabletBtn: document.getElementById('deviceTablet'),
          deviceMobileBtn: document.getElementById('deviceMobile'),
          openTabBtn: document.getElementById('previewOpenTab'),
          chooseBtn: document.getElementById('previewChoose'),
          reloadBtn: document.getElementById('previewReload'),
          closeButtons: [
            document.getElementById('closePreviewModal'),
            document.getElementById('closePreviewModalBottom')
          ],
          urlService: UrlService,
          notificationService: this.services.notification,
          onChoose: (rubro) => this.handleRubroSelect(rubro)
        });
      }

      // 4. Inicializar controlador de navegación (SRP)
      this.components.navigation = new NavigationController({
        step1Element: document.getElementById('step1'),
        step2Element: document.getElementById('step2'),
        mobileMenuElement: document.getElementById('mobileMenu'),
        burgerButton: document.getElementById('burger'),
        burgerOpenIcon: document.getElementById('burgerOpen'),
        burgerCloseIcon: document.getElementById('burgerClose'),
        onStepChange: (step) => {
          if (step === 2) {
            this.updateCatalogDisplay(searchInput ? searchInput.value : '');
          }
        }
      });

      // 5. Inicializar controlador del modal de contacto (SRP / DIP)
      this.components.modal = new ModalController({
        modalElement: document.getElementById('modal'),
        formElement: document.getElementById('form'),
        submitButton: document.getElementById('submitBtn'),
        errorElement: document.getElementById('formError'),
        formService: this.services.form,
        notificationService: this.services.notification,
        endpointUrl: CONFIG.links.formEndpoint
      });

      // 6. Enlazar eventos de interacción
      this.bindInteractions();

      // 7. (Sin catálogo de rubros: nada que renderizar)
    }

    /**
     * Maneja la selección de un rubro/plantilla
     * Resuelve de forma definitiva la redirección a dominios externos
     * evitando la ruta relativa indeseada (ej: creaweb.chach.app/barberweb.chach.app)
     * @param {Object} rubro
     */
    handleRubroSelect(rubro) {
      if (!rubro || !rubro.url || !rubro.url.trim()) {
        this.services.notification.show('Estamos trabajando en ello, próximamente disponible');
        return;
      }

      // UrlService normaliza el dominio a 'https://dominio...' garantizando redirección absoluta correcta
      UrlService.navigate(rubro.url);
    }

    /**
     * Abre la vista previa interactiva del sitio de la plantilla antes de elegir
     * @param {Object} rubro
     */
    handleRubroPreview(rubro) {
      if (!rubro || !rubro.url || !rubro.url.trim()) {
        this.services.notification.show('Estamos trabajando en ello, próximamente disponible');
        return;
      }

      if (this.components.previewModal) {
        this.components.previewModal.open(rubro);
      } else {
        // Fallback si por alguna razón el modal no está disponible
        UrlService.navigate(rubro.url);
      }
    }

    /**
     * Actualiza la lista de plantillas mostrada según el término de búsqueda
     * @param {string} query
     */
    updateCatalogDisplay(query = '') {
      const filtered = this.services.catalog.filter(query);
      this.components.catalogView.render(filtered);
      
      // Actualizar contador de rubros dinámicamente
      const totalRubros = this.services.catalog.getAll().length;
      const rubrosCountEl = document.getElementById('rubros-count');
      if (rubrosCountEl) {
        rubrosCountEl.textContent = totalRubros;
      }
      
      // Actualizar total de plantillas en despliegues aislados
      const totalPlantillas = this.services.catalog.getTotalPlantillasCount();
      const plantillasCountEl = document.getElementById('plantillas-count');
      if (plantillasCountEl) {
        plantillasCountEl.textContent = totalPlantillas;
      }
    }

    /**
     * Enlaza los botones y acciones principales de la UI
     */
    bindInteractions() {
      const nav = this.components.navigation;
      const modal = this.components.modal;

      // Navegación a Plantillas (Paso 2)
      const btnTpl = document.getElementById('btnTpl');
      const navTpl = document.getElementById('navTpl');
      const mTpl = document.getElementById('mTpl');

      if (btnTpl) btnTpl.addEventListener('click', () => {
         if (CONFIG.links.templates && CONFIG.links.templates.trim()) {
           this.handleRubroPreview({ n: 'Elegir plantilla', url: CONFIG.links.templates });
         } else {
           this.services.notification.show('Estamos trabajando en ello, próximamente disponible');
         }
       });
      if (navTpl) navTpl.addEventListener('click', (e) => { e.preventDefault(); nav.goToStep(2); });
      if (mTpl) mTpl.addEventListener('click', (e) => { e.preventDefault(); nav.goToStep(2); });

      // Navegación a Inicio (Paso 1)
      const navHome = document.getElementById('navHome');
      const crumbHome = document.getElementById('crumbHome');
      const brand = document.getElementById('brand');
      const mHome = document.getElementById('mHome');

      const goToHome = (e) => {
        if (e) e.preventDefault();
        nav.goToStep(1);
      };

      if (navHome) navHome.addEventListener('click', goToHome);
      if (crumbHome) crumbHome.addEventListener('click', goToHome);
      if (brand) brand.addEventListener('click', goToHome);
      if (mHome) mHome.addEventListener('click', goToHome);

      // Opción: "Crear diseño propio desde 0"
      const btnScratch = document.getElementById('btnScratch');
      if (btnScratch) {
        btnScratch.addEventListener('click', () => {
          if (CONFIG.links.scratch && CONFIG.links.scratch.trim()) {
            // Abrir vista previa interactiva (igual que en plantillas) antes de ir al sitio
            this.handleRubroPreview({ n: 'Crear diseño propio desde 0', url: CONFIG.links.scratch });
          } else {
            this.services.notification.show('Estamos trabajando en ello, próximamente disponible');
          }
        });
      }

      // Búsqueda en tiempo real
      const searchInput = document.getElementById('search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.updateCatalogDisplay(e.target.value);
        });
      }

      // Abrir modal de contacto
      const navContact = document.getElementById('navContact');
      const mContact = document.getElementById('mContact');
      const btnMissing = document.getElementById('btnMissing');

      const openContactModal = (e) => {
        if (e) e.preventDefault();
        nav.setMobileMenu(false);
        modal.open();
      };

      if (navContact) navContact.addEventListener('click', openContactModal);
      if (mContact) mContact.addEventListener('click', openContactModal);
      if (btnMissing) btnMissing.addEventListener('click', openContactModal);

      // Botones de cierre del modal
      const closeModal = document.getElementById('closeModal');
      const cancelModal = document.getElementById('cancelModal');

      if (closeModal) closeModal.addEventListener('click', () => modal.close());
      if (cancelModal) cancelModal.addEventListener('click', () => modal.close());
    }
  }

  root.Creaweb.App = App;

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const app = new App();
      app.init();
      root.Creaweb.appInstance = app;
    });
  } else {
    const app = new App();
    app.init();
    root.Creaweb.appInstance = app;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
