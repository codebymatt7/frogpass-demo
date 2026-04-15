"use client";
import { useState, useEffect } from "react";

const font = "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

const C = {
  bg: "#09090F", surface: "#111118", card: "#16161F", cardHover: "#1A1A24",
  purple: "#4D1979", purpleLight: "#6B3FA0", purpleMid: "#3A1260", purpleDark: "#240B3D",
  purpleFaint: "rgba(107,63,160,0.12)",
  gold: "#C8A84C", goldBright: "#E2C56B", goldFaint: "rgba(200,168,76,0.10)",
  white: "#FFFFFF", text: "rgba(255,255,255,0.92)", textSec: "rgba(255,255,255,0.55)",
  textTer: "rgba(255,255,255,0.30)", border: "rgba(255,255,255,0.07)",
  green: "#22C55E", greenFaint: "rgba(34,197,94,0.08)",
  red: "#EF4444", redFaint: "rgba(239,68,68,0.08)",
};

function Styles() {
  return <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:0;height:0}
    body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .fp-card{transition:background .15s ease}.fp-card:active{background:${C.cardHover}!important}
    .fp-btn{transition:all .15s ease;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent}
    .fp-btn:active{transform:scale(.97);opacity:.85}
    input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;width:100%}
    input[type=range]::-webkit-slider-track{height:6px;border-radius:100px;background:rgba(255,255,255,0.06)}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:${C.purple};border:3px solid ${C.purpleLight};margin-top:-9px;cursor:pointer;box-shadow:0 0 12px rgba(77,25,121,0.5)}
  `}</style>;
}

/* ─── DATA ─── */
const TIERS = [
  { name: "Bronze", threshold: 0, color: "#CD7F32", bg: "rgba(205,127,50,0.10)", border: "rgba(205,127,50,0.20)" },
  { name: "Silver", threshold: 150, color: "#9CA0A6", bg: "rgba(156,160,166,0.10)", border: "rgba(156,160,166,0.20)" },
  { name: "Gold", threshold: 350, color: "#C8A84C", bg: "rgba(200,168,76,0.10)", border: "rgba(200,168,76,0.20)" },
  { name: "Purple", threshold: 600, color: "#8B5CF6", bg: "rgba(139,92,246,0.10)", border: "rgba(139,92,246,0.20)" },
];

const USER = { name: "Matt N.", points: 430, tier: "Gold", gamesAttended: 14, rank: 3, org: "Phi Delta Theta" };

const UPCOMING_GAMES = [
  { id: 1, sport: "Volleyball", opponent: "Kansas State", date: "Tue, Apr 15", time: "7:00 PM", venue: "University Rec Center", multiplier: 3, points: 30, icon: "🏐", capacity: 1200, projected: 340 },
  { id: 2, sport: "Baseball", opponent: "Oklahoma State", date: "Wed, Apr 16", time: "6:30 PM", venue: "Lupton Stadium", multiplier: 2, points: 20, icon: "⚾", capacity: 3500, projected: 1400 },
  { id: 3, sport: "Women's Soccer", opponent: "West Virginia", date: "Fri, Apr 18", time: "7:00 PM", venue: "Garvey-Rosenthal Stadium", multiplier: 3, points: 30, icon: "⚽", capacity: 1800, projected: 380 },
  { id: 4, sport: "Men's Basketball", opponent: "Texas Tech", date: "Sat, Apr 19", time: "2:00 PM", venue: "Schollmaier Arena", multiplier: 1, points: 10, icon: "🏀", capacity: 6800, projected: 5200 },
  { id: 5, sport: "Baseball", opponent: "Baylor", date: "Sat, Apr 19", time: "6:00 PM", venue: "Lupton Stadium", multiplier: 1, points: 10, icon: "⚾", capacity: 3500, projected: 2900 },
  { id: 6, sport: "Volleyball", opponent: "UCF", date: "Tue, Apr 22", time: "7:00 PM", venue: "University Rec Center", multiplier: 3, points: 30, icon: "🏐", capacity: 1200, projected: 290 },
];

const PAST_GAMES = [
  { sport: "Football", opponent: "Texas Tech", points: 10, date: "Nov 2", icon: "🏈" },
  { sport: "Volleyball", opponent: "BYU", points: 30, date: "Nov 5", icon: "🏐" },
  { sport: "Women's Soccer", opponent: "UCF", points: 30, date: "Nov 8", icon: "⚽" },
  { sport: "Men's Basketball", opponent: "Houston", points: 10, date: "Nov 12", icon: "🏀" },
  { sport: "Baseball", opponent: "Baylor", points: 20, date: "Mar 4", icon: "⚾" },
  { sport: "Volleyball", opponent: "Iowa State", points: 30, date: "Mar 7", icon: "🏐" },
];

const REWARDS = [
  { tier: "Bronze", items: [
    { name: "FrogPass Rally Towel", cost: 50, claimed: true },
    { name: "TCU Koozie Pack", cost: 75, claimed: true },
    { name: "$5 Concession Credit", cost: 100, claimed: true },
  ]},
  { tier: "Silver", items: [
    { name: "TCU Branded Hat", cost: 150, claimed: true },
    { name: "Free Hot Dog + Drink", cost: 175, claimed: true },
    { name: "FrogPass Tee", cost: 200, claimed: true },
    { name: "$10 Concession Credit", cost: 225, claimed: true },
  ]},
  { tier: "Gold", items: [
    { name: "Limited Edition Hoodie", cost: 350, claimed: true },
    { name: "Premium Concession Bundle", cost: 400, claimed: true },
    { name: "Exclusive Purple Friday Merch", cost: 450, claimed: false },
  ]},
  { tier: "Purple", items: [
    { name: "Courtside Seats Raffle Entry", cost: 600, claimed: false },
    { name: "Meet LaDainian Tomlinson Raffle", cost: 650, claimed: false },
    { name: "Away Game to Ireland Ticket Raffle", cost: 700, claimed: false },
    { name: "Football Sideline Pass Raffle", cost: 750, claimed: false },
  ]},
];

const LEADERBOARD_ORGS = [
  { rank: 1, name: "Phi Delta Theta", points: 4280, members: 42, avatar: "ΦΔΘ" },
  { rank: 2, name: "Sigma Chi", points: 3910, members: 38, avatar: "ΣΧ" },
  { rank: 3, name: "Kappa Sigma", points: 3750, members: 35, avatar: "ΚΣ" },
  { rank: 4, name: "Clark Hall", points: 3420, members: 61, avatar: "CH" },
  { rank: 5, name: "Pi Beta Phi", points: 3180, members: 33, avatar: "ΠΒΦ" },
  { rank: 6, name: "Moncrief Hall", points: 2940, members: 55, avatar: "MH" },
  { rank: 7, name: "Chi Omega", points: 2810, members: 40, avatar: "ΧΩ" },
  { rank: 8, name: "Delta Tau Delta", points: 2650, members: 31, avatar: "ΔΤΔ" },
];

const LEADERBOARD_STUDENTS = [
  { rank: 1, name: "Sarah K.", points: 680, tier: "Purple", games: 22 },
  { rank: 2, name: "Jake M.", points: 590, tier: "Gold", games: 19 },
  { rank: 3, name: "Matt N.", points: 430, tier: "Gold", games: 14, isYou: true },
  { rank: 4, name: "Emma R.", points: 410, tier: "Gold", games: 13 },
  { rank: 5, name: "Chris T.", points: 380, tier: "Gold", games: 12 },
  { rank: 6, name: "Lily P.", points: 320, tier: "Silver", games: 11 },
  { rank: 7, name: "Noah W.", points: 280, tier: "Silver", games: 9 },
  { rank: 8, name: "Ava C.", points: 245, tier: "Silver", games: 8 },
];

const SOCIAL_POSTS = [
  { handle: "@TCUVolleyball", name: "TCU Volleyball", sport: "🏐", time: "2h", text: "STUDENT SECTION we need you LOUD tonight vs K-State. 3× FrogPass points — don't miss it 💜🐸", likes: 184, comments: 23 },
  { handle: "@TCUBaseball", name: "TCU Baseball", sport: "⚾", time: "5h", text: "Midweek series opener at Lupton tomorrow. Sunset + baseball + double points. What more do you need?", likes: 127, comments: 14 },
  { handle: "@TCU_WSoccer", name: "TCU Women's Soccer", sport: "⚽", time: "8h", text: "SENIOR NIGHT FRIDAY 🎓 Come celebrate our seniors vs West Virginia. 3× points + free rally towels for first 200 students.", likes: 241, comments: 38 },
  { handle: "@TCUBasketball", name: "TCU Men's Basketball", sport: "🏀", time: "1d", text: "Saturday. Schollmaier. Texas Tech. Need we say more? 🤘👇 Pack the arena purple.", likes: 412, comments: 67 },
];

/* ─── SHARED COMPONENTS ─── */

function MultiplierBadge({ multiplier }) {
  if (multiplier <= 1) return null;
  const hi = multiplier >= 3;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 10, fontWeight: 700, fontFamily: font, letterSpacing: 0.5,
      color: hi ? "#1a1a1a" : C.gold,
      background: hi ? `linear-gradient(135deg, ${C.gold}, ${C.goldBright})` : C.goldFaint,
      padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap",
      border: hi ? "none" : `1px solid rgba(200,168,76,0.25)`,
    }}><span style={{ fontSize: 8 }}>▲</span> {multiplier}x</span>
  );
}

function ProgressBar({ current, from, to, fromColor, toColor }) {
  const pct = Math.min(((current - from) / (to - from)) * 100, 100);
  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 100, height: 5, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 100, background: `linear-gradient(90deg, ${fromColor}, ${toColor})`, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: C.textTer, fontWeight: 500, fontFamily: font }}>{from} pts</span>
        <span style={{ fontSize: 10, color: C.textTer, fontWeight: 500, fontFamily: font }}>{to} pts</span>
      </div>
    </div>
  );
}

function Seg({ options, active, onChange }) {
  return (
    <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 3, marginBottom: 20, border: `1px solid ${C.border}` }}>
      {options.map(o => (
        <div key={o.id} className="fp-btn" onClick={() => onChange(o.id)} style={{
          flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 8,
          fontSize: 13, fontWeight: 600, fontFamily: font,
          background: active === o.id ? C.purple : "transparent",
          color: active === o.id ? C.white : C.textTer,
          border: active === o.id ? "1px solid rgba(107,63,160,0.4)" : "1px solid transparent",
        }}>{o.label}</div>
      ))}
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: font, letterSpacing: -0.3 }}>{title}</h2>
      {action && <span className="fp-btn" onClick={onAction} style={{ fontSize: 12, color: C.textSec, fontWeight: 500, fontFamily: font }}>{action}</span>}
    </div>
  );
}

function Check({ color = C.green, size = 13 }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill={color} opacity=".15" /><path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Lock({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="2" stroke={C.textTer} strokeWidth="1.2" /><path d="M5 7V5a3 3 0 016 0v2" stroke={C.textTer} strokeWidth="1.2" strokeLinecap="round" /></svg>;
}

/* ─── SOCIAL FEED ─── */

function SocialFeed() {
  return (
    <div style={{ marginBottom: 24 }}>
      <SectionHeader title="From the Teams" />
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
        {SOCIAL_POSTS.map((p, i) => (
          <div key={i} style={{
            minWidth: 260, maxWidth: 280, background: C.card, borderRadius: 14,
            padding: 14, border: `1px solid ${C.border}`, flexShrink: 0,
            animation: `slideUp 0.3s ease ${i * 0.06}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: C.purpleMid,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, border: `1px solid ${C.border}`,
              }}>{p.sport}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>{p.handle} · {p.time}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: C.textSec, fontFamily: font, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {p.text}
            </div>
            <div style={{ display: "flex", gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4.5 10.5C2.5 9 1 7 1 5a3 3 0 015.5-1.7A3 3 0 0112 5c0 2-1.5 4-3.5 5.5L8 14z" stroke={C.textTer} strokeWidth="1.2" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 11, color: C.textTer, fontFamily: font }}>{p.likes}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M1 12V3a1 1 0 011-1h12a1 1 0 011 1v7a1 1 0 01-1 1H5l-4 3z" stroke={C.textTer} strokeWidth="1.2" strokeLinejoin="round" /></svg>
                <span style={{ fontSize: 11, color: C.textTer, fontFamily: font }}>{p.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HOME TAB ─── */

function HomeTab({ onNavigate }) {
  const tierData = TIERS.find(t => t.name === USER.tier);
  const nextTier = TIERS[TIERS.indexOf(tierData) + 1];
  const topGames = UPCOMING_GAMES.filter(g => g.multiplier >= 2).slice(0, 3);

  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: C.textSec, fontFamily: font, fontWeight: 500 }}>Welcome back</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5, marginTop: 2 }}>{USER.name}</div>
      </div>

      {/* Points card */}
      <div style={{
        background: `linear-gradient(145deg, ${C.purple} 0%, ${C.purpleDark} 100%)`,
        borderRadius: 16, padding: 20, marginBottom: 16,
        border: "1px solid rgba(107,63,160,0.3)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 600, fontFamily: font }}>Total Points</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1, fontFamily: font }}>{USER.points}</span>
            </div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "8px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 13, color: tierData.color, fontWeight: 700, fontFamily: font }}>{tierData.name}</div>
            {nextTier && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: font }}>{nextTier.threshold - USER.points} to {nextTier.name}</div>}
          </div>
        </div>
        {nextTier && <div style={{ marginTop: 20 }}><ProgressBar current={USER.points} from={tierData.threshold} to={nextTier.threshold} fromColor={tierData.color} toColor={nextTier.color} /></div>}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[{ value: USER.gamesAttended, label: "Games" }, { value: `#${USER.rank}`, label: "Rank" }, { value: "3", label: "Streak", sfx: " wk" }].map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: "14px 8px", border: `1px solid ${C.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.white, fontFamily: font }}>{s.value}{s.sfx && <span style={{ fontSize: 12, fontWeight: 500, color: C.textTer }}>{s.sfx}</span>}</div>
            <div style={{ fontSize: 10, color: C.textTer, marginTop: 4, fontFamily: font, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Boosted games */}
      <SectionHeader title="Boosted This Week" action="View all" onAction={() => onNavigate("games")} />
      {topGames.map((g, i) => (
        <div key={i} className="fp-card" style={{
          display: "flex", alignItems: "center", padding: "12px 14px",
          background: C.card, borderRadius: 12, marginBottom: 8,
          border: `1px solid ${C.border}`, animation: `slideUp 0.3s ease ${i * 0.05}s both`,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginRight: 12, flexShrink: 0, border: `1px solid ${C.border}` }}>{g.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: font }}>vs {g.opponent}</div>
            <div style={{ fontSize: 12, color: C.textTer, marginTop: 2, fontFamily: font }}>{g.sport} · {g.date}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <MultiplierBadge multiplier={g.multiplier} />
            <span style={{ fontSize: 14, fontWeight: 700, color: C.gold, fontFamily: font }}>+{g.points}</span>
          </div>
        </div>
      ))}

      {/* Social feed */}
      <div style={{ marginTop: 8 }} />
      <SocialFeed />
    </div>
  );
}

/* ─── GAMES TAB ─── */

function GamesTab() {
  const [tab, setTab] = useState("upcoming");
  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5, marginBottom: 16 }}>Games</h1>
      <Seg options={[{ id: "upcoming", label: "Upcoming" }, { id: "history", label: "History" }]} active={tab} onChange={setTab} />
      {tab === "upcoming" ? (
        UPCOMING_GAMES.map((g, i) => (
          <div key={i} className="fp-card" style={{
            background: C.card, borderRadius: 14, padding: 16, marginBottom: 10,
            border: `1px solid ${C.border}`, animation: `slideUp 0.3s ease ${i * 0.04}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginRight: 14, flexShrink: 0, border: `1px solid ${C.border}` }}>{g.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: font }}>{g.sport} vs {g.opponent}</div>
                <div style={{ fontSize: 12, color: C.textSec, marginTop: 3, fontFamily: font }}>{g.date} · {g.time}</div>
                <div style={{ fontSize: 11, color: C.textTer, marginTop: 2, fontFamily: font }}>{g.venue}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <MultiplierBadge multiplier={g.multiplier} />
                <div style={{ fontSize: 22, fontWeight: 700, color: g.multiplier > 1 ? C.gold : C.textSec, marginTop: 6, fontFamily: font }}>+{g.points}</div>
                <div style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>pts</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {PAST_GAMES.map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "13px 16px", borderBottom: i < PAST_GAMES.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 18, marginRight: 12, width: 28, textAlign: "center" }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: font }}>vs {g.opponent}</div>
                  <div style={{ fontSize: 11, color: C.textTer, marginTop: 2, fontFamily: font }}>{g.sport} · {g.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Check color={C.green} size={12} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.green, fontFamily: font }}>+{g.points}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", padding: 20, fontSize: 12, color: C.textTer, fontFamily: font }}>Showing last 6 attended events</div>
        </>
      )}
    </div>
  );
}

