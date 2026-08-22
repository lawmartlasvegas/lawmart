(() => {
  const config = window.LAWMART_CONFIG || {};
  const pagePath = location.pathname;
  const serviceMap = {
    '/divorce/': 'divorce',
    '/immigration/': 'immigration',
    '/wills-trusts/': 'estate_planning',
    '/record-sealing/': 'record_sealing'
  };
  const pageService = serviceMap[pagePath] || 'general';

  const campaignKeys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid'];
  const readCampaign = () => {
    const current = Object.fromEntries(new URLSearchParams(location.search));
    const saved = (() => { try { return JSON.parse(sessionStorage.getItem('lawmartCampaign') || '{}'); } catch { return {}; } })();
    const merged = {...saved};
    campaignKeys.forEach(key => { if (current[key]) merged[key] = current[key]; });
    if (Object.keys(merged).length) { try { sessionStorage.setItem('lawmartCampaign', JSON.stringify(merged)); } catch {} }
    return merged;
  };
  const campaign = readCampaign();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
  if (config.GA4_MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(config.GA4_MEASUREMENT_ID) && !document.querySelector('script[data-lawmart-ga4]')) {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.lawmartGa4 = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.GA4_MEASUREMENT_ID)}`;
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', config.GA4_MEASUREMENT_ID, {anonymize_ip:true, send_page_view:true});
    if (config.GOOGLE_ADS_ID && /^AW-[0-9]+$/.test(config.GOOGLE_ADS_ID)) {
      gtag('config', config.GOOGLE_ADS_ID);
    }
    if (config.GOOGLE_ADS_PHONE_SEND_TO && config.GOOGLE_ADS_PHONE_CONVERSION_NUMBER) {
      gtag('config', config.GOOGLE_ADS_PHONE_SEND_TO, {
        phone_conversion_number: String(config.GOOGLE_ADS_PHONE_CONVERSION_NUMBER)
      });
    }
  }

  const track = (name, params={}) => {
    if (typeof window.gtag !== 'function') return;
    gtag('event', name, {
      page_service: pageService,
      page_path: pagePath,
      ...campaign,
      ...params
    });
  };
  window.lawmartTrack = track;

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.primary-nav a').forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false');
  }));
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const scrollMilestones = new Set();
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 18);
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    [50,90].forEach(percent => {
      if (ratio * 100 >= percent && !scrollMilestones.has(percent)) {
        scrollMilestones.add(percent); track('scroll_depth', {percent_scrolled:percent});
      }
    });
    document.querySelectorAll('[data-parallax]').forEach(el => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      el.style.transform = `translate3d(0, ${Math.min(window.scrollY * .07, 48)}px, 0)`;
    });
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), {threshold:.11}) : null;
  document.querySelectorAll('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    detail.parentElement?.querySelectorAll('details[open]').forEach(other => { if (other !== detail) other.open = false; });
  }));

  document.addEventListener('click', event => {
    const link = event.target.closest('a,button');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const common = {link_text:(link.textContent||'').trim().replace(/\s+/g,' ').slice(0,100), link_url:link.href||href};
    if (link.dataset.track) track(link.dataset.track, {...common, service_name:link.dataset.service||undefined});
    else if (href.startsWith('sms:')) track('sms_click', common);
    else if (href.startsWith('tel:')) track('phone_click', common);
    else if (href.startsWith('mailto:')) track('email_click', common);
    else if (/wa\.me|whatsapp\.com/i.test(href)) track('whatsapp_click', common);
    else if (/^https?:/i.test(href) && link.hostname && link.hostname !== location.hostname) track('outbound_click', common);
  });

  const smsDetails = (() => {
    if (
      pagePath.startsWith('/divorce/') ||
      pagePath === '/divorce-document-preparation/' ||
      pagePath === '/resources/divorce-document-checklist/'
    ) return {
      service: 'divorce',
      label: 'Text About $500 Divorce',
      message: "Hi, I'm interested in LawMart's $500 divorce service."
    };
    if (
      pagePath === '/wills-trusts/' ||
      pagePath === '/estate-planning/' ||
      pagePath === '/resources/estate-planning-information-checklist/' ||
      pagePath === '/resources/wills-trusts-information-checklist/'
    ) return {
      service: 'wills_and_trusts',
      label: 'Text About $500 Will & Trust',
      message: "Hi, I'm interested in LawMart's $500 will & trust package."
    };
    if (
      pagePath === '/record-sealing/' ||
      pagePath === '/resources/record-sealing-preparation/'
    ) return {
      service: 'record_sealing',
      label: 'Text About $500 Record Sealing',
      message: "Hi, I'm interested in LawMart's $500 record sealing service."
    };
    if (
      pagePath === '/immigration/' ||
      pagePath === '/immigration-document-preparation/'
    ) return {
      service: 'immigration',
      label: 'Text About Immigration',
      message: "Hi, I'm interested in LawMart's immigration document preparation services."
    };
    return {
      service: 'general',
      label: 'Text LawMart',
      message: "Hi, I'd like information about LawMart's flat-fee document preparation services."
    };
  })();

  if (!document.querySelector('.sms-float')) {
    const smsButton = document.createElement('a');
    const bodySeparator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
    smsButton.className = 'sms-float';
    smsButton.href = `sms:+17029001003${bodySeparator}body=${encodeURIComponent(smsDetails.message)}`;
    smsButton.textContent = smsDetails.label;
    smsButton.setAttribute('aria-label', `Text LawMart: ${smsDetails.message}`);
    smsButton.dataset.track = 'sms_click';
    smsButton.dataset.service = smsDetails.service;
    document.body.appendChild(smsButton);
  }

  document.querySelectorAll('[data-google-business]').forEach(link => {
    link.href = config.GOOGLE_BUSINESS_URL || 'https://www.google.com/search?q=LawMart+Las+Vegas';
  });
  document.querySelectorAll('[data-booking]').forEach(link => link.addEventListener('click', event => {
    if (config.BOOKING_URL) { event.preventDefault(); track('booking_click'); location.href=config.BOOKING_URL; }
  }));
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    const value=link.dataset.service;
    try { sessionStorage.setItem('lawmartService', value); } catch {}
    const target=document.querySelector(`input[name="service"][value="${CSS.escape(value)}"]`); if(target) target.checked=true;
  }));
  try {
    const saved=sessionStorage.getItem('lawmartService');
    if(saved){ const target=document.querySelector(`input[name="service"][value="${CSS.escape(saved)}"]`); if(target) target.checked=true; sessionStorage.removeItem('lawmartService'); }
  } catch {}

  const intakeForm=document.getElementById('intake-form');
  const status=document.getElementById('form-status');
  const submitButton=intakeForm?.querySelector('button[type="submit"]');
  const originalSubmitText=submitButton?.textContent || 'Submit';
  const setSubmitting=(active)=>{
    if(!submitButton) return;
    submitButton.disabled=active;
    submitButton.setAttribute('aria-busy',String(active));
    submitButton.textContent=active?'Sending…':originalSubmitText;
  };
  let formStarted = false;
  intakeForm?.addEventListener('input', () => {
    if (!formStarted) { formStarted = true; track('form_start', {form_name:'consultation_intake'}); }
  }, {once:true});
  intakeForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if(!intakeForm.checkValidity()){
      intakeForm.reportValidity();
      track('form_error', {form_name:'consultation_intake', error_type:'validation'});
      if(status){status.textContent='Please complete the required fields.';status.classList.add('error')} return;
    }
    setSubmitting(true);
    const data=new FormData(intakeForm);
    Object.entries(campaign).forEach(([key,value]) => data.set(key,value));
    data.set('page_url', location.href);
    data.set('page_path', pagePath);
    data.set('page_title', document.title);
    data.set('page_service', pageService);
    data.set('referrer', document.referrer || 'direct');
    data.set('submitted_at', new Date().toISOString());
    const service=String(data.get('service') || pageService);
    const first=String(data.get('firstName')||'').trim();
    const last=String(data.get('lastName')||'').trim();
    if(status){status.classList.remove('error');status.textContent='Preparing your request…'}
    track('lead_submit', {form_name:'consultation_intake', service_name:service, submission_method:config.FORM_ENDPOINT?'endpoint':'email'});

    if(config.FORM_ENDPOINT){
      try{
        const response=await fetch(config.FORM_ENDPOINT,{method:'POST',body:data,headers:{Accept:'application/json'}});
        if(!response.ok) throw new Error('Submission failed');
        try { sessionStorage.setItem('lawmartLeadComplete','1'); } catch {}
        track('generate_lead',{service_name:service, method:'online_form'});
        if (config.GOOGLE_ADS_SEND_TO) gtag('event','conversion',{send_to:config.GOOGLE_ADS_SEND_TO});
        location.href='/thank-you/'; return;
      }catch(err){
        track('form_error', {form_name:'consultation_intake', error_type:'endpoint'});
        if(status){status.textContent='Online submission was unavailable. Opening your email application instead.';status.classList.add('error')}
      }
    }
    setSubmitting(false);
    const attribution = campaignKeys.filter(key => campaign[key]).map(key => `${key}: ${campaign[key]}`);
    const subject=`LawMart consultation request: ${service} - ${first} ${last}`;
    const body=['LAWMART CONSULTATION REQUEST','',`Service: ${service}`,`Name: ${first} ${last}`,`Email: ${data.get('email')}`,`Phone: ${data.get('phone')}`,`Preferred contact: ${data.get('contactMethod')}`,`Best time: ${data.get('contactTime')}`,'','How LawMart can help:',String(data.get('details')||'').trim(), ...(attribution.length?['','Marketing attribution:',...attribution]:[]),'','Acknowledgment: I understand LawMart is not a law firm, does not provide legal advice, and prepares documents only at my direction.'].join('\n');
    track('email_lead_intent',{service_name:service});
    if(status) status.textContent='Opening your email application…';
    location.href=`mailto:contact@lawmartlasvegas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });


  // Lead Generation Suite v2.1: streamlined single-panel service forms
  document.querySelectorAll('.service-intake-form[data-single-panel="true"]').forEach(form => {
    const submit=form.querySelector('.wizard-submit');
    const statusEl=form.querySelector('.form-status');
    let started=false;
    const service=form.dataset.serviceForm || pageService;
    const originalSubmit=submit?.textContent || 'Send consultation request';

    const refreshConditional=()=>{
      form.querySelectorAll('[data-show-field]').forEach(panel=>{
        const checked=form.querySelector(`[name="${panel.dataset.showField}"]:checked`);
        const visible=checked?.value===panel.dataset.showValue;
        panel.classList.toggle('is-visible',visible);
        panel.querySelectorAll('input,select,textarea').forEach(control=>{
          control.disabled=!visible;
        });
      });
      form.querySelectorAll('[data-show-select]').forEach(panel=>{
        const control=form.querySelector(`[name="${panel.dataset.showSelect}"]`);
        const visible=control?.value===panel.dataset.showValue;
        panel.classList.toggle('is-visible',visible);
        panel.querySelectorAll('input,select,textarea').forEach(field=>{
          field.disabled=!visible;
        });
      });
    };

    const markStarted=()=>{
      if(!started){
        started=true;
        track('form_start',{form_name:'service_intake_single_panel',service_name:service});
      }
    };

    form.addEventListener('input',()=>{refreshConditional();markStarted();});
    form.addEventListener('change',()=>{refreshConditional();markStarted();});

    form.addEventListener('submit',async event=>{
      event.preventDefault();
      refreshConditional();
      if(!form.checkValidity()){
        form.reportValidity();
        track('form_error',{form_name:'service_intake_single_panel',service_name:service,error_type:'validation'});
        return;
      }
      submit.disabled=true;
      submit.setAttribute('aria-busy','true');
      submit.textContent='Sending…';
      if(statusEl){statusEl.classList.remove('error');statusEl.textContent='Sending your request securely…';}
      const data=new FormData(form);
      Object.entries(campaign).forEach(([key,value])=>data.set(key,value));
      data.set('page_url',location.href);
      data.set('page_path',pagePath);
      data.set('page_service',pageService);
      data.set('submitted_at',new Date().toISOString());
      track('lead_submit',{form_name:'service_intake_single_panel',service_name:service,submission_method:'endpoint'});
      try{
        const response=await fetch(config.FORM_ENDPOINT || form.action,{method:'POST',body:data,headers:{Accept:'application/json'}});
        if(!response.ok) throw new Error('Submission failed');
        try{sessionStorage.setItem('lawmartLeadComplete','1')}catch{}
        track('generate_lead',{form_name:'service_intake_single_panel',service_name:service,method:'online_form'});
        if(config.GOOGLE_ADS_SEND_TO) gtag('event','conversion',{send_to:config.GOOGLE_ADS_SEND_TO});
        location.href='/thank-you/';
      }catch(error){
        submit.disabled=false;
        submit.removeAttribute('aria-busy');
        submit.textContent=originalSubmit;
        if(statusEl){statusEl.textContent='We could not send the form. Please call (702) 900-1003 or email contact@lawmartlasvegas.com.';statusEl.classList.add('error');}
        track('form_error',{form_name:'service_intake_single_panel',service_name:service,error_type:'endpoint'});
      }
    });

    refreshConditional();
  });

  if (pagePath === '/thank-you/') {
    try {
      if (sessionStorage.getItem('lawmartLeadComplete') === '1') {
        sessionStorage.removeItem('lawmartLeadComplete');
        track('thank_you_view', {lead_verified:true});
      }
    } catch {}
  }
})();

