import * as THREE from '../vendor/three/three.module.min.js';

// A visual study of a brand handoff. These are authored examples, never uploads.
const themes = {
    forma: { name:'forma', color:'#f34f2e', ink:'#263f32', paper:'#f3efdc', secondary:'#cec4e2', mark:'flower' },
    sora: { name:'sora', color:'#2949e9', ink:'#243feb', paper:'#e9eeff', secondary:'#f3ffab', mark:'orbit' },
    alto: { name:'alto', color:'#467454', ink:'#21402b', paper:'#f1efda', secondary:'#dbef9a', mark:'peak' },
};
const hero = document.querySelector('[data-studio]');
const canvas = document.querySelector('[data-brand-canvas]');
const experience = document.querySelector('[data-experience]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let paused = reduced.matches;
const toggle = document.querySelector('[data-motion-toggle]');
function updatePauseLabel() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    const icon=document.createElement('span');
    icon.setAttribute('aria-hidden','true');
    icon.textContent=paused?'▷':'Ⅱ';
    toggle.append(icon);
    window.dispatchEvent(new CustomEvent('brandpack:motion-change',{detail:{paused}}));
}
updatePauseLabel();

function init() {
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setClearColor('#e7e9e1',0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#e7e9e1',22,42);
    const camera = new THREE.PerspectiveCamera(34,1,.1,60);
    camera.position.set(0,0,12);

    // A self-contained studio light environment; no external HDR or 3D assets.
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024; envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');
    envCtx.fillStyle='#9b9d96'; envCtx.fillRect(0,0,1024,512);
    envCtx.fillStyle='#ffffff'; envCtx.fillRect(20,30,190,290); envCtx.fillRect(550,10,90,300);
    envCtx.fillStyle='#e8e9df'; envCtx.fillRect(270,90,150,190);
    envCtx.fillStyle='#353932'; envCtx.fillRect(720,180,180,300);
    const environmentTexture = new THREE.CanvasTexture(envCanvas);
    environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
    environmentTexture.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromEquirectangular(environmentTexture);
    scene.environment = environment.texture;
    scene.environmentIntensity = .8;
    environmentTexture.dispose(); pmrem.dispose();

    const ambient=new THREE.HemisphereLight('#ffffff','#b6bfaa',1.7); scene.add(ambient);
    const key = new THREE.DirectionalLight('#fff8ed',3.2);
    key.position.set(-3,7,8); key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);
    Object.assign(key.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.1,far:25});
    key.shadow.bias=-.0003; key.shadow.normalBias=.015;
    scene.add(key);
    const fill = new THREE.DirectionalLight('#edf4ff',1.5);
    fill.position.set(6,2,-4); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.16}));
    floor.rotation.x=-Math.PI/2; floor.position.y=-3.35; floor.receiveShadow=true; scene.add(floor);

    const pack = new THREE.Group(); scene.add(pack);
    const art = document.querySelector('[data-studio-art]');
    const items=[];
    const dynamicMaterials=[];
    const textures=[];
    function roundedShape(w,h,r=.12) {
        const s=new THREE.Shape(), x=-w/2, y=-h/2;
        s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
        s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
        s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
        s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y); return s;
    }
    function addObject(mesh,position,rotation,spread) {
        mesh.position.set(...position); mesh.rotation.set(...rotation);
        pack.add(mesh); items.push({mesh,position:new THREE.Vector3(...position),rotation:new THREE.Euler(...rotation),spread:new THREE.Vector3(...spread),closedPosition:new THREE.Vector3(0,-.18,-.55+items.length*.075)});
        return mesh;
    }
    function flatTextureGeometry(w,h) {
        const geometry=new THREE.ShapeGeometry(roundedShape(w,h));
        const p=geometry.attributes.position, uv=geometry.attributes.uv;
        for(let i=0;i<p.count;i++) uv.setXY(i,(p.getX(i)+w/2)/w,(p.getY(i)+h/2)/h);
        return geometry;
    }
    function makeSheet(w,h,type,position,rotation,spread) {
        const group=new THREE.Group();
        const body=new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(w,h),{depth:.04,bevelEnabled:true,bevelSize:.035,bevelThickness:.018,bevelSegments:3,steps:1}),new THREE.MeshStandardMaterial({color:'#e4e4d7',roughness:.6}));
        body.castShadow=true; body.receiveShadow=true; group.add(body);
        const textureCanvas=document.createElement('canvas'); textureCanvas.width=1024; textureCanvas.height=Math.round(1024*h/w);
        const texture=new THREE.CanvasTexture(textureCanvas); texture.colorSpace=THREE.SRGBColorSpace; texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
        const material=new THREE.MeshStandardMaterial({map:texture,roughness:.75,metalness:0});
        const face=new THREE.Mesh(flatTextureGeometry(w,h),material); face.position.z=.061; face.receiveShadow=true; group.add(face);
        textures.push({canvas:textureCanvas,texture,type});
        return addObject(group,position,rotation,spread);
    }

    const folderMaterial=new THREE.MeshPhysicalMaterial({color:themes.forma.color,roughness:.28,metalness:.12,clearcoat:.5,clearcoatRoughness:.2});
    dynamicMaterials.push(folderMaterial);
    const folderShape = new THREE.Shape();
    folderShape.moveTo(-2,-1.35); folderShape.lineTo(2,-1.35); folderShape.quadraticCurveTo(2.12,-1.35,2.12,-1.22);
    folderShape.lineTo(2.12,1.15); folderShape.quadraticCurveTo(2.12,1.3,1.97,1.3);
    folderShape.lineTo(-.65,1.3); folderShape.lineTo(-.9,1.62); folderShape.lineTo(-1.8,1.62);
    folderShape.quadraticCurveTo(-2.1,1.62,-2.1,1.4); folderShape.lineTo(-2.1,-1.2); folderShape.quadraticCurveTo(-2.1,-1.35,-2,-1.35);
    const folder = new THREE.Mesh(new THREE.ExtrudeGeometry(folderShape,{depth:.15,bevelEnabled:true,bevelSize:.055,bevelThickness:.06,bevelSegments:5,steps:1}),folderMaterial);
    folder.castShadow=true; folder.receiveShadow=true;
    addObject(folder,[0,-.4,-.8],[-.12,.02,-.1],[.2,-.1,-.25]);

    makeSheet(2.5,3.35,'poster',[.65,.7,-.5],[.04,-.07,-.18],[.65,.4,-.4]);
    makeSheet(3.75,2.65,'primary',[-.15,.45,.04],[.03,.04,.06],[-.45,.3,.25]);
    makeSheet(2.1,2.1,'symbol',[-1.35,-.35,.55],[.1,-.1,.14],[-.75,-.25,.8]);
    makeSheet(3.1,.76,'palette',[.45,-1.28,.72],[.02,.03,-.08],[.45,-.5,.4]);
    makeSheet(1.28,1.64,'file',[1.7,.08,.68],[.08,-.35,-.22],[1.05,.15,.3]);

    // A chrome ribbon makes the identity a tangible sculpture, not a flat mockup.
    const chrome=new THREE.MeshPhysicalMaterial({color:'#f2f2e9',metalness:1,roughness:.17,clearcoat:1,envMapIntensity:1.8});
    const ribbon=new THREE.Mesh(new THREE.TorusKnotGeometry(.6,.19,180,20,2,3),chrome);
    ribbon.castShadow=true; ribbon.receiveShadow=true;
    addObject(ribbon,[-1.45,1.45,1.08],[.3,.5,.2],[-.9,.65,.3]);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.045,12,72),chrome); ring.castShadow=true;
    addObject(ring,[1.9,1.45,.8],[.5,-.3,.2],[.9,.6,.5]);

    function mark(ctx,name,x,y,size) {
        ctx.save(); ctx.translate(x,y);
        if(name==='flower') {
            ctx.rotate(-.15);
            for(const [px,py] of [[-.23,-.23],[.23,-.23],[-.23,.23],[.23,.23]]) {
                ctx.beginPath(); ctx.ellipse(px*size,py*size,size*.22,size*.27,px*py>0?-.5:.5,0,Math.PI*2); ctx.fill();
            }
        } else if(name==='orbit') {
            ctx.lineWidth=size*.12; ctx.strokeStyle=ctx.fillStyle;
            ctx.beginPath(); ctx.ellipse(0,0,size*.45,size*.25,-.55,0,Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.arc(0,0,size*.13,0,Math.PI*2); ctx.fill();
        } else {
            ctx.beginPath(); ctx.moveTo(-size*.5,size*.36);ctx.lineTo(0,-size*.44);ctx.lineTo(size*.5,size*.36);ctx.lineTo(size*.12,size*.36);ctx.lineTo(0,size*.12);ctx.lineTo(-size*.12,size*.36);ctx.closePath();ctx.fill();
        }
        ctx.restore();
    }
    function paint(theme) {
        textures.forEach(({canvas:c,texture,type}) => {
            const ctx=c.getContext('2d'), w=c.width,h=c.height;
            ctx.fillStyle=type==='poster'?theme.secondary:type==='symbol'?theme.ink:theme.paper;
            ctx.fillRect(0,0,w,h);
            ctx.fillStyle=type==='symbol'?theme.paper:theme.ink;
            const pad=w*.07;
            ctx.font=`500 ${Math.round(w*.019)}px Arial`; ctx.fillText('IDENTITY SYSTEM',pad,pad);
            ctx.textAlign='right'; ctx.fillText('001 / 2026',w-pad,pad); ctx.textAlign='left';
            if(type==='primary') {
                mark(ctx,theme.mark,w*.19,h*.5,w*.2);
                ctx.font=`600 ${Math.round(w*.19)}px Arial`;ctx.fillText(theme.name,w*.33,h*.59);
                ctx.font=`500 ${Math.round(w*.019)}px Arial`;ctx.fillText('INDEPENDENT BY DESIGN.',pad,h-pad);
                ctx.textAlign='right';ctx.fillText('PRIMARY LOGO',w-pad,h-pad);ctx.textAlign='left';
            } else if(type==='poster') {
                mark(ctx,theme.mark,w*.5,h*.42,w*.58);
                ctx.font=`600 ${Math.round(w*.23)}px Arial`;ctx.textAlign='center';ctx.fillText(theme.name,w*.5,h*.76);ctx.textAlign='left';
                ctx.font=`500 ${Math.round(w*.025)}px Arial`;ctx.fillText('GOOD THINGS TAKE SHAPE.',pad,h-pad);
            } else if(type==='symbol') {
                mark(ctx,theme.mark,w*.5,h*.47,w*.63);
                ctx.font=`500 ${Math.round(w*.027)}px Arial`;ctx.fillText('THE MARK / '+theme.name.toUpperCase(),pad,h-pad);
            } else if(type==='palette') {
                const colors=[theme.ink,theme.color,theme.secondary,theme.paper];
                colors.forEach((color,i)=>{ctx.fillStyle=color;ctx.fillRect(pad+i*w*.21,h*.28,w*.17,h*.4);});
                ctx.fillStyle=theme.ink;ctx.font=`500 ${Math.round(w*.023)}px Arial`;ctx.fillText('A CONSIDERED PALETTE.',pad,h*.87);
            } else {
                ctx.font=`600 ${Math.round(w*.13)}px Arial`;ctx.fillText('SVG',pad,h*.2);
                mark(ctx,theme.mark,w*.5,h*.5,w*.48);
                ctx.font=`500 ${Math.round(w*.044)}px Arial`;ctx.fillText(theme.name+'_primary.svg',pad,h*.83);
                ctx.font=`500 ${Math.round(w*.033)}px Arial`;ctx.fillText('THE RIGHT FILE.',pad,h*.91);
            }
            texture.needsUpdate=true;
        });
        dynamicMaterials.forEach(material=>material.color.set(theme.color));
        experience.style.setProperty('--accent',theme.color);
        experience.dataset.theme=theme.name;
        document.querySelector('[data-world-word]').textContent=theme.name;
        window.dispatchEvent(new CustomEvent('brandpack:theme-change'));
        document.querySelector('[data-preview-brand]').textContent=theme.name;
        document.querySelector('[data-preview-file]').textContent=theme.name+'_primary.svg';
        document.querySelector('.preview-flower svg').style.display=theme.mark==='flower'?'block':'none';
        document.querySelector('[data-preview-symbol]').textContent=theme.mark==='flower'?'':theme.mark==='orbit'?'◎':'△';
        document.querySelector('[data-theme-name]').textContent=theme.name.toUpperCase();
    }
    paint(themes.forma);

    let mobile=false, targetX=0, targetY=0, dragX=0, dragY=0, storyPhase=0, storyEntry=0;
    let visible=true, frame=null, last=performance.now(), time=0, entrance=paused?1:0;
    let pointer=null, assembled=false, assemblyProgress=0;
    const assemblyToggle=document.querySelector('[data-assembly-toggle]');
    const cursor=document.querySelector('.scene-cursor');
    const organizedPositions=[ [0,-.5,-.8],[.25,.6,-.45],[-.5,.45,.15],[1,.55,.5],[.1,-1.3,.8],[1.7,-.8,.4],[-1.8,1.8,.4],[2,1.5,.3] ].map(position=>new THREE.Vector3(...position));
    const backgroundColor=new THREE.Color('#e7e9e1');
    const ease=value=>{const t=THREE.MathUtils.clamp(value,0,1);return t*t*(3-2*t);};
    window.addEventListener('brandpack:story',event=>{
        storyPhase=event.detail.phase; storyEntry=event.detail.entry;
        const rgb=event.detail.background;
        backgroundColor.set(`rgb(${rgb.join(',')})`);
        scene.fog.color.copy(backgroundColor);
        const darkness=ease(storyPhase/.85)*(1-ease((storyPhase-1.1)/1.05));
        ambient.intensity=1.7-darkness*.65;
        key.intensity=3.2+darkness*1.2;
        fill.intensity=1.5+darkness;
        requestDraw();
    });
    const framingBounds=new THREE.Box3();
    function frameMobilePack() {
        // Fit the rotated world bounds, including their depth, inside both axes.
        // Recompute after every pose change so a full turn stays in the stage.
        pack.updateMatrixWorld(true);
        framingBounds.setFromObject(pack);
        const vertical=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
        const horizontal=vertical*camera.aspect;
        let distance=0;
        for(const x of [framingBounds.min.x,framingBounds.max.x])
            for(const y of [framingBounds.min.y,framingBounds.max.y])
                for(const z of [framingBounds.min.z,framingBounds.max.z]) {
                    distance=Math.max(distance,Math.abs(x)/horizontal+z,Math.abs(y)/vertical+z);
                }
        camera.position.z=Math.max(6,distance*1.14);
    }
    function resize() {
        const rect=art.getBoundingClientRect();
        renderer.setSize(rect.width,rect.height,false);
        camera.aspect=rect.width/rect.height; mobile=hero.clientWidth<=800;
        if(!mobile) camera.position.z=13.5;
        camera.updateProjectionMatrix();
        requestDraw();
    }
    function requestDraw() {
        if(frame===null && visible && !document.hidden) frame=requestAnimationFrame(render);
    }
    function render(now) {
        frame=null;
        if(!visible || document.hidden) return;
        const dt=Math.min((now-last)/1000,.05); last=now;
        if(!paused) {time+=dt;entrance=Math.min(1,entrance+dt*.75);}
        else entrance=1;
        const intro=1-Math.pow(1-entrance,3);
        const organize=ease(storyPhase);
        const deliver=ease((storyPhase-1.15)/.75);
        const unfold=intro*(.55+storyEntry*.25);
        if(paused) assemblyProgress=assembled?1:deliver;
        assemblyProgress=THREE.MathUtils.lerp(assemblyProgress,assembled?1:deliver,.065);
        const idle=Math.sin(time*.55)*.045;
        const baseScale=mobile?.7:1;
        // Camera push-in peaks during REFINE, then opens out for the client page.
        const closeup=organize*(1-deliver);
        const takeover=ease((storyPhase-.4)/.55)*(1-ease((storyPhase-1.15)/.5));
        canvas.style.opacity=1-takeover;
        pack.scale.setScalar(baseScale*(1+closeup*.22+takeover*.35-deliver*.45));
        pack.position.set(mobile?0:2.05+closeup*.35+deliver*1.25,mobile?0:.05+idle-deliver*1.7,0);
        if(!mobile) camera.position.z=13.5-closeup*1.8+deliver*.8;
        const rotationX=-.13+dragY*(1-storyEntry*.85)+targetY*.035+organize*.15;
        const rotationY=-.26+dragX*(1-storyEntry*.85)+targetX*.07+idle+organize*.65-deliver*.6;
        pack.rotation.x=paused?rotationX:THREE.MathUtils.lerp(pack.rotation.x,rotationX,.08);
        pack.rotation.y=paused?rotationY:THREE.MathUtils.lerp(pack.rotation.y,rotationY,.08);
        pack.rotation.z=-.13+Math.sin(time*.32)*.015;
        items.forEach((item,i)=>{
            item.mesh.position.copy(item.position).addScaledVector(item.spread,unfold);
            item.mesh.position.lerp(organizedPositions[i],organize);
            item.mesh.rotation.x=THREE.MathUtils.lerp(item.rotation.x,0,organize);
            item.mesh.rotation.y=THREE.MathUtils.lerp(item.rotation.y,0,organize);
            item.mesh.rotation.z=THREE.MathUtils.lerp(item.rotation.z+unfold*(i%2===0?.03:-.035),-.08,organize);
            item.mesh.position.y+=Math.sin(time*.65+i)*.04;
            if(i>0 && i<6) {
                item.mesh.position.lerp(item.closedPosition,assemblyProgress);
                item.mesh.rotation.x=THREE.MathUtils.lerp(item.rotation.x,0,assemblyProgress);
                item.mesh.rotation.y=THREE.MathUtils.lerp(item.rotation.y,0,assemblyProgress);
                item.mesh.rotation.z=THREE.MathUtils.lerp(item.mesh.rotation.z,-.1,assemblyProgress);
            }
            if(i>=6) item.mesh.scale.setScalar((1-assemblyProgress*.99)*(1-organize*.6));
        });
        ribbon.rotation.y=.5+time*.16;
        ribbon.rotation.x=.3+time*.08;
        if(mobile) frameMobilePack();
        renderer.render(scene,camera);
        hero.classList.add('scene-ready'); experience.classList.add('scene-ready');
        // Stop the animation when paused, offscreen or in a background tab.
        const settling=Math.abs(pack.rotation.y-rotationY)>.001 || Math.abs(pack.rotation.x-rotationX)>.001 || Math.abs(assemblyProgress-(assembled?1:deliver))>.001;
        if(!paused || settling) requestDraw();
    }
    canvas.addEventListener('pointerdown',(event)=>{
        pointer={id:event.pointerId,x:event.clientX,y:event.clientY,dx:dragX,dy:dragY};
        canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove',(event)=>{
        const rect=art.getBoundingClientRect();
        if(finePointer.matches && !reduced.matches && event.clientX>rect.width*.45) {
            cursor.style.left=`${event.clientX-rect.left-32}px`;cursor.style.top=`${event.clientY-rect.top-32}px`;cursor.style.opacity='1';
        } else cursor.style.opacity='0';
        if(pointer && pointer.id===event.pointerId) {
            dragX=pointer.dx+(event.clientX-pointer.x)*.006;
            dragY=THREE.MathUtils.clamp(pointer.dy+(event.clientY-pointer.y)*.003,-.4,.4);
        } else if(!reduced.matches) {
            targetX=(event.clientX-rect.left)/rect.width-.5;
            targetY=(event.clientY-rect.top)/rect.height-.5;
        }
        requestDraw();
    });
    function release(event) { if(pointer?.id===event.pointerId) pointer=null; }
    canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
    canvas.addEventListener('pointerleave',()=>{cursor.style.opacity='0';targetX=0;targetY=0;requestDraw();});
    document.querySelectorAll('.identity-option[data-theme]').forEach(button=>button.addEventListener('click',()=>{
        paint(themes[button.dataset.theme]);
        document.querySelectorAll('.identity-option[data-theme]').forEach(option=>{
            const active=option===button;option.classList.toggle('is-active',active);option.setAttribute('aria-pressed',String(active));
        });
        requestDraw();
    }));
    toggle.addEventListener('click',()=>{paused=!paused;updatePauseLabel();last=performance.now();requestDraw();});
    assemblyToggle.addEventListener('click',()=>{
        assembled=!assembled;
        assemblyToggle.setAttribute('aria-pressed',String(assembled));
        assemblyToggle.textContent=assembled?'Unpack the identity ↗':'Assemble the pack ↙';
        if(reduced.matches) assemblyProgress=assembled?1:0;
        requestDraw();
    });
    reduced.addEventListener('change',()=>{paused=reduced.matches;updatePauseLabel();last=performance.now();requestDraw();});
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(art);resizeObserver.observe(hero);
    const intersectionObserver=new IntersectionObserver(([entry])=>{
        visible=entry.isIntersecting;
        if(visible) {last=performance.now();requestDraw();}
        else if(frame!==null) {cancelAnimationFrame(frame);frame=null;}
    });intersectionObserver.observe(experience);
    document.addEventListener('visibilitychange',()=>{last=performance.now();requestDraw();});
    canvas.addEventListener('webglcontextlost',(event)=>{
        event.preventDefault();hero.classList.remove('scene-ready');experience.classList.remove('scene-ready');visible=false;
        if(frame!==null) cancelAnimationFrame(frame);frame=null;
    });
    window.addEventListener('pageshow',(event)=>{
        if(event.persisted) {last=performance.now();requestDraw();}
    });
    window.addEventListener('pagehide',(event)=>{
        if(frame!==null) cancelAnimationFrame(frame);
        frame=null;
        if(event.persisted) return;
        resizeObserver.disconnect();intersectionObserver.disconnect();
        scene.traverse(object=>{object.geometry?.dispose(); if(object.material) { const materials=Array.isArray(object.material)?object.material:[object.material]; materials.forEach(material=>material.dispose()); }});
        textures.forEach(({texture})=>texture.dispose());environment.dispose();renderer.dispose();
    });
    resize();
    window.dispatchEvent(new CustomEvent('brandpack:story-ready'));
}
try { init(); } catch(error) {
    // The page and CTA remain usable when WebGL is unavailable.
    hero.classList.add('scene-fallback');
    document.querySelector('.art-caption').textContent='Example identity · Static preview';
    toggle.hidden=true;
    document.querySelector('.identity-switch').hidden=true;
    document.querySelector('[data-assembly-toggle]').hidden=true;
    console.warn('BrandPack: static artwork fallback.',error.message);
}
