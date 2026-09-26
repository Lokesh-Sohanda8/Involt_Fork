import {ArrowUpRight,Phone,MapPin,Factory,Mail} from 'lucide-react';
import DistributorForm from '@/components/distributor-form';

export const metadata={title:'Contact & locations'};

export default function Contact(){
  return <>
    <div className="page-intro contact-intro">
      <div>
        <p className="eyebrow">FIND US / GET IN TOUCH</p>
        <h1>Your electric journey<br /><em>starts here.</em></h1>
      </div>
      <p>Talk to the Involt team about a model, availability, finance or your nearest store.</p>
    </div>

    <section className="contact-grid" aria-label="Involt office and manufacturing addresses">
      <article className="location-card">
        <MapPin/>
        <p className="eyebrow">01 / REGISTERED OFFICE</p>
        <h2>Nashik.</h2>
        <address>Unit No. 503/504, Kadam Mansion<br/>Mahatma Nagar, Nashik<br/>Maharashtra – 422005</address>
        <div className="button-row">
          <a className="button primary" href="tel:+918149004536"><Phone size={16}/>8149004536</a>
          <a className="button outline" href="https://www.google.com/maps/search/?api=1&query=Kadam+Mansion+Mahatma+Nagar+Nashik+422005" target="_blank" rel="noreferrer">Directions<ArrowUpRight size={16}/></a>
        </div>
      </article>

      <article className="location-card">
        <Factory/>
        <p className="eyebrow">02 / MANUFACTURING UNIT</p>
        <h2>Pimpri-Chinchwad.</h2>
        <address>Shade - 1, Besides, Ridhi-Sidhi Society<br/>Sno. 27, Charholi Phata, Chovisawadi<br/>Charholi Budruk, Pimpri-Chinchwad<br/>Maharashtra – 411081</address>
        <div className="button-row">
          <a className="button primary" href="tel:+918669668665"><Phone size={16}/>8669668665</a>
          <a className="button outline" href="https://www.google.com/maps/search/?api=1&query=Ridhi+Sidhi+Society+Charholi+Phata+Chovisawadi+Pimpri+Chinchwad+411081" target="_blank" rel="noreferrer">Directions<ArrowUpRight size={16}/></a>
        </div>
      </article>
    </section>

    <section className="contact-distributor-section location-card" style={{ margin: '0 4.6% 40px', background: '#f0f1ed', color: '#11170d' }}>
      <p className="eyebrow" style={{ color: '#666e5d' }}>03 / PARTNERSHIP</p>
      <h2>Want to become an INVolt distributor?</h2>
      <p style={{ color: '#697061', marginBottom: '24px' }}>Bring the next generation of electric mobility to your city. Fill out the form below and our team will get in touch with you.</p>
      <div style={{ maxWidth: '400px' }}>
        <DistributorForm 
          source="INVolt Website — Contact Page"
          productContext="Distributor Network"
          requirements="Distributor enquiry"
        />
      </div>
    </section>

    <div className="contact-bottom">
      <div>
        <p className="eyebrow"><Mail size={14}/>SAY HELLO</p>
        <a href="mailto:involtintegrated@gmail.com" className="contact-email">involtintegrated@gmail.com ↗</a>
        <p className="source-note">Office and unit details as listed on the last page of the brochure.<br/>For store locations and visiting arrangements, please call the team.</p>
      </div>
      <div className="finance">
        <p className="eyebrow">FINANCE PARTNER</p>
        <strong>Bajaj Finserv</strong>
        <span>Ask the team about available finance options.</span>
      </div>
    </div>
  </>
}