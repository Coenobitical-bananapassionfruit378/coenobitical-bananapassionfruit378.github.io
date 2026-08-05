/* tira de piezas en movimiento continuo, con arrastre tipo spin y popup */
function marquee(opts){
  var CFG = {
    key: opts.key,
    rows: opts.rows || 1,
    baseSpeeds: opts.baseSpeeds || [58],
    tau: opts.tau || 1.6,          // segundos hasta recuperar la velocidad normal
    maxSpin: 3800,
    fallback: opts.fallback || [],
    empty: opts.empty || ''
  };

  var rowsEl = document.getElementById('rows');
  var lightbox = document.getElementById('lightbox');
  var lbFigure = document.getElementById('lbFigure');
  var closeBtn = document.getElementById('close');
  var rows = [], items = [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isVideo(src){ return /\.(mp4|webm|mov|m4v)$/i.test(src); }

  function shuffle(a){
    a = a.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  function makeItem(src){
    var d = document.createElement('div');
    d.className = 'item';
    d.dataset.src = src;
    if(isVideo(src)){
      var v = document.createElement('video');
      v.src = src; v.muted = true; v.loop = true; v.autoplay = true;
      v.playsInline = true; v.setAttribute('playsinline',''); v.preload = 'metadata';
      d.appendChild(v);
    }else{
      var img = document.createElement('img');
      img.src = src; img.alt = ''; img.decoding = 'async';
      d.appendChild(img);
    }
    return d;
  }

  function build(){
    rowsEl.innerHTML = '';
    rows = [];
    if(!items.length) return;

    for(var r=0; r<CFG.rows; r++){
      var row = document.createElement('div');
      row.className = 'row';
      var track = document.createElement('div');
      track.className = 'track';
      row.appendChild(track);
      rowsEl.appendChild(row);

      var set = shuffle(items);
      while(set.length < 3) set = set.concat(shuffle(items));

      var base = CFG.baseSpeeds[r % CFG.baseSpeeds.length];
      rows.push({ el:track, set:set, offset:Math.random()*300, speed:base, base:base, setW:0 });
    }
    layout();
  }

  function layout(){
    for(var i=0;i<rows.length;i++){
      var row = rows[i];
      row.el.innerHTML = '';
      var probe = makeItem(row.set[0]);
      row.el.appendChild(probe);
      var itemW = probe.getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(row.el).gap) || 0;
      row.el.innerHTML = '';

      row.setW = row.set.length * (itemW + gap);
      var copies = Math.ceil((window.innerWidth * 2) / row.setW) + 1;

      var frag = document.createDocumentFragment();
      for(var c=0;c<copies;c++){
        for(var k=0;k<row.set.length;k++) frag.appendChild(makeItem(row.set[k]));
      }
      row.el.appendChild(frag);
    }
  }

  /* ---- animación ---- */
  var last = null, dragging = false;

  function frame(t){
    if(last === null) last = t;
    var dt = Math.min((t - last)/1000, 0.05);
    last = t;
    var k = 1 - Math.exp(-dt / CFG.tau);

    for(var i=0;i<rows.length;i++){
      var row = rows[i];
      if(!dragging){
        row.speed += (row.base - row.speed) * k;
        if(!reduce) row.offset += row.speed * dt;
      }
      if(row.setW > 0){
        row.offset = ((row.offset % row.setW) + row.setW) % row.setW;
        row.el.style.transform = 'translate3d(' + (-row.offset).toFixed(2) + 'px,0,0)';
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- arrastre = spin ---- */
  var lastX = 0, lastT = 0, vel = 0, moved = 0, pid = null;

  rowsEl.addEventListener('pointerdown', function(e){
    if(e.button && e.button !== 0) return;
    dragging = true; moved = 0; vel = 0;
    lastX = e.clientX; lastT = performance.now();
    pid = e.pointerId;
    try{ rowsEl.setPointerCapture(pid); }catch(err){}
    rowsEl.classList.add('dragging');
  });

  rowsEl.addEventListener('pointermove', function(e){
    if(!dragging) return;
    var now = performance.now();
    var dx = e.clientX - lastX;
    var dt = (now - lastT) / 1000;
    moved += Math.abs(dx);
    for(var i=0;i<rows.length;i++) rows[i].offset -= dx;
    if(dt > 0) vel = vel * 0.7 + (dx / dt) * 0.3;
    lastX = e.clientX; lastT = now;
  });

  function endDrag(){
    if(!dragging) return;
    dragging = false;
    rowsEl.classList.remove('dragging');
    if(moved <= 8) return;                       // fue un toque, no un arrastre
    var spin = Math.max(-CFG.maxSpin, Math.min(CFG.maxSpin, -vel));
    for(var i=0;i<rows.length;i++) rows[i].speed = spin + rows[i].base * 0.15;
  }
  rowsEl.addEventListener('pointerup', endDrag);
  rowsEl.addEventListener('pointercancel', endDrag);
  rowsEl.addEventListener('lostpointercapture', endDrag);

  /* ---- popup ---- */
  rowsEl.addEventListener('click', function(e){
    if(moved > 8) return;
    var item = e.target.closest ? e.target.closest('.item') : null;
    if(item) open(item.dataset.src);
  });

  function open(src){
    lbFigure.innerHTML = '';
    if(isVideo(src)){
      var v = document.createElement('video');
      v.src = src; v.controls = true; v.autoplay = true; v.loop = true;
      v.muted = true; v.playsInline = true; v.setAttribute('playsinline','');
      lbFigure.appendChild(v);
    }else{
      var img = document.createElement('img');
      img.src = src; img.alt = '';
      lbFigure.appendChild(img);
    }
    lightbox.classList.add('open');
    closeBtn.focus();
  }
  function close(){
    lightbox.classList.remove('open');
    lbFigure.innerHTML = '';
  }
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });

  /* ---- datos ---- */
  var t;
  window.addEventListener('resize', function(){
    clearTimeout(t);
    t = setTimeout(layout, 150);
  });

  function start(list){
    items = (list && list.length) ? list.map(function(x){ return typeof x === 'string' ? x : x.src; }) : CFG.fallback;
    if(!items.length){
      if(CFG.empty) rowsEl.innerHTML = '<p style="width:100%;text-align:center;font-size:calc(4 * var(--u))">' + CFG.empty + '</p>';
      return;
    }
    build();
  }

  fetch('data.json', {cache:'no-store'})
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(d){ start(d && d[CFG.key]); })
    .catch(function(){ start(null); });
}
