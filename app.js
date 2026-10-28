const app = document.querySelector('#app');
const state = { page: 0, day: '', attempts: 0 };
const days = { friday: 'الجمعة ٣٠ أكتوبر ٢٠٢٦', saturday: 'السبت ٣١ أكتوبر ٢٠٢٦' };
const jokes = ['هنهزر؟ ولا فاضية؟ 🤨', 'مش فاضية لمين يا توتا؟ 😂', 'ده أنا قافل اللابتوب يا توتا!', 'راجعي جدولك كده تاني 😂', 'زرار أوافق ثابت أهو… 👀', 'محاولة هروب فاشلة يا توتا 🫡', 'ده منظر واحد تترفض عزمته؟ 😂'];
const back = () => state.page > 0 ? '<button class="back" data-back>رجوع للملف السابق ↗</button>' : '';
const button = (label, action = 'next', style = 'primary') => `<button class="${style}" data-${action}>${label}<span aria-hidden="true">←</span></button>`;
function setPage(page) {
  state.page = Math.max(0, Math.min(5, page));
  history.pushState({ page: state.page }, '', `#${state.page + 1}`);
  render();
}
function render() {
  window.MissionExtras.cleanup();
  document.body.classList.toggle('revealed', state.page >= 3);
  document.querySelector('#footer-note').textContent = state.page >= 3 ? 'من روفا… لتوتا، بكل الحب ♡' : 'للمستلمة فقط. يُفتح بعيدًا عن العيون الفضولية.';
  document.querySelector('#progress').innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${i <= state.page ? 'done' : ''}" ${i === state.page ? 'aria-current="step"' : ''}></i>`).join('');
  const screens = [intro, identity, dossier, invitation, schedule, finale];
  app.innerHTML = `<section class="screen screen-${state.page}" aria-labelledby="page-title">${back()}${screens[state.page]()}</section>`;
  app.querySelectorAll('[data-next]').forEach(el => el.addEventListener('click', () => setPage(state.page + 1)));
  app.querySelector('[data-back]')?.addEventListener('click', () => setPage(state.page - 1));
  app.querySelector('#page-title').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
  bindScreen();
  window.MissionExtras.mount(state, () => setPage(1));
}
function intro() { return `
  <div class="eyebrow">مراسلة غير عادية</div>
  <h1 id="page-title" tabindex="-1">لا يُفتح إلا بواسطة المستلمة<br><em dir="ltr">(Tote)</em></h1>
  <p class="lead">فيه ملف يخصك.<br>ومحتاجين نتأكد إن محدش واقف جنبك.</p>
  <div class="folder" aria-hidden="true"><div class="folder-tab"></div><div class="folder-top"><span>مكتب المهمات الخاصة</span><span dir="ltr">031 / PRIVATE</span></div><div class="stamp">سري للغاية</div><div class="redacted"><i></i><i></i><i></i></div><div class="folder-bottom">لا يُفتح إلا بواسطة المستلمة (Tote) <span>↙</span></div></div>
  <p class="quiet">الموضوع محتاج تركيز… لمدة دقيقتين بالكتير.</p>
  <button class="fingerprint" id="fingerprint" aria-label="اضغطي مطولًا لمدة ثانيتين لفتح الملف"><svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 28a20 20 0 0 1 40 0M7 24a26 26 0 0 1 50 0M18 31v7c0 8-3 13-6 17M46 31v6c0 8 1 13 5 18M25 32v7c0 9-3 16-7 21M39 32v8c0 8 2 15 5 20M18 29a14 14 0 0 1 28 0M25 29a7 7 0 0 1 14 0M32 30v12c0 8-2 14-5 19M33 54l2 7"/></g></svg><span>اضغطي هنا ثانيتين</span><i class="scan-progress"></i></button><p id="scan-status" class="quiet" aria-live="polite">بصمة توتا مطلوبة لفتح الملف.</p>`; }
