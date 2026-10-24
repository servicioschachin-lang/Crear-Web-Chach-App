/**
 * Configuración global de la aplicación (SRP: Responsabilidad Única sobre Parámetros del Sistema)
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  root.Creaweb.CONFIG = Object.freeze({
    links: {
      // Enlace para la opción "Crear diseño propio desde 0"
      scratch: "",
      // Endpoint de Formspree para la recepción de solicitudes
      formEndpoint: "https://formspree.io/f/xrengvqb"
    },
    toastDuration: 2800,
    defaultSubject: "Nuevo rubro solicitado - Creaweb Chach App"
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.Creaweb.CONFIG;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
