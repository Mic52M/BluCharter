document.addEventListener('DOMContentLoaded', function() {
  // Initialize main swiper
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
}); 