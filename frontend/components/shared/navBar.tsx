'use client';

import { cn } from '@/lib/utils';
import type { ServiceCategory } from '@/types/services.types';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// --- Types ---
interface SimpleDropdownItem {
  label: string;
  href: string;
}

interface SectionDropdownItem {
  section: string;
  items: SimpleDropdownItem[];
}

type DropdownItem = SimpleDropdownItem | SectionDropdownItem;

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

interface NavBarProps {
  categories?: ServiceCategory[];
}

const NavBar = ({ categories = [] }: NavBarProps) => {
  // --- State ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Separate states for Desktop Hover and Mobile Accordion to prevent conflicts
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<
    string | null
  >(null);
  const [activeMobileAccordion, setActiveMobileAccordion] = useState<
    string | null
  >(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Scroll Detection ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Desktop Hover Logic ---
  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDesktopDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDesktopDropdown(null);
    }, 150); // 150ms buffer prevents flickering when moving to the dropdown
  };

  // --- Data Construction ---
  const servicesDropdown: SectionDropdownItem[] =
    categories?.map((category) => ({
      section: category.title,
      items: (category.divisions ?? []).map((div) => ({
        label: div.name,
        href: `/services/${div.slug}`,
      })),
    })) || [];

  const navItems: NavItem[] = [
    {
      label: 'About Us',
      dropdown: [
        { label: 'Who We Are', href: '/about/who-we-are' },
        { label: 'Mission, Vision & Values', href: '/about/mission-vision' },
        { label: 'Leadership', href: '/about/leadership' },
        { label: 'Quality Policy', href: '/about/quality-policy' },
        { label: 'Awards & Recognition', href: '/about/awards' },
      ],
    },
    { label: 'Services', href: '/services', dropdown: servicesDropdown },
    {
      label: 'ESG',
      href: '/esg',
      dropdown: [
        { label: 'Sustainability', href: '/esg/sustainability' },
        { label: 'Corporate Social Responsibility', href: '/esg/csr' },
      ],
    },
    {
      label: 'Media & Insights',
      dropdown: [
        { label: 'News & Events', href: '/news-events' },
        { label: 'Blogs', href: '/blog' },
        { label: 'Media Gallery', href: '/media' },
      ],
    },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Contact', href: '/contact' },
  ];

  // --- Type Guards ---
  const isSectionDropdownItem = (
    item: DropdownItem
  ): item is SectionDropdownItem => 'section' in item;
  const isSimpleDropdownItem = (
    item: DropdownItem
  ): item is SimpleDropdownItem => 'label' in item && 'href' in item;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-slate-200 bg-white/95 backdrop-blur-md',
          scrolled ? 'shadow-sm h-[84px]' : 'h-[92px]'
        )}
      >
        {/* Top Brand Stripe */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#d62839] via-[#7f3aaf] to-cyan-500" />

        {/* Main Header Container */}
        <div className="mx-auto flex items-center justify-between px-6 lg:px-12 max-w-[1600px] w-full h-full">
          {/* 1. LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 relative z-50 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 rounded"
          >
            <Image
              src="/images/logo.png"
              alt="Liyana Healthcare"
              width={250}
              height={90}
              className="w-auto h-12 lg:h-14 object-contain"
              priority
            />
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-10 h-full">
            {navItems.map((item) => {
              const isMegaMenu = item.label === 'Services';
              const isActive = activeDesktopDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className={cn(
                    'h-full flex items-center group',
                    isMegaMenu ? 'static' : 'relative'
                  )}
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Trigger */}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium tracking-wide transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 rounded px-1',
                        isActive
                          ? 'text-cyan-600'
                          : 'text-slate-700 hover:text-cyan-600'
                      )}
                    >
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown
                          size={14}
                          strokeWidth={2.5}
                          className={cn(
                            'transition-transform duration-300',
                            isActive
                              ? 'rotate-180 text-cyan-600'
                              : 'text-slate-400 group-hover:text-cyan-600'
                          )}
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium tracking-wide transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 rounded px-1',
                        isActive
                          ? 'text-cyan-600'
                          : 'text-slate-700 hover:text-cyan-600'
                      )}
                    >
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown
                          size={14}
                          strokeWidth={2.5}
                          className={cn(
                            'transition-transform duration-300',
                            isActive
                              ? 'rotate-180 text-cyan-600'
                              : 'text-slate-400 group-hover:text-cyan-600'
                          )}
                        />
                      )}
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {isActive && item.dropdown && (
                    <div
                      className={cn(
                        'absolute bg-white shadow-xl shadow-slate-900/5 animate-in fade-in slide-in-from-top-2 duration-200 z-50',
                        isMegaMenu
                          ? 'top-[100%] left-0 w-full border-t border-b border-slate-200 cursor-default'
                          : 'top-[100%] left-0 min-w-[240px] border border-slate-200 border-t-0 rounded-b-lg overflow-hidden'
                      )}
                    >
                      <div
                        className={cn(
                          isMegaMenu
                            ? 'w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 lg:px-12 py-10'
                            : 'w-full flex flex-col py-1'
                        )}
                      >
                        {item.dropdown.map((sub, idx) => (
                          <div key={idx}>
                            {/* Rendering Section Dropdown (Mega Menu Style) */}
                            {isSectionDropdownItem(sub) && (
                              <div className="flex flex-col h-full">
                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 border-b border-slate-100 pb-2">
                                  {sub.section}
                                </span>
                                <div className="flex flex-col space-y-1">
                                  {sub.items.map((subItem) => (
                                    <Link
                                      key={subItem.label}
                                      href={subItem.href}
                                      className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors duration-200 py-1.5 inline-block w-full"
                                      onClick={() =>
                                        setActiveDesktopDropdown(null)
                                      }
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Rendering Simple Dropdown (Standard Menu Style) */}
                            {isSimpleDropdownItem(sub) && (
                              <Link
                                href={sub.href}
                                className="block px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-cyan-600 transition-colors border-b border-slate-50 last:border-b-0"
                                onClick={() => setActiveDesktopDropdown(null)}
                              >
                                {sub.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Corporate Mega Menu Footer */}
                      {isMegaMenu && (
                        <div className="w-full bg-slate-50/80 border-t border-slate-100">
                          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-500">
                              Comprehensive Healthcare Solutions by Liyana
                              Healthcare
                            </span>
                            <Link
                              href="/services"
                              className="text-sm font-semibold text-cyan-600 hover:text-[#7f3aaf] transition-colors"
                            >
                              View All Services &rarr;
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* 3. CTA & MOBILE TOGGLE */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-2 rounded bg-gradient-to-r from-[#d62839] to-[#7f3aaf] text-white hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 shadow-md py-2.5 px-6 font-medium text-sm tracking-wide"
            >
              <Phone size={15} />
              <span>Contact Us</span>
            </Link>

            <button
              className="lg:hidden p-2 -mr-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to prevent layout jump from fixed header */}
      <div className="h-[88px] w-full hidden lg:block" aria-hidden="true" />
      <div className="h-[72px] w-full lg:hidden" aria-hidden="true" />

      {/* 4. MOBILE MENU DRAWER */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 bg-white border-b border-slate-200 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-40',
          scrolled ? 'top-[72px]' : 'top-[88px]',
          isMobileMenuOpen
            ? 'max-h-[calc(100vh-88px)] opacity-100'
            : 'max-h-0 opacity-0'
        )}
      >
        <nav className="flex flex-col px-6 py-4 max-h-[calc(100vh-88px)] overflow-y-auto bg-white">
          {navItems.map((item) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isExpanded = activeMobileAccordion === item.label;

            return (
              <div
                key={item.label}
                className="border-b border-slate-100 last:border-0"
              >
                <div className="flex justify-between items-center w-full py-4">
                  {item.href && !hasDropdown ? (
                    <Link
                      href={item.href}
                      className="text-[15px] font-medium text-slate-800 w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        setActiveMobileAccordion(isExpanded ? null : item.label)
                      }
                      className="flex items-center justify-between w-full text-[15px] font-medium text-slate-800 bg-transparent border-none focus:outline-none"
                    >
                      {item.label}
                      {hasDropdown && (
                        <ChevronDown
                          size={18}
                          className={cn(
                            'text-slate-400 transition-transform duration-300',
                            isExpanded && 'rotate-180 text-cyan-600'
                          )}
                        />
                      )}
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Content */}
                {isExpanded && hasDropdown && (
                  <div className="pb-5 pl-2 space-y-6 animate-in fade-in slide-in-from-top-2">
                    {item.dropdown!.map((sub, idx) => (
                      <div key={idx}>
                        {isSectionDropdownItem(sub) && (
                          <div className="mb-4 last:mb-0">
                            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">
                              {sub.section}
                            </span>
                            <div className="flex flex-col space-y-1 border-l-2 border-slate-100 pl-4">
                              {sub.items.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  className="text-sm text-slate-600 font-medium py-2 hover:text-cyan-600 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {isSimpleDropdownItem(sub) && (
                          <Link
                            href={sub.href}
                            className="block text-sm text-slate-600 font-medium py-2.5 border-l-2 border-slate-100 pl-4 hover:text-cyan-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-8 pb-10">
            <Link
              href="/contact"
              className="w-full flex justify-center items-center gap-2 rounded bg-gradient-to-r from-[#d62839] to-[#7f3aaf] text-white py-4 font-medium uppercase tracking-widest text-sm shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get In Touch
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavBar;
