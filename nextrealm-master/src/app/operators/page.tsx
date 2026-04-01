'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Check, ArrowRight, Briefcase, DollarSign, Users, Zap, Shield, TrendingUp } from 'lucide-react'

const benefits = [
  {
    icon: Briefcase,
    title: 'Project Pipeline',
    description: 'Access a steady flow of pre-qualified projects matched to your skills.',
  },
  {
    icon: DollarSign,
    title: 'Revenue Share',
    description: 'Earn competitive rates with transparent revenue sharing on every project.',
  },
  {
    icon: Zap,
    title: 'Forge Access',
    description: 'Free access to all Forge products — use them on client projects or your own.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join a network of elite operators. Collaborate, learn, and grow together.',
  },
  {
    icon: Shield,
    title: 'Branded Systems',
    description: 'Leverage Next Realm's reputation and systems to win bigger clients.',
  },
  {
    icon: TrendingUp,
    title: 'Scale Path',
    description: 'Clear progression from operator to partner with increasing revenue share.',
  },
]

const requirements = [
  'Proven track record in web development, design, or marketing',
  'Ability to work independently and meet deadlines',
  'Strong communication skills',
  'Commitment to quality and client satisfaction',
  'Portfolio demonstrating relevant work',
]

export default function OperatorsPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-padding">
          <div className="max-w-[1400px] mx-auto container-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="eyebrow mb-5">Operators</div>
                <h1 className="text-hero text-text-primary mb-6">
                  Build with us. Earn with us.
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed mb-8">
                  Plug into the network. Fulfill projects, deploy systems, earn revenue, 
                  and scale with Next Realm infrastructure behind you.
                </p>
                <Link href="/operators/apply">
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Apply for Access</span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats Panel */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-panel rounded-panel p-8"
              >
                <h3 className="text-lg font-bold text-text-primary mb-6">Operator Network Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '12', label: 'Active Operators' },
                    { value: '$47K', label: 'Avg. Monthly Payout' },
                    { value: '94%', label: 'Client Satisfaction' },
                    { value: '3.2x', label: 'Income Multiplier' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-card bg-black/30 border border-white/[0.06]">
                      <div className="text-2xl font-bold text-gold">{stat.value}</div>
                      <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-[1400px] mx-auto container-padding">
            <motion.div 
              className="text-center max-w-2xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display text-text-primary mb-4">Why operate with us?</h2>
              <p className="text-lg text-text-secondary">
                More than a freelance network — a complete operating system for your career.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-card border border-white/[0.08] bg-white/[0.015] hover:border-gold/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-card bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{benefit.title}</h3>
                    <p className="text-sm text-text-muted">{benefit.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto container-padding">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display text-text-primary mb-4">What we look for</h2>
                <p className="text-text-secondary mb-6">
                  We're selective about who joins the network. Quality over quantity — always.
                </p>
                <ul className="space-y-3">
                  {requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-panel p-8 text-center"
              >
                <h3 className="text-xl font-bold text-text-primary mb-4">Ready to apply?</h3>
                <p className="text-text-muted mb-6">
                  Applications reviewed within 48 hours. Qualified operators onboarded within a week.
                </p>
                <Link href="/operators/apply">
                  <motion.button
                    className="btn-primary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Start Application</span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
