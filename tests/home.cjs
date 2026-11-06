/* Lightweight regression tests for the PINT home dashboard. No dependencies. */
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const ids=['home-greeting','home-avatar','home-account-label','home-destination-label','home-hero-city','home-hero-count','home-browse-link','home-community-note','home-feed-list','region-filter'];
const nodes=Object.fromEntries(ids.map(id=>[id,{
  id,textContent:'',innerHTML:'',value:'Cardiff',attrs:{},listeners:{},
  setAttribute(key,value){this.attrs[key]=value;},
  addEventListener(event,fn){this.listeners[event]=fn;},
  dispatchEvent(event){this.emitted=event.type;}
}]));
const buttons=['Cardiff','Vale','Dublin'].map(value=>({
  dataset:{homeRegion:value},attrs:{},listeners:{},
  classList:{toggle(){}},
  setAttribute(key,val){this.attrs[key]=val;},
  addEventListener(key,fn){this.listeners[key]=fn;}
}));
const document={
  getElementById:id=>nodes[id]||null,
  querySelectorAll:()=>buttons,
  addEventListener(){}
};
const window={PintProfile:{load:()=>({name:'Morgan Smith'})}};
class FakeEvent{constructor(type){this.type=type;}}
vm.runInNewContext(fs.readFileSync('home.js','utf8'),{document,window,location:{hash:''},Event:FakeEvent,Intl,Date});
const pub={id:'test-pub',region:'Dublin',name:'The Long Hall'};
const review={id:'test-review',pubId:pub.id,reviewerName:'Erin',rating:4,date:'2026-11-05'};
window.PintHome.render({destination:'Dublin',pubs:[pub],reviews:[review],connected:true});
assert.equal(nodes['home-hero-count'].textContent,'1 pub');
assert.equal(nodes['home-hero-city'].textContent,'Dublin');
assert.equal(buttons[2].attrs['aria-pressed'],'true');
assert.match(nodes['home-feed-list'].innerHTML,/The Long Hall/);
assert.match(nodes['home-feed-list'].innerHTML,/Erin/);
assert.equal(nodes['home-greeting'].textContent.includes('Morgan'),true);
buttons[1].listeners.click();
assert.equal(nodes['region-filter'].value,'Vale');
assert.equal(nodes['region-filter'].emitted,'change');
window.PintHome.render({destination:'Vale',pubs:[],reviews:[],connected:false});
assert.equal(nodes['home-hero-count'].textContent,'0 pubs');
assert.match(nodes['home-feed-list'].innerHTML,/No reviews here yet/);
window.PintHome.render({destination:'Dublin',pubs:[pub],reviews:[{...review,reviewerName:'<img src=x onerror=alert(1)>'}],connected:true});
assert.doesNotMatch(nodes['home-feed-list'].innerHTML,/<img src=x/);
assert.match(nodes['home-feed-list'].innerHTML,/&lt;img/);
console.log('PINT home dashboard regression tests passed');
