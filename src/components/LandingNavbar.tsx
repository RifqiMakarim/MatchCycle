"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Recycle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Manfaat", href: "#manfaat" },
    { name: "Alur", href: "#flow" },
    { name: "Aplikasi", href: "#aplikasi" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                isScrolled ? "bg-white text-blue-600" : "bg-white text-blue-600"
            }`}>
              <img src="/logo-MatchCycle.jpeg" alt="logo-MatchCycle" className="h-8 w-8 rounded-lg" />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${
                isScrolled ? "text-slate-900" : "text-white"
            }`}>
              <span className="text-blue-400">Match</span><span className="text-blue-400">Cycle</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:text-blue-500 ${
                    isScrolled ? "text-slate-600" : "text-white/90"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/login">
                <Button 
                    size="sm" 
                    className={`rounded-full px-6 transition-all hover:scale-105 active:scale-95 duration-200 ${
                        isScrolled 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "bg-white text-blue-900 hover:bg-blue-50"
                    }`}
                >
                    Masuk
                </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={isScrolled ? "text-slate-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-slate-900" : "text-white"} />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-white shadow-xl md:hidden overflow-hidden border-t"
          >
            <div className="p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-900 font-medium py-2 border-b border-slate-100"
                >
                  {link.name}
                </Link>
              ))}
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 mt-2">Masuk</Button>
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
