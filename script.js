document.addEventListener('DOMContentLoaded', function () {
    AOS.init();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Back to top button
    var backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // EmailJS form submission
    var form = document.getElementById('contact-form');
    var confirmationBanner = document.getElementById('confirmation-banner');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        emailjs.init('380er2LkiSz9SgJAj'); // Replace with your EmailJS public key

        emailjs.sendForm('service_1jh3aao', 'template_w878u55', this)
            .then(function () {
                confirmationBanner.style.display = 'block';
                form.reset();
                setTimeout(function () {
                    confirmationBanner.style.display = 'none';
                }, 3000); // Hide banner after 3 seconds
            }, function (error) {
                alert('Errore nell\'invio del messaggio: ' + JSON.stringify(error));
            });
    });

    // Initialize Google Map
    var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    }
    initMap();

    // Play video when section is visible
    var video = document.getElementById('about-video');
    var options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, options);

    observer.observe(video);

    // Show controls on hover
    video.addEventListener('mouseover', function () {
        video.controls = true;
        video.muted = false;
        video.style.border = '2px solid #004d40';
    });

    video.addEventListener('mouseout', function () {
        video.controls = false;
        video.muted = true;
        video.style.border = 'none';
    });
});