(()=>{
'use strict';
if(window.__megaHubLockScreen)return;window.__megaHubLockScreen=true;
const URL='https://ofqfdnxpftifnvxnvppe.supabase.co';
const KEY='sb_publishable_06zYj2REZQMC8nXfhm7weQ_Nrotri7G';
let sb=null,overlay=null,poll=null;
function build(){
 if(overlay)return overlay;
 const style=document.createElement('style');style.textContent='#mhAccountLocked[hidden]{display:none!important}#mhAccountLocked{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:20px;background:rgba(12,34,22,.96);font-family:Inter,system-ui,sans-serif}#mhAccountLocked .mh-lock-card{width:min(100%,510px);background:#fbfdfb;border-radius:22px;padding:32px 26px;text-align:center;color:#21362b;box-shadow:0 24px 80px #0005}#mhAccountLocked .mh-lock-icon{font-size:33px;color:#28543d}#mhAccountLocked h2{font-size:25px;line-height:1.2;margin:14px 0}#mhAccountLocked p{font-size:13px;line-height:1.65;color:#52695b}#mhAccountLocked button{margin-top:14px;border:0;border-radius:10px;background:#28543d;color:white;padding:12px 20px;font-weight:800;cursor:pointer}';
 document.head.appendChild(style);
 overlay=document.createElement('div');overlay.id='mhAccountLocked';overlay.hidden=true;
 overlay.innerHTML='<div class="mh-lock-card" role="alertdialog" aria-modal="true" aria-labelledby="mhLockTitle"><div class="mh-lock-icon" aria-hidden="true">🔒</div><h2 id="mhLockTitle">Account Access Restricted</h2><p>Your MegaHub account has been temporarily restricted by an administrator.</p><p>Your study progress and account information have been preserved.</p><p>If you believe this is a mistake, please contact the MegaHub administrator.</p><button id="mhLockSignOut" type="button">Sign out</button></div>';
 document.body.appendChild(overlay);
 overlay.querySelector('#mhLockSignOut').addEventListener('click',async()=>{if(sb)await sb.auth.signOut();overlay.hidden=true;document.body.style.overflow='';location.reload()});
 return overlay;
}
async function check(){
 if(!sb)return;
 try{
 const {data:{user}}=await sb.auth.getUser();
 if(!user){if(overlay)overlay.hidden=true;document.body.style.overflow='';return}
 const {data,error}=await sb.rpc('megahub_access_allowed');
 if(error){console.warn('Account lock status unavailable',error);return}
 build();overlay.hidden=data!==false;document.body.style.overflow=data===false?'hidden':'';
 }catch(e){console.warn('Account lock status unavailable',e)}
}
function start(){
 if(!window.supabase){setTimeout(start,250);return}
 sb=window.supabase.createClient(URL,KEY);
 sb.auth.onAuthStateChange(()=>setTimeout(check,0));
 check();
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
 poll=setInterval(check,30000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();