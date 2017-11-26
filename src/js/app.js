// JS Goes here - ES6 supported
import Siema from "siema";

document.addEventListener("DOMContentLoaded", () => {
  const PARALLAX_PERCENT = 30;

  let video;
  let menuBtn;
  const body = document.body;
  let parallaxes;
  let moveDecorations;
  let siemaElement;
  let siema;

  setTimeout(() => {

    body.classList.remove("not-loaded");
    body.classList.remove("not-loaded");
    video = document.querySelector("video");
    menuBtn = document.getElementById("menu_btn");
    parallaxes = document.querySelectorAll(".js-parallax-background");
    moveDecorations = document.querySelectorAll(".js-move-decoration");
    siemaElement = document.querySelectorAll(".siema")[0];
    // video.playbackRate = 0.6;
    if (video != null) {
      video.play();
    }


    if (siemaElement != null) {
      siema = new Siema({
        loop: true,
        duration: 1000
      });
      const runSi = () => {
        siema.next(1, () => {
          setTimeout(() => {
            runSi();
          }, 5000);
        });
      };
      setTimeout(() => {
        runSi();
      }, 5000);
    }

    if (menuBtn != null) {
      menuBtn.addEventListener("click", ($event) => {
        console.log("menu toggle");
        body.classList.toggle("is-menu");
      });
    }


    const onScrollPrallaxHandler = (scrolled) => {
      const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const parallaxPerHeight = -1 * PARALLAX_PERCENT / viewportHeight;
      for (const parallax of parallaxes) {
        const viewportOffset = parallax.getBoundingClientRect();
        if (viewportOffset.top > 0 && viewportOffset.top < viewportHeight) {
          const diff = viewportHeight - viewportOffset.top;
          const parallaxLength = diff * parallaxPerHeight;
          parallax.style.top = `${parallaxLength}%`;
        }
      }
      for (const item of moveDecorations) {
        const viewportOffset = item.getBoundingClientRect();
        if (viewportOffset.top < viewportHeight) {
          item.classList.add("animated");
        }
      }
    };

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      onScrollPrallaxHandler(scrolled);
    });



  }, 4500);

});
