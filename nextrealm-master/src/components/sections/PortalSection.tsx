'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FolderKanban, 
  CreditCard, 
  FileText, 
  Download, 
  Users, 
  MessageCircle,
  LogIn
} from 'lucide-react'

const features = [
  { icon: FolderKanban, label: 'Project tracking' },
  { icon: CreditCard, label: 'Payment history' },
  { icon: FileText, label: 'Build log' },
  { icon: Download, label: 'File vault' },
  { icon: Users, label: 'Operator board' },
  { icon: MessageCircle, label: 'Direct support' },
]

export function PortalSection() {
  return (
    <section className="section-padding relative border-t border-white/[0.04] overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0, 212, 255, 1), transparent)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-panel p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-cyan/10 border border-cyan/30 mb-5">
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan">
                  Client Portal
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                Every client gets a command center.
              </h2>

              <p className="text-text-secondary mb-8 leading-relaxed">
                Real-time project visibility, payment tracking, file delivery, and direct access to your dedicated operator team.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {features.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02]"
                    >
                      <Icon className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs text-text-secondary">{feature.label}</span>
                    </motion.div>
                  )
                })}
              </div>

              <Link href="/portal">
                <motion.button
                  className="btn-ghost flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-4 h-4" />
                  Client Login
                </motion.button>
              </Link>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="relative">
              <div 
                className="rounded-card border border-white/[0.1] bg-void-elevated p-4 shadow-elevated"
              >
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-gold">NR</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Client Portal</div>
                      <div className="text-[10px] text-text-muted">Welcome back</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] text-text-muted">Active Project</span>
                  </div>
                </div>

                {/* Mock Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Active', value: '2', color: 'text-gold' },
                    { label: 'In Review', value: '1', color: 'text-cyan' },
                    { label: 'Delivered', value: '4', color: 'text-green-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-lg bg-black/30 border border-white/[0.04]">
                      <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-[10px] text-text-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mock Project List */}
                <div className="space-y-2">
                  {[
                    { name: 'Brand System Overhaul', status: 'In Progress', progress: 65 },
                    { name: 'Launch Sequence Setup', status: 'Review', progress: 90 },
                  ].map((project) => (
                    <div 
                      key={project.name}
                      className="p-3 rounded-lg bg-black/20 border border-white/[0.04]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-text-primary">{project.name}</span>
                        <span className="text-[10px] text-text-muted">{project.status}</span>
                      </div>
                      <div className="h-1 rounded-full bg-void overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-gold"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative glow */}
              <div 
                className="absolute -bottom-10 -right-10 w-40 h-40 opacity-30 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 212, 255, 0.5), transparent)',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
