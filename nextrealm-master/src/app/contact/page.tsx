'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Send, Mail, MapPin, Clock } from 'lucide-react'

const projectTypes = [
  'Web System / Application',
  'Brand Identity',
  'Launch Execution',
  'Retained Operations',
  'Something Else',
]

const budgetRanges = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
  'Not sure yet',
]

const timelines = [
  'ASAP',
  '1-2 weeks',
  '1 month',
  '2-3 months',
  'Flexible',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log('Form submitted:', formData)
    alert('Thanks for reaching out! We\'ll get back to you within 24 hours.')
  }

  return (
    <>
      <Header />
      <main className="pt-24">
        <section className="section-padding">
          <div className="max-w-[1200px] mx-auto container-padding">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
              
              {/* Left: Info */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="eyebrow mb-5">Contact</div>
                <h1 className="text-hero text-text-primary mb-6">
                  Let's talk.
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed mb-12">
                  Tell us about your project and we'll get back to you within 24 hours 
                  with next steps.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-card bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Email</div>
                      <div className="text-text-muted">hello@nextrealm.io</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-card bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Location</div>
                      <div className="text-text-muted">California, USA</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-card bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Response Time</div>
                      <div className="text-text-muted">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="glass-panel rounded-panel p-8">
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none transition-colors"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none transition-colors"
                      placeholder="Your company"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-5 mb-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                        Project Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary focus:border-gold/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select...</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                        Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary focus:border-gold/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select...</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                        Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary focus:border-gold/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select...</option>
                        {timelines.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                      Project Description *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
