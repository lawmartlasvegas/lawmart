(() => {
  const cfg=window.LAWMART_CONFIG||{};
  const campaignKeys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid'];
  const params=Object.fromEntries(new URLSearchParams(location.search));
  let campaign={}; try{campaign=JSON.parse(sessionStorage.getItem('lawmartCampaign')||'{}')}catch{}
  campaignKeys.forEach(k=>{if(params[k])campaign[k]=params[k]}); try{sessionStorage.setItem('lawmartCampaign',JSON.stringify(campaign))}catch{}
  window.dataLayer=window.dataLayer||[]; window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  if(cfg.GA4_MEASUREMENT_ID&&!document.querySelector('script[data-lawmart-ga4]')){const ga=document.createElement('script');ga.async=true;ga.dataset.lawmartGa4='true';ga.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.GA4_MEASUREMENT_ID);document.head.appendChild(ga);gtag('js',new Date());gtag('config',cfg.GA4_MEASUREMENT_ID,{anonymize_ip:true});if(cfg.GOOGLE_ADS_ID&&/^AW-[0-9]+$/.test(cfg.GOOGLE_ADS_ID))gtag('config',cfg.GOOGLE_ADS_ID);if(cfg.GOOGLE_ADS_PHONE_SEND_TO&&cfg.GOOGLE_ADS_PHONE_CONVERSION_NUMBER)gtag('config',cfg.GOOGLE_ADS_PHONE_SEND_TO,{phone_conversion_number:String(cfg.GOOGLE_ADS_PHONE_CONVERSION_NUMBER)})}
  const track=(name,extra={})=>{if(typeof gtag==='function')gtag('event',name,{brand:'imigracao_brasileira',page_path:location.pathname,...campaign,...extra})};
  const menu=document.querySelector('.menu'),links=document.querySelector('.links');menu?.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
  const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12}):null;document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('visible'));document.getElementById('year')&&(document.getElementById('year').textContent=new Date().getFullYear());
  document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'',common={link_text:(a.textContent||'').trim().replace(/\s+/g,' ').slice(0,100),link_url:a.href||href};if(/wa\.me|whatsapp\.com/i.test(href))track('whatsapp_click',common);else if(href.startsWith('tel:'))track('phone_click',common);else if(href.startsWith('mailto:'))track('email_click',common)});
  const gLink=document.getElementById('google-review-link');if(gLink&&cfg.IMIGRACAO_GOOGLE_BUSINESS_URL)gLink.href=cfg.IMIGRACAO_GOOGLE_BUSINESS_URL;
  const form=document.getElementById('lead-form');
  const submitButton=form?.querySelector('button[type="submit"]');
  const originalSubmitText=submitButton?.textContent||'Enviar solicitação';
  const status=(()=>{if(!form)return null;let el=form.querySelector('.form-status');if(!el){el=document.createElement('p');el.className='small form-status';el.setAttribute('aria-live','polite');form.appendChild(el)}return el})();
  const setSubmitting=(active)=>{if(!submitButton)return;submitButton.disabled=active;submitButton.setAttribute('aria-busy',String(active));submitButton.textContent=active?'Enviando…':originalSubmitText};
  let started=false;form?.addEventListener('input',()=>{if(!started){started=true;track('form_start',{form_name:'imigracao_lead'})}},{once:true});
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();track('form_error',{error_type:'validation'});if(status)status.textContent='Preencha os campos obrigatórios.';return}
    setSubmitting(true);
    if(status)status.textContent='Enviando sua solicitação…';
    const data=new FormData(form);
    Object.entries(campaign).forEach(([k,v])=>data.set(k,v));
    data.set('page_url',location.href);data.set('page_path',location.pathname);data.set('page_title',document.title);data.set('brand','Imigração Brasileira');data.set('referrer',document.referrer||'direct');data.set('submitted_at',new Date().toISOString());
    const service=data.get('servico')||'nao_informado';
    track('lead_submit',{service_name:service,submission_method:(cfg.IMIGRACAO_FORM_ENDPOINT||cfg.FORM_ENDPOINT)?'endpoint':'email'});
    const endpoint=cfg.IMIGRACAO_FORM_ENDPOINT||cfg.FORM_ENDPOINT;
    if(endpoint){try{const r=await fetch(endpoint,{method:'POST',body:data,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('Falha');track('generate_lead',{service_name:service,method:'online_form'});if(cfg.GOOGLE_ADS_SEND_TO)gtag('event','conversion',{send_to:cfg.GOOGLE_ADS_SEND_TO});location.href='/thank-you/';return}catch(err){track('form_error',{error_type:'endpoint'});if(status)status.textContent='Não foi possível enviar automaticamente. Abriremos seu aplicativo de e-mail.'}}
    setSubmitting(false);
    const attribution=campaignKeys.filter(k=>campaign[k]).map(k=>`${k}: ${campaign[k]}`);const body=[`Nome: ${data.get('nome')}`,`Telefone: ${data.get('telefone')}`,`E-mail: ${data.get('email')}`,`Serviço: ${service}`,`Página: ${location.href}`,`Mensagem: ${data.get('mensagem')}`,...(attribution.length?['','Atribuição de marketing:',...attribution]:[])].join('\n');track('email_lead_intent',{service_name:service});location.href=`mailto:imigracao@lawmartlasvegas.com?subject=${encodeURIComponent('Contato — Imigração Brasileira')}&body=${encodeURIComponent(body)}`
  });
})();

