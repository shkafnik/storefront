# Shkafnik Storefront — Project Docs

Furniture company retail shop & product catalog built on Saleor + Next.js.

## Live URLs

| Resource           | URL                                      |
| ------------------ | ---------------------------------------- |
| Storefront         | https://shop.rh.shadoll.dev              |
| Saleor Dashboard   | https://shale.rh.shadoll.dev/dashboard/  |
| Saleor GraphQL     | https://shale.rh.shadoll.dev/graphql/    |
| GraphQL Bridge     | https://saleor-bridge.rh.shadoll.dev/graphql |

## Docs Index

| File                                          | Purpose                                           |
| --------------------------------------------- | ------------------------------------------------- |
| [project-plan.md](./project-plan.md)          | Master plan with progress tracking (start here)   |
| [catalog-structure.md](./catalog-structure.md)| Furniture catalog: categories, types, attributes  |
| [order-flows.md](./order-flows.md)            | Client purchase flow + manager order processing   |
| [storefront-setup.md](./storefront-setup.md)  | Storefront patches, env vars, deployment          |
| [saleor-data-guide.md](./saleor-data-guide.md)| How to fill products in Saleor (step-by-step)     |

## Quick Commands

```bash
pnpm dev                    # local dev server
pnpm run generate           # regenerate types after .graphql changes
pnpm exec tsc --noEmit      # type check
pnpm run build              # full build
```

## About Images

Saleor stores product images at `https://shale.rh.shadoll.dev/media/products/`.
Upload via: Saleor Dashboard → Products → (product) → Media tab, or via GraphQL mutation.
The storefront fetches image URLs from the API — no separate CDN needed currently.
`next.config.js` already allows all hostnames for `next/image`.