// Version 1.1 pricing estimator
(() => {
  const select=document.getElementById('estimate-service');
  if(!select) return;
  const lines=document.getElementById('estimate-lines'), total=document.getElementById('estimate-total'), note=document.getElementById('estimate-note');
  const data={
    divorce:{lines:[['LawMart preparation fee','$500'],['Estimated court filing fee','~$300'],['Estimated process server','~$100']],total:'~$900',note:'Illustrative estimate only. Court and service charges vary.'},
    estate:{lines:[['LawMart preparation fee','$500'],['Possible notary/recording costs','Varies']],total:'$500 + costs',note:'Many estate-planning documents may not require recording. Confirm execution requirements for the documents you select.'},
    sealing:{lines:[['LawMart preparation fee','$500'],['Court, records, fingerprint, or agency costs','Varies']],total:'$500 + costs',note:'Third-party charges depend on the record and agencies involved.'},
    i130:{lines:[['LawMart preparation fee','$500'],['USCIS filing fee','Confirm with USCIS']],total:'$500 + USCIS',note:'USCIS fees change. Confirm the current fee and filing method before submission.'},
    n400:{lines:[['LawMart preparation fee','$500'],['USCIS filing fee','Confirm with USCIS']],total:'$500 + USCIS',note:'Fee waivers or reductions involve eligibility questions that may require legal guidance.'},
    i90:{lines:[['LawMart preparation fee','$350'],['USCIS filing fee','Confirm with USCIS']],total:'$350 + USCIS',note:'Confirm current USCIS charges before filing.'},
    i765:{lines:[['LawMart preparation fee','$350'],['USCIS filing fee','Confirm with USCIS']],total:'$350 + USCIS',note:'The applicable filing category and fee are determined by the client or legal counsel.'},
    i131:{lines:[['LawMart preparation fee','$350'],['USCIS filing fee','Confirm with USCIS']],total:'$350 + USCIS',note:'Travel-related immigration questions may require advice from a licensed immigration attorney.'},
    aos:{lines:[['LawMart preparation fee','From $900'],['USCIS filing fees','Confirm with USCIS'],['Medical exam / translations / other costs','Varies']],total:'From $900 + costs',note:'Adjustment packages can involve multiple forms and substantial supporting evidence. Final preparation pricing is confirmed before work begins.'}
  };
  const render=()=>{const x=data[select.value];lines.innerHTML=x.lines.map(([a,b])=>`<div class="estimate-line"><span>${a}</span><span>${b}</span></div>`).join('');total.textContent=x.total;note.textContent=x.note; if(window.gtag) gtag('event','pricing_estimate_view',{service_name:select.value});};
  select.addEventListener('change',render);render();
})();


