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
  voiceoverText: "Xiaomi. Fondée en 2010 à Pékin. Innovation pour tous. Plus de 500 millions d'utilisateurs. Smartphones, écosystème connecté. Numéro 3 mondial. Prix accessible, qualité premium. Mi, Redmi, POCO. L'avenir connecté commence ici.",
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

const BreatheXiaomi = ({ accent, frame }) => (
  <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
    <svg width={600} height={600} viewBox="-300 -300 600 600">
      {[0.2,0.45,0.7].map((r,i) => (
        <circle key={i} cx={0} cy={0} r={300*r} fill="none"
          stroke={accent} strokeWidth={0.8} strokeOpacity={0.08}
          transform={`rotate(${frame*0.35*(i%2?1:-0.7)})`}/>
      ))}
      <g transform={`rotate(${frame*0.25})`}>
        {Array.from({length:6},(_,i) => {
          const a=(i/6)*Math.PI*2, r=300*0.25;
          return (
            <rect key={i} x={Math.cos(a)*r-15} y={Math.sin(a)*r-15}
              width={30} height={30} fill={accent} fillOpacity={0.12}
              rx={4} transform={`rotate(${a*180/Math.PI+frame*0.15},${Math.cos(a)*r},${Math.sin(a)*r})`}/>
          );
        })}
      </g>
      <circle cx={0} cy={0} r={12} fill={accent} opacity={0.9}
        style={{filter:`drop-shadow(0 0 12px ${accent})`}}/>
    </svg>
  </div>
);

