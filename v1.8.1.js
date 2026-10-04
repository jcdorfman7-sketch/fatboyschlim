// FatBoySchlim v1.8.1 — strict approved-image renderer
(function(){
const qa=(s,r=document)=>[...r.querySelectorAll(s)],q=(s,r=document)=>r.querySelector(s);
const norm=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
let mediaCache=null,stamp=0;
async function getMedia(){
 if(mediaCache&&Date.now()-stamp<30000)return mediaCache;
 const {data,error}=await db.from('media_assets').select('entity_type,entity_name,role,sequence_order,remote_url,attribution,approved,status,quality').eq('approved',true).eq('status','sourced');
 if(error){console.error('v1.8.1 media load failed',error);return []}
 mediaCache=data||[];stamp=Date.now();return mediaCache;
}
const rowsFor=(rows,type,name)=>rows.filter(x=>x.entity_type===type&&norm(x.entity_name)===norm(name));
async function renderExercises(rows){
 qa('.exerciseCard').forEach(card=>{
  const name=q('h2',card)?.textContent?.trim();if(!name)return;
  const found=rowsFor(rows,'exercise',name);if(!found.length)return;
  q('.v17ExerciseImage',card)?.remove();
  let strip=q('.v18ExerciseStrip',card);
  if(!strip){strip=document.createElement('div');strip.className='v18ExerciseStrip';(q('.exerciseHead',card)||card.firstElementChild)?.insertAdjacentElement('beforebegin',strip)}
  strip.innerHTML='';
  for(const role of ['start','mid','end']){
   const a=found.find(x=>x.role===role),fig=document.createElement('figure');
   if(a?.remote_url){
    const img=document.createElement('img');img.src=a.remote_url;img.alt=`${name} ${role}`;img.title=a.attribution||'';img.loading='lazy';img.referrerPolicy='no-referrer';
    img.onerror=()=>{img.remove();const d=document.createElement('div');d.className='v181Missing';d.textContent='Photo unavailable';fig.prepend(d)};fig.appendChild(img);
   }else{const d=document.createElement('div');d.className='v181Missing';d.textContent='Photo pending';fig.appendChild(d)}
   const cap=document.createElement('figcaption');cap.textContent=role.toUpperCase();fig.appendChild(cap);strip.appendChild(fig);
  }
 });
}
async function render(){renderExercises(await getMedia())}
let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(render,90)}).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('load',()=>setTimeout(render,200));
})();