// Imigracao Brasileira: Cal.com scheduling popups
(() => {
  if (!document.querySelector('[data-cal-link]')) return;
  (function (C, A, L) {
    const push = (a, ar) => a.q.push(ar);
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = d.createElement('script');
        script.src = A;
        script.async = true;
        script.onerror = () => { window.__calEmbedFailed = true; };
        d.head.appendChild(script);
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { push(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          push(cal.ns[namespace], ar);
          push(cal, ['initNamespace', namespace]);
        } else push(cal, ar);
        return;
      }
      push(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  Cal('init', 'free-phone-consultation', {origin:'https://cal.com'});
  Cal.ns['free-phone-consultation']('ui', {
    hideEventTypeDetails:false,
    layout:'month_view',
    styles:{branding:{brandColor:'#087f3d'}}
  });
  Cal.ns['free-phone-consultation']('preload', {calLink:'brenden-greystone-dhxm1y/free-phone-consultation'});

  Cal('init', 'in-person-consultation', {origin:'https://cal.com'});
  Cal.ns['in-person-consultation']('ui', {
    hideEventTypeDetails:false,
    layout:'month_view',
    styles:{branding:{brandColor:'#087f3d'}}
  });
  Cal.ns['in-person-consultation']('preload', {calLink:'brenden-greystone-dhxm1y/in-person-consultation'});

  document.addEventListener('click', (event) => {
    const el=event.target.closest('[data-cal-link]');
    if(!el)return;
    const fallback=el.dataset.calFallbackHref;
    if(window.__calEmbedFailed && fallback){location.href=fallback;return;}
    event.preventDefault();
  }, {capture:true});

  document.addEventListener('click', (e) => {
    const a=e.target.closest('[data-track^="cal_"]');
    if(!a) return;
    if(typeof gtag==='function') gtag('event', a.dataset.track, {
      brand:'imigracao_brasileira',
      page_path:location.pathname,
      link_url:a.href
    });
  });
})();

// Phase 3.5: completed Cal.com booking measurement for Imigracao Brasileira
(() => {
  const register = () => {
    if (typeof window.Cal !== 'function' || window.__imigracaoCalSuccessRegistered) return;
    const namespaces=[['free-phone-consultation','free_phone'],['in-person-consultation','in_person']];
    let registered=0;
    namespaces.forEach(([namespace,type])=>{
      const api=window.Cal.ns&&window.Cal.ns[namespace];
      if(typeof api!=='function')return;
      api('on',{action:'bookingSuccessfulV2',callback:(event)=>{
        const detail=event?.detail||{};const data=detail.data||{};
        const uid=typeof data.uid==='string'?data.uid.slice(0,120):'';
        const key=`imigracaoBooking:${type}:${uid||data.startTime||new Date().toISOString()}`;
        try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1')}catch{}
        if(typeof gtag==='function')gtag('event','appointment_booked',{brand:'imigracao_brasileira',page_path:location.pathname,appointment_type:type,conversion_source:'cal_embed',booking_status:typeof data.status==='string'?data.status:undefined,payment_required:typeof data.paymentRequired==='boolean'?data.paymentRequired:undefined,currency:type==='in_person'?'USD':undefined,value:type==='in_person'?50:undefined});
      }});registered+=1;
    });
    if(registered===namespaces.length)window.__imigracaoCalSuccessRegistered=true;
  };
  register();setTimeout(register,500);setTimeout(register,1800);setTimeout(register,3500);
})();
