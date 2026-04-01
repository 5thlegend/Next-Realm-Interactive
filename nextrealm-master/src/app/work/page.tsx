'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowRight, TrendingUp } from 'lucide-react'

const caseStudies = [
  {
    id: 'velocity-labs',
    client: 'Velocity Labs',
    industry: 'SaaS',
    title: 'From MVP to $47K MRR in 90 days',
    description: 'Complete brand system, conversion-optimized website, and launch sequence that generated 47K in monthly recurring revenue within the first quarter.',
    results: [
      { metric: '$47K', label: 'MRR in 90 days' },
      { metric: '312%', label: 'Conversion increase' },
      { metric: '2.4M', label: 'Revenue Year 1' },
    ],
    tags: ['Web System', 'Brand Identity', 'Launch'],
  },
  {
    id: 'apex-trading',
    client: 'Apex Trading',
    industry: 'Fintech',
    title: 'Trading platform rebrand that 3x\'d signups',
    description: 'Strategic rebrand and platform redesign that transformed user acquisition and established market authority.',
    results: [
      { metric: '3.2x', label: 'Signup increase' },
      { metric: '67%', label: 'Bounce rate reduction' },
      { metric: '89%', label: 'User satisfaction' },
    ],
    tags: ['Brand Identity', 'Web System'],
  },
  {
    id: 'prime-pup',
    client: 'Prime Pup Match',
    industry: 'Luxury Services',
    title: 'Premium puppy matching concierge launch',
    description: 'End-to-end brand development and go-to-market strategy for a high-ticket concierge service targeting affluent clientele.',
    results: [
      { metric: '$12K', label: 'Avg. transaction' },
      { metric: '94%', label: 'Match success rate' },
      { metric: '47', label: 'Placements Month 1' },
    ],
    tags: ['Brand Identity', 'Launch Execution'],
  },
  {
    id: 'sw-digital',
    client: 'SW Digital',
    industry: 'Agency',
    title: 'Agency operator scaling with Forge systems',
    description: 'Deployed Forge templates and operator frameworks to scale service delivery without hiring.',
    results: [
      { metric: '3x', label: 'Client capacity' },
      { metric: '0', label: 'New hires needed' },
      { metric: '78%', label: 'Margin improvement' },
    ],
    tags: ['Forge Products', 'Retained Ops'],
  },
]

export default function WorkPage() {
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
              <div className="eyebrow mb-5">Work</div>
              <h1 className="text-hero text-text-primary mb-6">
                Results that speak.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Selected projects showcasing revenue impact, system thinking, and measurable outcomes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="pb-24">
          <div className="max-w-[1400px] mx-auto container-padding">
            <div className="grid gap-5">
              {caseStudies.map((study, i) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/work/${study.id}`}>
                    <div className="group glass-panel rounded-panel p-8 transition-all duration-500 hover:-translate-y-1">
                      <div className="grid lg:grid-cols-[1fr_auto] gap-8">
                        {/* Content */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                              {study.client}
                            </span>
                            <span className="text-text-faint">•</span>
                            <span className="text-xs text-text-muted">{study.industry}</span>
                          </div>

                          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-gold transition-colors">
                            {study.title}
                          </h2>

                          <p className="text-text-secondary mb-6 max-w-2xl">
                            {study.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {study.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1.5 rounded-pill bg-white/[0.03] border border-white/[0.08] text-xs text-text-muted"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Results */}
                        <div className="flex flex-wrap lg:flex-col gap-4 lg:gap-3 lg:min-w-[160px]">
                          {study.results.map((result) => (
                            <div
                              key={result.label}
                              className="p-3 rounded-card bg-black/30 border border-white/[0.06] text-center min-w-[120px]"
                            >
                              <div className="text-xl font-bold text-gold">{result.metric}</div>
                              <div className="text-[10px] text-text-muted uppercase tracking-wider">
                                {result.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all">
                        View Case Study <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
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
                Your project could be next.
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                Let's talk about how we can generate similar results for your business.
              </p>
              <Link href="/contact">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Start a Project</span>
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
