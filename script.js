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

    // Initialize Swiper carousels
    const mainSwiper = new Swiper('.boat-swiper', {
      direction: 'horizontal',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    // Initialize nested swipers
    const nestedSwipers = document.querySelectorAll('.nested-swiper');
    nestedSwipers.forEach((swiperElement) => {
      new Swiper(swiperElement, {
        direction: 'horizontal',
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    });

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

    // 7) Play/pause video on visibility e audio on hover
    var aboutVideo = document.getElementById('aboutVideo');
    if (aboutVideo) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.isIntersecting ? aboutVideo.play() : aboutVideo.pause();
        });
      }, { threshold: 0.5 });
      observer.observe(aboutVideo);

      aboutVideo.addEventListener('mouseover', () => {
        aboutVideo.controls = true;
        aboutVideo.muted = false;
        aboutVideo.style.border = '2px solid #004d40';
      });
      aboutVideo.addEventListener('mouseout', () => {
        aboutVideo.controls = false;
        aboutVideo.muted = true;
        aboutVideo.style.border = 'none';
      });
    }

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

    const hero = document.querySelector('.hero');
    if (hero) {
        const img = new window.Image();
        img.src = 'images/azimuthero.webp';
        img.onload = function() {
            hero.classList.add('loaded');
        };
    }

    // --- AUTOPLAY SWIPER (carosello barca) ---
    if (window.Swiper) {
      var boatSwiper = new Swiper('.boat-swiper', {
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });
    }

    // --- VIDEO ABOUT: autoplay, audio on hover ---
    var aboutVideo = document.getElementById("aboutVideo");
    if (aboutVideo) {
      // Autoplay e mute all'avvio
      aboutVideo.muted = true;
      aboutVideo.autoplay = true;
      aboutVideo.load();
      // Play/Pause in base alla visibilità (opzionale, se vuoi che si fermi quando non visibile)
      if (window.IntersectionObserver) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            entry.isIntersecting ? aboutVideo.play() : aboutVideo.pause();
          });
        }, { threshold: 0.5 });
        observer.observe(aboutVideo);
      }
      // Audio on hover
      aboutVideo.addEventListener("mouseenter", function () {
        aboutVideo.muted = false;
      });
      aboutVideo.addEventListener("mouseleave", function () {
        aboutVideo.muted = true;
      });
    }

    // --- INTERACTIVE BOAT VIEWER TABS (V2) ---
    const tabs = document.querySelectorAll('.boat-tabs-nav li');
    const panes = document.querySelectorAll('.boat-details-interactive .tab-pane');

    tabs.forEach(tab => {
      // Click handler
      tab.addEventListener('click', () => {
        switchTab(tab);
      });
      
      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchTab(tab);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateTabs(e.key === 'ArrowRight' ? 1 : -1, tab);
        }
      });
      
      // Focus management
      tab.addEventListener('focus', () => {
        tab.style.outline = '2px solid #1a75ff';
        tab.style.outlineOffset = '2px';
      });
      
      tab.addEventListener('blur', () => {
        tab.style.outline = '';
        tab.style.outlineOffset = '';
      });
    });

    function switchTab(selectedTab) {
      const targetId = 'tab-' + selectedTab.getAttribute('data-tab');
      
      // Update tab states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      panes.forEach(p => {
        p.classList.remove('active');
      });

      // Activate selected tab
      selectedTab.classList.add('active');
      selectedTab.setAttribute('aria-selected', 'true');
      
      // Show target pane with animation
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        
        // Trigger AOS animations for content inside the pane
        const animatedElements = targetPane.querySelectorAll('[data-aos]');
        animatedElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('aos-animate');
          }, index * 100);
        });
      }
    }

    function navigateTabs(direction, currentTab) {
      const tabArray = Array.from(tabs);
      const currentIndex = tabArray.indexOf(currentTab);
      const nextIndex = (currentIndex + direction + tabArray.length) % tabArray.length;
      const nextTab = tabArray[nextIndex];
      
      nextTab.focus();
      switchTab(nextTab);
    }

    // Modern Tours Section Enhancements
    initModernTours();
    
    // Initialize intersection observer for scroll animations
    initScrollAnimations();
    
    // Initialize parallax effects
    initParallaxEffects();

    // Modern Services Section Enhancements
    initModernServices();
});