/* ─── REWARDS TAB ─── */

function RewardsTab() {
  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5, marginBottom: 2 }}>Rewards</h1>
      <p style={{ fontSize: 13, color: C.textSec, marginBottom: 20, fontFamily: font }}>{USER.points} points · {USER.tier} tier</p>
      {REWARDS.map((tg, ti) => {
        const td = TIERS.find(t => t.name === tg.tier);
        const unlocked = USER.points >= td.threshold;
        const current = USER.tier === tg.tier;
        return (
          <div key={ti} style={{
            marginBottom: 12, borderRadius: 14, overflow: "hidden", background: C.card,
            border: `1px solid ${current ? td.border : C.border}`,
            opacity: unlocked ? 1 : 0.4, animation: `slideUp 0.3s ease ${ti * 0.06}s both`,
          }}>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, background: current ? td.bg : "transparent" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: td.bg, border: `1px solid ${td.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: td.color, fontFamily: font }}>{tg.tier.charAt(0)}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: font }}>{tg.tier}</span>
                    {current && <span style={{ fontSize: 9, fontWeight: 700, color: td.color, background: td.bg, padding: "2px 7px", borderRadius: 4, letterSpacing: 0.8, fontFamily: font, textTransform: "uppercase", border: `1px solid ${td.border}` }}>Current</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.textTer, marginTop: 1, fontFamily: font }}>{td.threshold > 0 ? `${td.threshold} pts to unlock` : "Starter tier"}</div>
                </div>
              </div>
              {!unlocked && <Lock />}
            </div>
            {tg.items.map((r, ri) => (
              <div key={ri} style={{ display: "flex", alignItems: "center", padding: "11px 16px", borderBottom: ri < tg.items.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: unlocked ? C.text : C.textTer, fontFamily: font }}>{r.name}</div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 12 }}>
                  {r.claimed ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Check color={td.color} size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: td.color, fontFamily: font }}>Claimed</span>
                    </div>
                  ) : unlocked && USER.points >= r.cost ? (
                    <div className="fp-btn" style={{ fontSize: 11, fontWeight: 600, color: "#fff", fontFamily: font, background: td.color, padding: "6px 14px", borderRadius: 8 }}>Redeem</div>
                  ) : (
                    <span style={{ fontSize: 12, color: C.textTer, fontFamily: font, fontWeight: 500 }}>{r.cost} pts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ─── LEADERBOARD TAB ─── */

function LeaderboardTab() {
  const [tab, setTab] = useState("orgs");
  const rc = (i) => i === 0 ? C.gold : i === 1 ? "#9CA0A6" : i === 2 ? "#CD7F32" : C.textTer;
  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5, marginBottom: 16 }}>Leaderboard</h1>
      <Seg options={[{ id: "orgs", label: "Organizations" }, { id: "students", label: "Students" }]} active={tab} onChange={setTab} />
      {tab === "orgs" ? (
        <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {LEADERBOARD_ORGS.map((o, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: i < LEADERBOARD_ORGS.length - 1 ? `1px solid ${C.border}` : "none", background: i === 0 ? C.goldFaint : "transparent" }}>
              <div style={{ width: 24, fontSize: 12, fontWeight: 700, fontFamily: font, marginRight: 12, textAlign: "center", color: rc(i) }}>{i + 1}</div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.purpleMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontFamily: font, marginRight: 12, flexShrink: 0, border: `1px solid ${C.border}` }}>{o.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: font, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.name}</div>
                <div style={{ fontSize: 11, color: C.textTer, marginTop: 1, fontFamily: font }}>{o.members} members</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? C.gold : C.white, fontFamily: font }}>{o.points.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>pts</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {LEADERBOARD_STUDENTS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: i < LEADERBOARD_STUDENTS.length - 1 ? `1px solid ${C.border}` : "none", background: s.isYou ? C.purpleFaint : "transparent" }}>
              <div style={{ width: 24, fontSize: 12, fontWeight: 700, fontFamily: font, marginRight: 12, textAlign: "center", color: rc(i) }}>{i + 1}</div>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(145deg, ${C.purple}, ${C.purpleLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.white, fontFamily: font, marginRight: 12, flexShrink: 0 }}>{s.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: font }}>{s.name} {s.isYou && <span style={{ fontSize: 10, fontWeight: 700, color: C.gold }}>YOU</span>}</div>
                <div style={{ fontSize: 11, color: C.textTer, marginTop: 1, fontFamily: font }}>{s.games} games · {s.tier}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.isYou ? C.gold : C.white, fontFamily: font }}>{s.points}</div>
                <div style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>pts</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── STAFF MODE ─── */

function StaffMode({ onExit }) {
  const [selectedGame, setSelectedGame] = useState(0);
  const [boostLevel, setBoostLevel] = useState(35);
  const [pushSent, setPushSent] = useState(false);
  const [socialBoosted, setSocialBoosted] = useState(false);
  const g = UPCOMING_GAMES[selectedGame];
  const boostedProjected = Math.round(g.projected * (1 + boostLevel / 100));
  const fillPct = Math.min((boostedProjected / g.capacity) * 100, 100);

  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.25s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: C.purpleLight, fontFamily: font, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Staff Dashboard</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5 }}>Attendance Manager</h1>
        </div>
        <div className="fp-btn" onClick={onExit} style={{ fontSize: 11, fontWeight: 600, color: C.textSec, fontFamily: font, background: C.surface, padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}` }}>Exit</div>
      </div>

      {/* Game selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.textTer, fontFamily: font, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Select Event</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
          {UPCOMING_GAMES.map((game, i) => (
            <div key={i} className="fp-btn" onClick={() => { setSelectedGame(i); setPushSent(false); setSocialBoosted(false); }} style={{
              minWidth: 120, padding: "10px 14px", borderRadius: 10, flexShrink: 0,
              background: i === selectedGame ? C.purpleFaint : C.card,
              border: `1px solid ${i === selectedGame ? "rgba(107,63,160,0.4)" : C.border}`,
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{game.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: font }}>vs {game.opponent}</div>
              <div style={{ fontSize: 10, color: C.textTer, fontFamily: font, marginTop: 2 }}>{game.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected game detail */}
      <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: `1px solid ${C.border}` }}>{g.icon}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: font }}>{g.sport} vs {g.opponent}</div>
            <div style={{ fontSize: 12, color: C.textSec, fontFamily: font, marginTop: 2 }}>{g.date} · {g.time} · {g.venue}</div>
          </div>
        </div>

        {/* Capacity bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: C.textTer, fontFamily: font, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>Projected Attendance</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: fillPct > 75 ? C.green : fillPct > 40 ? C.gold : C.red, fontFamily: font }}>
              {boostedProjected.toLocaleString()} / {g.capacity.toLocaleString()}
            </span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 100, height: 8, overflow: "hidden" }}>
            <div style={{
              width: `${fillPct}%`, height: "100%", borderRadius: 100,
              background: fillPct > 75 ? `linear-gradient(90deg, ${C.green}, #4ade80)` : fillPct > 40 ? `linear-gradient(90deg, ${C.gold}, ${C.goldBright})` : `linear-gradient(90deg, ${C.red}, #f87171)`,
              transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>Baseline: {g.projected.toLocaleString()}</span>
            <span style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>{Math.round(fillPct)}% capacity</span>
          </div>
        </div>

        {/* Boost dial */}
        <div style={{ background: C.surface, borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: C.textTer, fontFamily: font, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>Promotion Boost</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: boostLevel > 50 ? C.green : C.gold, fontFamily: font, letterSpacing: -1 }}>+{boostLevel}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={boostLevel}
            onChange={(e) => { setBoostLevel(Number(e.target.value)); setPushSent(false); }}
            style={{ width: "100%", marginBottom: 12 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>No boost</span>
            <span style={{ fontSize: 10, color: C.textTer, fontFamily: font }}>Maximum</span>
          </div>
        </div>
      </div>

      {/* Impact metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.textTer, fontFamily: font, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Point Multiplier</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.gold, fontFamily: font }}>{g.multiplier}×</div>
          <div style={{ fontSize: 11, color: C.textTer, fontFamily: font, marginTop: 2 }}>{g.points} pts per check-in</div>
        </div>
        <div style={{ background: C.card, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.textTer, fontFamily: font, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Est. Increase</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.green, fontFamily: font }}>+{(boostedProjected - g.projected).toLocaleString()}</div>
          <div style={{ fontSize: 11, color: C.textTer, fontFamily: font, marginTop: 2 }}>additional students</div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="fp-btn" onClick={() => setPushSent(true)} style={{
          background: pushSent ? C.greenFaint : `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
          borderRadius: 12, padding: "16px 20px", textAlign: "center",
          border: pushSent ? `1px solid rgba(34,197,94,0.2)` : "1px solid rgba(107,63,160,0.3)",
        }}>
          {pushSent ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Check color={C.green} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.green, fontFamily: font }}>Push sent to 4,230 students</span>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: font }}>Send Push Notification</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: font, marginTop: 2 }}>Notify all students about this event</div>
            </div>
          )}
        </div>
        <div className="fp-btn" onClick={() => setSocialBoosted(true)} style={{
          background: socialBoosted ? C.greenFaint : C.card,
          borderRadius: 12, padding: "16px 20px", textAlign: "center",
          border: socialBoosted ? `1px solid rgba(34,197,94,0.2)` : `1px solid ${C.border}`,
        }}>
          {socialBoosted ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Check color={C.green} />
              <span style={{ fontSize: 14, fontWeight: 600, color: C.green, fontFamily: font }}>Social reach boosted</span>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: font }}>Boost Social Reach</div>
              <div style={{ fontSize: 11, color: C.textTer, fontFamily: font, marginTop: 2 }}>Prioritize this event in team feeds</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent activity log */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, color: C.textTer, fontFamily: font, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Recent Activity</div>
        <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {[
            { action: "Multiplier set to 3×", game: "Volleyball vs K-State", time: "12m ago", color: C.gold },
            { action: "Push notification sent", game: "Baseball vs Oklahoma State", time: "1h ago", color: C.purpleLight },
            { action: "Social boost activated", game: "Women's Soccer vs WVU", time: "3h ago", color: C.green },
            { action: "Multiplier set to 2×", game: "Baseball vs Oklahoma State", time: "5h ago", color: C.gold },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "11px 14px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, marginRight: 12, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text, fontFamily: font }}>{a.action}</div>
                <div style={{ fontSize: 10, color: C.textTer, fontFamily: font, marginTop: 1 }}>{a.game}</div>
              </div>
              <span style={{ fontSize: 10, color: C.textTer, fontFamily: font, flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── NAV ICONS ─── */

const HomeIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GamesIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const RewardsIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const BoardIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>;

/* ─── APP SHELL ─── */

export default function FrogPassDemo() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(false);
  const [staffMode, setStaffMode] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const tabs = [
    { id: "home", label: "Home", Icon: HomeIcon },
    { id: "games", label: "Games", Icon: GamesIcon },
    { id: "rewards", label: "Rewards", Icon: RewardsIcon },
    { id: "board", label: "Board", Icon: BoardIcon },
  ];

  const appContent = (
    <div style={{ width: "100%", height: "100%", background: C.bg, display: "flex", flexDirection: "column", fontFamily: font, position: "relative", overflow: "hidden" }}>
      <Styles />

      {/* Header */}
      <div style={{
        padding: isMobile ? "52px 16px 10px" : "12px 16px 10px",
        background: staffMode
          ? `linear-gradient(180deg, #1a1a2e 0%, ${C.bg} 100%)`
          : `linear-gradient(180deg, ${C.purple} 0%, ${C.purpleDark} 100%)`,
        borderBottom: `1px solid ${staffMode ? C.border : "rgba(107,63,160,0.3)"}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🐸</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.white, fontFamily: font, letterSpacing: -0.5 }}>FrogPass</span>
            {staffMode && <span style={{ fontSize: 9, fontWeight: 700, color: C.gold, background: C.goldFaint, padding: "2px 8px", borderRadius: 4, letterSpacing: 0.8, border: `1px solid rgba(200,168,76,0.2)` }}>STAFF</span>}
          </div>
          <div className="fp-btn" onClick={() => setStaffMode(!staffMode)} style={{
            fontSize: 10, fontWeight: 600, fontFamily: font, padding: "5px 12px", borderRadius: 8,
            color: staffMode ? C.gold : "rgba(255,255,255,0.65)",
            background: staffMode ? C.goldFaint : "rgba(0,0,0,0.25)",
            border: staffMode ? `1px solid rgba(200,168,76,0.2)` : "1px solid rgba(255,255,255,0.08)",
          }}>
            {staffMode ? "Student View" : "Staff Mode"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 16, paddingBottom: isMobile ? 90 : 80, WebkitOverflowScrolling: "touch" }}>
        {staffMode ? (
          <StaffMode onExit={() => setStaffMode(false)} />
        ) : (
          <>
            {activeTab === "home" && <HomeTab onNavigate={setActiveTab} />}
            {activeTab === "games" && <GamesTab />}
            {activeTab === "rewards" && <RewardsTab />}
            {activeTab === "board" && <LeaderboardTab />}
          </>
        )}
      </div>

      {/* Tab bar */}
      {!staffMode && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: `linear-gradient(180deg, transparent 0%, ${C.bg} 20%)`, paddingTop: 12 }}>
          <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", padding: isMobile ? "6px 4px 28px" : "6px 4px 12px" }}>
            {tabs.map(t => {
              const active = activeTab === t.id;
              return (
                <div key={t.id} className="fp-btn" onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 0" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: active ? C.purpleFaint : "transparent", transition: "background 0.2s ease" }}>
                    <t.Icon c={active ? C.purpleLight : "rgba(255,255,255,0.25)"} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, fontFamily: font, color: active ? C.purpleLight : "rgba(255,255,255,0.25)", letterSpacing: 0.2 }}>{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return <div style={{ width: "100vw", height: "100dvh", background: C.bg, overflow: "hidden" }}>{appContent}</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#000", padding: 24 }}>
      <div style={{
        width: 390, height: 844, background: C.bg, borderRadius: 50, border: "4px solid #1C1C24",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.9), 0 0 80px rgba(77,25,121,0.15)",
        position: "relative",
      }}>
        <div style={{ width: 120, height: 34, background: "#000", borderRadius: 20, position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 20 }} />
        <div style={{ height: 54, flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 28px 6px", zIndex: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: font }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x="0" y="8" width="3" height="4" rx=".5" fill="rgba(255,255,255,.5)"/><rect x="4.5" y="5" width="3" height="7" rx=".5" fill="rgba(255,255,255,.5)"/><rect x="9" y="2" width="3" height="10" rx=".5" fill="rgba(255,255,255,.5)"/><rect x="13" y="0" width="3" height="12" rx=".5" fill="rgba(255,255,255,.5)"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 10.5a1 1 0 100-2 1 1 0 000 2z" fill="rgba(255,255,255,.5)"/><path d="M4.93 7.17a4.5 4.5 0 016.14 0" stroke="rgba(255,255,255,.5)" strokeWidth="1.2" strokeLinecap="round"/><path d="M2.1 4.34a8 8 0 0111.8 0" stroke="rgba(255,255,255,.5)" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <div style={{ width: 22, height: 11, border: "1.2px solid rgba(255,255,255,.35)", borderRadius: 3, padding: 1.5 }}><div style={{ width: "70%", height: "100%", background: "rgba(255,255,255,.5)", borderRadius: 1 }} /></div>
              <div style={{ width: 1.5, height: 4, background: "rgba(255,255,255,.25)", borderRadius: "0 1px 1px 0" }} />
            </div>
          </div>
        </div>
        {appContent}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 100, background: "rgba(255,255,255,.15)", zIndex: 30 }} />
      </div>
    </div>
  );
}
