'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const tiers = [
  {
    name: 'Community',
    price: 19,
    description: 'Connect with operators and builders.',
    features: [
      'Discord community access',
      'Monthly office hours',
      'Resource library',
    ],
    accent: 'default',
  },
  {
    name: 'Builder',
    price: 49,
    description: 'Forge discounts and priority support.',
    features: [
      'Everything in Community',
      '25% off Forge products',
      'Priority support queue',
      'Early access to new systems',
    ],
    accent: 'gold',
    popular: true,
  },
  {
    name: 'Operator',
    price: 99,
    description: 'Full system access and deal flow.',
    features: [
      'Everything in Builder',
      'Operator dashboard access',
      'Project referral pipeline',
      'Revenue share program',
    ],
    accent: 'cyan',
  },
]

export function MembershipSection() {
  return (
    <section className="section-padding relative border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto container-padding">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-display text-text-primary mb-4">
            Go deeper. Stay connected.
          </h2>
          <p className="text-lg text-text-secondary">
            Monthly access tiers that unlock community, discounts, and operator-level tools.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`
                relative p-6 rounded-panel border transition-all duration-300
                ${tier.popular 
                  ? 'border-gold/40 bg-gold/[0.03]' 
                  : 'border-white/[0.08] bg-white/[0.015]'
                }
                hover:-translate-y-1
              `}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-pill bg-gold text-void text-[10px] font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                tier.accent === 'gold' ? 'text-gold' : tier.accent === 'cyan' ? 'text-cyan' : 'text-text-muted'
              }`}>
                {tier.name}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-text-primary">${tier.price}</span>
                <span className="text-text-muted">/mo</span>
              </div>

              {/* Description */}
              <p className="text-sm text-text-muted mb-6">
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      tier.accent === 'gold' ? 'text-gold' : tier.accent === 'cyan' ? 'text-cyan' : 'text-text-muted'
                    }`} />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/membership" className="block">
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
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            href="/membership" 
            className="inline-flex items-center gap-2 text-text-muted hover:text-gold transition-colors"
          >
            <span className="text-sm">Compare all features</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
