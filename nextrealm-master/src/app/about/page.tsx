'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowRight } from 'lucide-react'

const values = [
  {
    title: 'Systems Over Services',
    description: 'We don\'t sell hours. We build machines that generate results long after we\'re done.',
  },
  {
    title: 'Revenue First',
    description: 'Every decision we make is filtered through one question: does this make money?',
  },
  {
    title: 'Operator Mindset',
    description: 'We think like owners, not vendors. Your success is our success.',
  },
  {
    title: 'Compounding Value',
    description: 'Every project adds to the system. Every system becomes a product. Every product scales.',
  },
]

const timeline = [
  { year: '2014', event: 'Apex Designs founded — web design and SEO consultancy' },
  { year: '2020', event: 'Expanded into full-stack development and brand systems' },
  { year: '2023', event: 'Launched digital products and operator network model' },
  { year: '2024', event: 'Next Realm Interactive formalized as the parent entity' },
  { year: '2025', event: 'Next Realm Forge launched — systemizing everything we\'ve learned' },
]

export default function AboutPage() {
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
              <div className="eyebrow mb-5">About</div>
              <h1 className="text-hero text-text-primary mb-6">
                We build systems that outlive projects.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Next Realm Interactive is a digital studio that creates revenue-generating systems 
                for brands, operators, and builders. Not an agency. A system factory.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="pb-24">
          <div className="max-w-[1400px] mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display text-text-primary mb-6">The origin</h2>
                <div className="space-y-4 text-text-secondary">
                  <p>
                    Next Realm started as a question: what if every client project also built internal leverage?
                  </p>
                  <p>
                    After years of trading time for money in traditional agency work, we realized the model was broken. 
                    Great work disappeared into client folders. Systems got rebuilt from scratch every time. 
                    Knowledge never compounded.
                  </p>
                  <p>
                    So we built a different machine. One where every project feeds the Forge. 
                    Every Forge product funds more projects. Every operator multiplies our capacity. 
                    The flywheel spins.
                  </p>
                  <p>
                    Today, Next Realm operates as a unified platform: agency front-end, digital product storefront, 
                    and operator network — all connected through one authenticated system.
                  </p>
                </div>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-panel p-8"
              >
                <h3 className="text-lg font-bold text-text-primary mb-6">Timeline</h3>
                <div className="space-y-4">
                  {timeline.map((item, i) => (
                    <div key={item.year} className="flex gap-4">
                      <div className="text-gold font-bold w-16 flex-shrink-0">{item.year}</div>
                      <div className="text-text-secondary text-sm">{item.event}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-[1400px] mx-auto container-padding">
            <motion.div 
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display text-text-primary mb-4">How we think</h2>
              <p className="text-lg text-text-secondary">
                These aren't values we aspire to. They're how we actually operate.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-card border border-white/[0.08] bg-white/[0.015]"
                >
                  <h3 className="text-xl font-bold text-text-primary mb-3">{value.title}</h3>
                  <p className="text-text-muted">{value.description}</p>
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
              <h2 className="text-display text-text-primary mb-4">Let's build something</h2>
              <p className="text-lg text-text-secondary mb-8">
                Whether you need a system built, want to buy one, or want to operate with us.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/services">
                  <motion.button className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <span>Start a Project</span>
                  </motion.button>
                </Link>
                <Link href="/forge">
                  <motion.button className="btn-ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Enter the Forge
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
