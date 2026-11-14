'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{id,hidden:false,value:'',files:[],innerHTML:'',textContent:'',listeners:{},addEventListener(k,v){this.listeners[k]=v},replaceChildren(){},append(){},focus(){},select(){}});return nodes.get(id)}
const html=fs.readFileSync('index.html','utf8');
for(const id of ['recap-camera-photo','recap-camera-video']){
  assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,'One camera input per ID');
}
assert(!html.includes('id="recap-take-photo"'),'No disconnected programmatic camera button');
const form=node('recap-moment-form');form.elements=['author','venue','note','occurredAt'].map(node);for(const n of form.elements)form.elements[n.id]=n;
node('recap-create').elements={title:{value:'Dublin test'}};
node('recap-create').reset=()=>{};
const join=node('recap-join');join.elements={invite:{value:''}};join.querySelector=()=>({disabled:false});join.reset=()=>{join.elements.invite.value=''};
const stored={};
let moments=[],uploadError=true,reads=0,submitted=[];
const night={id:'00000000-0000-4000-8000-000000000001',title:'Friday <mates>'};
const invited={id:'00000000-0000-4000-8000-000000000002',title:'Saturday with mates'};
class FormData{constructor(){this.data={}}set(k,v){this.data[k]=v}}
class XHR{upload={};open(){}send(data){submitted.push(data.data);queueMicrotask(()=>{this.status=uploadError?503:201;this.responseText=JSON.stringify(uploadError?{error:'Try again'}:{saved:true});if(!uploadError)moments=[{id:'moment',nightId:night.id,mediaType:'',author:'<Akka>',venue:'The pub',note:'<script>alert(1)</script>',occurredAt:Date.now()}];this.onload()})}}
class TestURL extends URL{static createObjectURL(){return 'blob:preview'}static revokeObjectURL(){}}
const events={};
const context={window:{PintDirectory:{pubs:()=>[]},PintPhotos:{resize:async()=> 'data:image/jpeg;base64,AA=='},addEventListener(){}},document:{getElementById:node,createElement(tag){return{tagName:tag.toUpperCase(),src:'',textContent:'',append(){}}},addEventListener(k,fn){events[k]=fn},body:{dataset:{screen:'recaps'}},hidden:false},location:{href:'https://akkaguwy.github.io/PINT/?screen=recaps&night='+night.id},history:{state:{},replaceState(){}},localStorage:{getItem(k){return stored[k]||null},setItem(k,v){stored[k]=v}},navigator:{},crypto:require('node:crypto').webcrypto,URL:TestURL,Date,AbortSignal,FormData,XMLHttpRequest:XHR,setInterval(){},fetch:async url=>{if(String(url).startsWith('data:'))return{blob:async()=>({type:'image/jpeg'})};reads++;const isInvite=String(url).includes(encodeURIComponent(invited.id));return{ok:true,json:async()=>({night:isInvite?invited:night,moments:isInvite?[]:moments})}}};
vm.runInNewContext(fs.readFileSync('recaps.js','utf8'),context);
const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{
 await tick();assert.equal(node('recap-title').textContent,night.title);assert.equal(node('recap-album').hidden,false);
 form.elements.author.value='Akka';form.elements.note.value='A memory';
 await form.listeners.submit({preventDefault(){}});
 assert.equal(form.elements.note.value,'A memory','Failed upload must retain the note');assert.equal(node('recap-status').textContent,'Try again');assert(form.elements.every(n=>!n.disabled));
 uploadError=false;await form.listeners.submit({preventDefault(){}});await tick();
 assert.equal(submitted[0].id,submitted[1].id,'Retry must keep the same moment ID');assert.equal(submitted[0].nightId,night.id);
 assert.equal(form.elements.note.value,'');assert.match(node('recap-timeline').innerHTML,/&lt;script&gt;/);assert(!node('recap-timeline').innerHTML.includes('<script>'));assert.match(node('recap-status').textContent,/Moment added/);assert.equal(node('recap-progress').hidden,true);
 const captured={name:'from-camera.jpg',type:'image/jpeg',size:5120};
 const camera=node('recap-camera-photo');camera.listeners.change({target:{files:[captured],value:'from-camera.jpg'}});
 assert.match(node('recap-status').textContent,/Photo ready/,'Camera photo must become an attachment');
 camera.listeners.change({target:{files:[],value:''}});
 assert.match(node('recap-status').textContent,/Photo ready/,'Cancelling camera preserves the selected photo');
 await form.listeners.submit({preventDefault(){}});await tick();
 assert.equal(submitted[2].media.type,'image/jpeg','Camera image uploaded through Add moment');
 assert.match(node('recap-status').textContent,/Moment added/);
 join.elements.invite.value='not-an-invite';await join.listeners.submit({preventDefault(){}});
 assert.match(node('recap-status').textContent,/valid PINT night invitation/);
 join.elements.invite.value='https://akkaguwy.github.io/PINT/?screen=recaps&night='+invited.id;
 await join.listeners.submit({preventDefault(){}});await tick();
 assert.match(node('recap-status').textContent,/Joined!/);
 assert.match(node('recap-saved').innerHTML,/Saturday with mates/,'Joined night appears in My nights');
 assert.equal(JSON.parse(stored['pint-recap-nights'])[0].id,invited.id,'Joined night persists on this device');
 assert.equal(join.elements.invite.value,'','Invite field clears after joining');
 assert(reads>=3);console.log('Night recap checks passed: invite joining and saved nights, shared loading, safe rendering, photo capture, upload retry and idempotency.');
})().catch(e=>{console.error(e);process.exitCode=1});
