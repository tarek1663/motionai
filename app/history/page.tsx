"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { colors, accentAlpha, fonts } from "@/lib/colors";

const accent = colors.accent;

type Video = {
  id: string;
  prompt: string;
  format_name: string;
  duration: number;
  video_url: string;
  accent_color: string;
  created_at: string;
  status: string;
};

const NAV_ITEMS = [
  { icon: "✏️", label: "Créer", href: "/dashboard", active: false },
  { icon: "🎬", label: "Historique", href: "/history", active: true },
  { icon: "⚙️", label: "Compte", href: "/account", active: false },
];

export default function HistoryPage() {
  const { user } = useUser();
  const [videos, setVideos]   = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter]   = useState<"all" | "30s" | "60s" | "2min">("all");

  useEffect(() => {
    if (!user) return;
    loadVideos();
  }, [user]);

  const loadVideos = async () => {
    try {
      const res  = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.videos || []);
    } catch {}
    finally { setLoading(false); }
  };

  const deleteVideo = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
      setVideos(v => v.filter(vid => vid.id !== id));
    } catch {}
    finally { setDeleting(null); }
  };

  const filtered = videos.filter(v => {
    if (filter === "all") return true;
    if (filter === "30s")  return v.duration <= 30;
    if (filter === "60s")  return v.duration > 30 && v.duration <= 60;
    if (filter === "2min") return v.duration > 60;
    return true;
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1)  return "À l'instant";
    if (mins < 60) return `Il y a ${mins}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7)  return `Il y a ${days}j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <div style={{
      minHeight: "100vh", background: colors.bg2,
      fontFamily: fonts.sans,
      display: "flex",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .video-card:hover .video-actions { opacity: 1 !important; }
        .video-card:hover .video-overlay { opacity: 1 !important; }
        .nav-item:hover { background: ${colors.borderSubtle} !important; }
        .del-btn:hover { background: rgba(239,68,68,0.1) !important; border-color: ${colors.error} !important; color: ${colors.error} !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 56, height: "100vh", position: "fixed", left: 0, top: 0,
        background: colors.sidebarBg, borderRight: `1px solid ${colors.borderSubtle}`,
        display: "flex", flexDirection: "column",
        alignItems: "center", padding: "16px 0", gap: 4, zIndex: 50,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 20,
          boxShadow: `0 4px 12px ${accentAlpha(0.27)}`,
        }}>M</div>
        {NAV_ITEMS.map(item => (
          <a key={item.href} href={item.href} title={item.label} className="nav-item" style={{
            width: 36, height: 36, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: item.active ? colors.accentSubtle : "transparent",
            textDecoration: "none", fontSize: 16,
            border: item.active ? `1px solid ${accentAlpha(0.13)}` : "1px solid transparent",
            transition: "all 0.15s",
          }}>
            {item.icon}
          </a>
        ))}
        <div style={{ marginTop: "auto" }}>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: 56, flex: 1, padding: "40px 40px" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 32,
        }}>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 800, color: colors.text,
              letterSpacing: "-0.04em", marginBottom: 4,
            }}>
              Mes vidéos
            </h1>
            <p style={{ fontSize: 14, color: colors.textMuted }}>
              {videos.length} vidéo{videos.length !== 1 ? "s" : ""} générée{videos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <a href="/dashboard" style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", background: accent, color: "#fff",
            borderRadius: 10, fontSize: 13, fontWeight: 700,
            textDecoration: "none", boxShadow: `0 4px 16px ${accentAlpha(0.27)}`,
          }}>
            + Nouvelle vidéo
          </a>
        </div>

        {/* Filtres */}
        {videos.length > 0 && (
          <div style={{
            display: "flex", gap: 6, marginBottom: 28,
            background: colors.borderSubtle, borderRadius: 12, padding: 4,
            width: "fit-content",
          }}>
            {[
              { id: "all", label: "Toutes" },
              { id: "30s", label: "30s" },
              { id: "60s", label: "60s" },
              { id: "2min", label: "2min" },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id as any)} style={{
                padding: "7px 16px", borderRadius: 9, border: "none",
                background: filter === f.id ? colors.bg : "transparent",
                color: filter === f.id ? colors.text : colors.textMuted,
                fontSize: 13, fontWeight: filter === f.id ? 700 : 500,
                cursor: "pointer",
                boxShadow: filter === f.id ? "0 1px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}>
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16,
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                borderRadius: 16, overflow: "hidden",
                background: colors.borderSubtle,
                aspectRatio: "9/16",
                animation: "pulse 1.5s infinite",
              }} />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          </div>
        )}

        {/* Empty */}
        {!loading && videos.length === 0 && (
          <div style={{
            textAlign: "center", padding: "100px 0",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: colors.accentSubtle, border: `2px solid ${accentAlpha(0.13)}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, margin: "0 auto 20px",
            }}>🎬</div>
            <h2 style={{
              fontSize: 22, fontWeight: 800, color: colors.text,
              letterSpacing: "-0.03em", marginBottom: 8,
            }}>
              Aucune vidéo encore
            </h2>
            <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 28 }}>
              Génère ta première vidéo motion design
            </p>
            <a href="/dashboard" style={{
              display: "inline-block", padding: "12px 28px",
              background: accent, color: "#fff",
              borderRadius: 10, fontWeight: 700, fontSize: 14,
              textDecoration: "none", boxShadow: `0 4px 16px ${accentAlpha(0.27)}`,
            }}>
              Créer une vidéo →
            </a>
          </div>
        )}

        {/* Grille vidéos */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}>
            {filtered.map(video => (
              <div key={video.id} className="video-card" style={{
                borderRadius: 16, overflow: "hidden",
                background: colors.bg,
                border: `1.5px solid ${colors.borderSubtle}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "all 0.2s",
                cursor: "pointer",
                position: "relative",
              }}>
                {/* Thumbnail */}
                <div style={{
                  position: "relative", aspectRatio: "9/16",
                  background: colors.text, overflow: "hidden",
                }}>
                  <video
                    src={video.video_url}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted loop playsInline
                    onMouseEnter={e => { (e.target as HTMLVideoElement).play(); setPlaying(video.id); }}
                    onMouseLeave={e => {
                      const v = e.target as HTMLVideoElement;
                      v.pause(); v.currentTime = 0;
                      setPlaying(null);
                    }}
                  />

                  {/* Overlay au hover */}
                  <div className="video-overlay" style={{
                    position: "absolute", inset: 0, opacity: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)",
                    transition: "opacity 0.2s",
                    display: "flex", flexDirection: "column",
                    justifyContent: "flex-end", padding: 12,
                  }}>
                    {/* Actions hover */}
                    <div className="video-actions" style={{
                      display: "flex", gap: 8, opacity: 0, transition: "opacity 0.2s",
                    }}>
                      <a
                        href={video.video_url}
                        download
                        onClick={e => e.stopPropagation()}
                        style={{
                          flex: 1, padding: "8px 0", textAlign: "center",
                          background: "#ffffff", color: "#000",
                          borderRadius: 8, fontSize: 12, fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        ↓ Télécharger
                      </a>
                      <button
                        className="del-btn"
                        onClick={e => { e.stopPropagation(); deleteVideo(video.id); }}
                        disabled={deleting === video.id}
                        style={{
                          width: 34, padding: "8px",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#fff", borderRadius: 8,
                          fontSize: 12, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {deleting === video.id ? "..." : "✕"}
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{
                    position: "absolute", top: 8, left: 8, right: 8,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    {video.format_name && (
                      <div style={{
                        padding: "3px 8px", borderRadius: 100,
                        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                        fontSize: 9, fontWeight: 700, color: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        maxWidth: "70%", overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {video.format_name}
                      </div>
                    )}
                    {video.accent_color && (
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: video.accent_color,
                        boxShadow: `0 0 8px ${video.accent_color}`,
                        flexShrink: 0,
                      }} />
                    )}
                  </div>

                  {/* Play indicator */}
                  {playing !== video.id && (
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 40, height: 40, borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div style={{ padding: "12px 14px" }}>
                  <div style={{
                    fontSize: 12, color: colors.text, fontWeight: 600,
                    marginBottom: 4, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                    letterSpacing: "-0.01em",
                  }}>
                    {video.prompt}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 11, color: colors.textMuted }}>
                      {formatDate(video.created_at)}
                    </span>
                    {video.duration && (
                      <span style={{
                        fontSize: 10, color: colors.textMuted,
                        background: colors.bg3, padding: "2px 6px",
                        borderRadius: 100, fontWeight: 600,
                      }}>
                        {video.duration}s
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Aucun résultat pour le filtre */}
        {!loading && videos.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: colors.textMuted, fontSize: 14 }}>
            Aucune vidéo pour ce filtre
          </div>
        )}
      </div>
    </div>
  );
}
