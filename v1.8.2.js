// FatBoySchlim v1.8.2 — stable media renderer
// Replaces v1.7.3.js, v1.8.js and v1.8.1.js.
// Key rule: never remove the v1.7 image containers; keep them as hidden sentinels
// so v1.7's observer does not continually recreate them.
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const norm=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
  let mediaCache=null, mediaStamp=0, rendering=false;

  async function media(){
    if(mediaCache && Date.now()-mediaStamp<60000) return mediaCache;
    const {data,error}=await db.from('media_assets')
      .select('entity_type,entity_name,role,sequence_order,remote_url,attribution,approved,status,quality')
      .eq('approved',true).eq('status','sourced');
    if(error){ console.error('FBS media load:',error); return []; }
    mediaCache=data||[]; mediaStamp=Date.now(); return mediaCache;
  }
  const rowsFor=(rows,type,name)=>rows.filter(x=>x.entity_type===type && norm(x.entity_name)===norm(name));

  function setImageState(fig,a,name,role){
    fig.replaceChildren();
    const cap=document.createElement('figcaption');
    cap.textContent=role.toUpperCase();

    if(!a?.remote_url){
      const d=document.createElement('div');
      d.className='v182Missing';
      d.textContent='Photo pending';
      fig.append(d,cap);
      return;
    }

    const img=document.createElement('img');
    img.alt=`${name} ${role}`;
    img.loading='lazy';
    img.decoding='async';
    img.title=a.attribution||'';
    let settled=false;

    img.onload=()=>{ settled=true; fig.classList.remove('is-error'); };
    img.onerror=()=>{
      if(settled) return;
      settled=true;
      img.remove();
      fig.classList.add('is-error');
      const d=document.createElement('div');
      d.className='v182Missing';
      d.textContent='Photo unavailable';
      fig.insertBefore(d,cap);
    };

    fig.append(img,cap);
    img.src=a.remote_url;
  }

  function renderExerciseCard(card,rows){
    const name=q('h2',card)?.textContent?.trim();
    if(!name) return;

    // Leave the legacy image box in the DOM as a sentinel.
    // v1.7 checks for this element before trying to create another one.
    const legacy=q('.v17ExerciseImage',card);
    if(legacy){
      legacy.classList.add('v182LegacySentinel');
      legacy.setAttribute('aria-hidden','true');
    }

    const found=rowsFor(rows,'exercise',name);
    const sig=found.map(x=>`${x.role}:${x.remote_url||''}`).sort().join('|') || 'none';

    let strip=q('.v18ExerciseStrip',card);
    if(strip?.dataset.mediaSignature===sig) return;

    if(!strip){
      strip=document.createElement('div');
      strip.className='v18ExerciseStrip v182StableStrip';
      const head=q('.exerciseHead',card)||card.firstElementChild;
      head?.insertAdjacentElement('beforebegin',strip);
    }
    strip.dataset.mediaSignature=sig;
    strip.replaceChildren();

    for(const role of ['start','mid','end']){
      const fig=document.createElement('figure');
      const a=found.find(x=>x.role===role);
      setImageState(fig,a,name,role);
      strip.appendChild(fig);
    }
  }

  function renderRecipeCard(card,rows){
    const name=(q('.recipeBody b',card)||q('.recipeTop b',card)||q('b',card))?.textContent?.trim();
    if(!name) return;
    const a=rowsFor(rows,'recipe',name).find(x=>x.role==='cover');
    if(!a?.remote_url) return;

    const ph=q('.recipePlaceholder',card);
    if(ph) ph.classList.add('v182LegacySentinel');

    let img=q(':scope > img.v182RecipePhoto',card);
    if(img?.dataset.src===a.remote_url) return;
    if(!img){
      img=document.createElement('img');
      img.className='v182RecipePhoto';
      card.prepend(img);
    }
    img.dataset.src=a.remote_url;
    img.alt=name;
    img.title=a.attribution||'';
    img.onerror=()=>{ img.style.display='none'; };
    img.onload=()=>{ img.style.display='block'; };
    img.src=a.remote_url;
  }

  function renderFoodCard(card,rows){
    const name=(q('.buyCheck b',card)||q('b',card))?.textContent?.trim();
    if(!name) return;
    const xs=rowsFor(rows,'food',name);
    const a=xs.find(x=>x.role==='package')||xs.find(x=>x.role==='grocery');
    if(!a?.remote_url) return;

    let box=q('.v17ItemImage',card);
    if(!box){
      box=document.createElement('div');
      box.className='v17ItemImage';
      card.prepend(box);
    }
    box.dataset.v182Real='1';
    let img=q('img',box);
    if(img?.dataset.src===a.remote_url) return;
    box.replaceChildren();
    img=document.createElement('img');
    img.dataset.src=a.remote_url;
    img.alt=name;
    img.title=a.attribution||'';
    img.onerror=()=>{ box.classList.add('v182ImageError'); img.remove(); };
    img.onload=()=>box.classList.remove('v182ImageError');
    box.appendChild(img);
    img.src=a.remote_url;
  }

  async function render(){
    if(rendering) return;
    rendering=true;
    try{
      const rows=await media();
      qa('.exerciseCard').forEach(c=>renderExerciseCard(c,rows));
      qa('.recipeCard').forEach(c=>renderRecipeCard(c,rows));
      qa('.purchaseCard,.grocery,.v15FoodRow').forEach(c=>renderFoodCard(c,rows));
    }finally{
      rendering=false;
    }
  }

  let timer=null;
  const observer=new MutationObserver(mutations=>{
    // Ignore mutations entirely inside our own stable media strip.
    if(mutations.every(m=>m.target.closest?.('.v182StableStrip'))) return;
    clearTimeout(timer);
    timer=setTimeout(render,120);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});

  window.addEventListener('load',()=>setTimeout(render,180));
  window.addEventListener('pageshow',()=>setTimeout(render,180));
})();
