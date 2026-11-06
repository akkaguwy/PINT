/* Opt-in OpenStreetMap exploration. No automatic recurring public API calls. */
(() => {
  const key='pint-dublin-osm-cache-v1', maxAge=24*60*60*1000;
  function readCache(){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&Array.isArray(v.pubs)?v:null}catch{return null}}
  function toPub(e){
    const t=e.tags||{}, lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon;
    if(!t.name||!Number.isFinite(lat)||!Number.isFinite(lon))return null;
    const area=t['addr:suburb']||t['addr:city']||t['addr:district']||'Dublin (mapped)';
    const street=[t['addr:housenumber'],t['addr:street']].filter(Boolean).join(' ');
    return {id:'osm-'+e.type+'-'+e.id,name:t.name,region:'Dublin',area,
      address:(street?street+', ':'')+'Dublin, Ireland',
      description:'Mapped on OpenStreetMap · Check opening hours before visiting',
      lat,lon,osmDiscovered:true};
  }
  async function find(){
    const cached=readCache();
    if(cached&&Date.now()-cached.at<maxAge)return {pubs:cached.pubs,cached:true};
    const q='[out:json][timeout:45];nwr["amenity"="pub"](53.30,-6.36,53.40,-6.18);out center;';
    const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),55000);
    try{
      const response=await fetch('https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q),{signal:ctl.signal});
      if(!response.ok)throw Error('Map directory temporarily busy ('+response.status+')');
      const json=await response.json();
      if(!Array.isArray(json.elements))throw Error('Invalid pub search response');
      const pubs=json.elements.map(toPub).filter(Boolean);
      if(!pubs.length)throw Error('No pubs returned from map service');
      try{localStorage.setItem(key,JSON.stringify({pubs,at:Date.now()}))}catch{}
      return {pubs,cached:false};
    }catch(e){if(cached)return {pubs:cached.pubs,cached:true,stale:true};throw e}
    finally{clearTimeout(timeout)}
  }
  window.PintDublinExplore={find,readCache};
})();
