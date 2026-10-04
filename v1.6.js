// FatBoySchlim v1.6 — engine repair + Flex unlock
(function(){
  const v16Title=s=>String(s||'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  const v16Arr=x=>Array.isArray(x)?x:[];

  // ---------- Grocery package repair ----------
  function v16SafePackage(q,u,food){
    let qty=Number(q||0),unit=String(u||food?.purchase_unit||'g').toLowerCase();
    const n=String(food?.name||'').toLowerCase();
    const tooSmall=(unit==='g'&&qty<25)||(unit==='kg'&&qty<.05)||(unit==='oz'&&qty<1)||(unit==='lb'&&qty<.25)||(unit==='ml'&&qty<25)||(unit==='each'&&qty<1);
    if(!qty||tooSmall){
      if(unit==='lb') qty=1;
      else if(unit==='kg') qty=.5;
      else if(unit==='oz') qty=16;
      else if(unit==='ml') qty=500;
      else if(unit==='each') qty=n.includes('egg')?10:1;
      else qty=(/(chicken|beef|pork|turkey|fish|salmon|sausage)/.test(n)?500:250);
    }
    return {qty,unit};
  }
  window.unitToGramsV12=function(q,u,food){
    const safe=v16SafePackage(q,u,food),qty=safe.qty,unit=safe.unit,gpu=Number(food?.grams_per_purchase_unit||1);
    if(unit==='kg')return qty*1000;
    if(['oz','ounce','ounces'].includes(unit))return qty*28.3495;
    if(['lb','lbs','pound','pounds'].includes(unit))return qty*453.592;
    if(['ml','milliliter','milliliters'].includes(unit))return qty*gpu;
    if(['each','count','ct'].includes(unit))return qty*gpu;
    return qty;
  };
  window.gramsToNeedDisplayV12=function(g,food){
    const grams=Math.max(0,Number(g||0)),u=String(food?.purchase_unit||'g').toLowerCase(),gpu=Math.max(.0001,Number(food?.grams_per_purchase_unit||1));
    if(u==='each')return `${Math.ceil(grams/gpu)} each`;
    if(u==='ml')return `${Math.ceil(grams/gpu)} ml`;
    return `${Math.ceil(grams)} g`;
  };
  async function v16RepairGroceryUI(){
    document.querySelectorAll('[data-purchase-row]').forEach(row=>{
      const id=row.dataset.purchaseRow,pack=document.querySelector(`[data-pack="${id}"]`),unitEl=document.querySelector(`[data-packunit="${id}"]`);
      if(!pack||!unitEl)return;
      const raw=Number(pack.value||0),unit=unitEl.value,foodName=row.querySelector('.buyCheck b')?.textContent||'',safe=v16SafePackage(raw,unit,{name:foodName});
      if(Math.abs(raw-safe.qty)>.0001){pack.value=safe.qty;pack.dispatchEvent(new Event('input',{bubbles:true}));const note=document.createElement('div');note.className='v16PkgWarn';note.textContent=`Package baseline repaired to ${safe.qty} ${safe.unit}; fractional store packages are never recommended.`;row.appendChild(note)}
    });
  }
  if(typeof window.shopView==='function'){
    const oldShop=window.shopView;
    window.shopView=async function(p,tab='plan'){await oldShop(p,tab);if(tab==='grocery')await v16RepairGroceryUI()};
  }

  // ---------- PPL A–F ----------
  const oldSplit=window.splitRotation;
  window.splitRotation=function(type){
    if(type!=='ppl')return oldSplit?oldSplit(type):[];
    return ['Push A','Pull A','Legs A','Push B','Pull B','Legs B','Push C','Pull C','Legs C','Push D','Pull D','Legs D','Push E','Pull E','Legs E','Push F','Pull F','Legs F'];
  };
  const oldTemplates=window.trainingTemplates;
  window.trainingTemplates=function(){
    const t=oldTemplates?oldTemplates():{};
    return {...t,
      'Push C':[['Barbell Bench Press',4,6,8],['Incline Dumbbell Press',3,8,12],['Cable Fly',3,12,15],['Dumbbell Lateral Raise',4,12,20],['Overhead Cable Triceps Extension',3,10,15],['Cable Triceps Pressdown',2,12,20]],
      'Push D':[['Chest Press Machine',4,10,15],['Machine Shoulder Press',3,10,15],['Pec Deck',4,12,20],['Cable Lateral Raise',4,15,25],['Skull Crusher',3,10,15],['Cable Triceps Pressdown',3,12,20]],
      'Push E':[['Incline Dumbbell Press',4,6,10],['Chest Press Machine',3,8,12],['Machine Shoulder Press',3,8,12],['Cable Fly',3,12,15],['Dumbbell Lateral Raise',3,15,20],['Overhead Cable Triceps Extension',4,10,15]],
      'Push F':[['Barbell Bench Press',3,8,10],['Incline Dumbbell Press',3,10,12],['Pec Deck',3,12,20],['Cable Lateral Raise',5,15,25],['Skull Crusher',3,8,12],['Cable Triceps Pressdown',3,15,20]],
      'Pull C':[['Chest Supported Row',4,6,10],['Neutral Grip Pulldown',4,8,12],['Seated Cable Row',3,10,15],['Reverse Pec Deck',3,15,20],['Barbell Curl',4,8,12],['Cable Curl',3,12,15]],
      'Pull D':[['Lat Pulldown',4,10,15],['Straight Arm Pulldown',3,12,20],['Chest Supported Row',3,10,15],['Face Pull',4,15,20],['Incline Dumbbell Curl',3,10,15],['Hammer Curl',3,12,15]],
      'Pull E':[['Barbell Row',4,6,8],['Seated Cable Row',4,8,12],['Neutral Grip Pulldown',3,8,12],['Reverse Pec Deck',3,12,20],['Barbell Curl',3,6,10],['Hammer Curl',4,10,15]],
      'Pull F':[['Lat Pulldown',3,8,12],['Chest Supported Row',3,8,12],['Straight Arm Pulldown',3,12,15],['Face Pull',3,15,20],['Incline Dumbbell Curl',4,10,15],['Cable Curl',4,12,20]],
      'Legs C':[['Back Squat',4,6,8],['Bulgarian Split Squat',4,8,12],['Leg Press',3,10,15],['Leg Extension',4,12,20],['Seated Leg Curl',3,10,15],['Standing Calf Raise',5,10,20]],
      'Legs D':[['Romanian Deadlift',4,8,10],['Hip Thrust',4,8,12],['Lying Leg Curl',4,10,15],['Hack Squat',3,10,15],['Leg Extension',2,15,20],['Seated Calf Raise',5,12,20]],
      'Legs E':[['Hack Squat',4,6,10],['Leg Press',4,10,15],['Bulgarian Split Squat',3,10,12],['Seated Leg Curl',4,10,15],['Leg Extension',3,15,20],['Standing Calf Raise',4,15,25]],
      'Legs F':[['Romanian Deadlift',3,6,10],['Back Squat',3,8,10],['Hip Thrust',3,10,15],['Lying Leg Curl',3,12,20],['Leg Extension',3,12,20],['Seated Calf Raise',6,12,20]]
    };
  };

  function v16RotationFamily(key){return String(key||'').split(' ')[0]}
  function v16AltKeys(key){const f=v16RotationFamily(key);return ['A','B','C','D','E','F'].map(x=>`${f} ${x}`)}
  function v16PreviewHTML(key){const t=window.trainingTemplates?.()[key]||[];return `<div class="v16WorkoutPreview">${t.map(x=>`<div class="exerciseLine"><span><b>${x[0]}</b></span><span>${x[1]} × ${x[2]===x[3]?x[2]:`${x[2]}–${x[3]}`}</span></div>`).join('')||'<p class="muted">No template found.</p>'}</div>`}

  // ---------- Secondary / 2-a-day sessions ----------
  async function v16Secondary(date){const {data}=await db.from('secondary_sessions').select('*').eq('session_date',date).order('created_at');return data||[]}
  function v16SecondaryIcon(t){return ({cardio:'🏃',core:'🧱',yoga:'🧘',mobility:'🤸',conditioning:'⚡',walk:'🚶',sport:'🏀',video:'▶️',custom:'➕'})[t]||'➕'}
  async function v16SecondaryEditor(p,date,row=null){
    const r=row||{session_type:'cardio',title:'',duration_min:30,effort:'moderate',notes:'',video_url:''};
    shell(`<div class="hero colorful"><span class="eyebrow">SECOND SESSION • ${dayLabel(date)}</span><h1>${row?'Edit':'Add'} 2-a-day session</h1><p>Keep this simple when you're following a video: time + effort is enough.</p></div><div class="card"><div class="v16TypePills">${['cardio','core','yoga','mobility','conditioning','walk','sport','video','custom'].map(x=>`<button class="small secondary" data-v16type="${x}">${v16SecondaryIcon(x)} ${v16Title(x)}</button>`).join('')}</div></div><div class="card v16SecondGrid"><label>Session type<select id="v16Type">${['cardio','core','yoga','mobility','conditioning','walk','sport','video','custom'].map(x=>`<option value="${x}" ${r.session_type===x?'selected':''}>${v16Title(x)}</option>`).join('')}</select></label><label>Duration (minutes)<input id="v16Duration" type="number" min="1" max="300" value="${r.duration_min||30}"></label><label class="wide">Title / video name<input id="v16SecondTitle" value="${r.title||''}" placeholder="e.g. 20 min Yoga for Hips"></label><label>Effort<select id="v16Effort"><option value="easy" ${r.effort==='easy'?'selected':''}>Easy</option><option value="moderate" ${r.effort==='moderate'?'selected':''}>Moderate</option><option value="hard" ${r.effort==='hard'?'selected':''}>Hard</option></select></label><label>Avg HR (optional)<input id="v16Hr" type="number" value="${r.avg_hr||''}"></label><label>Distance (optional)<input id="v16Distance" type="number" step=".01" value="${r.distance||''}"></label><label>Calories (optional)<input id="v16Calories" type="number" value="${r.calories||''}"></label><label class="wide">Video / routine URL<input id="v16Url" value="${r.video_url||''}" placeholder="Optional"></label><label class="wide">Notes<textarea id="v16Notes">${r.notes||''}</textarea></label></div><button id="v16SaveSecond">Save secondary session</button><button id="v16CancelSecond" class="secondary">Cancel</button><p id="v16SecondMsg"></p>`,p.sex,'Flex');
    document.querySelectorAll('[data-v16type]').forEach(b=>b.onclick=()=>{v16Type.value=b.dataset.v16type});
    v16SaveSecond.onclick=async()=>{const s=await session(),payload={user_id:s.user.id,session_date:date,session_type:v16Type.value,title:v16SecondTitle.value||v16Title(v16Type.value),duration_min:Number(v16Duration.value||0),effort:v16Effort.value,avg_hr:v16Hr.value?Number(v16Hr.value):null,distance:v16Distance.value?Number(v16Distance.value):null,calories:v16Calories.value?Number(v16Calories.value):null,video_url:v16Url.value||null,notes:v16Notes.value||null,updated_at:new Date().toISOString()};const q=row?db.from('secondary_sessions').update(payload).eq('id',row.id):db.from('secondary_sessions').insert(payload);const {error}=await q;if(error)v16SecondMsg.textContent=error.message;else v16DayView(p,date)};
    v16CancelSecond.onclick=()=>v16DayView(p,date)
  }

  async function v16DayView(p,date){
    const plan=await activeTrainingPlan();if(!plan)return trainingSetupView(p);const ws=weekStart(),schedule=await ensureTrainingWeek(plan,ws),sc=schedule.find(x=>x.scheduled_date===date),{data:sessions}=await db.from('workout_sessions').select('*').eq('session_date',date).order('created_at'),seconds=await v16Secondary(date),primary=(sessions||[]).find(x=>x.schedule_id===sc?.id)||null,key=sc?.rotation_key||null;
    shell(`<div class="hero colorful v16DayHero"><span class="eyebrow">FLEX DAY • ${dayLabel(date)}</span><h1>${key||'Recovery / open day'}</h1><p>${key?'Open, preview, swap or start this workout on any day.':'Add a secondary session, mobility, cardio or leave it as recovery.'}</p></div>${key?`<div class="card"><div class="cardhead"><div><span class="eyebrow">PRIMARY SESSION</span><h2>${key}</h2></div><span class="workoutState ${(primary?.completed_at?'complete':primary?'started':'planned').toLowerCase()}">${primary?.completed_at?'Complete':primary?'Started':'Planned'}</span></div>${v16PreviewHTML(key)}<div class="v16DayActions"><button id="v16StartPrimary">${primary?.completed_at?'View completed':primary?'Continue workout':'Start workout'}</button><button id="v16Surprise" class="secondary">🎲 Surprise me</button></div></div><div class="card"><h2>Alternate ${v16RotationFamily(key)} days</h2><p class="hint">A–F are real variations with different emphasis. Pick any one for this date without changing the rest of the rotation.</p><div class="v16AltGrid">${v16AltKeys(key).map(x=>`<button class="secondary ${x===key?'active':''}" data-v16alt="${x}">${x}</button>`).join('')}</div></div>`:`<div class="card"><h2>No primary lift scheduled</h2><p class="muted">Use this as recovery or add cardio, core, yoga, mobility or a follow-along video.</p></div>`}<div class="card"><div class="cardhead"><div><span class="eyebrow">SECOND SESSION</span><h2>2-a-day / extra work</h2></div><button id="v16AddSecond" class="small secondary">+ Add</button></div>${seconds.length?seconds.map(x=>`<div class="v16SessionRow"><div><b>${v16SecondaryIcon(x.session_type)} ${x.title||v16Title(x.session_type)}</b><div class="v16SessionMeta"><span>${x.duration_min} min</span><span>${v16Title(x.effort)}</span>${x.avg_hr?`<span>${x.avg_hr} bpm</span>`:''}${x.distance?`<span>${x.distance} distance</span>`:''}</div></div><div class="v16DayActions"><button class="tiny secondary" data-v16editsecond="${x.id}">Edit</button><button class="tiny secondary" data-v16donesecond="${x.id}">${x.completed_at?'✓ Done':'Mark done'}</button></div></div>`).join(''):'<p class="muted">Nothing extra planned. Time-only logging is perfectly fine for yoga/core/cardio videos.</p>'}</div><button id="v16BackFlex" class="secondary">Back to week</button>`,p.sex,'Flex');
    if(key){v16StartPrimary.onclick=async()=>{let id=primary?.id;if(!id)id=await createWorkoutSession(plan,sc);liveWorkoutView(p,id)};document.querySelectorAll('[data-v16alt]').forEach(b=>b.onclick=async()=>{await db.from('training_schedule').update({rotation_key:b.dataset.v16alt,status:'planned'}).eq('id',sc.id);v16DayView(p,date)});v16Surprise.onclick=async()=>{const alts=v16AltKeys(key).filter(x=>x!==key),pick=alts[Math.floor(Math.random()*alts.length)];await db.from('training_schedule').update({rotation_key:pick,status:'planned'}).eq('id',sc.id);v16DayView(p,date)}}
    v16AddSecond.onclick=()=>v16SecondaryEditor(p,date);document.querySelectorAll('[data-v16editsecond]').forEach(b=>{b.onclick=()=>v16SecondaryEditor(p,date,seconds.find(x=>String(x.id)===String(b.dataset.v16editsecond)))});document.querySelectorAll('[data-v16donesecond]').forEach(b=>b.onclick=async()=>{const x=seconds.find(z=>String(z.id)===String(b.dataset.v16donesecond));await db.from('secondary_sessions').update({completed_at:x.completed_at?null:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',x.id);v16DayView(p,date)});v16BackFlex.onclick=()=>flexView(p)
  }

  // Unlock every day in Flex.
  window.flexView=async function(p){
    const plan=await activeTrainingPlan();if(!plan)return trainingSetupView(p);const ws=weekStart(),schedule=await ensureTrainingWeek(plan,ws),{data:sessions}=await db.from('workout_sessions').select('*').gte('session_date',ws).lte('session_date',addDaysISO(ws,6)).order('session_date'),{data:seconds}=await db.from('secondary_sessions').select('*').gte('session_date',ws).lte('session_date',addDaysISO(ws,6)).order('session_date');const completed=schedule.filter(x=>(sessions||[]).some(s=>s.schedule_id===x.id&&s.completed_at)).length,rate=schedule.length?Math.round(completed/schedule.length*100):0;const days=[0,1,2,3,4,5,6].map(i=>addDaysISO(ws,i));const weekHtml=days.map(date=>{const x=schedule.find(z=>z.scheduled_date===date),ses=x?(sessions||[]).find(s=>s.schedule_id===x.id):null,sec=(seconds||[]).filter(s=>s.session_date===date),state=ses?.completed_at?'Complete':ses?'Started':x?.status==='skipped'?'Skipped':x?'Planned':'Open';return `<div class="workoutDay v16Day ${date===today()?'todayWorkout':''}" data-v16day="${date}"><div><span>${dayLabel(date)}</span><b>${x?.rotation_key||'Recovery / Open'}</b><small>${x?rotationBlurb(x.rotation_key):'Cardio, core, yoga, mobility or full recovery'}</small>${sec.length?`<div>${sec.map(s=>`<span class="v16SecondaryBadge">${v16SecondaryIcon(s.session_type)} ${s.duration_min}m ${s.title||v16Title(s.session_type)}</span>`).join('')}</div>`:''}</div><div class="workoutState ${state.toLowerCase()}">${state}</div><button class="small secondary" data-v16open="${date}">Open day</button></div>`}).join('');
    shell(`<div class="hero colorful"><span class="eyebrow">FLEX • ${String(plan.split_type).toUpperCase()} • v1.6</span><h1>${goalLabel(plan.primary_goal)} training</h1><p>Every day is unlocked. PPL now rotates through A–F, and any day can hold a second cardio/core/yoga/video session.</p></div><div class="card"><div class="cardhead"><h2>This week</h2><button id="editTraining" class="small secondary">Edit plan</button></div><div class="adherenceBar"><span style="width:${rate}%"></span></div><p class="hint">${completed}/${schedule.length} primary workouts complete · ${rate}% adherence</p>${weekHtml}</div><div class="card"><h2>2-a-day rule</h2><p class="muted">The second session is intentionally lightweight to log. Duration + effort is enough. Add optional heart rate, distance, calories, notes or a video link only when useful.</p></div>`,p.sex,'Flex');editTraining.onclick=()=>trainingSetupView(p,plan);document.querySelectorAll('[data-v16open]').forEach(b=>b.onclick=()=>v16DayView(p,b.dataset.v16open));document.querySelectorAll('[data-v16day]').forEach(row=>row.onclick=e=>{if(e.target.closest('button'))return;v16DayView(p,row.dataset.v16day)})
  };

  // Keep navigation pointed at the newest Flex implementation.
  if(typeof window.navigate==='function'){
    const oldNav=window.navigate;
    window.navigate=async function(x){if(x==='Flex'){const p=await profile();return flexView(p)}return oldNav(x)};
  }
})();
