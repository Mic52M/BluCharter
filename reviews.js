document.addEventListener('DOMContentLoaded', function() {
    // Star Rating System
    const starRating = document.querySelector('.star-rating');
    const stars = starRating.querySelectorAll('i');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            updateStars(rating);
        });

        star.addEventListener('mouseout', function() {
            updateStars(selectedRating);
        });

        star.addEventListener('click', function() {
            selectedRating = this.getAttribute('data-rating');
            updateStars(selectedRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = star.getAttribute('data-rating');
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.classList.add('active');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.classList.remove('active');
            }
        });
    }

    // Image Upload Preview & Drag&Drop
    const imageInput = document.getElementById('review-images');
    const imagePreview = document.querySelector('.image-preview');
    const dropArea = document.getElementById('drop-area');
    let filesArray = [];

    // Apri file picker su click su custom-file
    dropArea.addEventListener('click', function(e) {
        if (e.target.tagName === 'SPAN' || e.target === dropArea) {
            imageInput.click();
        }
    });

    // Drag&drop events
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropArea.style.background = '#f0f6ff';
        dropArea.style.borderColor = '#1a75ff';
    });
    dropArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropArea.style.background = '';
        dropArea.style.borderColor = '';
    });
    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        dropArea.style.background = '';
        dropArea.style.borderColor = '';
        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        filesArray = filesArray.concat(droppedFiles);
        updateImagePreview();
    });

    // File input change
    imageInput.addEventListener('change', function() {
        const selectedFiles = Array.from(this.files).filter(f => f.type.startsWith('image/'));
        filesArray = filesArray.concat(selectedFiles);
        updateImagePreview();
        imageInput.value = '';
    });

    // Aggiorna anteprima immagini
    function updateImagePreview() {
        imagePreview.innerHTML = '';
        filesArray.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';
                const img = document.createElement('img');
                img.src = e.target.result;
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;';
                removeBtn.className = 'remove-img';
                removeBtn.onclick = function(ev) {
                    ev.preventDefault();
                    filesArray.splice(idx, 1);
                    updateImagePreview();
                };
                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                imagePreview.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        });
    }

    // Review Form Submission
    const reviewForm = document.getElementById('review-form');
    
    const API_URL = 'http://localhost:3001/api/reviews';

    // --- CARICAMENTO RECENSIONI ---
    const REVIEWS_PER_PAGE = 2; // sempre 2 in verticale
    let carouselIndex = 0;
    let allReviews = [];
    let lastDirection = 'right';

    function renderStars(rating) {
        let html = '';
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        for (let i = full + half; i < 5; i++) html += '<i class="far fa-star"></i>';
        return html;
    }

    function renderReviewCard(r) {
        return `<div class="review-card">
            <div class="review-content">
                <div class="review-header">
                    <div class="reviewer-info">
                        <h4>${r.name}</h4>
                        <div class="rating">${renderStars(r.rating)}</div>
                        <span class="review-date">${r.date ? r.date.split('-').reverse().join('/') : ''}</span>
                    </div>
                </div>
                <p class="review-text">${r.text}</p>
            </div>
            <div class="review-images">
                ${(r.images||[]).map(img => `<img src="${img}" alt="Review Image" loading="lazy" class="review-img-thumb">`).join('')}
            </div>
        </div>`;
    }

    function updateCarousel(direction = 'right') {
        const container = document.querySelector('.carousel-inner');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        if (!container) return;
        const total = allReviews.length;
        const perPage = REVIEWS_PER_PAGE;
        let start = carouselIndex;
        if (start > total - perPage) start = Math.max(0, total - perPage);
        const end = Math.min(start + perPage, total);
        const reviewsToShow = allReviews.slice(start, end);
        // Animazione: rimuovo vecchie slide con animazione
        const oldSlides = Array.from(container.querySelectorAll('.carousel-slide'));
        oldSlides.forEach(slide => {
            slide.classList.remove('active');
            if (direction === 'right') {
                slide.classList.add('slide-out-left');
            } else {
                slide.classList.add('slide-out-right');
            }
            setTimeout(() => {
                if (slide.parentNode) slide.parentNode.removeChild(slide);
            }, 500);
        });
        // Creo nuove slide
        const slides = reviewsToShow.length ? reviewsToShow.map(renderReviewCard) : ['<div style="color:#aaa;text-align:center;">Nessuna recensione ancora.</div>'];
        slides.forEach((html, idx) => {
            let slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = html;
            if (direction === 'right') {
                slide.classList.add('slide-in-right');
            } else {
                slide.classList.add('slide-in-left');
            }
            setTimeout(() => {
                slide.classList.add('active');
                slide.classList.remove('slide-in-right', 'slide-in-left');
            }, 10);
            container.appendChild(slide);
        });
        prevBtn.disabled = start === 0;
        nextBtn.disabled = end >= total;
        carouselIndex = start;
        lastDirection = direction;
    }

    async function loadReviews() {
        const res = await fetch(API_URL);
        allReviews = await res.json();
        carouselIndex = 0;
        updateCarousel();
    }

    document.getElementById('carousel-prev').addEventListener('click', () => {
        carouselIndex = Math.max(0, carouselIndex - REVIEWS_PER_PAGE);
        updateCarousel('left');
    });
    document.getElementById('carousel-next').addEventListener('click', () => {
        carouselIndex = Math.min(allReviews.length - REVIEWS_PER_PAGE, carouselIndex + REVIEWS_PER_PAGE);
        updateCarousel('right');
    });

    // Lightbox immagini recensione
    const lightbox = document.getElementById('review-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('review-img-thumb')) {
            lightboxImg.src = e.target.src;
            lightbox.classList.add('active');
        }
        if (e.target.classList.contains('close-lightbox')) {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
        }
    });
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            lightboxImg.src = '';
        }
    });

    // --- INVIO RECENSIONE ---
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        const name = this.reviewer_name.value.trim();
        const text = this.review_text.value.trim();
        const rating = selectedRating || 0;
        if (!name || !text || !rating) {
            alert('Compila tutti i campi obbligatori e seleziona una valutazione.');
            submitBtn.disabled = false;
            return false;
        }
        let images = [];
        if (filesArray.length) {
            images = await Promise.all(filesArray.map(f => new Promise(res => {
                const reader = new FileReader();
                reader.onload = e => res(e.target.result);
                reader.readAsDataURL(f);
            })));
        }
        const reviewData = { name, text, rating, images };
        try {
            const resp = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
            if (!resp.ok) throw new Error('Errore invio');
            // Mostra banner conferma
            const banner = document.getElementById('review-confirm-banner');
            banner.textContent = 'Recensione inviata! Sarà visibile dopo l\'approvazione da parte dello staff.';
            banner.style.display = 'block';
            setTimeout(() => {
                banner.style.display = 'none';
                submitBtn.disabled = false;
            }, 4000);
            reviewForm.reset();
            filesArray = [];
            imagePreview.innerHTML = '';
            updateStars(0);
            selectedRating = 0;
            return false;
        } catch {
            alert('Errore durante l\'invio della recensione.');
            submitBtn.disabled = false;
            return false;
        }
    });

    // Carica recensioni al load
    loadReviews();
}); 