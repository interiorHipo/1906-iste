(() => {
  'use strict';
  const data = window.SSANGYONG_DATA;
  const $ = id => document.getElementById(id);
  const form = $('contactForm');
  const viewer = $('viewer');
  let selected = data.types[0], page = 0, imageLoaded = false, submitting = false;
  let imageVersion = 0;
  const event = (name, typeId, extra = {}) => {
    try { window.gtag('event', name, {apartment_id:data.apartmentId, ...(typeId ? {type_id:typeId} : {}), ...extra}); } catch (_) { /* Analytics must never block the page. */ }
  };
  function initAnalytics() {
    if (window.__ssangyongAnalytics) return;
    window.__ssangyongAnalytics = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const query = new URLSearchParams(location.search);
    const qr = query.get('utm_source') === 'flyer' && query.get('utm_medium') === 'qr' && query.get('utm_campaign') === 'ssangyong_sky';
    // Never forward arbitrary query strings, hashes, form fields, or full referrer URLs.
    const canonical = 'https://interiorhipo.github.io/1906-iste/ssangyong-sky/';
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch (_) {}
    window.gtag('js', new Date());
    window.gtag('config', data.measurementId, {
      send_page_view:false, apartment_id:data.apartmentId,
      page_location:canonical + (qr ? '?utm_source=flyer&utm_medium=qr&utm_campaign=ssangyong_sky' : ''),
      page_referrer:referrer, page_title:document.title,
      allow_google_signals:false, allow_ad_personalization_signals:false
    });
    event('page_view');
    if (qr) event('ssangyong_sky_qr_landing', null, {campaign_id:'ssangyong_sky',campaign_channel:'printed_flyer'});
    // Local previews/tests must not pollute the live property.
    if (location.hostname === 'interiorhipo.github.io') {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(data.measurementId);
      document.head.appendChild(script);
    }
  }
  function setImage(img, item, sizes) {
    img.width = item.width || 1200; img.height = item.height || 900;
    img.alt = item.alt || `${selected.label} 3D 제안 시안`;
    img.sizes = sizes;
    if (item.srcset) img.srcset = item.srcset; else img.removeAttribute('srcset');
    img.src = item.src;
  }
  function prepareTransition(img, direction) {
    const surface = img.parentElement;
    if (img.complete && img.naturalWidth && !img.hidden) {
      surface.querySelectorAll('.image-outgoing').forEach(el => el.remove());
      const previous = img.cloneNode(false);
      previous.removeAttribute('id'); previous.removeAttribute('style');
      previous.className = 'image-outgoing'; previous.alt = '';
      previous.setAttribute('aria-hidden','true');
      surface.appendChild(previous);
    }
    img.style.opacity = '0';
    return () => {
      img.style.opacity = '';
      const outgoing = [...surface.querySelectorAll('.image-outgoing')];
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || !img.animate) {
        outgoing.forEach(el => el.remove()); return;
      }
      const options = {duration:460,easing:'cubic-bezier(.22,1,.36,1)'};
      img.animate([{transform:`translateX(${direction * 24}px) scale(1.015)`},{transform:'translateX(0) scale(1)'}],options);
      outgoing.forEach(el => {
        const animation = el.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${-direction * 16}px)`}],options);
        animation.onfinish = () => el.remove();
      });
    };
  }
  function renderViewer(direction = 0) {
    if (!viewer.open) return;
    const item = selected.images[page];
    $('viewerTitle').textContent = `${selected.label} · 3D 제안 시안`;
    $('viewerCounter').textContent = `${page + 1} / ${selected.images.length}`;
    $('viewerError').hidden = true;
    const reveal = prepareTransition($('viewerImage'), direction);
    $('viewerImage').hidden = false;
    $('viewerImage').onload = reveal;
    $('viewerImage').onerror = () => { reveal(); $('viewerError').hidden = false; $('viewerImage').hidden = true; };
    setImage($('viewerImage'), item, '94vw');
    $('viewerPrev').disabled = $('viewerNext').disabled = selected.images.length < 2;
  }
  function renderImage(direction = 0) {
    const version = ++imageVersion;
    const item = selected.images[page];
    imageLoaded = false;
    $('openViewer').disabled = true;
    $('imageError').hidden = true;
    $('imagePlaceholder').hidden = !!item;
    $('designImage').hidden = !item;
    $('prevImage').disabled = $('nextImage').disabled = selected.images.length < 2;
    $('imageCounter').textContent = item ? `${page + 1} / ${selected.images.length}` : '준비 중';
    $('designStatus').textContent = item ? '3D 제안 시안' : '시안 준비 중';
    // Replace the node so a slow previous type cannot overwrite the current load/error state.
    const old = $('designImage'), img = old.cloneNode(false);
    prepareTransition(old, direction);
    img.removeAttribute('src'); img.removeAttribute('srcset'); img.style.opacity = '0';
    old.replaceWith(img);
    const reveal = () => {
      img.style.opacity = '';
      const outgoing = [...img.parentElement.querySelectorAll('.image-outgoing')];
      if (!item || matchMedia('(prefers-reduced-motion: reduce)').matches || !img.animate) { outgoing.forEach(el=>el.remove()); return; }
      const options = {duration:460,easing:'cubic-bezier(.22,1,.36,1)'};
      img.animate([{opacity:.65,transform:`translateX(${direction * 24}px) scale(1.015)`},{opacity:1,transform:'translateX(0) scale(1)'}],options);
      outgoing.forEach(el=>{const animation=el.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${-direction * 16}px)`}],options);animation.onfinish=()=>el.remove();});
    };
    if (!item) { reveal(); return; }
    img.onload = () => { if (version !== imageVersion) return; reveal(); imageLoaded = true; $('openViewer').disabled = false; $('imageError').hidden = true; };
    img.onerror = () => { if (version !== imageVersion) return; img.parentElement.querySelectorAll('.image-outgoing').forEach(el=>el.remove()); imageLoaded = false; img.hidden = true; $('imageError').hidden = false; $('openViewer').disabled = true; };
    setImage(img, item, '(max-width:800px) calc(100vw - 48px), 700px');
    renderViewer(direction);
  }
  function selectType(id, userInitiated) {
    const next = data.types.find(t => t.id === id);
    if (!next) return;
    selected = next; page = 0;
    document.querySelectorAll('[role=tab]').forEach(tab => {
      const active = tab.dataset.type === id;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
    });
    $('typePanel').setAttribute('aria-labelledby', 'tab-' + id);
    $('typeTitle').textContent = selected.label;
    const descriptionParts = selected.description.split(/(?<=시안입니다\.)\s+/);
    $('typeDescription').replaceChildren(...descriptionParts.map((text, index) => {
      const sentence = document.createElement('span');
      sentence.className = 'description-sentence';
      sentence.textContent = (index ? ' ' : '') + text;
      return sentence;
    }));
    $('estimateType').textContent = selected.label;
    for (const [suffix, key] of [['Price','price'],['Vat','vat']]) {
      $('estimate' + suffix).textContent = selected.estimate[key] || '상담 후 안내';
    }
    $('formType').value = id;
    renderImage();
    if (userInitiated) event('select_apartment_type', id);
  }
  function moveImage(delta) {
    if (!selected.images.length) return;
    page = (page + delta + selected.images.length) % selected.images.length;
    renderImage(delta);
  }
  function enableSwipe(surface) {
    let start = null;
    surface.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      start = e.touches.length === 1 && selected.images.length > 1 &&
        !e.target.closest('button,a')
        ? {x:touch.clientX,y:touch.clientY,id:touch.identifier,type:selected.id} : null;
    }, {passive:true});
    surface.addEventListener('touchmove', e => {
      if (!start) return;
      if (e.touches.length !== 1) { start = null; return; }
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - start.x), dy = Math.abs(touch.clientY - start.y);
      // A vertical gesture belongs to page scrolling, even if it later turns sideways.
      if (dy > 12 && dy > dx) start = null;
    }, {passive:true});
    surface.addEventListener('touchend', e => {
      const origin = start; start = null;
      if (!origin || e.touches.length || origin.type !== selected.id) return;
      const touch = [...e.changedTouches].find(t => t.identifier === origin.id);
      if (!touch) return;
      const dx = touch.clientX - origin.x, dy = touch.clientY - origin.y;
      if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5) moveImage(dx < 0 ? 1 : -1);
    }, {passive:true});
    surface.addEventListener('touchcancel', () => { start = null; }, {passive:true});
  }
  enableSwipe(document.querySelector('.image-stage'));
  enableSwipe($('viewerImage'));
  data.types.forEach(type => {
    const tab = document.createElement('button');
    tab.type = 'button'; tab.role = 'tab'; tab.id = 'tab-' + type.id;
    tab.dataset.type = type.id; tab.textContent = type.label;
    tab.setAttribute('aria-controls','typePanel');
    tab.addEventListener('click', () => selectType(type.id, true));
    $('typeTabs').appendChild(tab);
    $('formType').add(new Option(type.label, type.id));
  });
  $('typeTabs').addEventListener('keydown', e => {
    const tabs = [...$('typeTabs').children];
    const index = tabs.indexOf(document.activeElement);
    if (index < 0 || !['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const target = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length-1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[target].focus(); selectType(tabs[target].dataset.type, true);
  });
  $('formType').addEventListener('change', () => selectType($('formType').value, true));
  $('prevImage').onclick = $('viewerPrev').onclick = () => moveImage(-1);
  $('nextImage').onclick = $('viewerNext').onclick = () => moveImage(1);
  $('retryImage').onclick = () => renderImage();
  $('openViewer').onclick = () => {
    if (!imageLoaded) return;
    viewer.showModal(); document.body.style.overflow = 'hidden'; renderViewer();
    event('view_design_image', selected.id, {image_index:page+1});
  };
  const includedDialog = $('includedDialog');
  $('openIncluded').onclick = () => {
    $('includedType').textContent = selected.label;
    $('includedTotal').textContent = selected.estimate.price;
    $('includedVat').textContent = selected.estimate.vat || '상담 후 안내';
    includedDialog.showModal(); document.body.style.overflow = 'hidden';
  };
  $('closeIncluded').onclick = () => includedDialog.close();
  includedDialog.addEventListener('close', () => { document.body.style.overflow = ''; $('openIncluded').focus(); });
  $('closeViewer').onclick = () => viewer.close();
  viewer.addEventListener('click', e => { if (e.target === viewer) { const r = viewer.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) viewer.close(); } });
  viewer.addEventListener('close', () => { document.body.style.overflow = ''; $('openViewer').focus(); });
  viewer.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); moveImage(e.key === 'ArrowLeft' ? -1 : 1); } });
  document.querySelectorAll('a[href^="tel:"]').forEach(a => a.addEventListener('click', () => event('click_phone', selected.id)));
  if (data.hero) {
    $('heroImage').onload = () => { $('heroImage').hidden = false; $('heroPlaceholder').hidden = true; };
    $('heroImage').onerror = () => { $('heroImage').hidden = true; $('heroPlaceholder').hidden = false; };
    setImage($('heroImage'), data.hero, '100vw');
  }
  if (data.logo) document.querySelectorAll('.brand').forEach(brand => {
    const img = document.createElement('img'); setImage(img, {...data.logo,alt:'1906 INTERIOR'}, '180px');
    img.onerror = () => { img.remove(); brand.textContent = '1906 INTERIOR'; };
    brand.replaceChildren(img);
  });
  const ready = () => !!(data.contact.accessKey && data.contact.recipientVerified && data.contact.privacyApproved && data.contact.retention.trim());

  if (data.contact.retention) $('retentionNotice').textContent = data.contact.retention;
  if (!ready()) { $('submitButton').textContent = '온라인 접수'; $('submitButton').setAttribute('aria-disabled','true'); }
  const fields = {name:form.elements.name,phone:form.elements.phone,type:form.elements.type,consent:form.elements.consent};
  function validate() {
    const phone = fields.phone.value.replace(/[\s-]/g,'');
    const issues = {
      name: fields.name.value.trim() ? '' : '이름을 입력해주세요.',
      phone: /^0(?:2\d{7,8}|[3-6][1-5]\d{7,8}|70\d{8}|1[016789]\d{7,8})$/.test(phone) ? '' : '연락 가능한 전화번호를 확인해주세요.',
      type: data.types.some(t => t.id === fields.type.value) ? '' : '타입을 선택해주세요.',
      consent: fields.consent.checked ? '' : '개인정보 수집·이용 동의가 필요합니다.'
    };
    Object.entries(issues).forEach(([key,msg]) => { $(key+'Error').textContent = msg; fields[key].setAttribute('aria-invalid',String(!!msg)); });
    const first = Object.keys(issues).find(key => issues[key]);
    if (first) fields[first].focus();
    return first ? null : phone;
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitting) return;
    const phone = validate();
    if (!phone) return;
    if (!ready()) { $('formStatus').textContent = '온라인 접수 설정을 준비 중입니다. 010-5135-4781로 전화해주세요. 입력한 내용은 전송되지 않았습니다.'; return; }
    if (form.elements.botcheck.checked) { $('formStatus').textContent = '접수할 수 없습니다. 전화로 문의해주세요.'; return; }
    const type = data.types.find(t => t.id === fields.type.value);
    const submittedAt = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()) + ' (한국 시간, Asia/Seoul)';
    const body = {access_key:data.contact.accessKey,subject:`[1906인테리어] 서면쌍용스윗닷홈 상담 신청 — ${type.label}`,from_name:'1906 INTERIOR',name:fields.name.value.trim(),phone,apartment:data.apartmentName,type:type.label,message:form.elements.message.value.trim(),submitted_at:submittedAt,consent:'개인정보 수집·이용 동의',botcheck:false};
    submitting = true;
    const controls = [...form.querySelectorAll('input,select,textarea,button')];
    controls.forEach(el => {el.disabled = true;});
    $('submitButton').textContent = '전송 중…'; $('formStatus').textContent = '상담 신청을 전송하고 있습니다.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(data.contact.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body),signal:controller.signal});
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('not accepted');
      $('formStatus').textContent = '상담 신청이 접수되었습니다. 전송 서비스의 접수 성공이며, 네이버 메일함 도착 여부는 별도 확인이 필요합니다.';
      event('generate_lead',type.id);
      form.reset(); $('formType').value = selected.id;
    } catch (error) {
      $('formStatus').textContent = error.name === 'AbortError' ? '응답을 확인하지 못했습니다. 접수되었을 수도 있으니 전화로 확인 후 다시 시도해주세요. 입력 내용은 유지됩니다.' : '전송에 실패했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 신청하거나 전화해주세요.';
    } finally {
      clearTimeout(timeout); submitting = false;
      controls.forEach(el => {el.disabled = false;});
      $('submitButton').textContent = '온라인 접수';
    }
  });
  // Decorative randomized count, not a real-time analytics measurement.
  let previousCount = 0;
  try { previousCount = Number(sessionStorage.getItem('ssangyongVisitorCount')); } catch (_) {}
  let visitorCount;
  if (Number.isInteger(previousCount) && previousCount >= 1 && previousCount <= 10) {
    visitorCount = 1 + Math.floor(Math.random() * 9);
    if (visitorCount >= previousCount) visitorCount++;
  } else visitorCount = 1 + Math.floor(Math.random() * 10);
  $('visitorCount').textContent = visitorCount;
  try { sessionStorage.setItem('ssangyongVisitorCount', String(visitorCount)); } catch (_) {}
  initAnalytics();
  selectType(data.types[0].id, false);
})();
