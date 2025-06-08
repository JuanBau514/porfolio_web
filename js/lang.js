const translations = {
  es: {
    greeting: "Hola, soy",
    name: "Juan Pablo Bautista",
    description: "Tecnólogo en Sistematización de Datos con experiencia en desarrollo de software web y móvil. He trabajado en proyectos reales con empresas, implementando soluciones en Laravel, React.js, Kotlin y Spring Boot. Enfocado en construir interfaces modernas, sistemas eficientes y procesos automatizados.",
    jobTitle1: "Tecnólogo en Sistematización de Datos &",
    jobTitle2: "Desarrollador Full Stack",
    specialization: "Especializado en desarrollo web, móvil y automatización de procesos.",
    experienceText: "Años de Experiencia",
    skill1: "DESARROLLO WEB",
    skillDesc1: "Desarrollo de interfaces con React.js, Next.js y Laravel. Creación de APIs RESTful con Spring Boot y PHP.",
    skill2: "DESARROLLO MÓVIL",
    skillDesc2: "Desarrollo de aplicaciones Android nativas con Kotlin. Integración con APIs y servicios en la nube.",
    skill3: "AUTOMATIZACIÓN",
    skillDesc3: "Web scraping, procesamiento de datos con expresiones regulares y automatización de procesos.",
    skill4: "BASES DE DATOS",
    skillDesc4: "Diseño e implementación de bases de datos en PostgreSQL, MySQL y MongoDB.",
    progress1: "JavaScript/React.js",
    progress2: "Laravel/PHP",
    progress3: "Kotlin/Android",
      contactTitle: "Contáctame",
    contactSubtitle: "Pongámonos en contacto",
    contactAvailability: "Estoy disponible para proyectos acordes a mis habilidades.",
    contactMethod: "Mi correo electrónico",
    formName: "Nombre",
    formPhone: "Teléfono",
    formEmail: "Correo electrónico",
    formMessage: "Escribe tu mensaje aquí",
    formButton: "Enviar Mensaje",
    formSuccess: "¡Mensaje enviado! Me pondré en contacto contigo pronto.",
    formError: "Error al enviar el mensaje. Por favor inténtalo de nuevo más tarde."
  },
  en: {
    greeting: "Hello, I am",
    name: "Juan Pablo Bautista",
    jobTitle1: "Data Systematization Technologist &",
    jobTitle2: "Full Stack Developer",
    specialization: "Specialized in web development, mobile applications and process automation.",
    experienceText: "Years of Experience",
    skill1: "WEB DEVELOPMENT",
    skillDesc1: "Interface development with React.js, Next.js and Laravel. RESTful API creation with Spring Boot and PHP.",
    skill2: "MOBILE DEVELOPMENT",
    skillDesc2: "Native Android app development with Kotlin. Integration with APIs and cloud services.",
    skill3: "AUTOMATION",
    skillDesc3: "Web scraping, data processing with regular expressions and process automation.",
    skill4: "DATABASES",
    skillDesc4: "Database design and implementation with PostgreSQL, MySQL and MongoDB.",
    progress1: "JavaScript/React.js",
    progress2: "Laravel/PHP",
    progress3: "Kotlin/Android",
    description: "Technologist in Data Systematization with experience in web and mobile software development. I have worked on real-world projects with companies, implementing solutions using Laravel, React.js, Kotlin, and Spring Boot. Focused on building modern interfaces, efficient systems, and automated processes.",
    contactTitle: "Contact Me",
    contactSubtitle: "Let's Get In Touch",
    contactAvailability: "I am available for projects according to my skills.",
    contactMethod: "My email address",
    formName: "Name",
    formPhone: "Phone",
    formEmail: "Email",
    formMessage: "Type your message here",
    formButton: "Send Message",
    formSuccess: "Message sent! I'll get back to you soon.",
    formError: "Error sending message. Please try again later.",

},

  pt: {
    greeting: "Olá, eu sou",
    name: "Juan Pablo Bautista",
    description: "Tecnólogo em Sistematização de Dados com experiência em desenvolvimento de software web e mobile. Atuei em projetos reais com empresas, implementando soluções com Laravel, React.js, Kotlin e Spring Boot. Foco em interfaces modernas, sistemas eficientes e processos automatizados.",
    jobTitle1: "Tecnólogo em Sistematização de Dados &",
    jobTitle2: "Desenvolvedor Full Stack",
    specialization: "Especializado em desenvolvimento web, aplicativos móveis e automação de processos.",
    experienceText: "Anos de Experiência",
    skill1: "DESENVOLVIMENTO WEB",
    skillDesc1: "Desenvolvimento de interfaces com React.js, Next.js e Laravel. Criação de APIs RESTful com Spring Boot e PHP.",
    skill2: "DESENVOLVIMENTO MÓVEL",
    skillDesc2: "Desenvolvimento de aplicativos Android nativos com Kotlin. Integração com APIs e serviços em nuvem.",
    skill3: "AUTOMAÇÃO",
    skillDesc3: "Web scraping, processamento de dados com expressões regulares e automação de processos.",
    skill4: "BANCOS DE DADOS",
    skillDesc4: "Projeto e implementação de bancos de dados com PostgreSQL, MySQL e MongoDB.",
    progress1: "JavaScript/React.js",
    progress2: "Laravel/PHP",
    progress3: "Kotlin/Android" ,
     contactTitle: "Contate-me",
    contactSubtitle: "Vamos entrar em contato",
    contactAvailability: "Estou disponível para projetos de acordo com minhas habilidades.",
    contactMethod: "Meu endereço de email",
    formName: "Nome",
    formPhone: "Telefone",
    formEmail: "Email",
    formMessage: "Digite sua mensagem aqui",
    formButton: "Enviar Mensagem",
    formSuccess: "Mensagem enviada! Entrarei em contato em breve.",
    formError: "Erro ao enviar mensagem. Por favor, tente novamente mais tarde.",

}
};

