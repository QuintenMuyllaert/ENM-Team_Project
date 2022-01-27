const slideShow = async () => {
  const slides = document.querySelectorAll(".slides");

  const times = 2;
  const time = slideLength / slides.length;

  for (let j = 0; j < times; j++) {
    for (let slideIndex = 0; slideIndex < slides.length; slideIndex++) {
      const slideShowPlaceholder = document.querySelector(".item--big-slide-container");
      if (!slideShowPlaceholder) {
        return;
      }

      for (let slide of slides) {
        slide.style.opacity = 0;
      }

      let last = slideIndex - 1;
      if (last == -1) {
        last = slides.length - 1;
      }
      slides[last].style.opacity = 1;
      await delay(time * 1000);
    }
  }
};
