'use client';

import { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface DistributorFormProps {
  onSuccess?: () => void;
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}

export default function DistributorForm({ onSuccess }: DistributorFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const lastSubmitRef = useRef(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;

    // Client-side duplicate submission prevention (5s cooldown)
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) {
      setStatus('error');
      setErrorMessage('Please wait a moment before submitting again.');
      return;
    }

    // Client-side validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setStatus('error');
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!trimmedPhone || !isValidPhone(trimmedPhone)) {
      setStatus('error');
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    lastSubmitRef.current = now;

    try {
      const response = await fetch('/api/distributor-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        if (onSuccess) {
          // Give the user a moment to see the success message
          setTimeout(onSuccess, 3000);
        }
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Unable to send your enquiry. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="distributor-form-success">
        <p>Thank you. Our team will get in touch with you shortly.</p>
      </div>
    );
  }

  return (
    <form className="distributor-form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && <div className="distributor-form-error">{errorMessage}</div>}
      
      <div className="form-group">
        <label htmlFor="dist_name">Full Name</label>
        <input 
          id="dist_name" 
          type="text" 
          value={name}
          onChange={e => setName(e.target.value)}
          required 
          maxLength={100}
          disabled={status === 'submitting'}
          placeholder="Your full name"
          autoComplete="name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="dist_email">Email Address</label>
        <input 
          id="dist_email" 
          type="email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required 
          disabled={status === 'submitting'}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="dist_phone">Phone Number</label>
        <input 
          id="dist_phone" 
          type="tel" 
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required 
          disabled={status === 'submitting'}
          placeholder="+91 XXXXX XXXXX"
          autoComplete="tel"
        />
      </div>
      
      <button 
        type="submit" 
        className="button primary" 
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending...' : 'Become a Distributor'}
        {status !== 'submitting' && <ArrowUpRight size={19} />}
      </button>
    </form>
  );
}
