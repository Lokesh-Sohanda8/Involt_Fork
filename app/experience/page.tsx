import {Suspense} from 'react';import Studio from './studio';
export const metadata={title:'360° 3D studio'};
export default function Page(){return <Suspense fallback={<div className="section">Opening the 3D studio…</div>}><Studio/></Suspense>}