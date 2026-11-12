'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{id,hidden:false,value:'',files:[],innerHTML:'',textContent:'',listeners:{},addEventListener(k,v){this.listeners[k]=v},replaceChildren(){},append(){},focus(){},select(){}});return nodes.get(id)}
const form=node('recap-moment-form');form.elements=['author','venue','note','occurredAt'].map(node);for(const n of form.elements)form.elements[n.id]=n;
node('recap-create').elements={title:{value:'Dublin test'}};
node('recap-create').reset=()=>{};
let moments=[],uploadError=true,reads=0,submitted=[];
const night={id:'00000000-0000-4000-8000-000000000001',title:'Friday <mates>'};
class FormData{constructor(){this.data={}}set(k,v){this.data[k]=v}}
class XHR{upload={};open(){}send(data){submitted.push(data.data);queueMicrotask(()=>{this.status=uploadError?503:201;this.responseText=JSON.stringify(uploadError?{error:'Try again'}:{saved:true});if(!uploadError)moments=[{id:'moment',nightId:night.id,mediaType:'',author:'<Akka>',venue:'The pub',note:'<script>alert(1)</script>',occurredAt:Date.now()}];this.onload()})}}
const events={};
const context={window:{PintDirectory:{pubs:()=>[]},addEventListener(){}},document:{getElementById:node,addEventListener(k,fn){events[k]=fn},body:{dataset:{screen:'recaps'}},hidden:false},location:{href:'https://akkaguwy.github.io/PINT/?screen=recaps&night='+night.id},history:{state:{},replaceState(){}},localStorage:{getItem(){return null},setItem(){}},navigator:{},crypto:require('node:crypto').webcrypto,URL,Date,AbortSignal,FormData,XMLHttpRequest:XHR,setInterval(){},fetch:async()=>{reads++;return{ok:true,json:async()=>({night,moments})}}};
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
 assert(reads>=2);console.log('Night recap checks passed: shared loading, safe rendering, failed upload retention and idempotent retries.');
})().catch(e=>{console.error(e);process.exitCode=1});
