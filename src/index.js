let slideIndex = 1;
showSlides(slideIndex);
// for next slide
function plusSlides(n) {
  showSlides(slideIndex += n);
}
// for current slide
function currentSlide(n) {
  showSlides(slideIndex = n);
}
// for diaplying showslide images
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
}