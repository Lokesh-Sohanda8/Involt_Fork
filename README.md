# Involt EV 3D Website

A responsive Next.js/Vinext website with six interactive Three.js scooter recreations and the supplied high-resolution product photography.

## Run locally

Requirements: Node.js 22.13+ and pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:5173`.

## Production check

```bash
pnpm build
pnpm start
```

## 3D controls

- Desktop: drag to rotate, scroll to zoom, or use the angle/zoom controls.
- Mobile: drag with one finger and pinch to zoom.
- Keyboard: focus the viewer, use arrow keys to rotate, `+` / `-` to zoom, and `Home` to reset.

The six 3D recreations are model-specific and matched to the supplied reference photographs. Because each vehicle was supplied as a single photograph, surfaces hidden from the camera are a careful interpretation. Manufacturer CAD or multi-angle photography can be dropped into the same viewer later for exact production geometry.
