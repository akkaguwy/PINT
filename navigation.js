/* PINT mobile screen router — navigation history stays in sync with the browser. */
(() => {
  'use strict';
  const names={home:'Home',explore:'Explore pubs','pub-golf':'Pub Golf','my-pints':'Community',gallery:'Photo Gallery',profile:'Profile'};
  const allowed=new Set(Object.keys(names));
  const mobileQuery=window.matchMedia('(max-width: 620px)');
  const mobile=()=>mobileQuery.matches;
  const header=document.getElementById('screen-header');
  const back=document.getElementById('screen-back');
  const screenLabel=document.getElementById('screen-title');
  const fromURL=()=>new URL(location.href).searchParams.get('screen');
  const valid=id=>allowed.has(id)?id:'home';
  let current=valid(fromURL());
  let depth=Number.isInteger(history.state?.pintDepth)?history.state.pintDepth:0;
  function urlFor(id){
    const url=new URL(location.href);
    url.searchParams.set('screen',id);
    url.hash='';
    return url;
  }
  function display(id){
    current=valid(id);
    document.body.classList.toggle('pint-mobile-screens',mobile());
    document.body.dataset.screen=current;
    if(header)header.hidden=!mobile()||current==='home';
    if(screenLabel)screenLabel.textContent=names[current];
    if(back)back.setAttribute('aria-label','Back from '+names[current]);
    document.querySelectorAll('.mobile-nav a[href^="#"]').forEach(link=>{
      if(link.getAttribute('href')==='#'+current)link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    if(mobile())window.scrollTo(0,0);
    document.dispatchEvent(new CustomEvent('pint:screen-change',{detail:{screen:current}}));
  }
  function navigate(id){
    id=valid(id);
    if(!mobile()){
      const target=document.getElementById(id);
      if(target)target.scrollIntoView({behavior:'smooth'});
      return;
    }
    if(current===id)return;
    depth+=1;
    history.pushState({pintScreen:id,pintDepth:depth},'',urlFor(id));
    display(id);
  }
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#"]');
    if(!anchor)return;
    const id=anchor.getAttribute('href').slice(1);
    if(!allowed.has(id))return;
    event.preventDefault();
    navigate(id);
  });
  back?.addEventListener('click',()=>{
    if(depth>0){history.back();return}
    if(current!=='home'){
      history.replaceState({pintScreen:'home',pintDepth:0},'',urlFor('home'));
      display('home');
    }
  });
  window.addEventListener('popstate',()=>{
    depth=Number.isInteger(history.state?.pintDepth)?history.state.pintDepth:0;
    display(valid(fromURL()));
  });
  mobileQuery.addEventListener?.('change',()=>display(current));
  if(!history.state?.pintScreen){
    history.replaceState({...(history.state||{}),pintScreen:current,pintDepth:depth},'',location.href);
  }
  display(current);
  window.PintNavigate=navigate;
})();