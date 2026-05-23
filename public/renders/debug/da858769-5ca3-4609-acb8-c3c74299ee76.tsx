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
  voiceoverText: "Xiaomi. Fondée en 2010. Innovation pour tous. Numéro trois mondial. Smartphones exceptionnels. Écosystème connecté. Prix accessible. Technologie premium. Toujours en mouvement. L'avenir commence ici.",
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
              transform:`translateY(${interpolate(lp,[0,1],[0,-fontSize*0.3],{easing:Easing.bezier(0.7, 0, 0.84, 0)})}px)`,
              filter:`blur(${interpolate(lp,[0,1],[0,5])}px)`}}>{fc}</span>
            <span style={{color:accent,opacity:lp,display:"inline-block",
              transform:`translateY(${interpolate(lp,[0,1],[fontSize*0.3,0],{easing:Easing.bezier(0.16, 1, 0.3, 1)})}px)`,
              filter:`blur(${interpolate(lp,[0,1],[5,0])}px)`}}>{tc}</span>
          </span>
        );
      })}
    </div>
  );
};

const BreatheRings = ({ frame, color }) => (
  <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
    <svg width={600} height={600} viewBox="-300 -300 600 600">
      {[0.3,0.55,0.8].map((r,i) => (
        <circle key={i} cx={0} cy={0} r={300*r} fill="none"
          stroke={color} strokeWidth={0.8} strokeOpacity={0.1}
          transform={`rotate(${frame*0.35*(i%2?1:-0.7)})`}/>
      ))}
      <g transform={`rotate(${frame*0.35})`}>
        {Array.from({length:8},(_,i) => {
          const a=(i/8)*Math.PI*2, r=300*0.3;
          return <ellipse key={i} cx={Math.cos(a)*r} cy={Math.sin(a)*r}
            rx={54} ry={27} fill={color} fillOpacity={0.1} stroke={color}
            strokeWidth={0.7} strokeOpacity={0.3}
            transform={`rotate(${a*180/Math.PI+90},${Math.cos(a)*r},${Math.sin(a)*r})`}/>;
        })}
      </g>
      <circle cx={0} cy={0} r={8} fill={color} opacity={0.9}
        style={{filter:`drop-shadow(0 0 8px ${color})`}}/>
    </svg>
  </div>
);

const XiaomiLogo = ({ frame }) => {
  const drift = useDrift();
  return (
    <div style={{
      position:"absolute",
      top:"50%",left:"50%",
      transform:`translate(-50%,-50%) translate(${drift.x}px,${Math.sin(frame*0.026)*8+drift.y}px) rotate(${Math.sin(frame*0.016)*1.2}deg) scale(${drift.s})`,
      fontSize:240,
      fontWeight:800,
      fontFamily,
      color:"#ff6900",
      letterSpacing:"-0.06em",
      filter:`drop-shadow(0 12px 40px #ff690022)`,
      textAlign:"center"
    }}>
      Mi
    </div>
  );
};

