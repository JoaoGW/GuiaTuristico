# Source and local adaptation

- Upstream: https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
- Last upstream commit affecting this skill at retrieval: b9e19e6f44773509fbdd7001d77ff41a49a486c1
- Retrieved and adapted: 2026-10-21
- License: Apache-2.0; the original LICENSE.txt is included unchanged.

Local changes: rewrote SKILL.md and replaced the Bash initialization and packaging scripts with cross-platform Node.js helpers. The helpers use an optional isolated React/TypeScript/Vite starter, plain CSS, no predefined component library, no bundled component archive, no global package-manager installation, no automatic dependency installation and no recursive build cleanup. The bundle is produced through the project's local Vite instead of adding a second bundler. Project identity comes from the setup answers, and repository dependency restrictions remain in effect.

The starter package versions were verified against the public npm registry on the adaptation date. Review them when updating the toolchain; they do not constrain other projects.


EZ Trip AI adaptation (30/10/2026): project identity, design references (`docs/DESIGN.md`, `docs/DesignIA_Regras.md` as the superior rule) and dependency rules now come from this repository; the generic Prisma/Zustand restriction from the template was removed because this project uses Zustand. Scripts and LICENSE.txt are unchanged.
