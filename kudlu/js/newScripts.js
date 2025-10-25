
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".mobile-nav");
    menuToggle.addEventListener("click", function () {
    document.body.classList.toggle("menu-open");
    });
});



// let currentSlide = 0;
// const totalSlides = 3;

// window.addEventListener("load", () => {
//     const track = document.querySelector(".carousel-track");
//     const cards = document.querySelectorAll(".docCard");

//     function moveSlide(direction) {
//     const slideWidth = cards[0].offsetWidth;

//     if (direction === 1 && currentSlide < totalSlides - 1) {
//         currentSlide++;
//     } else if (direction === -1 && currentSlide > 0) {
//         currentSlide--;
//     }

//     track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
//     }

//     window.moveSlide = moveSlide; // expose to HTML onclick
// });


  const carousel = document.querySelector('#doctorCarousel');
  const carouselInstance = new bootstrap.Carousel(carousel);

  document.getElementById('prevSlide').addEventListener('click', () => {
    carouselInstance.prev();
  });

  document.getElementById('nextSlide').addEventListener('click', () => {
    carouselInstance.next();
  });

