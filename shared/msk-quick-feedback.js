(()=>{
 const boot=()=>{
  if(document.getElementById('mskQuickFeedbackButton'))return;
  const leader=document.getElementById('mskLeaderboardButton');
  if(!leader){setTimeout(boot,600);return;}
  const btn=document.createElement('button');
  btn.id='mskQuickFeedbackButton'; btn.type='button';btn.textContent='✉ Feedback';
  btn.setAttribute('aria-haspopup','dialog');leader.insertAdjacentElement('afterend',btn);
  const overlay=document.createElement('div');
  overlay.id='mskQuickFeedbackOverlay';overlay.hidden=true;
  overlay.innerHTML='<section class="msk-fb-dialog" role="dialog" aria-modal="true" aria-labelledby="mskFbTitle"><button type="button" class="msk-fb-close" aria-label="Close feedback">×</button><h2 id="mskFbTitle">Send feedback</h2><p>Have a correction, suggestion, or bug to report? Your feedback will be saved with your MegaHub username.</p><form id="mskFbForm"><label for="mskFbText">Your feedback</label><textarea id="mskFbText" required maxlength="4000" rows="6" placeholder="Tell us what you think…"></textarea><div class="msk-fb-actions"><span id="mskFbStatus" role="status" aria-live="polite"></span><button type="submit" id="mskFbSubmit">Submit feedback</button></div></form></section>';
  document.body.appendChild(overlay);
  const close=()=>{overlay.hidden=true;btn.focus()};
  btn.addEventListener('click',()=>{overlay.hidden=false;overlay.querySelector('#mskFbText').focus()});
  overlay.querySelector('.msk-fb-close').addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close()});
  const form=overlay.querySelector('#mskFbForm');
  form.addEventListener('submit',async e=>{
   e.preventDefault();
   const status=overlay.querySelector('#mskFbStatus'),submit=overlay.querySelector('#mskFbSubmit');
   const message=overlay.querySelector('#mskFbText').value.trim();
   if(!message)return;
   submit.disabled=true;status.textContent='Sending…';
   try{
    if(!window.supabase)throw Error('Login service is unavailable. Please refresh the page.');
    const client=window.supabase.createClient('https://ofqfdnxpftifnvxnvppe.supabase.co','sb_publishable_06zYj2REZQMC8nXfhm7weQ_Nrotri7G');
    const {data:{user},error:authError}=await client.auth.getUser();
    if(authError||!user)throw Error('Please sign in to your MegaHub account first.');
    const {data:profile,error:profileError}=await client.from('profiles').select('display_name').eq('id',user.id).single();
    if(profileError||!profile?.display_name)throw Error('Please set your username in My Profile before submitting.');
    const {error}=await client.from('msk_feedback').insert({user_id:user.id,username:profile.display_name,message});
    if(error)throw Error('Could not save feedback. '+error.message);
    status.textContent='Thanks! Your feedback was submitted.';form.reset();
   }catch(err){status.textContent=err.message||'Unable to submit feedback. Please try again.'}
   finally{submit.disabled=false}
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
 else boot();
})();