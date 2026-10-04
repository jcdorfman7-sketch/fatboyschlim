// FatBoySchlim v1.8.4b — adaptive exercise frames + meal/grocery renderer
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const norm=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
  let cache=null,stamp=0,busy=false;

  async function media(){
    if(cache&&Date.now()-stamp<30000)return cache;
    const {data,error}=await db.from('media_assets')
      .select('entity_type,entity_name,role,sequence_order,remote_url,attribution,approved,status,quality')
      .eq('approved',true).eq('status','sourced');
    if(error){console.error('FBS media load',error);return []}
    cache=data||[];stamp=Date.now();return cache;
  }
  const rowsFor=(rows,t,n)=>rows.filter(x=>x.entity_type===t&&norm(x.entity_name)===norm(n));

  function exercise(card,rows){
    const name=q('h2',card)?.textContent?.trim(); if(!name)return;
    const legacy=q('.v17ExerciseImage',card);
    if(legacy){legacy.classList.add('v182LegacySentinel');legacy.setAttribute('aria-hidden','true')}

    const found=rowsFor(rows,'exercise',name)
      .filter(x=>x.remote_url)
      .sort((a,b)=>(a.sequence_order||0)-(b.sequence_order||0));

    const sig=found.map(x=>`${x.role}:${x.remote_url}`).join('|')||'none';
    let strip=q('.v18ExerciseStrip',card);
    if(strip?.dataset.mediaSignature===sig)return;

    if(!strip){
      strip=document.createElement('div');
      strip.className='v18ExerciseStrip v182StableStrip';
      (q('.exerciseHead',card)||card.firstElementChild)?.insertAdjacentElement('beforebegin',strip);
    }
    strip.dataset.mediaSignature=sig;
    strip.classList.toggle('twoFrames',found.length===2);
    strip.classList.toggle('oneFrame',found.length===1);
    strip.replaceChildren();

    if(!found.length){
      const d=document.createElement('div');d.className='v184bNoExercisePhoto';
      d.textContent='Exercise photos pending';strip.appendChild(d);return;
    }

    for(const a of found){
      const fig=document.createElement('figure');
      const img=document.createElement('img');
      img.alt=`${name} ${a.role}`;img.title=a.attribution||'';img.loading='lazy';img.decoding='async';
      const cap=document.createElement('figcaption');cap.textContent=(a.role||'frame').toUpperCase();
      img.onerror=()=>{img.remove();const d=document.createElement('div');d.className='v182Missing';d.textContent='Photo unavailable';fig.insertBefore(d,cap)};
      fig.append(img,cap);strip.appendChild(fig);img.src=a.remote_url;
    }
  }

  function recipe(card,rows,nameSel='.recipeTop b,.recipeBody > b,.recipeBody b,b',cls='v183bRecipePhoto'){
    const name=q(nameSel,card)?.textContent?.trim();if(!name)return;
    const a=rowsFor(rows,'recipe',name).find(x=>x.role==='cover'&&x.remote_url);if(!a)return;
    q(':scope > .recipePlaceholder',card)?.classList.add('v182LegacySentinel');
    let img=q(`:scope > img.${cls}`,card);
    if(img?.dataset.src===a.remote_url)return;
    if(!img){img=document.createElement('img');img.className=cls;card.prepend(img)}
    img.dataset.src=a.remote_url;img.alt=name;img.title=a.attribution||'';img.loading='lazy';
    img.onload=()=>img.style.display='block';img.onerror=()=>img.style.display='none';img.src=a.remote_url;
  }

  function food(card,rows){
    const name=(q('.buyCheck b',card)||q('b',card))?.textContent?.trim();if(!name)return;
    const xs=rowsFor(rows,'food',name),a=xs.find(x=>x.role==='package'&&x.remote_url)||xs.find(x=>x.role==='grocery'&&x.remote_url);if(!a)return;
    let box=q('.v17ItemImage',card);if(!box){box=document.createElement('div');box.className='v17ItemImage';card.prepend(box)}
    if(box.dataset.src===a.remote_url)return;box.dataset.src=a.remote_url;box.replaceChildren();
    const img=document.createElement('img');img.alt=name;img.title=a.attribution||'';img.loading='lazy';
    img.onerror=()=>{img.remove();box.classList.add('v182ImageError')};box.appendChild(img);img.src=a.remote_url;
  }

  async function render(){
    if(busy)return;busy=true;
    try{
      const rows=await media();
      qa('.exerciseCard').forEach(c=>exercise(c,rows));
      qa('.recipeCard,.v15LibraryCard').forEach(c=>recipe(c,rows));
      qa('.weekMealCell:not(.empty)').forEach(c=>recipe(c,rows,'.weekMealName','v183bWeekMealPhoto'));
      qa('.readyMeal').forEach(c=>recipe(c,rows,'b','v183bReadyPhoto'));
      qa('.purchaseCard,.grocery,.v15FoodRow').forEach(c=>food(c,rows));
    }finally{busy=false}
  }

  let timer;
  new MutationObserver(muts=>{
    if(muts.every(m=>m.target.closest?.('.v182StableStrip')))return;
    clearTimeout(timer);timer=setTimeout(render,100);
  }).observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('load',()=>setTimeout(render,180));
  addEventListener('pageshow',()=>setTimeout(render,180));
})();
