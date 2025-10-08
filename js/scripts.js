// Click-controlled carousel functionality
class ClickCarousel {
    constructor() {
        this.carousel = document.querySelector('.quotes-carousel-section');
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
        this.prevBtn = this.carousel.querySelector('.prev-btn');
        this.nextBtn = this.carousel.querySelector('.next-btn');
        this.indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
        
        this.currentIndex = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1200) return 2;
        return 3;
    }
    
    init() {
        this.createIndicators();
        this.updateCarousel();
        this.addEventListeners();
        window.addEventListener('resize', () => this.handleResize());
    }
    
    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        const totalGroups = Math.ceil(this.totalSlides / this.slidesPerView);
        
        for (let i = 0; i < totalGroups; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Go to group ${i + 1}`);
            indicator.addEventListener('click', () => this.goToGroup(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateCarousel() {
        const slideWidth = this.slides[0].getBoundingClientRect().width;
        const gap = 32; // 2rem gap
        const translateX = -this.currentIndex * (slideWidth + gap) * this.slidesPerView;
        
        this.track.style.transform = `translateX(${translateX}px)`;
        this.updateIndicators();
        this.updateButtons();
    }
    
    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator');
        const activeIndicator = Math.floor(this.currentIndex / this.slidesPerView);
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndicator);
        });
    }
    
    updateButtons() {
        const maxIndex = this.totalSlides - this.slidesPerView;
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }
    
    nextSlide() {
        const maxIndex = this.totalSlides - this.slidesPerView;
        if (this.currentIndex < maxIndex) {
            this.currentIndex += this.slidesPerView;
            // Ensure we don't go beyond the last slide
            if (this.currentIndex > maxIndex) {
                this.currentIndex = maxIndex;
            }
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex -= this.slidesPerView;
            // Ensure we don't go below 0
            if (this.currentIndex < 0) {
                this.currentIndex = 0;
            }
            this.updateCarousel();
        }
    }
    
    goToGroup(groupIndex) {
        this.currentIndex = groupIndex * this.slidesPerView;
        // Ensure we don't go beyond the last slide
        const maxIndex = this.totalSlides - this.slidesPerView;
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
        }
        this.updateCarousel();
    }
    
    handleResize() {
        const oldSlidesPerView = this.slidesPerView;
        this.slidesPerView = this.getSlidesPerView();
        
        if (oldSlidesPerView !== this.slidesPerView) {
            this.createIndicators();
            this.currentIndex = 0;
            this.updateCarousel();
        }
    }
    
    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch support for mobile
        let startX = 0;
        let currentX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClickCarousel();
});