const PhoneMockup = ({ frame, content, accentColor }) => {
  const drift = useDrift();
  return (
    <div style={{
      position:"absolute",
      top:"50%",left:"50%",
      transform:`translate(-50%,-50%) translate(${drift.x}px,${drift.y}px) scale(${drift.s}) rotate(${drift.r}deg)`,
      width:340,
      height:680,
      borderRadius:46,
      background:"linear-gradient(145deg,#2c2c2c,#0e0e0e)",
      boxShadow:"0 24px 70px rgba(0,0,0,0.55), 0 70px 130px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
      padding:12
    }}>
      <div style={{
        width:"100%",height:"100%",
        borderRadius:34,
        background:`linear-gradient(180deg, ${accentColor}11 0%, #0a0a0a 100%)`,
        overflow:"hidden",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:48,
        fontWeight:800,
        color:accentColor,
        fontFamily,
        letterSpacing:"-0.04em"
      }}>
        {content}
      </div>
    </div>
  );
};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 150], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [122, 150], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  return (
    <AbsoluteFill style={{ 
      background:"#0a0a0a",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 70% 70% at center, #ff690012 0%, transparent 70%)`,
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",
        top:"50%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        fontSize:160,
        fontWeight:800,
        fontFamily,
        color:"#ffffff",
        letterSpacing:"-0.045em",
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        transform:`translate(-50%,-50%) scale(${scale}) translateY(${Math.sin(frame * 0.028) * 4}px)`,
        textShadow:"0 4px 20px rgba(0,0,0,0.6)"
      }}>
        Xiaomi.
      </div>
      
      <Grain />
      <Vignette strength={0.3} />
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [152, 180], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  const counterValue = interpolate(frame, [8, 150], [1990, 2010], {easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight:"clamp"});
  
  return (
    <AbsoluteFill style={{ 
      background:"#050510",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 80% 80% at center, #ff690010 0%, transparent 70%)`,
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",
        top:"50%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:88,
          fontWeight:200,
          fontFamily,
          color:"#ffffff88",
          letterSpacing:"-0.045em",
          marginBottom:20,
          transform:`translateY(${Math.sin(frame * 0.028) * 4}px)`
        }}>
          Fondée en
        </div>
        <div style={{
          fontSize:180,
          fontWeight:800,
          fontFamily,
          color:"#ff6900",
          letterSpacing:"-0.055em",
          textShadow:"0 8px 30px rgba(255,105,0,0.4)",
          transform:`translateY(${Math.sin((frame+30) * 0.028) * 4}px) scale(${1 + Math.sin((frame+30) * 0.022) * 0.004})`
        }}>
          {Math.round(counterValue)}
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 160], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [132, 160], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  const morphProgress = interpolate(frame, [20, 80], [0, 1], {easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight:"clamp"});
  
  return (
    <AbsoluteFill style={{ 
      background:"#0d0a00",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 75% 75% at center, #ff690008 0%, transparent 70%)`,
      }} />
      <BreatheRings frame={frame} color="#ff6900" />
      
      <div style={{
        position:"absolute",
        top:"50%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:140,
          lineHeight:1.0,
          transform:`translateY(${Math.sin(frame * 0.028) * 4}px)`
        }}>
          <MorphText 
            from="Innovation"
            to="Innovation"
            progress={morphProgress}
            fontSize={140}
            color="#ffffff"
            accent="#ff6900"
          />
        </div>
        <div style={{
          fontSize:76,
          fontWeight:200,
          fontFamily,
          color:"#ffffff66",
          letterSpacing:"-0.045em",
          marginTop:30,
          transform:`translateY(${Math.sin((frame+40) * 0.028) * 4}px)`
        }}>
          pour tous
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.35} />
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 170], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [142, 170], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  return (
    <AbsoluteFill style={{ 
      background:"#080818",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 70% 70% at center, #ff690011 0%, transparent 70%)`,
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",
        top:"40%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:98,
          fontWeight:800,
          fontFamily,
          color:"#ff6900",
          letterSpacing:"-0.045em",
          marginBottom:40,
          transform:`translateY(${Math.sin(frame * 0.028) * 4}px)`,
          textShadow:"0 6px 25px rgba(255,105,0,0.3)"
        }}>
          N°3
        </div>
        <div style={{
          fontSize:64,
          fontWeight:200,
          fontFamily,
          color:"#ffffff",
          letterSpacing:"-0.04em",
          lineHeight:1.2,
          transform:`translateY(${Math.sin((frame+30) * 0.028) * 4}px)`
        }}>
          mondial
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [152, 180], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  const phoneScale = spring({ frame: frame-10, fps, config: { damping: 25, stiffness: 180 }, from: 0.8, to: 1 });
  const phoneOpacity = interpolate(frame, [10,30], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  
  return (
    <AbsoluteFill style={{ 
      background:"#0a0808",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 65% 65% at center, #ff690009 0%, transparent 70%)`,
      }} />
      
      <div style={{
        position:"absolute",
        top:"15%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        fontSize:84,
        fontWeight:800,
        fontFamily,
        color:"#ffffff",
        letterSpacing:"-0.045em",
        padding:"0 65px",
        transform:`translate(-50%,-50%) scale(${scale}) translateY(${Math.sin(frame * 0.028) * 4}px)`
      }}>
        Smartphones
      </div>
      
      <div style={{
        transform:`scale(${phoneScale})`,
        opacity:phoneOpacity * exitOpacity
      }}>
        <PhoneMockup frame={frame} content="Mi 14" accentColor="#ff6900" />
      </div>
      
      <div style={{
        position:"absolute",
        bottom:"15%",left:"50%",
        transform:`translate(-50%,50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        fontSize:72,
        fontWeight:200,
        fontFamily,
        color:"#ffffff88",
        letterSpacing:"-0.04em",
        padding:"0 65px",
        transform:`translate(-50%,50%) scale(${scale}) translateY(${Math.sin((frame+50) * 0.028) * 4}px)`
      }}>
        exceptionnels
      </div>
      
      <Grain />
      <Vignette strength={0.35} />
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const line1Opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const line1Scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const line1Y = interpolate(Math.max(0,frame-12), [0,24], [0,-28], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  
  const line2Opacity = interpolate(frame, [14,32], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const line2Scale = spring({ frame: frame-14, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  
  const kenBurns = interpolate(frame, [0, 165], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [137, 165], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  return (
    <AbsoluteFill style={{ 
      background:"#f5f5f7",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 80% 80% at center, #ff690005 0%, transparent 70%)`,
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",
        top:"50%",left:"50%",
        transform:`translate(-50%,-50%)`,
        textAlign:"center",
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:120,
          fontWeight:800,
          fontFamily,
          color:"#1d1d1f",
          letterSpacing:"-0.045em",
          marginBottom:20,
          opacity:line1Opacity * exitOpacity,
          transform:`scale(${line1Scale}) translateY(${line1Y + Math.sin(frame * 0.028) * 4}px)`
        }}>
          Écosystème
        </div>
        <div style={{
          fontSize:96,
          fontWeight:200,
          fontFamily,
          color:"#ff6900",
          letterSpacing:"-0.04em",
          opacity:line2Opacity * exitOpacity,
          transform:`scale(${line2Scale}) translateY(${Math.sin((frame+30) * 0.028) * 4}px)`,
          textShadow:"0 4px 20px rgba(255,105,0,0.2)"
        }}>
          connecté
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
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 155], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [127, 155], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  const maskReveal = interpolate(frame, [0,32], [100,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  
  return (
    <AbsoluteFill style={{ 
      background:"#0a0a0a",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 70% 70% at center, #ff690010 0%, transparent 70%)`,
      }} />
      <BreatheRings frame={frame} color="#ff6900" />
      
      <div style={{
        position:"absolute",
        top:"50%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        padding:"0 65px",
        overflow:"hidden"
      }}>
        <div style={{
          transform:`translateY(${maskReveal}%)`,
          fontSize:140,
          fontWeight:800,
          fontFamily,
          color:"#ff6900",
          letterSpacing:"-0.045em",
          textShadow:"0 8px 35px rgba(255,105,0,0.4)",
          transform:`translateY(${maskReveal}%) translateY(${Math.sin(frame * 0.028) * 4}px) scale(${1 + Math.sin(frame * 0.022) * 0.004})`
        }}>
          Prix accessible
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

const Scene8 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 145], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [117, 145], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  const morphProgress = interpolate(frame, [15, 75], [0, 1], {easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight:"clamp"});
  
  return (
    <AbsoluteFill style={{ 
      background:"#050510",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 75% 75% at center, #ff690012 0%, transparent 70%)`,
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",
        top:"50%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:130,
          lineHeight:1.0,
          transform:`translateY(${Math.sin(frame * 0.028) * 4}px)`
        }}>
          <MorphText 
            from="Technologie"
            to="Premium"
            progress={morphProgress}
            fontSize={130}
            color="#ffffff"
            accent="#ff6900"
          />
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.35} />
    </AbsoluteFill>
  );
};

const Scene9 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 140], [1.0, 1.05]);
  const exitOpacity = interpolate(frame, [112, 140], [1,0], {easing: Easing.bezier(0.7, 0, 0.84, 0)});
  
  return (
    <AbsoluteFill style={{ 
      background:"#0d0a00",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 80% 80% at center, #ff690008 0%, transparent 70%)`,
      }} />
      
      <div style={{
        position:"absolute",
        top:"30%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        fontSize:96,
        fontWeight:200,
        fontFamily,
        color:"#ffffff88",
        letterSpacing:"-0.04em",
        padding:"0 65px",
        transform:`translate(-50%,-50%) scale(${scale}) translateY(${Math.sin(frame * 0.028) * 4}px)`
      }}>
        Toujours en
      </div>
      
      <XiaomiLogo frame={frame} />
      
      <div style={{
        position:"absolute",
        bottom:"30%",left:"50%",
        transform:`translate(-50%,50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity:opacity * exitOpacity,
        fontSize:120,
        fontWeight:800,
        fontFamily,
        color:"#ff6900",
        letterSpacing:"-0.045em",
        padding:"0 65px",
        textShadow:"0 8px 35px rgba(255,105,0,0.4)",
        transform:`translate(-50%,50%) scale(${scale}) translateY(${Math.sin((frame+60) * 0.028) * 4}px)`
      }}>
        mouvement
      </div>
      
      <Grain />
      <Vignette strength={0.3} />
    </AbsoluteFill>
  );
};

const Scene10 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useDrift();
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scale = spring({ frame, fps, config: { damping: 28, stiffness: 200 }, from: 0.93, to: 1 });
  const opacity = interpolate(frame, [0,18], [0,1], {easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const kenBurns = interpolate(frame, [0, 120], [1.0, 1.05]);
  
  return (
    <AbsoluteFill style={{ 
      background:"#080818",
      transform:`translate(${drift.x}px,${drift.y}px) scale(${kenBurns})`,
      overflow:"hidden"
    }}>
      <div style={{
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 60% 60% at center, #ff690015 0%, transparent 70%)`,
      }} />
      <BreatheRings frame={frame} color="#ff6900" />
      
      <div style={{
        position:"absolute",
        top:"40%",left:"50%",
        transform:`translate(-50%,-50%) scale(${scale})`,
        textAlign:"center",
        filter:`blur(${blur}px)`,
        opacity,
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:84,
          fontWeight:200,
          fontFamily,
          color:"#ffffff66",
          letterSpacing:"-0.04em",
          marginBottom:30,
          transform:`translateY(${Math.sin(frame * 0.028) * 4}px)`
        }}>
          L'avenir
        </div>
        <div style={{
          fontSize:140,
          fontWeight:800,
          fontFamily,
          color:"#ff6900",
          letterSpacing:"-0.055em",
          textShadow:"0 12px 40px rgba(255,105,0,0.5)",
          transform:`translateY(${Math.sin((frame+40) * 0.028) * 4}px) scale(${1 + Math.sin((frame+40) * 0.022) * 0.004})`
        }}>
          commence
        </div>
        <div style={{
          fontSize:88,
          fontWeight:800,
          fontFamily,
          color:"#ffffff",
          letterSpacing:"-0.045em",
          marginTop:30,
          transform:`translateY(${Math.sin((frame+80) * 0.028) * 4}px)`
        }}>
          ici.
        </div>
      </div>
      
      <Grain />
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

export const GeneratedVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}>
        <Scene1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={160}>
        <Scene3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={170}>
        <Scene4 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={180}>
        <Scene5 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={165}>
        <Scene6 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={155}>
        <Scene7 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={145}>
        <Scene8 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={140}>
        <Scene9 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={120}>
        <Scene10 />
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