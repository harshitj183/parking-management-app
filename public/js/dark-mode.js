/**
 * Dark Mode Handler for Parking Management App
 * This script handles dark mode toggle functionality across the application
 */

// Check if dark mode is enabled from localStorage
function isDarkModeEnabled() {
    return localStorage.getItem('darkMode') === 'true';
}

// Set dark mode by adding/removing the data-theme attribute
function setDarkMode(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'true');
        
        // Update any visible toggle switches
        const darkModeToggles = document.querySelectorAll('.dark-mode-toggle, #darkMode, #darkModeToggle');
        darkModeToggles.forEach(toggle => {
            if (toggle.type === 'checkbox') {
                toggle.checked = true;
            }
        });
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('darkMode', 'false');
        
        // Update any visible toggle switches
        const darkModeToggles = document.querySelectorAll('.dark-mode-toggle, #darkMode, #darkModeToggle');
        darkModeToggles.forEach(toggle => {
            if (toggle.type === 'checkbox') {
                toggle.checked = false;
            }
        });
    }
}

// Toggle dark mode
function toggleDarkMode() {
    setDarkMode(!isDarkModeEnabled());
}

// Initialize dark mode based on user preference
function initDarkMode() {
    // Check if user has a preference stored
    if (isDarkModeEnabled()) {
        setDarkMode(true);
    }
    
    // Attach event listeners to any dark mode toggles in the document
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle, #darkMode, #darkModeToggle');
    darkModeToggles.forEach(toggle => {
        if (toggle.type === 'checkbox') {
            toggle.checked = isDarkModeEnabled();
            toggle.addEventListener('change', (e) => {
                setDarkMode(e.target.checked);
            });
        } else {
            toggle.addEventListener('click', toggleDarkMode);
        }
    });
}

// Run initialization when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initDarkMode);

// Export functions for use in other scripts
window.darkMode = {
    toggle: toggleDarkMode,
    enable: () => setDarkMode(true),
    disable: () => setDarkMode(false),
    isEnabled: isDarkModeEnabled
};