/**
 * Catálogo de rubros y plantillas (SRP: Responsabilidad Única sobre la Definición de Datos del Catálogo)
 */
(function (root) {
  'use strict';

  root.Creaweb = root.Creaweb || {};

  root.Creaweb.RUBROS_DATA = Object.freeze([
    { n: "Restaurante", icon: "utensils", url: "https://restarweb.chach.app", plantillasCount: 50 },
    { n: "Cafetería", icon: "coffee", url: "https://cofweb.chach.app", plantillasCount: 40 },
    { n: "Panadería", icon: "utensils", url: "https://panweb.chach.app", plantillasCount: 30 },
    { n: "Tienda en linea", icon: "shirt", url: "https://ecomerweb.chach.app", plantillasCount: 60 },
    { n: "Salón de belleza", icon: "scissors", url: "https://spaweb.chach.app", plantillasCount: 35 },
    { n: "Clínica y salud", icon: "heart", url: "https://clinicweb.chach.app", plantillasCount: 55 },
    { n: "Bufet de Abogados", icon: "scale", url: "https://abogweb.chach.app", plantillasCount: 25 },
    { n: "Inmobiliaria y terrenos", icon: "home", url: "https://inmoweb.chach.app", plantillasCount: 14 },
    { n: "Gym", icon: "activity", url: "https://gymnweb.chach.app", plantillasCount: 6 },
    { n: "Hotel o Hospedaje", icon: "bed", url: "https://hospedweb.chach.app", plantillasCount: 10 },
    { n: "Establecimientos Educativos", icon: "cap", url: "https://eduweb.chach.app", plantillasCount: 13 },
    { n: "Fibra óptica yTecnología", icon: "laptop", url: "https://fibweb.chach.app", plantillasCount: 5 },
    { n: "Fotografo", icon: "camera", url: "https://fotogweb.chach.app", plantillasCount: 8 },
    { n: "Construcción", icon: "building", url: "https://construweb.chach.app", plantillasCount: 16 },
    { n: "Taller de Mecánica", icon: "car", url: "https://mecaweb.chach.app", plantillasCount: 9 },
    { n: "Locución yEventos", icon: "sparkles", url: "https://eventweb.chach.app", plantillasCount: 11 },
    { n: "Ferretería", icon: "wrench", url: "https://ferretweb.chach.app", plantillasCount: 10 },
    { n: "Oficina Contable", icon: "calculator", url: "https://ofiweb.chach.app", plantillasCount: 7 },
    { n: "Consultoría", icon: "clipboard", url: "https://consweb.chach.app", plantillasCount: 5 },
    { n: "Barbería", icon: "barber", url: "https://barberweb.chach.app", plantillasCount: 9 },
    { n: "Tours y viajes", icon: "compass", url: "https://toursweb.chach.app", plantillasCount: 14 },
    { n: "Car wash", icon: "droplets", url: "https://carweb.chach.app", plantillasCount: 6 },
    { n: "Lavandería", icon: "washer", url: "https://lavweb.chach.app", plantillasCount: 8 },
    { n: "Veterinaria", icon: "paw", url: "https://vetweb.chach.app", plantillasCount: 10 },
    { n: "Farmacia", icon: "pill", url: "https://farmaweb.chach.app", plantillasCount: 12 },
    { n: "Transporte y logística", icon: "truck", url: "https://transportweb.chach.app", plantillasCount: 15 },
    { n: "Miscelánea o minimarket", icon: "store", url: "https://Miscweb.chach.app", plantillasCount: 11 },
    { n: "Pet shop", icon: "paw", url: "https://petweb.chach.app", plantillasCount: 7 },
    { n: "Limpieza", icon: "droplets", url: "https://limpweb.chach.app", plantillasCount: 9 },
    { n: "Seguros", icon: "shield", url: "https://seguweb.chach.app", plantillasCount: 8 },
    { n: "Artesanías", icon: "pen", url: "https://artweb.chach.app", plantillasCount: 6 },
    { n: "Jardín y jardín", icon: "leaf", url: "https://gardennweb.chach.app", plantillasCount: 10 },
    { n: "Carpintería", icon: "building", url: "https://carperweb.chach.app", plantillasCount: 13 },
    { n: "Agro", icon: "seedling", url: "https://agroweb.chach.app", plantillasCount: 14 },
    { n: "Granja", icon: "paw", url: "https://granjaweb.chach.app", plantillasCount: 9 },
    { n: "Cevichería", icon: "droplets", url: "https://ceviweb.chach.app", plantillasCount: 8 },
    { n: "Electricista", icon: "zap", url: "https://elecweb.chach.app", plantillasCount: 10 },
    { n: "Bares", icon: "glasses", url: "https://barweb.chach.app", plantillasCount: 10 },
    { n: "Biblioteca", icon: "book", url: "https://libweb.chach.app", plantillasCount: 10 },
    { n: "Gimnasio CrossFit", icon: "dumbbell", url: "", plantillasCount: 8 },
    { n: "Pintor", icon: "pen", url: "https://pinweb.chach.app", plantillasCount: 9 },
    { n: "Reparación de equipos", icon: "wrench", url: "https://reparweb.chach.app", plantillasCount: 10 },
    { n: "Venta de celulares", icon: "phone", url: "https://celuweb.chach.app", plantillasCount: 12 }
  ]);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.Creaweb.RUBROS_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
