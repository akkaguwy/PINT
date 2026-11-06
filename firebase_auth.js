/* PINT Firebase Authentication. Authentication != backend ownership until /api/me succeeds. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {
  getAuth,GoogleAuthProvider,signInWithPopup,createUserWithEmailAndPassword,
  signInWithEmailAndPassword,sendPasswordResetEmail,signOut,onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

const firebaseConfig={
  apiKey:'AIzaSyAtT7-Mp8OIsZ94m0mO_iLSTtxemThqIY4',
  authDomain:'pint-a05d1.firebaseapp.com',
  projectId:'pint-a05d1',
  storageBucket:'pint-a05d1.firebasestorage.app',
  messagingSenderId:'110335584964',
  appId:'1:110335584964:web:359711a70d07ffe3157791'
};
const API='https://pint-api.akkaguwy.workers.dev';
const auth=getAuth(initializeApp(firebaseConfig));
const $=id=>document.getElementById(id);
const status=(message,error=false)=>{const e=$('auth-status');if(e){e.textContent=message;e.dataset.error=String(error)}};
const label=(error)=>{
  const names={
    'auth/email-already-in-use':'This email already has an account. Sign in instead.',
    'auth/invalid-email':'Please enter a valid email address.',
    'auth/weak-password':'Choose a stronger password (at least 6 characters).',
    'auth/invalid-credential':'Sign-in failed. Check your email and password.',
    'auth/popup-blocked':'The browser blocked sign-in. Allow pop-ups and try again.',
    'auth/popup-closed-by-user':'Google sign-in was cancelled.',
    'auth/unauthorized-domain':'This site needs to be added to Firebase authorized domains.',
    'auth/operation-not-allowed':'This sign-in method is not enabled in Firebase.',
    'auth/too-many-requests':'Too many attempts. Try again later.'
  };
  return names[error?.code]||'Authentication failed. '+String(error?.message||'Please try again.').slice(0,130);
};
const userView=$('pint-auth-user'),guestView=$('pint-auth-guest');
let verifiedBackend=false;
async function checkBackend(user){
  verifiedBackend=false;
  if(!user)return;
  const token=await user.getIdToken();
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(API+'/api/me',{headers:{Authorization:'Bearer '+token},signal:controller.signal,cache:'no-store'});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(data.error||'Account API not ready');
    verifiedBackend=true;
    status('Signed in · Cloudflare account verified.');
    if(data.profile?.display_name){
      const name=$('auth-name');
      if(name)name.textContent=data.profile.display_name;
    }
  }catch{
    status('Signed in to Firebase. PINT cloud profiles are not connected yet; existing reviews remain on the original service.');
  }finally{clearTimeout(timer)}
}
onAuthStateChanged(auth,user=>{
  if(userView)userView.hidden=!user;
  if(guestView)guestView.hidden=Boolean(user);
  const name=$('auth-name'),email=$('auth-email');
  if(name)name.textContent=user?.displayName||user?.email?.split('@')[0]||'PINT member';
  if(email)email.textContent=user?.email||'';
  document.body.classList.toggle('pint-signed-in',Boolean(user));
  window.PintAuth.currentUser=user;
  document.dispatchEvent(new CustomEvent('pint:auth-changed',{detail:{signedIn:Boolean(user),uid:user?.uid||null}}));
  if(user)checkBackend(user).catch(()=>{});else{verifiedBackend=false;status('Sign in to your PINT account.')}
});
async function doAction(button,action){
  button.disabled=true;
  try{status('Connecting…');await action()}
  catch(err){status(label(err),true)}
  finally{button.disabled=false}
}
$('auth-google')?.addEventListener('click',event=>doAction(event.currentTarget,()=>signInWithPopup(auth,new GoogleAuthProvider())));
$('auth-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const f=new FormData(event.currentTarget),email=String(f.get('email')||'').trim(),password=String(f.get('password')||''),mode=String(f.get('mode')||'login');
  const action=mode==='register'?createUserWithEmailAndPassword:signInWithEmailAndPassword;
  doAction(event.submitter||$('auth-email-submit'),()=>action(auth,email,password));
});
$('auth-reset')?.addEventListener('click',event=>doAction(event.currentTarget,async()=>{
  const email=String($('auth-email-input')?.value||'').trim();
  if(!email){status('Enter your email address first.',true);return}
  await sendPasswordResetEmail(auth,email);
  status('If the address is eligible, a password reset email has been sent.');
}));
$('auth-signout')?.addEventListener('click',event=>doAction(event.currentTarget,()=>signOut(auth)));
window.PintAuth={auth,currentUser:null,getToken:async()=>auth.currentUser?.getIdToken()||null,isBackendReady:()=>verifiedBackend};
