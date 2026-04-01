'use client'

import Link from 'next/link'
import { Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
  services: [
    { href: '/services/web-systems', label: 'Web Systems' },
    { href: '/services/brand-identity', label: 'Brand Identity' },
    { href: '/services/launch-execution', label: 'Launch Execution' },
    { href: '/services/retained-ops', label: 'Retained Ops' },
  ],
  forge: [
    { href: '/forge/templates', label: 'Templates' },
    { href: '/forge/playbooks', label: 'Playbooks' },
    { href: '/forge/frameworks', label: 'Frameworks' },
    { href: '/forge', label: 'All Products' },
  ],
  operators: [
    { href: '/operators', label: 'Overview' },
    { href: '/operators/apply', label: 'Apply' },
    { href: '/portal', label: 'Operator Portal' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
}

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-void">
      <div className="max-w-[1400px] mx-auto container-padding py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center">
                <span className="text-sm font-bold text-gold">NR</span>
              </div>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Systems built for operators, brands, and revenue.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-text-muted hover:text-gold hover:border-gold/30 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Forge */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Forge
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.forge.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operators */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Operators
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.operators.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Next Realm Interactive. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
