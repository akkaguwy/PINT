/* PINT mobile app navigation: discrete screens instead of anchor scrolling. */
(() => {
  'use strict';
  const screens={home:'Home',explore:'Explore pubs','pub-golf':'Pub Golf','my-pints':'Reviews'};
  const ids=Object.keys(screens), mobile=()=>matchMedia('(max-width: 620px)').matches;
  const back=document.getElementById('screen-back'), header=document.getElementById('screen-header');
  let current='home', screenHistory=0;
  const screenParam=()=>new URL(location.href).searchParams.get('screen');
  function activate(id, push=false){
    if(!ids.includes(id))id='home';
    if(push&&id===current)return;
    if(push){
      const u=new URL(location.href);u.searchParams.set('screen',id);u.hash='';
      history.pushState({pintScreen:id},'',u);
      screenHistory++;
    }
    current=id;
    document.body.dataset.screen=id;
    if(header)header.hidden=!mobile()||id==='home';
    if(back)back.setAttribute('aria-label','Back from '+screens[id]);
    const label=document.getElementById('screen-title');
    if(label)label.textContent=screens[id];
    document.querySelectorAll('.mobile-nav a[href^="#"]').forEach(a=>{
      const active=a.getAttribute('href')==='#'+id;
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    if(mobile())window.scrollTo({top:0,behavior:'instant'});
  }
  function navigate(id){
    if(!mobile()){
      const target=document.getElementById(id);if(target)target.scrollIntoView({behavior:'smooth'});
      return;
    }
    activate(id,true);
  }
  document.addEventListener('click',e=>{
    const link=e.target.closest('a[href^="#"]');
    if(!link)return;
    const id=link.getAttribute('href').slice(1);
    if(!ids.includes(id))return;
    e.preventDefault();navigate(id);
  });
  if(back)back.addEventListener('click',()=>{
    if(screenHistory>0){screenHistory--;history.back()}
    else navigate('home');
  });
  window.addEventListener('popstate',()=>activate(screenParam()||'home'));
  const breakpoint=matchMedia('(max-width: 620px)');
  breakpoint.addEventListener?.('change',()=>{
    document.body.classList.toggle('pint-mobile-screens',mobile());
    activate(screenParam()||current);
  });
  document.body.classList.toggle('pint-mobile-screens',mobile());
  activate(screenParam()||'home');
  window.PintNavigate=navigate;
})();
