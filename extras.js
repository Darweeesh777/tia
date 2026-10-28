// Set to the supplied recording path, e.g. 'assets/rofa-message.m4a'.
window.rofaVoiceSrc = '';

window.MissionExtras = (() => {
  let cleanupScreen = () => {};
  let reviewTimer;
  let complaint = 0;
  const replies = ['تم تسجيل الشكوى. المسؤول عن الشكاوى: روفا. تم حفظ الشكوى 😂', 'بعد مراجعة الملف… رخم فعلًا، بس بيحبك 🖤', 'قسم الشكاوى في إجازة. قسم الدلع شغّال ٢٤ ساعة 🫡', 'شكوى جديدة؟ طب ما تدي الراجل فرصة يا توتا 😂'];
  function emergency() {
    if (document.querySelector('#emergency')) return;
    const trigger = document.createElement('button');
    trigger.id = 'emergency'; trigger.className = 'emergency'; trigger.textContent = 'روفا رخم؟ 🚨';
    const dialog = document.createElement('dialog');
    dialog.className = 'complaint-dialog'; dialog.setAttribute('aria-labelledby', 'complaint-heading');
    dialog.innerHTML = '<h2 id="complaint-heading">مكتب شكاوى توتا</h2><p id="complaint-reply"></p><form method="dialog"><button class="primary">ماشي يا روفا 😂</button></form>';
    document.body.append(trigger, dialog);
    trigger.addEventListener('click', () => { dialog.querySelector('p').textContent = replies[complaint++ % replies.length]; dialog.showModal(); });
  }
  function fingerprint(next) {
    const button = document.querySelector('#fingerprint');
    if (!button) return () => {};
    let holdTimer, nextTimer, active = false, done = false;
    const status = document.querySelector('#scan-status');
    function cancel() { clearTimeout(holdTimer); active = false; if (!done) { button.classList.remove('scanning'); status.textContent = 'كمّلي ضغط ثانيتين يا توتا 🦉'; } }
    function start() {
      if (active || done) return;
      active = true; button.classList.add('scanning'); status.textContent = 'جاري التحقق من بصمة توتا…';
      holdTimer = setTimeout(() => { done = true; button.classList.remove('scanning'); button.classList.add('scan-done'); status.textContent = 'تم التعرف على توتا. باقي البشر ممنوعين من الدخول 🦉'; nextTimer = setTimeout(next, 1100); }, 2000);
    }
    button.addEventListener('pointerdown', event => { if (event.button !== 0) return; event.preventDefault(); button.focus(); button.setPointerCapture(event.pointerId); start(); });
    button.addEventListener('pointerup', cancel); button.addEventListener('pointercancel', cancel);
    button.addEventListener('pointermove', event => { if (!active || done) return; const r = button.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) cancel(); });
    button.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); start(); } });
    button.addEventListener('keyup', event => { if (event.key === 'Enter' || event.key === ' ') cancel(); });
    button.addEventListener('blur', cancel);
    const visibility = () => { if (document.hidden) cancel(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { clearTimeout(holdTimer); clearTimeout(nextTimer); document.removeEventListener('visibilitychange', visibility); };
  }
  function review(attempts) {
    clearTimeout(reviewTimer);
    document.querySelector('#excuse-review').hidden = false;
    const status = document.querySelector('#review-status');
    status.textContent = 'جاري دراسة الاعتذار…';
    reviewTimer = setTimeout(() => { if (status.isConnected) status.textContent = attempts >= 4 ? 'يا توتا الوقت ده كان زماننا اخترنا المطعم 😂' : 'تم رفضه بالإجماع. اللجنة مش مقتنعة 😂'; }, 650);
  }
  async function saveTicket(day) {
    const status = document.querySelector('#save-status');
    try {
      await document.fonts.ready;
      const portrait = new Image();
      portrait.src = 'assets/memory-smile.jpg';
      await portrait.decode();
      const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1600;
      const c = canvas.getContext('2d');
      c.drawImage(portrait, 0, 0, 1200, 1600);
      const shade = c.createLinearGradient(0, 0, 0, 1600);
      shade.addColorStop(0, '#000b'); shade.addColorStop(.18, '#0000'); shade.addColorStop(.48, '#0000'); shade.addColorStop(.64, '#000b'); shade.addColorStop(1, '#000f');
      c.fillStyle = shade; c.fillRect(0, 0, 1200, 1600);
      c.strokeStyle = '#dfa4b0'; c.lineWidth = 3; c.strokeRect(40, 40, 1120, 1520);
      c.textAlign = 'center'; c.direction = 'rtl';
      const text = (value, y, size, color = '#fff5ec', font = 'Tajawal') => { c.fillStyle = color; c.font = `700 ${size}px "${font}", Tahoma, sans-serif`; c.fillText(value, 600, y, 1040); };
      text('تصريح خروجة رسمي', 130, 64);
      text('Rofa × Tote', 980, 75, '#f0b6c2');
      text('تم حجز المدني… قبل ما يستلمه الميري!', 1080, 46);
      text(day === 'friday' ? 'الجمعة ٣٠ أكتوبر ٢٠٢٦' : 'السبت ٣١ أكتوبر ٢٠٢٦', 1180, 48);
      text('المكان سري… والأكل مش تدريب عسكري', 1280, 39);
      text('مسموح سرقة البطاطس. ممنوع إلغاء الدلع.', 1370, 37);
      text('إمضاء: روفا — مقفّل اللابتوب مخصوص', 1490, 33, '#f0b6c2');
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image creation failed');
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = `Rofa-Tote-${day === 'friday' ? '30' : '31'}-October.png`; document.body.append(link); link.click(); link.remove();
      status.textContent = 'التذكرة جاهزة 🖤 لو الموبايل فتح الصورة، اضغطي عليها مطولًا واحفظيها.';
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch { status.textContent = 'الصورة متحفظتش. جرّبي تاني يا توتا.'; }
  }
  function mount(state, next) {
    emergency(); cleanupScreen = fingerprint(next);
    document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
      const dialog = document.createElement('dialog');
      dialog.className = 'photo-dialog'; dialog.setAttribute('aria-label', 'الصورة بالحجم الكامل');
      const close = document.createElement('button'); close.className = 'secondary'; close.textContent = 'اقفلي الصورة ×';
      const image = document.createElement('img'); image.src = button.dataset.photo; image.alt = button.querySelector('img').alt;
      dialog.append(close, image); document.body.append(dialog);
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => { dialog.remove(); button.focus(); }, { once: true });
      dialog.showModal();
    }));
    document.querySelector('#save-ticket')?.addEventListener('click', () => saveTicket(state.day));
    const box = document.querySelector('#voice-message');
    if (box && window.rofaVoiceSrc) {
      box.hidden = false;
      const audio = document.querySelector('#rofa-audio'); audio.src = window.rofaVoiceSrc;
      const toggle = document.querySelector('#voice-toggle');
      toggle.addEventListener('click', () => { const player = document.querySelector('#voice-player'); player.hidden = !player.hidden; toggle.setAttribute('aria-expanded', String(!player.hidden)); if (player.hidden) audio.pause(); });
      audio.addEventListener('error', () => { document.querySelector('#audio-status').textContent = 'التسجيل مش متاح دلوقتي. جرّبي تفتحيه كمان شوية.'; });
    }
  }
  return { mount, review, cleanup() { cleanupScreen(); clearTimeout(reviewTimer); document.querySelector('#rofa-audio')?.pause(); } };
})();

