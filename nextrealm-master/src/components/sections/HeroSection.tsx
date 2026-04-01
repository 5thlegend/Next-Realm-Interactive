'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { value: '4', label: 'Money pillars launched', color: 'gold' },
  { value: '3', label: 'Core buyer paths', color: 'gold' },
  { value: '1', label: 'Unified portal', color: 'gold' },
  { value: '∞', label: 'Expandable scale', color: 'cyan' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end pb-20 pt-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Radial gradient top-right */}
        <div 
          className="absolute -top-[200px] -right-[200px] w-[800px] h-[800px] opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 77, 1) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Cyan accent bottom-left */}
        <div 
          className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 1) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto container-padding">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-16 items-end">
          
          {/* Left: Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <motion.div 
              className="eyebrow mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Next Realm Forge
            </motion.div>

            <h1 className="text-hero text-text-primary max-w-[14ch] mb-6">
              We build systems that print revenue.
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-[50ch] leading-relaxed mb-10">
              Clients enter for results. Builders enter for assets. Operators enter for scale.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button 
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start a Project</span>
              </motion.button>
              <motion.button 
                className="btn-ghost"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enter the Forge
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Stats Dashboard Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="glass-panel rounded-panel p-7"
          >
            <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted mb-3">
              Next Realm Engine
            </div>
            <div className="text-xl md:text-2xl font-bold text-text-primary leading-tight mb-6">
              One machine for access, projects, systems, and operators.
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <div 
                    className={`text-3xl font-bold leading-none ${
                      stat.color === 'cyan' ? 'text-cyan' : 'text-gold'
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-2">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.06]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-text-muted">System Active</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