function identity() { return `
  <div class="eyebrow">الخطوة الأولى / التحقق من الهوية</div><div class="large-symbol" aria-hidden="true">⌕</div>
  <h1 id="page-title" tabindex="-1">نتأكد بس…</h1>
  <p class="lead">هل إنتِ الشخص اللي صاحب الملف بيبتسم<br>أول ما اسمه يظهر على الموبايل؟</p>
  <div class="stack">${button('أيوه أنا طبعًا 💅')}${button('هو فيه غيري؟ 👀', 'jealous', 'secondary')}</div>
  <div class="notice" id="identity-note" aria-live="polite"></div>`; }
function dossier() { return `
  <div class="eyebrow">تم التحقق / تصريح بالاطلاع</div><h1 id="page-title" tabindex="-1">في حاجة لازم تعرفيها.</h1>
  <div class="dossier paper"><span class="paper-clip" aria-hidden="true"></span><div class="dossier-heading"><span>بيانات صاحب الطلب</span><span dir="ltr">CONFIDENTIAL</span></div>
  <dl><div><dt>صاحب الطلب</dt><dd>شخص إنتِ عارفاه كويس.</dd></div><div><dt>الحالة الحالية</dt><dd>مدني… لفترة محدودة.</dd></div><div><dt>المطلوب</dt><dd>مهمة لازم تخلص قبل الميري.</dd></div><div><dt>الشخص المطلوب حضوره</dt><dd>إنتِ. بالاسم.</dd></div></dl><div class="small-stamp">للعلم والتنفيذ</div></div>
  ${button('افتحي المهمة بقى!')}`; }
function invitation() { return `
  <div class="eyebrow pink">مهمة ذات أولوية قصوى ♡</div><h1 id="page-title" tabindex="-1">آخر مهمة<br><em>قبل الميري.</em></h1>
  <p class="lead">كل التحقيق ده عشانك يا توتا 🦉<br><strong>إنتِ مطلوبه ب الاسم مع المدعو روفا</strong></p>
  <div class="hero-art sunset-art"><img src="assets/birthday-sunset.png" alt="تصور رومانسي لروفا وتوتا أمام الغروب بجانب تورتة عيد الميلاد"><span class="art-stamp">معتمد من القلب ♡</span></div>
  <p class="invite-note">قبل ما أدخل، عايز نخرج ونضحك<br>ونعمل ذكرى حلوة لينا. ونتبسط شويه بقي</p>
  ${button('أوافق يا عسكري قلبي ♡')}
  <div class="escape-arena"><button id="escape" class="secondary">لا، مش فاضية 🙄</button></div>
  <div class="reaction" aria-live="polite"><img id="reaction-photo" hidden alt=""><p id="joke">قرارك في إيدك… تقريبًا 👀</p><div id="excuse-review" hidden><small>مستوى اقتناع روفا بالاعتذار: ٠٪</small><div class="conviction-meter" aria-hidden="true"><i></i></div><p id="review-status"></p></div></div>`; }
function schedule() { return `
  <div class="eyebrow pink">تمت الموافقة بنجاح ♡</div><h1 id="page-title" tabindex="-1">اختاري يوم الدلع.</h1><p class="lead">كنت عارف إن التفاهم بينا سهل جدًا 😌</p>
  <figure class="approval-photo"><img src="assets/approval-party.jpg" alt="توتا بالنظارة الحمرا وروفا وراها، الاتنين بيشاوروا بالموافقة" width="900" height="1600"><figcaption>الموافقة موثّقة بالصوت والصورة… تقريبًا 😂👍</figcaption></figure>
  <div class="paper plan"><span class="paper-clip" aria-hidden="true"></span><h2>تحديد موعد العملية</h2><div class="day-options" role="group" aria-label="اختاري يوم الخروجة"><button class="day ${state.day === 'friday' ? 'selected' : ''}" data-day="friday" aria-pressed="${state.day === 'friday'}"><span>الجمعة</span><b>٣٠</b><small>أكتوبر</small></button><button class="day ${state.day === 'saturday' ? 'selected' : ''}" data-day="saturday" aria-pressed="${state.day === 'saturday'}"><span>السبت</span><b>٣١</b><small>أكتوبر · عيد ميلادك ♡</small></button></div><div class="secret-place"><span>موقع العملية</span><strong>سري للغاية 🤫</strong><small>التفاصيل مع روفا. سيبيها عليه.</small></div></div>
  <button class="primary" id="confirm" ${state.day ? '' : 'disabled'}>اعتمدي الخطة 🫡 <span>←</span></button><p class="quiet" id="day-hint">${state.day ? 'اختيار ممتاز يا سيادة الحبيبة.' : 'اختاري اليوم اللي يناسبك الأول.'}</p>`; }
