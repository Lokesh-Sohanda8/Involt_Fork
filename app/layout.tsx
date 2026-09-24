import type { Metadata } from "next";
import "./globals.css";
import {Header,Footer} from '@/components/site-shell';
export const metadata: Metadata = {
 title: { default: 'Involt EV — Charge Your Life', template: '%s | Involt EV' },
 description: "Meet the Involt electric scooter lineup. Explore six models, full specifications and an interactive 360-degree 3D studio.",
 icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" }
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 return <html lang="en"><body className="antialiased"><Header/><main id="main">{children}</main><Footer/></body></html>;
}