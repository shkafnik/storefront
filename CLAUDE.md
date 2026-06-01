# Claude / Copilot Instructions — shkafnik/storefront

This is the **Saleor Paper storefront** customized for the `rh` k3s cluster,
deployed at `https://shop.rh.shadoll.dev`.

---

## Live Instance

| Resource               | URL                                              |
| ---------------------- | ------------------------------------------------ |
| Storefront             | https://shop.rh.shadoll.dev                      |
| Saleor GraphQL (read)  | https://shale.rh.shadoll.dev/graphql/            |
| Saleor Dashboard       | https://shale.rh.shadoll.dev/dashboard/          |
| Saleor MCP (read-only) | https://saleor-mcp.rh.shadoll.dev/mcp            |
| GraphQL Bridge (write) | https://saleor-bridge.rh.shadoll.dev/graphql     |
| GHCR Image             | ghcr.io/shkafnik/storefront:latest               |

### Key Saleor Objects

| Object           | ID / Slug                                                              |
| ---------------- | ---------------------------------------------------------------------- |
| Channel          | `default-channel` (`Q2hhbm5lbDox`)                                    |
| Default Warehouse| `V2FyZWhvdXNlOjM1NjFhNmMxLTY1OWEtNGU3Ni04YzkyLWRjZWUyMjQ5MzI3NQ==`  |

---

## Environment

Local `.env.local` (not committed):

```env
NEXT_PUBLIC_SALEOR_API_URL=https://shale.rh.shadoll.dev/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://shop.rh.shadoll.dev
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

Build-time environment variables are baked in via GitHub Actions
(`.github/workflows/build.yml`) — no runtime injection needed.

---

## Clean-URL Patches

This fork removes the `/{channel}/` segment from all storefront URLs so that
`/products/my-product` works instead of `/default-channel/products/my-product`.

### How it works

1. **`src/middleware.ts`** — transparently rewrites clean URLs to the
   channel-prefixed internal Next.js routes at request time.  
   Skips: `/_next`, `/api`, `/checkout`, static files, already-prefixed paths.

2. **`src/ui/atoms/link-with-channel.tsx`** — simplified to a plain passthrough
   `<Link>` (no channel prepending on links).

3. **`src/ui/components/plp/utils.ts`** — `transformToProductCard` now emits
   `/products/{slug}` instead of `/{channel}/products/{slug}`.  
   Parameter renamed `_channel` to suppress the unused-variable TS error.

4. **`src/ui/components/footer.tsx`** — logo link changed from `/{channel}` to `/`.

> **Important**: If you ever upgrade from upstream `saleor/storefront`, re-apply
> these four patches. The key invariant: no user-visible URL should contain a
> channel segment.

---

## Saleor MCP (Read-Only)

The MCP server at `https://saleor-mcp.rh.shadoll.dev/mcp` exposes Saleor data
via the Model Context Protocol (read-only).

- No auth token required for read operations via the MCP endpoint.
- Use this to inspect products, categories, channels, orders.

Example (curl):
```bash
curl -X POST https://saleor-mcp.rh.shadoll.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

---

## GraphQL Bridge (Write Access)

For mutations (creating products, updating stock, etc.) use the bridge endpoint:

```
https://saleor-bridge.rh.shadoll.dev/graphql
```

The bridge accepts an `Authorization: Bearer <token>` header.  
The RW token is stored as sealed secret `saleor-env` key `SALEOR_BRIDGE_RW_TOKEN`
in the `saleor` namespace on the `rh` cluster.

**To run a mutation locally** (requires the token):
```bash
curl -X POST https://saleor-bridge.rh.shadoll.dev/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <RW_TOKEN>" \
  -d '{"query":"mutation { ... }"}'
```

### Common write operations

**Make a product visible in listings:**
```graphql
mutation {
  productUpdate(id: "UHJvZHVjdDox", input: {
    visibleInListings: true
    isAvailableForPurchase: true
    availableForPurchaseDate: "2020-01-01"
  }) {
    product { id name }
    errors { field message }
  }
}
```

**Create stock for a variant:**
```graphql
mutation {
  productVariantStocksCreate(variantId: "UHJvZHVjdFZhcmlhbnQ6MQ==", stocks: [
    { warehouse: "V2FyZWhvdXNlOjM1NjFhNmMxLTY1OWEtNGU3Ni04YzkyLWRjZWUyMjQ5MzI3NQ==", quantity: 100 }
  ]) {
    productVariant { id }
    errors { field message }
  }
}
```

---

## Product Visibility Checklist

A product must satisfy **all** of the following to appear in the storefront:

- [ ] `isAvailableForPurchase: true` with `availableForPurchaseAt` in the past
- [ ] At least one variant with an SKU and a price in `default-channel`
- [ ] Stock created at Default Warehouse (quantity > 0)
- [ ] `visibleInListings: true`
- [ ] Published in `default-channel`

---

## Deployment

Container image is built and pushed by GitHub Actions on every push to `main`.

```
.github/workflows/build.yml
  → builds Next.js with NEXT_PUBLIC_* args baked in
  → pushes ghcr.io/shkafnik/storefront:latest
  → also tags :<run_number>
```

k3s manifests live in `shadoll/k3s` at:
```
clusters/rh/apps/saleor-storefront/
├── namespace.yaml
├── deployment.yaml   ← image: ghcr.io/shkafnik/storefront:latest
├── service.yaml
├── ingress.yaml
└── kustomization.yaml
```

FluxCD on the `rh` cluster auto-deploys on Git push to `shadoll/k3s:main`.

**To force a re-deploy after a new image is pushed:**
```bash
kubectl rollout restart deployment saleor-storefront \
  -n saleor-storefront --context rh
```

**To check pod status:**
```bash
kubectl get pods -n saleor-storefront --context rh
kubectl logs -n saleor-storefront -l app=saleor-storefront --context rh
```

---

## Local Development

```bash
cp .env.example .env.local
# fill in values above
pnpm install
pnpm dev          # http://localhost:3000
```

After any `.graphql` file change:
```bash
pnpm run generate
```

Type check before push:
```bash
pnpm exec tsc --noEmit
pnpm run build
```
