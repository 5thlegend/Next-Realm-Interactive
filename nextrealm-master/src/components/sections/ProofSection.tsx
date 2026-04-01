'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const logos = [
  'Apex Designs',
  'GENUBRA AI',
  'HeavenlyFX',
  'MMLFX',
  'FiveVeil',
  'Holy Za',
  'Prime Pup',
  'SoulDAO',
]

const metrics = [
  { value: 47, suffix: '+', label: 'Projects Delivered' },
  { value: 12, suffix: '', label: 'Operators Active' },
  { value: 89, suffix: '+', label: 'Systems Sold' },
  { value: 2.4, suffix: 'M', prefix: '$', label: 'Revenue Generated for Clients' },
]

const testimonials = [
  {
    quote: "Next Realm didn't just build our site — they engineered an entire revenue system. We went from $0 to $47K MRR in 90 days.",
    name: 'Marcus Chen',
    company: 'Velocity Labs',
    result: '47K MRR in 90 days',
  },
  {
    quote: "The Forge templates paid for themselves in the first week. I've deployed three client projects using their systems.",
    name: 'Sarah Williams',
    company: 'SW Digital',
    result: '3x ROI in 7 days',
  },
]

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current * 10) / 10)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}{typeof count === 'number' && count % 1 !== 0 ? count.toFixed(1) : count}{suffix}
    </span>
  )
}

export function ProofSection() {
  return (
    <section className="section-padding relative border-t border-white/[0.04] overflow-hidden">
      {/* Background accent */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(201, 162, 77, 1) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto container-padding">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow mx-auto mb-5">Proof Wall</div>
          <h2 className="text-display text-text-primary">
            Numbers don't negotiate.
          </h2>
        </motion.div>

        {/* Logo Marquee */}
        <div className="relative mb-16 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-void to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-void to-transparent z-10" />
          
          <motion.div 
            className="flex gap-12 py-6"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div 
                key={i}
                className="flex-shrink-0 px-6 py-3 rounded-lg border border-white/[0.08] bg-white/[0.02]"
              >
                <span className="text-sm font-semibold text-text-muted whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-card border border-white/[0.08] bg-void-elevated"
            >
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
              </div>
              <div className="text-xs uppercase tracking-wider text-text-muted">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass-panel rounded-panel p-8"
            >
              <div className="text-gold text-3xl mb-4">"</div>
              <p className="text-lg text-text-primary leading-relaxed mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">{testimonial.name}</div>
                  <div className="text-sm text-text-muted">{testimonial.company}</div>
                </div>
                <div className="px-3 py-1.5 rounded-pill bg-gold/10 border border-gold/30">
                  <span className="text-xs font-semibold text-gold">{testimonial.result}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
