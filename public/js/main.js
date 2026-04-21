/**
 * Les Samaritains (LSM) - Main JavaScript
 * Premium interactions and animations
 */

(function () {
    'use strict';

    // ==========================================================================
    // Configuration
    // ==========================================================================

    const CONFIG = {
        emailjs: {
            publicKey: '-RxwZb0vBaP6znrIx',
            serviceId: 'service_95wcqeh',
            templateId: 'template_wt5438o'
        },
        selectors: {
            loading: '.loading-screen',
            header: '.header',
            mobileMenuBtn: '.mobile-menu-btn',
            mobileNav: '.mobile-nav',
            mobileNavOverlay: '.mobile-nav-overlay',
            mobileNavClose: '.mobile-nav-close',
            mobileNavLinks: '.mobile-nav-link',
            contactForm: '#contactForm',
            revealElements: '.reveal'
        },
        scrollThreshold: 50
    };

    // ==========================================================================
    // Initialize on DOM Ready
    // ==========================================================================

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initLoadingScreen();
        initHeader();
        initMobileNav();
        initLanguageMenu();
        initContactForm();
        initScrollReveal();
        initSmoothScroll();
        initFooterLegalLinks();
        initCookieConsent();
        initVisitCounter();
    }

    // ==========================================================================
    // Loading Screen
    // ==========================================================================

    function initLoadingScreen() {
        const loading = document.querySelector(CONFIG.selectors.loading);
        if (!loading) return;

        // Hide on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 300);
        });

        // Fallback timeout
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 3000);
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================

    function initHeader() {
        const header = document.querySelector(CONFIG.selectors.header);
        if (!header) return;

        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;

            if (scrollY > CONFIG.scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateHeader();
    }

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================

    function initMobileNav() {
        const menuBtn = document.querySelector(CONFIG.selectors.mobileMenuBtn);
        const nav = document.querySelector(CONFIG.selectors.mobileNav);
        const overlay = document.querySelector(CONFIG.selectors.mobileNavOverlay);
        const closeBtn = document.querySelector(CONFIG.selectors.mobileNavClose);
        const links = document.querySelectorAll(CONFIG.selectors.mobileNavLinks);

        if (!menuBtn || !nav) return;

        const openNav = () => {
            nav.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeNav = () => {
            nav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        menuBtn.addEventListener('click', openNav);
        if (closeBtn) closeBtn.addEventListener('click', closeNav);
        if (overlay) overlay.addEventListener('click', closeNav);

        // Close on link click
        links.forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNav();
        });
    }

    // ==========================================================================
    // Language Menu
    // ==========================================================================

    function initLanguageMenu() {
        const menus = document.querySelectorAll('.language-menu');
        if (!menus.length) return;

        menus.forEach(menu => {
            menu.addEventListener('change', () => {
                const targetUrl = menu.value;
                if (targetUrl && targetUrl !== '#') {
                    window.location.href = targetUrl;
                }
            });
        });
    }

    // ==========================================================================
    // Contact Form (EmailJS)
    // ==========================================================================

    function initContactForm() {
        const form = document.querySelector(CONFIG.selectors.contactForm);
        if (!form) return;

        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.emailjs.publicKey);
        }

        form.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn?.textContent || 'Envoyer';

        // Prevent double submission
        if (submitBtn?.disabled) return;

        // Update button state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
        }

        try {
            if (typeof emailjs === 'undefined') {
                throw new Error('Service email non disponible');
            }

            await emailjs.sendForm(
                CONFIG.emailjs.serviceId,
                CONFIG.emailjs.templateId,
                form
            );

            // Success
            showNotification('Message envoyé avec succès !', 'success');
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    }

    function showNotification(message, type = 'info') {
        // Simple notification - can be enhanced with custom toast UI
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 16px 24px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 12px;
      font-weight: 500;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 10000;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }

    // ==========================================================================
    // Scroll Reveal Animation
    // ==========================================================================

    function initScrollReveal() {
        const elements = document.querySelectorAll(CONFIG.selectors.revealElements);
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        elements.forEach(el => observer.observe(el));
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ==========================================================================
    // Legal Links in Footer
    // ==========================================================================

    function initFooterLegalLinks() {
        const footerBottom = document.querySelector('.footer-bottom');
        if (!footerBottom || footerBottom.querySelector('.footer-legal-links')) return;

        const lang = document.documentElement.lang;
        const legalLinks = document.createElement('p');
        legalLinks.className = 'footer-legal-links';

        const labelsByLang = {
            en: {
                terms: 'Terms & Conditions',
                cookies: 'Cookies Policy',
                privacy: 'Privacy Policy',
                termsPath: './terms-en.html',
                cookiesPath: './cookies-en.html',
                privacyPath: './privacy-en.html'
            },
            ro: {
                terms: 'Termeni și condiții',
                cookies: 'Politica cookies',
                privacy: 'Politica de confidențialitate',
                termsPath: './terms-ro.html',
                cookiesPath: './cookies-ro.html',
                privacyPath: './privacy-ro.html'
            },
            es: {
                terms: 'Términos y condiciones',
                cookies: 'Política de cookies',
                privacy: 'Política de privacidad',
                termsPath: './terms-es.html',
                cookiesPath: './cookies-es.html',
                privacyPath: './privacy-es.html'
            },
            fr: {
                terms: 'Conditions générales',
                cookies: 'Politique de cookies',
                privacy: 'Politique de confidentialité',
                termsPath: './terms.html',
                cookiesPath: './cookies.html',
                privacyPath: './privacy.html'
            }
        };

        const labels = labelsByLang[lang] || labelsByLang.fr;

        legalLinks.innerHTML = `<a href="${labels.termsPath}">${labels.terms}</a> · <a href="${labels.cookiesPath}">${labels.cookies}</a> · <a href="${labels.privacyPath}">${labels.privacy}</a>`;
        footerBottom.appendChild(legalLinks);
    }

    // ==========================================================================
    // Cookie Consent Banner
    // ==========================================================================

    function initCookieConsent() {
        const STORAGE_KEY = 'lsm_cookie_consent';
        const savedChoice = localStorage.getItem(STORAGE_KEY);
        if (savedChoice === 'accepted' || savedChoice === 'rejected') return;

        const lang = document.documentElement.lang;

        const contentByLang = {
            en: {
                text: 'We use cookies to improve your browsing experience. You can accept or refuse non-essential cookies. ',
                linkText: 'Learn more',
                refuse: 'Refuse',
                accept: 'Accept',
                policyPath: './cookies-en.html'
            },
            ro: {
                text: 'Folosim cookies pentru a îmbunătăți experiența de navigare. Puteți accepta sau refuza cookies neesențiale. ',
                linkText: 'Află mai multe',
                refuse: 'Refuz',
                accept: 'Accept',
                policyPath: './cookies-ro.html'
            },
            es: {
                text: 'Usamos cookies para mejorar su experiencia de navegación. Puede aceptar o rechazar las cookies no esenciales. ',
                linkText: 'Más información',
                refuse: 'Rechazar',
                accept: 'Aceptar',
                policyPath: './cookies-es.html'
            },
            fr: {
                text: 'Nous utilisons des cookies pour améliorer votre navigation. Vous pouvez accepter ou refuser les cookies non essentiels. ',
                linkText: 'En savoir plus',
                refuse: 'Refuser',
                accept: 'Accepter',
                policyPath: './cookies.html'
            }
        };

        const i18n = contentByLang[lang] || contentByLang.fr;

        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <p class="cookie-banner-text">
                    ${i18n.text}
                    <a href="${i18n.policyPath}">${i18n.linkText}</a>
                </p>
                <div class="cookie-banner-actions">
                    <button type="button" class="cookie-btn cookie-btn-secondary" data-cookie-choice="rejected">
                        ${i18n.refuse}
                    </button>
                    <button type="button" class="cookie-btn cookie-btn-primary" data-cookie-choice="accepted">
                        ${i18n.accept}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        banner.querySelectorAll('[data-cookie-choice]').forEach(button => {
            button.addEventListener('click', () => {
                const choice = button.getAttribute('data-cookie-choice');
                localStorage.setItem(STORAGE_KEY, choice);
                banner.classList.add('hidden');
                setTimeout(() => banner.remove(), 250);
            });
        });
    }

    // ==========================================================================
    // Visit Counter (PHP endpoint)
    // ==========================================================================

    async function initVisitCounter() {
        const footerBottom = document.querySelector('.footer-bottom');
        if (!footerBottom) return;

        try {
            const response = await fetch('./counter.php', {
                cache: 'no-store',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) return;

            const payload = await response.json();
            if (!payload || payload.success !== true || !payload.counters) return;

            const lang = document.documentElement.lang;
            const { total, today } = payload.counters;

            const counterTextByLang = {
                en: `Visits: ${total} total · ${today} today`,
                ro: `Vizite: ${total} total · ${today} azi`,
                es: `Visitas: ${total} total · ${today} hoy`,
                fr: `Visites : ${total} total · ${today} aujourd'hui`
            };

            const counterText = counterTextByLang[lang] || counterTextByLang.fr;

            let counterElement = footerBottom.querySelector('.footer-visit-counter');
            if (!counterElement) {
                counterElement = document.createElement('p');
                counterElement.className = 'footer-text footer-visit-counter';
                footerBottom.appendChild(counterElement);
            }

            counterElement.textContent = counterText;
        } catch (error) {
            // Counter is optional in local/non-PHP environments.
            console.debug('Visit counter unavailable:', error);
        }
    }

})();
