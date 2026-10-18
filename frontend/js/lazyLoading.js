  function activatetGifs() {
    const gif = document.querySelectorAll('img[data-gif]');
    
    gif.forEach((img) => {
    const gifUrl = img.getAttribute('data-gif');
    if (gifUrl) {
      img.src = gifUrl + '?t=' + new Date().getTime();
     }
   });
  }

  if (document.readyState === 'complete') {
  activatetGifs();
} else {
  window.addEventListener('load', activatetGifs);
}
