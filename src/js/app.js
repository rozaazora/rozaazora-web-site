// JS Goes here - ES6 supported
document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector("video");
  const menuBtn = document.getElementById("menu_btn");
  const body = document.body;

  video.playbackRate = 0.6;
  menuBtn.addEventListener("click", ($event) => {
    body.classList.toggle("is-menu");
  });

});
