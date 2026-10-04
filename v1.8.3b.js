// FatBoySchlim v1.8.3b — stable media renderer + actual meal UI coverage
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const norm=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
  let mediaCache=null, mediaStamp=0, rendering=false;

  async function media(){
    if(mediaCache && Date.now()-mediaStamp<30000) return mediaCache;
    const {data,error}=await db.from('media_assets')
      .select('entity_type,entity_name,role,sequence_order,remote_url,attribution,approved,status,quality')
      .eq('approved',true).eq('status','sourced');
    if(error){ console.error('FBS media load:',error); return []; }
    mediaCache=data||[]; mediaStamp=Date.now(); return mediaCache;
  }

  const rowsFor=(rows,type,name)=>rows.filter(x=>x.entity_type===type && norm(x.entity_name)===norm(name));
  const recipeAsset=(rows,name)=>rowsFor(rows,'recipe',name).find(x=>x.role==='cover' && x.remote_url);
  const foodAsset=(rows,name)=>{
    const xs=rowsFor(rows,'food',name);
    return xs.find(x=>x.role==='package'&&x.remote_url)||xs.find(x=>x.role==='grocery'&&x.remote_url);
  };

  function realRecipeImage(host,name,a,cls='v183bRecipePhoto'){
    if(!host||!a?.remote_url||!name)return;
    const existing=q(`:scope > img.${cls}`,host);
    if(existing?.dataset.src===a.remote_url)return existing;

    q(':scope > .recipePlaceholder',host)?.classList.add('v182LegacySentinel');
    let img=existing;
    if(!img){
      img=document.createElement('img');
      img.className=cls;
      host.prepend(img);
    }
    img.dataset.src=a.remote_url;
    img.alt=name;
    img.title=a.attribution||'';
    img.loading='lazy';
    img.decoding='async';
    img.onload=()=>{img.style.display='block'};
    img.onerror=()=>{img.style.display='none'};
    img.src=a.remote_url;
    return img;
  }

  function renderRecipeCards(rows){
    // Standard planner/Eat cards + v1.5 300+ meal library cards.
    qa('.recipeCard,.v15LibraryCard').forEach(card=>{
      const name=(q('.recipeTop b',card)||q('.recipeBody > b',card)||q('.recipeBody b',card))?.textContent?.trim();
      if(!name)return;
      const a=recipeAsset(rows,name);
      if(a)realRecipeImage(card,name,a);
    });

    // Weekly Shop calendar cells.
    qa('.weekMealCell:not(.empty)').forEach(cell=>{
      const name=q('.weekMealName',cell)?.textContent?.trim();
      if(!name)return;
      const a=recipeAsset(rows,name);
      if(a)realRecipeImage(cell,name,a,'v183bWeekMealPhoto');
    });

    // Prepared meals in Eat.
    qa('.readyMeal').forEach(card=>{
      const name=q('b',card)?.textContent?.trim();
      if(!name)return;
      const a=recipeAsset(rows,name);
      if(a)realRecipeImage(card,name,a,'v183bReadyPhoto');
    });

    // Full recipe detail hero.
    qa('.recipeHero').forEach(hero=>{
      const name=q('h1',hero)?.textContent?.trim();
      if(!name)return;
      const a=recipeAsset(rows,name);
      if(!a)return;
      const old=q(':scope > .recipeHeroPhoto',hero);
      if(old && old.tagName!=='IMG')old.classList.add('v182LegacySentinel');
      let img=q(':scope > img.v183bHeroPhoto',hero);
      if(img?.dataset.src===a.remote_url)return;
      if(!img){
        img=document.createElement('img');
        img.className='recipeHeroPhoto v183bHeroPhoto';
        hero.prepend(img);
      }
      img.dataset.src=a.remote_url;
      img.alt=name;
      img.title=a.attribution||'';
      img.onload=()=>{img.style.display='block'};
      img.onerror=()=>{img.style.display='none'};
      img.src=a.remote_url;
    });
  }

  function renderFoodCards(rows){
    qa('.purchaseCard,.grocery,.v15FoodRow').forEach(card=>{
      const name=(q('.buyCheck b',card)||q('b',card))?.textContent?.trim();
      if(!name)return;
      const a=foodAsset(rows,name);
      if(!a?.remote_url)return;

      let box=q('.v17ItemImage',card);
      if(!box){
        box=document.createElement('div');
        box.className='v17ItemImage';
        card.prepend(box);
      }
      if(box.dataset.src===a.remote_url)return;
      box.dataset.src=a.remote_url;
      box.replaceChildren();
      const img=document.createElement('img');
      img.alt=name;img.title=a.attribution||'';img.loading='lazy';
      img.onload=()=>box.classList.remove('v182ImageError');
      img.onerror=()=>{box.classList.add('v182ImageError');img.remove()};
      box.appendChild(img);img.src=a.remote_url;
    });
  }

  function setExerciseFrame(fig,a,name,role){
    fig.replaceChildren();
    const cap=document.createElement('figcaption');cap.textContent=role.toUpperCase();
    if(!a?.remote_url){
      const d=document.createElement('div');d.className='v182Missing';d.textContent='Photo pending';
      fig.append(d,cap);return;
    }
    const img=document.createElement('img');
    img.alt=`${name} ${role}`;img.title=a.attribution||'';img.loading='lazy';img.decoding='async';
    img.onerror=()=>{img.remove();const d=document.createElement('div');d.className='v182Missing';d.textContent='Photo unavailable';fig.insertBefore(d,cap)};
    fig.append(img,cap);img.src=a.remote_url;
  }

  function renderExercises(rows){
    qa('.exerciseCard').forEach(card=>{
      const name=q('h2',card)?.textContent?.trim();if(!name)return;
      const legacy=q('.v17ExerciseImage',card);
      if(legacy){legacy.classList.add('v182LegacySentinel');legacy.setAttribute('aria-hidden','true')}
      const found=rowsFor(rows,'exercise',name);
      const sig=found.map(x=>`${x.role}:${x.remote_url||''}`).sort().join('|')||'none';
      let strip=q('.v18ExerciseStrip',card);
      if(strip?.dataset.mediaSignature===sig)return;
      if(!strip){
        strip=document.createElement('div');strip.className='v18ExerciseStrip v182StableStrip';
        (q('.exerciseHead',card)||card.firstElementChild)?.insertAdjacentElement('beforebegin',strip);
      }
      strip.dataset.mediaSignature=sig;strip.replaceChildren();
      for(const role of ['start','mid','end']){
        const fig=document.createElement('figure');
        setExerciseFrame(fig,found.find(x=>x.role===role),name,role);
        strip.appendChild(fig);
      }
    });
  }

  async function render(){
    if(rendering)return;
    rendering=true;
    try{
      const rows=await media();
      renderRecipeCards(rows);
      renderFoodCards(rows);
      renderExercises(rows);
    }finally{rendering=false}
  }

  let timer=null;
  const observer=new MutationObserver(muts=>{
    if(muts.every(m=>m.target.closest?.('.v182StableStrip')))return;
    clearTimeout(timer);timer=setTimeout(render,100);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',()=>setTimeout(render,180));
  window.addEventListener('pageshow',()=>setTimeout(render,180));
})();
