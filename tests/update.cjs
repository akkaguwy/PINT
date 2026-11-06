'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('pwa.js','utf8');

function makeCase(installedVersion,serverVersion){
  const nodes=Object.fromEntries(['pint-update-notice','pint-update-now','pint-update-later','pint-update-message'].map(id=>[id,{
    id,hidden:true,disabled:false,textContent:'',listeners:{},addEventListener(name,callback){this.listeners[name]=callback}
  }]));
  const callbacks={};
  const window={
    addEventListener(type,cb){callbacks[type]=cb},
    setInterval(){}
  };
  const document={
    baseURI:'https://akkaguwy.github.io/PINT/',
    hidden:false,
    getElementById:id=>nodes[id],
    querySelector:()=>({src:'https://akkaguwy.github.io/PINT/app.js?v='+installedVersion}),
    addEventListener(type,cb){callbacks[type]=cb}
  };
  const location={
    href:'https://akkaguwy.github.io/PINT/?destination=Dublin&screen=home&v='+installedVersion,
    replace(next){this.replaced=next}
  };
  const fetch=async(url,options)=>{
    assert.match(url.href,/pint_check=/);
    assert.equal(options.cache,'no-store');
    return {ok:true,text:async()=>"const CACHE_NAME='pint-offline-v"+serverVersion+"';"};
  };
  vm.runInNewContext(source,{
    window,document,location,navigator:{onLine:true},
    fetch,URL,console,Date
  });
  return {nodes,callbacks,location};
}

(async()=>{
  const newer=makeCase('4.5','4.6');
  newer.callbacks.load();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(newer.nodes['pint-update-notice'].hidden,false);
  assert.match(newer.nodes['pint-update-message'].textContent,/4\.6/);
  await newer.nodes['pint-update-now'].listeners.click();
  assert.ok(newer.location.replaced);
  const next=new URL(newer.location.replaced);
  assert.equal(next.searchParams.get('destination'),'Dublin');
  assert.equal(next.searchParams.get('screen'),'home');
  assert.equal(next.searchParams.get('v'),'4.6');
  assert.ok(next.searchParams.get('updated'));

  const current=makeCase('4.5','4.5');
  current.callbacks.load();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(current.nodes['pint-update-notice'].hidden,true);

  const old=makeCase('4.5','4.4');
  old.callbacks.load();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(old.nodes['pint-update-notice'].hidden,true);
  console.log('PINT update detection, cache busting and destination preservation passed');
})().catch(err=>{console.error(err);process.exitCode=1});