// LawMart 2.0 Phase 2.2: Cal.com scheduling embeds
(() => {
  if (!document.querySelector('[data-cal-link]')) return;
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
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
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  Cal('init', 'free-phone-consultation', {origin:'https://cal.com'});
  Cal.ns['free-phone-consultation']('ui', {
    hideEventTypeDetails:false,
    layout:'month_view',
    styles:{branding:{brandColor:'#C9A24A'}}
  });
  Cal.ns['free-phone-consultation']('preload', {calLink:'brenden-greystone-dhxm1y/free-phone-consultation'});

  Cal('init', 'in-person-consultation', {origin:'https://cal.com'});
  Cal.ns['in-person-consultation']('ui', {
    hideEventTypeDetails:false,
    layout:'month_view',
    styles:{branding:{brandColor:'#C9A24A'}}
  });
  Cal.ns['in-person-consultation']('preload', {calLink:'brenden-greystone-dhxm1y/in-person-consultation'});

  // Keep visitors on LawMart. The Cal.com embed script handles the same click
  // through data-cal-link/data-cal-namespace and opens its modal.
  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-cal-link]');
    if (!el) return;
    const fallback = el.dataset.calFallbackHref;
    if (window.__calEmbedFailed && fallback) {
      location.href = fallback;
      return;
    }
    event.preventDefault();
  }, {capture:true});
})();

