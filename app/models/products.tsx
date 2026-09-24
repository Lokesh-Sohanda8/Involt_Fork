'use client';
import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {ArrowUpRight,ShieldCheck,Wrench,Settings,CreditCard} from 'lucide-react';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {Table,TableBody,TableRow,TableHead,TableCell,TableCaption} from '@/components/ui/table';
import {models,colors,specifications, Model} from '@/lib/models';

function ProductMedia({ model, active }: { model: Model, active: boolean }) {
  const [videoError, setVideoError] = useState(false);
  if (!active || videoError || !model.explodedVideo) {
    return <img src={model.image} width={model.imageWidth} height={model.imageHeight} alt={'Original supplied photograph of the Involt '+model.name}/>;
  }
  return <video src={model.explodedVideo} poster={model.image} autoPlay muted loop playsInline onError={() => setVideoError(true)} />;
}

export default function Models(){
 const search=useSearchParams();const requested=search.get('model');const [selected,setSelected]=useState(models.some(m=>m.id===requested)?requested!:'eon');
 return <><div className="page-intro"><div><p className="eyebrow">THE INVOLT LINEUP / 06 ELECTRIC SCOOTERS</p><h1>Find your <em>kind of ride.</em></h1></div><p>Six distinct designs. Everyday electric performance. Get to know the details.</p></div><div className="model-browser"><Tabs value={selected} onValueChange={setSelected}><TabsList className="model-tabs" aria-label="Choose a vehicle model">{models.map(m=><TabsTrigger value={m.id} key={m.id}>{m.name}</TabsTrigger>)}</TabsList>{models.map(m=><TabsContent key={m.id} value={m.id}><div className="product-detail"><div className="detail-photo"><ProductMedia model={m} active={selected === m.id}/><span className="photo-caption">INVOLT {m.name.toUpperCase()} / ENGINEERING VISUALIZATION</span></div><div className="product-info"><p className="eyebrow">{m.character} / ELECTRIC</p><h2>{m.name}</h2><p>{m.description}</p><div className="highlights"><div><strong>25 <small style={{display:'inline'}}>km/h</small></strong><small>Speed</small></div><div><strong>190 <small style={{display:'inline'}}>mm</small></strong><small>Ground clearance</small></div><div><strong>3</strong><small>Riding modes</small></div></div><span className="color-list-label">Five colours. Your signature.</span><div className="color-row">{colors.map(c=><span key={c.name} className="color-dot" title={c.name} aria-label={c.name} style={{background:c.hex}}/>)}</div><p className="source-note" style={{margin:'-12px 0 24px'}}>White · Maroon · Matt Army Green · Grey · Black</p><div className="button-row"><Link href={'/experience?model='+m.id} className="button primary">Explore in 360° <ArrowUpRight size={18}/></Link><Link href="/contact" className="button outline">Enquire about {m.name} <ArrowUpRight size={18}/></Link></div></div></div><div className="specs-block"><div className="specs-heading"><h3>Every detail. At a glance.</h3><a className="text-link" href="/involt-brochure.pdf#page=10" target="_blank" rel="noreferrer">View brochure specifications <ArrowUpRight size={17}/></a></div><Table className="spec-table"><TableCaption className="source-note">Specifications transcribed from page 10 of the supplied Involt brochure. Charging times are listed as two options; the brochure does not map them to battery variants. Confirm your chosen configuration with Involt.</TableCaption><TableBody>{specifications(m).map(([key,value])=><TableRow key={key}><TableHead scope="row">{key}</TableHead><TableCell>{value}</TableCell></TableRow>)}</TableBody></Table><div className="support-row"><span><ShieldCheck/>Warranty</span><span><Wrench/>Service network</span><span><Settings/>Spare availability</span><span><CreditCard/>Finance available</span></div></div></TabsContent>)}</Tabs></div></>
}
