let slideIndex = 0;
const slideShow = () => {
    console.log(slideIndex);
  const slideShowPlaceholder = document.querySelector(".activiteiten--main-slideshow");
  if (!slideShowPlaceholder) {
    return;
  }

  const slides = document.querySelectorAll(".slides");
  for (let slide of slides){
      slide.style.opacity = 0;
  }
  slideIndex += 1;
  if (slideIndex > slides.length){slideIndex = 1}
  slides[slideIndex-1].style.opacity = 1;
  setTimeout(slideShow, 2000)
};
