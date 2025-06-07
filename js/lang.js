const translations = {
  es: {
    greeting: "Hola, soy",
    name: "Juan Pablo Bautista",
    description: "Tecnólogo en Sistematización de Datos con experiencia en desarrollo de software web y móvil. He trabajado en proyectos reales con empresas, implementando soluciones en Laravel, React.js, Kotlin y Spring Boot. Enfocado en construir interfaces modernas, sistemas eficientes y procesos automatizados."
  },
  en: {
    greeting: "Hello, I am",
    name: "Juan Pablo Bautista",
    description: "Technologist in Data Systematization with experience in web and mobile software development. I have worked on real-world projects with companies, implementing solutions using Laravel, React.js, Kotlin, and Spring Boot. Focused on building modern interfaces, efficient systems, and automated processes."
  },
  pt: {
    greeting: "Olá, eu sou",
    name: "Juan Pablo Bautista",
    description: "Tecnólogo em Sistematização de Dados com experiência em desenvolvimento de software web e mobile. Atuei em projetos reais com empresas, implementando soluções com Laravel, React.js, Kotlin e Spring Boot. Foco em interfaces modernas, sistemas eficientes e processos automatizados."
  }
};

// Función para detectar idioma del navegador
function detectBrowserLanguage() {
  const browserLanguages = navigator.languages ? [...navigator.languages] : [];
  if (navigator.language) browserLanguages.push(navigator.language);
  if (navigator.userLanguage) browserLanguages.push(navigator.userLanguage);
  
  const uniqueLanguages = [...new Set(browserLanguages.map(lang => lang.split('-')[0].toLowerCase()))];
  
  for (const lang of uniqueLanguages) {
    if (translations[lang]) {
      return lang;
    }
  }
  return 'es';
}

// Función principal para cambiar idioma
function setLanguage(lang, initialLoad = false) {
  if (!translations[lang]) {
    console.warn(`Idioma no soportado: ${lang}`);
    return;
  }
  
  // Actualizar contenido
  document.getElementById("greeting").textContent = translations[lang].greeting;
  document.getElementById("name").textContent = translations[lang].name;
  document.getElementById("description").textContent = translations[lang].description;
  
  // Actualizar botón activo
  const flag = {'es': '🇪🇸', 'en': '🇺🇸', 'pt': '🇧🇷'};
  document.getElementById('active-language').textContent = flag[lang] || '🌐';
  
  // Guardar preferencia (excepto en carga inicial automática)
  if (!initialLoad) {
    localStorage.setItem('preferredLanguage', lang);
    showLanguageNotification(lang);
  }
  
  // Actualizar atributo de idioma para accesibilidad
  document.documentElement.lang = lang;
}

// Mostrar notificación
function showLanguageNotification(lang) {
  const langNames = {'es': 'Español', 'en': 'English', 'pt': 'Português'};
  const notification = document.createElement('div');
  notification.className = 'language-notification';
  notification.textContent = `Idioma cambiado a ${langNames[lang]}`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  // Cargar idioma guardado o detectar automáticamente
  const savedLang = localStorage.getItem('preferredLanguage');
  setLanguage(savedLang || detectBrowserLanguage(), !savedLang);
  
  // Configurar eventos para los botones de idioma
  document.querySelectorAll('.language-options button').forEach(button => {
    button.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
});

// Añadir CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
  .language-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(style);