/* PINT API — deploy this source to the separate Cloudflare 'pint-api' Worker.
 * Requires the existing D1 binding env.DB -> pint-db.
 * Does NOT replace the older shared review service.
 * Firebase project: pint-a05d1; no service-account private key required.
 */
const PROJECT='pint-a05d1';
const ORIGIN='https://akkaguwy.github.io';
const JWKS='https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const json=(data,status=200,origin=ORIGIN)=>new Response(JSON.stringify(data),{
  status,headers:{
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'Access-Control-Allow-Origin':origin,
    'Vary':'Origin',
    'Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers':'Authorization,Content-Type'
  }
});
const decode=str=>{
  const base=str.replace(/-/g,'+').replace(/_/g,'/');
  const binary=atob(base.padEnd(Math.ceil(base.length/4)*4,'='));
  return Uint8Array.from(binary,c=>c.charCodeAt(0));
};
async function verifyFirebaseIdToken(token){
  if(typeof token!=='string'||token.length>8192)throw Error('Invalid token');
  const parts=token.split('.');
  if(parts.length!==3)throw Error('Invalid token format');
  const header=JSON.parse(new TextDecoder().decode(decode(parts[0])));
  const payload=JSON.parse(new TextDecoder().decode(decode(parts[1])));
  const now=Math.floor(Date.now()/1000);
  if(header.alg!=='RS256'||!header.kid||typeof header.kid!=='string')throw Error('Invalid token algorithm');
  if(payload.aud!==PROJECT||payload.iss!=='https://securetoken.google.com/'+PROJECT||
    typeof payload.sub!=='string'||!payload.sub||payload.sub.length>128||
    !Number.isFinite(payload.exp)||payload.exp<=now||
    !Number.isFinite(payload.iat)||payload.iat>now+30||
    !Number.isFinite(payload.auth_time)||payload.auth_time>now+30)throw Error('Token claims invalid');
  const keysResponse=await fetch(JWKS,{cf:{cacheTtl:1800,cacheEverything:true}});
  if(!keysResponse.ok)throw Error('Authentication keys unavailable');
  const jwks=await keysResponse.json();
  const jwk=(jwks.keys||[]).find(key=>key.kid===header.kid&&key.kty==='RSA'&&key.alg==='RS256');
  if(!jwk)throw Error('Unknown signing key');
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const signed=new TextEncoder().encode(parts[0]+'.'+parts[1]);
  const valid=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),signed);
  if(!valid)throw Error('Invalid token signature');
  return payload;
}
async function authenticate(request){
  const header=request.headers.get('Authorization')||'';
  if(!header.startsWith('Bearer '))throw Error('Authorization required');
  return verifyFirebaseIdToken(header.slice(7));
}
const cleanName=value=>String(value||'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,40);
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.headers.get('Origin')&&request.headers.get('Origin')!==ORIGIN)
      return json({error:'Origin not allowed'},403);
    if(request.method==='OPTIONS')return json({},204);
    if(url.pathname==='/api/health'&&request.method==='GET')
      return json({app:'PINT API',status:'online',accounts:'firebase',database:!!env.DB});
    if(url.pathname!=='/api/me'||!['GET','POST','PUT'].includes(request.method))
      return json({error:'Not found'},404);
    if(!env.DB)return json({error:'Database binding missing'},503);
    let identity;
    try{identity=await authenticate(request)}
    catch{return json({error:'Unauthorized: sign in to Firebase'},401)}
    if(identity.email_verified!==true||typeof identity.email!=='string'||!identity.email)
      return json({error:'Verify your email address before using your PINT cloud profile'},403);
    const userId=identity.sub,email=identity.email.toLowerCase();
    try{
      if(request.method==='POST'){
        const body=await request.json().catch(()=>({}));
        const name=cleanName(body.display_name||identity.name||email.split('@')[0])||'PINT member';
        await env.DB.prepare(
          'INSERT INTO users (id,email,display_name) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email'
        ).bind(userId,email,name).run();
      }
      if(request.method==='PUT'){
        const body=await request.json().catch(()=>({}));
        const name=cleanName(body.display_name);
        if(name.length<2)return json({error:'Name must be at least two characters'},400);
        const updated=await env.DB.prepare('UPDATE users SET display_name=? WHERE id=?').bind(name,userId).run();
        if(!updated.meta?.changes)return json({error:'Create profile first'},404);
      }
      const profile=await env.DB.prepare(
        'SELECT id,display_name,created_at FROM users WHERE id=?'
      ).bind(userId).first();
      if(!profile)return json({error:'Profile not created yet'},404);
      return json({profile});
    }catch{
      // Never leak database queries, credentials or stack traces.
      return json({error:'Database request failed'},500);
    }
  }
};