// LawMart 2.0 Phase 3.5: Ads-ready conversion measurement
(() => {
  const track = window.lawmartTrack;
  if (typeof track !== 'function') return;

  // Clean intent events. These are useful diagnostics, but should remain
  // secondary conversions in Google Ads because a click is not a lead/sale.
  document.addEventListener('click', (event) => {
    const el = event.target.closest('a,button');
    if (!el) return;
    const href = el.getAttribute('href') || '';
    const service = el.dataset.service || undefined;
    if (el.matches('[data-cal-link]')) {
      const slug = el.dataset.calLink || '';
      track('appointment_start', {
        appointment_type: slug.includes('in-person') ? 'in_person' : 'free_phone',
        service_name: service
      });
    }
    if (/buy\.stripe\.com/i.test(href)) {
      track('begin_checkout', {
        currency: 'USD',
        value: 500,
        service_name: service || 'document_preparation'
      });
    }
  }, {capture:true});

  // Phase 3.5 production tracking: Cal.com namespaced embeds require namespaced event listeners.
  // bookingSuccessfulV2 fires only after a fresh booking has been created.
  const registerCalSuccess = () => {
    if (typeof window.Cal !== 'function' || window.__lawmartCalSuccessRegistered) return;
    const namespaces = [
      ['free-phone-consultation','free_phone'],
      ['in-person-consultation','in_person']
    ];
    let registered = 0;
    namespaces.forEach(([namespace, appointmentType]) => {
      const api = window.Cal.ns && window.Cal.ns[namespace];
      if (typeof api !== 'function') return;
      api('on', {
        action:'bookingSuccessfulV2',
        callback:(event) => {
          const detail = event?.detail || {};
          const data = detail.data || {};
          const uid = typeof data.uid === 'string' ? data.uid.slice(0,120) : '';
          const key = `lawmartBooking:${appointmentType}:${uid || data.startTime || new Date().toISOString()}`;
          try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key,'1'); } catch {}
          track('appointment_booked', {
            appointment_type:appointmentType,
            conversion_source:'cal_embed',
            booking_status:typeof data.status === 'string' ? data.status : undefined,
            payment_required:typeof data.paymentRequired === 'boolean' ? data.paymentRequired : undefined,
            currency:appointmentType === 'in_person' ? 'USD' : undefined,
            value:appointmentType === 'in_person' ? 50 : undefined
          });
        }
      });
      registered += 1;
    });
    if (registered === namespaces.length) window.__lawmartCalSuccessRegistered = true;
  };
  registerCalSuccess();
  setTimeout(registerCalSuccess, 500);
  setTimeout(registerCalSuccess, 1800);
  setTimeout(registerCalSuccess, 3500);

  // Phase 3.1 fallback: if a future Cal.com plan enables redirects, this page
  // can still record a completed booking. Phase 3.2 does not require redirects.
  if (location.pathname === '/booking-success/' || location.pathname === '/booking-success/index.html') {
    const params = new URLSearchParams(location.search);
    const requestedType = params.get('type');
    const appointmentType = requestedType === 'in_person' ? 'in_person' :
      requestedType === 'free_phone' ? 'free_phone' : 'appointment';
    const key = `lawmartBookingRedirect:${appointmentType}`;
    let already = false;
    try { already = sessionStorage.getItem(key) === '1'; sessionStorage.setItem(key, '1'); } catch {}
    if (!already) track('appointment_booked', {
      appointment_type: appointmentType,
      conversion_source: 'cal_redirect',
      currency: appointmentType === 'in_person' ? 'USD' : undefined,
      value: appointmentType === 'in_person' ? 50 : undefined
    });
  }

  // A Stripe Payment Link can be configured to redirect here after successful
  // payment: /payment-success/?service=divorce (or estate_planning/record_sealing).
  if (location.pathname === '/payment-success/' || location.pathname === '/payment-success/index.html') {
    const allowed = new Set(['divorce','estate_planning','record_sealing']);
    const service = new URLSearchParams(location.search).get('service');
    if (allowed.has(service)) {
      const key = `lawmartPurchase:${service}`;
      let already = false;
      try { already = sessionStorage.getItem(key) === '1'; sessionStorage.setItem(key, '1'); } catch {}
      if (!already) track('purchase', {transaction_source:'stripe_payment_link', service_name:service, currency:'USD', value:500});
    }
  }
})();
