import { registerRoot, Composition, AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, Audio, staticFile, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";

// ── EASING CONSTANTS ──────────────────────────────────────
const E_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const E_IN  = Easing.bezier(0.7, 0, 0.84, 0);
const E_IO  = Easing.bezier(0.76, 0, 0.24, 1);

// ── FONT ──────────────────────────────────────────────────
const { fontFamily } = loadFont("normal", {
  weights: ["200", "300", "400", "700", "800"],
  subsets: ["latin"],
});

export const metadata = {
  voiceoverText: "Facebook. Connecter le monde entier. Fondé en 2004. Trois milliards d'utilisateurs actifs. Meta révolutionne les connexions. L'avenir social commence ici.",
  accentColor: "#2997ff",
};

// E_OUT already declared
// E_IN already declared
// E_IO already declared
// fontFamily already declared

const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => (
  <div style={{
    position: "absolute", inset: 0, zIndex: 1000,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
    opacity, mixBlendMode: "overlay" as const, pointerEvents: "none"
  }} />
);

const Vignette: React.FC<{ opacity?: number }> = ({ opacity = 0.2 }) => (
  <div style={{
    position: "absolute", inset: 0, zIndex: 999,
    background: `radial-gradient(circle at center, transparent 20%, rgba(0,0,0,${opacity * 0.4}) 70%, rgba(0,0,0,${opacity}) 100%)`,
    pointerEvents: "none"
  }} />
);

const useDrift = (speed: number = 0.3) => {
  const frame = useCurrentFrame();
  return {
    x: Math.sin(frame * 0.008 * speed) * 12 + Math.cos(frame * 0.012 * speed) * 8,
    y: Math.cos(frame * 0.01 * speed) * 10 + Math.sin(frame * 0.015 * speed) * 6
  };
};

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.4);
  
  const words = ["Une", "révolution", "sociale", "née", "dans", "un", "dortoir", "d'Harvard"];
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{
        position: "absolute", left: 80, top: "22%", maxWidth: 800
      }}>
        {words.map((word, i) => {
          const progress = spring({
            frame: frame - i * 6,
            fps,
            config: { damping: 28, stiffness: 200 },
            from: 0,
            to: 1
          });
          
          return (
            <span key={i} style={{
              fontFamily, fontSize: 72, fontWeight: 300, color: "#ffffff",
              letterSpacing: "-0.045em", lineHeight: 1.1,
              opacity: progress, display: "inline-block", marginRight: 24,
              transform: `translateY(${(1 - progress) * 40}px)`,
              filter: `blur(${(1 - progress) * 4}px)`
            }}>
              {word}
            </span>
          );
        })}
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.3);
  
  const reveal = spring({
    frame: frame - 10,
    fps,
    config: { damping: 35, stiffness: 180 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(145deg, #0d0d0d 0%, #1f1f1f 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "40%",
        transform: "translateX(-50%)"
      }}>
        <div style={{
          fontSize: 200, fontWeight: 800, color: "#ffffff", fontFamily,
          letterSpacing: "-0.045em", lineHeight: 0.9,
          clipPath: `polygon(0 0, 100% 0, 100% ${reveal * 100}%, 0 ${reveal * 100}%)`,
          filter: `drop-shadow(0 8px 32px rgba(41, 151, 255, 0.2))`
        }}>
          Facebook
        </div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.2);
  
  const cardIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  const counter = interpolate(frame, [20, 80], [2004, 2004], { extrapolateRight: "clamp" });
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, #0a0a0a 0%, #151515 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{
        position: "absolute", right: 80, top: "25%",
        opacity: cardIn,
        transform: `translateY(${(1 - cardIn) * 60}px) perspective(1200px) rotateX(${Math.sin(frame * 0.016) * 2}deg) rotateY(${Math.sin(frame * 0.012) * -3}deg) translateY(${Math.sin(frame * 0.025) * 8}px)`
      }}>
        <div style={{
          width: 680, borderRadius: 24, padding: "36px 44px",
          background: "linear-gradient(145deg, rgba(22,22,22,0.98), rgba(14,14,14,0.98))",
          border: "1px solid rgba(255,255,255,0.06)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.35), 0 60px 120px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
        }}>
          <div style={{
            fontSize: 140, fontWeight: 800, color: "#2997ff", fontFamily,
            letterSpacing: "-0.02em", marginBottom: 12,
            filter: "drop-shadow(0 0 20px rgba(41, 151, 255, 0.3))"
          }}>
            {Math.floor(counter)}
          </div>
          <div style={{
            fontSize: 48, fontWeight: 200, color: "rgba(255,255,255,0.7)", fontFamily,
            letterSpacing: "-0.01em"
          }}>
            Année de fondation
          </div>
        </div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.15);
  
  const pathLength = 800;
  const revealed = interpolate(frame, [15, 85], [0, pathLength], { easing: E_OUT, extrapolateRight: "clamp" });
  
  const numbers = [
    { x: 150, y: 280, value: "100M" },
    { x: 300, y: 180, value: "1B" },
    { x: 500, y: 120, value: "2B" },
    { x: 700, y: 80, value: "3B" }
  ];
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, #050505 0%, #1a1a1a 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)", width: 800, height: 400
      }}>
        <svg width="800" height="400" style={{ position: "absolute" }}>
          <path
            d="M 50 350 C 150 280 250 200 350 150 C 450 100 550 80 700 50"
            stroke="#2997ff"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength - revealed}
            style={{ filter: "drop-shadow(0 0 12px rgba(41, 151, 255, 0.6))" }}
          />
        </svg>
        
        {numbers.map((num, i) => {
          const pointProgress = interpolate(revealed, [i * 200, (i + 1) * 200], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp"
          });
          
          return (
            <div key={i} style={{
              position: "absolute", left: num.x, top: num.y,
              transform: "translate(-50%, -50%)",
              opacity: pointProgress,
              transform: `translate(-50%, -50%) scale(${0.8 + pointProgress * 0.2})`
            }}>
              <div style={{
                fontSize: 56, fontWeight: 800, color: "#ffffff", fontFamily,
                filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))"
              }}>
                {num.value}
              </div>
            </div>
          );
        })}
        
        <div style={{
          position: "absolute", bottom: -100, left: 80,
          fontSize: 48, fontWeight: 200, color: "rgba(255,255,255,0.6)", fontFamily
        }}>
          Utilisateurs actifs mensuels
        </div>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = frame * 0.4;
  
  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`
      }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse
              key={i}
              cx="200"
              cy="200"
              rx="160"
              ry="40"
              fill="none"
              stroke="#2997ff"
              strokeWidth="2"
              opacity="0.8"
              transform={`rotate(${i * 30} 200 200)`}
              style={{ filter: "drop-shadow(0 0 8px rgba(41, 151, 255, 0.4))" }}
            />
          ))}
          <circle
            cx="200"
            cy="200"
            r="8"
            fill="#2997ff"
            style={{ filter: "drop-shadow(0 0 16px rgba(41, 151, 255, 0.8))" }}
          />
        </svg>
      </div>
      <Grain opacity={0.02} />
    </AbsoluteFill>
  );
};

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.25);
  
  const line1 = spring({
    frame: frame - 10,
    fps,
    config: { damping: 30, stiffness: 180 },
    from: 0,
    to: 1
  });
  
  const line2 = spring({
    frame: frame - 25,
    fps,
    config: { damping: 30, stiffness: 180 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(145deg, #0d0d0d 0%, #1a1a1a 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{ position: "absolute", right: 80, top: "30%" }}>
        <div style={{
          fontSize: 120, fontWeight: 800, color: "#ffffff", fontFamily,
          letterSpacing: "-0.045em", lineHeight: 0.9,
          opacity: line1,
          transform: `translateX(${(1 - line1) * 100}px)`,
          filter: `blur(${(1 - line1) * 3}px)`
        }}>
          META
        </div>
      </div>
      
      <div style={{ position: "absolute", left: 80, top: "55%" }}>
        <div style={{
          fontSize: 84, fontWeight: 200, color: "rgba(255,255,255,0.7)", fontFamily,
          letterSpacing: "-0.02em",
          opacity: line2,
          transform: `translateX(${(1 - line2) * -100}px)`,
          filter: `blur(${(1 - line2) * 3}px)`
        }}>
          révolutionne les connexions
        </div>
      </div>
      
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.2);
  
  const phoneIn = spring({
    frame: frame - 12,
    fps,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, #0a0a0a 0%, #151515 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "45%",
        transform: `translate(-50%, -50%) scale(${0.8 + phoneIn * 0.2}) translateY(${Math.sin(frame * 0.02) * 6}px)`,
        opacity: phoneIn
      }}>
        <div style={{
          width: 280, height: 580, borderRadius: 36,
          background: "linear-gradient(145deg, #1a1a1a, #0d0d0d)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: 12, position: "relative"
        }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: 28,
            background: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: 60, left: 20, right: 20,
              fontSize: 24, fontWeight: 600, color: "#ffffff", fontFamily,
              textAlign: "center"
            }}>
              Facebook
            </div>
            
            <div style={{
              position: "absolute", top: 120, left: 20, right: 20,
              height: 300,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12, padding: 16
            }}>
              <div style={{
                fontSize: 16, color: "rgba(255,255,255,0.9)", fontFamily,
                marginBottom: 12
              }}>
                3.0B utilisateurs connectés
              </div>
              <div style={{
                width: "100%", height: 8, background: "rgba(255,255,255,0.1)",
                borderRadius: 4, overflow: "hidden"
              }}>
                <div style={{
                  width: `${interpolate(frame, [30, 90], [0, 85], { extrapolateRight: "clamp" })}%`,
                  height: "100%", background: "#2997ff",
                  borderRadius: 4
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.4);
  
  const impact = spring({
    frame: frame - 8,
    fps,
    config: { damping: 25, stiffness: 160 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "45%",
        transform: "translate(-50%, -50%)"
      }}>
        <div style={{
          fontSize: 180, fontWeight: 800, fontFamily,
          background: "linear-gradient(135deg, #2997ff 0%, #60a5fa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.045em", lineHeight: 0.9,
          textAlign: "center",
          opacity: impact,
          transform: `scale(${0.9 + impact * 0.1})`,
          filter: `blur(${(1 - impact) * 8}px) drop-shadow(0 8px 32px rgba(41, 151, 255, 0.3))`
        }}>
          L'AVENIR
        </div>
      </div>
      
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift(0.3);
  
  const textIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  const accent = spring({
    frame: frame - 25,
    fps,
    config: { damping: 30, stiffness: 180 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(145deg, #0d0d0d 0%, #1f1f1f 100%)`,
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <div style={{ position: "absolute", left: 80, bottom: "30%" }}>
        <div style={{
          fontSize: 72, fontWeight: 300, color: "#ffffff", fontFamily,
          letterSpacing: "-0.02em", marginBottom: 24,
          opacity: textIn,
          transform: `translateY(${(1 - textIn) * 40}px)`
        }}>
          Le social commence ici
        </div>
        
        <div style={{
          width: 180, height: 56, borderRadius: 28,
          background: "linear-gradient(135deg, #2997ff 0%, #60a5fa 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: accent,
          transform: `translateY(${(1 - accent) * 20}px) scale(${0.95 + accent * 0.05})`,
          boxShadow: "0 8px 32px rgba(41, 151, 255, 0.4)",
          cursor: "pointer"
        }}>
          <span style={{
            fontSize: 18, fontWeight: 600, color: "#ffffff", fontFamily,
            letterSpacing: "-0.01em"
          }}>
            Découvrir
          </span>
        </div>
      </div>
      
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

export const GeneratedVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene4 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene5 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene6 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene7 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene8 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 22 })} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene9 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};


const RemotionRoot = () => (
  <Composition
    id="GeneratedVideo"
    component={GeneratedVideo}
    durationInFrames={1800}
    fps={60}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
);
registerRoot(RemotionRoot);