function initModernTours() {
  const tourCards = document.querySelectorAll('.tour-card.modern-card');
  
  tourCards.forEach((card, index) => {
    // Add staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Add click handler for better UX
    card.addEventListener('click', function() {
      // Add ripple effect
      createRippleEffect(this, event);
      
      // Optional: Navigate to tour details
      const tourType = this.getAttribute('data-tour');
      console.log(`Tour selected: ${tourType}`);
    });
    
    // Add keyboard navigation
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
    
    // Add focus management
    card.addEventListener('focus', function() {
      this.style.transform = 'translateY(-8px) scale(1.01)';
    });
    
    card.addEventListener('blur', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Initialize CTA button effects
  const ctaButton = document.querySelector('.tours-cta-btn.modern-cta-btn');
  if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
      createRippleEffect(this, e);
    });
  }
}

function createRippleEffect(element, event) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
    z-index: 10;
  `;
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe tour cards
  document.querySelectorAll('.tour-card.modern-card').forEach(card => {
    observer.observe(card);
  });
  
  // Observe title and CTA
  document.querySelectorAll('.tours-title.modern-title, .tours-cta-wrapper.modern-cta-wrapper').forEach(el => {
    observer.observe(el);
  });
}

function initParallaxEffects() {
  const tourCards = document.querySelectorAll('.tour-card.modern-card');
  
  tourCards.forEach(card => {
    const img = card.querySelector('.tour-img.modern-img');
    
    if (img) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        img.style.transform = `
          scale(1.08) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1.08)';
      });
    }
  });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .animate-in {
    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Add smooth scroll behavior for tour cards
document.addEventListener('DOMContentLoaded', function() {
  const tourCards = document.querySelectorAll('.tour-card.modern-card');
  
  tourCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Prevent default only if we want to add custom navigation
      // e.preventDefault();
      
      // Add visual feedback
      this.style.transform = 'translateY(-8px) scale(1.02)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
});

// Enhanced hover effects for feature tags
document.addEventListener('DOMContentLoaded', function() {
  const featureTags = document.querySelectorAll('.feature-tag');
  
  featureTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

function initModernServices() {
  // Reveal on scroll
  const serviceCards = document.querySelectorAll('.modern-service-card');
  serviceCards.forEach((card, idx) => {
    card.style.animationDelay = `${idx * 0.1 + 0.1}s`;
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in-service');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  serviceCards.forEach(card => observer.observe(card));

  // Badge animation (pulse/scale)
  document.querySelectorAll('.modern-badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.classList.add('badge-pulse');
    });
    badge.addEventListener('mouseleave', function() {
      this.classList.remove('badge-pulse');
    });
    badge.addEventListener('focus', function() {
      this.classList.add('badge-pulse');
    });
    badge.addEventListener('blur', function() {
      this.classList.remove('badge-pulse');
    });
  });

  // Ripple effect sui bottoni
  document.querySelectorAll('.modern-service-btn.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      createRippleEffect(this, e);
    });
  });

  // Bullet point icon animation
  document.querySelectorAll('.modern-service-list .list-icon').forEach(icon => {
    icon.parentElement.addEventListener('mouseenter', function() {
      icon.style.transform = 'scale(1.18) rotate(-10deg)';
    });
    icon.parentElement.addEventListener('mouseleave', function() {
      icon.style.transform = '';
    });
  });

  // Keyboard accessibility for cards and buttons
  serviceCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const btn = card.querySelector('.modern-service-btn');
        if (btn) btn.click();
      }
    });
    card.addEventListener('focus', function() {
      card.style.transform = 'scale(1.02) translateY(-4px)';
    });
    card.addEventListener('blur', function() {
      card.style.transform = '';
    });
  });
}

// Badge pulse animation CSS
const styleServices = document.createElement('style');
styleServices.textContent = `
  .badge-pulse {
    animation: badgePulse 0.6s cubic-bezier(.4,1.4,.6,1);
  }
  @keyframes badgePulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 #1a75ff33; }
    50% { transform: scale(1.13); box-shadow: 0 0 0 8px #1a75ff22; }
    100% { transform: scale(1); box-shadow: 0 0 0 0 #1a75ff00; }
  }
  .animate-in-service {
    animation: fadeInUpService 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
`;
document.head.appendChild(styleServices);
