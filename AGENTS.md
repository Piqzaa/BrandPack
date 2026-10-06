# BrandPack

BrandPack is a logo handoff platform: it applies an existing identity, never invents a brand.

- Work in small, understandable stages. Explain before each major step and explain the Symfony concepts afterwards, in French. Product UI is English-first.
- Current stage: Docker + Symfony + first page. No upload, database, renderer, billing or authentication yet.
- Keep controllers thin, business rules in services, future graphics processing in a separate renderer.
- Treat every uploaded SVG as hostile. Never inject a raw uploaded SVG into the DOM. Test security-sensitive processing when it is introduced.
- Prefer simple architecture and necessary dependencies. No speculative abstractions or AI branding.
- Maintain a polished, accessible, restrained UI. No generic admin dashboard.
- Verify changed routes, configuration and templates. Document limitations honestly.
- Add features progressively with the user; the original long brief is a reference, not authorization to build everything at once.
