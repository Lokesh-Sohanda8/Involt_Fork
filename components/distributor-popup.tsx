'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import DistributorForm from './distributor-form';

export default function DistributorPopup() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    setIsOpen(false);
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
        <div className="distributor-popup-header">
          <h2>Want to become an INVolt distributor?</h2>
          <p>Bring the next generation of electric mobility to your city.</p>
        </div>
        <DistributorForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
