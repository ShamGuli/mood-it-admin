'use client';

import Link from 'next/link';
import { useState } from 'react';

const navigationItems = [
  { label: 'Ana Səhifə', href: '/' },
  { label: 'Haqqımızda', href: '/about' },
  {
    label: 'Xidmətlər',
    href: '/services',
    submenu: [
      { label: 'Smartfon', href: '/categories/smartphone', icon: 'fa-solid fa-mobile' },
      { label: 'PlayStation', href: '/categories/playstation', icon: 'fa-brands fa-playstation' },
      { label: 'macOS', href: '/categories/macos', icon: 'fa-brands fa-apple' },
      { label: 'Noutbuk', href: '/categories/notebook', icon: 'fa-solid fa-laptop' },
      { label: 'Masaüstü PC', href: '/categories/desktop', icon: 'fa-solid fa-desktop' },
      { label: 'Xbox & GPU', href: '/categories/gpu', icon: 'fa-solid fa-microchip' },
    ],
  },
  { label: 'Qiymət Kalkulyatoru', href: '/preisliste' },
  { label: 'Əlaqə', href: '/contact' },
];

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="nav-menu-wrapper">
      <ul className="navbar-nav mr-auto" id="menu">
        {navigationItems.map((item) => (
          <li
            key={item.href}
            className={`nav-item ${item.submenu ? 'submenu' : ''}`}
            onMouseEnter={() => item.submenu && setActiveDropdown(item.href)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link href={item.href} className="nav-link">
              {item.label}
            </Link>

            {/* Dropdown Menu */}
            {item.submenu && activeDropdown === item.href && (
              <ul className="dropdown-menu">
                {item.submenu.map((subItem) => (
                  <li key={subItem.href} className="nav-item">
                    <Link href={subItem.href} className="nav-link">
                      <i className={subItem.icon}></i> {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
