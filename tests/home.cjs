/* Lightweight regression tests for the PINT home dashboard. No dependencies. */
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const ids=['home-destination-label','home-hero-city','home-hero-count','home-browse-link','home-community-note','home-feed-list','region-filter','home-activity-area','home-resume-round','home-resume-stop'];
const nodes=Object.fromEntries(ids.map(id=>[id,{
  id,textContent:'',innerHTML:'',value:'Cardiff',attrs:{},listeners:{},options:[{}],
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
const listeners={};
const document={
  getElementById:id=>nodes[id]||null,
  querySelectorAll:()=>buttons,
  addEventListener(event,fn){listeners[event]=fn;}
};
const window={PintShared:{photoUrls:review=>review.photoCount?['/test-photo']:[]}};
const location={hash:''};
class FakeEvent{constructor(type){this.type=type;}}
vm.runInNewContext(fs.readFileSync('home.js','utf8'),{document,window,location,Event:FakeEvent,Intl,Date});
const pub={id:'test-pub',region:'Dublin',name:'The Long Hall'};
const review={id:'test-review',pubId:pub.id,reviewerName:'Erin',rating:4,date:'2026-11-05'};
window.PintHome.render({destination:'Dublin',pubs:[pub],reviews:[review],connected:true});
assert.equal(nodes['home-hero-count'].textContent,'1 pub');
assert.equal(nodes['home-hero-city'].textContent,'Dublin');
assert.equal(buttons[2].attrs['aria-pressed'],'true');
assert.match(nodes['home-feed-list'].innerHTML,/The Long Hall/);
assert.match(nodes['home-feed-list'].innerHTML,/Erin/);
assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/home-greeting|home-account-label/);
buttons[1].listeners.click();
assert.equal(nodes['region-filter'].value,'Vale');
assert.equal(nodes['region-filter'].emitted,'change');
window.PintHome.render({destination:'Vale',initial:true});
assert.match(nodes['home-feed-list'].innerHTML,/Loading recent reviews/);
window.PintHome.render({destination:'Vale',connected:false});
assert.match(nodes['home-feed-list'].innerHTML,/Recent reviews are unavailable/);
window.PintHome.render({destination:'Vale',pubs:[],reviews:[],connected:true});
assert.equal(nodes['home-hero-count'].textContent,'0 pubs');
assert.match(nodes['home-feed-list'].innerHTML,/No reviews here yet/);
window.PintHome.render({destination:'Dublin',pubs:[pub],reviews:[{...review,reviewerName:'<img src=x onerror=alert(1)>'}],connected:true});
assert.doesNotMatch(nodes['home-feed-list'].innerHTML,/<img src=x/);
assert.match(nodes['home-feed-list'].innerHTML,/&lt;img/);
const club={id:'club',name:'Cowbridge Athletic Club',region:'Vale',area:'Cowbridge',createdAt:Date.parse('2026-11-06')};
window.PintHome.render({destination:'Vale',connected:true,pubs:[pub,club],addedPubs:[club],reviews:[review,{...review,pubId:club.id,photoCount:1,createdAt:Date.parse('2026-11-07')}]});
const feed=nodes['home-feed-list'];
assert.match(feed.innerHTML,/Cowbridge Athletic Club/);
assert.doesNotMatch(feed.innerHTML,/The Long Hall/);
assert.equal(nodes['home-activity-area'].options[0].textContent,'the Vale');
nodes['home-activity-area'].value='all';
nodes['home-activity-area'].listeners.change();
assert.match(feed.innerHTML,/rated and shared photos/);
assert.match(feed.innerHTML,/src="\/test-photo"/);
assert.ok(feed.innerHTML.indexOf('rated and shared photos')<feed.innerHTML.indexOf('New pub added'));
assert.ok(feed.innerHTML.indexOf('New pub added')<feed.innerHTML.indexOf('The Long Hall'));
feed.listeners.click({target:{closest:()=>({dataset:{homeReviewPub:club.id}})}});
assert.equal(location.hash,'pub=club');
let resumed=false;
window.PintGolf={resumable:()=>[{time:2,hole:3,pub:'The Cross Inn',open:()=>{resumed=true;}}]};
window.PintCustomGolf={resume:()=>({time:1,hole:2,pub:'The Bear Hotel'})};
listeners['pint:golf-progress']();
assert.equal(nodes['home-resume-round'].hidden,false);
assert.equal(nodes['home-resume-stop'].textContent,'Hole 3 · The Cross Inn');
nodes['home-resume-round'].listeners.click();
assert.equal(resumed,true);
console.log('PINT home dashboard regression tests passed');
