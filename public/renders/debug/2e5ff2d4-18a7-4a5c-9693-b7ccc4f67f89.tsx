import { registerRoot, Composition, AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, Audio, staticFile, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";

export const metadata = {
  voiceoverText: "Xiaomi. Fondée en 2010 à Beijing. Innovation accessible pour tous. Plus de 500 millions d'utilisateurs. Smartphones, écosystème connecté, maison intelligente. Leader mondial de la technologie. Mi, Redmi, POCO. L'avenir commence maintenant.",
  accentColor: "#ff6900",
};

const Grain = () => {
  const f = useCurrentFrame();
  return <div style={{ position:"absolute",inset:0,opacity:0.03,pointerEvents:"none",zIndex:100,
    backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${f%60}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />;
};

const Vignette = ({ strength = 0.4 }) =>
  <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:99,
    background:`radial-gradient(ellipse 88% 88% at center, transparent 42%, rgba(0,0,0,${strength}) 100%)` }} />;

const useDrift = () => {
  const f = useCurrentFrame();
  return {
    x: Math.sin(f*0.005)*4 + Math.sin(f*0.011)*1.5,
    y: Math.cos(f*0.007)*3 + Math.cos(f*0.013)*1,
    s: 1.006 + Math.sin(f*0.004)*0.008,
    r: Math.sin(f*0.003)*0.14,
  };
};

const DepthRings = ({ color, frame }) => (
  <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
    <svg style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }}
      width={1400} height={1400} viewBox="-700 -700 1400 1400">
      {[150,300,460,620].map((r,i) => (
        <circle key={i} cx={0} cy={0} r={r} fill="none" stroke={color}
          strokeWidth={0.7} strokeOpacity={0.07 - i*0.012}
          transform={`rotate(${frame*0.08*(i%2===0?1:-0.6)})`} />
      ))}
    </svg>
  </div>
);

const MorphText = ({ from, to, progress, fontSize, color, accent }) => {
  const maxLen = Math.max(from.length, to.length);
  return (
    <div style={{ display:"inline-flex", letterSpacing:"-0.04em" }}>
      {Array.from({length:maxLen},(_,i) => {
        const fc = (from[i]||" "), tc = (to[i]||" ");
        if (fc===tc) return <span key={i} style={{fontSize,fontWeight:800,color,fontFamily}}>{fc}</span>;
        const delay = i*0.055;
        const lp = Math.max(0,Math.min(1,(progress-delay)/(1-delay+0.01)));
        return (
          <span key={i} style={{position:"relative",fontSize,fontWeight:800,fontFamily,display:"inline-block"}}>
            <span style={{position:"absolute",left:0,color,opacity:1-lp,
              transform:`translateY(${interpolate(lp,[0,1],[0,-fontSize*0.3],{easing:E_IN})}px)`,
              filter:`blur(${interpolate(lp,[0,1],[0,5])}px)`}}>{fc}</span>
            <span style={{color:accent,opacity:lp,display:"inline-block",
              transform:`translateY(${interpolate(lp,[0,1],[fontSize*0.3,0],{easing:E_OUT})}px)`,
              filter:`blur(${interpolate(lp,[0,1],[5,0])}px)`}}>{tc}</span>
          </span>
        );
      })}
    </div>
  );
};

const Counter = ({ from, to, frame, dur, fontSize, color, accent }) => {
  const value = interpolate(frame, [8, dur-20], [from, to], {easing: E_OUT, extrapolateRight:"clamp"});
  const displayValue = to > 1000000 
    ? (value/1000000).toFixed(0) + "M" 
    : to > 1000 
    ? (value/1000).toFixed(0) + "K"
    : Math.floor(value).toString();
  
  return (
    <span style={{
      fontSize, 
      fontWeight: 800, 
      color: accent, 
      fontFamily,
      letterSpacing: "-0.045em"
    }}>
      {displayValue}
    </span>
  );
};

