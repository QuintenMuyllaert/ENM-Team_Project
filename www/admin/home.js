//Is this even needed?
pageFunction["./control/home.html"] = async () => {
  skeletonSlide = await fetchString("./control/home.html");
  let html = generateSlide(await fetchString("./control/home.html"));

  htmlControlHomeSlideLength = document.querySelector(".js-home-slide-length");
  htmlControlHomeStaticSlide = document.querySelector(".js-home-static-slide");

  config = await fetchJSON("../config.json");
  staticSlideNr = config.staticSlideNr;
  slideLength = config.slideLength;
  // endAnimationLength = config.endAnimationLength;
  // useScalingFunction = config.useScalingFunction;
  htmlControlHomeSlideLength.value = slideLength;
  htmlControlHomeStaticSlide.value = staticSlideNr;

  htmlControlHomeSubmit = document.querySelector(".js-control-home-submit");

  htmlControlHomeSubmit.addEventListener("click", async () => {
    staticSlideNr = htmlControlHomeSlideLength.value;
    slideLength = htmlControlHomeStaticSlide.value;
  });
};
