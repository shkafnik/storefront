# Saleor Data Entry Guide

Step-by-step instructions to fill products and configure Saleor for the furniture store.

---

## Step 1: Create Product Attributes

**Dashboard → Catalog → Attributes → Create Attribute**

Do this before creating Product Types (types reference attributes).

### Attributes to create

| Name | Slug | Input Type | Values |
|------|------|-----------|--------|
| Upholstery Material | `upholstery-material` | Dropdown | Fabric, Leather, Velvet, Faux Leather, Bouclé, Chenille |
| Frame Material | `frame-material` | Dropdown | Solid Wood, MDF, Metal Frame, Plywood |
| Wood Species | `wood-species` | Dropdown | Solid Oak, Solid Walnut, Solid Pine, Beech, MDF+Veneer, Plywood |
| Finish | `finish` | Dropdown | Natural Oil, White Oil, Black Stain, Wax, Lacquer, Painted |
| Color / Finish | `color-finish` | Multi-select | See palette in catalog-structure.md |
| Number of Seats | `num-seats` | Numeric | — |
| Width (cm) | `width-cm` | Numeric | — |
| Height (cm) | `height-cm` | Numeric | — |
| Depth (cm) | `depth-cm` | Numeric | — |
| Shape | `shape` | Dropdown | Rectangular, Round, Oval, Square |
| Extendable | `extendable` | Boolean | — |
| Door Type | `door-type` | Dropdown | Hinged, Sliding, Open, Glass-fronted |
| Number of Shelves | `num-shelves` | Numeric | — |
| Mattress Size | `mattress-size` | Dropdown | Single (90×200), Double (140×200), Queen (160×200), King (180×200), Super King (200×200) |
| Under-bed Storage | `under-bed-storage` | Boolean | — |
| Adjustable Height | `adjustable-height` | Boolean | — |
| Assembly Required | `assembly-required` | Boolean | — |
| Weight (kg) | `weight-kg` | Numeric | — |
| Leg Material | `leg-material` | Dropdown | Wood, Metal, Plastic |

> **Note**: Attributes used for **variant selection** (e.g., Color, Size) must have "Used in variant selection" enabled.

---

## Step 2: Create Product Types

**Dashboard → Catalog → Product Types → Create**

For each type, assign the relevant attributes from Step 1.

See [catalog-structure.md](./catalog-structure.md) for the full attribute lists per type.

Types to create:
- `Upholstered Furniture`
- `Case Furniture — Wood`
- `Beds`
- `Office Furniture`

---

## Step 3: Create Category Tree

**Dashboard → Catalog → Categories → Create Category**

Create in this order (parents first):

1. Sofas & Sectionals → then sub: 2-Seat Sofas, 3-Seat Sofas, Corner Sofas
2. Chairs & Armchairs → then sub: Armchairs, Dining Chairs, Office Chairs
3. Tables → then sub: Dining Tables, Coffee Tables, Side Tables, Desks
4. Bedroom → then sub: Beds, Nightstands
5. Storage → then sub: Wardrobes, Shelving Units, Cabinets
6. Outdoor

---

## Step 4: Create Collections

**Dashboard → Catalog → Collections → Create**

Essential collections (storefront code expects `featured-products` slug):

1. `featured-products` — "Featured Products"
2. `new-arrivals` — "New Arrivals"
3. `living-room` — "Living Room"
4. `bedroom` — "Bedroom"
5. `home-office` — "Home Office"
6. `bestsellers` — "Bestsellers"
7. `sale` — "Sale"

For each collection: set Published = Yes, assign to `default-channel`.

---

## Step 5: Create Navigation Menus

**Dashboard → Navigation → Create Menu**

### Navbar Menu (slug: `navbar`)

Items:
- Sofas & Sectionals → link to category
- Chairs & Armchairs → link to category
- Tables → link to category
- Bedroom → link to category
- Storage → link to category
- Sale → link to collection

### Footer Menu (slug: `footer`)

Items:
- About Us → custom URL `/pages/about`
- Delivery Info → custom URL `/pages/delivery`
- Returns → custom URL `/pages/returns`
- Contact → custom URL `/pages/contact`
- Privacy Policy → custom URL `/pages/privacy-policy`

---

## Step 6: Configure Shipping

**Dashboard → Shipping → Create Shipping Zone**

1. Name: "Domestic"
2. Countries: Add your delivery countries
3. Click Save
4. Add Shipping Method:
   - Name: "Standard Delivery"
   - Type: Price-based or Weight-based
   - Minimum order value: 0
   - Add rate (e.g., $15 flat rate)
5. Go to **Channels** tab → assign to `default-channel`

---

## Step 7: Configure Payment

**Dashboard → Channels → default-channel → Payment gateways**

For testing: enable **"Mirumee.Payments.Dummy"** (dummy payment gateway).
For production: configure Stripe or another gateway.

---

## Step 8: Add Products

**Dashboard → Catalog → Products → Create Product**

Per-product checklist:
```
□ Product Type: select correct type (Upholstered / Case Wood / Bed / Office)
□ Name: clear, SEO-friendly name
□ Category: most specific subcategory
□ Description: rich text with features, materials, care instructions
□ SEO title / SEO description
□ Add Variant(s):
    □ Variant name (e.g., "Natural Oak / 180cm")
    □ SKU (e.g., DT-OAK-180)
    □ Price in default-channel
    □ Stock: create at Default Warehouse (set qty > 0)
□ Media: upload 3+ images (front, side, lifestyle)
□ Attributes: fill all relevant attributes
□ Channel availability:
    □ Availability: Published
    □ Available for purchase: Yes, date in the past
    □ Visible in listings: Yes
□ Add to Collections: featured-products (and others as appropriate)
```

---

## Step 9: Verify End-to-End

After adding at least one real product:

1. Open https://shop.rh.shadoll.dev
2. Product should appear in homepage grid (if in `featured-products` collection)
3. Open product page → add to cart
4. Complete checkout with Dummy payment
5. Check order in Dashboard → Orders

---

## Quick Reference: Product Visibility Checklist

A product is visible in the storefront only if ALL are true:
- `isAvailableForPurchase: true` with date in the past
- At least one variant with SKU and price in `default-channel`  
- Stock > 0 at Default Warehouse
- `visibleInListings: true`
- Published in `default-channel`

If a product doesn't appear: check each point above in the Dashboard.