const XiaomiLogo = ({ frame }) => {
  const drift = useDrift();
  const breathe = Math.sin(frame * 0.026) * 8;
  const rotate = Math.sin(frame * 0.016) * 1.2;
  
  return (
    <div style={{
      transform: `translate(${drift.x}px, ${drift.y + breathe}px) rotate(${rotate}deg)`,
      filter: "drop-shadow(0 12px 40px #ff690022)"
    }}>
      <div style={{
        width: 180,
        height: 180,
        background: "linear-gradient(45deg, #ff6900, #ff8c42)",
        borderRadius: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 72,
        fontWeight: 800,
        color: "white",
        fontFamily,
        letterSpacing: "-0.02em"
      }}>
        Mi
      </div>
    </div>
  );
};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.05]);
  
  const blurIn = interpolate(frame, [0, 34], [20, 0], { easing: E_OUT });
  const scaleSpring = spring(frame, 60, { damping: 28, stiffness: 200 }, 0.93, 1);
  const opacityIn = interpolate(frame, [0, 18], [0, 1], { easing: E_OUT });
  const opacityOut = interpolate(frame, [152, 180], [1, 0], { easing: E_IN });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0f0f 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 70% 70% at center, #ff690008 0%, transparent 70%)`
      }} />
      
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          textAlign: "center",
          opacity: opacityIn * opacityOut,
          transform: `translateY(${idle.y}px) scale(${scaleSpring * idle.s})`,
          filter: `blur(${blurIn}px)`
        }}>
          <div style={{
            fontSize: 140,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily,
            letterSpacing: "-0.045em",
            lineHeight: 1.0
          }}>
            Xiaomi
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.05]);
  
  const opacityOut = interpolate(frame, [152, 180], [1, 0], { easing: E_IN });
  
  const yearReveal = interpolate(frame, [0, 32], [100, 0], { easing: E_OUT });
  const beijingBlur = interpolate(frame, [14, 48], [20, 0], { easing: E_OUT });
  const beijingOpacity = interpolate(frame, [14, 32], [0, 1], { easing: E_OUT });
  
  const push1 = interpolate(Math.max(0, frame - 12), [0, 24], [0, -28], { easing: E_OUT });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #050510 0%, #0d0a00 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 80% at center, #ff690010 0%, transparent 70%)`
      }} />
      
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 65px"
      }}>
        <div style={{
          textAlign: "center",
          opacity: opacityOut,
          transform: `translateY(${idle.y}px) scale(${idle.s})`
        }}>
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontSize: 120,
              fontWeight: 800,
              color: "#ff6900",
              fontFamily,
              letterSpacing: "-0.045em",
              lineHeight: 1.0,
              transform: `translateY(${yearReveal}%) translateY(${push1}px)`
            }}>
              2010
            </div>
          </div>
          
          <div style={{
            fontSize: 64,
            fontWeight: 200,
            color: "#ffffff",
            fontFamily,
            letterSpacing: "-0.03em",
            marginTop: 24,
            opacity: beijingOpacity,
            filter: `blur(${beijingBlur}px)`
          }}>
            Beijing
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 200], [1.0, 1.05]);
  
  const morphProgress = interpolate(frame, [20, 80], [0, 1], { easing: E_OUT });
  const opacityOut = interpolate(frame, [172, 200], [1, 0], { easing: E_IN });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #080818 0%, #0a0808 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 75% 75% at center, #ff690012 0%, transparent 70%)`
      }} />
      
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 65px"
      }}>
        <div style={{
          textAlign: "center",
          opacity: opacityOut,
          transform: `translateY(${idle.y}px) scale(${idle.s})`
        }}>
          <div style={{
            fontSize: 88,
            lineHeight: 1.1,
            textAlign: "center"
          }}>
            <MorphText
              from="Innovation"
              to="Accessible"
              progress={morphProgress}
              fontSize={88}
              color="#ffffff"
              accent="#ff6900"
            />
          </div>
          
          <div style={{
            fontSize: 48,
            fontWeight: 200,
            color: "#ffffff88",
            fontFamily,
            letterSpacing: "-0.02em",
            marginTop: 32
          }}>
            pour tous
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 190], [1.0, 1.05]);
  
  const opacityOut = interpolate(frame, [162, 190], [1, 0], { easing: E_IN });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0d0a00 0%, #050510 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 70% 70% at center, #ff690008 0%, transparent 70%)`
      }} />
      
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 65px"
      }}>
        <div style={{
          textAlign: "center",
          opacity: opacityOut,
          transform: `translateY(${idle.y}px) scale(${idle.s})`
        }}>
          <div style={{
            fontSize: 110,
            fontWeight: 800,
            color: "#ff6900",
            fontFamily,
            letterSpacing: "-0.045em",
            lineHeight: 1.0,
            marginBottom: 16
          }}>
            <Counter
              from={0}
              to={500}
              frame={frame}
              dur={190}
              fontSize={110}
              color="#ffffff"
              accent="#ff6900"
            />
          </div>
          
          <div style={{
            fontSize: 48,
            fontWeight: 200,
            color: "#ffffff",
            fontFamily,
            letterSpacing: "-0.02em"
          }}>
            millions d'utilisateurs
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 210], [1.0, 1.05]);
  
  const opacityOut = interpolate(frame, [182, 210], [1, 0], { easing: E_IN });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 80% at center, #ff690008 0%, transparent 70%)`
      }} />
      
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          opacity: opacityOut,
          transform: `translateY(${idle.y}px) scale(${idle.s})`
        }}>
          <div style={{
            width: 320,
            height: 640,
            background: "linear-gradient(145deg, #2c2c2c, #0e0e0e)",
            borderRadius: 46,
            boxShadow: "0 24px 70px rgba(0,0,0,0.55), 0 70px 130px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
              background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
              borderRadius: 34,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                textAlign: "center",
                color: "#ffffff"
              }}>
                <XiaomiLogo frame={frame} />
                <div style={{
                  fontSize: 32,
                  fontWeight: 200,
                  fontFamily,
                  marginTop: 24,
                  opacity: 0.8
                }}>
                  MIUI 14
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.2} />
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.05]);
  
  const opacityOut = interpolate(frame, [152, 180], [1, 0], { easing: E_IN });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0808 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 85% 85% at center, #ff690010 0%, transparent 70%)`
      }} />
      
      <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
        <svg style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }}
          width={1200} height={1200} viewBox="-600 -600 1200 1200">
          {[0.3,0.55,0.8].map((r,i) => (
            <circle key={i} cx={0} cy={0} r={600*r} fill="none"
              stroke="#ff6900" strokeWidth={0.8} strokeOpacity={0.1}
              transform={`rotate(${frame*0.35*(i%2?1:-0.7)})`}/>
          ))}
          <g transform={`rotate(${frame*0.35})`}>
            {Array.from({length:8},(_,i)=>{
              const a=(i/8)*Math.PI*2, r=600*0.3;
              return <ellipse key={i} cx={Math.cos(a)*r} cy={Math.sin(a)*r}
                rx={54} ry={27} fill="#ff6900" fillOpacity={0.1} stroke="#ff6900"
                strokeWidth={0.7} strokeOpacity={0.3}
                transform={`rotate(${a*180/Math.PI+90},${Math.cos(a)*r},${Math.sin(a)*r})`}/>;
            })}
          </g>
          <circle cx={0} cy={0} r={8} fill="#ff6900" opacity={0.9}
            style={{filter:"drop-shadow(0 0 8px #ff6900)"}}/>
        </svg>
      </div>
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 65px"
      }}>
        <div style={{
          textAlign: "center",
          opacity: opacityOut,
          transform: `translateY(${idle.y}px) scale(${idle.s})`
        }}>
          <div style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily,
            letterSpacing: "-0.045em",
            lineHeight: 1.0
          }}>
            Écosystème
          </div>
          <div style={{
            fontSize: 64,
            fontWeight: 200,
            color: "#ff6900",
            fontFamily,
            letterSpacing: "-0.03em",
            marginTop: 16
          }}>
            connecté
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene7 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 170], [1.0, 1.05]);
  
  const opacityOut = interpolate(frame, [142, 170], [1, 0], { easing: E_IN });
  
  const blurIn1 = interpolate(frame, [0, 34], [20, 0], { easing: E_OUT });
  const opacity1 = interpolate(frame, [0, 18], [0, 1], { easing: E_OUT });
  const push1 = interpolate(Math.max(0, frame - 12), [0, 24], [0, -32], { easing: E_OUT });
  
  const blurIn2 = interpolate(frame, [14, 48], [20, 0], { easing: E_OUT });
  const opacity2 = interpolate(frame, [14, 32], [0, 1], { easing: E_OUT });
  const push2 = interpolate(Math.max(0, frame - 24), [0, 24], [0, -32], { easing: E_OUT });
  
  const blurIn3 = interpolate(frame, [28, 62], [20, 0], { easing: E_OUT });
  const opacity3 = interpolate(frame, [28, 46], [0, 1], { easing: E_OUT });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #050510 0%, #0d0a00 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 75% 75% at center, #ff690012 0%, transparent 70%)`
      }} />
      
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 65px"
      }}>
        <div style={{
          textAlign: "center",
          opacity: opacityOut,
          transform: `translateY(${idle.y}px) scale(${idle.s})`
        }}>
          <div style={{
            fontSize: 84,
            fontWeight: 800,
            color: "#ff6900",
            fontFamily,
            letterSpacing: "-0.045em",
            lineHeight: 1.1,
            opacity: opacity1,
            filter: `blur(${blurIn1}px)`,
            transform: `translateY(${push1}px)`
          }}>
            Mi
          </div>
          
          <div style={{
            fontSize: 84,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily,
            letterSpacing: "-0.045em",
            lineHeight: 1.1,
            opacity: opacity2,
            filter: `blur(${blurIn2}px)`,
            transform: `translateY(${push2}px)`
          }}>
            Redmi
          </div>
          
          <div style={{
            fontSize: 84,
            fontWeight: 800,
            color: "#ff6900",
            fontFamily,
            letterSpacing: "-0.045em",
            lineHeight: 1.1,
            opacity: opacity3,
            filter: `blur(${blurIn3}px)`
          }}>
            POCO
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene8 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.05]);
  
  const blurIn = interpolate(frame, [0, 34], [20, 0], { easing: E_OUT });
  const scaleSpring = spring(frame, 60, { damping: 28, stiffness: 200 }, 0.93, 1);
  const opacityIn = interpolate(frame, [0, 18], [0, 1], { easing: E_OUT });
  const opacityOut = interpolate(frame, [152, 180], [1, 0], { easing: E_IN });
  
  const idle = {
    y: Math.sin(frame * 0.028) * 4,
    s: 1 + Math.sin(frame * 0.022) * 0.004
  };
  
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1000 100%)",
        transform: `translate(${drift.x}px, ${drift.y}px) scale(${kenBurns * drift.s}) rotate(${drift.r}deg)`
      }} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 60% 60% at center, #ff690015 0%, transparent 70%)`
      }} />
      
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 65px"
      }}>
        <div style={{
          textAlign: "center",
          opacity: opacityIn * opacityOut,
          transform: `translateY(${idle.y}px) scale(${scaleSpring * idle.s})`,
          filter: `blur(${blurIn}px)`
        }}>
          <div style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily,
            letterSpacing: "-0.045em",
            lineHeight: 1.0,
            marginBottom: 24
          }}>
            L'avenir
          </div>
          <div style={{
            fontSize: 72,
            fontWeight: 200,
            color: "#ff6900",
            fontFamily,
            letterSpacing: "-0.03em"
          }}>
            commence maintenant
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

export const GeneratedVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={190}>
        <Scene4 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={210}>
        <Scene5 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene6 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={170}>
        <Scene7 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene8 />
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