// Actualizar textos del formulario al cambiar idioma
function updateContactSection(lang) {
    const t = translations[lang] || translations['es']; // Fallback a español
    
    // Actualizar textos estáticos
    const contactTitle = document.getElementById('contact-title');
    const contactSubtitle = document.getElementById('contact-subtitle');
    const contactAvailability = document.getElementById('contact-availability');
    const contactMethod = document.getElementById('contact-method');
    
    if (contactTitle) contactTitle.textContent = t.contactTitle;
    if (contactSubtitle) contactSubtitle.textContent = t.contactSubtitle;
    if (contactAvailability) contactAvailability.textContent = t.contactAvailability;
    if (contactMethod) contactMethod.textContent = t.contactMethod;
    
    // Actualizar placeholders del formulario
    const nameInput = document.getElementById('name-input');
    const phoneInput = document.getElementById('phone-input');
    const emailInput = document.getElementById('email-input');
    const messageInput = document.getElementById('message-input');
    const submitBtn = document.getElementById('submit-btn');
    
    if (nameInput) nameInput.placeholder = t.formName;
    if (phoneInput) phoneInput.placeholder = t.formPhone;
    if (emailInput) emailInput.placeholder = t.formEmail;
    if (messageInput) messageInput.placeholder = t.formMessage;
    if (submitBtn) submitBtn.textContent = t.formButton;
}

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
  // Verificar si el idioma está soportado
  if (!translations[lang]) {
    console.warn(`Idioma no soportado: ${lang}`);
    return;
  }

  // Obtener las traducciones para el idioma seleccionado
  const t = translations[lang];

  // 1. Actualizar la sección principal (hero)
  document.getElementById("greeting").textContent = t.greeting;
  document.getElementById("name").textContent = t.name;
  document.getElementById("description").textContent = t.description;

  // 2. Actualizar la sección de habilidades (skills)
  document.getElementById('job-title-1').textContent = t.jobTitle1;
  document.getElementById('job-title-2').textContent = t.jobTitle2;
  document.getElementById('specialization').textContent = t.specialization;
  document.getElementById('experience-text').textContent = t.experienceText;
  
  // Actualizar habilidades y descripciones
  for (let i = 1; i <= 4; i++) {
    const skillElement = document.getElementById(`skill-${i}`);
    const descElement = document.getElementById(`skill-desc-${i}`);
    
    if (skillElement) skillElement.textContent = t[`skill${i}`];
    if (descElement) descElement.textContent = t[`skillDesc${i}`];
  }

  // Actualizar barras de progreso (solo texto)
  for (let i = 1; i <= 3; i++) {
    const progressElement = document.getElementById(`progress-${i}`);
    if (progressElement) {
      const percentage = progressElement.querySelector('.numscroller')?.textContent || '0';
      progressElement.innerHTML = `
        ${t[`progress${i}`]}<span class="float-right"><b class="numscroller">${percentage}</b>%</span>
      `;
    }
  }

  // 3. Actualizar el botón de idioma activo
  const flag = {'es': '🇪🇸', 'en': '🇺🇸', 'pt': '🇧🇷'};
  const activeLangButton = document.getElementById('active-language');
  if (activeLangButton) {
    activeLangButton.textContent = flag[lang] || '🌐';
  }

  // 4. Guardar preferencia (excepto en carga inicial automática)
  if (!initialLoad) {
    localStorage.setItem('preferredLanguage', lang);
    showLanguageNotification(lang);
  }

  // 5. Actualizar atributo de idioma para accesibilidad
  document.documentElement.lang = lang;

  // 6. Actualizar textos del formulario de contacto
      updateContactSection(lang);
}

// Función para inicializar el idioma al cargar la página
function initializeLanguage() {
  // 1. Verificar si hay un idioma guardado en localStorage
  const savedLang = localStorage.getItem('preferredLanguage');
  
  // 2. Si no hay idioma guardado, detectar el del navegador
  const langToLoad = savedLang || detectBrowserLanguage();
  
  // 3. Cargar el idioma (indicamos si es carga inicial)
  setLanguage(langToLoad, !savedLang);
  
  // 4. Configurar event listeners para los botones de idioma
  document.querySelectorAll('.language-options button').forEach(button => {
    button.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
    updateContactFormTexts(lang);
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', initializeLanguage);

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

// Manejo del formulario (similar a tu implementación actual)
document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('result');
    const currentLang = document.documentElement.lang || 'es';
    const t = translations[currentLang] || translations['es'];
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        if (typeof grecaptcha === 'undefined') {
            throw new Error('reCAPTCHA no está cargado');
        }
        
        const token = grecaptcha.getResponse();
        if (!token) {
            throw new Error(t.formErrorCaptcha || 'Por favor completa el reCAPTCHA');
        }

        const formData = {
            name: form.querySelector('#name-input').value.trim(),
            email: form.querySelector('#email-input').value.trim(),
            phone: form.querySelector('#phone-input')?.value.trim() || '',
            message: form.querySelector('#message-input').value.trim(),
            'g-recaptcha-response': token
        };

        if (!formData.name || !formData.email || !formData.message) {
            throw new Error(t.formErrorRequired || 'Campos requeridos faltantes');
        }

        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || t.formError);
        }

        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<div class="alert alert-success">${t.formSuccess}</div>`;
            form.reset();
            
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
            }
        } else {
            throw new Error(data.error || t.formError);
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = `<div class="alert alert-danger">${error.message || t.formError}</div>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = t.formButton;
        
        setTimeout(() => {
            resultDiv.innerHTML = '';
        }, 5000);
    }
});

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