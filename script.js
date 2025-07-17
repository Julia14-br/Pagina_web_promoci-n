// Variables globales
let currentSlideIndex = 0;
let autoSlideInterval;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const faqItems = document.querySelectorAll('.faq-item');

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initCarousel();
    initFAQ();
    initMobileMenu();
    initScrollToTop();
    initSmoothScroll();
    initAnimations();
    initFormValidation();
    
    // Iniciar auto slide
    startAutoSlide();
    
    // Precargar imágenes
    preloadImages();
    
    // Mostrar estadísticas de depuración
    showPageStats();
    
});

// Función para inicializar el carrusel
function initCarousel() {
    if (slides.length > 0) {
        showSlide(currentSlideIndex);
        setupCarouselEvents();
    }
}

// Función para mostrar un slide específico
function showSlide(index) {
    // Validar índice
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    // Ocultar todos los slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Quitar active de todos los dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Mostrar slide actual
    slides[currentSlideIndex].classList.add('active');
    
    // Activar dot correspondiente
    if (dots.length > currentSlideIndex) {
        dots[currentSlideIndex].classList.add('active');
    }
    
    // Actualizar contador
    updateSlideCounter();
}

// Función para configurar eventos del carrusel
function setupCarouselEvents() {
    // Botones de navegación
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            changeSlide(-1);
            pauseAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            changeSlide(1);
            pauseAutoSlide();
        });
    }
    
    // Dots de navegación
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlideIndex = index - 1;
            changeSlide(1);
            pauseAutoSlide();
        });
    });
    
    // Eventos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
            pauseAutoSlide();
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
            pauseAutoSlide();
        }
    });
    
    // Soporte para gestos táctiles
    setupTouchEvents();
}

// Función para cambiar slide
function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
}

// Función para actualizar contador de slides
function updateSlideCounter() {
    const counter = document.querySelector('.slide-counter');
    if (counter) {
        counter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
    }
}

// Función para auto slide
function startAutoSlide() {
    if (slides.length > 1) {
        autoSlideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
}

// Función para pausar auto slide
function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
    // Reiniciar después de 10 segundos de inactividad
    setTimeout(() => {
        startAutoSlide();
    }, 10000);
}

// Función para configurar eventos táctiles
function setupTouchEvents() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    let startX = 0;
    let startY = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Solo si el movimiento horizontal es mayor que el vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) { // Mínimo 50px de desplazamiento
                if (diffX > 0) {
                    changeSlide(1); // Deslizar hacia la izquierda = siguiente
                } else {
                    changeSlide(-1); // Deslizar hacia la derecha = anterior
                }
                pauseAutoSlide();
            }
        }
    }, { passive: true });
}

// Función para inicializar FAQ
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Cerrar otros items
                if (!item.classList.contains('active')) {
                    faqItems.forEach(i => {
                        if (i !== item) i.classList.remove('active');
                    });
                }
                
                // Alternar item actual
                item.classList.toggle('active');
            });
        }
    });
}

// Función para inicializar menú móvil
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Alternar icono
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
        
        // Cerrar menú al hacer clic en enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            });
        });
    }
}

// Función para inicializar scroll to top
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('active');
        } else {
            scrollBtn.classList.remove('active');
        }
    });
}

// Función para inicializar scroll suave
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                // Cerrar menú móvil si está abierto
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
                
                // Calcular posición considerando el header fijo
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para inicializar animaciones
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Función para inicializar validación de formulario
function initFormValidation() {
    const form = document.getElementById('formContacto');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos
        let isValid = true;
        const nombre = form.querySelector('#nombre');
        const email = form.querySelector('#email');
        const mensaje = form.querySelector('#mensaje');
        
        if (nombre.value.trim() === '') {
            showError(nombre, 'Por favor ingresa tu nombre');
            isValid = false;
        }
        
        if (email.value.trim() === '' || !isValidEmail(email.value)) {
            showError(email, 'Por favor ingresa un email válido');
            isValid = false;
        }
        
        if (mensaje.value.trim() === '') {
            showError(mensaje, 'Por favor ingresa tu mensaje');
            isValid = false;
        }
        
        if (isValid) {
            // Simular envío
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado con éxito';
                form.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        }
    });
    
    // Limpiar errores al enfocar
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', () => {
            clearError(input);
        });
    });
}

// Función para mostrar error en campo
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = 'var(--danger-color)';
}

// Función para limpiar error
function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = '#e2e8f0';
}

// Función para validar email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Función para precargar imágenes
function preloadImages() {
    const imageUrls = [
        'images/hero-bg.jpg',
        'images/proyecto1.jpg',
        'images/proyecto2.jpg',
        'images/proyecto3.jpg',
        'images/estudiante1.jpg',
        'images/estudiante2.jpg',
        'images/estudiante3.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Función para mostrar estadísticas de depuración
function showPageStats() {
    const stats = {
        'Total Slides': document.querySelectorAll('.carousel-slide').length,
        'FAQ Items': document.querySelectorAll('.faq-item').length,
        'Cards': document.querySelectorAll('.especialidad-card').length,
        'Is Mobile': window.innerWidth <= 768,
        'Screen Width': `${window.innerWidth}px`,
        'Screen Height': `${window.innerHeight}px`
    };
    
    console.group('📊 Page Statistics');
    console.table(stats);
    console.groupEnd();
}

// Detectar cambios de tamaño de pantalla
window.addEventListener('resize', () => {
    // Actualizar menú móvil si es necesario
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768 && navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon && icon.classList.contains('fa-times')) {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    }
});

// Mostrar mensaje de carga completada
window.addEventListener('load', () => {
    console.log('🚀 TechBachi - Página completamente cargada');
});

