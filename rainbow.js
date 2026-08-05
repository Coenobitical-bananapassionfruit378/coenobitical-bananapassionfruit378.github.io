/* al pasar por encima: las letras suben en ola y viran a arcoíris,
   y vuelven solas a su sitio y a su azul */
(function(){
  var BLUE = [0, 24, 255];
  var AMP = 0.22;      // cuánto sube cada letra, en em
  var SPEED = 4.2;     // velocidad de la ola
  var STAGGER = 0.45;  // desfase entre letras
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hsl(h){
    var s = 1, l = 0.5;
    var c = (1 - Math.abs(2*l - 1)) * s;
    var x = c * (1 - Math.abs(((h/60) % 2) - 1));
    var m = l - c/2, r, g, b;
    if(h < 60){ r=c; g=x; b=0; }
    else if(h < 120){ r=x; g=c; b=0; }
    else if(h < 180){ r=0; g=c; b=x; }
    else if(h < 240){ r=0; g=x; b=c; }
    else if(h < 300){ r=x; g=0; b=c; }
    else { r=c; g=0; b=x; }
    return [(r+m)*255, (g+m)*255, (b+m)*255];
  }

  function mix(a, b, t){
    return 'rgb(' + Math.round(a[0]+(b[0]-a[0])*t) + ',' +
                    Math.round(a[1]+(b[1]-a[1])*t) + ',' +
                    Math.round(a[2]+(b[2]-a[2])*t) + ')';
  }

  function split(el){
    var text = el.textContent;
    el.textContent = '';
    var chars = [];
    for(var i=0;i<text.length;i++){
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = text[i];
      el.appendChild(s);
      if(text[i] !== ' ') chars.push(s);
    }
    return chars;
  }

  function attach(el){
    if(el.dataset.rbReady) return;
    el.dataset.rbReady = '1';
    var chars = split(el);
    if(!chars.length || reduce) return;

    var env = 0, target = 0, phase = 0, raf = null, last = null;

    function step(t){
      if(last === null) last = t;
      var dt = Math.min((t - last)/1000, 0.05);
      last = t;

      env += (target - env) * (1 - Math.exp(-dt / 0.18));
      phase += dt * SPEED;

      for(var i=0;i<chars.length;i++){
        var s = Math.sin(phase - i * STAGGER);
        var w = s > 0 ? s * s : 0;
        chars[i].style.transform = 'translateY(' + (-AMP * w * env).toFixed(4) + 'em)';
        chars[i].style.color = mix(BLUE, hsl((phase * 40 + i * 22) % 360), env);
      }

      if(target === 0 && env < 0.003){
        for(var j=0;j<chars.length;j++){
          chars[j].style.transform = '';
          chars[j].style.color = '';
        }
        raf = null; last = null;
        return;
      }
      raf = requestAnimationFrame(step);
    }

    function wake(){
      if(raf === null){ last = null; raf = requestAnimationFrame(step); }
    }
    function on(){ target = 1; wake(); }
    function off(){ target = 0; wake(); }

    el.addEventListener('pointerenter', on);
    el.addEventListener('pointerleave', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('focus', on);
    el.addEventListener('blur', off);
  }

  window.rainbow = function(selector){
    var els = document.querySelectorAll(selector || '.rb');
    for(var i=0;i<els.length;i++) attach(els[i]);
  };

  document.addEventListener('DOMContentLoaded', function(){ window.rainbow('.rb'); });
})();
