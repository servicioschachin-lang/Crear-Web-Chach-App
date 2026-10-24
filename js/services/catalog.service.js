/**
 * Servicio de Catálogo de Rubros
 * Principios:
 *  - SRP: Responsabilidad exclusiva sobre la lógica de consulta, filtrado y búsqueda de rubros.
 *  - DIP: Depende de una fuente de datos inyectada en lugar de acceder a variables acopladas.
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  class CatalogService {
    /**
     * @param {Array<Object>} [items] - Lista de rubros
     */
    constructor(items = []) {
      this.items = Array.isArray(items) ? items : [];
    }

    /**
     * Normaliza un string para comparaciones ignorando acentos y mayúsculas
     * @param {string} text
     * @returns {string}
     */
    static normalizeString(text) {
      if (!text || typeof text !== 'string') return '';
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Retorna todos los rubros
     * @returns {Array<Object>}
     */
    getAll() {
      return [...this.items];
    }

    /**
     * Filtra los rubros por término de búsqueda
     * @param {string} query
     * @returns {Array<Object>}
     */
    filter(query = '') {
      const cleanQuery = CatalogService.normalizeString(query.trim());
      if (!cleanQuery) {
        return this.getAll();
      }

      return this.items.filter((item) => {
        const normalizedName = CatalogService.normalizeString(item.n);
        return normalizedName.includes(cleanQuery);
      });
    }

    /**
     * Obtiene un rubro por su índice
     * @param {number} index
     * @returns {Object|null}
     */
    getAt(index) {
      return this.items[index] || null;
    }
  }

  root.Creaweb.CatalogService = CatalogService;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatalogService;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
