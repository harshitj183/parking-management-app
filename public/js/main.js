/**
 * Parking Management System Main JS
 */

// Format date and time helper function
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format price helper function
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

// Show loading spinner
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading...</p></div>';
    }
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
    }
}

// Parse URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

// Animation functions
function fadeIn(element, duration = 500) {
    if (!element) return;
    
    element.style.opacity = 0;
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    setTimeout(() => {
        element.style.opacity = 1;
    }, 10);
}

function fadeOut(element, duration = 500) {
    if (!element) return;
    
    element.style.opacity = 1;
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    element.style.opacity = 0;
    setTimeout(() => {
        element.style.display = 'none';
    }, duration);
}

function slideIn(element, direction = 'left', duration = 500) {
    if (!element) return;
    
    const initialTransform = direction === 'left' ? 'translateX(-50px)' : 
                            direction === 'right' ? 'translateX(50px)' : 
                            direction === 'top' ? 'translateY(-50px)' : 'translateY(50px)';
    
    element.style.opacity = 0;
    element.style.transform = initialTransform;
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-out`;
    
    setTimeout(() => {
        element.style.opacity = 1;
        element.style.transform = 'translate(0, 0)';
    }, 10);
}

function animateParkingCards() {
    const parkingCards = document.querySelectorAll('.parking-card');
    if (!parkingCards.length) return;
    
    parkingCards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 500ms ease-in-out, transform 500ms ease-out';
        
        setTimeout(() => {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, 100 * index); // Stagger the animations
    });
}

function animateAvailableSlots(element) {
    if (!element) return;
    
    element.classList.add('pulse-animation');
    setTimeout(() => {
        element.classList.remove('pulse-animation');
    }, 1000);
}

// Responsive adjustments
function handleResponsiveLayout() {
    const windowWidth = window.innerWidth;
    
    if (windowWidth < 768) {
        // Mobile layout adjustments
        const mapElement = document.getElementById('map');
        if (mapElement) {
            mapElement.style.height = '400px';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    handleResponsiveLayout();
    
    // Handle window resize
    window.addEventListener('resize', handleResponsiveLayout);
    
    // Add toast notifications if needed
    const toastElements = document.querySelectorAll('.toast');
    if (toastElements.length > 0) {
        toastElements.forEach(toastEl => {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        });
    }
    
    // Initialize animations
    animateParkingCards();
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('button-click-effect');
            setTimeout(() => {
                this.classList.remove('button-click-effect');
            }, 300);
        });
    });
    
    // Animate available slots when they change
    const availableSlotElements = document.querySelectorAll('.available-slots');
    availableSlotElements.forEach(element => {
        animateAvailableSlots(element);
    });
});