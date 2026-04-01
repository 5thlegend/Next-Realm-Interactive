# Next Realm Interactive — Master Site

A unified digital platform functioning as three things simultaneously:
1. **Premium Agency Front-End** — Services, case studies, contact
2. **Digital Product Storefront (Forge)** — Templates, playbooks, frameworks
3. **Operator Network Portal** — Role-gated dashboards, project fulfillment

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + CSS Custom Properties
- **Animation:** Framer Motion + GSAP (ready)
- **CMS:** Sanity.io (planned)
- **Auth:** Clerk (planned)
- **Payments:** Stripe Checkout + Billing + Connect (planned)
- **Database:** Supabase (planned)
- **Hosting:** Vercel

## Design System — Neon Arcane Cinema

### Colors
- **Void:** `#050505` (primary), `#0a0a0e` (elevated), `#0d0d12` (surface)
- **Gold:** `#c9a24d` (primary), `#e0b85a` (bright), `#9a7a3a` (muted)
- **Cyan:** `#00d4ff` (primary), `#4de8ff` (bright)
- **Purple:** `#8b5cf6` (accent)

### Radius
- Buttons: `14px`
- Cards: `20px`
- Panels: `24px`
- Pills: `999px`

### Glass Panels
```css
background: linear-gradient(180deg, rgba(13, 13, 18, 0.95) 0%, rgba(10, 10, 14, 0.98) 100%);
backdrop-filter: blur(24px);
border: 1px solid rgba(201, 162, 77, 0.2);
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── services/             # Services pages
│   ├── forge/                # Digital products storefront
│   ├── operators/            # Operator network
│   ├── portal/               # Auth-gated dashboard
│   ├── work/                 # Case studies
│   ├── membership/           # Subscription tiers
│   ├── blog/                 # Content marketing
│   ├── about/                # Company info
│   └── contact/              # Contact form
├── components/
│   ├── layout/               # Header, Footer
│   ├── sections/             # Homepage sections
│   └── ui/                   # Reusable components
├── lib/                      # Utilities
└── styles/
    └── globals.css           # Design system
```

## Revenue Streams (7 Total)

| Stream | Price Range | Margin | Page |
|--------|------------|--------|------|
| High-ticket builds | $3K–$25K+ | 60-70% | /services |
| Monthly retainers | $500–$5K/mo | 70-80% | /services |
| Digital products | $29–$499 | ~95% | /forge |
| Membership access | $19–$99/mo | ~90% | /membership |
| Operator revenue share | 20-30% cut | 100% | /operators |
| System licensing | $499–$2,500+ | ~95% | /forge |
| Affiliate marketplace | Commission | 100% | /forge |

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo to Vercel
3. Deploy automatically

### Environment Variables (Future)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

---

**Built by Next Realm Interactive**
Systems built for operators, brands, and revenue.
