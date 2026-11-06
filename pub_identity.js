/* Pub categories: conservative editorial labels. These are not verified venue facilities. */
(() => {
  'use strict';
  const known = {
    "the palace bar":["Traditional","Historic"],
    "bowe's lounge bar":["Traditional","Guinness"],
    "the temple bar pub":["Traditional","Live music","Tourist favourite"],
    "the old storehouse":["Traditional","Live music"],
    "the auld dubliner":["Traditional","Live music"],
    "the stag's head":["Traditional","Historic"],
    "the long hall":["Traditional","Historic"],
    "grogan's castle lounge":["Traditional","Art"],
    "kehoe's":["Traditional","Historic"],
    "neary's":["Traditional"],
    "mulligan's":["Traditional","Guinness"],
    "o'donoghue's":["Traditional","Live music"],
    "toners":["Traditional","Beer garden"],
    "doheny & nesbitt":["Traditional","Historic"],
    "the cobblestone":["Traditional","Live music"],
    "the brazen head":["Traditional","Historic","Live music"],
    "john kavanagh's (the gravediggers)":["Traditional","Guinness"],
    "the gravediggers":["Traditional","Guinness"],
    "anseo":["Late bar","Live music"],
    "arthur's pub":["Traditional","Live music"],
    "bad bobs":["Late bar","Cocktails","Live music"],
    "the bank on college green":["Cocktails","Historic"],
    "bruxelles":["Late bar","Live music"],
    "the international bar":["Comedy","Traditional"],
    "the hairy lemon":["Traditional","Food"],
    "the pygmalion":["Cocktails","Late bar"],
    "the george":["Late bar","Nightlife"],
    "the porterhouse temple bar":["Craft beer","Brewpub"],
    "the foggy dew":["Traditional","Live music"],
    "oliver st john gogarty":["Traditional","Live music"],
    "the workman's club":["Live music","Late bar"],
    "the black sheep":["Craft beer"],
    "fidelity":["Craft beer","Cocktails"],
    "l. mulligan grocer":["Craft beer","Food"],
    "the old royal oak":["Traditional"],
    "the bleeding horse":["Traditional","Sports"],
    "devitt's":["Traditional","Live music"],
    "the bernard shaw":["Late bar","Food"],
    "the back page":["Sports","Games"],
    "the cat and cage":["Traditional","Food"],
    "the blackbird":["Late bar","Beer garden"],
    "the taphouse":["Craft beer","Food"],
    "the bath":["Sports","Food"],
    "brewdog outpost dublin":["Craft beer","Brewpub"],
    "gibney's of malahide":["Traditional","Sports"],
    "the bloody stream":["Traditional","Food"],
    "the blue light":["Traditional","Scenic"],
    "city arms":["Traditional","Rugby"],
    "the old arcade":["Traditional","Rugby"],
    "tiny rebel cardiff":["Craft beer","Food"],
    "the cambrian tap":["Craft beer"],
    "head of steam":["Craft beer","Food"]
  };
  const allowed=new Set(["Pub","Traditional","Historic","Guinness","Cocktails","Live music","Late bar","Sports","Craft beer","Brewpub","Beer garden","Food","Comedy","Nightlife","Art","Tourist favourite","Games","Scenic","Rugby"]);
  function tags(pub) {
    const explicit=pub.typeTags||pub.tags||pub.categories;
    const custom=Array.isArray(explicit)?explicit:
      (typeof pub.pubType==='string'?[pub.pubType]:[]);
    const knownTags=known[String(pub.name||'').toLowerCase().trim()]||[];
    const result=[...new Set([...custom,...knownTags].map(String).filter(x=>allowed.has(x)))];
    return result.length?result.slice(0,3):['Pub'];
  }
  window.PintIdentity={tags,allowed:[...allowed]};
})();
