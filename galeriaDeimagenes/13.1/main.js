
const images = [
    './img/img0.jpeg',
    './img/img1.jpg',
    './img/img2.jpg',
    './img/img3.jpeg'
];

const track = document.querySelector('.carousel-track');


images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('slide');
    track.appendChild(img);
});

let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function updateCarousel() {
    const width = track.clientWidth;
    track.style.transform = `translateX(-${currentIndex * width}px)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
    updateCarousel();
});



