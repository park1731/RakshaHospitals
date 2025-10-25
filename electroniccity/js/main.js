/* ========================================
   RAKSHA HOSPITAL - MAIN JAVASCRIPT
   Interactive Features and Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Function to get correct base path for navigation
    function getBasePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/specialities/')) {
            return '../';
        }
        return './';
    }
    
    // Preloader functionality - show on page refresh, not on navigation
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Check if this is a page refresh (not navigation)
        const isPageRefresh = performance.navigation.type === 1 || 
                             (performance.getEntriesByType('navigation')[0] && 
                              performance.getEntriesByType('navigation')[0].type === 'reload');
        
        if (isPageRefresh) {
            // Page refresh - show preloader
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Remove from DOM after enhanced exit animation completes
                setTimeout(() => {
                    if (preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 800); // Match the exit animation duration
            }, 2000); // 2 seconds delay
        } else {
            // Navigation within website - hide immediately
            preloader.style.display = 'none';
        }
    }
    
    // Desktop-only dropdown toggle (disable old mobile popup)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    function attachDesktopMenuToggle(){
        if (!hamburger || !navMenu) return;
        // On mobile, force-close and do nothing (new drawer handles nav)
        if (window.innerWidth <= 768){
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            return;
        }
        // Desktop-only: simple toggle
        hamburger.addEventListener('click', function(){
            navMenu.classList.toggle('active');
        }, { once: true });
    }
    attachDesktopMenuToggle();
    window.addEventListener('resize', attachDesktopMenuToggle);
    
    // Mobile drawer open/close with hamburger/close button toggle
    (function(){
        const btn = document.querySelector('.hamburger');
        const drawer = document.getElementById('mobile-drawer');
        const overlay = document.getElementById('mobile-overlay');
        const closeBtn = drawer ? drawer.querySelector('.mobile-drawer__close') : null;
        if (!btn || !drawer || !overlay) return;
        
        const open = () => { 
            drawer.classList.add('open'); 
            overlay.classList.add('open'); 
            document.body.style.overflow='hidden';
            // Transform hamburger to close button
            btn.classList.add('active');
            // Hide quick actions bar with smooth animation when menu is open
            const actionBar = document.querySelector('.permanent-action-bar');
            if (actionBar) {
                actionBar.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                actionBar.style.transform = 'translateY(100%)';
                actionBar.style.opacity = '0';
                // Hide after animation completes
                setTimeout(() => {
                    actionBar.style.visibility = 'hidden';
                }, 400);
            }
        };
        
        const close = () => { 
            drawer.classList.remove('open'); 
            overlay.classList.remove('open'); 
            document.body.style.overflow='';
            // Transform close button back to hamburger
            btn.classList.remove('active');
            // Show quick actions bar with smooth animation when menu is closed
            const actionBar = document.querySelector('.permanent-action-bar');
            if (actionBar) {
                actionBar.style.visibility = 'visible';
                actionBar.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                actionBar.style.transform = 'translateY(0)';
                actionBar.style.opacity = '1';
            }
        };
        
        btn.addEventListener('click', (e)=>{ 
            if (window.innerWidth <= 768){ 
                e.preventDefault(); 
                if (btn.classList.contains('active')) {
                    close();
                } else {
                    open();
                }
            }
        });
        
        closeBtn && closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', close);
        window.addEventListener('resize', ()=>{ if (window.innerWidth > 768) close(); });
    })();
    
    // Mobile dropdown functionality
    (function(){
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown-toggle');
        mobileDropdowns.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.mobile-dropdown');
                const isActive = dropdown.classList.contains('active');
                
                // Close all other dropdowns
                document.querySelectorAll('.mobile-dropdown').forEach(d => {
                    d.classList.remove('active');
                });
                
                // Toggle current dropdown
                if (!isActive) {
                    dropdown.classList.add('active');
                }
            });
        });
    })();
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header Scroll Effect with New Dark Theme
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add hover effects to navigation items
    const navItems = document.querySelectorAll('.nav-menu li');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'linkPulse 0.6s ease-in-out';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
    
    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
    

    
    // Testimonials Slider (arrows, dots, swipe, pause on hover)
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    const totalSlides = testimonials.length;
    const slider = document.querySelector('.testimonials-slider');
    let autoTimer = null;

    function showSlide(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        // update dots
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    // Hero slider: auto-rotate without animation (instant switch)
    (function initFeatureCarousel(){
        const carousel = document.querySelector('.feature-carousel');
        if (!carousel) return;
        const track = carousel.querySelector('.fc-track');
        const slides = Array.from(carousel.querySelectorAll('.fc-slide'));
        const dotsWrap = carousel.querySelector('.fc-dots');
        const prevBtn = carousel.querySelector('.fc-prev');
        const nextBtn = carousel.querySelector('.fc-next');
        if (!track || slides.length === 0 || !dotsWrap) return;

        // stack and fade
        slides.forEach((s, i) => { s.style.position = 'absolute'; s.style.inset = '0'; s.style.opacity = i===0 ? '1':'0'; });

        // dots
        dotsWrap.innerHTML = '';
        slides.forEach((_, i) => {
            const b = document.createElement('button');
            b.className = i===0 ? 'active' : '';
            b.setAttribute('aria-label', `Go to slide ${i+1}`);
            b.addEventListener('click', () => { current = i; render(); restart(); });
            dotsWrap.appendChild(b);
        });

        let current = 0;
        let timer = null;
        function render(){
            slides.forEach((s,i)=>{ const a=i===current; s.style.opacity=a?'1':'0'; s.classList.toggle('active', a); });
            dotsWrap.querySelectorAll('button').forEach((d,i)=> d.classList.toggle('active', i===current));
        }
        function next(){ current = (current+1)%slides.length; render(); }
        function prev(){ current = (current-1+slides.length)%slides.length; render(); }
        function start(){ stop(); timer = setInterval(next, 14000); }
        function stop(){ if (timer) clearInterval(timer); timer=null; }
        function restart(){ stop(); start(); }

        prevBtn && prevBtn.addEventListener('click', ()=>{ prev(); restart(); });
        nextBtn && nextBtn.addEventListener('click', ()=>{ next(); restart(); });

        // pause on hover
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);

        // swipe
        let sx=0, ex=0; carousel.addEventListener('touchstart', e=>{ sx=e.changedTouches[0].screenX; });
        carousel.addEventListener('touchend', e=>{ ex=e.changedTouches[0].screenX; const dx=ex-sx; if(Math.abs(dx)>40){ if(dx<0) next(); else prev(); restart(); }});

        // Initialize action segments functionality (Desktop Quick Action Panel only)
        function initActionSegments() {
            // Only handle desktop quick action panel, not mobile action bar
            const actionSegments = document.querySelectorAll('.quick-action-panel .quick-action-item');
            
            actionSegments.forEach(segment => {
                segment.addEventListener('click', function() {
                    const actionType = this.getAttribute('data-action');
                    
                    // Add click animation
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                    
                    // Handle different action types
                    switch(actionType) {
                        case 'appointment':
                            // Redirect to appointment page
                            window.location.href = getBasePath() + 'appointment.html?source=quick-action';
                            break;
                            
                        case 'emergency':
                            // Redirect to contact page
                            window.location.href = getBasePath() + 'contact.html';
                            break;
                            
                        case 'social-media':
                            // Show social media modal
                            showSocialMediaModal();
                            break;
                            
                        default:
                            console.log('Unknown action type:', actionType);
                    }
                });
            });
        }
        
        // Function to show hospital selection
        function showHospitalSelection() {
            // Create a simple modal for hospital selection
            const modal = document.createElement('div');
            modal.className = 'hospital-selection-modal';
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <h3>Select Hospital Branch</h3>
                        <div class="hospital-options">
                            <button class="hospital-option" data-branch="electroniccity">
                                <span class="hospital-icon">🏥</span>
                                <span class="hospital-name">Electronic City Branch</span>
                            </button>
                            <button class="hospital-option" data-branch="kudlu">
                                <span class="hospital-icon">🏥</span>
                                <span class="hospital-name">Kudlu Branch</span>
                            </button>
                        </div>
                        <button class="modal-close">✕</button>
                    </div>
                </div>
            `;
            
            // Add modal styles
            const modalStyles = document.createElement('style');
            modalStyles.textContent = `
                .hospital-selection-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    position: relative;
                    max-width: 400px;
                    width: 90%;
                }
                .modal-content h3 {
                    margin: 0 0 1.5rem 0;
                    color: #2c3e50;
                    text-align: center;
                }
                .hospital-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .hospital-option {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border: 2px solid #e1e8ed;
                    border-radius: 12px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .hospital-option:hover {
                    border-color: var(--primary-blue);
                    background: var(--light-blue);
                    transform: translateY(-2px);
                }
                .hospital-icon {
                    font-size: 1.5rem;
                }
                .hospital-name {
                    font-weight: 600;
                    color: #2c3e50;
                }
                .modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #7f8c8d;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                .modal-close:hover {
                    background: #f8f9fa;
                    color: #2c3e50;
                }
            `;
            
            document.head.appendChild(modalStyles);
            document.body.appendChild(modal);
            
            // Handle hospital selection
            const hospitalOptions = modal.querySelectorAll('.hospital-option');
            hospitalOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const branch = this.getAttribute('data-branch');
                    console.log('Selected hospital branch:', branch);
                    
                    // Close modal
                    modal.remove();
                    
                    // Redirect to selected branch
                    if (branch === 'kudlu') {
                        window.location.href = '../kudlu/index.html';
                    } else if (branch === 'electroniccity') {
                        window.location.href = getBasePath() + 'index.html';
                    } else {
                        // Fallback to appointment page with branch parameter
                        window.location.href = `appointment.html?branch=${branch}`;
                    }
                });
            });
            
            // Handle modal close
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => modal.remove());
            
            // Close modal when clicking overlay
            modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    modal.remove();
                }
            });
        }

        // Initialize the carousel
        render();
        start();
        
        // Initialize action segments after a short delay to ensure DOM is ready
        setTimeout(initActionSegments, 100);
    })();

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(nextSlide, 5000);
    }

    function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
    }

    if (totalSlides > 0 && slider) {
        // initial show
        showSlide(0);

        // arrows
        if (totalSlides > 1) {
            const prevBtn = document.createElement('button');
            const nextBtn = document.createElement('button');
            prevBtn.innerHTML = '&#10094;';
            nextBtn.innerHTML = '&#10095;';
            prevBtn.className = 'slider-nav prev';
            nextBtn.className = 'slider-nav next';
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
            slider.appendChild(prevBtn);
            slider.appendChild(nextBtn);

            // dots
            const dotsWrap = slider.querySelector('.slider-dots') || document.createElement('div');
            dotsWrap.className = 'slider-dots';
            dotsWrap.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentSlide = i;
                    showSlide(currentSlide);
                });
                dotsWrap.appendChild(dot);
            }
            if (!slider.querySelector('.slider-dots')) slider.appendChild(dotsWrap);

            // auto
            startAuto();

            // pause on hover
            slider.addEventListener('mouseenter', stopAuto);
            slider.addEventListener('mouseleave', startAuto);

            // swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const dx = touchEndX - touchStartX;
                if (Math.abs(dx) > 40) {
                    if (dx < 0) nextSlide(); else prevSlide();
                }
            });
        }
    }
    
    // Form Validation and Submission
    const appointmentForm = document.getElementById('appointmentForm');
    const contactForm = document.getElementById('contactForm');
    
    // Appointment Form Handling
    if (appointmentForm) {
        // Set min date to tomorrow (replaces PHP min date)
        const appointmentDateInput = document.getElementById('appointment_date');
        if (appointmentDateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const dd = String(tomorrow.getDate()).padStart(2, '0');
            appointmentDateInput.min = `${yyyy}-${mm}-${dd}`;
        }

        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitAppointmentForm(this);
            }
        });
    }
    
    // Contact Form Handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitContactForm(this);
            }
        });
    }
    
    // Form Validation Function
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(input);
                
                // Email validation
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        showFieldError(input, 'Please enter a valid email address');
                        isValid = false;
                    }
                }
                
                // Phone validation
                if (input.name === 'phone' && input.value) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                        showFieldError(input, 'Please enter a valid phone number');
                        isValid = false;
                    }
                }
            }
        });
        
        return isValid;
    }
    
    // Show Field Error
    function showFieldError(input, message) {
        clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#dc3545';
    }
    
    // Clear Field Error
    function clearFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }
    
    // Submit Appointment Form
    function submitAppointmentForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        
        fetch('php/submit_appointment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Appointment request submitted successfully! We will contact you soon.', 'success');
                form.reset();
            } else {
                showMessage(data.message || 'Something went wrong. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Submit Contact Form
    function submitContactForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        
        fetch('php/submit_contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Message sent successfully! We will get back to you soon.', 'success');
                form.reset();
            } else {
                showMessage(data.message || 'Something went wrong. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Show Message Function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert message after the form
        const form = document.querySelector('.form-container form');
        if (form) {
            form.parentNode.insertBefore(messageDiv, form);
        }
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    // Lazy Loading for Images
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Smooth Section Transitions
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    // Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '&#8593;';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects for back to top button
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    });
    
    // Initialize tooltips for service icons
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title') || 'Service';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--dark-gray);
                color: white;
                padding: 0.5rem;
                border-radius: 5px;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => tooltip.style.opacity = '1', 10);
            
            this.addEventListener('mouseleave', function() {
                tooltip.remove();
            }, { once: true });
        });
    });
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Handle scroll-based animations here
    }, 16); // ~60fps
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    console.log('Raksha Hospital website initialized successfully!');

    // Floating Book Widget
    (function initBookWidget(){
        const widget = document.querySelector('.book-widget');
        if (!widget) return;
        const tab = widget.querySelector('.book-tab');
        const panel = widget.querySelector('.book-panel');

        // ensure initial closed state
        widget.classList.remove('open');

        // toggle open/close on tab click
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            widget.classList.toggle('open');
        });

        // close when clicking outside the panel or tab
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !tab.contains(e.target)) {
                widget.classList.remove('open');
            }
        });

        // close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') widget.classList.remove('open');
        });
    })();

    // DoctorsV2 mobile carousel controls (isolated)
    (function initDoctorsV2Carousel(){
        const track = document.querySelector('.doctorsV2__track');
        const prev = document.querySelector('.doctorsV2__prev');
        const next = document.querySelector('.doctorsV2__next');
        if (!track) return;
        const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

        function scrollByViewport(dir){
            if (!isMobile()) return;
            const w = track.getBoundingClientRect().width;
            track.scrollBy({ left: dir * w, behavior: 'smooth' });
        }

        prev && prev.addEventListener('click', () => scrollByViewport(-1));
        next && next.addEventListener('click', () => scrollByViewport(1));

        // auto slide
        let timer = null;
        function start(){ stop(); if (isMobile()) timer = setInterval(()=>scrollByViewport(1), 4000); }
        function stop(){ if (timer) clearInterval(timer); timer = null; }
        start();
        window.addEventListener('resize', start);
        track.addEventListener('mouseenter', stop);
        track.addEventListener('mouseleave', start);
    })();

    // Hero slider section (fade carousel without resizing)
    (function initHeroSliderSection(){
        const section = document.querySelector('.hero-slider-section');
        if (!section) return;

        const container = section.querySelector('.hero-slider-container');
        const track = section.querySelector('.hero-slider-track');
        const slides = Array.from(section.querySelectorAll('.hero-slider-slide'));
        const dots = Array.from(section.querySelectorAll('.hero-slider-dot'));
        const prevBtn = section.querySelector('.hero-slider-prev');
        const nextBtn = section.querySelector('.hero-slider-next');

        if (!track || slides.length === 0) return;

        // Stack slides on top of each other and fade between them
        track.style.position = 'relative';
        slides.forEach((slide, i) => {
            slide.style.position = 'absolute';
            slide.style.inset = '0';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.opacity = i === 0 ? '1' : '0';
            slide.style.transition = 'opacity 700ms ease';
        });

        let current = 0;
        let autoTimer = null;

        function setActive(index) {
            slides.forEach((s, i) => {
                s.style.opacity = i === index ? '1' : '0';
                s.classList.toggle('active', i === index);
            });
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        }

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            setActive(current);
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAuto() { stopAuto(); autoTimer = setInterval(next, 4000); }
        function stopAuto() { if (autoTimer) clearInterval(autoTimer); autoTimer = null; }

        // dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { goTo(i); startAuto(); });
        });

        // arrows
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

        // pause on hover
        const hoverTarget = container || section;
        hoverTarget.addEventListener('mouseenter', stopAuto);
        hoverTarget.addEventListener('mouseleave', startAuto);

        // Enhanced touch swipe with haptic feedback
        let sx = 0, sy = 0, ex = 0, ey = 0;
        let startTime = 0;
        
        hoverTarget.addEventListener('touchstart', (e) => { 
            sx = e.changedTouches[0].screenX; 
            sy = e.changedTouches[0].screenY;
            startTime = Date.now();
        });
        
        hoverTarget.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent default scrolling
        }, { passive: false });
        
        hoverTarget.addEventListener('touchend', (e) => {
            ex = e.changedTouches[0].screenX; 
            ey = e.changedTouches[0].screenY;
            const dx = ex - sx;
            const dy = ey - sy;
            const duration = Date.now() - startTime;
            
            // Check if it's a horizontal swipe (not vertical scroll)
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50 && duration < 500) {
                if (dx < 0) {
                    next(); 
                    // Haptic feedback for next
                    if (navigator.vibrate) navigator.vibrate(50);
                } else {
                    prev(); 
                    // Haptic feedback for previous
                    if (navigator.vibrate) navigator.vibrate(50);
                }
                startAuto();
            }
        });

        // init
        setActive(0);
        startAuto();
    })();

    // Medical Excellence Section (pulse animations)
    (function initMedicalExcellence(){
        const section = document.querySelector('.medical-excellence');
        if (!section) return;
        
        // Add staggered fade-in animation to cards
        const cards = Array.from(section.querySelectorAll('.excellence-card'));
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Counter animation for stats
        const statNumbers = Array.from(section.querySelectorAll('.stat-number'));
        
        const animateCounter = (element, target) => {
            const isPercentage = target.includes('%');
            const isTime = target.includes('/');
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));
            
            let current = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                if (isPercentage) {
                    element.textContent = Math.floor(current) + '%';
                } else if (isTime) {
                    element.textContent = '24/7';
                } else {
                    element.textContent = Math.floor(current) + '+';
                }
            }, 30);
        };
        
        // Trigger counter animation when section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = stat.textContent;
                        animateCounter(stat, target);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(section);
    })();

    // Scroll-triggered background effects
    (function(){
        const scrollBgEffect = document.querySelector('.scroll-bg-effect');
        if (!scrollBgEffect) return;

        let ticking = false;

        function updateBackgroundEffect() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercentage = scrollTop / (documentHeight - windowHeight);

            if (scrollPercentage > 0.1) {
                scrollBgEffect.classList.add('active');
            } else {
                scrollBgEffect.classList.remove('active');
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateBackgroundEffect);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
        window.addEventListener('resize', requestTick);
    })();

    // Action Bar Button Functionality - Simple and Direct
    const actionBar = document.querySelector('.permanent-action-bar');
    console.log('Action bar found:', actionBar);
    
    if (actionBar) {
        // Book Appointment button
        const bookApptBtn = actionBar.querySelector('.action-segment.book-appt');
        console.log('Book appointment button found:', bookApptBtn);
        if (bookApptBtn) {
            bookApptBtn.addEventListener('click', function(e) {
                console.log('Book appointment clicked!');
                e.preventDefault();
                e.stopPropagation();
                window.location.href = getBasePath() + 'appointment.html?source=mobile-action-bar';
            });
            console.log('Book appointment button event listener added successfully');
        }

        // Find Hospital button
        const findHospitalBtn = actionBar.querySelector('.action-segment.find-hospital');
        console.log('Find hospital button found:', findHospitalBtn);
        if (findHospitalBtn) {
            findHospitalBtn.addEventListener('click', function(e) {
                console.log('Find hospital clicked!');
                e.preventDefault();
                e.stopPropagation();
                showFancyHospitalModal();
            });
            console.log('Find hospital button event listener added successfully');
        } else {
            console.log('Find hospital button NOT found in action bar');
            // Fallback: try to find any element with 'find-hospital' in the class
            const fallbackFindBtn = actionBar.querySelector('[class*="find-hospital"]');
            console.log('Fallback find hospital button found:', fallbackFindBtn);
        }

        // Social Media button
        const socialMediaBtn = actionBar.querySelector('.action-segment.social-media');
        console.log('Social media button found:', socialMediaBtn);
        if (socialMediaBtn) {
            socialMediaBtn.addEventListener('click', function(e) {
                console.log('Social media clicked!');
                e.preventDefault();
                e.stopPropagation();
                showSocialMediaModal();
            });
            console.log('Social media button event listener added successfully');
        }

        // Mail Us button
        const mailBtn = actionBar.querySelector('.action-segment.mail');
        console.log('Mail button found:', mailBtn);
        if (mailBtn) {
            mailBtn.addEventListener('click', function(e) {
                console.log('Mail button clicked!');
                e.preventDefault();
                e.stopPropagation();
                            // Redirect to contact page instead of opening email client
            window.location.href = getBasePath() + 'contact.html?source=mobile-action-bar';
            });
            console.log('Mail button event listener added successfully');
        } else {
            console.log('Mail button NOT found in action bar');
            // Fallback: try to find any element with 'mail' in the class
            const fallbackMailBtn = actionBar.querySelector('[class*="mail"]');
            console.log('Fallback mail button found:', fallbackMailBtn);
        }
    } else {
        console.log('Action bar NOT found!');
    }

    // Fancy Hospital Selection Modal
    function showFancyHospitalModal() {
        console.log('showFancyHospitalModal function called');
        
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'fancy-hospital-modal';
        console.log('Modal created with class:', modal.className);
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2>🏥 Select Hospital Branch</h2>
                    <button class="modal-close-btn">×</button>
                </div>
                <div class="modal-content">
                    <p class="modal-subtitle">Choose your preferred location for appointment booking</p>
                    <div class="hospital-options">
                        <div class="hospital-option" data-branch="electroniccity">
                            <div class="hospital-icon">🏥</div>
                            <div class="hospital-details">
                                <h3>Electronic City Branch</h3>
                                <p>📍 Ananth Nagar Phase 2, 14th Cross, New Town, Electronic City Post, Bengaluru 560100</p>
                                <p>📞 94940 60671</p>
                                <span class="branch-tag">Primary Location</span>
                            </div>
                            <div class="select-arrow">→</div>
                        </div>
                        <div class="hospital-option" data-branch="kudlu">
                            <div class="hospital-icon">🏥</div>
                            <div class="hospital-details">
                                <h3>Kudlu Branch</h3>
                                <p>📍 Nisarga Complex, 24/A, Kudlu Main Rd, near Venkateswara Temple, VGP Layout, Kudlu, Bengaluru 560068</p>
                                <p>📞 +91-8050222777</p>
                                <span class="branch-tag">Secondary Location</span>
                            </div>
                            <div class="select-arrow">→</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .fancy-hospital-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease-out;
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px);
                animation: backdropFadeIn 0.3s ease-out;
            }

            @keyframes backdropFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .modal-container {
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 24px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                max-width: 600px;
                width: 90%;
                max-height: 85vh;
                overflow-y: auto;
                position: relative;
                animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid rgba(0, 212, 255, 0.3);
            }

            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .modal-header {
                background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
                color: white;
                padding: 1.5rem 2rem;
                text-align: center;
                position: relative;
            }

            .modal-header h2 {
                margin: 0;
                font-size: 1.8rem;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .modal-close-btn {
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 1.5rem;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .modal-content {
                padding: 2rem 2rem 3rem 2rem;
            }

            .modal-subtitle {
                text-align: center;
                color: #64748b;
                margin-bottom: 2rem;
                font-size: 1.1rem;
            }

            .hospital-options {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .hospital-option {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                padding: 1.5rem;
                border: 2px solid #e2e8f0;
                border-radius: 16px;
                background: white;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                overflow: hidden;
            }

            .hospital-option::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
                transition: left 0.6s ease;
            }

            .hospital-option:hover {
                border-color: #00d4ff;
                background: linear-gradient(135deg, #f0fdff 0%, #e6f7ff 100%);
                transform: translateY(-4px);
                box-shadow: 0 12px 30px rgba(0, 212, 255, 0.2);
            }

            .hospital-option:hover::before {
                left: 100%;
            }

            .hospital-option:active {
                transform: translateY(-2px) scale(0.98);
            }

            .hospital-icon {
                font-size: 3rem;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
                animation: hospitalPulse 2s ease-in-out infinite;
            }

            @keyframes hospitalPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .hospital-details {
                flex: 1;
            }

            .hospital-details h3 {
                margin: 0 0 0.5rem 0;
                color: #1e293b;
                font-size: 1.3rem;
                font-weight: 700;
            }

            .hospital-details p {
                margin: 0.25rem 0;
                color: #64748b;
                font-size: 0.95rem;
                line-height: 1.4;
            }

            .branch-tag {
                display: inline-block;
                background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                margin-top: 0.5rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .select-arrow {
                font-size: 1.5rem;
                color: #00d4ff;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .hospital-option:hover .select-arrow {
                transform: translateX(8px);
                color: #0099cc;
            }

            /* Custom scrollbar styling */
            .modal-container::-webkit-scrollbar {
                width: 8px;
            }

            .modal-container::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
            }

            .modal-container::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
                border-radius: 4px;
            }

            .modal-container::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #0099cc 0%, #0077a3 100%);
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .modal-container {
                    width: 95%;
                    margin: 1rem;
                    max-height: 80vh;
                }
                
                .modal-header {
                    padding: 1.2rem 1.5rem;
                }
                
                .modal-header h2 {
                    font-size: 1.5rem;
                }
                
                .modal-content {
                    padding: 1.5rem;
                }
                
                .hospital-option {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
                
                .hospital-icon {
                    font-size: 2.5rem;
                }
            }
        `;

        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);

        // Add click handlers
        const hospitalOptions = modal.querySelectorAll('.hospital-option');
        console.log('Found hospital options:', hospitalOptions.length);
        hospitalOptions.forEach((option, index) => {
            console.log(`Setting up event listener for option ${index}:`, option);
            option.addEventListener('click', function() {
                const branch = this.getAttribute('data-branch');
                console.log('Selected hospital branch:', branch);
                
                // Add selection animation
                this.style.transform = 'scale(0.95)';
                this.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)';
                this.style.color = 'white';
                
                // Close modal with animation
                modal.style.animation = 'modalFadeOut 0.3s ease-in forwards';
                setTimeout(() => {
                    modal.remove();
                    
                    // Redirect to appropriate page based on selected branch
                    if (branch === 'electroniccity') {
                        console.log('Redirecting to Electronic City appointment page');
                        window.location.href = getBasePath() + 'appointment.html?branch=electroniccity';
                    } else if (branch === 'kudlu') {
                        console.log('Redirecting to Kudlu branch');
                        window.location.href = '../kudlu/index.html';
                    }
                }, 300);
            });
        });

        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close-btn');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'modalFadeOut 0.3s ease-in forwards';
            setTimeout(() => modal.remove(), 300);
        });

        // Close on backdrop click
        modal.querySelector('.modal-backdrop').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.style.animation = 'modalFadeOut 0.3s ease-in forwards';
                setTimeout(() => modal.remove(), 300);
            }
        });

        // Add fade out animation
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes modalFadeOut {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.9);
                }
            }
        `;
        document.head.appendChild(fadeOutStyle);
    }

    // Enhanced Mobile Doctors Carousel
    const doctorsCarousel = document.querySelector('.doctorsV2__carousel');
    if (doctorsCarousel) {
        console.log('Doctors carousel found:', doctorsCarousel);
        
        const track = doctorsCarousel.querySelector('.doctorsV2__track');
        const prevBtn = doctorsCarousel.querySelector('.prev-btn');
        const nextBtn = doctorsCarousel.querySelector('.next-btn');
        const progressFill = doctorsCarousel.querySelector('.progress-fill');
        const slideCounter = doctorsCarousel.querySelector('.slide-counter');
        
        // Debug logging
        console.log('Track:', track);
        console.log('Prev button:', prevBtn);
        console.log('Next button:', nextBtn);
        console.log('Progress fill:', progressFill);
        console.log('Slide counter:', slideCounter);
        
        if (!track || !prevBtn || !nextBtn) {
            console.error('Missing required carousel elements');
            return;
        }
        
        let currentSlide = 0;
        const totalSlides = 3;
        
        console.log('Total slides:', totalSlides);
        
        // Go to specific slide
        function goToSlide(index) {
            if (index < 0 || index >= totalSlides) return;
            
            currentSlide = index;
            console.log('Going to slide:', currentSlide);
            
            // Update progress bar
            if (progressFill) {
                const progressWidth = ((currentSlide + 1) / totalSlides) * 100;
                progressFill.style.width = `${progressWidth}%`;
                console.log('Progress width:', progressWidth + '%');
            }
            
            // Update slide counter
            if (slideCounter) {
                slideCounter.textContent = `${currentSlide + 1}/${totalSlides}`;
                console.log('Slide counter updated:', `${currentSlide + 1}/${totalSlides}`);
            }
            
            // Move track - smooth transform
            const translateX = -(currentSlide * 33.333);
            track.style.transform = `translateX(${translateX}%)`;
            console.log('Track transform:', `translateX(${translateX}%)`);
        }
        
        // Next slide
        function nextSlide() {
            console.log('Next slide clicked');
            goToSlide((currentSlide + 1) % totalSlides);
        }
        
        // Previous slide
        function prevSlide() {
            console.log('Prev slide clicked');
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        console.log('Event listeners attached to navigation buttons');
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        });
        
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        });
        
        // Initialize - start at first slide
        goToSlide(0);
        console.log('Carousel initialized successfully');
        
        // Auto-slide functionality - change slide every 3 seconds
        let autoSlideInterval;
        let isAutoSliding = true;
        
        function startAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                if (isAutoSliding) {
                    console.log('Auto-sliding to next slide');
                    nextSlide();
                }
            }, 3000); // 3 seconds
            console.log('Auto-slide started - 3 second interval');
        }
        
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
                console.log('Auto-slide stopped');
            }
        }
        
        function pauseAutoSlide() {
            isAutoSliding = false;
            console.log('Auto-slide paused');
        }
        
        function resumeAutoSlide() {
            isAutoSliding = true;
            console.log('Auto-slide resumed');
        }
        
        // Start auto-slide
        startAutoSlide();
        
        // Pause auto-slide on hover
        doctorsCarousel.addEventListener('mouseenter', pauseAutoSlide);
        doctorsCarousel.addEventListener('mouseleave', resumeAutoSlide);
        
        // Pause auto-slide on touch (mobile)
        doctorsCarousel.addEventListener('touchstart', pauseAutoSlide);
        doctorsCarousel.addEventListener('touchend', () => {
            setTimeout(resumeAutoSlide, 1000); // Resume after 1 second
        });
        
        // Pause auto-slide when manually navigating
        prevBtn.addEventListener('click', () => {
            pauseAutoSlide();
            setTimeout(resumeAutoSlide, 2000); // Resume after 2 seconds
        });
        
        nextBtn.addEventListener('click', () => {
            pauseAutoSlide();
            setTimeout(resumeAutoSlide, 2000); // Resume after 2 seconds
        });
        
        // Pause auto-slide on swipe
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                pauseAutoSlide();
                setTimeout(resumeAutoSlide, 2000); // Resume after 2 seconds
                
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        });
    } else {
        console.log('Doctors carousel not found');
    }

    // Quick Action Button and Panel Functionality (Desktop Only)
    const quickActionBtn = document.querySelector('.quick-action-button');
    const quickActionPanel = document.querySelector('.quick-action-panel');
    
    if (quickActionBtn && quickActionPanel) {
        // Toggle panel open/close
        quickActionBtn.addEventListener('click', function() {
            quickActionPanel.classList.toggle('open');
            
            // Add button animation
            if (quickActionPanel.classList.contains('open')) {
                this.style.transform = 'rotate(180deg) scale(1.1)';
                this.querySelector('.quick-action-text').textContent = 'Close';
            } else {
                this.style.transform = 'rotate(0deg) scale(1)';
                this.querySelector('.quick-action-text').textContent = 'Quick Actions';
            }
        });

        // Close panel button
        const closeBtn = quickActionPanel.querySelector('.panel-close-btn');
        closeBtn.addEventListener('click', function() {
            quickActionPanel.classList.remove('open');
            quickActionBtn.style.transform = 'rotate(0deg) scale(1)';
            quickActionBtn.querySelector('.quick-action-text').textContent = 'Quick Actions';
        });

        // Handle quick action items
        const actionItems = quickActionPanel.querySelectorAll('.quick-action-item');
        actionItems.forEach(item => {
            item.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                // Handle different actions
                switch(action) {
                    case 'appointment':
                        window.location.href = getBasePath() + 'appointment.html';
                        break;
                    case 'emergency':
                        window.location.href = 'tel:+919494060671';
                        break;
                    case 'social-media':
                        console.log('Social media action clicked in quick action panel');
                        showSocialMediaModal();
                        break;
                    case 'find-doctor':
                        window.location.href = getBasePath() + 'doctors.html';
                        break;
                    case 'call':
                        window.location.href = 'tel:+919494060671';
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            });
        });

        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (!quickActionBtn.contains(e.target) && !quickActionPanel.contains(e.target)) {
                quickActionPanel.classList.remove('open');
                quickActionBtn.style.transform = 'rotate(0deg) scale(1)';
                quickActionBtn.querySelector('.quick-action-text').textContent = 'Quick Actions';
            }
        });

        // Close panel on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && quickActionPanel.classList.contains('open')) {
                quickActionPanel.classList.remove('open');
                quickActionBtn.style.transform = 'rotate(0deg) scale(1)';
                quickActionBtn.querySelector('.quick-action-text').textContent = 'Quick Actions';
            }
        });
    }

    // Doctors Page Specific Functionality
    const floatingConsultationBtn = document.getElementById('floating-consultation-btn');
    
    if (floatingConsultationBtn) {
        // Add click functionality
        floatingConsultationBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Redirect to appointment page
            window.location.href = getBasePath() + 'appointment.html';
        });

        // Scroll-triggered animations for doctor cards
        const doctorCards = document.querySelectorAll('.doctor-card');
        
        if (doctorCards.length > 0) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);

            doctorCards.forEach(card => {
                observer.observe(card);
            });
        }

        // Enhanced hover effects for doctor cards
        doctorCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Floating button scroll behavior
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide button when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                floatingConsultationBtn.style.transform = 'translateY(100px)';
                floatingConsultationBtn.style.opacity = '0';
            } else {
                floatingConsultationBtn.style.transform = 'translateY(0)';
                floatingConsultationBtn.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Add click events to social media platforms
    function addSocialMediaEventListeners() {
        const socialPlatforms = document.querySelectorAll('.social-platform');
        console.log('Found social platforms:', socialPlatforms.length);
        
        socialPlatforms.forEach((platform, index) => {
            console.log(`Adding event listener to platform ${index}:`, platform);
            
            platform.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const platformType = this.classList.contains('facebook') ? 'Facebook' :
                                   this.classList.contains('instagram') ? 'Instagram' :
                                   this.classList.contains('youtube') ? 'YouTube' :
                                   this.classList.contains('directions') ? 'Directions' : 'LinkedIn';
                
                console.log('Social platform clicked:', platformType);
                
                // Handle different platform types
                if (platformType === 'Directions') {
                    // Handle directions - open Google Maps or navigation app
                    // Location info taken directly from contact page iframe
                    const hospitalCoords = '12.833603867888527,77.69153247518419';
                    const hospitalAddress = 'Ananth Nagar Phase 2, 14th Cross, New Town, Electronic City Post, Bengaluru 560100';
                    
                    // Try to open in Google Maps first, fallback to general directions
                    const googleMapsUrl = `https://www.google.com/maps/dir//${hospitalCoords}`;
                    
                    // Check if user is on mobile and try to open in native navigation app
                    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        // Try to open in native navigation app first
                        window.location.href = `geo:${hospitalCoords}?q=${encodeURIComponent(hospitalAddress)}`;
                        
                        // Fallback to Google Maps after a short delay if native app doesn't open
                        setTimeout(() => {
                            window.location.href = googleMapsUrl;
                        }, 1000);
                    } else {
                        // Desktop users go directly to Google Maps
                        window.location.href = googleMapsUrl;
                    }
                    return; // Exit early for directions
                }
                
                // Open actual social media links in new tab
                let socialUrl = '';
                switch(platformType) {
                    case 'Facebook':
                        socialUrl = 'https://www.facebook.com/rakshahospitals.electroniccity/';
                        break;
                    case 'Instagram':
                        socialUrl = 'https://www.instagram.com/rakshahospitals.electroniccity/';
                        break;
                    case 'YouTube':
                        socialUrl = 'https://www.youtube.com/@RakshaHospitalsBengaluru';
                        break;
                    case 'LinkedIn':
                        socialUrl = 'https://www.linkedin.com/company/raksha-hospitals-bengaluru';
                        break;
                    default:
                        socialUrl = 'https://rakshahospital.com';
                }
                
                console.log('Opening URL:', socialUrl);
                if (socialUrl) {
                    window.open(socialUrl, '_blank');
                }
            });
        });
    }

    // Social Media Modal Functionality
    function showSocialMediaModal() {
        console.log('showSocialMediaModal function called');
        const modal = document.getElementById('social-media-modal');
        console.log('Modal element found:', modal);
        
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            console.log('Modal shown successfully');
            
            // Add click event to close button
            const closeBtn = modal.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', closeSocialMediaModal);
                console.log('Close button event listener added');
            }
            
            // Add click event to backdrop to close modal
            const backdrop = modal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', closeSocialMediaModal);
                console.log('Backdrop event listener added');
            }
            
            // Add escape key functionality
            document.addEventListener('keydown', handleSocialMediaModalKeydown);
            console.log('Escape key event listener added');
            
            // Add click events to social media platforms
            addSocialMediaEventListeners();
            console.log('Social media event listeners added');
        } else {
            console.error('Social media modal not found in DOM');
        }
    }

    function closeSocialMediaModal() {
        console.log('closeSocialMediaModal function called');
        const modal = document.getElementById('social-media-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            console.log('Modal closed successfully');
            
            // Remove event listeners
            const closeBtn = modal.querySelector('.modal-close-btn');
            if (closeBtn) {
                closeBtn.removeEventListener('click', closeSocialMediaModal);
            }
            
            const backdrop = modal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.removeEventListener('click', closeSocialMediaModal);
            }
            
            document.removeEventListener('keydown', handleSocialMediaModalKeydown);
        }
    }

    function handleSocialMediaModalKeydown(e) {
        if (e.key === 'Escape') {
            closeSocialMediaModal();
        }
    }
});
