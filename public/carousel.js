let slideIndex = 1;
showSlides(slideIndex);

// next/prev controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  // ensure it loops around
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  // hide all the images
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"
  }
  
  // display the correct image
  slides[slideIndex-1].style.display = "block";
}