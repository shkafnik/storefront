# Order Flows

> ⚠️ **NOTE**: The flows described below are the **classic Saleor e-commerce flow** (online payment → auto-fulfillment).
> This has **not been implemented or tested yet**.
> The actual order flow for this business needs to be designed separately — it may differ significantly
> (e.g. manual order confirmation, phone/email contact, custom delivery scheduling for large furniture items).
> **TODO**: Define and document the real business order flow before implementing checkout.

---

Two flows: **client purchases** (storefront) and **manager processes** (Saleor Dashboard).

---

## Client Purchase Flow

```
Browse                 Cart               Checkout               Confirmation
──────                 ────               ────────               ────────────

Homepage / Category    Cart Drawer        1. Email               Order # page
  ↓                      ↓               2. Shipping Address    + email receipt
Product List          Qty adjust         3. Shipping Method
  ↓                      ↓               4. Payment
PDP                   Proceed to         5. Confirm →  Saleor
  ↓                   Checkout             creates Order
Select Variant
  ↓
Add to Cart
```

### Detailed Steps

| Step | Where | What Happens |
|------|-------|-------------|
| 1. Browse | Storefront homepage / `/categories/*` | Client sees product grid |
| 2. Product page | `/products/{slug}` | View images, attributes, price, select variant |
| 3. Add to cart | PDP | Calls `CheckoutCreate` or `CheckoutAddLine` mutation; checkout ID stored in cookie |
| 4. Cart drawer | Any page | Shows current lines, qty controls, subtotal |
| 5. Checkout start | `/checkout` | Email input (creates/attaches customer) |
| 6. Shipping address | `/checkout` | Address form → `CheckoutShippingAddressUpdate` |
| 7. Shipping method | `/checkout` | Lists available methods → `CheckoutDeliveryMethodUpdate` |
| 8. Payment | `/checkout` | Payment form → gateway handles tokenization |
| 9. Confirm | `/checkout` | `CheckoutComplete` mutation → Order created in Saleor |
| 10. Success | `/orders/{number}` | Order summary, can be bookmarked |

### Prerequisites for Checkout to Work
- [ ] At least one Shipping Zone with a method assigned to `default-channel`
- [ ] Payment gateway active in `default-channel`
- [ ] Product in stock (qty > 0)
- [ ] Product published and available for purchase

---

## Manager Order Processing Flow

### Normal fulfillment

```
Dashboard → Orders → [New Order]
  │
  ├─ Check: Payment status = Paid ✓
  │
  ├─ Prepare items for shipping
  │
  ├─ Create Fulfillment
  │   Dashboard → Order → Fulfill Items
  │   Enter tracking number (optional)
  │   Click "Fulfill"
  │
  ├─ Order status → Fulfilled
  │
  └─ Customer notified (if email plugin active)
```

### Partial fulfillment (ship some items later)

```
Order with 3 items
  │
  ├─ Fulfill 2 items → status: Partially Fulfilled
  │
  └─ Fulfill remaining 1 → status: Fulfilled
```

### Refund / Cancellation

```
Cancel before fulfillment:
  Dashboard → Order → Cancel Order
  → Stock returned to warehouse
  → Payment voided (if gateway supports it)

Refund after fulfillment:
  Dashboard → Order → Refunds tab
  → Select items or enter amount
  → Process refund via payment gateway
  → Order status: Returned
```

### Manager Order Checklist

| Task | Dashboard Path | Notes |
|------|---------------|-------|
| View new orders | Orders → filter by "Unfulfilled" | Sort by date |
| Check payment | Order detail → Payment section | Must be "Paid" before shipping |
| Fulfill order | Order detail → "Fulfill Items" button | Add tracking number |
| Cancel order | Order detail → "Cancel" button | Only before fulfillment |
| Issue refund | Order detail → Refunds tab | After payment captured |
| View customer | Order detail → Customer section | Click to open customer record |
| Add order note | Order detail → Notes section | Internal notes visible to staff only |

---

## Email Notifications (Saleor)

Configure in **Dashboard → Plugins → User Emails** or **Dashboard → Apps**.

Key events:
| Event | Sent to | Trigger |
|-------|---------|---------|
| Order confirmed | Customer | Order created |
| Order fulfilled | Customer | Fulfillment created |
| Payment confirmed | Customer | Payment captured |
| Refund issued | Customer | Refund processed |
| Password reset | Customer | User requests reset |

---

## Order Status Flow

```
UNCONFIRMED → UNFULFILLED → PARTIALLY_FULFILLED → FULFILLED
                    ↓
                CANCELED
                    
Payment:  PENDING → FULLY_CHARGED → FULLY_REFUNDED
```
