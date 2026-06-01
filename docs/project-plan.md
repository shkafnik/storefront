# Master Project Plan — Shkafnik Furniture Storefront

**Company**: Shkafnik (Шкафник) — Ukrainian furniture manufacturer  
**Brand reference**: https://shkafnik.com (colors/fonts only — new site has different categories)  
**Goal**: Fully working e-commerce system for retail sales + product catalog — desk-focused  
**Stack**: Saleor (backend) + Next.js storefront (shkafnik-storefront)

---

## Current State (1 June 2026)

| Component           | Status         | Notes                                                  |
| ------------------- | -------------- | ------------------------------------------------------ |
| Storefront codebase | ✅ Running     | Deployed at shop.rh.shadoll.dev                        |
| Clean URLs          | ✅ Applied     | No `/channel/` prefix in URLs                          |
| Channel             | ✅ Exists      | `default-channel`, USD, US, Default Warehouse          |
| Test product        | ✅ Created     | "Bridge Test Product" — $9.99, qty 100 in stock        |
| Real products       | ❌ Not added   | Pending catalog setup below                            |
| Categories          | ⚠️ Stub only  | "Default Category" — needs real furniture taxonomy     |
| Product Types       | ⚠️ Stub only  | "Default Type" — needs furniture-specific attributes   |
| Checkout flow       | ✅ Code ready  | Needs end-to-end test with real product                |
| Payment             | ❌ Not tested  | Needs payment gateway configured in Saleor             |
| Manager order flow  | ❌ Not tested  | Needs real order to process                            |
| Email notifications | ❌ Unknown     | Needs verification in Saleor settings                  |
| Homepage featured   | ⚠️ Empty      | Needs "featured-products" collection created           |

---

## Phase 1 — Catalog Foundation [ ]

> Set up Saleor data structures before filling products.

### 1.1 Create Product Types with Attributes [ ]

All done in **Saleor Dashboard → Catalog → Product Types**.

See [catalog-structure.md](./catalog-structure.md) for full attribute details.

**Product Type: Desks** (primary — start here)
- Attributes: Material, Color/Finish, Width/Height/Depth (cm), With Hutch, With Drawers, Number of Drawers, With Cabinet, Assembly Required, Weight (kg)
- Variants: Color/Finish (White, Wenge, Sonoma Oak, etc.) and/or Width

**Additional product types**: define together with the owner as more categories are added.

### 1.2 Create Categories [ ]

All in **Saleor Dashboard → Catalog → Categories**.

Start with **Desks** as the first category.  
Add further categories as the product range is confirmed with the owner.

> Do NOT copy from old site (nikamebel.info / shkafnik.com) — new site has different categories.

### 1.3 Create Collections [ ]

Collections drive homepage sections and cross-category groupings.

| Collection slug     | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `featured-products` | Homepage grid — **required by storefront code**      |
| `new-arrivals`      | New items                                            |
| `bestsellers`       | Top sellers                                          |
| `sale`              | Discounted items                                     |

### 1.4 Set Shipping Zones & Methods [ ]

In **Saleor Dashboard → Shipping**.
- Create "Domestic" shipping zone → add flat-rate or weight-based method
- Assign to `default-channel`
- Without this, checkout will fail at the shipping step

### 1.5 Configure Payment Gateway [ ]

In **Saleor Dashboard → Channels → default-channel → Payment gateways**.
- For testing: enable "Dummy payment" gateway
- For production: configure Stripe / Adyen / etc.

---

## Phase 2 — Product Content [ ]

> Add real products with full data. See [catalog-structure.md](./catalog-structure.md) for templates.

### 2.1 Prepare product images [ ]
- Photos stored in Saleor at `https://shale.rh.shadoll.dev/media/products/`
- Upload via Dashboard: Products → (product) → Media tab
- Recommended: 1:1 aspect ratio, min 800×800px, WebP or JPEG
- Multiple angles: front, side, detail, lifestyle/room context

