import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export function createScooter(id:string,color:string) {
 const root=new THREE.Group();
 const body=new THREE.MeshPhysicalMaterial({color,metalness:.34,roughness:.27,clearcoat:1,clearcoatRoughness:.2});
 const dark=new THREE.MeshStandardMaterial({color:'#171c1a',roughness:.69,metalness:.2});
 const rubber=new THREE.MeshStandardMaterial({color:'#131515',roughness:.95});
 const seat=new THREE.MeshStandardMaterial({color:'#242623',roughness:.89});
 const silver=new THREE.MeshStandardMaterial({color:'#afb7b5',metalness:.88,roughness:.25});
 const rim=new THREE.MeshStandardMaterial({color:'#555f61',metalness:.8,roughness:.31});
 const white=new THREE.MeshStandardMaterial({color:'#ecfce8',emissive:'#d7f5d2',emissiveIntensity:.5,roughness:.22,metalness:.3});
 const red=new THREE.MeshStandardMaterial({color:'#a40014',emissive:'#ef1d2e',emissiveIntensity:.38,roughness:.2});
 const amber=new THREE.MeshStandardMaterial({color:'#f29212',emissive:'#ff7900',emissiveIntensity:.4});
 const glass=new THREE.MeshPhysicalMaterial({color:'#cfe7e5',emissive:'#dff9f4',emissiveIntensity:.65,roughness:.08,metalness:.15,transmission:.18,transparent:true,opacity:.92});
 const accent=new THREE.MeshStandardMaterial({color:id==='activex'?'#ee7b18':id==='zeno'?'#b7d329':id==='plusex'?'#5c9e33':'#e9ede3',roughness:.28,metalness:.24});
 const vibe=id==='vibe',urban=id==='urbanx',activeX=id==='activex',eon=id==='eon',plus=id==='plusex',minimal=id==='zeno';
 function add(geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;}
 function box(w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material=body,r=.04){return add(new RoundedBoxGeometry(w,h,d,2,r),mat,x,y,z);}
 function ellipsoid(rx:number,ry:number,rz:number,x:number,y:number,z:number,mat:THREE.Material=body){const m=add(new THREE.SphereGeometry(1,24,16),mat,x,y,z);m.scale.set(rx,ry,rz);return m;}
 function cylinder(r1:number,r2:number,len:number,x:number,y:number,z:number,mat:THREE.Material=dark,axis='z',segments=32){const m=add(new THREE.CylinderGeometry(r1,r2,len,segments),mat,x,y,z);if(axis==='z')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.z=Math.PI/2;return m;}
 function rod(a:number[],b:number[],radius:number,mat:THREE.Material=dark){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b);const v=q.clone().sub(p);const m=add(new THREE.CylinderGeometry(radius,radius,v.length(),12),mat,...p.clone().add(q).multiplyScalar(.5).toArray() as [number,number,number]);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
 function profile(points:number[][],depth:number,mat:THREE.Material=body,bevel=.045){const s=new THREE.Shape();s.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)s.lineTo(points[i][0],points[i][1]);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3,steps:1,curveSegments:12});geo.translate(0,0,-depth/2);return add(geo,mat,0,0,0);}
 // Wheels, machined hubs, discs and five split spokes.
 for(const x of [-.92,.89]){
  const tyre=add(new THREE.TorusGeometry(.262,.075,12,48),rubber,x,.335,0);tyre.scale.z=1.15;
  cylinder(.211,.211,.12,x,.335,0,rim);cylinder(.18,.18,.135,x,.335,0,dark);
  for(const side of [-1,1]){
   cylinder(.064,.064,.023,x,.335,side*.091,silver);
   add(new THREE.TorusGeometry(.191,.012,8,40),silver,x,.335,side*.068);
   for(let k=0;k<5;k++){const a=k*Math.PI*2/5;rod([x+.06*Math.cos(a),.335+.06*Math.sin(a),side*.075],[x+.177*Math.cos(a+.23),.335+.177*Math.sin(a+.23),side*.075],.014,silver);}
   cylinder(.136,.136,.012,x,.335,side*.114,silver);
   cylinder(.079,.079,.015,x,.335,side*.124,dark);
   for(let k=0;k<12;k++){const a=k*Math.PI/6; cylinder(.008,.008,.016,x+.11*Math.cos(a),.335+.11*Math.sin(a),side*.125,dark,'z',6);}
   box(.07,.105,.05,x+.107,.37,side*.14,dark,.016);
  }
  const fender=add(new THREE.TorusGeometry(.358,.051,8,36,Math.PI),body,x,.335,0);fender.scale.z=2.5;
 }
 // Low frame and textured step-through footboard.
 rod([-.96,.35,0],[.92,.43,0],.045,dark);
 profile([[-.77,.44],[.37,.44],[.62,.62],[.43,.72],[.15,.56],[-.7,.57]],.4,dark,.025);
 box(1.04,.065,.46,-.16,.553,0,dark,.025);
 for(let i=0;i<6;i++)box(.68,.011,.012,-.21,.594,(i-2.5)*.061,rubber,.004);
 box(.89,.12,.47,-.1,.46,0,body,.02);
 // Rear power unit, swingarm and shock absorbers.
 box(.53,.16,.14,.62,.32,.24,dark,.045);
 cylinder(.129,.129,.13,.89,.335,.225,rim);
 rod([.34,.45,-.21],[.9,.34,-.21],.042,dark);
 for(const z of [-.21,.21]){
  rod([.76,.4,z],[.61,.99,z],.022,silver);
  for(let j=0;j<9;j++){const m=add(new THREE.TorusGeometry(.039,.009,6,16),dark,.75-j*.014,.45+j*.045,z);m.rotation.x=Math.PI/2;}
 }
 // Body panels are drawn separately for all six references, rather than sharing
 // one generic scooter shell. The X axis runs from the front wheel to the rear.
 if(vibe){
  ellipsoid(.62,.34,.31,.58,.91,0);
  ellipsoid(.51,.23,.285,.54,1.08,0);
  ellipsoid(.205,.58,.285,-.76,1.02,0).rotation.z=-.18;
  ellipsoid(.166,.46,.244,-.69,1.10,0,dark).rotation.z=-.18;
  ellipsoid(.105,.40,.257,-.835,1.09,0);
  for(const z of [-.265,.265]){const trim=ellipsoid(.34,.018,.018,.57,.91,z,silver);trim.rotation.z=.09;}
 }else if(urban){
  profile([[.02,.64],[.88,.66],[1.13,.91],[1.04,1.14],[.36,1.18],[.17,.99]],.49,body,.07);
  ellipsoid(.27,.37,.25,.72,.93,0);
  profile([[-.77,.57],[-.98,.79],[-.91,1.26],[-.69,1.60],[-.49,1.53],[-.56,.84],[-.43,.63]],.38,body,.045);
  profile([[-.74,.72],[-.80,1.13],[-.63,1.46],[-.51,1.43],[-.58,.82]],.405,dark,.014);
  for(const z of [-.22,.22]){const strip=box(.035,.29,.025,-.885,1.12,z,glass,.011);strip.rotation.z=-.18;}
 }else if(minimal){
  profile([[.12,.58],[.91,.64],[1.11,.88],[.97,1.16],[.37,1.14],[.34,.85]],.44,body,.035);
  profile([[-.87,.58],[-1.02,.8],[-.92,1.48],[-.67,1.66],[-.51,1.58],[-.61,.82],[-.5,.63]],.32,body,.025);
  box(.07,.58,.3,-.61,1.24,0,dark,.01).rotation.z=-.13;
  for(const z of [-.183,.183]){const edge=box(.035,.37,.022,-.82,1.14,z,accent,.008);edge.rotation.z=-.13;}
  box(.065,.062,.29,-.955,1.37,0,glass,.012);
 }else if(activeX){
  profile([[.02,.64],[.84,.61],[1.16,.83],[1.06,1.15],[.39,1.17],[.15,1.00]],.43,body,.035);
  profile([[-.76,.58],[-1.04,.82],[-.93,1.24],[-.78,1.58],[-.56,1.68],[-.45,1.52],[-.57,1.00],[-.48,.68]],.37,body,.035);
  profile([[-.76,.86],[-.86,1.16],[-.70,1.49],[-.52,1.58],[-.49,1.47],[-.60,1.04]],.39,dark,.01);
  for(const z of [-.224,.224]){const blade=box(.47,.025,.018,-.76,1.25,z,glass,.006);blade.rotation.z=z>0?.99:.99;const orange=box(.31,.022,.019,.62,.98,z,accent,.006);orange.rotation.z=.42;}
 }else{
  profile([[.02,.65],[.85,.6],[1.18,.83],[1.09,1.16],[.45,1.20],[.20,1.01]],.43,body);
  profile([[-.74,.58],[-1.06,.84],[-.96,1.12],[-.83,1.56],[-.58,1.70],[-.47,1.57],[-.60,1.04],[-.49,.69]],id==='activex'?.36:.39,body,.04);
  profile([[-.76,.88],[-.85,1.16],[-.68,1.52],[-.51,1.62],[-.49,1.50],[-.61,1.06]],.405,dark,.008);
  for(const z of [-.23,.23]){
   const fin=box(.65,.035,.023,.56,.94,z,plus?silver:dark,.008);fin.rotation.z=.23;
   rod([-.93,.92,z],[-.69,1.39,z],.013,silver);
   if(eon){const lower=box(.34,.035,.026,-.84,1.13,z,glass,.008);lower.rotation.z=-.26;}
   if(plus){const green=box(.27,.022,.028,.65,1.03,z,accent,.006);green.rotation.z=.19;}
  }
 }
 // Ergonomic saddle, seams, pillion grab rails and optional backrest.
 const saddle=box(.97,.16,.49,.55,1.25,0,seat,.075);saddle.rotation.z=.05;
 ellipsoid(.32,.052,.245,.90,1.33,0,seat);
 for(const z of [-.25,.25]){rod([.72,1.23,z],[1.18,1.29,z],.025,silver);rod([1.18,1.29,z],[1.13,1.09,z],.024,dark);}
 if(urban||minimal){rod([1.05,1.17,-.18],[1.13,1.51,-.18],.025,dark);rod([1.05,1.17,.18],[1.13,1.51,.18],.025,dark);box(.10,.25,.40,1.11,1.5,0,seat,.06);}
 box(.07,.07,.33,1.155,1.05,0,red,.018);box(.10,.20,.14,1.18,.78,0,dark,.014).rotation.z=.3;
 // Fork, steering stem, handlebar and controls.
 for(const z of [-.16,.16]){rod([-.92,.34,z],[-.77,.96,z],.027,silver);rod([-.88,.49,z],[-.76,1.06,z],.041,dark);}
 rod([-.80,.85,0],[-.56,1.78,0],.038,dark);
 const handleX=-.56,handleY=1.78;
 rod([handleX,handleY,-.5],[handleX,handleY,.5],.028,silver);
 for(const z of [-.44,.44]){cylinder(.044,.044,.19,handleX,handleY,z,rubber);box(.12,.09,.095,handleX,handleY,z>0?.31:-.31,dark,.022);rod([handleX-.09,handleY-.025,z],[handleX-.10,handleY-.03,z+(z>0?.10:-.10)],.009,silver);}
 if(vibe){ellipsoid(.145,.135,.205,handleX,handleY,0);cylinder(.11,.11,.04,handleX-.145,handleY,0,silver,'x');cylinder(.089,.089,.045,handleX-.17,handleY,0,white,'x');}
 else if(urban){box(.25,.19,.50,handleX,handleY,0,body,.07);box(.038,.075,.31,handleX-.147,handleY,0,glass,.015);}
 else if(activeX){box(.29,.20,.55,handleX,handleY,0,body,.025);box(.038,.10,.39,handleX-.157,handleY,0,glass,.014);}
 else{box(.26,.18,.55,handleX,handleY,0,body,.035);if(eon){for(const z of [-.145,.145]){const upper=box(.046,.074,.17,handleX-.15,handleY-.015,z,glass,.012);upper.rotation.x=z>0?-.16:.16;}}else if(plus){for(const z of [-.13,.13]){const l=box(.065,.076,.19,-.94,1.075,z,glass,.01);l.rotation.z=-.24;l.rotation.y=z>0?-.17:.17;}}else if(minimal){box(.032,.062,.255,-.987,1.105,0,glass,.012);}}
 const cluster=activeX?box(.18,.035,.28,-.45,1.865,0,dark,.017):box(.15,.023,.20,-.45,1.86,0,dark,.017);cluster.rotation.z=-.17;
 const screen=activeX?box(.14,.012,.22,-.447,1.884,0,new THREE.MeshStandardMaterial({color:'#081313',emissive:'#31504d',emissiveIntensity:.45}),.01):box(.11,.012,.15,-.447,1.873,0,new THREE.MeshStandardMaterial({color:'#101e1d',emissive:'#204845',emissiveIntensity:.3}),.01);screen.rotation.z=-.17;
 for(const z of [-1,1]){
  rod([handleX,1.8,z*.3],[-.60,2.04,z*.43],.012,dark);
  if(vibe){const m=ellipsoid(.029,.082,.066,-.6,2.08,z*.45,dark);m.rotation.x=z*.15;ellipsoid(.006,.066,.052,-.57,2.08,z*.45,silver);}
  else{const m=box(.054,.13,.15,-.6,2.09,z*.45,dark,.025);m.rotation.x=z*.25;box(.008,.10,.12,-.57,2.09,z*.45,silver,.019).rotation.x=z*.25;}
  box(.034,.075,.045,-.95,(vibe||urban)?1.0:.83,z*((vibe||urban)?.225:.23),amber,.012);
 }
 // Center stand.
 rod([.43,.43,-.16],[.37,.09,-.20],.018,dark);rod([.43,.43,.16],[.37,.09,.20],.018,dark);rod([.37,.09,-.24],[.37,.09,.24],.018,dark);
 // Involt wordmark on both side panels, rendered as a small texture.
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d')!;
 ctx.fillStyle='#f1f6e9';ctx.font='500 49px Arial';ctx.textAlign='center';ctx.fillText('I N V O L T',256,63);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const decalMat=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide});
 for(const side of [-1,1]){const mesh=add(new THREE.PlaneGeometry(.34,.066),decalMat,.60,.99,side*((vibe||urban)?.305:.278));if(side===-1)mesh.rotation.y=Math.PI;mesh.rotation.z=.10;}
 root.userData.bodyMaterial=body;
 return root;
}
export function disposeObject(root:THREE.Object3D){const mats=new Set<THREE.Material>();const geos=new Set<THREE.BufferGeometry>();root.traverse(o=>{if(o instanceof THREE.Mesh){geos.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));}});geos.forEach(g=>g.dispose());mats.forEach(m=>{for(const v of Object.values(m)){if(v instanceof THREE.Texture)v.dispose();}m.dispose();});}
