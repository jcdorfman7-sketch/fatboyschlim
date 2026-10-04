// FatBoySchlim v1.8 — real-image renderer from media_assets
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let cache=null,last=0;
  async function media(){
    if(cache && Date.now()-last<60000)return cache;
    const {data,error}=await db.from('media_assets').select('*').eq('approved',true).eq('status','sourced').order('sequence_order');
    if(error){console.warn('FBS media:',error.message);return []}
    cache=data||[];last=Date.now();return cache;
  }
  function byName(rows,type,name){
    const n=String(name||'').trim().toLowerCase();
    return rows.filter(x=>x.entity_type===type&&String(x.entity_name||'').trim().toLowerCase()===n);
  }
  function credits(a){return a?.attribution||[a?.creator,a?.provider,a?.license_code].filter(Boolean).join(' · ')}
  async function paintRecipes(rows){
    qa('.recipeCard').forEach(card=>{
      const name=q('.recipeBody b,.recipeTop b,b',card)?.textContent?.trim();if(!name)return;
      const a=byName(rows,'recipe',name).find(x=>x.role==='cover');if(!a?.remote_url)return;
      q('.recipePlaceholder',card)?.remove();
      let img=q('img.recipePhoto',card);
      if(!img){img=document.createElement('img');img.className='recipePhoto v18RealImage';card.prepend(img)}
      img.src=a.remote_url;img.alt=name;img.title=credits(a);
    });
    const hero=q('.recipeHero h1')?.textContent?.trim();
    if(hero){const a=byName(rows,'recipe',hero).find(x=>x.role==='cover');const box=q('.recipeHero');
      if(a?.remote_url&&box){q('.recipePlaceholder',box)?.remove();let img=q('img.recipeHeroPhoto',box);if(!img){img=document.createElement('img');img.className='recipeHeroPhoto v18RealImage';box.prepend(img)}img.src=a.remote_url;img.alt=hero;img.title=credits(a)}
    }
  }
  async function paintFoods(rows){
    qa('.purchaseCard,.grocery,.v15FoodRow').forEach(card=>{
      const name=(q('.buyCheck b',card)||q('b',card))?.textContent?.trim();if(!name)return;
      const xs=byName(rows,'food',name),a=xs.find(x=>x.role==='package')||xs.find(x=>x.role==='grocery');if(!a?.remote_url)return;
      let box=q('.v17ItemImage',card);if(!box){box=document.createElement('div');box.className='v17ItemImage';card.prepend(box)}
      box.innerHTML=`<img class="v18RealImage" src="${esc(a.remote_url)}" alt="${esc(name)}" title="${esc(credits(a))}">`;
      box.style.opacity='1';
    });
  }
  async function paintExercises(rows){
    qa('.exerciseCard').forEach(card=>{
      const name=q('h2',card)?.textContent?.trim();if(!name)return;
      const xs=byName(rows,'exercise',name).sort((a,b)=>(a.sequence_order||0)-(b.sequence_order||0));if(!xs.length)return;
      q('.v17ExerciseImage',card)?.remove();
      let strip=q('.v18ExerciseStrip',card);if(!strip){strip=document.createElement('div');strip.className='v18ExerciseStrip';(q('.exerciseHead',card)||card.firstElementChild)?.insertAdjacentElement('beforebegin',strip)}
      const labels={start:'START',mid:'MID',end:'END'};
      strip.innerHTML=['start','mid','end'].map(role=>{const a=xs.find(x=>x.role===role);return a?.remote_url?
        `<figure><img src="${esc(a.remote_url)}" alt="${esc(name+' '+role)}" title="${esc(credits(a))}"><figcaption>${labels[role]}</figcaption></figure>`:
        `<figure class="missing"><div>Photo pending</div><figcaption>${labels[role]}</figcaption></figure>`}).join('');
    });
  }
  async function paint(){
    const rows=await media();
    await paintRecipes(rows);await paintFoods(rows);await paintExercises(rows);
  }
  let t;const obs=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(paint,70)});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',()=>setTimeout(paint,150));
})();
