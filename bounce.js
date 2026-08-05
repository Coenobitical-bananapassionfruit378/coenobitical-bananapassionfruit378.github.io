/* rebote tipo dvd dentro de un área */
function bounce(area, el, speedAt1080, startX, startY){
  var COND = 0.853;                 // condensado del boceto
  var x = 0, y = 0, vx = 1, vy = 1;
  var W = 0, H = 0, w = 0, h = 0, speed = speedAt1080;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function apply(){
    el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scaleX(' + COND + ')';
  }

  function measure(){
    apply();                                   // condensa antes de medir
    var a = area.getBoundingClientRect();
    W = a.width; H = a.height;
    var b = el.getBoundingClientRect();
    w = b.width; h = b.height;
    speed = speedAt1080 * (W / 677);          // 677px = ancho del área en el boceto
    x = Math.max(0, Math.min(x, W - w));
    y = Math.max(0, Math.min(y, H - h));
    apply();
  }

  measure();
  x = Math.max(0, W - w) * (startX === undefined ? 0.5 : startX);   // arranca donde está en el boceto
  y = Math.max(0, H - h) * (startY === undefined ? 0.5 : startY);
  apply();

  var last = null;
  function frame(t){
    if(last === null) last = t;
    var dt = Math.min((t - last) / 1000, 0.05);
    last = t;

    if(!reduce && W > 0){
      x += vx * speed * dt;
      y += vy * speed * dt;
      if(x <= 0){ x = 0; vx = Math.abs(vx); }
      if(x + w >= W){ x = W - w; vx = -Math.abs(vx); }
      if(y <= 0){ y = 0; vy = Math.abs(vy); }
      if(y + h >= H){ y = H - h; vy = -Math.abs(vy); }
      apply();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.addEventListener('resize', measure);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
}
