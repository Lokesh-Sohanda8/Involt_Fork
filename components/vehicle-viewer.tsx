'use client';
import {useEffect,useRef,useState} from 'react';
import {RotateCcw,Plus,Minus} from 'lucide-react';
import type {Model} from '@/lib/models';
type API={update:(id:string,color:string)=>void;rotate:(v:boolean)=>void;view:(angle:string)=>void;zoom:(v:number)=>void;reset:()=>void};
type Status='loading'|'ready'|'error';
export default function VehicleViewer({model,color,autoRotate,angle,angleKey,onStatus}:{model:Model;color:string;autoRotate:boolean;angle:string;angleKey:number;onStatus?:(status:Status)=>void}){
 const host=useRef<HTMLDivElement>(null),api=useRef<API|null>(null);
 const latest=useRef({model,color,autoRotate,angle,angleKey});
 const[status,setStatus]=useState<Status>('loading');
 useEffect(()=>{latest.current={model,color,autoRotate,angle,angleKey};},[model,color,autoRotate,angle,angleKey]);
 useEffect(()=>{onStatus?.(status);},[status,onStatus]);
 useEffect(()=>{
  let cancelled=false;const disposers:Array<()=>void>=[];
  const dispose=()=>{while(disposers.length){try{disposers.pop()?.();}catch{/* Dispose remaining resources even after context loss. */}}};
  async function start(){
   try{
    const [THREE,{OrbitControls},{RoomEnvironment},{createScooter,disposeObject}]=await Promise.all([import('three'),import('three/addons/controls/OrbitControls.js'),import('three/addons/environments/RoomEnvironment.js'),import('@/lib/scooter')]);
    if(cancelled||!host.current)return;
    const element=host.current,canvas=document.createElement('canvas');
    const compact=window.matchMedia('(max-width: 760px)').matches;
    const lowMemory=((navigator as Navigator&{deviceMemory?:number}).deviceMemory??8)<=4;
    const mobileBudget=compact||lowMemory;
    // Detect unsupported devices before asking Three.js to initialise a renderer.
    const context=canvas.getContext('webgl2',{alpha:true,antialias:!mobileBudget,powerPreference:'low-power'});
    if(!context){setStatus('error');return;}
    const renderer=new THREE.WebGLRenderer({canvas,context,antialias:!mobileBudget,alpha:true,powerPreference:'low-power'});
    disposers.push(()=>{renderer.dispose();canvas.remove();});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobileBudget?1.2:1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    renderer.shadowMap.enabled=!mobileBudget;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;element.appendChild(canvas);
    const scene=new THREE.Scene();disposers.push(()=>disposeObject(scene));
    const camera=new THREE.PerspectiveCamera(36,1,.1,50),controls=new OrbitControls(camera,canvas);disposers.push(()=>controls.dispose());
    controls.target.set(0,1.08,0);controls.enableDamping=true;controls.dampingFactor=.09;controls.enablePan=false;controls.rotateSpeed=compact?.72:1;controls.zoomSpeed=compact?.7:1;controls.minDistance=2.8;controls.maxDistance=7;controls.minPolarAngle=.2;controls.maxPolarAngle=Math.PI/2+.09;controls.autoRotateSpeed=.8;controls.autoRotate=latest.current.autoRotate;
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();disposers.push(()=>env.dispose());
    scene.add(new THREE.HemisphereLight('#eeffe4','#58634b',2));
    const key=new THREE.DirectionalLight('#ffffff',4.2);key.position.set(-3,6,4);key.castShadow=!mobileBudget;key.shadow.mapSize.set(mobileBudget?512:1024,mobileBudget?512:1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;key.shadow.normalBias=.025;key.shadow.bias=-.0003;scene.add(key);disposers.push(()=>key.shadow.dispose());
    const fill=new THREE.DirectionalLight('#c5f63b',2.2);fill.position.set(2,3,-4);scene.add(fill);
    const floor=new THREE.Mesh(new THREE.CircleGeometry(2.15,mobileBudget?36:64),new THREE.MeshStandardMaterial({color:'#2f3928',roughness:1,metalness:.05}));floor.rotation.x=-Math.PI/2;floor.position.y=-.019;floor.receiveShadow=!mobileBudget;scene.add(floor);
    const ring=new THREE.Mesh(new THREE.RingGeometry(2.17,2.181,mobileBudget?48:96),new THREE.MeshBasicMaterial({color:'#829c58',side:THREE.DoubleSide,transparent:true,opacity:.45}));ring.rotation.x=-Math.PI/2;ring.position.y=-.018;scene.add(ring);
    let scooter=createScooter(latest.current.model.id,latest.current.color),currentId=latest.current.model.id;scene.add(scooter);renderer.shadowMap.needsUpdate=true;
    let active=true,frame=0,rendering=false,settle=0,lastTime=0;
    // One scheduled frame at a time. OrbitControls emits change inside update;
    // scheduling from that event must never create a second animation loop.
    function requestFrame(){if(active&&!document.hidden&&!cancelled&&!frame&&!rendering)frame=requestAnimationFrame(render);}
    function invalidate(){settle=12;requestFrame();}
    function render(time:number){
     frame=0;if(!active||document.hidden||cancelled)return;
     rendering=true;const delta=lastTime?Math.min((time-lastTime)/1000,.05):1/60;lastTime=time;
     const changed=controls.update(delta);renderer.render(scene,camera);rendering=false;
     if(controls.autoRotate||changed||settle-->0)requestFrame();
    }
    const pause=()=>{cancelAnimationFrame(frame);frame=0;lastTime=0;};disposers.push(pause);
    function home(){camera.position.set(-3.8,2.15,3.8);controls.target.set(0,1.08,0);invalidate();}
    function resize(){const w=element.clientWidth,h=element.clientHeight;if(!w||!h||cancelled)return;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w/h<.85?44:36;camera.updateProjectionMatrix();invalidate();}
    controls.addEventListener('change',invalidate);
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);disposers.push(()=>resizeObserver.disconnect());
    const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)invalidate();else pause();},{threshold:.02});observer.observe(element);disposers.push(()=>observer.disconnect());
    const visibility=()=>{if(document.hidden)pause();else invalidate();};document.addEventListener('visibilitychange',visibility);disposers.push(()=>document.removeEventListener('visibilitychange',visibility));
    const lost=(event:Event)=>{event.preventDefault();active=false;pause();setStatus('error');};canvas.addEventListener('webglcontextlost',lost);disposers.push(()=>canvas.removeEventListener('webglcontextlost',lost));
    api.current={
     update(id,newColor){if(id!==currentId){const next=createScooter(id,newColor);scene.remove(scooter);disposeObject(scooter);scooter=next;scene.add(scooter);currentId=id;renderer.shadowMap.needsUpdate=true;}else(scooter.userData.bodyMaterial as InstanceType<typeof THREE.MeshPhysicalMaterial>).color.set(newColor);invalidate();},
     rotate(value){controls.autoRotate=value;invalidate();},
     view(value){const distance=camera.position.distanceTo(controls.target),height=.35;const horizontal=Math.sqrt(Math.max(0,distance*distance-height*height));const positions:Record<string,[number,number,number]>={front:[-horizontal,1.43,0],side:[0,1.43,horizontal],rear:[horizontal,1.43,0]};camera.position.set(...(positions[value]??[-3.8,2.15,3.8]));invalidate();},
     zoom(value){const offset=camera.position.clone().sub(controls.target),distance=THREE.MathUtils.clamp(offset.length()*value,controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(offset.setLength(distance));invalidate();},reset:home
    };
    disposers.push(()=>{api.current=null;});
    const keyboard=(event:KeyboardEvent)=>{
     if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(event.key))return;event.preventDefault();
     if(event.key==='Home')api.current?.reset();else if(['+','=','-'].includes(event.key))api.current?.zoom(event.key==='-'?1.15:.85);
     else{const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(event.key==='ArrowLeft')spherical.theta-=.15;if(event.key==='ArrowRight')spherical.theta+=.15;if(event.key==='ArrowUp')spherical.phi-=.1;if(event.key==='ArrowDown')spherical.phi+=.1;spherical.phi=THREE.MathUtils.clamp(spherical.phi,controls.minPolarAngle,controls.maxPolarAngle);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));invalidate();}
    };
    element.addEventListener('keydown',keyboard);disposers.push(()=>element.removeEventListener('keydown',keyboard));
    home();resize();if(latest.current.angleKey)api.current.view(latest.current.angle);setStatus('ready');
   }catch{dispose();if(!cancelled)setStatus('error');}
  }
  void start();return()=>{cancelled=true;dispose();};
 },[]);
 useEffect(()=>{api.current?.update(model.id,color);},[model.id,color]);
 useEffect(()=>{api.current?.rotate(autoRotate);},[autoRotate]);
 useEffect(()=>{if(angleKey)api.current?.view(angle);},[angle,angleKey]);
 return <div className="viewer-area"><div className="viewer-word" aria-hidden="true">{model.name}</div><div ref={host} className="viewer-canvas" tabIndex={status==='ready'?0:-1} role="application" aria-label={'Interactive '+model.name+' 3D recreation. Drag to rotate. Use arrow keys to change angle, plus and minus to zoom, Home to reset.'}/><div className="viewer-label">INVOLT / 360° DESIGN EXPLORER</div>{status==='loading'&&<div className="viewer-status" role="status"><span className="loading-ring"/>Preparing your ride…</div>}{status==='error'&&<div className="viewer-status" role="status"><img src={model.image} width={model.imageWidth} height={model.imageHeight} alt={'Involt '+model.name}/><p>Showing the supplied reference photograph.<br/>To rotate the 3D model, use a browser with WebGL graphics enabled.</p><a className="text-link" href={'/models?model='+model.id}>View {model.name} specifications ↗</a></div>}{status==='ready'&&<><div className="viewer-tools"><button aria-label="Zoom in" onClick={()=>api.current?.zoom(.85)}><Plus size={18}/></button><button aria-label="Zoom out" onClick={()=>api.current?.zoom(1.15)}><Minus size={18}/></button><button aria-label="Reset camera" onClick={()=>api.current?.reset()}><RotateCcw size={17}/></button></div><span className="viewer-hint">Drag to rotate · Scroll or pinch to zoom</span></>}</div>;
}
