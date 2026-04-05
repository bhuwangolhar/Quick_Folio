// TechSlideshow.tsx
// Place this component directly below <Hero /> in your page layout.
// It accepts a `stack` prop (string[]) or uses a default list.

interface TechSlideshowProps {
  stack?: string[];
}

const DEFAULT_STACK = [
  "Python", "TypeScript", "React", "C", "C++", "Java",
  "Node.js", "FastAPI", "LangChain", "Docker", "PostgreSQL",
  "Oracle Cloud", "Machine Learning", "Data Science", "TensorFlow",
  "Chatbots", "REST APIs", "Git", "Linux", "Tailwind CSS",
];

export default function TechSlideshow({ stack = DEFAULT_STACK }: TechSlideshowProps) {
  // Duplicate items for seamless infinite loop
  const items = [...stack, ...stack, ...stack];

  return (
    <div
      style={{
        position: "relative",
        background: "#060a15",
        borderTop: "1px solid rgba(0,220,255,0.08)",
        borderBottom: "1px solid rgba(0,220,255,0.08)",
        overflow: "hidden",
        height: "52px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "80px",
          background: "linear-gradient(to right, #060a15, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "80px",
          background: "linear-gradient(to left, #060a15, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Scrolling track */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0px",
          animation: `techScroll ${stack.length * 2.8}s linear infinite`,
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {items.map((tech, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "3px",
                border: "1px solid rgba(0,220,255,0.15)",
                background: "rgba(0,220,255,0.04)",
                color: "rgba(0,220,255,0.75)",
                fontSize: "11px",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
            >
              {tech}
            </span>
            {/* Separator dot */}
            <span
              style={{
                display: "inline-block",
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(0,220,255,0.25)",
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes techScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  );
}