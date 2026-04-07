// Navbar.tsx

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#socials" },
];

export default function Navbar() {
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.4s ease",
          background: "#000000",
          borderBottom: "1px solid rgba(0,220,255,0.1)",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("#hero")}
            className="group flex items-center flex-shrink-0"
            style={{ textDecoration: "none" }}
          >
            <div
              className="flex items-center justify-center font-bold"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontFamily: "'DM Mono', monospace",
                fontSize: "24px",
                fontWeight: "900",
                borderRadius: "50%",
                outline: "3px solid #ffff00",
                outlineOffset: "2px",
              }}
            >
              B
            </div>
          </button>

          {/* Nav Links on right */}
          <div className="hidden md:flex items-center gap-12" style={{ marginLeft: "auto" }}>
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(link.href)}
                  className="relative text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300"
                  style={{
                    color: isActive ? "#00dcff" : "#ffffff",
                    fontFamily: "'DM Mono', monospace",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                    fontSize: "12px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color = "#00dcff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "1px",
                  background: "#00dcff",
                  transition: "all 0.3s ease",
                  transform:
                    menuOpen && i === 0
                      ? "rotate(45deg) translate(4px, 4px)"
                      : menuOpen && i === 2
                      ? "rotate(-45deg) translate(4px, -4px)"
                      : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: menuOpen ? "320px" : "0",
            opacity: menuOpen ? 1 : 0,
            transition: "all 0.4s ease",
          }}
        >
          <div
            className="px-6 pt-4 pb-6 flex flex-col gap-5"
            style={{
              background: "#000000",
              borderTop: "1px solid rgba(0,220,255,0.08)",
            }}
          >
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-sm tracking-[0.2em] uppercase font-bold transition-all duration-200"
                  style={{
                    color: active === id ? "#00dcff" : "#ffffff",
                    fontFamily: "'DM Mono', monospace",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}