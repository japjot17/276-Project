const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const slides = document.querySelectorAll(".slide");
const slideIcons = document.querySelectorAll(".icon");
const numberOfSlides = slides.length;
var slideNumber = 0;

// Next Button
nextBtn.addEventListener("click", () => {
    // remove active class from all slides and icons
    slides.forEach((slide) => {
        slide.classList.remove("active");
    });
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    });
    
    // increment the slideNumber
    slideNumber++;

    // ensure slides loop around
    if (slideNumber > (numberOfSlides - 1)){
        slideNumber = 0;
    }

    // add active class to a slide/icon to display/highlight them
    slides[slideNumber].classList.add("active");
    slideIcons[slideNumber].classList.add("active");
});

// Prev Button
prevBtn.addEventListener("click", () => {
    // remove active class from all slides and icons
    slides.forEach((slide) => {
        slide.classList.remove("active");
    });
    slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
    });
    
    // decrease the slideNumber by 1
    slideNumber--;

    // ensure slides loop around
    if (slideNumber < 0){
        slideNumber = numberOfSlides -1;
    }

    // add active class to a slide/icon to display/highlight them
    slides[slideNumber].classList.add("active");
    slideIcons[slideNumber].classList.add("active");
})

// Automatically shuffle through the slides
var currentInterval;

var loopThrough = () => {
    currentInterval = setInterval(function() {
        // remove active class from all slides and icons
        slides.forEach((slide) => {
            slide.classList.remove("active");
        });
        slideIcons.forEach((slideIcon) => {
            slideIcon.classList.remove("active");
        });

        // increase the slideNumber by 1
        slideNumber++;

        // ensure slides loop around
        if (slideNumber > (numberOfSlides -1)) {
            slideNumber = 0;
        }

        // add active class to a slide/icon to display/highlight them
        slides[slideNumber].classList.add("active");
        slideIcons[slideNumber].classList.add("active");
    }, 5000);   // switch slides every 5 seconds
}

loopThrough();

// stop the image carousel autoplay when mousing over the next or previous button
nextBtn.addEventListener("mouseover", () => {
    clearInterval(currentInterval)
});
prevBtn.addEventListener("mouseover", () => {
    clearInterval(currentInterval)
});

// restart the image slider autoplay after mouseout
nextBtn.addEventListener("mouseout", () => {
    loopThrough();
})
prevBtn.addEventListener("mouseout", () => {
    loopThrough();
})
