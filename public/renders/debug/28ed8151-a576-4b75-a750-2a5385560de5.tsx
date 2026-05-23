import { registerRoot, Composition, AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, Audio, staticFile, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";

export const metadata = {
  voiceoverText: "Xiaomi. Fondée en 2010. Une vision simple. Technologie accessible. Innovation pour tous. Smartphones révolutionnaires. Écosystème connecté. Plus de 300 millions d'utilisateurs. Leader mondial. L'avenir commence maintenant.",
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
          transform={`rotate(${r*0.08*(i%2===0?1:-0.6)})`} />
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

const Scene1 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.05]);
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const scale = spring(frame, 60, {damping:28, stiffness:200}) * 0.93 + 0.07;
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const idle = Math.sin(frame * 0.028) * 4;
  const exitOpacity = interpolate(frame, [152, 180], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #0a0a0a, #050510)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px) rotate(${drift.r}deg)`
      }} />
      <div style={{ 
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 60% 40% at center, rgba(255,105,0,0.1) 0%, transparent 70%)`
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, ${-50 + idle}px) scale(${scale})`,
        opacity: opacity * exitOpacity,
        filter:`blur(${blur}px)`,
        textAlign:"center",
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:180,
          fontWeight:800,
          color:"#ffffff",
          fontFamily,
          letterSpacing:"-0.045em",
          lineHeight:1.0,
          textShadow:"0 2px 4px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.3)"
        }}>
          Xiaomi
        </div>
        <div style={{
          fontSize:42,
          fontWeight:200,
          color:"#ff6900",
          fontFamily,
          marginTop:24,
          letterSpacing:"0.02em"
        }}>
          Innovation for Everyone
        </div>
      </div>
      
      <Vignette strength={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 150], [1.0, 1.05]);
  
  const year = Math.round(interpolate(frame, [8, 120], [2005, 2010], {easing: E_OUT, extrapolateRight:"clamp"}));
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const exitOpacity = interpolate(frame, [122, 150], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #0d0a00, #080818)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px)`
      }} />
      <div style={{ 
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 70% 50% at center, rgba(255,105,0,0.08) 0%, transparent 80%)`
      }} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, -50%)`,
        opacity: opacity * exitOpacity,
        textAlign:"center"
      }}>
        <div style={{
          fontSize:220,
          fontWeight:800,
          color:"#ff6900",
          fontFamily,
          letterSpacing:"-0.045em",
          filter:`drop-shadow(0 8px 32px rgba(255,105,0,0.3))`
        }}>
          {year}
        </div>
        <div style={{
          fontSize:38,
          fontWeight:200,
          color:"#ffffff",
          fontFamily,
          marginTop:16,
          letterSpacing:"0.01em"
        }}>
          Fondée à Beijing
        </div>
      </div>
      
      <Vignette strength={0.35} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 140], [1.0, 1.05]);
  
  const line1Blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const line1Scale = spring(frame, 60, {damping:28, stiffness:200}) * 0.93 + 0.07;
  const line1Opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const line1Push = interpolate(Math.max(0,frame-12), [0,24], [0,-28], {easing: E_OUT});
  
  const line2Blur = interpolate(frame, [14,48], [20,0], {easing: E_OUT});
  const line2Scale = spring(Math.max(0,frame-14), 60, {damping:28, stiffness:200}) * 0.93 + 0.07;
  const line2Opacity = interpolate(frame, [14,32], [0,1], {easing: E_OUT});
  
  const exitOpacity = interpolate(frame, [112, 140], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #0a0808, #050510)",
        transform:`scale(${kenBurns}) translate(${drift.x*1.2}px, ${drift.y*1.2}px)`
      }} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, -50%)`,
        textAlign:"center",
        padding:"0 65px"
      }}>
        <div style={{
          transform:`translateY(${line1Push}px) scale(${line1Scale})`,
          opacity: line1Opacity * exitOpacity,
          filter:`blur(${line1Blur}px)`,
          marginBottom:24
        }}>
          <div style={{
            fontSize:140,
            fontWeight:800,
            color:"#ffffff",
            fontFamily,
            letterSpacing:"-0.045em",
            lineHeight:1.0
          }}>
            Une vision
          </div>
        </div>
        
        <div style={{
          transform:`scale(${line2Scale})`,
          opacity: line2Opacity * exitOpacity,
          filter:`blur(${line2Blur}px)`
        }}>
          <div style={{
            fontSize:48,
            fontWeight:200,
            color:"#ff6900",
            fontFamily,
            letterSpacing:"0.01em"
          }}>
            simple & puissante
          </div>
        </div>
      </div>
      
      <Vignette strength={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 160], [1.0, 1.05]);
  
  const morphProgress = interpolate(frame, [20, 80], [0, 1], {easing: E_OUT});
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const exitOpacity = interpolate(frame, [132, 160], [1,0], {easing: E_IN});
  const idle = Math.sin(frame * 0.028) * 6;
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #f5f5f7, #e8e8ed)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px)`
      }} />
      <div style={{ 
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 80% 60% at center, rgba(255,105,0,0.12) 0%, transparent 70%)`
      }} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, ${-50 + idle}px)`,
        opacity: opacity * exitOpacity,
        textAlign:"center",
        padding:"0 65px"
      }}>
        <MorphText 
          from="Luxe exclusif"
          to="Tech accessible"
          progress={morphProgress}
          fontSize={120}
          color="#1d1d1f"
          accent="#ff6900"
        />
        <div style={{
          fontSize:36,
          fontWeight:200,
          color:"#86868b",
          fontFamily,
          marginTop:32,
          letterSpacing:"0.01em"
        }}>
          Révolutionner l'industrie
        </div>
      </div>
      
      <Vignette strength={0.25} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 170], [1.0, 1.05]);
  
  const phoneFloat = Math.sin(frame * 0.026) * 8;
  const phoneRotate = Math.sin(frame * 0.016) * 1.2;
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const exitOpacity = interpolate(frame, [142, 170], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #0a0a0a, #0d0a00)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px)`
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, -50%)`,
        opacity: opacity * exitOpacity
      }}>
        <div style={{
          width:280,
          height:580,
          borderRadius:46,
          background:"linear-gradient(145deg,#2c2c2c,#0e0e0e)",
          boxShadow:"0 24px 70px rgba(0,0,0,0.55), 0 70px 130px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          transform:`translateY(${phoneFloat}px) rotate(${phoneRotate}deg)`,
          overflow:"hidden",
          position:"relative"
        }}>
          <div style={{
            position:"absolute",
            top:12,
            left:12,
            right:12,
            bottom:12,
            borderRadius:34,
            background:"linear-gradient(145deg, #ff6900, #e55a00)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexDirection:"column"
          }}>
            <div style={{
              fontSize:72,
              fontWeight:800,
              color:"#ffffff",
              fontFamily,
              letterSpacing:"-0.03em"
            }}>
              Mi
            </div>
            <div style={{
              fontSize:24,
              fontWeight:200,
              color:"rgba(255,255,255,0.8)",
              fontFamily,
              marginTop:8
            }}>
              Smartphone
            </div>
          </div>
        </div>
      </div>
      
      <div style={{
        position:"absolute",bottom:180,left:"50%",
        transform:`translate(-50%, 0)`,
        opacity: opacity * exitOpacity
      }}>
        <div style={{
          fontSize:54,
          fontWeight:200,
          color:"#ffffff",
          fontFamily,
          textAlign:"center",
          letterSpacing:"0.01em"
        }}>
          Révolutionnaires
        </div>
      </div>
      
      <Vignette strength={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 155], [1.0, 1.05]);
  
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const exitOpacity = interpolate(frame, [127, 155], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #080818, #050510)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px)`
      }} />
      
      <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
        <svg style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }}
          width={800} height={800} viewBox="-300 -300 600 600">
          {[0.3,0.55,0.8].map((r,i) => (
            <circle key={i} cx={0} cy={0} r={300*r} fill="none"
              stroke="#ff6900" strokeWidth={0.8} strokeOpacity={0.1}
              transform={`rotate(${frame*0.35*(i%2?1:-0.7)})`}/>
          ))}
          <g transform={`rotate(${frame*0.35})`}>
            {Array.from({length:8},(_,i) => {
              const a=(i/8)*Math.PI*2, r=300*0.3;
              return <ellipse key={i} cx={Math.cos(a)*r} cy={Math.sin(a)*r}
                rx={54} ry={27} fill="#ff6900" fillOpacity={0.1} stroke="#ff6900"
                strokeWidth={0.7} strokeOpacity={0.3}
                transform={`rotate(${a*180/Math.PI+90},${Math.cos(a)*r},${Math.sin(a)*r})`}/>;
            })}
          </g>
          <circle cx={0} cy={0} r={8} fill="#ff6900" opacity={0.9}
            style={{filter:`drop-shadow(0 0 8px #ff6900)`}}/>
        </svg>
      </div>
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, -50%)`,
        opacity: opacity * exitOpacity,
        textAlign:"center"
      }}>
        <div style={{
          fontSize:96,
          fontWeight:800,
          color:"#ffffff",
          fontFamily,
          letterSpacing:"-0.045em",
          marginBottom:24
        }}>
          Écosystème
        </div>
        <div style={{
          fontSize:42,
          fontWeight:200,
          color:"#ff6900",
          fontFamily,
          letterSpacing:"0.01em"
        }}>
          connecté & intelligent
        </div>
      </div>
      
      <Vignette strength={0.35} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene7 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 145], [1.0, 1.05]);
  
  const users = Math.round(interpolate(frame, [8, 110], [0, 300000000], {easing: E_OUT, extrapolateRight:"clamp"}));
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const exitOpacity = interpolate(frame, [117, 145], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #0a0a0a, #0a0808)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px)`
      }} />
      <div style={{ 
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 90% 70% at center, rgba(255,105,0,0.1) 0%, transparent 80%)`
      }} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, -50%)`,
        opacity: opacity * exitOpacity,
        textAlign:"center"
      }}>
        <div style={{
          fontSize:180,
          fontWeight:800,
          color:"#ff6900",
          fontFamily,
          letterSpacing:"-0.045em",
          lineHeight:1.0,
          filter:`drop-shadow(0 12px 40px rgba(255,105,0,0.3))`
        }}>
          {(users/1000000).toFixed(0)}M+
        </div>
        <div style={{
          fontSize:38,
          fontWeight:200,
          color:"#ffffff",
          fontFamily,
          marginTop:24,
          letterSpacing:"0.01em"
        }}>
          utilisateurs dans le monde
        </div>
      </div>
      
      <Vignette strength={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene8 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 165], [1.0, 1.05]);
  
  const line1Blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const line1Scale = spring(frame, 60, {damping:28, stiffness:200}) * 0.93 + 0.07;
  const line1Opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const line1Push = interpolate(Math.max(0,frame-12), [0,24], [0,-36], {easing: E_OUT});
  
  const line2Blur = interpolate(frame, [14,48], [20,0], {easing: E_OUT});
  const line2Scale = spring(Math.max(0,frame-14), 60, {damping:28, stiffness:200}) * 0.93 + 0.07;
  const line2Opacity = interpolate(frame, [14,32], [0,1], {easing: E_OUT});
  
  const exitOpacity = interpolate(frame, [137, 165], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #f5f5f7, #e8e8ed)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px)`
      }} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, -50%)`,
        textAlign:"center",
        padding:"0 65px"
      }}>
        <div style={{
          transform:`translateY(${line1Push}px) scale(${line1Scale})`,
          opacity: line1Opacity * exitOpacity,
          filter:`blur(${line1Blur}px)`,
          marginBottom:32
        }}>
          <div style={{
            fontSize:120,
            fontWeight:800,
            color:"#1d1d1f",
            fontFamily,
            letterSpacing:"-0.045em",
            lineHeight:1.0
          }}>
            Leader
          </div>
        </div>
        
        <div style={{
          transform:`scale(${line2Scale})`,
          opacity: line2Opacity * exitOpacity,
          filter:`blur(${line2Blur}px)`
        }}>
          <div style={{
            fontSize:52,
            fontWeight:200,
            color:"#ff6900",
            fontFamily,
            letterSpacing:"0.01em"
          }}>
            mondial de l'innovation
          </div>
        </div>
      </div>
      
      <Vignette strength={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

const Scene9 = () => {
  const frame = useCurrentFrame();
  const drift = useDrift();
  const kenBurns = interpolate(frame, [0, 180], [1.0, 1.08]);
  
  const blur = interpolate(frame, [0,34], [20,0], {easing: E_OUT});
  const scale = spring(frame, 60, {damping:28, stiffness:200}) * 0.93 + 0.07;
  const opacity = interpolate(frame, [0,18], [0,1], {easing: E_OUT});
  const idle = Math.sin(frame * 0.028) * 6;
  const exitOpacity = interpolate(frame, [152, 180], [1,0], {easing: E_IN});
  
  return (
    <AbsoluteFill>
      <div style={{ 
        position:"absolute",inset:0,
        background:"linear-gradient(145deg, #0a0a0a, #050510)",
        transform:`scale(${kenBurns}) translate(${drift.x}px, ${drift.y}px)`
      }} />
      <div style={{ 
        position:"absolute",inset:0,
        background:`radial-gradient(ellipse 100% 80% at center, rgba(255,105,0,0.15) 0%, transparent 70%)`
      }} />
      <DepthRings color="#ff6900" frame={frame} />
      
      <div style={{
        position:"absolute",top:"50%",left:"50%",
        transform:`translate(-50%, ${-50 + idle}px) scale(${scale})`,
        opacity: opacity * exitOpacity,
        filter:`blur(${blur}px)`,
        textAlign:"center",
        padding:"0 65px"
      }}>
        <div style={{
          fontSize:160,
          fontWeight:800,
          color:"#ffffff",
          fontFamily,
          letterSpacing:"-0.045em",
          lineHeight:1.0,
          textShadow:"0 8px 32px rgba(255,105,0,0.4)"
        }}>
          L'avenir
        </div>
        <div style={{
          fontSize:44,
          fontWeight:200,
          color:"#ff6900",
          fontFamily,
          marginTop:32,
          letterSpacing:"0.02em"
        }}>
          commence maintenant
        </div>
      </div>
      
      <Vignette strength={0.45} />
      <Grain />
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
      <TransitionSeries.Sequence durationInFrames={150}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={140}>
        <Scene3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={160}>
        <Scene4 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={170}>
        <Scene5 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={155}>
        <Scene6 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <TransitionSeries.Sequence durationInFrames={145}>
        <Scene7 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:22})} />
      <Transition


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