/**
 * BMW Digital Studio Main Script
 */

const CONFIG = {
    basePrice: 185000,
    prices: {
        color: { blue: 2400, red: 2400 },
        interior: { orange: 3500 }
    },
    images: {
        exterior: {
            black: 'assets/car-black.png',
            white: 'assets/car-white.png',
            blue: 'assets/car-blue.png',
            red: 'assets/car-red.png'
        },
        interior: {
            black: 'assets/interior-black.jpg',
            silver: 'assets/interior-silver.jpg',
            orange: 'assets/interior-orange.jpg'
        }
    }
};

const Utils = {
    formatPrice: (price) => `${price.toLocaleString('bg-BG').replace(',', ' ')} лв.`
};

const Navigation = {
    init() {
        this.highlightActiveLink();
        this.setupMobileMenu();
    },

    highlightActiveLink() {
        const currentPath = location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) link.classList.add('active');
        });
    },

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (!hamburger || !navLinks) return;

        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        };

        hamburger.addEventListener('click', toggleMenu);
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
};

const Configurator = {
    state: {
        color: 'black',
        interior: 'black',
        view: 'exterior'
    },
    
    elements: {},

    init() {
        // Cache elements
        this.elements = {
            colorOptions: document.querySelectorAll('.color-option'),
            interiorOptions: document.querySelectorAll('.interior-option'),
            preview: document.querySelector('.car-preview-visual'),
            image: document.getElementById('car-image'),
            priceDisplay: document.getElementById('total-price')
        };

        if (!this.elements.preview) return; 

        this.bindEvents();
        this.updateView();
    },

    bindEvents() {
        this.elements.colorOptions.forEach(opt => {
            opt.addEventListener('click', () => this.handleColorSelect(opt));
        });

        this.elements.interiorOptions.forEach(opt => {
            opt.addEventListener('click', () => this.handleInteriorSelect(opt));
        });
    },

    handleColorSelect(element) {
        this.updateUISelection(this.elements.colorOptions, element);
        
        this.state.color = element.dataset.color;
        this.state.view = 'exterior';
        
        this.updateView();
    },

    handleInteriorSelect(element) {
        this.updateUISelection(this.elements.interiorOptions, element);
        
        this.state.interior = element.dataset.interior;
        this.state.view = 'interior';
        
        this.updateView();
    },

    updateUISelection(group, activeElement) {
        group.forEach(el => el.classList.remove('active'));
        activeElement.classList.add('active');
    },

    updateView() {
        const { color, interior, view } = this.state;
        const { preview, image } = this.elements;

        // Animate
        preview.classList.add('sweeping');
        
        setTimeout(() => {
            const src = view === 'exterior' 
                ? CONFIG.images.exterior[color] 
                : CONFIG.images.interior[interior];

            if (image && src) {
                image.src = src;
                image.style.display = 'block';
            }
            this.updatePrice();
        }, 250);

        setTimeout(() => preview.classList.remove('sweeping'), 500);
    },

    updatePrice() {
        const { color, interior } = this.state;
        const price = CONFIG.basePrice 
            + (CONFIG.prices.color[color] || 0)
            + (CONFIG.prices.interior[interior] || 0);

        if (this.elements.priceDisplay) {
            this.elements.priceDisplay.style.opacity = 0;
            setTimeout(() => {
                this.elements.priceDisplay.innerText = Utils.formatPrice(price);
                this.elements.priceDisplay.style.opacity = 1;
            }, 200);
        }
    }
};

const Animation = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
};

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    Configurator.init();
    Animation.init();
});
