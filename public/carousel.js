const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const slides = document.querySelectorAll(".slide");
const slideIcons = document.querySelectorAll(".icon");
const numberOfSlides = slides.length;
var slideNumber = 0;

nextBtn.addEventListener("click", () => {
    slides.forEach((slide) => {
        slide.classList.remove("active");
    });
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    });
    
    slideNumber++;

    if (slideNumber > (numberOfSlides - 1)){
        slideNumber = 0;
    }

  slides[slideNumber].classList.add("active");
  slideIcons[slideNumber].classList.add("active");
});

prevBtn.addEventListener("click", () => {
    slides.forEach((slide) => {
        slide.classList.remove("active");
    });
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    });
    
    slideNumber--;

    if (slideNumber < 0){
        slideNumber = numberOfSlides -1;
    }

  slides[slideNumber].classList.add("active");
  slideIcons[slideNumber].classList.add("active");
})