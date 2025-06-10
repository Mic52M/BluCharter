// Cookie banner functionality
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptButton = document.querySelector('.cookie-btn.accept');
    const settingsButton = document.querySelector('.cookie-btn.settings');

    // Check if user has already made a choice
    if (!localStorage.getItem('cookieChoice')) {
        cookieBanner.style.display = 'block';
    }

    // Handle accept button click
    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookieChoice', 'accepted');
        cookieBanner.style.display = 'none';
    });

    // Handle settings button click
    settingsButton.addEventListener('click', function() {
        localStorage.setItem('cookieChoice', 'settings');
        cookieBanner.style.display = 'none';
        // Here you can add additional logic for cookie settings
    });
}); 