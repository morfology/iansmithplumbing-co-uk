# Ian Smith Plumbing — website

The website for Ian Smith Plumbing, a plumber in Hook, Hampshire. Live at https://iansmithplumbing.co.uk.

Astro + Tailwind, fully static, deployed on Cloudflare Pages.

```sh
npm install
npm run dev      # local dev server
npm run build    # static output in dist/
```

Everything specific to the business lives in `src/config/client.ts` (the data) and `src/config/copy.ts` (the wording). `SCAFFOLD.md` is the spec and explains the decisions behind the design.
