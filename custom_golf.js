(() => {
  'use strict';
  const KEY='pint-custom-golf-v1';
  const limit={courses:30,stops:30,teams:30,sips:9999};
  const $=id=>document.getElementById('golf-custom-'+id);
  const safe=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const validId=id=>typeof id==='string'&&/^[0-9a-f-]{36}$/i.test(id);
  const validName=(name,length)=>typeof name==='string'&&name.trim().length>0&&name.length<=length;
  const validSips=sips=>Number.isInteger(sips)&&sips>=1&&sips<=limit.sips;
  const list=(items,max)=>Array.isArray(items)&&items.length<=max;
  const distinct=items=>new Set(items.map(item=>item.id)).size===items.length;
  function validSnapshot(round){
    if(!round||!validName(round.name,60)||!list(round.stops,limit.stops)||!round.stops.length||!list(round.teams,limit.teams))return false;
    if(!round.stops.every(stop=>stop&&validId(stop.id)&&validName(stop.name,90)&&(stop.address===undefined||typeof stop.address==='string'&&stop.address.length<=180))||!distinct(round.stops))return false;
    const stopIds=new Set(round.stops.map(stop=>stop.id));
    return round.teams.every(team=>team&&validId(team.id)&&validName(team.name,40)&&
      team.scores&&typeof team.scores==='object'&&!Array.isArray(team.scores)&&
      Object.entries(team.scores).every(([id,score])=>stopIds.has(id)&&(score==='unfinished'||validSips(score))))&&distinct(round.teams);
  }
  const validRoundId=id=>id===undefined||validId(id);
  function validate(value){
    if(!list(value,limit.courses)||!value.every(course=>validSnapshot(course)&&validId(course.id)&&validRoundId(course.roundId)&&
      (course.history===undefined||Array.isArray(course.history)&&course.history.every(round=>validSnapshot(round)&&
        validRoundId(round.roundId)&&Number.isFinite(round.finishedAt)&&Math.abs(round.finishedAt)<=8.64e15)))||!distinct(value)){
      throw Error('Invalid custom Pub Golf scorecards.');
    }
    return value;
  }
  function load(){
    try{return validate(JSON.parse(localStorage.getItem(KEY)||'[]'))}catch{return []}
  }
  let courses=load(),selectedCourse=courses[0]?.id,selectedTeam,editing,draft=[];
  const course=()=>courses.find(item=>item.id===selectedCourse);
  const form=$('form'),teamForm=$('team-form'),status=$('status');
  const shareButton=$('share'),shareStatus=$('share-status'),nextButton=$('next');
  const requests=new Map();
  const snapshot=({name,stops,teams})=>({name,stops,teams});
  const dateLabel=date=>new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short'}).format(date);
  const tokenKey=id=>'pint-custom-golf-owner:'+id;
  function owner(id){
    if(!id)return null;
    try{return JSON.parse(localStorage.getItem(tokenKey(id))||'null')}catch{return null}
  }
  function roundLink(id){
    const url=new URL(location.pathname,location.origin);
    url.searchParams.set('screen','pub-golf');
    url.searchParams.set('scoreboard',id);
    url.hash='golf-custom-viewer';
    return url.href;
  }
  function shareControls(){
    const current=course(),key=owner(current?.roundId);
    const link=key?.published?roundLink(current.roundId):'';
    $('link-label').hidden=!link;
    $('link').value=link;
    shareButton.disabled=!current?.teams.length;
    shareButton.textContent=link?'Copy scoreboard link':key?'Retry sharing':'Share scoreboard';
    nextButton.disabled=!current?.teams.length;
  }
  function publish(current,finish=false){
    const id=current.roundId;
    const previous=requests.get(id)||Promise.resolve();
    const task=previous.catch(()=>{}).then(async()=>{
      const key=owner(id);
      if(!key)throw Error('Use the original scorekeeper’s device to update this link.');
      key.revision++;
      localStorage.setItem(tokenKey(id),JSON.stringify(key));
      const result=await window.PintShared.publishCustomRound({id,secret:key.secret,revision:key.revision,round:snapshot(current),finish});
      key.published=true;
      localStorage.setItem(tokenKey(id),JSON.stringify(key));
      return result;
    });
    requests.set(id,task);
    const cleanup=()=>{if(requests.get(id)===task)requests.delete(id)};
    task.then(cleanup,cleanup);
    return task;
  }
  async function sync(current){
    if(!owner(current?.roundId))return;
    shareStatus.textContent='Updating shared scoreboard…';
    try{
      await publish(current);
      if(course()?.roundId===current.roundId){
        shareControls();
        shareStatus.textContent='Shared scoreboard is up to date.';
      }
    }catch(error){
      if(course()?.roundId===current.roundId)shareStatus.textContent='Saved here. Shared scoreboard needs a retry. '+error.message;
    }
  }
  function board(round){
    const {stops,teams}=round;
    const counts=teams.map(team=>Object.values(team.scores).filter(validSips));
    return `<div class="golf-custom-board-scroll" tabindex="0" aria-label="Scoreboard table"><table class="golf-custom-board">
      <thead><tr><th scope="col">Pub</th>${teams.map(team=>`<th scope="col">${safe(team.name)}</th>`).join('')}</tr></thead>
      <tbody>${stops.map(stop=>`<tr><th scope="row">${safe(stop.name)}</th>${teams.map(team=>{
        const result=team.scores[stop.id];
        return `<td>${result==='unfinished'?'Unfinished':result??'—'}</td>`;
      }).join('')}</tr>`).join('')}</tbody>
      <tfoot><tr><th scope="row">Total sips</th>${counts.map(values=>`<td>${values.length?values.reduce((sum,value)=>sum+value,0):'—'} · ${values.length}/${stops.length} finished</td>`).join('')}</tr></tfoot>
    </table></div>`;
  }
  function showHistory(){
    const rounds=course()?.history||[];
    $('history').innerHTML=rounds.length?'<h4>Past rounds</h4>'+rounds.map(round=>
      `<details><summary>${safe(round.name)} · ${dateLabel(round.finishedAt)}</summary>${board(round)}${round.roundId?
        `<a href="${safe(roundLink(round.roundId))}">Open shared results ↗</a>`:''}</details>`
    ).join(''):'';
  }
  function persist(next){
    try{localStorage.setItem(KEY,JSON.stringify(next))}
    catch{status.textContent='Could not save on this device. Free up browser storage and try again.';return false}
    courses=next;
    document.dispatchEvent(new Event('pint:golf-progress'));
    return true;
  }
  function replaceCourse(updated,autoShare=true){
    const saved=persist(courses.some(item=>item.id===updated.id)
      ?courses.map(item=>item.id===updated.id?updated:item):[...courses,updated]);
    if(saved&&autoShare&&updated.roundId)sync(updated);
    return saved;
  }
  function showTotals(){
    const current=course();
    $('totals').innerHTML=current.teams.length?`<div class="golf-custom-totals"><h4>Team totals</h4><dl>${current.teams.map(team=>{
      const scores=Object.values(team.scores);
      const finished=scores.filter(validSips);
      const total=finished.reduce((sum,score)=>sum+score,0);
      return `<div><dt>${safe(team.name)}</dt><dd>${finished.length?total+' sips · ':''}${finished.length}/${current.stops.length} finished${scores.includes('unfinished')?' · '+scores.filter(score=>score==='unfinished').length+' unfinished':''}</dd></div>`;
    }).join('')}</dl></div>`:'';
  }
  function showScores(){
    const current=course(),team=current?.teams.find(item=>item.id===selectedTeam)||current?.teams[0];
    selectedTeam=team?.id;
    $('team-picker').hidden=!team;
    $('team').innerHTML=current?.teams.map(item=>`<option value="${item.id}">${safe(item.name)}</option>`).join('')||'';
    if(team)$('team').value=team.id;
    $('scores').innerHTML=team?current.stops.map((stop,i)=>{
      const score=team.scores[stop.id];
      return `<div class="golf-custom-score" data-stop="${stop.id}">
        <strong>${i+1}. ${safe(stop.name)}</strong>
        <div class="golf-custom-score-controls">
        <select aria-label="Result at ${safe(stop.name)}" data-result>
          <option value="">Pending</option><option value="finished" ${validSips(score)?'selected':''}>Finished</option><option value="unfinished" ${score==='unfinished'?'selected':''}>Unfinished</option>
        </select>
        <label data-sips-label ${validSips(score)?'':'hidden'}>Sips <input aria-label="Sips at ${safe(stop.name)}" type="number" inputmode="numeric" min="1" max="${limit.sips}" step="1" value="${validSips(score)?score:''}" /></label>
        </div>
      </div>`;
    }).join(''):'';
    if(current)showTotals();
  }
  function walkingLinks(stops){
    const places=stops.map(({name,address})=>{
      const label=[name,address].filter(Boolean).join(', ').replace(/\|/g,' ');
      return new URLSearchParams({q:label}).toString().length<=850?label:name.replace(/\|/g,' ');
    });
    function directions(part){
      const url=new URL('https://www.google.com/maps/dir/');
      url.search=new URLSearchParams({api:'1',travelmode:'walking',origin:part[0],destination:part.at(-1)});
      if(part.length>2)url.searchParams.set('waypoints',part.slice(1,-1).join('|'));
      return url.href;
    }
    const links=[];
    for(let start=0;start<places.length-1;){
      let end=Math.min(start+4,places.length-1);
      while(end>start+1&&directions(places.slice(start,end+1)).length>2048)end--;
      links.push({href:directions(places.slice(start,end+1)),label:'Walk pubs '+(start+1)+'–'+(end+1)+' in Maps ↗'});
      start=end;
    }
    return links;
  }
  function showWalk(){
    const stops=course()?.stops||[];
    const links=walkingLinks(stops);
    $('walk').hidden=!links.length;
    $('walk').innerHTML=links.map(({href,label})=>
      `<a class="button button-outline" href="${safe(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`
    ).join('');
  }
  let directoryMatches=[];
  function showDirectory(){
    const query=$('pub-search').value.trim().toLowerCase();
    const destination=document.getElementById('region-filter').value;
    directoryMatches=(window.PintDirectory?.pubs()||[]).filter(pub=>query
      ?[pub.name,pub.area,pub.address,pub.region].join(' ').toLowerCase().includes(query)
      :pub.region===destination);
    directoryMatches.sort((a,b)=>a.name.localeCompare(b.name));
    const matches=directoryMatches.slice(0,40);
    $('pub-choice').innerHTML='<option value="">'+(matches.length?'Choose a pub':'No matching pubs')+'</option>'+
      matches.map((pub,i)=>`<option value="${i}">${safe(pub.name)} · ${safe(pub.area)} (${safe(pub.region)})</option>`).join('');
    $('pub-add').disabled=true;
  }
  $('pub-search').addEventListener('input',showDirectory);
  $('pub-choice').addEventListener('change',()=>{$('pub-add').disabled=$('pub-choice').value===''});
  $('pub-add').addEventListener('click',()=>{
    const value=$('pub-choice').value;
    if(value==='')return;
    const pub=directoryMatches[Number(value)];
    if(!pub)return;
    captureStops();
    const stop={id:crypto.randomUUID(),name:pub.name.slice(0,90),address:String(pub.address||pub.area||'').slice(0,180)};
    const empty=draft.findIndex(item=>!item.name.trim());
    if(empty>=0)draft[empty]={...stop,id:draft[empty].id};
    else if(draft.length<limit.stops)draft.push(stop);
    else{status.textContent='This course already has 30 pub stops.';return}
    renderStops();
    $('pub-choice').value='';
    $('pub-add').disabled=true;
  });
  function render(){
    $('picker').hidden=!courses.length;
    $('course').innerHTML=courses.map(item=>`<option value="${item.id}">${safe(item.name)}</option>`).join('');
    if(course())$('course').value=selectedCourse;
    $('edit').hidden=!course();
    $('scorecard').hidden=!course();
    $('new').disabled=courses.length>=limit.courses;
    teamForm.querySelector('button').disabled=(course()?.teams.length||0)>=limit.teams;
    showScores();
    shareControls();
    showHistory();
    showWalk();
  }
  function renderStops(){
    $('stops').innerHTML=draft.map((stop,i)=>`<div class="golf-custom-stop">
      <div class="golf-custom-stop-fields">
        <label>Pub ${i+1} <input data-stop-name maxlength="90" required value="${safe(stop.name)}" /></label>
        <label>Address or town <input data-stop-address aria-label="Address or town for pub ${i+1}" maxlength="180" value="${safe(stop.address||'')}" /></label>
      </div>
      <div class="golf-custom-stop-buttons">
        <button type="button" data-index="${i}" data-action="up" aria-label="Move pub ${i+1} up" ${i===0?'disabled':''}>↑</button>
        <button type="button" data-index="${i}" data-action="down" aria-label="Move pub ${i+1} down" ${i===draft.length-1?'disabled':''}>↓</button>
        <button type="button" data-index="${i}" data-action="remove" aria-label="Remove pub ${i+1}" ${draft.length===1?'disabled':''}>×</button>
      </div>
    </div>`).join('');
    $('add-stop').disabled=draft.length>=limit.stops;
  }
  function captureStops(){
    $('stops').querySelectorAll('[data-stop-name]').forEach((input,i)=>{draft[i].name=input.value});
    $('stops').querySelectorAll('[data-stop-address]').forEach((input,i)=>{draft[i].address=input.value});
  }
  function openEditor(current){
    editing=current?.id;
    form.elements.courseName.value=current?.name||'';
    draft=current?current.stops.map(stop=>({...stop})):[{id:crypto.randomUUID(),name:''}];
    renderStops();
    $('pub-search').value='';
    showDirectory();
    form.hidden=false;
    form.elements.courseName.focus();
    status.textContent='';
  }
  $('new').addEventListener('click',()=>openEditor());
  $('edit').addEventListener('click',()=>openEditor(course()));
  $('cancel').addEventListener('click',()=>{form.hidden=true});
  $('add-stop').addEventListener('click',()=>{
    captureStops();
    draft.push({id:crypto.randomUUID(),name:''});
    renderStops();
    $('stops').querySelectorAll('[data-stop-name]')[draft.length-1].focus();
  });
  $('stops').addEventListener('click',event=>{
    const button=event.target.closest('[data-action]');
    if(!button)return;
    captureStops();
    const i=Number(button.dataset.index);
    const action=button.dataset.action;
    const [stop]=draft.splice(i,1);
    const next=action==='up'?i-1:i+1;
    if(action!=='remove')draft.splice(next,0,stop);
    renderStops();
    const target=action==='remove'?Math.min(i,draft.length-1):next;
    $('stops').querySelectorAll('[data-stop-name]')[target].focus();
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    captureStops();
    const name=form.elements.courseName.value.trim();
    const stops=draft.map(stop=>({...stop,name:stop.name.trim(),address:(stop.address||'').trim()}));
    if(!name||stops.some(stop=>!stop.name)){status.textContent='Enter a course name and a name for each pub.';return}
    const existing=courses.find(item=>item.id===editing);
    const ids=new Set(stops.map(stop=>stop.id));
    const teams=(existing?.teams||[]).map(team=>({...team,scores:Object.fromEntries(Object.entries(team.scores).filter(([id])=>ids.has(id)))}));
    if(existing?.teams.some((team,i)=>Object.keys(team.scores).length>Object.keys(teams[i].scores).length)&&
      !confirm('Remove the saved scores for the deleted pub stops?'))return;
    const updated={...existing,id:existing?.id||crypto.randomUUID(),name,stops,teams};
    if(!replaceCourse(updated))return;
    selectedCourse=updated.id;
    form.hidden=true;
    render();
    status.textContent='Course saved.';
  });
  $('course').addEventListener('change',event=>{selectedCourse=event.target.value;form.hidden=true;render();status.textContent='';shareStatus.textContent=''});
  $('team').addEventListener('change',event=>{selectedTeam=event.target.value;showScores();status.textContent=''});
  teamForm.addEventListener('submit',event=>{
    event.preventDefault();
    const current=course(),name=teamForm.elements.teamName.value.trim();
    if(!name)return;
    if(current.teams.some(team=>team.name.toLowerCase()===name.toLowerCase())){status.textContent='That team is already on this scorecard.';return}
    const team={id:crypto.randomUUID(),name,scores:{}};
    if(!replaceCourse({...current,teams:[...current.teams,team]}))return;
    selectedTeam=team.id;
    teamForm.reset();
    render();
    status.textContent='Team added.';
  });
  $('scores').addEventListener('change',event=>{
    const row=event.target.closest('[data-stop]');
    if(!row)return;
    const current=course(),team=current.teams.find(item=>item.id===selectedTeam);
    const id=row.dataset.stop,select=row.querySelector('[data-result]'),input=row.querySelector('input');
    row.querySelector('[data-sips-label]').hidden=select.value!=='finished';
    const sips=input.valueAsNumber;
    if(select.value==='finished'&&!validSips(sips)){
      status.textContent='Enter a whole number of sips to save this stop.';
      input.focus();
      return;
    }
    const scores={...team.scores};
    if(select.value==='')delete scores[id];
    else scores[id]=select.value==='unfinished'?'unfinished':sips;
    if(!replaceCourse({...current,playedAt:Date.now(),teams:current.teams.map(item=>item.id===team.id?{...item,scores}:item)})){
      showScores();
      return;
    }
    if(select.value!=='finished')input.value='';
    showTotals();
    status.textContent='Score saved.';
  });
  shareButton.addEventListener('click',async()=>{
    let current=course();
    if(!current?.teams.length)return;
    shareButton.disabled=true;
    try{
      let key=owner(current.roundId);
      if(!key){
        const roundId=crypto.randomUUID();
        key={secret:crypto.randomUUID(),revision:0,published:false};
        localStorage.setItem(tokenKey(roundId),JSON.stringify(key));
        current={...current,roundId};
        if(!replaceCourse(current,false))return;
      }
      await publish(current);
      if(course()?.roundId!==current.roundId)return;
      shareControls();
      try{
        await navigator.clipboard.writeText(roundLink(current.roundId));
        shareStatus.textContent='Read-only scoreboard link copied.';
      }catch{
        $('link').select();
        shareStatus.textContent='Copy the selected scoreboard link.';
      }
    }catch(error){shareStatus.textContent=error.message||'Could not share. Try again.'}
    finally{shareControls()}
  });
  nextButton.addEventListener('click',async()=>{
    const current=course();
    if(!current?.teams.length||!confirm('Save these results and start a fresh scorecard on this course?'))return;
    const section=document.getElementById('golf-custom');
    section.inert=true;
    try{
      let finishedAt=Date.now();
      const roundId=owner(current.roundId)?current.roundId:undefined;
      if(roundId){
        shareStatus.textContent='Saving final results…';
        const result=await publish(current,true);
        finishedAt=result.finishedAt;
      }
      const history=[{...snapshot(current),finishedAt,roundId},...(current.history||[])];
      const teams=current.teams.map(team=>({...team,scores:{}}));
      if(!replaceCourse({...current,teams,history,roundId:undefined},false))return;
      form.hidden=true;
      render();
      shareStatus.textContent='';
      status.textContent='Round saved. The new scorecard is ready.';
    }catch(error){shareStatus.textContent=error.message||'Could not save the shared result. Try again.'}
    finally{section.inert=false}
  });
  window.addEventListener('online',()=>sync(course()));
  const viewingId=new URLSearchParams(location.search).get('scoreboard');
  if(viewingId){
    $('viewer').hidden=false;
    let loading=false,revision,finished=false;
    async function refreshViewer(){
      if(loading||finished||document.hidden)return;
      loading=true;
      try{
        const result=await window.PintShared.customRound(viewingId);
        if(!validSnapshot(result.round))throw Error('This scoreboard could not be read.');
        if(result.revision!==revision){
          $('viewer-title').textContent=result.round.name;
          $('viewer-board').innerHTML=board(result.round);
          revision=result.revision;
        }
        finished=Boolean(result.finishedAt);
        $('viewer-status').textContent=finished?'Final results · '+dateLabel(result.finishedAt):'Live scoreboard · refreshes every five seconds';
      }catch(error){$('viewer-status').textContent=error.message||'Scoreboard unavailable. Retrying…'}
      finally{loading=false}
    }
    document.addEventListener('visibilitychange',refreshViewer);
    const refresh=window.setInterval(()=>{if(finished)window.clearInterval(refresh);else refreshViewer()},5000);
    window.requestAnimationFrame(()=>$('viewer').scrollIntoView());
    refreshViewer();
  }
  render();
  if(navigator.onLine&&owner(course()?.roundId))sync(course());
  window.PintCustomGolf={
    backup:()=>load(),validate,
    resume(){
      const active=courses.filter(item=>item.teams.some(team=>Object.keys(team.scores).length)||item.roundId)
        .sort((a,b)=>(b.playedAt||0)-(a.playedAt||0))
        .map(item=>{
          const hole=item.stops.findIndex(stop=>item.teams.some(team=>team.scores[stop.id]===undefined));
          return {item,hole};
        }).find(entry=>entry.hole>=0);
      if(!active)return null;
      const {item,hole}=active, stop=item.stops[hole];
      return {time:Number(item.playedAt)||0,hole:hole+1,pub:stop.name,open(){
        selectedCourse=item.id;
        selectedTeam=item.teams.find(team=>team.scores[stop.id]===undefined)?.id;
        form.hidden=true;
        render();
        window.PintNavigate('pub-golf');
        const row=$('scores').querySelector('[data-stop="'+stop.id+'"]');
        row?.scrollIntoView({block:'center'});
        row?.querySelector('select')?.focus({preventScroll:true});
      }};
    },
    restore(next){
      if(!persist(validate(next)))throw Error('Could not restore custom Pub Golf scorecards.');
      selectedCourse=courses[0]?.id;
      selectedTeam=undefined;
      form.hidden=true;
      render();
    }
  };
})();
