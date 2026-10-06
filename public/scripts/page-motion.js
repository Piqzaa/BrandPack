// Native scroll drives one timeline; no wheel interception or scroll library.
(() => {
    const experience=document.querySelector('[data-experience]');
    if(!experience) return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const chapters=[...document.querySelectorAll('[data-chapter]')];
    const closing=document.querySelector('.closing');
    let paused=reduced.matches,frame=null;
    const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
    const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
    const mix=(a,b,t)=>a.map((value,i)=>Math.round(value+(b[i]-value)*t));
    function update() {
        frame=null;
        const height=innerHeight,rects=chapters.map(chapter=>chapter.getBoundingClientRect());
        const closingRect=closing.getBoundingClientRect();
        const entry=smooth((height-rects[0].top)/(height*.85));
        let phase=clamp((height*.22-rects[0].top)/rects[0].height,0,2.7);
        const still=paused||reduced.matches;
        if(still) phase=Math.round(clamp(phase,0,2));
        const dark=smooth(phase/.85),day=smooth((phase-1.1)/1.05);
        const palettes={forma:[[244,238,226],[29,38,35],[217,237,188]],sora:[[228,235,250],[23,31,60],[218,229,255]],alto:[[233,239,222],[20,39,30],[224,239,170]]};
        const palette=palettes[experience.dataset.theme]||palettes.forma;
        const background=mix(mix(palette[0],palette[1],dark),palette[2],day);
        const takeover=smooth((phase-.4)/.55)*(1-smooth((phase-1.15)/.5));
        experience.style.setProperty('--world-takeover',takeover);
        experience.style.setProperty('--world-scale',still?1:1+takeover*.8);
        experience.style.setProperty('--world-turn',`${still?-9:-9+takeover*32}deg`);
        experience.style.setProperty('--grid-opacity',takeover*.7);
        experience.style.setProperty('--world-word-shift',`${still?0:-entry*100-phase*60}px`);
        const current=phase<.65?0:phase<1.7?1:2;
        experience.style.setProperty('--backdrop-dark',dark*(1-day));
        experience.style.setProperty('--backdrop-day',day);
        experience.style.setProperty('--backdrop-scale',still?1:1+dark*.12-day*.04);
        experience.style.setProperty('--backdrop-shift',`${still?0:-phase*18}px`);
        experience.style.setProperty('--scene-background',`rgb(${background.join(',')})`);
        const brightness=background.reduce((sum,value)=>sum+value,0)/3;
        experience.style.setProperty('--scene-ink',brightness<110?'#f0f2e7':'#202820');
        experience.style.setProperty('--scene-muted',brightness<110?'#e1e9dc':brightness<180?'#202820':'#53614e');
        experience.style.setProperty('--scene-line',phase>.42&&phase<1.62?'#718373':'#71837360');
        experience.style.setProperty('--preview-opacity',smooth((phase-1.6)/.45));
        document.querySelector('.client-preview').setAttribute('aria-hidden',String(phase<1.6));
        experience.style.setProperty('--preview-shift',`${still?0:(1-smooth((phase-1.6)/.45))*60}px`);
        experience.style.setProperty('--mobile-stage-top',`${488*(1-entry)+20*entry}px`);
        experience.classList.toggle('is-story',entry>.05);
        chapters.forEach((chapter,index)=>{
            chapter.classList.toggle('is-current',index===current);
            chapter.classList.toggle('is-arrived',rects[index].top<height*.94);
            chapter.style.setProperty('--chapter-top-clip',`${innerWidth<=800?clamp(height*.4+40-rects[index].top,0,rects[index].height):0}px`);
        });
        const labels=['YOUR ORIGINAL MASTERS','EVERY FILE, IN ITS PLACE','READY FOR THEIR EVERYDAY'];
        document.querySelector('[data-stage-label]').textContent=entry>.5?labels[current]:'THE FINISHED IDENTITY';
        document.querySelector('[data-stage-step]').textContent=entry>.5?`0${current+1} / ${['INPUT','REFINE','DELIVER'][current]}`:'00 / STUDIO';
        const closingProgress=clamp((height-closingRect.top)/(height+closingRect.height));
        closing.style.setProperty('--closing-turn',`${still?-12:-30+closingProgress*70}deg`);
        closing.style.setProperty('--closing-word-shift',`${still?0:(1-closingProgress)*38}px`);
        document.querySelectorAll('[data-reveal]').forEach(element=>{
            if(still||element.getBoundingClientRect().top<height*.94) element.classList.add('is-revealed');
        });
        window.dispatchEvent(new CustomEvent('brandpack:story',{detail:{phase,entry,background,still}}));
    }
    function schedule(){if(frame===null&&!document.hidden)frame=requestAnimationFrame(update);}
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    window.addEventListener('brandpack:motion-change',event=>{paused=event.detail.paused;schedule();});
    reduced.addEventListener('change',schedule);
    document.addEventListener('visibilitychange',schedule);
    window.addEventListener('pageshow',schedule);
    // The WebGL module requests the latest state after attaching its listener.
    window.addEventListener('brandpack:story-ready',schedule);
    window.addEventListener('brandpack:theme-change',schedule);
    document.documentElement.classList.add('page-motion-ready');
    update();
})();
