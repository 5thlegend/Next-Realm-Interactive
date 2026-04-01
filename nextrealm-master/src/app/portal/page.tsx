'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Lock, LogIn } from 'lucide-react'

export default function PortalPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen flex items-center">
        <section className="w-full section-padding">
          <div className="max-w-md mx-auto container-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-panel bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-7 h-7 text-gold" />
              </div>

              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Client Portal
              </h1>

              <p className="text-text-secondary mb-8">
                Sign in to access your projects, payments, downloads, and direct support.
              </p>

              <div className="glass-panel rounded-panel p-8">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 text-left">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 text-left">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-btn bg-black/30 border border-white/[0.1] text-text-primary placeholder:text-text-muted focus:border-gold/50 focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <motion.button
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>

                <p className="text-xs text-text-muted mt-4">
                  Don't have an account?{' '}
                  <Link href="/contact" className="text-gold hover:underline">
                    Start a project
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
