class PresentationApp {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = document.querySelectorAll('.slide').length;
    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.isTransitioning = false;
    
    this.initializeElements();
    this.bindEvents();
    this.updateDisplay();
    this.initializeScrollableContent();
  }

  initializeElements() {
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.currentSlideSpan = document.getElementById('currentSlide');
    this.totalSlidesSpan = document.getElementById('totalSlides');
    
    // Set total slides
    this.totalSlidesSpan.textContent = this.totalSlides;
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.previousSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // Slide indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Prevent default behavior for arrow keys to avoid page scrolling
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !this.isInInputField(e.target)) {
        e.preventDefault();
      }
    });
  }

  isInInputField(element) {
    const inputTypes = ['input', 'textarea', 'select'];
    return inputTypes.includes(element.tagName.toLowerCase()) || element.contentEditable === 'true';
  }

  initializeScrollableContent() {
    // Reset scroll position for all scrollable content when changing slides
    const scrollableElements = document.querySelectorAll('.scrollable-content');
    scrollableElements.forEach(element => {
      element.scrollTop = 0;
    });
  }

  handleKeyPress(event) {
    // Prevent navigation during transitions
    if (this.isTransitioning) return;
    
    // Don't intercept keys if user is in an input field
    if (this.isInInputField(event.target)) return;
    
    // Don't intercept keys if user is interacting with scrollable content
    const activeElement = document.activeElement;
    const scrollableContent = activeElement.closest('.scrollable-content');
    
    // If we're in a scrollable area and it's not at the edges, let normal scrolling happen
    if (scrollableContent) {
      const isAtTop = scrollableContent.scrollTop === 0;
      const isAtBottom = scrollableContent.scrollTop + scrollableContent.clientHeight >= scrollableContent.scrollHeight - 1;
      
      // Allow normal scrolling within the content
      if (event.key === 'ArrowUp' && !isAtTop) return;
      if (event.key === 'ArrowDown' && !isAtBottom) return;
    }

    switch(event.key) {
      case 'ArrowLeft':
        this.previousSlide();
        break;
      case 'ArrowRight':
        this.nextSlide();
        break;
      case 'Home':
        this.goToSlide(0);
        break;
      case 'End':
        this.goToSlide(this.totalSlides - 1);
        break;
      case 'Escape':
        // Could be used for fullscreen exit in the future
        break;
    }
  }

  nextSlide() {
    if (this.isTransitioning || this.currentSlide >= this.totalSlides - 1) return;
    
    this.isTransitioning = true;
    this.currentSlide++;
    this.updateDisplay();
    this.resetScrollPosition();
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 200);
  }

  previousSlide() {
    if (this.isTransitioning || this.currentSlide <= 0) return;
    
    this.isTransitioning = true;
    this.currentSlide--;
    this.updateDisplay();
    this.resetScrollPosition();
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 200);
  }

  goToSlide(slideIndex) {
    if (this.isTransitioning || slideIndex < 0 || slideIndex >= this.totalSlides || slideIndex === this.currentSlide) return;
    
    this.isTransitioning = true;
    this.currentSlide = slideIndex;
    this.updateDisplay();
    this.resetScrollPosition();
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 200);
  }

  resetScrollPosition() {
    // Reset scroll position for the current slide's scrollable content
    const currentSlideElement = this.slides[this.currentSlide];
    const scrollableContent = currentSlideElement.querySelector('.scrollable-content');
    if (scrollableContent) {
      scrollableContent.scrollTop = 0;
    }
  }

  updateDisplay() {
    // Update slide visibility
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });
    
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });
    
    // Update navigation buttons
    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    
    // Update slide counter
    this.currentSlideSpan.textContent = this.currentSlide + 1;
    
    // Update page title with current slide
    this.updatePageTitle();
    
    // Announce slide change for screen readers
    this.announceSlideChange();
    
    // Ensure scrollbars are visible when needed
    this.updateScrollbarVisibility();
  }

  updateScrollbarVisibility() {
    // Force a reflow to ensure scrollbars appear correctly
    const currentSlideElement = this.slides[this.currentSlide];
    const scrollableContent = currentSlideElement.querySelector('.scrollable-content');
    if (scrollableContent) {
      // Temporarily change overflow to trigger reflow
      scrollableContent.style.overflow = 'hidden';
      setTimeout(() => {
        scrollableContent.style.overflow = 'auto';
      }, 10);
    }
  }

  updatePageTitle() {
    const slideTitles = [
      'Title - Roundabout Redesign Proposals',
      'Current Conditions - Roundabout Redesign Proposals',
      'Design 1: Wing-Shaped - Roundabout Redesign Proposals',
      'Design 2: Minimal Conical - Roundabout Redesign Proposals',
      'Design 3: Clean Minimal - Roundabout Redesign Proposals',
      'Cost Analysis - Roundabout Redesign Proposals',
      'Recommendations - Roundabout Redesign Proposals'
    ];
    
    document.title = slideTitles[this.currentSlide] || 'Roundabout Redesign Proposals';
  }

  announceSlideChange() {
    // Create or update an aria-live region for screen reader announcements
    let announcement = document.getElementById('slide-announcement');
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.id = 'slide-announcement';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
    }
    
    const slideNames = [
      'Title slide',
      'Current conditions',
      'Design 1: Wing-shaped with boulders',
      'Design 2: Minimal conical with pebble pockets',
      'Design 3: Clean minimal design',
      'Cost analysis and comparison',
      'Recommendations and next steps'
    ];
    
    announcement.textContent = `${slideNames[this.currentSlide]}, slide ${this.currentSlide + 1} of ${this.totalSlides}`;
  }

  // Method to handle touch/swipe gestures for mobile
  initializeTouchEvents() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    const minSwipeDistance = 50;
    let isSwiping = false;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!isSwiping) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        // Determine if this is a horizontal swipe
        if (deltaX > deltaY && deltaX > 20) {
          isSwiping = true;
        }
      }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Check if horizontal swipe is more prominent than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        // Check if the touch was on scrollable content
        const touchTarget = e.target;
        const scrollableContent = touchTarget.closest('.scrollable-content');
        
        // If not in scrollable content or scrollable content doesn't need scrolling
        if (!scrollableContent || 
            scrollableContent.scrollHeight <= scrollableContent.clientHeight) {
          
          if (deltaX > 0) {
            // Swipe right - go to previous slide
            this.previousSlide();
          } else {
            // Swipe left - go to next slide
            this.nextSlide();
          }
        }
      }
    }, { passive: true });
  }

  // Method to handle fullscreen functionality
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Method to handle presentation mode
  enterPresentationMode() {
    document.body.classList.add('presentation-mode');
    this.toggleFullscreen();
  }

  // Method to get current slide information
  getCurrentSlideInfo() {
    return {
      current: this.currentSlide + 1,
      total: this.totalSlides,
      title: document.title,
      hasScrollableContent: !!document.querySelector('.slide.active .scrollable-content'),
      isTransitioning: this.isTransitioning
    };
  }

  // Method to jump to a specific slide by name/keyword
  jumpToSlide(keyword) {
    const slideKeywords = {
      'title': 0,
      'current': 1,
      'existing': 1,
      'conditions': 1,
      'wing': 2,
      'design1': 2,
      'boulder': 2,
      'boulders': 2,
      'minimal': 3,
      'design2': 3,
      'pebble': 3,
      'conical': 3,
      'clean': 4,
      'design3': 4,
      'cost': 5,
      'analysis': 5,
      'chart': 5,
      'comparison': 5,
      'recommendations': 6,
      'next': 6,
      'steps': 6
    };
    
    const slideIndex = slideKeywords[keyword.toLowerCase()];
    if (slideIndex !== undefined) {
      this.goToSlide(slideIndex);
      return true;
    }
    return false;
  }

  // Method to scroll within current slide
  scrollCurrentSlide(direction) {
    const currentSlideElement = this.slides[this.currentSlide];
    const scrollableContent = currentSlideElement.querySelector('.scrollable-content');
    
    if (scrollableContent) {
      const scrollAmount = 100; // pixels to scroll
      if (direction === 'up') {
        scrollableContent.scrollTop -= scrollAmount;
      } else if (direction === 'down') {
        scrollableContent.scrollTop += scrollAmount;
      }
    }
  }

  // Method to check if content is scrollable
  isContentScrollable(slideIndex = this.currentSlide) {
    const slideElement = this.slides[slideIndex];
    const scrollableContent = slideElement.querySelector('.scrollable-content');
    
    if (scrollableContent) {
      return scrollableContent.scrollHeight > scrollableContent.clientHeight;
    }
    return false;
  }

  // Method to get scroll position info
  getScrollInfo(slideIndex = this.currentSlide) {
    const slideElement = this.slides[slideIndex];
    const scrollableContent = slideElement.querySelector('.scrollable-content');
    
    if (scrollableContent) {
      const scrollTop = scrollableContent.scrollTop;
      const scrollHeight = scrollableContent.scrollHeight;
      const clientHeight = scrollableContent.clientHeight;
      const scrollable = scrollHeight > clientHeight;
      
      return {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollable,
        percentScrolled: scrollable ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0,
        isAtTop: scrollTop === 0,
        isAtBottom: scrollTop + clientHeight >= scrollHeight - 1
      };
    }
    
    return null;
  }

  // Method to handle image loading errors and setup fallbacks
  handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', (e) => {
        const imgElement = e.target;
        const container = imgElement.closest('.chart-section');
        
        if (container) {
          // Show fallback chart for cost analysis
          const fallback = container.querySelector('.chart-fallback');
          if (fallback) {
            imgElement.style.display = 'none';
            fallback.style.display = 'block';
          }
        } else {
          // For other images, replace with enhanced placeholder
          const imageContainer = imgElement.closest('.image-container');
          if (imageContainer) {
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
              <div class="placeholder-text">Image Not Available</div>
              <p class="image-note">${imgElement.alt}</p>
              <div class="upload-instruction">Image failed to load. Please check the image URL or upload a new image.</div>
            `;
            imageContainer.replaceChild(placeholder, imgElement);
          }
        }
      });
      
      img.addEventListener('load', (e) => {
        // Image loaded successfully
        const imgElement = e.target;
        const container = imgElement.closest('.chart-section');
        
        if (container) {
          // Hide fallback chart if image loads
          const fallback = container.querySelector('.chart-fallback');
          if (fallback) {
            fallback.style.display = 'none';
            imgElement.style.display = 'block';
          }
        }
      });
    });
  }

  // Method to optimize performance
  optimizePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resetScrollPosition();
        this.updateScrollbarVisibility();
      }, 100);
    });
    
    // Optimize scroll event listeners
    document.querySelectorAll('.scrollable-content').forEach(element => {
      let scrollTimeout;
      element.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Any scroll-based optimizations can go here
        }, 50);
      }, { passive: true });
    });
  }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const presentation = new PresentationApp();
  
  // Initialize touch events for mobile devices
  presentation.initializeTouchEvents();
  
  // Handle image loading errors and setup fallbacks
  presentation.handleImageErrors();
  
  // Optimize performance
  presentation.optimizePerformance();
  
  // Make presentation instance globally available for debugging
  window.presentation = presentation;
  
  // Add helpful keyboard shortcuts info
  console.log('Presentation Controls:');
  console.log('→ Next slide');
  console.log('← Previous slide');
  console.log('Home: First slide');
  console.log('End: Last slide');
  console.log('');
  console.log('Available methods:');
  console.log('presentation.goToSlide(index)');
  console.log('presentation.jumpToSlide(keyword)');
  console.log('presentation.getCurrentSlideInfo()');
  console.log('presentation.scrollCurrentSlide("up"/"down")');
  console.log('presentation.isContentScrollable()');
  console.log('presentation.getScrollInfo()');
});

// Handle visibility change to pause/resume if needed
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - could pause animations or videos
    console.log('Presentation paused');
  } else {
    // Page is visible - could resume animations or videos
    console.log('Presentation resumed');
    // Ensure proper display when returning to the page
    if (window.presentation) {
      window.presentation.updateScrollbarVisibility();
    }
  }
});

// Handle focus management for accessibility
document.addEventListener('focusin', (e) => {
  const focusedElement = e.target;
  const scrollableContent = focusedElement.closest('.scrollable-content');
  
  // If focused element is in scrollable content, ensure it's visible
  if (scrollableContent && focusedElement !== scrollableContent) {
    const elementRect = focusedElement.getBoundingClientRect();
    const containerRect = scrollableContent.getBoundingClientRect();
    
    // Check if element is outside visible area
    if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
      focusedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }
});

// Export presentation class for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PresentationApp;
}

// Add global error handler for better debugging
window.addEventListener('error', (e) => {
  console.error('Presentation error:', e.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Utility function to log presentation state for debugging
function logPresentationState() {
  if (window.presentation) {
    const info = window.presentation.getCurrentSlideInfo();
    const scrollInfo = window.presentation.getScrollInfo();
    
    console.log('Presentation State:', {
      currentSlide: info.current,
      totalSlides: info.total,
      title: info.title,
      hasScrollableContent: info.hasScrollableContent,
      isTransitioning: info.isTransitioning,
      scrollInfo: scrollInfo
    });
  }
}

// Make utility function globally available
window.logPresentationState = logPresentationState;

// Add keyboard shortcut for developers
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Shift + D to log debug info
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    logPresentationState();
  }
});

// Performance monitoring
if (window.performance && window.performance.mark) {
  window.performance.mark('presentation-init-start');
  
  window.addEventListener('load', () => {
    window.performance.mark('presentation-init-end');
    window.performance.measure('presentation-init', 'presentation-init-start', 'presentation-init-end');
    
    const measure = window.performance.getEntriesByName('presentation-init')[0];
    console.log(`Presentation initialized in ${measure.duration.toFixed(2)}ms`);
  });
}