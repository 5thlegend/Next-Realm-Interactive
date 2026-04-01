'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const paths = [
  {
    id: 'client',
    tag: 'You want results.',
    title: 'The Client',
    subtitle: 'Hire Next Realm',
    description: 'We build the machine for you. High-trust build packages, brand systems, launch execution, and retained operations. Project-based or monthly.',
    revenue: 'Project cash + retainers',
    cta: 'Start a Project',
    href: '/services',
    accent: 'gold',
  },
  {
    id: 'builder',
    tag: 'You want assets.',
    title: 'The Builder',
    subtitle: 'Buy Systems',
    description: 'Use our systems to generate income. Templates, playbooks, operating frameworks, and digital packs built for immediate deployment.',
    revenue: 'High-margin digital revenue',
    cta: 'Enter the Forge',
    href: '/forge',
    accent: 'cyan',
  },
  {
    id: 'operator',
    tag: 'You want leverage.',
    title: 'The Operator',
    subtitle: 'Join the Network',
    description: 'Plug into the network. Fulfill projects, deploy systems, earn revenue, and scale with Next Realm infrastructure behind you.',
    revenue: 'Operator revenue share + deal flow',
    cta: 'Apply for Access',
    href: '/operators/apply',
    accent: 'white',
  },
]

export function ThreePathsSection() {
  return (
    <section className="section-padding relative border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto container-padding">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-display text-text-primary mb-5">
            Three paths into the system.
          </h2>
          <p className="text-lg text-text-secondary">
            Every visitor becomes a role. Every role generates revenue. Pick your entry point.
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {paths.map((path, i) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div 
                className={`
                  relative h-full flex flex-col p-8 rounded-panel border transition-all duration-500
                  border-white/[0.08] bg-white/[0.015]
                  hover:-translate-y-2
                  ${path.accent === 'gold' 
                    ? 'hover:border-gold/40 hover:bg-gold/[0.03] hover:shadow-glow-gold' 
                    : path.accent === 'cyan'
                    ? 'hover:border-cyan/40 hover:bg-cyan/[0.03] hover:shadow-glow-cyan'
                    : 'hover:border-white/30 hover:bg-white/[0.03]'
                  }
                `}
              >
                {/* Path Number */}
                <div className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest text-text-faint">
                  Path {String(i + 1).padStart(2, '0')}
                </div>

                {/* Tag */}
                <div className={`text-xs font-semibold uppercase tracking-[0.1em] mb-4 ${
                  path.accent === 'gold' ? 'text-gold' : path.accent === 'cyan' ? 'text-cyan' : 'text-text-muted'
                }`}>
                  {path.tag}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {path.title}
                </h3>
                <div className="text-sm text-text-muted mb-4">
                  {path.subtitle}
                </div>

                {/* Description */}
                <p className="text-text-secondary text-[15px] leading-relaxed mb-6 flex-1">
                  {path.description}
                </p>

                {/* Revenue Tag */}
                <div className="text-xs text-text-faint uppercase tracking-wide mb-6">
                  {path.revenue}
                </div>

                {/* CTA */}
                <Link href={path.href}>
                  <motion.button
                    className={`
                      w-full py-3.5 rounded-btn text-[12px] font-bold uppercase tracking-[0.06em]
                      transition-all duration-300
                      ${path.accent === 'gold' 
                        ? 'bg-gradient-gold text-void hover:shadow-glow-gold' 
                        : path.accent === 'cyan'
                        ? 'bg-gradient-cyan text-void hover:shadow-glow-cyan'
                        : 'bg-transparent border border-white/20 text-text-primary hover:border-white/40 hover:bg-white/5'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {path.cta}
                  </motion.button>
                </Link>

                {/* Accent line at top on hover */}
                <div 
                  className={`
                    absolute top-0 left-4 right-4 h-[2px] opacity-0 transition-opacity duration-500
                    group-hover:opacity-100
                    ${path.accent === 'gold' 
                      ? 'bg-gradient-to-r from-transparent via-gold to-transparent' 
                      : path.accent === 'cyan'
                      ? 'bg-gradient-to-r from-transparent via-cyan to-transparent'
                      : 'bg-gradient-to-r from-transparent via-white/50 to-transparent'
                    }
                  `}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
