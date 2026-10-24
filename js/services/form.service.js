/**
 * Servicio de Envío de Formularios (Form Service)
 * Principios:
 *  - SRP: Responsabilidad exclusiva sobre la comunicación HTTP y manejo de respuestas de formularios.
 *  - LSP: Provee una interfaz unificada (submit) que abstrae el proveedor backend (Formspree u otro).
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class FormService {
    /**
     * @param {string} [endpoint] - URL del endpoint de recepción (ej. Formspree)
     */
    constructor(endpoint = '') {
      this.endpoint = endpoint;
    }

    /**
     * Envía los datos de un formulario al endpoint configurado
     * @param {FormData|HTMLFormElement} formDataOrForm
     * @param {string} [overrideEndpoint]
     * @returns {Promise<{success: boolean, message?: string, errors?: string[]}>}
     */
    async submit(formDataOrForm, overrideEndpoint) {
      const targetEndpoint = overrideEndpoint || this.endpoint;
      if (!targetEndpoint) {
        return {
          success: false,
          message: 'Endpoint de envío no configurado.'
        };
      }

      const bodyData = formDataOrForm instanceof HTMLFormElement 
        ? new FormData(formDataOrForm) 
        : formDataOrForm;

      try {
        const response = await fetch(targetEndpoint, {
          method: 'POST',
          body: bodyData,
          headers: {
            Accept: 'application/json'
          }
        });

        if (response.ok) {
          return {
            success: true,
            message: 'Envío exitoso'
          };
        }

        const data = await response.json().catch(() => ({}));
        let errorMessage = 'No se pudo enviar, por favor intenta de nuevo.';

        if (data && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors.map((e) => e.message).join(', ');
        }

        return {
          success: false,
          message: errorMessage
        };
      } catch (err) {
        return {
          success: false,
          message: 'Error de conexión. Revisa tu acceso a internet e intenta nuevamente.'
        };
      }
    }
  }

  root.Creaweb.FormService = FormService;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormService;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
