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
  voiceoverText: "Facebook connecte le monde. Fondée en 2004. Plus de trois milliards d'utilisateurs. Une plateforme révolutionnaire. Innovation constante. L'avenir du social. Ensemble nous créons.",
  accentColor: "#2997ff",
};

const fontFamily = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';
const E_OUT = [0.19, 1, 0.22, 1];
const E_IN = [0.87, 0, 0.13, 1];
const E_IO = [0.87, 0, 0.13, 1];

const Grain: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
    opacity: 0.04,
    pointerEvents: 'none'
  }} />
);

const Vignette: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.25) 100%)',
    pointerEvents: 'none'
  }} />
);

const useDrift = (speed: number = 0.5) => {
  const frame = useCurrentFrame();
  return {
    x: Math.sin(frame * 0.008) * speed * 20,
    y: Math.cos(frame * 0.006) * speed * 15
  };
};

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.8);
  
  const words = ["Facebook", "connecte", "le", "monde", "entier"];
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0a0a0a, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <div style={{
        position: 'absolute',
        left: 80,
        top: '22%',
        fontSize: 68,
        fontFamily,
        fontWeight: 300,
        letterSpacing: '-0.045em',
        lineHeight: 1.1,
        color: '#ffffff'
      }}>
        {words.map((word, i) => {
          const opacity = spring({
            frame,
            fps: 60,
            config: { damping: 28, stiffness: 200 },
            from: 0,
            to: 1,
            delay: i * 6
          });
          
          const y = interpolate(opacity, [0, 1], [20, 0], { easing: E_OUT });
          
          return (
            <span key={i} style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${y}px)`,
              color: i === 0 ? '#2997ff' : '#ffffff',
              marginRight: i < words.length - 1 ? '0.3em' : 0
            }}>
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.6);
  
  const maskHeight = spring({
    frame,
    fps: 60,
    config: { damping: 32, stiffness: 180 },
    from: 0,
    to: 100
  });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0a0a0a, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 200,
        fontFamily,
        fontWeight: 800,
        letterSpacing: '-0.05em',
        color: '#ffffff',
        clipPath: `inset(${100 - maskHeight}% 0 0 0)`,
        filter: 'drop-shadow(0 0 20px rgba(41, 151, 255, 0.3))'
      }}>
        2004
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.4);
  
  const cardOpacity = spring({
    frame,
    fps: 60,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  const count = interpolate(frame, [20, 80], [0, 3], { easing: E_OUT, extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0a0a0a, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <div style={{
        position: 'absolute',
        right: 80,
        bottom: '25%',
        opacity: cardOpacity,
        transform: `perspective(1200px) rotateX(${Math.sin(frame * 0.016) * 2}deg) rotateY(${Math.sin(frame * 0.012) * -3}deg) translateY(${Math.sin(frame * 0.025) * 8}px)`
      }}>
        <div style={{
          width: 680,
          borderRadius: 24,
          padding: '36px 44px',
          background: 'linear-gradient(145deg, rgba(22,22,22,0.98), rgba(14,14,14,0.98))',
          border: '1px solid rgba(255,255,255,0.06)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.35), 0 60px 120px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}>
          <div style={{
            fontSize: 120,
            fontFamily,
            fontWeight: 800,
            color: '#2997ff',
            letterSpacing: '-0.045em',
            marginBottom: 16
          }}>
            {count.toFixed(1)}B
          </div>
          <div style={{
            fontSize: 48,
            fontFamily,
            fontWeight: 200,
            color: '#ffffff',
            opacity: 0.8
          }}>
            utilisateurs actifs
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.3);
  
  const pathLength = 800;
  const revealed = interpolate(frame, [10, 90], [0, pathLength], { easing: E_OUT, extrapolateRight: 'clamp' });
  
  const points = [
    { x: 100, y: 400, value: '2004' },
    { x: 300, y: 320, value: '1M' },
    { x: 500, y: 200, value: '100M' },
    { x: 700, y: 120, value: '1B' },
    { x: 900, y: 80, value: '3B' }
  ];
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #050505, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <svg style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        height: 500
      }}>
        <path
          d="M 100 400 C 150 380 250 350 300 320 C 350 290 450 240 500 200 C 550 160 650 140 700 120 C 750 100 850 90 900 80"
          stroke="#2997ff"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength - revealed}
          style={{ filter: 'drop-shadow(0 0 8px #2997ff66)' }}
        />
        
        {points.map((point, i) => {
          const pointOpacity = interpolate(revealed, [i * 160, i * 160 + 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          
          return (
            <g key={i} opacity={pointOpacity}>
              <circle
                cx={point.x}
                cy={point.y}
                r={6}
                fill="#2997ff"
                style={{ filter: 'drop-shadow(0 0 12px #2997ff)' }}
              />
              <text
                x={point.x}
                y={point.y - 20}
                textAnchor="middle"
                fontSize={32}
                fontFamily={fontFamily}
                fontWeight={600}
                fill="#ffffff"
              >
                {point.value}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${frame * 0.4}deg)`,
        width: 400,
        height: 400
      }}>
        <svg width="100%" height="100%" viewBox="0 0 400 400">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = 200 + Math.cos(angle) * 80;
            const y1 = 200 + Math.sin(angle) * 80;
            const x2 = 200 + Math.cos(angle) * 180;
            const y2 = 200 + Math.sin(angle) * 180;
            
            return (
              <ellipse
                key={i}
                cx={(x1 + x2) / 2}
                cy={(y1 + y2) / 2}
                rx={50}
                ry={15}
                fill="none"
                stroke="#2997ff"
                strokeWidth={1.5}
                transform={`rotate(${i * 30}, ${(x1 + x2) / 2}, ${(y1 + y2) / 2})`}
                opacity={0.6 + Math.sin(frame * 0.02 + i) * 0.4}
                style={{ filter: 'drop-shadow(0 0 6px #2997ff33)' }}
              />
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.7);
  
  const line1Opacity = spring({
    frame,
    fps: 60,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  const line2Opacity = spring({
    frame,
    fps: 60,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1,
    delay: 20
  });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0a0a0a, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <div style={{
        position: 'absolute',
        right: 80,
        top: '25%',
        fontSize: 86,
        fontFamily,
        fontWeight: 800,
        letterSpacing: '-0.045em',
        color: '#ffffff',
        opacity: line1Opacity,
        transform: `translateY(${interpolate(line1Opacity, [0, 1], [30, 0], { easing: E_OUT })}px)`
      }}>
        Innovation
      </div>
      
      <div style={{
        position: 'absolute',
        left: 80,
        bottom: '30%',
        fontSize: 86,
        fontFamily,
        fontWeight: 200,
        letterSpacing: '-0.045em',
        color: '#2997ff',
        opacity: line2Opacity,
        transform: `translateY(${interpolate(line2Opacity, [0, 1], [30, 0], { easing: E_OUT })}px)`
      }}>
        constante
      </div>
    </AbsoluteFill>
  );
};

const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.5);
  
  const phoneOpacity = spring({
    frame,
    fps: 60,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0a0a0a, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) perspective(1200px) rotateY(${Math.sin(frame * 0.015) * 5}deg) translateY(${Math.sin(frame * 0.02) * 10}px)`,
        opacity: phoneOpacity
      }}>
        <div style={{
          width: 280,
          height: 580,
          background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
          borderRadius: 40,
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 60px 120px rgba(0,0,0,0.3)',
          padding: 8
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#000000',
            borderRadius: 32,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 32,
              fontFamily,
              fontWeight: 600,
              color: '#2997ff',
              textAlign: 'center'
            }}>
              Facebook
            </div>
            
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              background: '#2997ff',
              borderRadius: '50%',
              fontSize: 32,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>
              f
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.6);
  
  const textOpacity = spring({
    frame,
    fps: 60,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0a0a0a, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 180,
        fontFamily,
        fontWeight: 800,
        letterSpacing: '-0.05em',
        background: 'linear-gradient(135deg, #2997ff, #40a9ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        opacity: textOpacity,
        filter: 'drop-shadow(0 0 30px rgba(41, 151, 255, 0.4))'
      }}>
        Social
      </div>
    </AbsoluteFill>
  );
};

const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = useDrift(0.8);
  
  const textOpacity = spring({
    frame,
    fps: 60,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1
  });
  
  const buttonOpacity = spring({
    frame,
    fps: 60,
    config: { damping: 28, stiffness: 200 },
    from: 0,
    to: 1,
    delay: 30
  });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(145deg, #0a0a0a, #000000)',
      transform: `translate(${drift.x}px, ${drift.y}px)`
    }}>
      <Grain />
      <Vignette />
      
      <div style={{
        position: 'absolute',
        left: 80,
        bottom: '35%'
      }}>
        <div style={{
          fontSize: 72,
          fontFamily,
          fontWeight: 300,
          letterSpacing: '-0.045em',
          color: '#ffffff',
          opacity: textOpacity,
          marginBottom: 40,
          lineHeight: 1.1
        }}>
          Ensemble nous<br />
          <span style={{ color: '#2997ff', fontWeight: 600 }}>créons</span>
        </div>
        
        <div style={{
          opacity: buttonOpacity,
          transform: `translateY(${interpolate(buttonOpacity, [0, 1], [20, 0], { easing: E_OUT })}px)`
        }}>
          <div style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #2997ff, #40a9ff)',
            borderRadius: 12,
            fontSize: 48,
            fontFamily,
            fontWeight: 600,
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(41, 151, 255, 0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            Connecter
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GeneratedVideo: React.FC = () => {
  return (
    <AbsoluteFill>
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
        
        <TransitionSeries.Sequence durationInFrames={224}>
          <Scene9 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
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