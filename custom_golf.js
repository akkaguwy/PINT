(() => {
  'use strict';
  const KEY='pint-custom-golf-v1';
  const limit={courses:30,stops:30,teams:30,sips:9999};
  const $=id=>document.getElementById('golf-custom-'+id);
  const safe=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const validId=id=>typeof id==='string'&&/^[0-9a-f-]{36}$/i.test(id);
  const validName=(name,length)=>typeof name==='string'&&name.trim().length>0&&name.length<=length;
  const validSips=sips=>Number.isInteger(sips)&&sips>=1&&sips<=limit.sips;
  function validate(value){
    const list=(items,max)=>Array.isArray(items)&&items.length<=max;
    const distinct=items=>new Set(items.map(item=>item.id)).size===items.length;
    if(!list(value,limit.courses)||!value.every(course=>{
      if(!course||!validId(course.id)||!validName(course.name,60)||!list(course.stops,limit.stops)||
        !course.stops.length||!list(course.teams,limit.teams))return false;
      if(!course.stops.every(stop=>stop&&validId(stop.id)&&validName(stop.name,90))||!distinct(course.stops))return false;
      const stopIds=new Set(course.stops.map(stop=>stop.id));
      return course.teams.every(team=>team&&validId(team.id)&&validName(team.name,40)&&
        team.scores&&typeof team.scores==='object'&&!Array.isArray(team.scores)&&
        Object.entries(team.scores).every(([id,score])=>stopIds.has(id)&&(score==='unfinished'||validSips(score))))&&distinct(course.teams);
    })||!distinct(value))throw Error('Invalid custom Pub Golf scorecards.');
    return value;
  }
  function load(){
    try{return validate(JSON.parse(localStorage.getItem(KEY)||'[]'))}catch{return []}
  }
  let courses=load(),selectedCourse=courses[0]?.id,selectedTeam,editing,draft=[];
  const course=()=>courses.find(item=>item.id===selectedCourse);
  const form=$('form'),teamForm=$('team-form'),status=$('status');
  function persist(next){
    try{localStorage.setItem(KEY,JSON.stringify(next))}
    catch{status.textContent='Could not save on this device. Free up browser storage and try again.';return false}
    courses=next;
    return true;
  }
  function replaceCourse(updated){
    return persist(courses.some(item=>item.id===updated.id)
      ?courses.map(item=>item.id===updated.id?updated:item):[...courses,updated]);
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
  function render(){
    $('picker').hidden=!courses.length;
    $('course').innerHTML=courses.map(item=>`<option value="${item.id}">${safe(item.name)}</option>`).join('');
    if(course())$('course').value=selectedCourse;
    $('edit').hidden=!course();
    $('scorecard').hidden=!course();
    $('new').disabled=courses.length>=limit.courses;
    teamForm.querySelector('button').disabled=(course()?.teams.length||0)>=limit.teams;
    showScores();
  }
  function renderStops(){
    $('stops').innerHTML=draft.map((stop,i)=>`<div class="golf-custom-stop">
      <label>Pub ${i+1} <input data-stop-name maxlength="90" required value="${safe(stop.name)}" /></label>
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
  }
  function openEditor(current){
    editing=current?.id;
    form.elements.courseName.value=current?.name||'';
    draft=current?current.stops.map(stop=>({...stop})):[{id:crypto.randomUUID(),name:''}];
    renderStops();
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
    const stops=draft.map(stop=>({...stop,name:stop.name.trim()}));
    if(!name||stops.some(stop=>!stop.name)){status.textContent='Enter a course name and a name for each pub.';return}
    const existing=courses.find(item=>item.id===editing);
    const ids=new Set(stops.map(stop=>stop.id));
    const teams=(existing?.teams||[]).map(team=>({...team,scores:Object.fromEntries(Object.entries(team.scores).filter(([id])=>ids.has(id)))}));
    if(existing?.teams.some((team,i)=>Object.keys(team.scores).length>Object.keys(teams[i].scores).length)&&
      !confirm('Remove the saved scores for the deleted pub stops?'))return;
    const updated={id:existing?.id||crypto.randomUUID(),name,stops,teams};
    if(!replaceCourse(updated))return;
    selectedCourse=updated.id;
    form.hidden=true;
    render();
    status.textContent='Course saved.';
  });
  $('course').addEventListener('change',event=>{selectedCourse=event.target.value;form.hidden=true;render();status.textContent=''});
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
    if(!replaceCourse({...current,teams:current.teams.map(item=>item.id===team.id?{...item,scores}:item)})){
      showScores();
      return;
    }
    if(select.value!=='finished')input.value='';
    showTotals();
    status.textContent='Score saved.';
  });
  render();
  window.PintCustomGolf={
    backup:()=>load(),validate,
    restore(next){
      if(!persist(validate(next)))throw Error('Could not restore custom Pub Golf scorecards.');
      selectedCourse=courses[0]?.id;
      selectedTeam=undefined;
      form.hidden=true;
      render();
    }
  };
})();
