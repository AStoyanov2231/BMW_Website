// script.js - Updated with Interior Switching

document.addEventListener('DOMContentLoaded', () => {
    console.log("BMW Configurator Loaded");

    // 1. Navigation Highlighting
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-links a');
    
    menuItems.forEach(item => {
        if(item.href === currentLocation || (item.getAttribute('href') === 'index.html' && currentLocation.endsWith('/'))) {
            item.classList.add('active');
        }
    });

    // 2. Configurator Logic
    const colorOptions = document.querySelectorAll('.color-option');
    const interiorOptions = document.querySelectorAll('.interior-option');
    const carPreview = document.querySelector('.car-preview-visual');
    const carImage = document.getElementById('car-image'); 
    
    // State
    let currentBasePrice = 185000;
    let colorPrice = 0;
    let interiorPrice = 0;
    let currentView = 'exterior'; // 'exterior' or 'interior'
    let selectedColor = 'black';
    let selectedInterior = 'black';
    
    // Config Data
    const exteriorImages = {
        'black': 'assets/car-black.png',
        'white': 'assets/car-white.png',
        'blue': 'assets/car-blue.png',
        'red': 'assets/car-red.png'
    };

    const interiorImages = {
        'black': 'assets/interior-black.jpg',
        'silver': 'assets/interior-silver.jpg',
        'orange': 'assets/interior-orange.jpg'
    };

        // Fallback Color Map (if images fail or are missing, we can still tint the background as fallback)
        const exteriorColors = {
            'black': 'linear-gradient(135deg, #111 0%, #333 100%)',
            'white': 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
            'blue': 'linear-gradient(135deg, #001f3f 0%, #0074D9 100%)',
            'red': 'linear-gradient(135deg, #85144b 0%, #FF4136 100%)'
        };

    // Color Selection (Exterior)
    if(colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // UI Update
                colorOptions.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Logic Update
                const color = this.getAttribute('data-color');
                selectedColor = color;
                
                // Switch view to exterior if we are in interior mode
                if (currentView === 'interior') {
                    // Reset interior UI selection visually? Maybe not, keep selection but show exterior.
                }
                currentView = 'exterior';

                updateCarView();
                
                // Pricing Logic
                const newColorPrice = (color === 'blue' || color === 'red') ? 2400 : 0;
                updatePrice(newColorPrice, interiorPrice);
            });
        });
    }

    // Interior Selection
    if(interiorOptions.length > 0) {
        interiorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // UI Update
                interiorOptions.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Logic
                const interior = this.getAttribute('data-interior');
                selectedInterior = interior;
                currentView = 'interior'; // Switch to interior view

                updateCarView();

                // Pricing Logic (Example: Orange is expensive)
                const newInteriorPrice = (interior === 'orange') ? 3500 : 0;
                updatePrice(colorPrice, newInteriorPrice);
            });
        });
    }

    function updateCarView() {
        if(!carPreview) return;

        // Animation start
        carPreview.classList.add('sweeping');

        setTimeout(() => {
            if (carImage) {
                let newSrc = '';
                
                if (currentView === 'exterior') {
                    newSrc = exteriorImages[selectedColor];
                } else {
                    newSrc = interiorImages[selectedInterior];
                }

                if (newSrc) {
                    carImage.src = newSrc;
                    carImage.style.display = 'block';
                }
            }
        }, 250);

        setTimeout(() => {
            carPreview.classList.remove('sweeping');
        }, 500);
    }

    function updatePrice(cPrice, iPrice) {
        colorPrice = cPrice;
        interiorPrice = iPrice;
        const total = currentBasePrice + colorPrice + interiorPrice;
        
        const priceElement = document.getElementById('total-price');
        if(priceElement) {
            priceElement.style.opacity = 0;
            setTimeout(() => {
                priceElement.innerText = total.toLocaleString('bg-BG').replace(',', ' ') + ' лв.';
                priceElement.style.opacity = 1;
            }, 200);
        }
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});
