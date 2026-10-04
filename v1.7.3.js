// FatBoySchlim v1.7.3 — honest missing-image state
(function(){
  function cleanPlaceholders(){
    document.querySelectorAll('.v17FallbackArt').forEach(x=>x.remove());
    document.querySelectorAll('.recipePlaceholder').forEach(x=>{
      const plate=x.querySelector('.plate'); if(plate) plate.remove();
      let small=x.querySelector('small');
      if(!small){small=document.createElement('small');x.appendChild(small)}
      small.textContent='Photo coming soon';
    });
    document.querySelectorAll('.v17ExerciseImage img').forEach(img=>{
      if(/assets\/exercise-(push|pull|legs)\.svg/i.test(img.getAttribute('src')||'')){
        const box=img.closest('.v17ExerciseImage');
        img.remove();
        if(box && !box.querySelector('.v173Missing')){
          const m=document.createElement('div');
          m.className='v173Missing';
          m.textContent='Exercise photos coming soon';
          Object.assign(m.style,{height:'100%',display:'grid',placeItems:'center',opacity:'.72',fontSize:'12px',fontWeight:'800'});
          box.prepend(m);
        }
      }
    });
    document.querySelectorAll('.v17ItemImage img').forEach(img=>{
      if(/assets\/food-(protein|produce|dairy)\.svg/i.test(img.getAttribute('src')||'')){
        const box=img.closest('.v17ItemImage');
        img.remove();
        if(box){box.textContent='';box.style.opacity='.35';}
      }
    });
  }
  let t;
  const obs=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(cleanPlaceholders,30)});
  obs.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',()=>setTimeout(cleanPlaceholders,80));
})();
