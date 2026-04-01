'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Package, FileCode, BookOpen, Layers } from 'lucide-react'

const products = [
  {
    id: 'launch-system',
    title: 'Launch System Pro',
    description: 'Complete launch checklist, timeline templates, and automation sequences for product releases.',
    price: 149,
    category: 'Framework',
    icon: Layers,
    featured: true,
  },
  {
    id: 'brand-blueprint',
    title: 'Brand Blueprint Kit',
    description: 'Visual identity system with logo guidelines, color specs, typography, and asset templates.',
    price: 89,
    category: 'Template',
    icon: FileCode,
  },
  {
    id: 'operator-playbook',
    title: 'Operator Playbook',
    description: 'SOPs, client management templates, and scaling frameworks for agency operators.',
    price: 199,
    category: 'Playbook',
    icon: BookOpen,
  },
  {
    id: 'conversion-pack',
    title: 'Conversion Stack',
    description: 'Landing page templates, CTA components, and A/B testing frameworks.',
    price: 79,
    category: 'Pack',
    icon: Package,
  },
]

export function ForgeSection() {
  return (
    <section className="section-padding relative border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto container-padding">
        
        {/* Section Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="eyebrow mb-5">Next Realm Forge</div>
            <h2 className="text-display text-text-primary">
              Systems you can buy.
            </h2>
          </div>
          <Link href="/forge" className="group flex items-center gap-2 text-gold hover:text-gold-bright transition-colors">
            <span className="font-semibold">View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, i) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/forge/${product.id}`} className="block h-full">
                  <div 
                    className={`
                      h-full p-6 rounded-card border transition-all duration-500 group cursor-pointer
                      ${product.featured 
                        ? 'border-gold/30 bg-gold/[0.03]' 
                        : 'border-white/[0.08] bg-white/[0.015]'
                      }
                      hover:border-gold/40 hover:-translate-y-1 hover:shadow-glow-gold
                    `}
                  >
                    {/* Category & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                        {product.category}
                      </span>
                      <Icon className={`w-5 h-5 ${product.featured ? 'text-gold' : 'text-text-muted'}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-gold transition-colors">
                      {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-muted leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
                      <span className="text-xl font-bold text-gold">${product.price}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted group-hover:text-gold transition-colors flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Featured badge */}
                    {product.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 rounded-pill bg-gold/20 text-[9px] font-bold uppercase tracking-widest text-gold">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
