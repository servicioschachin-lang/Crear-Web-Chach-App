/**
 * Catálogo de rubros y plantillas (SRP: Responsabilidad Única sobre la Definición de Datos del Catálogo)
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  root.Creaweb.RUBROS_DATA = Object.freeze([
    { n: "Restaurante", icon: "utensils", url: "" },
    { n: "Cafetería y panadería", icon: "coffee", url: "" },
    { n: "Tienda de ropa", icon: "shirt", url: "" },
    { n: "Salón de belleza", icon: "scissors", url: "https://spaweb.chach.app" },
    { n: "Clínica y salud", icon: "heart", url: "" },
    { n: "Abogados", icon: "scale", url: "" },
    { n: "Inmobiliaria", icon: "home", url: "" },
    { n: "Gimnasio", icon: "activity", url: "" },
    { n: "Hotel y turismo", icon: "bed", url: "" },
    { n: "Educación", icon: "cap", url: "" },
    { n: "Tecnología", icon: "laptop", url: "" },
    { n: "Fotografía", icon: "camera", url: "" },
    { n: "Construcción", icon: "building", url: "" },
    { n: "Automotriz", icon: "car", url: "" },
    { n: "Eventos", icon: "sparkles", url: "" },
    { n: "Ferretería", icon: "wrench", url: "" },
    { n: "Contabilidad", icon: "calculator", url: "" },
    { n: "Auditoría", icon: "clipboard", url: "" },
    { n: "Barbería", icon: "barber", url: "https://barberweb.chach.app" },
    { n: "Tours y viajes", icon: "compass", url: "" },
    { n: "Car wash", icon: "droplets", url: "" },
    { n: "Lavandería", icon: "washer", url: "" },
    { n: "Veterinaria", icon: "paw", url: "" },
    { n: "Farmacia", icon: "pill", url: "" },
    { n: "Transporte y logística", icon: "truck", url: "" },
    { n: "Tienda y minimarket", icon: "store", url: "" }
  ]);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.Creaweb.RUBROS_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
