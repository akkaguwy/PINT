/* PINT screen router — navigation history stays in sync with the browser. */
(() => {
  'use strict';
  const names={home:'Home',explore:'Explore pubs',games:'Games','pub-golf':'Pub Golf','pub-bingo':'Pub Bingo',darts:'Darts Scorer','my-pints':'Community',gallery:'Photo Gallery',recaps:'Night Recaps',profile:'Profile'};
  const allowed=new Set(Object.keys(names));
  const gameHeadings={'pub-golf':'golf-heading','pub-bingo':'bingo-heading',darts:'darts-heading'};
  const gameScreens=new Set(['games',...Object.keys(gameHeadings)]);
  const fullScreens=new Set([...gameScreens,'recaps']);
  const mobileQuery=window.matchMedia('(max-width: 620px)');
  const mobile=()=>mobileQuery.matches;
  const header=document.getElementById('screen-header');
  const back=document.getElementById('screen-back');
  const screenLabel=document.getElementById('screen-title');
  const fromURL=()=>{
    const url=new URL(location.href);
    return url.searchParams.get('screen')||(gameScreens.has(url.hash.slice(1))?url.hash.slice(1):null);
  };
  const valid=id=>allowed.has(id)?id:'home';
  let current=valid(fromURL());
  let depth=Number.isInteger(history.state?.pintDepth)?history.state.pintDepth:0;
  function urlFor(id){
    const url=new URL(location.href);
    url.searchParams.set('screen',id);
    if(id!=='pub-bingo')url.searchParams.delete('bingo');
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
    const tab=gameScreens.has(current)?'games':current;
    document.querySelectorAll('.mobile-nav a[href^="#"]').forEach(link=>{
      if(link.getAttribute('href')==='#'+tab)link.setAttribute('aria-current',tab===current?'page':'location');
      else link.removeAttribute('aria-current');
    });
    if(mobile()||fullScreens.has(current))window.scrollTo(0,0);
    document.dispatchEvent(new CustomEvent('pint:screen-change',{detail:{screen:current}}));
  }
  function navigate(id){
    id=valid(id);
    if(!mobile()&&!fullScreens.has(id)&&!fullScreens.has(current)){
      const target=document.getElementById(id);
      if(target)target.scrollIntoView({behavior:'smooth'});
      return;
    }
    if(current===id)return;
    depth+=1;
    history.pushState({pintScreen:id,pintDepth:depth},'',urlFor(id));
    display(id);
    if(!mobile()&&!fullScreens.has(id))document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  }
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#"]');
    if(!anchor)return;
    const id=anchor.getAttribute('href').slice(1);
    if(!allowed.has(id))return;
    event.preventDefault();
    navigate(id);
  });
  const gamesSelect=document.getElementById('games-select');
  gamesSelect?.addEventListener('change',()=>{
    const game=gamesSelect.value;
    gamesSelect.value='';
    if(!Object.hasOwn(gameHeadings,game))return;
    navigate(game);
    document.getElementById(gameHeadings[game])?.focus({preventScroll:true});
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