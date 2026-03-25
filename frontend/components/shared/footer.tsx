import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Custom X (formerly Twitter) brand logo component
const XLogo = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

interface FooterProps {
  description?: string;
}

export default function Footer({ description }: FooterProps) {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-[#0a192f] to-[#05101e] text-gray-300">
      {/* Brand Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-[#33bde9]" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

          {/* Brand Section & Integrated CTA */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Liyana Healthcare"
                width={160}
                height={80}
                className="object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              {description ??
                'A collective of innovators, healthcare professionals, and visionaries—building sustainable, technology-driven solutions that empower communities worldwide.'}
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all group w-fit"
            >
              Get in Touch
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#33bde9]" />
            </Link>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <FooterLink href="/about/who-we-are">About Us</FooterLink>
              <FooterLink href="/about/mission-vision">Mission & Vision</FooterLink>
              <FooterLink href="/about/leadership">Leadership</FooterLink>
              <FooterLink href="/about/awards">Awards</FooterLink>
              <FooterLink href="/about/quality-policy">Quality Policy</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Services & Media */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Services & Media</h3>
            <ul className="space-y-4 text-sm">
              <FooterLink href="/services">Services & Divisions</FooterLink>
              <FooterLink href="/news-events">News & Events</FooterLink>
              <FooterLink href="/blog">Our Blog</FooterLink>
              <FooterLink href="/media">Media Gallery</FooterLink>
              <FooterLink href="/testimonials">Testimonials</FooterLink>
            </ul>
          </div>

          {/* ESG & Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6">ESG & Sustainability</h3>
              <ul className="space-y-4 text-sm">
                <FooterLink href="/esg/sustainability">Sustainability</FooterLink>
                <FooterLink href="/esg/csr">CSR Initiatives</FooterLink>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-800/50">
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#33bde9] shrink-0 mt-0.5" />
                  <span>Addis Ababa, Ethiopia</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[#33bde9] shrink-0" />
                  <span>+251 912 345 678</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[#33bde9] shrink-0" />
                  <span>info@liyanahealthcare.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/40 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[11px] uppercase tracking-widest text-gray-500">
            <p>© {new Date().getFullYear()} Liyana Healthcare.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Use</Link>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            <SocialIcon href="https://facebook.com" icon={<Facebook size={16} />} label="Facebook" />
            <SocialIcon href="https://linkedin.com" icon={<Linkedin size={16} />} label="LinkedIn" />
            <SocialIcon href="https://instagram.com" icon={<Instagram size={16} />} label="Instagram" />
            <SocialIcon href="https://x.com" icon={<XLogo size={14} />} label="X (formerly Twitter)" />
            <SocialIcon href="https://youtube.com" icon={<Youtube size={16} />} label="YouTube" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
      >
        <span className="w-0 overflow-hidden group-hover:w-2 group-hover:mr-2 transition-all duration-300 text-[#33bde9]">•</span>
        <span className="group-hover:translate-x-1 transition-transform duration-300">
          {children}
        </span>
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#33bde9]/50 transition-all duration-300"
    >
      {icon}
    </Link>
  );
}