### 2.2 Add first real products — Desks [ ]
Per-product checklist (see Saleor product visibility rules in CLAUDE.md):
- [ ] Product Type: Desks
- [ ] Correct Category assigned
- [ ] Description (rich text) — include dimensions, materials, features
- [ ] At least 1 image uploaded (1:1 ratio, min 800×800px, white bg preferred)
- [ ] SEO title + description filled
- [ ] Variants set up (by Color/Finish and/or Size)
- [ ] Each variant: SKU, price in `default-channel`, stock at Default Warehouse (qty > 0)
- [ ] `visibleInListings: true`
- [ ] `isAvailableForPurchase: true` (date in the past)
- [ ] Published in `default-channel`
- [ ] Added to `featured-products` collection (for homepage)

### 2.3 Add remaining catalog [ ]
- Add other product categories as confirmed with owner
- Each product: complete attributes, 3+ images, rich description

---

## Phase 3 — Storefront Customization [ ]

> Customize the storefront for the furniture brand.

### 3.1 Branding [ ]
- [ ] Update `src/styles/brand.css` — primary `#3A7456`, background `#EBF7E4`, gold accent `#C8960A`
- [ ] Add fonts: `Exo 2` + `Open Sans` (Google Fonts, Cyrillic subset) to `src/app/layout.tsx`
- [ ] Replace logo in `src/ui/components/logo.tsx` with Shkafnik logo
- [ ] Update site metadata title/description in `src/app/config.ts` and page metadata
- [ ] Favicon / OG image in `src/app/` (apple-icon.png, icon.png, opengraph-image.png)

### 3.2 Homepage [ ]
- [ ] Hero banner section (static or CMS-driven)
- [ ] Featured products grid (auto-populated once `featured-products` collection is filled)
- [ ] Room category quick-links section
- [ ] About/USP section (quality craftsmanship message)

### 3.3 Navigation [ ]
- [ ] Create "navbar" menu in Saleor Dashboard → Navigation
- [ ] Create "footer" menu in Saleor Dashboard → Navigation
- [ ] Both menus auto-render in storefront header/footer

### 3.4 PDP (Product Detail Page) [ ]
- [ ] Verify attribute display (dimensions, material, etc.)
- [ ] Verify image gallery works with multiple images
- [ ] Verify variant selection (color/size pickers)
- [ ] Add "Assembly Required" notice display if attribute is true
- [ ] Add dimensions table section

### 3.5 Delivery & Shipping info [ ]
- [ ] Add static delivery info page (`/pages/delivery`)
- [ ] Create page in Saleor Dashboard → Pages

---

## Phase 4 — End-to-End Flow Testing [ ]

### 4.1 Client Purchase Flow [ ]
Steps to verify end-to-end:
1. [ ] Browse homepage → see products
2. [ ] Open category page → filter/sort works
3. [ ] Open PDP → select variant → Add to Cart
4. [ ] Open cart drawer → adjust quantity → proceed to checkout
5. [ ] Checkout: enter email → shipping address → select shipping method
6. [ ] Checkout: enter payment → confirm order
7. [ ] Order confirmation page shown
8. [ ] Confirmation email received (if email configured)

### 4.2 Manager Order Flow [ ]
Steps verified in Saleor Dashboard:
1. [ ] New order appears in Dashboard → Orders
2. [ ] Order status: Unfulfilled, Payment: Paid
3. [ ] Create fulfillment: mark items as shipped, enter tracking number
4. [ ] Order status changes to: Fulfilled
5. [ ] (Optional) Issue refund via Dashboard
6. [ ] (Optional) Cancel order via Dashboard

See [order-flows.md](./order-flows.md) for detailed flow diagrams.

---

## Phase 5 — Polish & Production Readiness [ ]

### 5.1 SEO [ ]
- [ ] Unique meta title/description per product and category
- [ ] JSON-LD structured data (Product schema)
- [ ] Sitemap generation
- [ ] robots.txt

### 5.2 Performance [ ]
- [ ] Run Lighthouse audit
- [ ] Verify ISR / Cache Components are working
- [ ] Set up Saleor webhooks for on-demand revalidation

### 5.3 Currency / Locale [ ]
- [ ] Confirm USD is correct, or change channel currency
- [ ] Confirm country tax settings in Saleor

### 5.4 Security [ ]
- [ ] Remove "Dummy" payment gateway in production
- [ ] Verify REVALIDATE_SECRET and SALEOR_WEBHOOK_SECRET are set
- [ ] Verify SALEOR_APP_TOKEN is not exposed to client

---

## Progress Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