const PhoneMockup = ({ accent, frame }) => {
  const drift = useDrift();
  return (
    <div style={{
      position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${drift.s})`
    }}>
      <div style={{
        width:280,height:580,borderRadius:46,
        background:"linear-gradient(145deg,#2c2c2c,#0e0e0e)",
        boxShadow:"0 24px 70px rgba(0,0,0,0.55), 0 70px 130px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        display:"flex",alignItems:"center",justifyContent:"center",
        transform:`translateY(${Math.sin(frame*0.026)*8}px) rotate(${Math.sin(frame*0.016)*1.2}deg)`
      }}>
        <div style={{
          width:250,height:540,borderRadius:34,overflow:"hidden",
          background:`radial-gradient(circle at 30% 20%, ${accent}22, #0a0a0a 70%)`
        }}>
          <div style={{
            height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            gap:40
          }}>
            <div style={{
              fontSize:48,fontWeight:800,color:"white",fontFamily,
              transform:`scale(${1 + Math.sin(frame*0.02)*0.04})`
            }}>Mi</div>
            <div style={{
              width:120,height:120,borderRadius:60,
              background:`linear-gradient(145deg, ${accent}, #bf3a00)`,
              boxShadow:`0 8px 30px ${accent}44`,
              transform:`rotate(${frame*0.8}deg)`
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  const accent = "#ff6900";

  const blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const scale = spring(frame, fps, {damping:28, stiffness:200}, {from:0.93, to:1});
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const idle = Math.sin(frame * 0.028) * 4;

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#0a0a0a",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 60% 80% at center, ${accent}08, transparent 70%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      <BreatheXiaomi accent={accent} frame={frame} />
      
      <div style={{
        position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:140,fontWeight:800,color:"white",fontFamily,letterSpacing:"-0.045em",
          transform:`translateY(${idle}px) scale(${scale})`,
          filter:`blur(${blur}px)`,opacity,
          textShadow:`0 4px 20px ${accent}44`
        }}>
          Xiaomi
        </div>
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  const accent = "#ff6900";

  const blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const scale = spring(frame, fps, {damping:28, stiffness:200}, {from:0.93, to:1});
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const pushUp = interpolate(Math.max(0,frame-14), [0,24], [0,-28], {easing: E_OUT});

  const line2Blur = interpolate(Math.max(0,frame-14), [0,34], [20,0], {easing: E_OUT});
  const line2Scale = spring(Math.max(0,frame-14), fps, {damping:28, stiffness:200}, {from:0.93, to:1});
  const line2Opacity = interpolate(Math.max(0,frame-14), [0,18], [0,1], {easing: E_OUT});

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#050510",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 70% 90% at center, ${accent}10, transparent 70%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      
      <div style={{
        position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:"0 65px",gap:20
      }}>
        <div style={{
          fontSize:88,fontWeight:800,color:"white",fontFamily,letterSpacing:"-0.045em",
          transform:`translateY(${pushUp}px) scale(${scale})`,
          filter:`blur(${blur}px)`,opacity
        }}>
          Fondée
        </div>
        <div style={{
          fontSize:120,fontWeight:200,color:accent,fontFamily,letterSpacing:"-0.045em",
          transform:`scale(${line2Scale})`,
          filter:`blur(${line2Blur}px)`,opacity:line2Opacity,
          textShadow:`0 4px 30px ${accent}66`
        }}>
          2010
        </div>
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const accent = "#ff6900";

  const morphProgress = interpolate(frame, [20,80], [0,1], {easing: E_OUT, extrapolateRight:"clamp"});
  const idle = Math.sin(frame * 0.028) * 4;

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#0d0a00",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 80% 60% at center, ${accent}12, transparent 65%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      
      <div style={{
        position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        padding:"0 65px"
      }}>
        <div style={{
          transform:`translateY(${idle}px)`,
          textAlign:"center"
        }}>
          <MorphText 
            from="Innovation" 
            to="pour tous" 
            progress={morphProgress}
            fontSize={100}
            color="white"
            accent={accent}
          />
        </div>
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const accent = "#ff6900";

  const value = interpolate(frame, [8, 160], [0, 500000000], {easing: E_OUT, extrapolateRight:"clamp"});
  const formattedValue = Math.floor(value).toLocaleString();

  const blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const idle = Math.sin(frame * 0.028) * 4;

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#080818",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 90% 70% at center, ${accent}08, transparent 80%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      
      <div style={{
        position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:"0 65px",gap:30
      }}>
        <div style={{
          fontSize:72,fontWeight:200,color:"white",fontFamily,
          transform:`translateY(${idle}px)`,
          filter:`blur(${blur}px)`,opacity
        }}>
          Plus de
        </div>
        <div style={{
          fontSize:110,fontWeight:800,color:accent,fontFamily,letterSpacing:"-0.045em",
          transform:`translateY(${idle}px) scale(${1 + Math.sin(frame*0.022)*0.004})`,
          filter:`blur(${blur}px)`,opacity,
          textShadow:`0 6px 40px ${accent}55`
        }}>
          {formattedValue}
        </div>
        <div style={{
          fontSize:58,fontWeight:200,color:"white",fontFamily,
          transform:`translateY(${idle}px)`,
          filter:`blur(${blur}px)`,opacity
        }}>
          utilisateurs
        </div>
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const accent = "#ff6900";

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#0a0808",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 85% 75% at center, ${accent}10, transparent 70%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      <PhoneMockup accent={accent} frame={frame} />
      
      <div style={{
        position:"absolute",bottom:200,left:0,right:0,
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:78,fontWeight:800,color:"white",fontFamily,letterSpacing:"-0.045em",
          transform:`translateY(${Math.sin(frame * 0.028) * 4}px)`,
          opacity:interpolate(frame, [0,18], [0,1], {easing: E_OUT}),
          filter:`blur(${interpolate(frame, [0,34], [20,0], {easing: E_OUT})}px)`
        }}>
          Smartphones
        </div>
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  const accent = "#ff6900";

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#f5f5f7",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 70% 80% at center, ${accent}06, transparent 75%)`
        }} />
      </div>
      
      <div style={{
        position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"
      }}>
        <div style={{
          transform:`translateY(${interpolate(frame,[0,32],[100,0],{easing:E_OUT})}%)`
        }}>
          <div style={{
            position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
            padding:"0 65px"
          }}>
            <div style={{
              fontSize:96,fontWeight:800,color:"#1d1d1f",fontFamily,letterSpacing:"-0.045em",
              textAlign:"center",lineHeight:1.0
            }}>
              Numéro 3<br/>
              <span style={{color:accent,fontSize:88}}>mondial</span>
            </div>
          </div>
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.2} />
    </AbsoluteFill>
  );
};

