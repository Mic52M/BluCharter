// script.js

// 1) Funzione globale per Google Maps (richiamata da callback nel tag <script>)
function initMap() {
    const portoErcole = { lat: 42.4455, lng: 11.2369 };  // Porto Ercole, Toscana
    new google.maps.Map(document.getElementById('map'), {
        center: portoErcole,
        zoom: 14
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Inizializzo EmailJS (una sola volta)
    emailjs.init('5I66iuj7Qf7_M54Pv'); // <-- il tuo public key

    // 2) Slide-in header on first scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 0);
    });

    // 3) Inizializzo AOS
    AOS.init({
        duration: 1200,
        easing: 'ease-in-out',
        once: true
    });

    // 4) Smooth scroll per anchor link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))
                .scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 5) Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTopBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 6) EmailJS form submission
    const form = document.getElementById('contact-form');
    const confirmationBanner = document.getElementById('confirmation-banner');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const nome = formData.get('from_name');
        const email = formData.get('user_email');
        const telefono = formData.get('phone') || 'Non fornito';
        const messaggio = formData.get('message');

        // HTML personalizzato solo per il tuo uso interno
        const body = `
            <div style="font-family: Poppins, Arial, sans-serif; color: #003366;">
                <h2>Nuovo messaggio dal sito Giri in Barca</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefono:</strong> ${telefono}</p>
                <p><strong>Messaggio:</strong><br>${messaggio}</p>
                <hr style="border: none; border-top: 1px solid #cce7ff; margin: 16px 0;">
                <p style="font-size: 0.95em; color: #888;">Ricevi questa email perché qualcuno ha compilato il modulo contatti dal sito <a href='https://girinbarca.it' style='color:#1a75ff;'>girinbarca.it</a>.</p>
            </div>
        `;

        // 1. Invia a TE
        emailjs.send('service_dyfedal', 'template_b0vy7v5', {
            from_name: nome,
            user_email: email,
            phone: telefono,
            message: messaggio,
            html_message: body
        })
        .then(() => {
            // 2. Invia AUTO-REPLY all'utente
            return emailjs.send('service_dyfedal', 'template_9x58cph', {
                name: nome,
                title: messaggio,
                email: email
            });
        })
        .then(() => {
            confirmationBanner.style.display = 'block';
            form.reset();
            setTimeout(() => confirmationBanner.style.display = 'none', 3000);
        })
        .catch(error => {
            alert('Errore nell\'invio del messaggio: ' + JSON.stringify(error));
        });
    });

    // 7) Play/pause video on visibility
    const video = document.getElementById('about-video');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.isIntersecting ? video.play() : video.pause();
        });
    }, { threshold: 0.5 });
    observer.observe(video);

    // 8) Show controls on hover
    video.addEventListener('mouseover', () => {
        video.controls = true;
        video.muted = false;
        video.style.border = '2px solid #004d40';
    });
    video.addEventListener('mouseout', () => {
        video.controls = false;
        video.muted = true;
        video.style.border = 'none';
    });

    // Cookie Banner Functions
    function showCookieBanner() {
        const cookieBanner = document.getElementById('cookieBanner');
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
        }
    }

    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        document.getElementById('cookieBanner').style.display = 'none';
    }

    function openCookieSettings() {
        // Open privacy policy in new tab
        window.open(document.querySelector('.cookie-text a').href, '_blank');
    }

    // Show cookie banner when scrolling
    let hasScrolled = false;
    window.addEventListener('scroll', function() {
        if (!hasScrolled && !localStorage.getItem('cookieConsent')) {
            hasScrolled = true;
            showCookieBanner();
        }
    });

    // Show cookie banner when page loads if already scrolled
    if (window.scrollY > 0 && !localStorage.getItem('cookieConsent')) {
        showCookieBanner();
    }
});
