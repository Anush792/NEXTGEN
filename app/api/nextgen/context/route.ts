import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

async function gatherSiteContext() {
  try {
    const root = process.cwd();
    const parts: string[] = [];

    // data JSON
    const dataDir = path.join(root, 'data');
    try {
      const entries = await fs.readdir(dataDir);
      for (const e of entries) {
        if (e.endsWith('.json')) {
          try {
            const content = await fs.readFile(path.join(dataDir, e), 'utf8');
            parts.push(`FILE: data/${e}\n` + content.slice(0, 8000));
          } catch (_) {}
        }
      }
    } catch (_) {}

    // top-level md
    try {
      const rootEntries = await fs.readdir(root);
      for (const e of rootEntries) {
        if (e.endsWith('.md')) {
          try {
            const content = await fs.readFile(path.join(root, e), 'utf8');
            parts.push(`FILE: ${e}\n` + content.slice(0, 4000));
          } catch (_) {}
        }
      }
    } catch (_) {}

    // recursive app and components
    async function readRecursive(dir: string, exts: string[]) {
      try {
        const out: string[] = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const ent of entries) {
          const p = path.join(dir, ent.name);
          if (ent.isDirectory()) {
            out.push(...(await readRecursive(p, exts)));
          } else if (ent.isFile()) {
            for (const ex of exts) {
              if (ent.name.endsWith(ex)) {
                try {
                  const content = await fs.readFile(p, 'utf8');
                  out.push(`FILE: ${path.relative(root, p)}\n` + content.slice(0, 6000));
                } catch (_) {}
              }
            }
          }
        }
        return out;
      } catch (e) {
        return [];
      }
    }

    const rootDir = root;
    try {
      parts.push(...(await readRecursive(path.join(rootDir, 'app'), ['.ts', '.tsx', '.js', '.jsx', '.md'])));
    } catch (_) {}
    try {
      parts.push(...(await readRecursive(path.join(rootDir, 'components'), ['.ts', '.tsx', '.js', '.jsx'])));
    } catch (_) {}

    const combined = parts.join('\n\n');
    return combined.slice(0, 32000);
  } catch (e) {
    return '';
  }
}

export async function GET() {
  try {
    const ctx = await gatherSiteContext();
    return NextResponse.json({ context: ctx });
  } catch (e) {
    return NextResponse.json({ context: '' });
  }
}
