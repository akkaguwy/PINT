/* Methven NZ release regression: region, IDs, pricing, links and winter statuses. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const home=fs.readFileSync('home.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const golf=fs.readFileSync('pub_golf.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const css=fs.readFileSync('home.css','utf8');
const extract=name=>{
  const match=app.match(new RegExp('const '+name+' = \\[([\\s\\S]*?)\\n  \\];'));
  assert.ok(match,'missing '+name);
  return Function('return ['+match[1]+']')();
};
const methven=extract('methvenSuggestions').map((s,i)=>{
 const [name,area,address,description]=s.split('|');
 assert.ok(name&&area&&address&&description,'incomplete Methven venue '+i);
 assert.match(address,/Methven/,'NZ location missing');
 return {name,area,address,description,id:'suggestion-methven-'+i};
});
const expected=[
 'The Blue Pub','The Brown Pub','The Dubliner','The Green Parrot Bar & Grill',
 'Amara Bar & Snackery','Craft @ Arabica','Ski Time Restaurant & Bar',"Shackleton's @ Brinkley"
];
assert.deepEqual(methven.map(x=>x.name),expected);
assert.equal(new Set(methven.map(p=>p.name.toLowerCase())).size,methven.length);
assert.ok(methven.every(p=>p.area==='Methven'));
assert.match(methven[7].description,/winter-only/i,'the seasonal bar must be labelled');
assert.match(app,/parseSuggestions\(methvenSuggestions,'Methven'\)/);
assert.match(app,/\['Vale','Cardiff','Dublin','Methven'\]/);
assert.match(app,/\['Cardiff','Vale','Dublin','Methven'\]/);
assert.match(app,/region==='Methven'\?'NZ\$'/,'NZ dollars');
assert.match(app,/Methven\|Methven.*-43\.6324,171\.6473/,'Methven approximate centre');
assert.match(app,/New Zealand/,'NZ maps');
assert.match(html,/data-home-region="Methven"/);
assert.match(html,/option value="Methven">Methven, New Zealand/);
assert.match(html,/id="entry-price-label"/);
assert.match(home,/Methven:'Methven'/);
assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(golf,/id:'methven-village'/);
assert.match(sw,/pint-offline-v4\.12/);
assert.match(html,/src="app\.js\?v=4\.12"/);
assert.match(html,/src="home\.js\?v=4\.9"/);
assert.match(html,/src="pub_golf\.js\?v=4\.11"/);
const cardiff=extract('cardiffSuggestions');
const vale=extract('valeSuggestions');
const dublin=extract('dublinSuggestions');
assert.equal(cardiff[0].split('|')[0],'City Arms','Cardiff stable base');
assert.equal(vale[0].split('|')[0],'The Bear Hotel','Vale stable base');
assert.equal(dublin[0].split('|')[0],'The Palace Bar','Dublin stable base');
console.log('Methven destination regression passed ('+methven.length+' venue records).');
