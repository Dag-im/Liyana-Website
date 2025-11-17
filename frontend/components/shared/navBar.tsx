'use client';

import { SERVICES_DATA } from '@/data/services';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const hoverTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const activeRef = useRef<string | null>(null);
  const prevActiveRef = useRef<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleEnter = useCallback((label: string) => {
    if (hoverTimeouts.current[label]) {
      clearTimeout(hoverTimeouts.current[label]);
      delete hoverTimeouts.current[label];
    }
    setActiveDropdown(label);
  }, []);

  const handleLeave = useCallback((label: string) => {
    if (activeRef.current === label) {
      hoverTimeouts.current[label] = setTimeout(() => {
        if (activeRef.current === label) {
          setActiveDropdown(null);
        }
      }, 150);
    }
  }, []);

  useEffect(() => {
    activeRef.current = activeDropdown;
  }, [activeDropdown]);

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Build the dynamic Services dropdown ---
  const servicesDropdown: SectionDropdownItem[] = SERVICES_DATA.map(
    (category) => ({
      section: category.title,
      items: category.divisions.map((div) => ({
        label: div.name,
        href: `/services/${div.slug}`,
      })),
    })
  );

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
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
      label: 'Media and Insights',
      dropdown: [
        { label: 'News & Events', href: '/news-events' },
        { label: 'Blogs', href: '/blog' },
        { label: 'Media Gallery', href: '/media' },
      ],
    },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ];

  const isSectionDropdownItem = (
    item: DropdownItem
  ): item is SectionDropdownItem => 'section' in item;
  const isSimpleDropdownItem = (
    item: DropdownItem
  ): item is SimpleDropdownItem => 'label' in item && 'href' in item;

  const getGridColumns = (itemCount: number) => {
    if (itemCount >= 5) return 'grid-cols-3';
    if (itemCount >= 3) return 'grid-cols-2';
    return 'grid-cols-1';
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 border-b py-2',
        scrolled && 'shadow-sm'
      )}
    >
      <div className="mx-auto flex items-center justify-between px-4 py-3 max-w-[1400px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Liyana Healthcare Logo"
            width={120}
            height={120}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-[0.85rem] font-bold text-[#00a4d3] flex-wrap">
          {navItems.map((item) => {
            if (!item.dropdown) {
              return (
                <Link
                  key={item.label}
                  href={item.href || ''}
                  className="hover:text-[#00a4d3]/60 transition"
                >
                  {item.label}
                </Link>
              );
            }

            const isMultiSection =
              item.dropdown.length > 2 &&
              item.dropdown.every(isSectionDropdownItem);
            const gridCols = getGridColumns(item.dropdown.length);

            const trigger = item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 hover:text-[#00a4d3]/60 transition"
                onMouseEnter={() => handleEnter(item.label)}
                onMouseLeave={() => handleLeave(item.label)}
              >
                {item.label}
                <ChevronDown size={12} />
              </Link>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#00a4d3]/60 transition bg-transparent border-none cursor-pointer p-0"
                onMouseEnter={() => handleEnter(item.label)}
                onMouseLeave={() => handleLeave(item.label)}
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === item.label ? null : item.label
                  )
                }
              >
                {item.label}
                <ChevronDown size={12} />
              </button>
            );

            return (
              <div key={item.label} className="relative">
                {trigger}
                {activeDropdown === item.label && (
                  <div
                    onMouseEnter={() => handleEnter(item.label)}
                    onMouseLeave={() => handleLeave(item.label)}
                    className={cn(
                      'absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg z-10 p-4',
                      item.label === 'Services'
                        ? 'grid grid-cols-4 gap-4 w-fit max-w-[1200px]'
                        : isMultiSection
                        ? `grid ${gridCols} gap-4 w-fit max-w-[900px]`
                        : 'w-44'
                    )}
                    style={{
                      gridTemplateColumns:
                        item.label === 'Services'
                          ? 'repeat(4, minmax(160px, 1fr))'
                          : isMultiSection
                          ? `repeat(${Math.min(
                              item.dropdown.length,
                              3
                            )}, minmax(160px, 1fr))`
                          : undefined,
                    }}
                  >
                    {item.dropdown.map((sub, index) => (
                      <div
                        key={
                          isSectionDropdownItem(sub)
                            ? sub.section
                            : (sub as SimpleDropdownItem).label
                        }
                        style={
                          item.label === 'Services' && index >= 4
                            ? { gridColumn: `${(index % 4) + 1}` }
                            : {}
                        }
                      >
                        {isSectionDropdownItem(sub) ? (
                          <div className="flex flex-col">
                            <span className="block text-xs font-semibold text-gray-500 mb-2 whitespace-nowrap">
                              {sub.section}
                            </span>
                            <div className="flex flex-col space-y-1">
                              {sub.items.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  className="block px-2 py-1 text-xs font-medium text-[#00a4d3] hover:text-[#00a4d3]/60 hover:bg-[#f0f9ff] transition whitespace-normal break-words max-w-[300px]"
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
                              className="block px-3 py-1.5 text-sm text-[#00a4d3] hover:text-[#00a4d3]/60 hover:bg-[#f0f9ff] transition whitespace-normal break-words max-w-[250px]"
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
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-[#d62839] to-[#7f3aaf] text-white hover:shadow-[0_0_30px_rgba(214,40,57,0.6)] transition drop-shadow-md py-2 px-3 font-semibold"
          >
            Call Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-gray-900 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <nav className="flex flex-col px-6 py-4 space-y-1.5">
            {navItems.map((item) => {
              if (!item.dropdown) {
                return (
                  <Link
                    key={item.label}
                    href={item.href || ''}
                    className="text-[#00a4d3] font-bold hover:text-[#00a4d3]/60 transition"
                  >
                    {item.label}
                  </Link>
                );
              }

              const isMultiSection =
                item.dropdown.length > 2 &&
                item.dropdown.every(isSectionDropdownItem);
              const mobileGridCols = isMultiSection
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1';

              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center w-full">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-[#00a4d3] font-bold hover:text-[#00a4d3]/60 transition"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-[#00a4d3] font-bold">
                        {item.label}
                      </span>
                    )}
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.label ? null : item.label
                        )
                      }
                      className="text-[#00a4d3] bg-transparent border-none p-0"
                    >
                      <ChevronDown
                        size={16}
                        className={cn(
                          'transition-transform',
                          activeDropdown === item.label && 'rotate-180'
                        )}
                      />
                    </button>
                  </div>
                  {activeDropdown === item.label && (
                    <div
                      className={cn(
                        'mt-2 ml-3 grid gap-4 w-full',
                        mobileGridCols
                      )}
                    >
                      {item.dropdown.map((sub) => (
                        <div
                          key={
                            isSectionDropdownItem(sub)
                              ? sub.section
                              : (sub as SimpleDropdownItem).label
                          }
                        >
                          {isSectionDropdownItem(sub) ? (
                            <>
                              <span className="block text-xs font-semibold text-gray-500">
                                {sub.section}
                              </span>
                              {sub.items.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  className="text-[#00a4d3] text-sm hover:text-[#00a4d3]/60 transition block py-1 whitespace-normal break-words"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </>
                          ) : (
                            isSimpleDropdownItem(sub) && (
                              <Link
                                href={sub.href}
                                className="text-[#00a4d3] text-sm hover:text-[#00a4d3]/60 transition block py-1 whitespace-normal break-words"
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
            <Link
              href="/contact"
              className="mt-4 rounded-xl bg-gradient-to-r from-[#d62839] to-[#7f3aaf] text-white hover:shadow-[0_0_30px_rgba(214,40,57,0.6)] transition drop-shadow-md py-2 px-4 font-semibold text-center"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
