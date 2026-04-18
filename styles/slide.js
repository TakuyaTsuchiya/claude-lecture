(function () {
  var W = 1280, H = 800;

  function update() {
    var deck = document.querySelector('.deck');
    if (!deck) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    if (vw >= W && vh >= H) {
      deck.style.cssText = '';
      return;
    }

    var scale = Math.min(vw / W, vh / H);
    deck.style.width = W + 'px';
    deck.style.height = H + 'px';
    deck.style.transform = 'scale(' + scale + ')';
    deck.style.transformOrigin = 'top left';
    deck.style.position = 'absolute';
    deck.style.left = Math.round((vw - W * scale) / 2) + 'px';
    deck.style.top = Math.round((vh - H * scale) / 2) + 'px';
  }

  window.addEventListener('resize', update);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