function finale() { return `
  <div class="eyebrow pink">تم اعتماد العملية بنجاح</div><h1 id="page-title" tabindex="-1">كل سنة وإنتِ<br><em>أحلى توتا.</em></h1>
  <div class="ticket"><div><small>دعوة خاصة جدًا</small><h2>روفا <span>♡</span> توتا</h2><p>${days[state.day] || ''}</p></div><div class="ticket-seal">معتمد<br>من القلب</div></div>
  <button class="secondary save-ticket" id="save-ticket">احفظي دليل الإدانة 🎟️</button><p id="save-status" class="quiet" aria-live="polite"></p><div id="voice-message" hidden><button class="secondary" id="voice-toggle" aria-expanded="false">رسالة من صاحب المهمة 🎙️</button><div id="voice-player" hidden><p>كلمتين من روفا… ليكي إنتِ وبس ♡</p><audio id="rofa-audio" controls preload="none"></audio><p id="audio-status" class="quiet" aria-live="polite"></p></div></div>
  <div class="love-letter"><p>يا توتا، يا أحلى بومة في حياتي ❤️</p><p>قبل ما أدخل الجيش، نفسي نقضي يوم حلو سوا، نضحك فيه ونصور صور أفضل أرجعلها وأبتسم كل ما توحشيني.</p><p>عيد ميلادك بالنسبة لي فرصة أقولك قد إيه أنا مبسوط إنك في حياتي، وإن وسط كل اللي بيتغير حواليا، وجودك بيطمني.</p><p>كل سنة وإنتِ حبيبتي وصاحبتي وأحلى صدفة في حياتي.</p><p>وعُهدة قلبي معاكي لحد ما أرجع… وبعد ما أرجع برضه، متفتكريش إني هاخدها 😂❤️</p><div class="signature">روفا ♡</div></div>
  <figure class="closing-photo"><img src="assets/couple-mission.png" alt="تصور لروفا بالميري وتوتا وسط زينة عيد الميلاد والشموع" loading="lazy"><figcaption>الميري هيغيّر اللبس… إنما أنا روفا بتاعك ♡</figcaption></figure>
  <a class="primary whatsapp" id="whatsapp" target="_blank" rel="noopener noreferrer">بلّغي روفا بالموافقة 💌 <span>←</span></a><p class="quiet">هتفتح رسالة جاهزة على واتساب. اضغطي إرسال عشان توصله.</p><button class="back" data-edit>تعديل يوم الخروجة</button>
  <details class="memories"><summary>الأدلة اللي ضدنا 📸 <span>افتحي ملف الذكريات</span></summary><p class="quiet">٤ أدلة تثبت إن أحلى وقت هو اللي معاكي.</p><div class="memory-grid">
  ${memoryCard('memory-car.jpg', 'روفا وتوتا بيهزروا في سيلفي جوه العربية', 'دليل ١: مفيش خروجة عاقلة معانا 😂')}
  ${memoryCard('memory-smile.jpg', 'روفا وتوتا مبتسمين جنب بعض', 'دليل ٢: الضحكة دي بتطلع معاكي إنتِ ♡')}
  ${memoryCard('memory-cafe.jpg', 'سيلفي لروفا وتوتا في قعدة بإضاءة دافية', 'دليل ٣: القعدة بتحلو باللي قاعد معاكي.')}
  ${memoryCard('memory-together.jpg', 'روفا وتوتا في سيلفي من تحت والسما وراهم', 'دليل ٤: حتى من الزاوية دي… قمر برضه 😂')}
  </div><p class="memory-ending">ولسه عندنا صور وذكريات كتير نعملها سوا 🖤</p></details>`; }
