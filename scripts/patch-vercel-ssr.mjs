/**
 * Post-build patch for Vercel deployment.
 *
 * The Cloudflare plugin wraps the RSC handler in a worker object:
 *   export default { async fetch(request, env, ctx) { ... } }
 *
 * But the SSR entry calls:
 *   (await import('./rsc.mjs')).default(request)
 *
 * expecting .default to be a callable function. On Vercel (Node.js runtime),
 * there's no Cloudflare worker adapter, so the call crashes with:
 *   TypeError: (intermediate value).default is not a function
 *
 * This script patches ssr.mjs to unwrap the .fetch method when .default
 * is an object instead of a function.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ssrPath = join(
  process.cwd(),
  ".vercel/output/functions/__server.func/_ssr/ssr.mjs"
);

let content = readFileSync(ssrPath, "utf8");

// The pattern in the minified ssr.mjs is:
//   let t=await(await import(`./rsc.mjs`)).default(e)
// We need to replace .default(e) with a safe call that handles both
// function exports and {fetch} worker objects.
const patched = content.replace(
  /\(await import\(`\.\/rsc\.mjs`\)\)\.default\((\w+)\)/g,
  '((m=>(typeof m.default==="function"?m.default:m.default.fetch))((await import(`./rsc.mjs`))))($1)'
);

if (patched === content) {
  console.log("[patch] No match found — pattern may have changed.");
  // Try a broader pattern
  const patched2 = content.replace(
    /\(await import\([^)]*rsc\.mjs[^)]*\)\)\.default\((\w+)\)/g,
    '((m=>(typeof m.default==="function"?m.default:m.default.fetch))((await import(`./rsc.mjs`))))($1)'
  );
  if (patched2 !== content) {
    writeFileSync(ssrPath, patched2, "utf8");
    console.log("[patch] ssr.mjs patched successfully (broad pattern).");
  } else {
    console.error("[patch] FAILED: Could not find the import pattern to patch.");
    process.exit(1);
  }
} else {
  writeFileSync(ssrPath, patched, "utf8");
  console.log("[patch] ssr.mjs patched successfully.");
}
