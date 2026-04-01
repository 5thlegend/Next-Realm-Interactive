'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

const posts = [
  {
    id: 'systems-over-services',
    title: 'Why Systems Beat Services Every Time',
    excerpt: 'The agency model is broken. Here\'s how to build leverage instead of trading time for money.',
    category: 'Strategy',
    date: '2025-03-15',
    readTime: '8 min',
    featured: true,
  },
  {
    id: 'launch-framework',
    title: 'The 90-Day Launch Framework We Use for Every Client',
    excerpt: 'A step-by-step breakdown of how we take products from concept to $47K MRR.',
    category: 'Launch',
    date: '2025-03-10',
    readTime: '12 min',
  },
  {
    id: 'operator-model',
    title: 'The Operator Model: Scale Without Hiring',
    excerpt: 'How we built a network that handles 3x the client load without adding employees.',
    category: 'Operations',
    date: '2025-03-05',
    readTime: '10 min',
  },
  {
    id: 'digital-products-flywheel',
    title: 'The Digital Products Flywheel',
    excerpt: 'Every client project should produce assets you can sell. Here\'s how we do it.',
    category: 'Products',
    date: '2025-02-28',
    readTime: '7 min',
  },
  {
    id: 'brand-systems',
    title: 'Building Brand Systems That Scale',
    excerpt: 'Why most brand guidelines fail and how to create ones that actually get used.',
    category: 'Brand',
    date: '2025-02-20',
    readTime: '9 min',
  },
  {
    id: 'pricing-strategy',
    title: 'Value-Based Pricing for Agency Services',
    excerpt: 'Stop charging hourly. Here\'s how to price based on outcomes.',
    category: 'Strategy',
    date: '2025-02-15',
    readTime: '11 min',
  },
]

const categories = ['All', 'Strategy', 'Launch', 'Operations', 'Products', 'Brand']

export default function BlogPage() {
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
              <div className="eyebrow mb-5">Blog</div>
              <h1 className="text-hero text-text-primary mb-6">
                Thoughts on building.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                Strategies, frameworks, and lessons from building revenue systems 
                for brands, operators, and builders.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        {posts.filter(p => p.featured).map((post) => (
          <section key={post.id} className="pb-12">
            <div className="max-w-[1400px] mx-auto container-padding">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="group glass-panel rounded-panel p-8 md:p-12 transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-pill bg-gold/20 text-[10px] font-bold uppercase tracking-wider text-gold">
                        Featured
                      </span>
                      <span className="text-xs text-text-muted">{post.category}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 group-hover:text-gold transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-lg text-text-secondary mb-6 max-w-3xl">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </section>
        ))}

        {/* Posts Grid */}
        <section className="pb-24">
          <div className="max-w-[1400px] mx-auto container-padding">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.filter(p => !p.featured).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <div className="group h-full p-6 rounded-card border border-white/[0.08] bg-white/[0.015] transition-all duration-500 hover:border-gold/30 hover:-translate-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-bold text-text-primary mt-2 mb-3 group-hover:text-gold transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-text-faint">
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-padding border-t border-white/[0.04]">
          <div className="max-w-2xl mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display text-text-primary mb-4">Stay in the loop</h2>
              <p className="text-lg text-text-secondary mb-8">
                Weekly insights on systems, revenue, and building leverage. No spam, unsubscribe anytime.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none transition-colors"
                />
                <motion.button
                  className="btn-primary !px-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Subscribe</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
