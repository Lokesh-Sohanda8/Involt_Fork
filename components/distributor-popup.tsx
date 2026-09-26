'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DistributorForm from './distributor-form';

export default function DistributorPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('involt_distributor_popup_shown')) {
        return;
      }
    } catch {
      // In case sessionStorage is inaccessible
    }

    let triggered = false;

    const triggerPopup = () => {
      if (triggered) return;
      triggered = true;

      try {
        sessionStorage.setItem('involt_distributor_popup_shown', 'true');
      } catch {}

      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      setIsOpen(true);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0 && scrollY / totalScrollable >= 0.40) {
        triggerPopup();
      }
    };

    const timer = setTimeout(triggerPopup, 20000);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="distributor-popup-overlay" 
      role="dialog" 
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="distributor-popup-content">
        <button className="distributor-popup-close" onClick={handleClose} aria-label="Close popup">
          <X size={24} />
        </button>
        {!isSuccess && (
          <div className="distributor-popup-header">
            <h2>Want to become an INVolt distributor?</h2>
            <p>Bring the next generation of electric mobility to your city.</p>
          </div>
        )}
        <DistributorForm 
          onSuccess={handleSuccess} 
          onClose={handleClose}
          source="INVolt Website — Home Popup"
          productContext="Distributor Network"
          requirements="Distributor enquiry"
        />
      </div>
    </div>
  );
}
