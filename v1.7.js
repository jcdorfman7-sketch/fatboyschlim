// FatBoySchlim v1.7 — Smart Training Coach + Visual Refresh
(function(){
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const title=s=>String(s||'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  const arr=x=>Array.isArray(x)?x:[];
  const pageMeta={Today:['DAILY','today'],Eat:['FUEL','eat'],Shop:['PLAN','shop'],Flex:['TRAIN','flex'],Progress:['TRACK','progress']};

  function activePage(){return qs('.navbtn.active')?.dataset.nav||'Today'}
  function fallbackExercise(ex){const m=String(ex?.primary_muscle||'').toLowerCase();if(/quad|ham|glute|calf|leg/.test(m))return './assets/exercise-legs.svg';if(/back|lat|bicep|rear/.test(m))return './assets/exercise-pull.svg';return './assets/exercise-push.svg'}
  function fallbackFood(f){const c=String(f?.category||'').toLowerCase(),n=String(f?.name||'').toLowerCase();if(/produce|vegetable|fruit/.test(c)||/(lettuce|spinach|broccoli|berry|banana|apple|cucumber|cabbage)/.test(n))return './assets/food-produce.svg';if(/dairy/.test(c)||/(yogurt|cheese|milk|cottage|quark)/.test(n))return './assets/food-dairy.svg';return './assets/food-protein.svg'}

  function decoratePage(){
    const p=activePage(),meta=pageMeta[p]||pageMeta.Today;
    document.body.dataset.fbsPage=meta[1];
    const hero=qs('.hero');
    if(hero&&!qs('.fbsWatermark',hero))hero.insertAdjacentHTML('afterbegin',`<div class="fbsWatermark" aria-hidden="true">FBS<span> / ${meta[0]}</span></div>`);
    qsa('.hero').forEach((h,i)=>h.classList.toggle('v17PrimaryHero',i===0));
  }

  let foodCache=null,exerciseCache=null;
  async function foods(){if(foodCache)return foodCache;const {data}=await db.from('foods').select('*');foodCache=data||[];return foodCache}
  async function exercises(){if(exerciseCache)return exerciseCache;const {data}=await db.from('exercise_library').select('*');exerciseCache=data||[];return exerciseCache}

  async function decorateImages(){
    // Recipe placeholders become intentional visual cards until exact/close photography is available.
    qsa('.recipePlaceholder').forEach(x=>{if(!qs('img',x))x.insertAdjacentHTML('afterbegin','<img class="v17FallbackArt" src="./assets/meal-default.svg" alt="Meal illustration">')});
    // Grocery rows/cards.
    const fs=await foods(),fm=new Map(fs.map(x=>[String(x.name||'').trim().toLowerCase(),x]));
    qsa('.purchaseCard,.grocery,.v15FoodRow').forEach(row=>{
      if(qs('.v17ItemImage',row))return;
      const name=(qs('.buyCheck b',row)||qs('b',row))?.textContent?.trim();if(!name)return;
      const f=fm.get(name.toLowerCase())||{};const src=f.image_url||f.package_image_url||fallbackFood(f);
      row.insertAdjacentHTML('afterbegin',`<div class="v17ItemImage"><img src="${esc(src)}" alt="${esc(f.image_alt||name)}"></div>`);
    });
    // Exercise cards.
    const es=await exercises(),em=new Map(es.map(x=>[String(x.name||'').trim().toLowerCase(),x]));
    qsa('.exerciseCard').forEach(card=>{
      if(qs('.v17ExerciseImage',card))return;
      const name=qs('h2',card)?.textContent?.trim();if(!name)return;const ex=em.get(name.toLowerCase())||{};
      const src=ex.image_url||ex.cover_image_url||fallbackExercise(ex);
      const head=qs('.exerciseHead',card)||card.firstElementChild;
      head?.insertAdjacentHTML('beforebegin',`<div class="v17ExerciseImage"><img src="${esc(src)}" alt="${esc(ex.image_alt||name)}"><span>${esc(ex.primary_muscle||'Training')}</span></div>`);
    });
  }

  async function prefMap(){const {data}=await db.from('exercise_preferences').select('*');const m={};(data||[]).forEach(x=>m[x.exercise_id]=x.preference);return m}
  async function excluded(){try{return await excludedExerciseIds()}catch{return new Set()}}
  function sameMovement(a,b){const am=String(a.movement_pattern||a.pattern||''),bm=String(b.movement_pattern||b.pattern||'');return am&&bm&&am===bm}
  function exScore(base,x,prefs,plan){
    let s=0;if(x.id===base.id)return 9999;
    s+=String(x.primary_muscle||'')===String(base.primary_muscle||'')?0:60;
    const bsec=arr(base.secondary_muscles),xsec=arr(x.secondary_muscles);if(bsec.length&&xsec.some(v=>bsec.includes(v)))s-=8;
    if(sameMovement(base,x))s-=16;
    if(String(x.equipment||'')===String(base.equipment||''))s-=8;
    if(Boolean(x.compound)===Boolean(base.compound))s-=5;
    if(prefs[x.id]==='favorite')s-=12;if(prefs[x.id]==='avoid')s+=1000;
    const eq=arr(plan?.equipment);if(eq.length&&x.equipment&&!eq.includes(x.equipment))s+=40;
    return s;
  }

  async function chooseExerciseSwap(p,sessionId,sessionExerciseId){
    const [{data:row},{data:lib},prefs,plan,exSet]=await Promise.all([
      db.from('workout_session_exercises').select('*,exercise_library(*)').eq('id',sessionExerciseId).single(),
      db.from('exercise_library').select('*').order('name'),prefMap(),activeTrainingPlan(),excluded()
    ]);
    if(!row?.exercise_library)return liveWorkoutView(p,sessionId);
    const base=row.exercise_library,cands=(lib||[]).filter(x=>!exSet.has(Number(x.id))&&prefs[x.id]!=='avoid').sort((a,b)=>exScore(base,a,prefs,plan)-exScore(base,b,prefs,plan)).slice(0,8);
    shell(`<div class="hero colorful"><span class="eyebrow">SMART EXERCISE SWAP</span><h1>Replace ${esc(base.name)}</h1><p>Ranked for the same muscle first, then movement pattern, equipment, fatigue profile and your preferences.</p></div><div class="card v17SwapOrigin"><div class="v17ExerciseImage"><img src="${esc(base.image_url||fallbackExercise(base))}" alt="${esc(base.image_alt||base.name)}"></div><div><span class="eyebrow">CURRENT</span><h2>${esc(base.name)}</h2><p>${esc(base.primary_muscle||'')} · ${esc(base.equipment||'')}</p></div></div><div class="v17SwapGrid">${cands.map(x=>`<div class="card v17SwapCard"><div class="v17ExerciseImage"><img src="${esc(x.image_url||fallbackExercise(x))}" alt="${esc(x.image_alt||x.name)}"><span>${esc(x.primary_muscle||'')}</span></div><h3>${esc(x.name)}</h3><p>${sameMovement(base,x)?'Same movement pattern · ':''}${String(x.equipment||'')===String(base.equipment||'')?'Same equipment · ':''}${prefs[x.id]==='favorite'?'Favorite · ':''}${esc(x.equipment||'')}</p><div class="v17SwapActions"><button data-v17swap="${x.id}">Just today</button><button class="secondary" data-v17always="${x.id}">Use from now on</button></div></div>`).join('')||'<div class="card"><p>No safe alternatives found.</p></div>'}</div><button id="v17SwapBack" class="secondary">Back to workout</button>`,p.sex,'Flex');
    const apply=async(id,always)=>{const repl=(lib||[]).find(x=>Number(x.id)===Number(id));if(!repl)return;await db.from('workout_session_exercises').update({exercise_id:Number(id),coaching_note:`Swapped from ${base.name}${always?' · saved as preferred replacement':''}`}).eq('id',sessionExerciseId);if(always){const s=await session();await db.from('exercise_substitutions').upsert({user_id:s.user.id,original_exercise_id:base.id,replacement_exercise_id:Number(id),active:true,updated_at:new Date().toISOString()},{onConflict:'user_id,original_exercise_id'})}liveWorkoutView(p,sessionId)};
    qsa('[data-v17swap]').forEach(b=>b.onclick=()=>apply(b.dataset.v17swap,false));qsa('[data-v17always]').forEach(b=>b.onclick=()=>apply(b.dataset.v17always,true));v17SwapBack.onclick=()=>liveWorkoutView(p,sessionId)
  }
  window.swapExerciseView=chooseExerciseSwap;

  // Apply saved substitutions whenever a new lifting session is created.
  if(typeof window.createWorkoutSession==='function'){
    const oldCreate=window.createWorkoutSession;
    window.createWorkoutSession=async function(plan,sched){const id=await oldCreate(plan,sched);const [{data:subs},{data:rows}]=await Promise.all([db.from('exercise_substitutions').select('*').eq('active',true),db.from('workout_session_exercises').select('*').eq('session_id',id)]);for(const r of rows||[]){const s=(subs||[]).find(x=>Number(x.original_exercise_id)===Number(r.exercise_id));if(s)await db.from('workout_session_exercises').update({exercise_id:s.replacement_exercise_id,coaching_note:'Preferred replacement applied automatically.'}).eq('id',r.id)}return id}
  }

  function injectAdaptPanel(sessionId){
    if(qs('#v17AdaptPanel'))return;const hero=qs('.hero');if(!hero)return;
    hero.insertAdjacentHTML('afterend',`<div class="v17FlowBand" id="v17AdaptPanel"><div><span class="eyebrow">ADAPT TODAY</span><h2>What kind of day is it?</h2><p>Change the session without abandoning the plan.</p></div><div class="v17AdaptButtons"><button data-v17adapt="normal">Normal</button><button class="secondary" data-v17adapt="short">⏱ Short on time</button><button class="secondary" data-v17adapt="low-energy">🔋 Low energy</button><button class="secondary" data-v17adapt="joint">🦴 Joint bothering me</button><button class="secondary" data-v17adapt="crowded">🏋️ Gym crowded</button></div><div id="v17AdaptNote" class="hint"></div></div>`);
    qsa('[data-v17adapt]').forEach(b=>b.onclick=async()=>{let mode=b.dataset.v17adapt,mins=null,note='';if(mode==='short'){mins=Number(prompt('How many minutes do you have?',35)||35);note=`Keep the highest-priority work. Accessories after roughly ${mins} minutes are optional today.`}if(mode==='low-energy')note='Keep clean reps, stay about 2 RIR, and feel free to drop one accessory set.';if(mode==='joint')note='Use Swap on any uncomfortable movement. Pain is a reason to change the exercise, not push through it.';if(mode==='crowded')note='Reorder freely and use Swap to choose equivalent movements with available equipment.';if(mode==='normal')note='Run the full prescription as planned.';await db.from('workout_sessions').update({adapt_mode:mode,adapt_minutes:mins}).eq('id',sessionId);v17AdaptNote.textContent=note;qsa('[data-v17adapt]').forEach(x=>x.classList.toggle('active',x===b));if(mode==='short'){const cards=qsa('.exerciseCard');const keep=Math.max(3,Math.min(cards.length,Math.round((mins||35)/10)));cards.forEach((c,i)=>{c.classList.toggle('v17OptionalExercise',i>=keep);if(i>=keep&&!qs('.v17OptionalTag',c))c.insertAdjacentHTML('afterbegin','<span class="v17OptionalTag">OPTIONAL TODAY</span>')})}if(mode==='joint'||mode==='crowded')qsa('[data-swap-ex]').forEach(x=>x.classList.add('v17Pulse'))})
  }

  if(typeof window.liveWorkoutView==='function'){
    const oldLive=window.liveWorkoutView;
    window.liveWorkoutView=async function(p,id){await oldLive(p,id);injectAdaptPanel(id);await decorateImages();decoratePage()}
  }

  // Exercise preferences on cards: favorite / don't suggest.
  async function addExercisePreferenceButtons(){
    const lib=await exercises(),map=new Map(lib.map(x=>[String(x.name||'').toLowerCase(),x]));
    qsa('.exerciseCard').forEach(card=>{if(qs('.v17ExercisePrefs',card))return;const name=qs('h2',card)?.textContent?.trim();const ex=map.get(String(name||'').toLowerCase());if(!ex)return;const host=qs('.workoutTools',card)||card;const d=document.createElement('div');d.className='v17ExercisePrefs';d.innerHTML=`<button class="tiny secondary" data-v17fav="${ex.id}">♡ Favorite</button><button class="tiny secondary" data-v17avoid="${ex.id}">Don’t suggest</button>`;host.appendChild(d);d.querySelector('[data-v17fav]').onclick=async()=>{const s=await session();await db.from('exercise_preferences').upsert({user_id:s.user.id,exercise_id:ex.id,preference:'favorite',updated_at:new Date().toISOString()},{onConflict:'user_id,exercise_id'});d.querySelector('[data-v17fav]').textContent='♥ Favorite'};d.querySelector('[data-v17avoid]').onclick=async()=>{const s=await session();await db.from('exercise_preferences').upsert({user_id:s.user.id,exercise_id:ex.id,preference:'avoid',updated_at:new Date().toISOString()},{onConflict:'user_id,exercise_id'});d.querySelector('[data-v17avoid]').textContent='Avoiding ✓'};
    })
  }

  // Decorate all page renders without rewriting every v1.5/v1.6 view.
  let timer=null;const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(async()=>{decoratePage();await decorateImages();await addExercisePreferenceButtons()},40)});observer.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',()=>setTimeout(()=>{decoratePage();decorateImages();addExercisePreferenceButtons()},100));
})();
