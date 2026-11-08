(() => {
  'use strict';
  const ROUTES = [
    {id:'stadium',name:'The Match-Day Five',region:'Cardiff',area:'Stadium & Westgate Street',icon:'🏉',tag:'MATCH DAY',intro:'A compact pre-match course around the Principality and Castle Quarter.',stops:[
      ['City Arms','Quay Street, Cardiff'],["The Queen's Vaults",'Westgate Street, Cardiff'],['Tiny Rebel Cardiff','Westgate Street, Cardiff'],['The Old Arcade','Church Street, Cardiff'],['Blue Bell','High Street, Cardiff']]},
    {id:'castle',name:'Castle Quarter Classics',region:'Cardiff',area:'Old Town',icon:'🏰',tag:'TRADITIONAL',intro:'A historic-centre wander for old-school pub atmosphere.',stops:[
      ['The Goat Major','High Street, Cardiff'],['Blue Bell','High Street, Cardiff'],['The Rummer Tavern','Duke Street, Cardiff'],['Owain Glyndwr','St John Street, Cardiff'],['The Old Arcade','Church Street, Cardiff']]},
    {id:'pontcanna',name:'The Local Legend',region:'Cardiff',area:'Pontcanna & Canton',icon:'🌳',tag:'NEIGHBOURHOOD',intro:'A change of pace through residential Cardiff and its independent locals.',stops:[
      ['The Halfway','Cathedral Road, Cardiff'],['The Cricketers','Cathedral Road, Cardiff'],['The Pontcanna Inn','Cathedral Road, Cardiff'],['The Beverley','Cathedral Road, Cardiff'],['The Romilly','Romilly Crescent, Cardiff']]},
    {id:'bay',name:'Bay Side Five',region:'Cardiff',area:'Cardiff Bay',icon:'⚓',tag:'WATERFRONT',intro:'A waterfront course ideal for an afternoon exploring the Bay.',stops:[
      ['The Packet','Bute Street, Cardiff'],['The Eli Jenkins','Bute Crescent, Cardiff'],['The Mount Stuart','Cardiff Bay, Cardiff'],['The Dock','Mermaid Quay, Cardiff'],['The Waterguard','Harbour Drive, Cardiff']]},
    {id:'cowbridge',name:'Cowbridge Circuit',region:'Vale',area:'Cowbridge',icon:'🏡',tag:'VALE CLASSIC',intro:'Market-town pubs, from the High Street to a traditional local on the edge of town.',stops:[
      ['The Bear Hotel','High Street, Cowbridge'],['Duke of Wellington','High Street, Cowbridge'],['Vale of Glamorgan Inn','High Street, Cowbridge'],['The Edmondes Arms','Cardiff Road, Cowbridge'],['The Cross Inn','Llanblethian, Cowbridge']]},
    {id:'penarth',name:'Penarth Promenade',region:'Vale',area:'Penarth',icon:'🌊',tag:'SEASIDE TOWN',intro:'Discover different corners of Penarth on a town-centre pub circuit.',stops:[
      ['The Albion','Glebe Street, Penarth'],['The Windsor','Windsor Road, Penarth'],['The Railway Hotel','Plymouth Road, Penarth'],['The Golden Lion','Glendale Road, Penarth'],['The Pilot','Queens Road, Penarth']]},
    {id:'barry',name:'Barry Explorer',region:'Vale',area:'Barry',icon:'🎡',tag:'BARRY',intro:'A longer town wander with classic locals and a waterfront finish.',stops:[
      ['The Park','Park Crescent, Barry'],['The Baruc Arms','High Street, Barry'],['Sir Samuel Romilly','Broad Street, Barry'],['The Old Dock','Holton Road, Barry'],['Craft Republic','Neptune Road, Barry']]}
,    {id:'methven-village',name:'Methven Village Five',region:'Methven',area:'Mt Hutt Village',icon:'🏔️',tag:'METHVEN NZ',intro:'A five-stop village circuit with Kiwi pubs, an Irish local and a couple of bars. Check opening times before setting off.',stops:[
      ['The Blue Pub','1 Barkers Road, Methven, New Zealand'],
      ['The Brown Pub','Main Street and Forest Drive, Methven, New Zealand'],
      ['The Dubliner','116 Main Street, Methven, New Zealand'],
      ['Amara Bar & Snackery','129 Main Street, Methven, New Zealand'],
      ['The Green Parrot Bar & Grill','36 Forest Drive, Methven, New Zealand']]}
  ];
  const $=selector=>document.querySelector(selector);
  const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const KEY='pint-golf-scores-v1';
  let progress={};try{const parsed=JSON.parse(localStorage.getItem(KEY));if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))progress=parsed}catch{}
  let selected=(new URLSearchParams(location.search).get('destination')||localStorage.getItem('pint-destination-v1'))==='Methven'?'methven-village':'stadium';
  const maps=stop=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(stop[0]+', '+stop[1]);
  // Five stops allow a start, destination and three intermediate waypoints in common mobile Maps URLs.
  function courseMap(route){const place=s=>s[0]+', '+s[1];return 'https://www.google.com/maps/dir/?api=1&travelmode=walking&origin='+encodeURIComponent(place(route.stops[0]))+'&destination='+encodeURIComponent(place(route.stops.at(-1)))+'&waypoints='+encodeURIComponent(route.stops.slice(1,-1).map(place).join('|'))}
  const stateFor=id=>Array.from({length:5},(_,i)=>{const s=progress[id]?.[i];return {visited:Boolean(s?.visited),points:Number.isInteger(s?.points)&&s.points>=0&&s.points<=5?s.points:null}});
  const resumeKey='pint-golf-resume-v1';
  function readResume(){
    try{return JSON.parse(localStorage.getItem(resumeKey)||'{}')||{}}catch{return {}}
  }
  function saveResume(update){
    try{localStorage.setItem(resumeKey,JSON.stringify({...readResume(),...update}))}catch{}
    document.dispatchEvent(new Event('pint:golf-progress'));
  }
  function persist(routeId,items){
    progress[routeId]=items;
    try{localStorage.setItem(KEY,JSON.stringify(progress))}catch{alert('Could not save the scorecard on this device.')}
    saveResume({course:routeId,courseTime:Date.now()});
  }
  function routeCards(){const html=ROUTES.map(route=>{const count=stateFor(route.id).filter(s=>s.visited).length;return `<button class="golf-route ${route.id===selected?'selected':''}" data-route="${safe(route.id)}" aria-pressed="${route.id===selected}"><span class="golf-route-icon">${route.icon}</span><span class="golf-route-tag">${safe(route.tag)}</span><strong>${safe(route.name)}</strong><small>${safe(route.area)} · 5 holes</small><span class="golf-progress">${count===0?'Not started':count===5?'Course complete':count+'/5 completed'} <span>↗</span></span></button>`}).join('');$('#golf-routes').innerHTML=html}
  function detail(){const route=ROUTES.find(r=>r.id===selected),state=stateFor(route.id),completed=state.filter(s=>s.visited).length,scored=state.filter(s=>s.points!==null),total=scored.reduce((sum,s)=>sum+s.points,0);
    $('#golf-detail').innerHTML=`<div class="golf-detail-head"><div><span class="overline">SELECTED COURSE · ${safe(route.region==='Vale'?'VALE OF GLAMORGAN':route.region==='Methven'?'METHVEN, NEW ZEALAND':'CARDIFF')}</span><h3>${safe(route.name)}</h3><p>${safe(route.intro)}</p></div><div class="golf-score"><strong>${completed}<span>/5</span></strong><small>HOLES COMPLETE</small><div>${scored.length?total+' challenge points':'No points yet'}</div></div></div><div class="golf-stops">${route.stops.map((stop,i)=>{const s=state[i];return `<div class="golf-stop ${s.visited?'finished':''}"><div class="hole-number">${String(i+1).padStart(2,'0')}</div><div class="hole-info"><strong>${safe(stop[0])}</strong><small>${safe(stop[1])}</small><a href="${maps(stop)}" target="_blank" rel="noopener noreferrer">Find this pub ↗</a></div><div class="hole-inputs"><label><input type="checkbox" data-visited="${i}" ${s.visited?'checked':''}/><span>Visited</span></label><label class="points-label">Points <select aria-label="Challenge points at ${safe(stop[0])}" data-points="${i}"><option value="" ${s.points===null?'selected':''}>—</option>${[0,1,2,3,4,5].map(p=>`<option value="${p}" ${s.points===p?'selected':''}>${p}</option>`).join('')}</select></label></div></div>`}).join('')}</div><div class="golf-detail-actions"><a class="button button-gold" href="${courseMap(route)}" target="_blank" rel="noopener noreferrer">Open walking route ↗</a><button class="button button-outline" data-reset-route="${route.id}">Reset scorecard</button></div><p class="golf-note">Route order is a suggestion, not verified walking directions; check opening hours before setting off. Points are for whatever non-drinking challenge your group chooses (quiz, darts or a photo), never speed or quantity of alcohol. Take breaks and plan a safe journey home.</p>`;
  }
  $('#region-filter')?.addEventListener('change',()=>{
    if($('#region-filter').value==='Methven'){
      selected='methven-village';routeCards();detail();
    }
  });
  $('#golf-routes').addEventListener('click',e=>{const button=e.target.closest('[data-route]');if(!button)return;selected=button.dataset.route;routeCards();detail()});
  $('#golf-detail').addEventListener('change',e=>{const visit=e.target.closest('[data-visited]'),points=e.target.closest('[data-points]');if(!visit&&!points)return;const state=stateFor(selected);if(visit)state[Number(visit.dataset.visited)].visited=visit.checked;if(points)state[Number(points.dataset.points)].points=points.value===''?null:Number(points.value);persist(selected,state);routeCards();detail()});
  $('#golf-detail').addEventListener('click',e=>{const reset=e.target.closest('[data-reset-route]');if(!reset)return;if(confirm('Clear your progress and points for this course?')){delete progress[selected];localStorage.setItem(KEY,JSON.stringify(progress));routeCards();detail();document.dispatchEvent(new Event('pint:golf-progress'))}});
  const liveStart=$('#golf-live-start'),liveJoin=$('#golf-live-join'),liveCard=$('#golf-live-card');
  const liveStatus=$('#golf-live-status');
  const roundPattern=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
  let roundId=new URLSearchParams(location.search).get('round')||'';
  if(!roundPattern.test(roundId))roundId='';
  let room,me,busy=false,pendingRefresh,createAttempt;
  const total=card=>card.reduce((sum,hole)=>sum+(hole.points??0),0);
  const identityKey=()=> 'pint-golf-player:'+roundId;
  const invite=()=>{
    const url=new URL(location.pathname,location.origin);
    url.searchParams.set('screen','pub-golf');
    url.searchParams.set('round',roundId);
    return url.href;
  };
  function showLiveCard(player,route){
    liveCard.innerHTML=player?'<h4>Your scorecard</h4>'+route.stops.map(([name],i)=>{
      const hole=player.card[i];
      return `<div class="golf-live-hole" data-live-hole="${i}"><strong>${i+1}. ${safe(name)}</strong>
        <label><input type="checkbox" ${hole.visited?'checked':''}/> Visited</label>
        <label>Points <select aria-label="Live challenge points at ${safe(name)}"><option value="">—</option>
        ${[0,1,2,3,4,5].map(n=>`<option value="${n}" ${hole.points===n?'selected':''}>${n}</option>`).join('')}</select></label></div>`;
    }).join(''):'';
  }
  function refreshLive(force=false){
    if(!roundId)return;
    if(pendingRefresh)return pendingRefresh;
    pendingRefresh=(async()=>{
      try{
        const next=await window.PintShared.golfRound(roundId);
        const route=ROUTES.find(item=>item.id===next.round.course);
        if(!route)throw Error('This course is unavailable.');
        room=next;
        const player=room.players.find(item=>item.id===me?.player);
        $('#golf-live-round').hidden=false;
        liveStart.hidden=true;
        $('#golf-live-course').textContent=route.name;
        $('#golf-live-link').value=invite();
        liveJoin.hidden=!!player;
        const leaderboard=[...room.players].sort((a,b)=>total(b.card)-total(a.card)||a.name.localeCompare(b.name));
        $('#golf-live-board').innerHTML=leaderboard.length
          ?leaderboard.map(p=>`<li><strong>${safe(p.name)}</strong> · ${total(p.card)} points · ${p.card.filter(hole=>hole.visited).length}/5 visited</li>`).join('')
          :'<li>Waiting for players</li>';
        if(force||player&&!liveCard.firstElementChild)showLiveCard(player,route);
        if(player){
          const previous=readResume().live;
          const hole=player.card.findIndex(stop=>!stop.visited);
          const changed=previous?.id!==roundId||previous.hole!==hole;
          if(changed||force)saveResume({live:{id:roundId,course:route.id,hole,time:Date.now()}});
          if(new URLSearchParams(location.search).has('resume')&&hole>=0){
            const url=new URL(location.href);
            url.searchParams.delete('resume');
            history.replaceState(history.state,'',url);
            focusHole(liveCard.querySelector('[data-live-hole="'+hole+'"]'));
          }
        }
        liveStatus.textContent='';
      }catch(error){liveStatus.textContent=error.message||'Could not load the round. Retrying while this page is open.'}
      finally{pendingRefresh=null}
    })();
    return pendingRefresh;
  }
  async function writeLive(button,task){
    if(busy)return;
    busy=true;
    button.disabled=true;
    try{await pendingRefresh;await task()}
    catch(error){liveStatus.textContent=error.message||'Could not save. Try again.'}
    finally{busy=false;button.disabled=false}
  }
  liveStart.addEventListener('click',()=>writeLive(liveStart,async()=>{
    if(createAttempt?.course!==selected)createAttempt={round:crypto.randomUUID(),course:selected};
    await window.PintShared.golfWrite({action:'create',...createAttempt});
    roundId=createAttempt.round;
    history.replaceState(history.state,'',invite());
    await refreshLive(true);
  }));
  liveJoin.addEventListener('submit',event=>{
    event.preventDefault();
    writeLive(liveJoin.querySelector('button'),async()=>{
      me??={player:crypto.randomUUID(),secret:crypto.randomUUID()};
      localStorage.setItem(identityKey(),JSON.stringify(me));
      await window.PintShared.golfWrite({action:'join',round:roundId,...me,name:liveJoin.elements.playerName.value});
      await refreshLive(true);
    });
  });
  liveCard.addEventListener('change',event=>{
    const row=event.target.closest('[data-live-hole]');
    if(!row||!me)return;
    const hole=Number(row.dataset.liveHole),visit=row.querySelector('input'),points=row.querySelector('select');
    const previous=room.players.find(item=>item.id===me.player)?.card[hole];
    if(!previous)return;
    if(busy){visit.checked=previous.visited;points.value=previous.points??'';return}
    const next={visited:visit.checked,points:points.value===''?null:Number(points.value)};
    const controls=[...liveCard.querySelectorAll('input,select')];
    controls.forEach(control=>control.disabled=true);
    writeLive(event.target,async()=>{
      try{
        await window.PintShared.golfWrite({action:'score',round:roundId,...me,hole,...next});
        Object.assign(previous,next);
        await refreshLive(true);
      }catch(error){visit.checked=previous.visited;points.value=previous.points??'';throw error}
      finally{controls.forEach(control=>control.disabled=false)}
    });
  });
  $('#golf-live-copy').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(invite());liveStatus.textContent='Link copied.'}
    catch{$('#golf-live-link').select();liveStatus.textContent='Copy the selected invite link.'}
  });
  if(roundId){
    liveStart.hidden=true;
    try{me=JSON.parse(localStorage.getItem(identityKey())||'null')}catch{}
    requestAnimationFrame(()=>$('#golf-live-title').scrollIntoView());
    refreshLive(true);
  }
  setInterval(()=>{if(!document.hidden&&!busy)refreshLive()},5000);
  function focusHole(row){
    row?.scrollIntoView({block:'center'});
    row?.querySelector('input')?.focus({preventScroll:true});
  }
  window.PintGolf={resumable(){
    const saved=readResume();
    const courses=[...ROUTES].sort((a,b)=>Number(b.id===saved.course)-Number(a.id===saved.course));
    const local=courses.map(route=>({route,card:stateFor(route.id)}))
      .find(({card})=>card.some(stop=>stop.visited||stop.points!==null)&&card.some(stop=>!stop.visited));
    const candidates=[];
    if(local){
      const {route,card}=local,hole=card.findIndex(stop=>!stop.visited);
      candidates.push({time:route.id===saved.course?saved.courseTime:0,hole:hole+1,pub:route.stops[hole][0],open(){
        selected=route.id;
        routeCards();detail();
        window.PintNavigate('pub-golf');
        focusHole($('#golf-detail [data-visited="'+hole+'"]')?.closest('.golf-stop'));
      }});
    }
    const live=saved.live;
    const route=ROUTES.find(item=>item.id===live?.course);
    const stop=route?.stops[live?.hole];
    if(stop&&roundPattern.test(live.id))candidates.push({time:live.time,hole:live.hole+1,pub:stop[0],open(){
      if(live.id===roundId&&room){
        window.PintNavigate('pub-golf');
        focusHole(liveCard.querySelector('[data-live-hole="'+live.hole+'"]'));
        return;
      }
      const url=new URL(location.pathname,location.origin);
      url.search=new URLSearchParams({screen:'pub-golf',round:live.id,resume:'1'});
      location.assign(url);
    }});
    return candidates;
  }};
  routeCards();detail();
  document.dispatchEvent(new Event('pint:golf-progress'));
})();
