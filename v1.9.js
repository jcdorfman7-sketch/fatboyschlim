// FatBoySchlim v1.9.0 — performance + media runtime
// Replaces the old media renderer. No broad MutationObserver.
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const norm=s=>String(s||'').toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();

  const STATE={
    media:null,
    mediaLoadedAt:0,
    recipeCache:null,
    recipeLoadedAt:0,
    pending:false,
    visibleObserver:null
  };

  function assetURL(row){
    if(!row)return '';
    if(row.local_path){
      const p=String(row.local_path).replace(/^\/+/,'');
      return p.startsWith('assets/')?`./${p}`:`./assets/media/${p}`;
    }
    return row.remote_url||'';
  }

  function mediaKey(type,name){return `${type}|${norm(name)}`}

  async function loadMedia(force=false){
    if(!force && STATE.media && Date.now()-STATE.mediaLoadedAt<15*60*1000) return STATE.media;
    const cacheKey='fbs19-media-v1';
    if(!force){
      try{
        const c=JSON.parse(sessionStorage.getItem(cacheKey)||'null');
        if(c?.rows && Date.now()-c.t<15*60*1000){
          STATE.media=buildMediaIndex(c.rows);
          STATE.mediaLoadedAt=c.t;
          return STATE.media;
        }
      }catch(_){}
    }
    const {data,error}=await db.from('media_assets')
      .select('entity_type,entity_name,role,sequence_order,local_path,remote_url,attribution,quality')
      .eq('approved',true).eq('status','sourced');
    if(error){console.error('FBS 1.9 media:',error);return new Map()}
    const rows=data||[];
    try{sessionStorage.setItem(cacheKey,JSON.stringify({t:Date.now(),rows}))}catch(_){}
    STATE.media=buildMediaIndex(rows);
    STATE.mediaLoadedAt=Date.now();
    return STATE.media;
  }

  function buildMediaIndex(rows){
    const m=new Map();
    for(const row of rows){
      const k=mediaKey(row.entity_type,row.entity_name);
      if(!m.has(k))m.set(k,[]);
      m.get(k).push(row);
    }
    for(const xs of m.values())xs.sort((a,b)=>(a.sequence_order||0)-(b.sequence_order||0));
    return m;
  }

  function rowsFor(index,type,name){return index.get(mediaKey(type,name))||[]}

  function watchImage(img){
    img.loading='lazy';
    img.decoding='async';
    img.fetchPriority='low';
  }

  function setImg(img,row,alt){
    const src=assetURL(row);
    if(!src)return false;
    if(img.dataset.fbsSrc===src)return true;
    img.dataset.fbsSrc=src;
    img.alt=alt||'';
    img.title=row?.attribution||'';
    watchImage(img);
    img.onerror=()=>{img.classList.add('fbs19ImageError');img.style.display='none'};
    img.onload=()=>{img.classList.remove('fbs19ImageError');img.style.display='block'};
    img.src=src;
    return true;
  }

  function renderExercise(card,index){
    const name=q('h2',card)?.textContent?.trim();
    if(!name)return;
    q('.v17ExerciseImage',card)?.classList.add('v182LegacySentinel');
    const rows=rowsFor(index,'exercise',name).filter(r=>assetURL(r));
    let strip=q('.v18ExerciseStrip',card);
    if(!strip){
      strip=document.createElement('div');
      strip.className='v18ExerciseStrip v182StableStrip fbs19ExerciseStrip';
      (q('.exerciseHead',card)||card.firstElementChild)?.insertAdjacentElement('beforebegin',strip);
    }
    const sig=rows.map(r=>`${r.role}:${assetURL(r)}`).join('|')||'none';
    if(strip.dataset.sig===sig)return;
    strip.dataset.sig=sig;
    strip.replaceChildren();
    strip.classList.toggle('oneFrame',rows.length===1);
    strip.classList.toggle('twoFrames',rows.length===2);

    if(!rows.length){
      const d=document.createElement('div');
      d.className='fbs19NoMedia';
      d.textContent='Exercise photos pending';
      strip.appendChild(d);
      return;
    }
    for(const row of rows){
      const fig=document.createElement('figure');
      const img=document.createElement('img');
      const cap=document.createElement('figcaption');
      cap.textContent=String(row.role||'frame').toUpperCase();
      setImg(img,row,`${name} ${row.role||''}`.trim());
      fig.append(img,cap);
      strip.appendChild(fig);
    }
  }

  function renderRecipe(card,index,nameSelector='.recipeTop b,.recipeBody > b,.recipeBody b,b',cls='fbs19RecipePhoto'){
    const name=q(nameSelector,card)?.textContent?.trim();
    if(!name)return;
    const row=rowsFor(index,'recipe',name).find(r=>r.role==='cover'&&assetURL(r));
    if(!row)return;
    q(':scope > .recipePlaceholder',card)?.classList.add('v182LegacySentinel');
    let img=q(`:scope > img.${cls}`,card);
    if(!img){img=document.createElement('img');img.className=cls;card.prepend(img)}
    setImg(img,row,name);
  }

  function renderFood(card,index){
    const name=(q('.buyCheck b',card)||q('b',card))?.textContent?.trim();
    if(!name)return;
    const xs=rowsFor(index,'food',name);
    const row=xs.find(r=>r.role==='package'&&assetURL(r))||xs.find(r=>r.role==='grocery'&&assetURL(r));
    if(!row)return;
    let box=q('.v17ItemImage',card);
    if(!box){box=document.createElement('div');box.className='v17ItemImage';card.prepend(box)}
    let img=q('img',box);
    if(!img){box.replaceChildren();img=document.createElement('img');box.appendChild(img)}
    setImg(img,row,name);
  }

  async function refreshMedia(){
    if(STATE.pending)return;
    STATE.pending=true;
    try{
      const index=await loadMedia();
      // Only touch elements on the current screen.
      qa('.exerciseCard').forEach(c=>renderExercise(c,index));
      qa('.recipeCard,.v15LibraryCard').forEach(c=>renderRecipe(c,index));
      qa('.weekMealCell:not(.empty)').forEach(c=>renderRecipe(c,index,'.weekMealName','fbs19WeekMealPhoto'));
      qa('.readyMeal').forEach(c=>renderRecipe(c,index,'b','fbs19ReadyPhoto'));
      qa('.purchaseCard,.grocery,.v15FoodRow').forEach(c=>renderFood(c,index));
      qa('.recipeHero').forEach(hero=>{
        const name=q('h1',hero)?.textContent?.trim();
        const row=rowsFor(index,'recipe',name).find(r=>r.role==='cover'&&assetURL(r));
        if(!row)return;
        const old=q(':scope > .recipeHeroPhoto',hero);
        if(old && old.tagName!=='IMG')old.classList.add('v182LegacySentinel');
        let img=q(':scope > img.fbs19HeroPhoto',hero);
        if(!img){img=document.createElement('img');img.className='recipeHeroPhoto fbs19HeroPhoto';hero.prepend(img)}
        setImg(img,row,name);
      });
    }finally{STATE.pending=false}
  }

  // Route-aware refresh. shell() is used by all major screens, so this avoids
  // the old always-on DOM MutationObserver.
  function hookShell(){
    if(typeof window.shell!=='function'||window.shell.__fbs19)return;
    const base=window.shell;
    window.shell=function(...args){
      const out=base.apply(this,args);
      requestAnimationFrame(()=>requestAnimationFrame(refreshMedia));
      return out;
    };
    window.shell.__fbs19=true;
  }

  // Cache the recipe catalog for five minutes. Many screens call allRecipes().
  function hookRecipes(){
    if(typeof window.allRecipes!=='function'||window.allRecipes.__fbs19)return;
    const base=window.allRecipes;
    window.allRecipes=async function(force=false){
      if(!force && STATE.recipeCache && Date.now()-STATE.recipeLoadedAt<5*60*1000) return STATE.recipeCache;
      const rows=await base.apply(this,[]);
      STATE.recipeCache=rows||[];
      STATE.recipeLoadedAt=Date.now();
      return STATE.recipeCache;
    };
    window.allRecipes.__fbs19=true;
  }

  // Faster recipe browser: 24 cards at a time instead of rendering 100+ DOM
  // cards and images in one pass.
  function installRecipeBrowser(){
    if(typeof window.recipeBrowser!=='function')return;
    window.recipeBrowser=async function(p){
      const all=(await window.allRecipes()).filter(r=>recipeAllowed(r,p));
      shell(`<div class="hero colorful"><span class="eyebrow">RECIPE LIBRARY</span><h1>${all.length} meals</h1><p>Search, filter and load only what you need.</p></div>
      <div class="card"><div class="v15FilterGrid">
      <input id="recipeSearch" placeholder="Search recipes or ingredients">
      <select id="v15Meal"><option>All</option><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select>
      <select id="v15Type"><option value="all">All styles</option><option value="macro-builder">Macro builders</option><option value="budget">Budget meals</option><option value="quick">Quick</option><option value="high-protein">High protein</option></select>
      <select id="v15Time"><option value="999">Any time</option><option value="15">≤15 min</option><option value="30">≤30 min</option><option value="45">≤45 min</option></select>
      </div></div>
      <div id="browserResults" class="v15LibraryGrid"></div>
      <div class="fbs19Pager"><button id="fbsPrev" class="secondary">Previous</button><span id="fbsPage"></span><button id="fbsNext" class="secondary">Next</button></div>
      <button id="browserBack" class="secondary">Back to Eat</button>`,p.sex,'Eat');

      let page=0;
      const pageSize=24;
      let filtered=[];

      const filterNow=()=>{
        const term=(recipeSearch.value||'').toLowerCase();
        const meal=v15Meal.value,type=v15Type.value,maxT=Number(v15Time.value);
        filtered=all.filter(r=>
          (meal==='All'||(r.meal_types||[]).includes(meal)) &&
          (type==='all'||(r.tags||[]).includes(type)) &&
          (Number(r.prep_minutes||0)+Number(r.cook_minutes||0)<=maxT) &&
          (!term||r.name.toLowerCase().includes(term)||(r.tags||[]).join(' ').toLowerCase().includes(term)||(r.recipe_ingredients||[]).some(i=>i.foods?.name?.toLowerCase().includes(term)))
        );
        page=0;draw();
      };

      const draw=()=>{
        const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
        page=Math.max(0,Math.min(page,pages-1));
        const start=page*pageSize;
        const xs=filtered.slice(start,start+pageSize);
        browserResults.innerHTML=xs.map(r=>{
          const m=recipeMacros(r),tags=(r.tags||[]).filter(x=>['macro-builder','budget','quick','high-protein','keto','vegetarian'].includes(x)).slice(0,3);
          return `<div class="card v15LibraryCard ${tags.includes('macro-builder')?'v15Archetype':''}">
          ${recipeVisual(r)}
          <div class="recipeBody"><b>${r.name}</b>
          <div class="v15BadgeRow">${tags.map(x=>`<span class="v15Badge">${title(x)}</span>`).join('')}</div>
          <small>${compactMacro(m)}</small><p>${r.description||''}</p>
          <button data-recipe="${r.id}">View recipe</button></div></div>`;
        }).join('')||'<div class="emptyState"><b>No matches.</b></div>';
        browserResults.querySelectorAll('[data-recipe]').forEach(b=>b.onclick=()=>showRecipe(p,b.dataset.recipe,'Eat'));
        fbsPage.textContent=`Page ${page+1} of ${pages} • ${filtered.length} meals`;
        fbsPrev.disabled=page===0;fbsNext.disabled=page>=pages-1;
        requestAnimationFrame(refreshMedia);
      };

      recipeSearch.oninput=()=>{clearTimeout(recipeSearch._t);recipeSearch._t=setTimeout(filterNow,120)};
      [v15Meal,v15Type,v15Time].forEach(x=>x.onchange=filterNow);
      fbsPrev.onclick=()=>{page--;draw();window.scrollTo({top:0,behavior:'smooth'})};
      fbsNext.onclick=()=>{page++;draw();window.scrollTo({top:0,behavior:'smooth'})};
      browserBack.onclick=()=>eatView(p);
      filterNow();
    };
  }

  function boot19(){
    hookShell();
    hookRecipes();
    installRecipeBrowser();
    requestAnimationFrame(refreshMedia);
  }

  window.FBS19={refreshMedia,loadMedia,clearCaches(){
    STATE.media=null;STATE.recipeCache=null;STATE.mediaLoadedAt=0;STATE.recipeLoadedAt=0;
    try{sessionStorage.removeItem('fbs19-media-v1')}catch(_){}
  }};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot19,0));
  else setTimeout(boot19,0);
})();
