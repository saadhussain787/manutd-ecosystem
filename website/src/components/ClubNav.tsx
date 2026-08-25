'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClubNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/' },
    { name: 'News', href: '/news' },
    { name: 'Video', href: '/video' },
    { name: 'Matches', href: '/matches' },
    { name: 'Squad', href: '/squad' },
    { name: 'Stats', href: '/stats' }
  ];

  return (
    <div className="w-full border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
      <div className="flex gap-6 min-w-max">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`pb-4 text-sm font-bold tracking-tight transition-colors whitespace-nowrap ${
                isActive 
                  ? 'text-[#38003c] border-b-4 border-[#e90052]' 
                  : 'text-gray-500 hover:text-[#38003c]'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
