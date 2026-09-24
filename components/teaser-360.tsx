'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RotateCw } from 'lucide-react';
import VehicleViewer from '@/components/vehicle-viewer';
import { models, Model } from '@/lib/models';

export default function Teaser360() {
  const [activeModel, setActiveModel] = useState<Model>(models[0]);
  const [viewerStatus, setViewerStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  return (
    <div className="teaser-360-card">
      <div className="teaser-360-header">
        <div className="teaser-360-badge">
          <span className="live-dot" />
          <span>360&deg; INTERACTIVE STUDIO</span>
        </div>
        <span className="teaser-model-label">MODEL: {activeModel.name.toUpperCase()}</span>
      </div>

      <div className="teaser-360-viewport">
        <div className="teaser-orbit-ring" aria-hidden="true">
          <span className="orbit-dot" />
        </div>
        <VehicleViewer
          model={activeModel}
          color={activeModel.referenceColor}
          autoRotate={true}
          angle="side"
          angleKey={0}
          onStatus={setViewerStatus}
        />
        {viewerStatus !== 'ready' && (
          <div className="teaser-360-fallback" style={{ opacity: viewerStatus === 'loading' ? 0.9 : 1 }}>
            <img src="/images/studio-preview.webp" alt={`Involt ${activeModel.name} 360 preview`} />
            {viewerStatus === 'loading' && <div className="teaser-loader-spinner" />}
          </div>
        )}
      </div>

      <div className="teaser-360-bottom">
        <div className="teaser-drag-hint">
          <RotateCw size={14} className="spin-hint-icon" />
          <span>CLICK &amp; DRAG TO ROTATE 360&deg;</span>
        </div>
        <div className="teaser-model-switcher">
          {models.slice(0, 3).map((m) => (
            <button
              key={m.id}
              className={`switcher-tab ${activeModel.id === m.id ? 'active' : ''}`}
              onClick={() => setActiveModel(m)}
              type="button"
              aria-label={`Preview ${m.name} in 3D`}
            >
              {m.name}
            </button>
          ))}
          <Link href="/experience" className="switcher-tab more-link" title="Explore all 6 models in 3D studio">
            +3 MORE &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
