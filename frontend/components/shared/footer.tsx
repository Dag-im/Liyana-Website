import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-[#0a192f] to-[#05101e] text-gray-300">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-800 via-[#0ea5e9] to-[#14b8a6]" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="space-y-5">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="Liyana Healthcare"
              width={160}
              height={80}
              className="object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            A collective of innovators, healthcare professionals, and
            visionaries—building sustainable, technology-driven solutions that
            empower communities worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                Divisions
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Solutions</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                Healthcare Tech
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                Medical Devices
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                Sustainability
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-700 transition">
                Research
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-cyan-700" />
              Addis Ababa, Ethiopia
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-cyan-700" />
              +251 912 345 678
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-cyan-700" />
              info@liyanahealthcare.com
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700/40" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-4 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Liyana Healthcare. All rights reserved.
        </p>

        <div className="flex items-center space-x-5">
          <Link href="#" className="hover:text-cyan-700 transition">
            <Facebook size={18} />
          </Link>
          <Link href="#" className="hover:text-cyan-700 transition">
            <Linkedin size={18} />
          </Link>
          <Link href="#" className="hover:text-cyan-700 transition">
            <Instagram size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
