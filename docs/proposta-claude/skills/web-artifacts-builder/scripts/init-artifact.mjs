#!/usr/bin/env node
// Local adaptation of Anthropic's web-artifacts-builder; see ../SOURCE.md.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { name: { type: 'string' }, title: { type: 'string' }, lang: { type: 'string' }, help: { type: 'boolean' } },
  });
  if (values.help) {
    console.log('Usage: node init-artifact.mjs <new-directory> --name <package-slug> --title <display-name> --lang <language-tag>\nCreates files only; review package.json before installing dependencies.');
  } else {
    if (positionals.length !== 1 || !values.name || !values.title?.trim() || !values.lang) {
      throw new Error('Provide a new directory and the confirmed --name, --title and --lang. Use --help for syntax.');
    }
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(values.name) || values.name.length > 214) {
      throw new Error('The package slug must follow npm naming syntax: lowercase letters, digits, periods, underscores or hyphens.');
    }
    if (!/^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/i.test(values.lang)) {
      throw new Error('Use a language tag such as pt-BR or en.');
    }
    const directory = path.resolve(positionals[0]);
    if (fs.existsSync(directory)) throw new Error('Destination already exists; choose a new directory.');
    const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    const manifest = {
      name: values.name,
      version: '0.0.0',
      private: true,
      type: 'module',
      engines: { node: '^20.19.0 || >=22.12.0' },
      scripts: { dev: 'vite', typecheck: 'tsc --noEmit', build: 'vite build' },
      dependencies: { react: '19.3.1', 'react-dom': '19.3.1' },
      devDependencies: { '@types/react': '19.3.0', '@types/react-dom': '19.3.0', '@vitejs/plugin-react': '6.1.2', typescript: '6.0.3', vite: '8.3.5' },
    };
    const files = {
      'package.json': JSON.stringify(manifest, null, 2) + '\n',
      'index.html': `<!doctype html>\n<html lang="${escapeHtml(values.lang)}">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${escapeHtml(values.title)}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`,
      'src/main.tsx': `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\n// The root container is defined by index.html.\nconst root = document.getElementById('root');\nif (!root) throw new Error('Root container is missing.');\n\ncreateRoot(root).render(<StrictMode><App /></StrictMode>);\n`,
      'src/App.tsx': `/**\n * Ponto de entrada para a interface solicitada neste artefato.\n *\n * @return React.JSX.Element: contêiner inicial da interface.\n **/\nexport default function App() {\n  return <main />;\n}\n`,
      'src/index.css': `/* Add the confirmed design tokens and required interface styles here. */\n`,
      'vite.config.ts': `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n`,
      'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, types: ['vite/client'] }, include: ['src'] }, null, 2) + '\n',
      '.gitignore': 'node_modules/\ndist/\nbundle*.html\n',
    };
    // Exclusive directory creation prevents replacing an existing workspace.
    fs.mkdirSync(directory);
    fs.mkdirSync(path.join(directory, 'src'));
    for (const [file, content] of Object.entries(files)) fs.writeFileSync(path.join(directory, file), content, { flag: 'wx' });
    console.log(`Created ${directory}. No packages installed. Review package.json, then install with the approved package manager.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
