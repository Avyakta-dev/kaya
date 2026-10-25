import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/index.jsx';

export default function BottomNav({ className = '' }) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'nav.home', icon: 'home' },
    { path: '/calendar', label: 'nav.log', icon: 'edit_calendar' },
    { path: '/insights', label: 'nav.insights', icon: 'insights' },
    { path: '/report', label: 'nav.report', icon: 'description' }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 w-full z-50 ${className}`}>
      <div className="max-w-[390px] mx-auto flex justify-around items-center px-4 py-3 bg-white border-t-[2.5px] border-black shadow-[0px_-4px_0px_#000000] pb-6">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-4 py-2 transition-all ${
                isActive
                  ? 'bg-[#EE8070] text-black rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-black opacity-70 hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]" style={isActive ? { fontVariationSettings: 'FILL 1' } : {}}>
                {item.icon}
              </span>
              <span className="text-[11px] font-bold mt-0.5">{t(item.label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
