import {Suspense} from 'react';
import Models from './products';
export const metadata={title:'Our electric scooters'};
export default function Page(){return <Suspense fallback={<div className="section">Loading the Involt lineup…</div>}><Models/></Suspense>}