function memoryCard(file, alt, caption) {
  return `<figure class="memory-card"><button class="photo-open" data-photo="assets/${file}" aria-label="تكبير الصورة: ${alt}"><img src="assets/${file}" alt="${alt}" loading="lazy"></button><figcaption>${caption}</figcaption></figure>`;
}
function bindScreen() {
  app.querySelector('[data-jealous]')?.addEventListener('click', () => {
    document.querySelector('#identity-note').innerHTML = '<p>لا يا فندم، ده سؤال روتيني.<br>متكبريش الموضوع 😂</p><button class="primary" id="continue">كمّلي التحقيق ←</button>';
    document.querySelector('#continue').addEventListener('click', () => setPage(2));
  });
  const escape = app.querySelector('#escape');
  if (escape) {
    let lastMove = 0;
    const run = event => {
      event.preventDefault();
      if (Date.now() - lastMove < 160) return;
      lastMove = Date.now();
      const arena = escape.parentElement;
      const maxX = Math.max(0, arena.clientWidth - escape.offsetWidth);
      const maxY = Math.max(0, arena.clientHeight - escape.offsetHeight);
      const alternate = state.attempts % 2 === 0;
      escape.style.left = `${alternate ? 0 : maxX}px`;
      escape.style.top = `${alternate ? maxY : 0}px`;
      escape.style.transform = 'none';
      const photos = window.missionPhotos || [];
      const photo = photos.length ? photos[state.attempts % photos.length] : null;
      document.querySelector('#joke').textContent = photo?.caption || jokes[state.attempts % jokes.length];
      const image = document.querySelector('#reaction-photo');
      if (photo) { image.hidden = false; image.alt = photo.alt || 'رد فعل روفا'; image.onerror = () => { image.hidden = true; }; image.src = photo.src; }
      state.attempts++;
      window.MissionExtras.review(state.attempts);
    };
    escape.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') run(event); });
    escape.addEventListener('pointerdown', run);
    escape.addEventListener('click', run);
    escape.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') run(event); });
  }
  app.querySelectorAll('[data-day]').forEach(el => el.addEventListener('click', () => {
    state.day = el.dataset.day;
    app.querySelectorAll('[data-day]').forEach(day => { day.classList.toggle('selected', day === el); day.setAttribute('aria-pressed', String(day === el)); });
    document.querySelector('#confirm').disabled = false;
    document.querySelector('#day-hint').textContent = 'اختيار ممتاز يا سيادة الحبيبة.';
  }));
  app.querySelector('#confirm')?.addEventListener('click', () => { if (state.day) setPage(5); });
  app.querySelector('[data-edit]')?.addEventListener('click', () => setPage(4));
  const whatsapp = app.querySelector('#whatsapp');
  if (whatsapp) whatsapp.href = `https://wa.me/201557071568?text=${encodeURIComponent(`يا روفا، توتا وافقت على المهمة 🫡❤️\nمعادنا ${days[state.day]}.\nمستنية الديت والمكان السري يا عسكري قلبي 🦉🎂`)}`;
}
window.addEventListener('popstate', event => { state.page = event.state?.page ?? 0; if (state.page === 5 && !state.day) state.page = 4; render(); });
window.addEventListener('resize', () => {
  const escape = document.querySelector('#escape');
  if (!escape || !escape.style.left) return;
  escape.style.left = `${Math.min(parseFloat(escape.style.left) || 0, Math.max(0, escape.parentElement.clientWidth - escape.offsetWidth))}px`;
});
history.replaceState({ page: 0 }, '', '#1');
render();




