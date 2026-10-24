/**
 * Servicio de Manejo y Normalización de URLs
 * Principios:
 *  - SRP: Responsable exclusivo de la validación, normalización y redirección de URLs.
 * 
 * Resuelve el error donde enlaces sin protocolo (ej: 'barberweb.chach.app')
 * eran tratados por el navegador como rutas relativas ('creaweb.chach.app/barberweb.chach.app').
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class UrlService {
    /**
     * Normaliza una URL asegurando que los dominios externos cuenten con su protocolo.
     * Si el usuario ingresa 'barberweb.chach.app', se convierte en 'https://barberweb.chach.app'.
     *
     * @param {string} rawUrl - URL o dominio ingresado
     * @returns {string} URL absoluta normalizada o ruta interna preservada
     */
    static normalize(rawUrl) {
      if (!rawUrl || typeof rawUrl !== 'string') {
        return '';
      }

      const trimmed = rawUrl.trim();
      if (!trimmed) {
        return '';
      }

      // Si ya cuenta con protocolo http/https o protocolo relativo //
      if (/^(https?:)?\/\//i.test(trimmed)) {
        return trimmed;
      }

      // Si es un ancla interna (#), ruta relativa (/), o esquema especial (mailto:, tel:)
      if (trimmed.startsWith('#') || trimmed.startsWith('/') || /^(mailto|tel|sms|javascript):/i.test(trimmed)) {
        return trimmed;
      }

      // Es un dominio o dirección web externa sin esquema (ej: 'barberweb.chach.app')
      // Se antepone 'https://' para forzar navegación al dominio destino y evitar ruta relativa
      return `https://${trimmed}`;
    }

    /**
     * Comprueba si una URL es navegable
     * @param {string} url
     * @returns {boolean}
     */
    static isValid(url) {
      return Boolean(this.normalize(url));
    }

    /**
     * Redirige al destino especificado de forma segura.
     *
     * @param {string} rawUrl - URL destino
     * @param {Object} [options]
     * @param {boolean} [options.newTab=false] - Abrir en nueva pestaña
     * @returns {boolean} true si se inició la navegación, false si la URL no es válida/está vacía
     */
    static navigate(rawUrl, options = {}) {
      const normalized = this.normalize(rawUrl);
      if (!normalized) {
        return false;
      }

      if (options.newTab) {
        window.open(normalized, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = normalized;
      }

      return true;
    }
  }

  root.Creaweb.UrlService = UrlService;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = UrlService;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
