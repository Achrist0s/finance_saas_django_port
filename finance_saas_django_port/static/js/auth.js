// Authentication related JavaScript
function togglePassword(inputId = 'password') {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = passwordInput?.parentElement.querySelector('svg');

    if (!passwordInput || !eyeIcon) return;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        `;
    }
}

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const authForms = document.querySelectorAll('.auth-form');

    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="spinner"></div> Processing...';

                // Re-enable button after 3 seconds in case of error
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
                }, 3000);
            }
        });
    });
});

// Store original button text
document.addEventListener('DOMContentLoaded', function() {
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(btn => {
        btn.dataset.originalText = btn.textContent;
    });
});

// Export for global use
window.togglePassword = togglePassword;