const Scene7 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  const accent = "#ff6900";

  const blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const scale = spring(frame, fps, {damping:28, stiffness:200}, {from:0.93, to:1});
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const pushUp = interpolate(Math.max(0,frame-14), [0,24], [0,-35], {easing: E_OUT});

  const line2Blur = interpolate(Math.max(0,frame-14), [0,34], [20,0], {easing: E_OUT});
  const line2Scale = spring(Math.max(0,frame-14), fps, {damping:28, stiffness:200}, {from:0.93, to:1});
  const line2Opacity = interpolate(Math.max(0,frame-14), [0,18], [0,1], {easing: E_OUT});

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#0a0a0a",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 75% 85% at center, ${accent}09, transparent 70%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      
      <div style={{
        position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:"0 65px",gap:25
      }}>
        <div style={{
          fontSize:82,fontWeight:800,color:"white",fontFamily,letterSpacing:"-0.045em",
          transform:`translateY(${pushUp}px) scale(${scale})`,
          filter:`blur(${blur}px)`,opacity,
          textAlign:"center"
        }}>
          Prix accessible
        </div>
        <div style={{
          fontSize:88,fontWeight:200,color:accent,fontFamily,letterSpacing:"-0.045em",
          transform:`scale(${line2Scale})`,
          filter:`blur(${line2Blur}px)`,opacity:line2Opacity,
          textShadow:`0 4px 30px ${accent}66`,
          textAlign:"center"
        }}>
          qualité premium
        </div>
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene8 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const accent = "#ff6900";

  const brands = ["Mi", "Redmi", "POCO"];
  const staggerDelay = 25;

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#050510",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 80% 70% at center, ${accent}11, transparent 75%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      
      <div style={{
        position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:"0 65px",gap:40
      }}>
        {brands.map((brand, i) => {
          const brandFrame = Math.max(0, frame - i * staggerDelay);
          const blur = interpolate(brandFrame, [0,34], [20,0], {easing: E_OUT});
          const opacity = interpolate(brandFrame, [0,18], [0,1], {easing: E_OUT});
          const scale = 1 + Math.sin((frame + i * 40) * 0.022) * 0.004;
          
          return (
            <div key={brand} style={{
              fontSize: i === 1 ? 110 : 95,
              fontWeight: i === 0 ? 800 : 200,
              color: i === 1 ? accent : "white",
              fontFamily,
              letterSpacing:"-0.045em",
              transform:`scale(${scale})`,
              filter:`blur(${blur}px)`,
              opacity,
              textShadow: i === 1 ? `0 6px 40px ${accent}55` : "none"
            }}>
              {brand}
            </div>
          );
        })}
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene9 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const accent = "#ff6900";

  const blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const idle = Math.sin(frame * 0.028) * 4;
  const scaleBreath = 1 + Math.sin(frame * 0.022) * 0.008;

  return (
    <AbsoluteFill>
      <div style={{
        position:"absolute",inset:0,background:"#0a0a0a",
        transform:`translate(${drift.x}px,${drift.y}px) scale(${interpolate(frame,[0,180],[1.0,1.05])})`
      }}>
        <div style={{
          position:"absolute",inset:0,
          background:`radial-gradient(ellipse 90% 80% at center, ${accent}12, transparent 70%)`
        }} />
      </div>
      <DepthRings color={accent} frame={frame} />
      <BreatheXiaomi accent={accent} frame={frame} />
      
      <div style={{
        position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:"0 65px",gap:30
      }}>
        <div style={{
          fontSize:78,fontWeight:200,color:"white",fontFamily,letterSpacing:"-0.045em",
          transform:`translateY(${idle}px) scale(${scaleBreath})`,
          filter:`blur(${blur}px)`,opacity,
          textAlign:"center"
        }}>
          L'avenir connecté
        </div>
        <div style={{
          fontSize:98,fontWeight:800,color:accent,fontFamily,letterSpacing:"-0.045em",
          transform:`translateY(${idle}px) scale(${scaleBreath})`,
          filter:`blur(${blur}px)`,opacity,
          textShadow:`0 6px 40px ${accent}66`,
          textAlign:"center"
        }}>
          commence ici
        </div>
      </div>
      
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const GeneratedVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={220}>
        <Scene4 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={200}>
        <Scene5 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene6 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={220}>
        <Scene7 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={240}>
        <Scene8 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      
      <TransitionSeries.Sequence durationInFrames={220}>
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