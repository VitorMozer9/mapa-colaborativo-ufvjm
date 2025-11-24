// JavaScript da tela inicial

let slideIndex = 1;
let autoSlideInterval;

// Inicializa o slideshow
showSlides(slideIndex);
startAutoSlide();

function plusSlides(n) {
  showSlides(slideIndex += n);
  resetAutoSlide();
}

function currentSlide(n) {
  showSlides(slideIndex = n);
  resetAutoSlide();
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  
  if (slides.length > 0) {
    slides[slideIndex-1].style.display = "block";
    if (dots[slideIndex-1]) {
      dots[slideIndex-1].className += " active";
    }
  }
}

// Função para avançar automaticamente
function autoSlide() {
  plusSlides(1);
}

// Inicia o slide automático
function startAutoSlide() {
  autoSlideInterval = setInterval(autoSlide, 5000); // Muda a cada 5 segundos
}

// Reseta o timer do slide automático
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Event listeners para as setas
document.querySelector('.prev').addEventListener('click', () => {
    plusSlides(-1);
});

document.querySelector('.next').addEventListener('click', () => {
    plusSlides(1);
});

// Event listeners para os dots
const dots = document.querySelectorAll('.dot');
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide(index + 1);
    });
});