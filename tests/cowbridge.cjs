/* PINT: Cowbridge directory completeness and stable IDs. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const home=fs.readFileSync('home.js','utf8');
const vale=source.match(/const valeSuggestions = \[([\s\S]*?)\n  \];/);
assert.ok(vale,'Vale catalog must exist');
const rows=Function('return ['+vale[1]+']')();
const venues=rows.map((row,index)=>{
  const [name,area,address,description]=row.split('|');
  assert.ok(name&&area&&address&&description,'Incomplete pub at index '+index);
  return {id:'suggestion-vale-'+index,name,area,address,description};
});
const original=[
  'The Bear Hotel','Duke of Wellington','Vale of Glamorgan Inn','The Edmondes Arms',
  "Farmer's Arms",'The Cross Inn','The Fox','The Bush Inn','The Victoria Inn',
  'The Plough & Harrow','The Blue Anchor','The Old Swan Inn','The White Hart',
  "The Blacksmith's Arms",'Boverton Castle','The Pilot','The Windsor',
  'The Railway Hotel','The Golden Lion','The Albion','The Baruc Arms','The Park',
  'Sir Samuel Romilly','The Ship','The Cherry Orchard','The Colcot Arms',
  'The Old Dock','Craft Republic','The Two Bells','The Rhoose',
  'The Pelican in Her Piety','The Three Horseshoes','The Star Inn','The Three Golden Cups'
];
// The Vale catalog had 34 entries: new entries must only append, so old review IDs remain stable.
assert.equal(venues.slice(0,original.length).map(x=>x.name).join('|'),original.join('|'));
const expected=[
  '1 Town Hall Square','Horse & Groom',"Harry's Bar",'Barbacoa Bar & Tapas',
  'The Hare & Hounds','The Barley Mow','The Sycamore Tree','The White Lion','The Star Inn'
];
assert.deepEqual(venues.slice(original.length).map(x=>x.name),expected);
const identities=venues.map(v=>(v.name+'|'+v.area).toLowerCase());
assert.equal(new Set(identities).size,identities.length,'Duplicate pub/area entry');
assert.ok(!venues.some(v=>v.name==='Bryn Owain'||v.name==='Carne Arms'),'Do not list permanently closed pubs as new listings');
assert.match(venues.find(v=>v.name==='The Hare & Hounds').description,/temporarily closed/i);
assert.match(source,/COWBRIDGE_GROUP='cowbridge-area'/);
assert.match(source,/Cowbridge & nearby villages/);
assert.match(source,/requestedArea===COWBRIDGE_GROUP/);
assert.match(html,/id="home-cowbridge-link"/);
assert.match(home,/cowbridgeLink.hidden=activeDestination!=='Vale'/);
assert.match(source,/pint-temporary-closed/);
console.log('Cowbridge directory checks passed: '+expected.length+' new venues; '+venues.length+' Vale listings; original IDs preserved');
