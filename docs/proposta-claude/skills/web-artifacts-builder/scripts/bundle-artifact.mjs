#!/usr/bin/env node
// Local adaptation of Anthropic's web-artifacts-builder; see ../SOURCE.md.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { output: { type: 'string', default: 'bundle.html' }, help: { type: 'boolean' } } });
  if (values.help) {
    console.log('Usage: node bundle-artifact.mjs [artifact-directory] [--output bundle.html]\nRequires a Vite 8 browser frontend with index.html and installed local dependencies. Refuses existing output files.');
  } else {
    if (positionals.length > 1) throw new Error('Provide at most one artifact directory.');
    const root = fs.realpathSync(path.resolve(positionals[0] || '.'));
    for (const file of ['package.json', 'index.html']) {
      if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing ${file}; use a compatible browser frontend workspace.`);
    }
    const output = path.resolve(root, values.output);
    if (!output.endsWith('.html')) throw new Error('Choose an .html output filename.');
    if (fs.existsSync(output)) throw new Error('Output already exists; choose a new filename.');
    const requireProject = createRequire(path.join(root, 'package.json'));
    let viteEntry;
    try { viteEntry = requireProject.resolve('vite'); } catch { throw new Error('Local Vite is not installed. Review and install the workspace dependencies first.'); }
    const vite = await import(pathToFileURL(viteEntry).href);
    if (Number(vite.version.split('.')[0]) !== 8) throw new Error(`This helper supports Vite 8; found ${vite.version}. Use the project\'s existing export process or review compatibility before adapting it.`);
    // Build in memory: existing dist folders, configuration and package files stay intact.
    const result = await vite.build({
      root,
      base: './',
      envDir: false,
      publicDir: false,
      build: {
        write: false,
        emptyOutDir: false,
        ssr: false,
        sourcemap: false,
        cssCodeSplit: false,
        assetsInlineLimit: Number.MAX_SAFE_INTEGER,
        modulePreload: false,
        rolldownOptions: { input: path.join(root, 'index.html'), output: { codeSplitting: false } },
      },
    });
    const builds = Array.isArray(result) ? result : [result];
    const outputs = builds.flatMap(build => build.output || []);
    const htmlAssets = outputs.filter(item => item.type === 'asset' && item.fileName === 'index.html');
    if (htmlAssets.length !== 1) throw new Error('Expected one generated index.html. Multi-page and server builds need their own export workflow.');
    let html = String(htmlAssets[0].source);
    const embedded = new Set(['index.html']);
    const lookup = reference => outputs.find(item => item.fileName === reference.replace(/^\.\//, '').replace(/^\//, ''));
    html = html.replace(/<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>\s*<\/script\s*>/gi, (tag, before, source) => {
      const chunk = lookup(source);
      if (!chunk || chunk.type !== 'chunk') throw new Error(`Script could not be embedded: ${source}`);
      if (chunk.imports.length || chunk.dynamicImports.some(file => file !== chunk.fileName)) throw new Error('Separate JavaScript chunks remain; adapt the artifact before bundling.');
      embedded.add(chunk.fileName);
      return `<script type="module">${chunk.code.replace(/<\/script/gi, '<\\/script')}</script>`;
    });
    html = html.replace(/<link\b[^>]*>/gi, tag => {
      const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
      if (!href) return tag;
      const relation = tag.match(/\brel=["']([^"']+)["']/i)?.[1];
      if (relation === 'stylesheet') {
        const asset = lookup(href);
        if (!asset || asset.type !== 'asset') throw new Error(`Stylesheet could not be embedded: ${href}`);
        embedded.add(asset.fileName);
        return `<style>${String(asset.source).replace(/<\/style/gi, '<\\/style')}</style>`;
      }
      if (relation === 'modulepreload') return '';
      if (!/^(data:|#)/i.test(href)) throw new Error(`External or unresolved link asset: ${href}`);
      return tag;
    });
    // Ignore inline program text when checking actual markup resource attributes.
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '');
    for (const match of markup.matchAll(/\b(?:src|poster|srcset)=["']([^"']+)["']/gi)) {
      if (!/^(data:|#)/i.test(match[1])) throw new Error(`Resource could not be embedded: ${match[1]}`);
    }
    const css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map(match => match[1]).join('\n');
    if (/@import\b/i.test(css)) throw new Error('A CSS import remains external. Import local styles into the application before bundling.');
    for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi)) {
      if (!/^(data:|#)/i.test(match[1])) throw new Error(`CSS resource could not be embedded: ${match[1]}`);
    }
    const unembedded = outputs.filter(item => !embedded.has(item.fileName));
    if (unembedded.length) throw new Error(`Separate assets remain: ${unembedded.map(item => item.fileName).join(', ')}. Import them for inlining or use the project's export workflow.`);
    fs.writeFileSync(output, html, { flag: 'wx' });
    console.log(`Created ${output} (${Buffer.byteLength(html)} bytes). Verify the HTML directly in a browser; review any runtime API requests separately.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
