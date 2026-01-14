import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/ths_logo.jpg";
import { Menu, X, Home, BookOpen, Calendar, Video, LogIn } from 'lucide-react';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Admission", path: "/admission", icon: BookOpen },
    { label: "Event", path: "/event", icon: Calendar },
    { label: "Shorts", path: "/shorts", icon: Video },
    { label: "Admin Login", path: "/adminlogin", icon: LogIn },
  ];

  return (
    <div className="relative">
      {/* Main Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-cyan-700 shadow-lg'
        : 'bg-cyan-700'
        }`}>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Title */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <img
                className="w-12 h-12 rounded-md shadow-md group-hover:scale-105 transition-transform duration-300"
                src={Logo}
                alt="govt ths logo"
              />
              <h1 className="font-bold text-white text-xl md:text-2xl tracking-wide">
                GOVT.THS.PALA
              </h1>
            </div>

            {/* Desktop Menu - Simple Text Links */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 lg:gap-8">
                {navItems.map((item, idx) => (
                  <li key={idx}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `relative font-semibold text-base transition-all duration-300 ${isActive
                        ? 'text-white'
                        : 'text-white/90 hover:text-white'
                        }`}
                    >
                      {({ isActive }) => (
                        <>
                          {item.label}
                          <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0'
                            }`}></span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Toggle - Only on Mobile */}
            <button
              className="md:hidden z-50 relative group"
              onClick={() => setOpenMenu(!openMenu)}
              aria-label="Toggle menu"
            >
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                {openMenu ? (
                  <X className="w-7 h-7 text-white" />
                ) : (
                  <Menu className="w-7 h-7 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Background Overlay - Mobile Only */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-all duration-500 ${openMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={() => setOpenMenu(false)}
      />

      {/* Animated Mobile Menu - Glassmorphism Style */}
      <div
        className={`fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-[#083344]/98 backdrop-blur-2xl shadow-2xl transform transition-all duration-700 ease-out z-[100] md:hidden border-l border-white/10 flex flex-col ${openMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Animated background effects - Glass orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/15 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-yellow-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Glass top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-purple-500/50 backdrop-blur-sm"></div>

        {/* Close Button */}
        <button
          onClick={() => setOpenMenu(false)}
          className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl transition-all duration-300 group shadow-xl z-10 border border-white/30"
          aria-label="Close menu"
        >
          <X className="w-7 h-7 text-white group-hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* Logo in mobile menu */}
        <div className="relative pt-10 pb-8 px-6 border-b border-white/20 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-xl animate-pulse"></div>
              <img
                className="relative w-16 h-16 rounded-full shadow-2xl ring-4 ring-white/40 backdrop-blur-sm"
                src={Logo}
                alt="logo"
              />
            </div>
            <div className="text-center">
              <h2 className="font-black text-white text-xl drop-shadow-lg">
                GOVT.THS.PALA
              </h2>
              <p className="text-cyan-200 text-xs font-semibold mt-0.5">Technical High School</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Links - Scrollable area */}
        <nav className="flex-1 overflow-y-auto relative mt-4 px-6 pb-24 scrollbar-hide">
          <ul className="space-y-3">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li
                  key={idx}
                  className="transform transition-all duration-500"
                  style={{
                    transitionDelay: openMenu ? `${idx * 100}ms` : '0ms',
                    opacity: openMenu ? 1 : 0,
                    transform: openMenu ? 'translateX(0) scale(1)' : 'translateX(50px) scale(0.8)'
                  }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setOpenMenu(false)}
                    className={({ isActive }) => `group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden border ${isActive
                      ? 'bg-white/20 backdrop-blur-xl text-white shadow-xl scale-102 border-white/30'
                      : 'bg-white/5 backdrop-blur-md text-white/80 hover:bg-white/10 shadow-lg border-white/10'
                      }`}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Icon container */}
                        <div className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${isActive
                          ? 'bg-gradient-to-br from-cyan-400/40 to-blue-500/40 shadow-lg'
                          : 'bg-white/20 group-hover:bg-white/30'
                          }`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>

                        <span className="font-bold text-base flex-1">{item.label}</span>

                        <svg
                          className={`w-6 h-6 transition-all duration-300 ${isActive
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>

                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 rounded-r-full shadow-lg"></div>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Floating glass decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div
            className="absolute top-40 right-12 w-24 h-24 border-2 border-white/20 rounded-full backdrop-blur-sm"
            style={{
              animation: 'glass-ping 3s ease-out infinite, glass-float 6s ease-in-out infinite'
            }}
          ></div>

          <div
            className="absolute bottom-40 left-12 w-20 h-20 border-2 border-cyan-300/20 rounded-full backdrop-blur-sm"
            style={{
              animation: 'glass-ping 4s ease-out infinite, glass-float 7s ease-in-out infinite',
              animationDelay: '1s'
            }}
          ></div>

          <div
            className="absolute top-1/2 right-20 w-16 h-16 border-2 border-purple-300/20 rounded-full backdrop-blur-sm"
            style={{
              animation: 'glass-ping 5s ease-out infinite, glass-float 8s ease-in-out infinite',
              animationDelay: '2s'
            }}
          ></div>

        </div>{/* Floating glass decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">

          <div
            className="absolute top-40 right-12 w-24 h-24 border-2 border-white/20 rounded-full backdrop-blur-sm"
            style={{
              animation: 'glass-ping 3s ease-out infinite, glass-float 6s ease-in-out infinite'
            }}
          ></div>

          <div
            className="absolute bottom-40 left-12 w-20 h-20 border-2 border-cyan-300/20 rounded-full backdrop-blur-sm"
            style={{
              animation: 'glass-ping 4s ease-out infinite, glass-float 7s ease-in-out infinite',
              animationDelay: '1s'
            }}
          ></div>

          <div
            className="absolute top-1/2 right-20 w-16 h-16 border-2 border-purple-300/20 rounded-full backdrop-blur-sm"
            style={{
              animation: 'glass-ping 5s ease-out infinite, glass-float 8s ease-in-out infinite',
              animationDelay: '2s'
            }}
          ></div>

        </div>

        {/* Footer info in mobile menu - Fixed at bottom of the menu container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#164e63] to-transparent">
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-2xl">
            <p className="text-white text-sm text-center font-semibold">
              © 2025 GOVT.THS.PALA
            </p>
            <p className="text-white/70 text-xs text-center mt-1">
              Building Future Innovators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
