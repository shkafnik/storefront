# Storefront Setup & Patches

Technical reference for the storefront codebase.

---

## Environment Variables

File: `.env.local` (not committed)

```env
NEXT_PUBLIC_SALEOR_API_URL=https://shale.rh.shadoll.dev/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://shop.rh.shadoll.dev
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

Optional (set in production):
```env
REVALIDATE_SECRET=<secret>
SALEOR_WEBHOOK_SECRET=<secret>
SALEOR_APP_TOKEN=<token>        # For channels query server-side
```

---

## Clean URL Patches Applied

This fork removes `/{channel}/` from all public URLs. Patches are in 4 files:

| File | Change |
|------|--------|
| `src/middleware.ts` | Rewrites `/products/slug` → `/default-channel/products/slug` at request time |
| `src/ui/atoms/link-with-channel.tsx` | Plain passthrough `<Link>` — no channel prepending |
| `src/ui/components/plp/utils.ts` | `transformToProductCard` emits `/products/{slug}` |
| `src/ui/components/footer.tsx` | Logo link is `/` instead of `/{channel}` |

**If upgrading from upstream**: re-apply these 4 patches after merge.

---

## Image Handling

- Images uploaded to Saleor Dashboard → stored at `https://shale.rh.shadoll.dev/media/`
- Storefront fetches URLs via GraphQL `thumbnail` and `media` fields
- `next/image` serves them via image optimization proxy
- `next.config.js` allows all hostnames (`hostname: "*"`) — restrict in production if needed

Recommended image specs:
- Aspect ratio: 1:1 (square) or 4:3
- Minimum: 800×800px
- Format: WebP or JPEG
- Background: white or light neutral

---

## Caching Strategy

| Layer | TTL | Tags |
|-------|-----|------|
| Product pages (ISR) | 5 min | `product-{id}` |
| Category pages | 5 min | `category-{id}` |
| Homepage | 5 min | `featured-products` |
| Navigation | 1 hour | — |
| Cart / Checkout | No cache | `cache: "no-cache"` |

### On-demand revalidation

```bash
curl "https://shop.rh.shadoll.dev/api/revalidate?secret=XXX&path=/products/my-product"
```

Or configure Saleor webhooks (product.updated → POST /api/revalidate).

---

## Development

```bash
pnpm install
cp .env.example .env.local
# fill in env vars above
pnpm dev                     # http://localhost:3000
```

After `.graphql` changes:
```bash
pnpm run generate            # src/graphql/*.graphql
pnpm run generate:checkout   # src/checkout/graphql/*.graphql
```

Type check:
```bash
pnpm exec tsc --noEmit
```

---

## Deployment

CI/CD via GitHub Actions (`.github/workflows/build.yml`):
- Build bakes `NEXT_PUBLIC_*` vars into the image
- Pushes `ghcr.io/shkafnik/storefront:latest`
- FluxCD on `rh` cluster auto-deploys

Force re-deploy after new image:
```bash
kubectl rollout restart deployment saleor-storefront \
  -n saleor-storefront --context rh
```

---

## Key Source Files

| File | Purpose |
|------|---------|
| `src/middleware.ts` | Clean URL rewriting |
| `src/app/config.ts` | Channel slug, site config |
| `src/styles/brand.css` | Design tokens (colors, fonts) |
| `src/ui/components/logo.tsx` | Brand logo |
| `src/app/[channel]/(main)/page.tsx` | Homepage (featured products) |
| `src/lib/graphql.ts` | GraphQL client (public + authenticated) |
| `src/lib/cache-manifest.ts` | Cache profiles and tags |
| `src/graphql/*.graphql` | GraphQL queries (edit then run generate) |
