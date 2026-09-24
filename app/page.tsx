import Link from 'next/link';
import { ArrowUpRight, ArrowRight, MoveUpRight, CircleGauge, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { models } from '@/lib/models';
import Teaser360 from '@/components/teaser-360';

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-bg-video-wrap" aria-hidden="true">
        <video
          className="hero-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/energy-flow-poster.webp"
          src="/videos/energy_flow.mp4"
        >
          <source src="/videos/energy_flow.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-overlay" />
      </div>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow"><span className="small-line" /> THE NEXT MOVE IS ELECTRIC</p>
          <h1>CHARGE<br />YOUR <em>LIFE.</em></h1>
          <p className="hero-description">Meet Involt&apos;s electric mobility lineup,<br className="desktop-break"/>designed for everyday movement.</p>
          <div className="button-row">
            <Link href="/models" className="button primary">Explore the lineup <ArrowUpRight size={19}/></Link>
            <Link href="/experience" className="button outline">Enter the 3D studio <ArrowUpRight size={19}/></Link>
          </div>
        </div>
        <div className="hero-video-window">
          <video autoPlay muted loop playsInline preload="metadata" src="/videos/involt/Commercial.mp4" poster="/images/studio-preview.webp" aria-hidden="true"></video>
        </div>
      </div>
      <div className="hero-bottom">
        <div><span className="tiny-label">01 / THE ELECTRIC GENERATION</span><span>Less noise. More life.</span></div>
        <Link href="#lineup" className="scroll-cue">Discover Involt <ArrowRight size={18}/></Link>
      </div>
    </section>

    <div className="ticker">
      <span>THOUGHTFUL DESIGN</span><Zap size={18}/>
      <span>SMART TECHNOLOGY</span><Zap size={18}/>
      <span>EVERYDAY PERFORMANCE</span><Zap size={18}/>
      <span>CHARGE YOUR LIFE</span><Zap size={18}/>
    </div>

    <section className="section lineup" id="lineup">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / FIND YOUR ELECTRIC</p>
          <h2>Six personalities.<br /><span>One electric future.</span></h2>
        </div>
        <Link href="/models" className="text-link">Meet every model <ArrowUpRight size={20}/></Link>
      </div>
      <div className="preview-models">
        {[models[0], models[1], models[4]].map((m, i) => (
          <Link href={'/models?model=' + m.id} className="model-card" key={m.id}>
            <div className="card-top">
              <span>0{i + 1}</span>
              <span>ELECTRIC / {m.character}</span>
            </div>
            <div className="product-photo">
              <img src={m.image} width={m.imageWidth} height={m.imageHeight} alt={'Involt ' + m.name} loading="lazy" decoding="async"/>
            </div>
            <div className="model-card-bottom">
              <div>
                <h3>{m.name}</h3>
                <p>{m.tagline}</p>
              </div>
              <span className="circle-link"><ArrowUpRight size={22}/></span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    <section className="studio-teaser section">
      <div className="studio-teaser-content">
        <div className="studio-teaser-copy">
          <p className="eyebrow"><span className="small-line" /> 02 / A DIFFERENT PERSPECTIVE</p>
          <h2>Good design.<br /><span>From every angle.</span></h2>
          <p>Get closer to your next ride. Rotate, inspect and explore all six models in our interactive 3D showroom.</p>
          
          <ul className="studio-feature-list">
            <li><CheckCircle2 size={16} /> Full 360&deg; precision orbit &amp; zoom</li>
            <li><CheckCircle2 size={16} /> Real-time finish &amp; color customization</li>
            <li><CheckCircle2 size={16} /> Engineering visualization for all 6 models</li>
          </ul>

          <div className="button-row" style={{ marginTop: '32px' }}>
            <Link href="/experience" className="button primary">Step inside the 3D studio <MoveUpRight size={19}/></Link>
            <Link href="/models" className="button outline">Browse specifications <ArrowUpRight size={18}/></Link>
          </div>
        </div>

        <div className="studio-teaser-visual">
          <Teaser360 />
        </div>
      </div>
    </section>

    <section className="section about-strip">
      <div>
        <p className="eyebrow">03 / THE INVOLT WAY</p>
        <h2>Made to move you.<br /><span>In every sense.</span></h2>
        <Link className="text-link" href="/about">Our story <ArrowUpRight size={20}/></Link>
      </div>
      <div className="value-list">
        <article>
          <Zap/>
          <div>
            <h3>Electric, made everyday.</h3>
            <p>Smart, reliable and accessible electric two-wheelers for the modern generation.</p>
          </div>
        </article>
        <article>
          <CircleGauge/>
          <div>
            <h3>Practical by design.</h3>
            <p>Digital instruments, LED lighting and three riding modes to match your day.</p>
          </div>
        </article>
        <article>
          <ShieldCheck/>
          <div>
            <h3>With you, beyond the ride.</h3>
            <p>Warranty, service network, spare availability and finance options listed across the range.</p>
          </div>
        </article>
      </div>
    </section>
  </>;
}
