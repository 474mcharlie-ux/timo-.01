# Sovereign OS

Private relationship intelligence for firms. This first working prototype runs as a local dashboard and demonstrates the Sovereign loop:

- evidence-backed opportunity briefs
- a human-reviewable conflict signal (never legal clearance)
- commercial triggers and estimated opportunity value
- relationship paths across a firm's ecosystem
- company-fit screening

## Run locally

```bash
npm install
npm run build
npm start
```

For a no-build development run on Node 22.6+:

```bash
npm run dev
```

Then open `http://localhost:4173`.

The included information is illustrative demo data held in memory. No client or external data is sent anywhere. A production installation should replace the demo contracts in `src/index.ts` with firm-approved data connectors and retain firm policy controls around sources, access and review.
