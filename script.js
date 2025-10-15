(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resetScrollRestoration = () => {
        try {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
        } catch (error) {
        }
    };

    const scrollToTopOnLoad = () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const setupScrollTopButton = () => {
        const scrollTopBtn = document.getElementById('scrollTop');
        if (!scrollTopBtn) {
            return;
        }

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(() => {
                const shouldShow = window.pageYOffset > 300;
                scrollTopBtn.classList.toggle('visible', shouldShow);
                ticking = false;
            });
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    const setupPrimaryLinks = () => {
        const primaryLinks = document.querySelectorAll('.btn-link:not(.btn-secondary)');
        if (!primaryLinks.length) {
            return;
        }

        primaryLinks.forEach((link) => {
            const originalMarkup = link.innerHTML;

            link.addEventListener('click', () => {
                if (link.classList.contains('is-loading')) {
                    return;
                }

                link.classList.add('is-loading');
                link.innerHTML = '<span class="loading"></span>';
                link.setAttribute('aria-busy', 'true');

                window.setTimeout(() => {
                    link.innerHTML = originalMarkup;
                    link.classList.remove('is-loading');
                    link.removeAttribute('aria-busy');
                }, 1000);
            });
        });
    };

    const setupProductCards = () => {
        const cards = document.querySelectorAll('.product-card');
        if (!cards.length) {
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationsEnabled = !prefersReducedMotion && 'IntersectionObserver' in window;
        const observer = animationsEnabled
            ? new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                });
            }, observerOptions)
            : null;

        cards.forEach((card) => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    const link = card.querySelector('.btn-link');
                    if (link) {
                        link.click();
                    }
                }
            });

            if (observer) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
                return;
            }

            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    };

    const init = () => {
        resetScrollRestoration();
        setupScrollTopButton();
        setupPrimaryLinks();
        setupProductCards();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', scrollToTopOnLoad);
})();
