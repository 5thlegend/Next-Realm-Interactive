'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Package, FileCode, BookOpen, Layers, ArrowRight, Filter } from 'lucide-react'

const categories = ['All', 'Templates', 'Playbooks', 'Frameworks', 'Packs']

const products = [
  {
    id: 'launch-system-pro',
    title: 'Launch System Pro',
    description: 'Complete launch checklist, timeline templates, and automation sequences for product releases.',
    price: 149,
    category: 'Frameworks',
    icon: Layers,
    featured: true,
    badge: 'Best Seller',
  },
  {
    id: 'brand-blueprint-kit',
    title: 'Brand Blueprint Kit',
    description: 'Visual identity system with logo guidelines, color specs, typography, and asset templates.',
    price: 89,
    category: 'Templates',
    icon: FileCode,
  },
  {
    id: 'operator-playbook',
    title: 'Operator Playbook',
    description: 'SOPs, client management templates, and scaling frameworks for agency operators.',
    price: 199,
    category: 'Playbooks',
    icon: BookOpen,
    badge: 'New',
  },
  {
    id: 'conversion-stack',
    title: 'Conversion Stack',
    description: 'Landing page templates, CTA components, and A/B testing frameworks.',
    price: 79,
    category: 'Packs',
    icon: Package,
  },
  {
    id: 'seo-foundation-kit',
    title: 'SEO Foundation Kit',
    description: 'Technical SEO checklists, keyword research templates, and content optimization guides.',
    price: 59,
    category: 'Templates',
    icon: FileCode,
  },
  {
    id: 'client-onboarding-system',
    title: 'Client Onboarding System',
    description: 'Complete onboarding flow with contracts, questionnaires, and project kickoff templates.',
    price: 129,
    category: 'Frameworks',
    icon: Layers,
  },
  {
    id: 'content-calendar-pro',
    title: 'Content Calendar Pro',
    description: '12-month content planning system with templates for social, blog, and email.',
    price: 49,
    category: 'Templates',
    icon: FileCode,
  },
  {
    id: 'pricing-strategy-playbook',
    title: 'Pricing Strategy Playbook',
    description: 'Frameworks for service pricing, packaging, and value communication.',
    price: 99,
    category: 'Playbooks',
    icon: BookOpen,
  },
]

export default function ForgePage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-padding">
          <div className="max-w-[1400px] mx-auto container-padding">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="eyebrow mb-5">Next Realm Forge</div>
              <h1 className="text-hero text-text-primary mb-6">
                Systems you can buy.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Templates, playbooks, and operating frameworks built for immediate deployment. 
                High-margin digital assets that generate income on autopilot.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter + Products */}
        <section className="pb-24">
          <div className="max-w-[1400px] mx-auto container-padding">
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-text-muted mr-2" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-4 py-2 rounded-pill text-sm font-semibold whitespace-nowrap transition-all
                    ${activeCategory === category
                      ? 'bg-gold text-void'
                      : 'bg-white/[0.03] border border-white/[0.08] text-text-secondary hover:border-gold/30 hover:text-gold'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product, i) => {
                const Icon = product.icon
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link href={`/forge/${product.id}`}>
                      <div className={`
                        group h-full p-6 rounded-card border transition-all duration-500 cursor-pointer
                        ${product.featured 
                          ? 'border-gold/30 bg-gold/[0.03]' 
                          : 'border-white/[0.08] bg-white/[0.015]'
                        }
                        hover:border-gold/40 hover:-translate-y-1 hover:shadow-glow-gold
                      `}>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <Icon className={`w-6 h-6 ${product.featured ? 'text-gold' : 'text-text-muted'}`} />
                          {product.badge && (
                            <span className={`
                              px-2 py-1 rounded-pill text-[9px] font-bold uppercase tracking-wider
                              ${product.badge === 'Best Seller' ? 'bg-gold/20 text-gold' : 'bg-cyan/20 text-cyan'}
                            `}>
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Category */}
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                          {product.category}
                        </span>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-text-primary mt-2 mb-2 group-hover:text-gold transition-colors">
                          {product.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                          <span className="text-2xl font-bold text-gold">${product.price}</span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted group-hover:text-gold transition-colors flex items-center gap-1">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display text-text-primary mb-4">
                Need something custom?
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                If you don't see what you need, we can build it for you.
              </p>
              <Link href="/services">
                <motion.button
                  className="btn-ghost"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Services
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
