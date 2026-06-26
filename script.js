document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header & Scroll Progress ---
    const header = document.querySelector('header');
    const progressBar = document.querySelector('.scroll-progress');
    const scrollTopBtn = document.querySelector('.widget-scrolltop');

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Sticky Header Class
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }

        // Scroll to Top Button Visibility
        if (scrollTopBtn) {
            if (scrollTop > 400) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled

    // Scroll to Top action
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            body.classList.toggle('mobile-nav-active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== mobileToggle) {
                navMenu.classList.remove('open');
                body.classList.remove('mobile-nav-active');
            }
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                body.classList.remove('mobile-nav-active');
            });
        });
    }

    // --- Active Menu Link Highlight ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Intersection Observer for Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once animated, we don't need to observe it again
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-body').style.maxHeight = null;
            });

            // Toggle selected item
            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.faq-body');
                const content = item.querySelector('.faq-content');
                // Calculate height dynamically
                body.style.maxHeight = content.scrollHeight + 50 + 'px';
            }
        });
    });

    // --- WhatsApp Dynamic Inquiry Hook ---
    const inquiryBtns = document.querySelectorAll('.btn-inquiry');
    inquiryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = btn.getAttribute('data-product') || 'spices';
            const baseMobile = '7827539302';
            const message = encodeURIComponent(`Hi Vamika Spices, I am interested in purchasing ${productName}. Please share pricing and packaging options. Thank you!`);
            const whatsappUrl = `https://wa.me/91${baseMobile}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    // --- Contact Form frontend Validation ---
    const contactForm = document.getElementById('contact-form');
    const successBanner = document.getElementById('success-banner');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Reset error states
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('error'));

            // Validate Name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            }

            // Validate Phone
            const phoneVal = phoneInput.value.trim();
            const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian mobile regex (10 digits starting with 6-9)
            if (!phoneVal) {
                showError(phoneInput, 'Phone number is required');
                isValid = false;
            } else if (!phoneRegex.test(phoneVal)) {
                showError(phoneInput, 'Please enter a valid 10-digit mobile number');
                isValid = false;
            }

            // Validate Email (Optional, but if filled, must be valid)
            const emailVal = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailVal && !emailRegex.test(emailVal)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message cannot be empty');
                isValid = false;
            }

            if (isValid) {
                // If form is valid, show custom success message
                successBanner.style.display = 'flex';
                contactForm.reset();
                
                // Scroll banner into view
                successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Hide banner after 8 seconds
                setTimeout(() => {
                    successBanner.style.display = 'none';
                }, 8000);
            }
        });
    }

    function showError(inputElement, errorMessage) {
        const formGroup = inputElement.closest('.form-group');
        const errorSpan = formGroup.querySelector('.form-error-msg');
        if (formGroup && errorSpan) {
            formGroup.classList.add('error');
            errorSpan.textContent = errorMessage;
        }
    }
});
