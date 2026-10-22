(()=>{
 async function start(){
  const leader=document.getElementById('mskLeaderboardButton');
  if(!leader){setTimeout(start,800);return}
  if(document.getElementById('mskAdminFeedbackLink')||!window.supabase)return;
  const sb=window.supabase.createClient('https://ofqfdnxpftifnvxnvppe.supabase.co','sb_publishable_06zYj2REZQMC8nXfhm7weQ_Nrotri7G');
  const {data:{user}}=await sb.auth.getUser();if(!user)return;
  const {data:admin}=await sb.rpc('is_site_admin');if(admin!==true)return;
  const link=document.createElement('a');link.id='mskAdminFeedbackLink';link.href='msk-feedback-inbox.html';link.textContent='Feedback Inbox';
  (document.getElementById('mskQuickFeedbackButton')||leader).insertAdjacentElement('afterend',link);
  const update=async()=>{const {count,error}=await sb.from('msk_feedback').select('*',{count:'exact',head:true}).eq('status','new');if(error)return;link.textContent=count?'Feedback Inbox · '+count+' new':'Feedback Inbox';link.setAttribute('aria-label',count?count+' new feedback submissions':'Feedback Inbox')};
  await update();document.addEventListener('visibilitychange',()=>{if(!document.hidden)update()});setInterval(()=>{if(!document.hidden)update()},60000);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();