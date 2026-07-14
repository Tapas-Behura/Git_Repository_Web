/* ============================================
   Glam Studio Nibedita - Interactive JavaScript
   Premium Modern Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== Preloader ==========
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 1200);
    });

    // Fallback
    setTimeout(() => preloader.classList.add('hidden'), 3500);

    // ========== Custom Cursor ==========
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    });

    // Smooth follow for outline
    function animateCursor() {
        outlineX += (cursorX - outlineX) * 0.12;
        outlineY += (cursorY - outlineY) * 0.12;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .gallery-item, .why-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // Hide cursor on mobile
    if ('ontouchstart' in window) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }

    // ========== Hero Banner Slider ==========
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;
    const heroSlideInterval = 4000; // 4 seconds per slide

    function nextHeroSlide() {
        heroSlides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }

    if (heroSlides.length > 1) {
        setInterval(nextHeroSlide, heroSlideInterval);
    }

    // ========== Navbar Scroll ==========
    const navbar = document.getElementById('navbar');
    const topRibbon = document.getElementById('topRibbon');
    const backToTop = document.getElementById('backToTop');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 20; // r=20

    if (progressCircle) {
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference;
    }

    function updateOnScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / docHeight;

        // Top ribbon hide on scroll
        if (topRibbon) {
            topRibbon.classList.toggle('hidden', scrollY > 60);
        }

        // Navbar — add scrolled class (CSS handles top:0 via scrolled override)
        navbar.classList.toggle('scrolled', scrollY > 60);

        // Back to top visibility
        backToTop.classList.toggle('visible', scrollY > 400);

        // Progress ring
        if (progressCircle) {
            const offset = circumference - (scrollPercent * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    window.addEventListener('scroll', updateOnScroll, { passive: true });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== Scroll Lock (iOS + Android safe) ==========
    function lockScroll() {
        const scrollY = window.scrollY;
        document.documentElement.style.setProperty('--scroll-y', scrollY + 'px');
        document.body.classList.add('scroll-locked');
    }

    function unlockScroll() {
        const scrollY = parseInt(document.documentElement.style.getPropertyValue('--scroll-y') || '0');
        document.body.classList.remove('scroll-locked');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
    }

    // ========== Mobile Navigation ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            lockScroll();
        } else {
            unlockScroll();
        }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            unlockScroll();
        });
    });

    // ========== Active Nav on Scroll ==========
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ========== Smooth Scroll ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = target.offsetTop - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

    // ========== Testimonials Slider ==========
    const slides = document.querySelectorAll('.testimonial-slide');
    const tcPrev = document.getElementById('tcPrev');
    const tcNext = document.getElementById('tcNext');
    const tcDots = document.getElementById('tcDots');
    let currentSlide = 0;
    let autoSlideTimer;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        tcDots.appendChild(dot);
    });

    function goToSlide(index) {
        slides.forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        currentSlide = index;
        slides[currentSlide].style.display = 'block';

        // Trigger reflow for animation
        void slides[currentSlide].offsetWidth;
        slides[currentSlide].classList.add('active');

        // Update dots
        tcDots.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    tcNext.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    tcPrev.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    startAutoSlide();

    // Touch swipe for testimonials
    let tStartX = 0;
    const sliderEl = document.getElementById('testimonialSlider');

    sliderEl.addEventListener('touchstart', (e) => {
        tStartX = e.touches[0].clientX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
        const diff = tStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
            resetAutoSlide();
        }
    }, { passive: true });

    // ========== Booking Form ==========
    const bookingForm = document.getElementById('bookingForm');
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');
    const dateInput = document.getElementById('bk-date');

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate
        const inputs = bookingForm.querySelectorAll('input[required], select[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                valid = false;

                // Shake animation
                input.style.animation = 'shake 0.4s ease';
                setTimeout(() => input.style.animation = '', 400);
            } else {
                input.style.borderColor = '#4caf50';
            }
        });

        if (valid) {
            // Show success modal
            successModal.classList.add('active');

            // Reset form after delay
            setTimeout(() => {
                bookingForm.reset();
                inputs.forEach(input => input.style.borderColor = '');
            }, 500);
        }
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Close modal on overlay click
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('active')) {
            successModal.classList.remove('active');
        }
    });

    // ========== Scroll Reveal Animations ==========
    const revealTargets = document.querySelectorAll(
        '.service-card, .why-card, .gallery-item, .about-content, .about-visual, ' +
        '.highlight-item, .contact-card, .booking-form-card, .booking-content'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-element', 'revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealTargets.forEach((el, i) => {
        el.classList.add('reveal-element');
        el.style.transitionDelay = `${(i % 6) * 0.08}s`;
        revealObserver.observe(el);
    });

    // ========== Counter Animation ==========
    const counterEl = document.querySelector('.fc-number');

    if (counterEl) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target, 5000, 2000);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(counterEl);
    }

    function animateCount(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(start).toLocaleString() + '+';
        }, 16);
    }

    // ========== Parallax Hero ==========
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
            heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }
    }, { passive: true });

    // ========== Tilt Effect on Service Cards ==========
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========== Gallery Click Effect ==========
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.96)';
            setTimeout(() => { item.style.transform = ''; }, 200);
        });
    });

    // ========== Gallery — touch swipe (mobile) ==========
    const galleryGrid = document.querySelector('.gallery-masonry');
    if (galleryGrid) {
        let gTouchStartX = 0;
        let gTouchStartY = 0;
        galleryGrid.addEventListener('touchstart', (e) => {
            gTouchStartX = e.touches[0].clientX;
            gTouchStartY = e.touches[0].clientY;
        }, { passive: true });
    }

    // ========== Magnetic Buttons ==========
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-glow');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ========== Dynamic Footer Year ==========
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ========== Keyboard Accessibility ==========
    // Allow Enter/Space to activate gallery items
    galleryItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // ============================================
    //   SHOP — Dynamic Products + Cart Logic
    // ============================================

    const WHATSAPP_NUMBER = '917978XXXXXX'; // ← replace with real number
    const PRODUCTS_KEY    = 'glamProducts';
    const PHOTOS_KEY      = 'glamPhotos';

    // Default product list (mirrors admin.js defaults)
    const DEFAULT_PRODUCTS_SHOP = [
        { id:1, name:'Brightening Face Cream', category:'face',   price:599,  discount:0, size:'50ml',  desc:'Vitamin C enriched day cream for radiant, even-toned skin.',         badge:'Best Seller', stars:5,   image:'' },
        { id:2, name:'Nourishing Night Cream',  category:'face',   price:749,  discount:0, size:'50ml',  desc:'Deep moisturising retinol cream for overnight skin repair.',          badge:'',            stars:4.5, image:'' },
        { id:3, name:'Glow Booster Serum',      category:'face',   price:899,  discount:0, size:'30ml',  desc:'Hyaluronic acid & niacinamide serum for instant glow.',               badge:'New',         stars:5,   image:'' },
        { id:4, name:'Silky Body Lotion',        category:'body',   price:449,  discount:0, size:'200ml', desc:'Shea butter & aloe vera lotion for soft, glowing skin.',              badge:'Best Seller', stars:5,   image:'' },
        { id:5, name:'Coffee Body Scrub',        category:'body',   price:349,  discount:0, size:'150g',  desc:'Exfoliating coffee scrub for smooth, renewed skin.',                  badge:'',            stars:4.5, image:'' },
        { id:6, name:'Argan Oil Hair Serum',     category:'hair',   price:699,  discount:0, size:'100ml', desc:'Frizz-control serum for shiny, smooth, manageable hair.',             badge:'New',         stars:5,   image:'' },
        { id:7, name:'Deep Repair Hair Mask',    category:'hair',   price:549,  discount:0, size:'200g',  desc:'Keratin-rich mask for damaged, dry and frizzy hair.',                 badge:'',            stars:4.5, image:'' },
        { id:8, name:'Luxe Lip Gloss',           category:'makeup', price:299,  discount:0, size:'5ml',   desc:'High-shine moisturising lip gloss in 6 gorgeous shades.',             badge:'',            stars:5,   image:'' },
        { id:9, name:'Flawless Foundation',      category:'makeup', price:999,  discount:0, size:'30ml',  desc:'Full-coverage, long-lasting foundation in 12 shades.',                badge:'Popular',     stars:4.5, image:'' },
    ];

    // ---- Helpers ----
    function getProducts() {
        const raw = localStorage.getItem(PRODUCTS_KEY);
        return raw ? JSON.parse(raw) : DEFAULT_PRODUCTS_SHOP;
    }

    function getPhotos() {
        const raw = localStorage.getItem(PHOTOS_KEY);
        return raw ? JSON.parse(raw) : {};
    }

    function starsHTML(rating) {
        let html = '';
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        return html;
    }

    // ---- Render product grid from localStorage ----
    const productsGrid   = document.getElementById('productsGrid');
    const catLabels      = { face:'Face Care', hair:'Hair Care', body:'Body Care', makeup:'Makeup' };

    function buildProductCard(p) {
        const discount    = p.discount > 0 ? parseInt(p.discount) : 0;
        const finalPrice  = discount > 0 ? Math.round(p.price * (1 - discount / 100)) : p.price;
        const badge       = p.badge ? `<span class="product-badge${p.badge === 'New' ? ' new' : ''}">${p.badge}</span>` : '';
        const discountTag = discount > 0 ? `<span class="product-discount-tag">${discount}% OFF</span>` : '';
        const imgTag      = p.image
            ? `<img src="${p.image}" alt="${p.name}">`
            : `<div class="product-img-placeholder" style="display:flex; background:linear-gradient(135deg,#f9c5d1,#fce4ec);"><i class="fas fa-box"></i></div>`;

        const priceHTML = discount > 0
            ? `<div class="product-price-wrap">
                 <span class="product-price-final">&#8377;${finalPrice.toLocaleString()}</span>
                 <span class="product-price-original">&#8377;${p.price.toLocaleString()}</span>
               </div>`
            : `<span class="product-price">&#8377;${p.price.toLocaleString()}</span>`;

        return `
        <div class="product-card" data-category="${p.category}" data-id="${p.id}">
            <div class="product-img-wrap">
                ${imgTag}
                ${badge}
                ${discountTag}
            </div>
            <div class="product-info">
                <span class="product-category">${catLabels[p.category] || p.category}</span>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-meta">
                    <span class="product-size">${p.size}</span>
                    <div class="product-stars">${starsHTML(p.stars)}</div>
                </div>
                <div class="product-bottom">
                    ${priceHTML}
                    <div class="product-qty">
                        <button class="qty-btn qty-minus" aria-label="Decrease">−</button>
                        <span class="qty-value">1</span>
                        <button class="qty-btn qty-plus" aria-label="Increase">+</button>
                    </div>
                    <button class="btn-add-cart"
                        data-name="${p.name}"
                        data-price="${finalPrice}"
                        data-size="${p.size}">
                        <i class="fas fa-shopping-bag"></i>Add
                    </button>
                </div>
            </div>
        </div>`;
    }

    function renderProductsGrid() {
        const shopProds = getProducts();
        productsGrid.innerHTML = shopProds.map(buildProductCard).join('');
        bindProductCardEvents();
        bindCategoryFilter();
    }

    // ---- Apply admin-uploaded photos to hero banners, gallery, about, services ----
    function applyAdminPhotos() {
        const photos = getPhotos();

        // Site logo
        const logoIcon = document.getElementById('logoIcon');
        if (logoIcon && photos['site-logo']) {
            logoIcon.innerHTML = `<img src="${photos['site-logo']}" alt="Glam Studio Logo">`;
        }

        // Hero banner slides
        ['banner-1','banner-2','banner-3','banner-4'].forEach(key => {
            const slide = document.querySelector(`.hero-slide[data-key="${key}"]`);
            if (slide && photos[key]) slide.style.backgroundImage = `url('${photos[key]}')`;
        });

        // Gallery images
        ['gallery-1','gallery-2','gallery-3','gallery-4','gallery-5','gallery-6'].forEach(key => {
            const real = document.querySelector(`.gallery-item img[src*="${key}"], .gallery-item [data-imgkey="${key}"]`);
            if (real && photos[key]) { real.src = photos[key]; real.style.display = 'block'; }
        });

        // About images
        ['about-1','about-2','about-3'].forEach(key => {
            const real = document.querySelector(`.about-img-real[src*="${key}"], .about-img-real[data-imgkey="${key}"]`);
            if (real && photos[key]) { real.src = photos[key]; real.style.display = 'block'; }
        });

        // Service card images
        const svcKeys = [
            'svc-haircut','svc-hairspa','svc-bridal','svc-nails','svc-facial',
            'svc-manicure','svc-straightening','svc-botox','svc-threading'
        ];
        svcKeys.forEach(key => {
            const card = document.querySelector(`.service-card[data-svckey="${key}"]`);
            if (!card) return;
            const wrap = card.querySelector('.svc-img-wrap');
            const img  = card.querySelector('.svc-img');
            if (!wrap || !img) return;

            if (photos[key]) {
                // Admin has uploaded an image — use it
                img.src = photos[key];
                img.style.display = 'block';
                wrap.classList.add('has-svc-img');
                card.classList.add('has-svc-img');
            } else {
                // No admin image — try the static file src (set in HTML)
                // If the static file fails onerror already hides it,
                // so check if the img loaded naturally
                img.addEventListener('load', () => {
                    if (img.naturalWidth > 0) {
                        wrap.classList.add('has-svc-img');
                        card.classList.add('has-svc-img');
                    }
                }, { once: true });
                img.addEventListener('error', () => {
                    img.style.display = 'none';
                    wrap.classList.remove('has-svc-img');
                    card.classList.remove('has-svc-img');
                }, { once: true });
                // Trigger check for already-loaded images (cached)
                if (img.complete && img.naturalWidth > 0) {
                    wrap.classList.add('has-svc-img');
                    card.classList.add('has-svc-img');
                }
            }
        });
    }

    // ---- Cart state ----
    let cart = JSON.parse(localStorage.getItem('glamCart') || '[]');

    const cartNavBtn   = document.getElementById('cartNavBtn');
    const cartBadge    = document.getElementById('cartBadge');
    const cartSidebar  = document.getElementById('cartSidebar');
    const cartOverlay  = document.getElementById('cartOverlay');
    const cartClose    = document.getElementById('cartClose');
    const cartItemsEl  = document.getElementById('cartItems');
    const cartEmpty    = document.getElementById('cartEmpty');
    const cartFooter   = document.getElementById('cartFooter');
    const cartTotalEl  = document.getElementById('cartTotalPrice');
    const checkoutBtn  = document.getElementById('checkoutBtn');
    const cartShopLink = document.getElementById('cartShopLink');

    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        lockScroll();
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        unlockScroll();
    }

    cartNavBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Mobile cart button (shown in hamburger row)
    const cartNavBtnMobile = document.getElementById('cartNavBtnMobile');
    if (cartNavBtnMobile) cartNavBtnMobile.addEventListener('click', openCart);

    if (cartShopLink) {
        cartShopLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeCart();
            document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartSidebar.classList.contains('open')) closeCart();
    });

    function saveCart() { localStorage.setItem('glamCart', JSON.stringify(cart)); }

    function updateBadge() {
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = total;
        cartBadge.classList.toggle('visible', total > 0);
        // sync mobile badge
        const mobileBadge = document.getElementById('cartBadgeMobile');
        if (mobileBadge) {
            mobileBadge.textContent = total;
            mobileBadge.classList.toggle('visible', total > 0);
        }
    }

    function renderCart() {
        cartItemsEl.querySelectorAll('.cart-item').forEach(n => n.remove());
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            return;
        }
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        let total = 0;
        cart.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-icon"><i class="fas fa-jar"></i></div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-size">${item.size}</div>
                    <div class="cart-item-row">
                        <div class="cart-item-qty">
                            <button class="qty-btn ci-minus" data-idx="${idx}">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn ci-plus" data-idx="${idx}">+</button>
                        </div>
                        <span class="cart-item-price">&#8377;${(item.price * item.qty).toLocaleString()}</span>
                        <button class="cart-item-remove" data-idx="${idx}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>`;
            cartItemsEl.appendChild(el);
            total += item.price * item.qty;
        });
        cartTotalEl.textContent = '₹' + total.toLocaleString();

        cartItemsEl.querySelectorAll('.ci-minus').forEach(btn => btn.addEventListener('click', () => {
            const i = +btn.dataset.idx;
            if (cart[i].qty > 1) cart[i].qty--; else cart.splice(i, 1);
            saveCart(); updateBadge(); renderCart();
        }));
        cartItemsEl.querySelectorAll('.ci-plus').forEach(btn => btn.addEventListener('click', () => {
            const i = +btn.dataset.idx;
            if (cart[i].qty < 10) cart[i].qty++;
            saveCart(); updateBadge(); renderCart();
        }));
        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => btn.addEventListener('click', () => {
            cart.splice(+btn.dataset.idx, 1);
            saveCart(); updateBadge(); renderCart();
        }));
    }

    function bindProductCardEvents() {
        // Add to cart
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const name  = btn.dataset.name;
                const price = parseInt(btn.dataset.price);
                const size  = btn.dataset.size;
                const qtyEl = btn.closest('.product-bottom').querySelector('.qty-value');
                const qty   = parseInt(qtyEl ? qtyEl.textContent : 1);
                const existing = cart.find(i => i.name === name);
                if (existing) existing.qty = Math.min(existing.qty + qty, 10);
                else cart.push({ name, price, size, qty });
                saveCart(); updateBadge(); renderCart();
                btn.classList.add('added');
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Added!';
                setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = orig; }, 1500);
                openCart();
            });
        });

        // Qty steppers on product cards
        document.querySelectorAll('.product-qty .qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.nextElementSibling;
                if (parseInt(val.textContent) > 1) val.textContent = parseInt(val.textContent) - 1;
            });
        });
        document.querySelectorAll('.product-qty .qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.previousElementSibling;
                if (parseInt(val.textContent) < 10) val.textContent = parseInt(val.textContent) + 1;
            });
        });
    }

    function bindCategoryFilter() {
        document.querySelectorAll('.shop-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.shop-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyShopFilters();
            });
        });
    }

    // ---- Live search + category filter combined ----
    function applyShopFilters() {
        const searchInput = document.getElementById('shopSearchInput');
        const countEl     = document.getElementById('shopSearchCount');
        const clearBtn    = document.getElementById('shopSearchClear');
        const activeBtn   = document.querySelector('.shop-filter-btn.active');

        const term     = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const category = activeBtn ? activeBtn.dataset.filter : 'all';

        let visible = 0;

        // Remove any existing no-results message
        const existing = document.querySelector('.shop-no-results');
        if (existing) existing.remove();

        document.querySelectorAll('.product-card').forEach((card, i) => {
            const catMatch  = category === 'all' || card.dataset.category === category;
            const name      = (card.querySelector('.product-name')?.textContent  || '').toLowerCase();
            const desc      = (card.querySelector('.product-desc')?.textContent  || '').toLowerCase();
            const cat       = (card.querySelector('.product-category')?.textContent || '').toLowerCase();
            const termMatch = !term || name.includes(term) || desc.includes(term) || cat.includes(term);
            const show      = catMatch && termMatch;

            card.classList.toggle('hidden', !show);
            if (show) {
                card.style.animationDelay = `${(visible % 6) * 0.07}s`;
                visible++;
            }
        });

        // Clear button visibility
        if (clearBtn) clearBtn.style.display = term ? 'flex' : 'none';

        // Result count
        if (countEl) {
            if (term || category !== 'all') {
                countEl.textContent = `${visible} product${visible !== 1 ? 's' : ''} found`;
            } else {
                countEl.textContent = '';
            }
        }

        // No results message
        if (visible === 0) {
            const noRes = document.createElement('div');
            noRes.className = 'shop-no-results';
            noRes.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No products found for "<strong>${term || category}</strong>"</p>
                <span>Try a different keyword or category</span>`;
            document.getElementById('productsGrid').appendChild(noRes);
        }
    }

    // WhatsApp checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        const lines = cart.map(i => `• ${i.name} (${i.size}) x${i.qty} = ₹${(i.price * i.qty).toLocaleString()}`);
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const msg = `🛍 *New Order from Glam Studio Website*\n\n${lines.join('\n')}\n\n*Grand Total: ₹${total.toLocaleString()}*\n\nPlease confirm availability and arrange delivery/pickup. Thank you! 🙏`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });

    // ---- Listen for storage changes from admin panel (same browser, other tab) ----
    window.addEventListener('storage', (e) => {
        if (e.key === PRODUCTS_KEY) renderProductsGrid();
        if (e.key === PHOTOS_KEY)   applyAdminPhotos();
    });

    // ---- Search input events ----
    const shopSearchInput = document.getElementById('shopSearchInput');
    const shopSearchClear = document.getElementById('shopSearchClear');

    if (shopSearchInput) {
        // Live search on every keystroke
        shopSearchInput.addEventListener('input', () => {
            applyShopFilters();
        });

        // Clear button
        shopSearchClear.addEventListener('click', () => {
            shopSearchInput.value = '';
            shopSearchInput.focus();
            applyShopFilters();
        });

        // ESC key clears search
        shopSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                shopSearchInput.value = '';
                applyShopFilters();
            }
        });
    }

    // ---- Init ----
    renderProductsGrid();
    applyAdminPhotos();
    updateBadge();
    renderCart();

}); // End DOMContentLoaded

// ========== Shake Animation (injected via JS for form) ==========
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(shakeStyle);
