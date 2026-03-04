'use client';

import { SERVICES_DATA } from '@/data/services';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

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

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Refs for hover timing to prevent flickering
  const hoverTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const activeRef = useRef<string | null>(null);
  const prevActiveRef = useRef<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // --- Hover Logic ---
  const handleEnter = useCallback((label: string) => {
    if (hoverTimeouts.current[label]) {
      clearTimeout(hoverTimeouts.current[label]);
      delete hoverTimeouts.current[label];
    }
    setActiveDropdown(label);
  }, []);

  const handleLeave = useCallback((label: string) => {
    // Small delay to allow moving mouse from trigger to dropdown
    if (activeRef.current === label) {
      hoverTimeouts.current[label] = setTimeout(() => {
        if (activeRef.current === label) {
          setActiveDropdown(null);
        }
      }, 200);
    }
  }, []);

  // Sync refs
  useEffect(() => {
    activeRef.current = activeDropdown;
  }, [activeDropdown]);

  // Cleanup timeouts on change
  useEffect(() => {
    if (activeDropdown && activeDropdown !== prevActiveRef.current) {
      Object.keys(hoverTimeouts.current).forEach((key) => {
        if (hoverTimeouts.current[key])
          clearTimeout(hoverTimeouts.current[key]);
        delete hoverTimeouts.current[key];
      });
    }
    prevActiveRef.current = activeDropdown;
  }, [activeDropdown]);

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Data Construction ---
  const servicesDropdown: SectionDropdownItem[] = SERVICES_DATA.map(
    (category) => ({
      section: category.title,
      items: category.divisions.map((div) => ({
        label: div.name,
        href: `/services/${div.slug}`,
      })),
    })
  );

  // Updated Nav Items (Removed Home & Careers)
  const navItems: NavItem[] = [
    {
      label: 'About Us',
      dropdown: [
        { label: 'Who We Are', href: '/about/who-we-are' },
        { label: 'Leadership', href: '/about/leadership' },
        { label: 'Quality Policy', href: '/about/quality-policy' },
        { label: 'Awards & Recognition', href: '/about/awards' },
        { label: 'Mission, Vision & Values', href: '/about/mission-vision' },
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

  // Type Guards
  const isSectionDropdownItem = (
    item: DropdownItem
  ): item is SectionDropdownItem => 'section' in item;

  const isSimpleDropdownItem = (
    item: DropdownItem
  ): item is SimpleDropdownItem => 'label' in item && 'href' in item;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 py-2'
          : 'bg-white border-transparent py-4'
      )}
    >
      <div className="mx-auto flex items-center justify-between px-6 lg:px-12 max-w-[1600px]">
        {/* 1. LOGO AREA */}
        <Link href="/" className="flex items-center gap-2 relative z-50">
          {/* Replace with your actual Logo Image */}
          <Image
            src="/images/logo.png"
            alt="Liyana Healthcare"
            width={140}
            height={50}
            className="w-auto h-10 lg:h-12 object-contain"
            priority
          />
        </Link>

        {/* 2. DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isMegaMenu = item.label === 'Services';
            const isActive = activeDropdown === item.label;

            // Trigger Button/Link
            const TriggerContent = (
              <span
                className={cn(
                  'flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors duration-200',
                  isActive
                    ? 'text-cyan-600'
                    : 'text-slate-700 hover:text-cyan-600'
                )}
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown
                    size={14}
                    className={cn(
                      'transition-transform duration-300',
                      isActive && 'rotate-180'
                    )}
                  />
                )}
              </span>
            );

            return (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleEnter(item.label)}
                onMouseLeave={() => handleLeave(item.label)}
              >
                {item.href ? (
                  <Link href={item.href} className="py-2">
                    {TriggerContent}
                  </Link>
                ) : (
                  <button className="bg-transparent border-none py-2 cursor-pointer focus:outline-none">
                    {TriggerContent}
                  </button>
                )}

                {/* DROPDOWN MENU */}
                {isActive && item.dropdown && (
                  <div
                    className={cn(
                      'absolute top-[calc(100%+0.5rem)] bg-white shadow-xl rounded-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200',
                      // Mega Menu Layout vs Standard Dropdown
                      isMegaMenu
                        ? '-left-12 w-[900px] grid grid-cols-4 gap-0'
                        : 'left-0 w-64 flex flex-col'
                    )}
                  >
                    {/* Brand Strip Top Border */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d62839] to-[#7f3aaf] z-10" />

                    {/* Dropdown Items Loop */}
                    {item.dropdown.map((sub, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          isMegaMenu
                            ? 'p-6 border-r border-slate-50 last:border-r-0'
                            : 'px-0 py-0'
                        )}
                      >
                        {isSectionDropdownItem(sub) ? (
                          // Section with sub-items (Used in Mega Menu)
                          <div className="flex flex-col h-full">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                              {sub.section}
                            </span>
                            <div className="flex flex-col space-y-2">
                              {sub.items.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 hover:translate-x-1 transition-all duration-200 block"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // Simple Link Item (Used in Standard Dropdown)
                          isSimpleDropdownItem(sub) && (
                            <Link
                              href={sub.href}
                              className="block px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition-colors border-b border-slate-50 last:border-none"
                            >
                              {sub.label}
                            </Link>
                          )
                        )}
                      </div>
                    ))}

                    {/* Mega Menu Footer (Optional Visual Balance) */}
                    {isMegaMenu && (
                      <div className="col-span-4 bg-slate-50 p-3 text-center text-xs text-slate-400 border-t border-slate-100">
                        Comprehensive Healthcare Solutions by Liyana Group
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* 3. CTA & MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden lg:flex items-center gap-2 rounded-sm bg-gradient-to-r from-[#d62839] to-[#7f3aaf] text-white hover:brightness-110 transition-all shadow-md py-2.5 px-6 font-bold text-sm tracking-wide"
          >
            <Phone size={16} />
            <span>Contact Us</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 4. MOBILE MENU DRAWER */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-[72px] bg-white border-b border-slate-200 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-40',
          isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="flex flex-col px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isActive = activeDropdown === item.label;

            return (
              <div
                key={item.label}
                className="border-b border-slate-100 pb-3 last:border-0"
              >
                <div className="flex justify-between items-center w-full">
                  {item.href && !hasDropdown ? (
                    <Link
                      href={item.href}
                      className="text-lg font-bold text-slate-800"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        setActiveDropdown(isActive ? null : item.label)
                      }
                      className="flex items-center justify-between w-full text-lg font-bold text-slate-800 bg-transparent border-none"
                    >
                      {item.label}
                      {hasDropdown && (
                        <ChevronDown
                          size={18}
                          className={cn(
                            'text-slate-400 transition-transform',
                            isActive && 'rotate-180'
                          )}
                        />
                      )}
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Content */}
                {isActive && hasDropdown && (
                  <div className="mt-4 pl-2 space-y-4 animate-in fade-in slide-in-from-top-2">
                    {item.dropdown!.map((sub, idx) => (
                      <div key={idx}>
                        {isSectionDropdownItem(sub) ? (
                          <div className="mb-4">
                            <span className="block text-xs font-bold text-cyan-600 uppercase mb-2">
                              {sub.section}
                            </span>
                            <div className="flex flex-col space-y-2 border-l-2 border-slate-100 pl-3">
                              {sub.items.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  className="text-sm text-slate-600 font-medium py-1"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          isSimpleDropdownItem(sub) && (
                            <Link
                              href={sub.href}
                              className="block text-sm text-slate-600 font-medium py-2 border-l-2 border-slate-100 pl-3"
                              onClick={() => setIsOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 pb-8">
            <Link
              href="/contact"
              className="w-full flex justify-center items-center gap-2 rounded-sm bg-slate-900 text-white py-3 font-bold uppercase tracking-widest text-xs"
              onClick={() => setIsOpen(false)}
            >
              Get In Touch
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
