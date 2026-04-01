'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Check, X } from 'lucide-react'

const tiers = [
  {
    name: 'Community',
    price: 19,
    description: 'Connect with operators and builders.',
    features: [
      { name: 'Discord community access', included: true },
      { name: 'Monthly office hours', included: true },
      { name: 'Resource library', included: true },
      { name: 'Forge discounts', included: false },
      { name: 'Priority support', included: false },
      { name: 'Operator dashboard', included: false },
      { name: 'Project referrals', included: false },
      { name: 'Revenue share', included: false },
    ],
    accent: 'default',
  },
  {
    name: 'Builder',
    price: 49,
    description: 'Forge discounts and priority support.',
    features: [
      { name: 'Discord community access', included: true },
      { name: 'Monthly office hours', included: true },
      { name: 'Resource library', included: true },
      { name: '25% off Forge products', included: true },
      { name: 'Priority support queue', included: true },
      { name: 'Operator dashboard', included: false },
      { name: 'Project referrals', included: false },
      { name: 'Revenue share', included: false },
    ],
    accent: 'gold',
    popular: true,
  },
  {
    name: 'Operator',
    price: 99,
    description: 'Full system access and deal flow.',
    features: [
      { name: 'Discord community access', included: true },
      { name: 'Monthly office hours', included: true },
      { name: 'Resource library', included: true },
      { name: '50% off Forge products', included: true },
      { name: 'Priority support queue', included: true },
      { name: 'Operator dashboard access', included: true },
      { name: 'Project referral pipeline', included: true },
      { name: 'Revenue share program', included: true },
    ],
    accent: 'cyan',
  },
]

const faqs = [
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards through Stripe. Enterprise invoicing available for annual plans.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Not currently, but all plans have a 14-day money-back guarantee.',
  },
  {
    q: 'How does the Operator revenue share work?',
    a: 'Operators earn a percentage of project revenue for work they fulfill. Rates increase based on performance and tenure.',
  },
]

export default function MembershipPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-padding">
          <div className="max-w-[1400px] mx-auto container-padding">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="eyebrow mx-auto mb-5">Membership</div>
              <h1 className="text-hero text-text-primary mb-6">
                Go deeper. Stay connected.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Monthly access tiers that unlock community, discounts, tools, and operator-level opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24">
          <div className="max-w-[1000px] mx-auto container-padding">
            <div className="grid md:grid-cols-3 gap-5">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`
                    relative p-6 rounded-panel border transition-all duration-300
                    ${tier.popular 
                      ? 'border-gold/40 bg-gold/[0.03] scale-105 z-10' 
                      : 'border-white/[0.08] bg-white/[0.015]'
                    }
                  `}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-pill bg-gold text-void text-[10px] font-bold uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                    tier.accent === 'gold' ? 'text-gold' : tier.accent === 'cyan' ? 'text-cyan' : 'text-text-muted'
                  }`}>
                    {tier.name}
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-text-primary">${tier.price}</span>
                    <span className="text-text-muted">/mo</span>
                  </div>

                  <p className="text-sm text-text-muted mb-6">{tier.description}</p>

                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            tier.accent === 'gold' ? 'text-gold' : tier.accent === 'cyan' ? 'text-cyan' : 'text-text-muted'
                          }`} />
                        ) : (
                          <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-faint" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-text-secondary' : 'text-text-faint'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button className={`
                    w-full py-3 rounded-btn text-[12px] font-bold uppercase tracking-[0.06em]
                    transition-all duration-300
                    ${tier.popular 
                      ? 'bg-gradient-gold text-void hover:shadow-glow-gold' 
                      : 'bg-transparent border border-white/20 text-text-primary hover:border-white/40'
                    }
                  `}>
                    Get Started
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto container-padding">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display text-text-primary">Common questions</h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-card border border-white/[0.08] bg-white/[0.015]"
                >
                  <h3 className="text-lg font-bold text-text-primary mb-2">{faq.q}</h3>
                  <p className="text-text-muted">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display text-text-primary mb-4">
                Questions before you commit?
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                Reach out and we'll help you find the right fit.
              </p>
              <Link href="/contact">
                <motion.button
                  className="btn-ghost"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get in Touch
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
