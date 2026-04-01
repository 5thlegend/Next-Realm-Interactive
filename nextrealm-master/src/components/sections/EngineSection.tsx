'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const nodes = [
  {
    id: 'acquisition',
    title: 'Acquisition Layer',
    description: 'Funnels, content, AI, inbound traffic systems',
    position: 'top',
    angle: -90,
  },
  {
    id: 'conversion',
    title: 'Conversion Layer',
    description: 'Sites, landing pages, offers, brand systems',
    position: 'right',
    angle: 0,
  },
  {
    id: 'fulfillment',
    title: 'Fulfillment Layer',
    description: 'Operators, build systems, delivery pipelines',
    position: 'bottom',
    angle: 90,
  },
  {
    id: 'expansion',
    title: 'Expansion Layer',
    description: 'Automation, scaling, resale, licensing',
    position: 'left',
    angle: 180,
    accent: 'cyan',
  },
]

export function EngineSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeNode, setActiveNode] = useState<string | null>(null)

  return (
    <section className="section-padding relative overflow-hidden border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto container-padding">
        
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow mx-auto mb-5">The Unfair Advantage</div>
          <h2 className="text-display text-text-primary mb-5">
            The Next Realm Engine
          </h2>
          <p className="text-lg text-text-secondary">
            Four interconnected layers that power every project, product, and partnership.
          </p>
        </motion.div>

        {/* Engine Diagram */}
        <div ref={ref} className="relative max-w-4xl mx-auto">
          
          {/* Center Core */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(201, 162, 77, 0.4) 0%, transparent 70%)',
                  width: '200px',
                  height: '200px',
                  left: '-50px',
                  top: '-50px',
                }}
              />
              <div className="relative w-[100px] h-[100px] rounded-full border-2 border-gold bg-void-elevated flex items-center justify-center animate-pulse-glow">
                <div className="text-center">
                  <div className="text-gold font-bold text-xs uppercase tracking-wider">NR</div>
                  <div className="text-[8px] text-text-muted uppercase tracking-widest mt-0.5">Engine</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nodes Grid */}
          <div className="relative aspect-square max-w-[600px] mx-auto">
            
            {/* SVG Connection Lines */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 600 600"
              style={{ zIndex: 1 }}
            >
              {nodes.map((node, i) => {
                const centerX = 300
                const centerY = 300
                const radius = 220
                const angleRad = (node.angle * Math.PI) / 180
                const endX = centerX + radius * Math.cos(angleRad)
                const endY = centerY + radius * Math.sin(angleRad)
                
                return (
                  <motion.line
                    key={node.id}
                    x1={centerX}
                    y1={centerY}
                    x2={endX}
                    y2={endY}
                    stroke={node.accent === 'cyan' ? 'rgba(0, 212, 255, 0.4)' : 'rgba(201, 162, 77, 0.3)'}
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
                  />
                )
              })}
            </svg>

            {/* Node Cards */}
            {nodes.map((node, i) => {
              // Position calculations
              const positions: Record<string, string> = {
                top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                right: 'top-1/2 right-0 -translate-y-1/2 translate-x-1/2',
                bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                left: 'top-1/2 left-0 -translate-y-1/2 -translate-x-1/2',
              }

              return (
                <motion.div
                  key={node.id}
                  className={`absolute ${positions[node.position]} z-10`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div 
                    className={`
                      w-[180px] p-5 rounded-card border transition-all duration-300 cursor-pointer
                      ${activeNode === node.id 
                        ? node.accent === 'cyan' 
                          ? 'border-cyan/50 bg-cyan/5 shadow-glow-cyan' 
                          : 'border-gold/50 bg-gold/5 shadow-glow-gold'
                        : 'border-white/10 bg-void-elevated/80'
                      }
                    `}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className={`text-xs uppercase tracking-wider mb-2 ${
                      node.accent === 'cyan' ? 'text-cyan' : 'text-gold'
                    }`}>
                      Node {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="text-sm font-bold text-text-primary mb-2">
                      {node.title}
                    </div>
                    <div className="text-xs text-text-muted leading-relaxed">
                      {node.description}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.p 
          className="text-center text-text-muted mt-16 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Each layer feeds the others. Projects become products. Products fuel operators. 
          Operators expand reach. The system compounds.
        </motion.p>
      </div>
    </section>
  )
}
