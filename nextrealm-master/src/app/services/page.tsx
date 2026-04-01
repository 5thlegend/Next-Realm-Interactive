'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Check, ArrowRight, Clock, Target, Zap, Users } from 'lucide-react'

const services = [
  {
    id: 'web-systems',
    title: 'Web Systems',
    subtitle: 'Revenue-first digital infrastructure',
    description: 'Full-stack web applications, marketing sites, and conversion systems built for measurable business outcomes.',
    price: 'From $5,000',
    timeline: '4-8 weeks',
    deliverables: [
      'Custom Next.js application',
      'CMS integration',
      'Analytics & tracking',
      'SEO foundation',
      'Performance optimization',
    ],
    icon: Zap,
  },
  {
    id: 'brand-identity',
    title: 'Brand Identity',
    subtitle: 'Systems that speak before you do',
    description: 'Complete visual identity systems including strategy, logo design, typography, color systems, and brand guidelines.',
    price: 'From $3,500',
    timeline: '2-4 weeks',
    deliverables: [
      'Brand strategy document',
      'Logo system + variations',
      'Color & typography specs',
      'Brand guidelines PDF',
      'Asset library',
    ],
    icon: Target,
  },
  {
    id: 'launch-execution',
    title: 'Launch Execution',
    subtitle: 'First impressions engineered',
    description: 'End-to-end product and brand launches including campaign strategy, landing pages, email sequences, and launch day orchestration.',
    price: 'From $4,000',
    timeline: '3-6 weeks',
    deliverables: [
      'Launch strategy deck',
      'Landing page(s)',
      'Email sequence setup',
      'Social media kit',
      'Launch day coordination',
    ],
    icon: Clock,
  },
  {
    id: 'retained-ops',
    title: 'Retained Operations',
    subtitle: 'Ongoing system maintenance & growth',
    description: 'Monthly retainer for continuous development, optimization, and strategic support. Your fractional digital team.',
    price: 'From $2,000/mo',
    timeline: 'Ongoing',
    deliverables: [
      'Dedicated dev hours',
      'Priority support queue',
      'Monthly strategy call',
      'Performance reporting',
      'Continuous optimization',
    ],
    icon: Users,
  },
]

const processSteps = [
  { step: '01', title: 'Discovery', description: 'Deep dive into your goals, audience, and competitive landscape.' },
  { step: '02', title: 'Strategy', description: 'Define the approach, timeline, and success metrics.' },
  { step: '03', title: 'Design', description: 'Visual concepts and system architecture aligned to strategy.' },
  { step: '04', title: 'Build', description: 'Development with milestone reviews and iterative feedback.' },
  { step: '05', title: 'Launch', description: 'Go-live coordination, monitoring, and optimization.' },
]

export default function ServicesPage() {
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
              <div className="eyebrow mb-5">Services</div>
              <h1 className="text-hero text-text-primary mb-6">
                We build the machine for you.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                High-trust build packages, brand systems, launch execution, and retained operations. 
                Every project engineered for measurable revenue impact.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Cards */}
        <section className="pb-24">
          <div className="max-w-[1400px] mx-auto container-padding">
            <div className="grid md:grid-cols-2 gap-5">
              {services.map((service, i) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link href={`/services/${service.id}`}>
                      <div className="group h-full glass-panel rounded-panel p-8 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-card bg-gold/10 border border-gold/30 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gold">{service.price}</div>
                            <div className="text-xs text-text-muted">{service.timeline}</div>
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-text-primary mb-1 group-hover:text-gold transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gold mb-4">{service.subtitle}</p>
                        <p className="text-text-secondary mb-6">{service.description}</p>

                        <div className="pt-5 border-t border-white/[0.06]">
                          <div className="text-xs uppercase tracking-wider text-text-muted mb-3">Includes</div>
                          <ul className="grid grid-cols-2 gap-2">
                            {service.deliverables.slice(0, 4).map((item) => (
                              <li key={item} className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                                <span className="text-xs text-text-secondary">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-[1400px] mx-auto container-padding">
            <motion.div 
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display text-text-primary mb-4">How we work</h2>
              <p className="text-lg text-text-secondary">
                A proven process refined across dozens of successful projects.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="flex-1 p-6 rounded-card border border-white/[0.08] bg-white/[0.015]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl font-bold text-gold/30 mb-3">{step.step}</div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-muted">{step.description}</p>
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
              <h2 className="text-display text-text-primary mb-4">Ready to start?</h2>
              <p className="text-lg text-text-secondary mb-8">
                Tell us about your project and we'll get back to you within 24 hours.
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
