"use client";
import { useState, useEffect } from "react";

const font = "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

const C = {
  bg:         "#09090F",
  surface:    "#111118",
  card:       "#16161F",
  cardHover:  "#1A1A24",
  purple:     "#4D1979",
  purpleLight:"#6B3FA0",
  purpleMid:  "#3A1260",
  purpleDark: "#240B3D",
  purpleFaint:"rgba(107,63,160,0.12)",
  gold:       "#C8A84C",
  goldBright: "#E2C56B",
  goldFaint:  "rgba(200,168,76,0.10)",
  white:      "#FFFFFF",
  text:       "rgba(255,255,255,0.92)",
  textSec:    "rgba(255,255,255,0.55)",
  textTer:    "rgba(255,255,255,0.30)",
  border:     "rgba(255,255,255,0.07)",
  green:      "#22C55E",
};

function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 0; height: 0; }
      body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .fp-card { transition: background 0.15s ease; }
      .fp-card:active { background: ${C.cardHover} !important; }
      .fp-btn { transition: all 0.15s ease; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; }
      .fp-btn:active { transform: scale(0.97); opacity: 0.85; }
    `}</style>
  );
}

const TIERS = [
  { name: "Bronze",  threshold: 0,   color: "#CD7F32", bg: "rgba(205,127,50,0.10)",  border: "rgba(205,127,50,0.20)" },
  { name: "Silver",  threshold: 150, color: "#9CA0A6", bg: "rgba(156,160,166,0.10)", border: "rgba(156,160,166,0.20)" },
  { name: "Gold",    threshold: 350, color: "#C8A84C", bg: "rgba(200,168,76,0.10)",  border: "rgba(200,168,76,0.20)" },
  { name: "Purple",  threshold: 600, color: "#8B5CF6", bg: "rgba(139,92,246,0.10)",  border: "rgba(139,92,246,0.20)" },
];

const USER = { name: "Matt N.", points: 430, tier: "Gold", gamesAttended: 14, rank: 3, org: "Phi Delta Theta" };

const UPCOMING_GAMES = [
  { sport: "Volleyball", opponent: "Kansas State", date: "Tue, Apr 15", time: "7:00 PM", venue: "University Rec Center", multiplier: 3, points: 30, icon: "🏐", predicted: "Low turnout — 3× boost active" },
  { sport: "Baseball", opponent: "Oklahoma State", date: "Wed, Apr 16", time: "6:30 PM", venue: "Lupton Stadium", multiplier: 2, points: 20, icon: "⚾", predicted: "Moderate demand — 2× boost active" },
  { sport: "Women's Soccer", opponent: "West Virginia", date: "Fri, Apr 18", time: "7:00 PM", venue: "Garvey-Rosenthal Stadium", multiplier: 3, points: 30, icon: "⚽", predicted: "Low turnout — 3× boost active" },
  { sport: "Men's Basketball", opponent: "Texas Tech", date: "Sat, Apr 19", time: "2:00 PM", venue: "Schollmaier Arena", multiplier: 1, points: 10, icon: "🏀", predicted: "High demand" },
  { sport: "Baseball", opponent: "Baylor", date: "Sat, Apr 19", time: "6:00 PM", venue: "Lupton Stadium", multiplier: 1, points: 10, icon: "⚾", predicted: "High demand" },
  { sport: "Volleyball", opponent: "UCF", date: "Tue, Apr 22", time: "7:00 PM", venue: "University Rec Center", multiplier: 3, points: 30, icon: "🏐", predicted: "Low turnout — 3× boost active" },
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
    { name: "Sticker Set", cost: 100, claimed: true },
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
    { name: "Football Sideline Pass Raffle", cost: 700, claimed: false },
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

function MultiplierBadge({ multiplier }) {
  if (multiplier <= 1) return null;
  const isHigh = multiplier >= 3;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 10, fontWeight: 700, fontFamily: font, letterSpacing: 0.5,
      color: isHigh ? "#1a1a1a" : C.gold,
      background: isHigh ? `linear-gradient(135deg, ${C.gold}, ${C.goldBright})` : C.goldFaint,
      padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap",
      border: isHigh ? "none" : `1px solid rgba(200,168,76,0.25)`,
    }}>
      <span style={{ fontSize: 8 }}>▲</span> {multiplier}x
    </span>
  );
}

function ProgressBar({ current, from, to, fromColor, toColor }) {
  const pct = Math.min(((current - from) / (to - from)) * 100, 100);
  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 100, height: 5, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 100,
          background: `linear-gradient(90deg, ${fromColor}, ${toColor})`,
          transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: C.textTer, fontWeight: 500, fontFamily: font }}>{from} pts</span>
        <span style={{ fontSize: 10, color: C.textTer, fontWeight: 500, fontFamily: font }}>{to} pts</span>
      </div>
    </div>
  );
}

function SegmentedControl({ options, active, onChange }) {
  return (
    <div style={{
      display: "flex", background: C.surface, borderRadius: 10, padding: 3, marginBottom: 20,
      border: `1px solid ${C.border}`,
    }}>
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
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: font, letterSpacing: -0.3 }}>{title}</h2>
      {action && (
        <span className="fp-btn" onClick={onAction} style={{
          fontSize: 12, color: C.textSec, fontWeight: 500, fontFamily: font,
        }}>{action}</span>
      )}
    </div>
  );
}

function CheckIcon({ color = C.green, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill={color} opacity="0.15" />
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="2" stroke={C.textTer} strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke={C.textTer} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

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

      <div style={{
        background: `linear-gradient(145deg, ${C.purple} 0%, ${C.purpleDark} 100%)`,
        borderRadius: 16, padding: 20, marginBottom: 16,
        border: "1px solid rgba(107,63,160,0.3)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 600, fontFamily: font }}>Total Points</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1, fontFamily: font }}>{USER.points}</span>
            </div>
          </div>
          <div style={{
            background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "8px 14px",
            border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
          }}>
            <div style={{ fontSize: 13, color: tierData.color, fontWeight: 700, fontFamily: font }}>{tierData.name}</div>
            {nextTier && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: font }}>{nextTier.threshold - USER.points} to {nextTier.name}</div>}
          </div>
        </div>
        {nextTier && (
          <div style={{ marginTop: 20, position: "relative" }}>
            <ProgressBar current={USER.points} from={tierData.threshold} to={nextTier.threshold} fromColor={tierData.color} toColor={nextTier.color} />
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { value: USER.gamesAttended, label: "Games" },
          { value: `#${USER.rank}`, label: "Rank" },
          { value: "3", label: "Streak", suffix: " wk" },
        ].map((s, i) => (
          <div key={i} style={{
            background: C.card, borderRadius: 12, padding: "14px 8px",
            border: `1px solid ${C.border}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5 }}>
              {s.value}{s.suffix && <span style={{ fontSize: 12, fontWeight: 500, color: C.textTer }}>{s.suffix}</span>}
            </div>
            <div style={{ fontSize: 10, color: C.textTer, marginTop: 4, fontFamily: font, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <SectionHeader title="Boosted This Week" action="View all" onAction={() => onNavigate("games")} />
      {topGames.map((g, i) => (
        <div key={i} className="fp-card" style={{
          display: "flex", alignItems: "center", padding: "12px 14px",
          background: C.card, borderRadius: 12, marginBottom: 8,
          border: `1px solid ${C.border}`,
          animation: `slideUp 0.3s ease ${i * 0.05}s both`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: C.surface,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, marginRight: 12, flexShrink: 0, border: `1px solid ${C.border}`,
          }}>{g.icon}</div>
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
    </div>
  );
}

function GamesTab() {
  const [tab, setTab] = useState("upcoming");
  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5, marginBottom: 16 }}>Games</h1>
      <SegmentedControl options={[{ id: "upcoming", label: "Upcoming" }, { id: "history", label: "History" }]} active={tab} onChange={setTab} />

      {tab === "upcoming" ? (
        UPCOMING_GAMES.map((g, i) => (
          <div key={i} className="fp-card" style={{
            background: C.card, borderRadius: 14, padding: 16, marginBottom: 10,
            border: `1px solid ${C.border}`,
            animation: `slideUp 0.3s ease ${i * 0.04}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: C.surface,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginRight: 14, flexShrink: 0, border: `1px solid ${C.border}`,
              }}>{g.icon}</div>
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
            {g.multiplier >= 2 && (
              <div style={{
                marginTop: 12, padding: "10px 12px", borderRadius: 8,
                background: C.goldFaint, border: `1px solid rgba(200,168,76,0.12)`,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v14M1 8h14" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  <circle cx="8" cy="8" r="3" fill={C.gold} opacity="0.2" />
                </svg>
                <span style={{ fontSize: 11, color: C.gold, fontFamily: font, fontWeight: 500, opacity: 0.85 }}>
                  AI Prediction: {g.predicted}
                </span>
              </div>
            )}
          </div>
        ))
      ) : (
        <>
          <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {PAST_GAMES.map((g, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", padding: "13px 16px",
                borderBottom: i < PAST_GAMES.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ fontSize: 18, marginRight: 12, width: 28, textAlign: "center" }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: font }}>vs {g.opponent}</div>
                  <div style={{ fontSize: 11, color: C.textTer, marginTop: 2, fontFamily: font }}>{g.sport} · {g.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckIcon color={C.green} size={12} />
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

function RewardsTab() {
  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5, marginBottom: 2 }}>Rewards</h1>
      <p style={{ fontSize: 13, color: C.textSec, marginBottom: 20, fontFamily: font }}>{USER.points} points · {USER.tier} tier</p>

      {REWARDS.map((tierGroup, ti) => {
        const tierData = TIERS.find(t => t.name === tierGroup.tier);
        const isUnlocked = USER.points >= tierData.threshold;
        const isCurrent = USER.tier === tierGroup.tier;
        return (
          <div key={ti} style={{
            marginBottom: 12, borderRadius: 14, overflow: "hidden", background: C.card,
            border: `1px solid ${isCurrent ? tierData.border : C.border}`,
            opacity: isUnlocked ? 1 : 0.4,
            animation: `slideUp 0.3s ease ${ti * 0.06}s both`,
          }}>
            <div style={{
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: `1px solid ${C.border}`,
              background: isCurrent ? tierData.bg : "transparent",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: tierData.bg, border: `1px solid ${tierData.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: tierData.color, fontFamily: font,
                }}>{tierGroup.tier.charAt(0)}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: font }}>{tierGroup.tier}</span>
                    {isCurrent && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: tierData.color,
                        background: tierData.bg, padding: "2px 7px", borderRadius: 4,
                        letterSpacing: 0.8, fontFamily: font, textTransform: "uppercase",
                        border: `1px solid ${tierData.border}`,
                      }}>Current</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: C.textTer, marginTop: 1, fontFamily: font }}>{tierData.threshold > 0 ? `${tierData.threshold} pts to unlock` : "Starter tier"}</div>
                </div>
              </div>
              {!isUnlocked && <LockIcon />}
            </div>

            {tierGroup.items.map((r, ri) => (
              <div key={ri} style={{
                display: "flex", alignItems: "center", padding: "11px 16px",
                borderBottom: ri < tierGroup.items.length - 1 ? `1px solid rgba(255,255,255,0.03)` : "none",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isUnlocked ? C.text : C.textTer, fontFamily: font }}>{r.name}</div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 12 }}>
                  {r.claimed ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <CheckIcon color={tierData.color} size={13} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: tierData.color, fontFamily: font }}>Claimed</span>
                    </div>
                  ) : isUnlocked && USER.points >= r.cost ? (
                    <div className="fp-btn" style={{
                      fontSize: 11, fontWeight: 600, color: "#fff", fontFamily: font,
                      background: tierData.color, padding: "6px 14px", borderRadius: 8,
                    }}>Redeem</div>
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

function LeaderboardTab() {
  const [tab, setTab] = useState("orgs");
  const rankColor = (i) => i === 0 ? C.gold : i === 1 ? "#9CA0A6" : i === 2 ? "#CD7F32" : C.textTer;
  return (
    <div style={{ padding: "0 16px 24px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: font, letterSpacing: -0.5, marginBottom: 16 }}>Leaderboard</h1>
      <SegmentedControl options={[{ id: "orgs", label: "Organizations" }, { id: "students", label: "Students" }]} active={tab} onChange={setTab} />

      {tab === "orgs" ? (
        <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {LEADERBOARD_ORGS.map((o, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", padding: "12px 16px",
              borderBottom: i < LEADERBOARD_ORGS.length - 1 ? `1px solid ${C.border}` : "none",
              background: i === 0 ? C.goldFaint : "transparent",
            }}>
              <div style={{ width: 24, fontSize: 12, fontWeight: 700, fontFamily: font, marginRight: 12, textAlign: "center", color: rankColor(i) }}>{i + 1}</div>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: C.purpleMid,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontFamily: font,
                marginRight: 12, flexShrink: 0, border: `1px solid ${C.border}`, letterSpacing: -0.5,
              }}>{o.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: C.text, fontFamily: font,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{o.name}</div>
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
            <div key={i} style={{
              display: "flex", alignItems: "center", padding: "12px 16px",
              borderBottom: i < LEADERBOARD_STUDENTS.length - 1 ? `1px solid ${C.border}` : "none",
              background: s.isYou ? C.purpleFaint : "transparent",
            }}>
              <div style={{ width: 24, fontSize: 12, fontWeight: 700, fontFamily: font, marginRight: 12, textAlign: "center", color: rankColor(i) }}>{i + 1}</div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `linear-gradient(145deg, ${C.purple}, ${C.purpleLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: C.white, fontFamily: font,
                marginRight: 12, flexShrink: 0,
              }}>{s.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: font }}>
                  {s.name} {s.isYou && <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, fontFamily: font }}>YOU</span>}
                </div>
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

const HomeIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GamesIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const RewardsIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const BoardIcon = ({c}) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>;

export default function FrogPassDemo() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

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
    <div style={{
      width: "100%", height: "100%", background: C.bg,
      display: "flex", flexDirection: "column",
      fontFamily: font, position: "relative", overflow: "hidden",
    }}>
      <GlobalStyles />

      <div style={{
        padding: isMobile ? "52px 20px 12px" : "12px 20px 12px",
        background: `linear-gradient(180deg, ${C.purple} 0%, ${C.purpleDark} 100%)`,
        borderBottom: `1px solid rgba(107,63,160,0.3)`, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🐸</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.white, fontFamily: font, letterSpacing: -0.5 }}>FrogPass</span>
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600, fontFamily: font,
            background: "rgba(0,0,0,0.25)", padding: "5px 12px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
          }}>
            <span style={{ color: C.gold, fontWeight: 700 }}>{USER.points}</span> pts
          </div>
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: "auto", paddingTop: 16,
        paddingBottom: isMobile ? 90 : 80, WebkitOverflowScrolling: "touch",
      }}>
        {activeTab === "home" && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === "games" && <GamesTab />}
        {activeTab === "rewards" && <RewardsTab />}
        {activeTab === "board" && <LeaderboardTab />}
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: `linear-gradient(180deg, transparent 0%, ${C.bg} 20%)`,
        paddingTop: 12,
      }}>
        <div style={{
          background: C.surface, borderTop: `1px solid ${C.border}`,
          display: "flex", padding: isMobile ? "6px 4px 28px" : "6px 4px 12px",
        }}>
          {tabs.map(t => {
            const active = activeTab === t.id;
            return (
              <div key={t.id} className="fp-btn" onClick={() => setActiveTab(t.id)} style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 2, padding: "6px 0",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active ? C.purpleFaint : "transparent",
                  transition: "background 0.2s ease",
                }}>
                  <t.Icon c={active ? C.purpleLight : "rgba(255,255,255,0.25)"} />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: active ? 600 : 500, fontFamily: font,
                  color: active ? C.purpleLight : "rgba(255,255,255,0.25)", letterSpacing: 0.2,
                }}>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ width: "100vw", height: "100dvh", background: C.bg, overflow: "hidden" }}>
        {appContent}
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "#000", padding: 24,
    }}>
      <div style={{
        width: 390, height: 844, background: C.bg,
        borderRadius: 50, border: "4px solid #1C1C24",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.9), 0 0 80px rgba(77,25,121,0.15)",
        position: "relative",
      }}>
        <div style={{
          width: 120, height: 34, background: "#000", borderRadius: 20,
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 20,
        }} />

        <div style={{
          height: 54, flexShrink: 0, display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", padding: "0 28px 6px", zIndex: 10,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: font }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="8" width="3" height="4" rx="0.5" fill="rgba(255,255,255,0.5)" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="rgba(255,255,255,0.5)" />
              <rect x="9" y="2" width="3" height="10" rx="0.5" fill="rgba(255,255,255,0.5)" />
              <rect x="13" y="0" width="3" height="12" rx="0.5" fill="rgba(255,255,255,0.5)" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 10.5a1 1 0 100-2 1 1 0 000 2z" fill="rgba(255,255,255,0.5)" />
              <path d="M4.93 7.17a4.5 4.5 0 016.14 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M2.1 4.34a8 8 0 0111.8 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <div style={{ width: 22, height: 11, border: "1.2px solid rgba(255,255,255,0.35)", borderRadius: 3, padding: 1.5, position: "relative" }}>
                <div style={{ width: "70%", height: "100%", background: "rgba(255,255,255,0.5)", borderRadius: 1 }} />
              </div>
              <div style={{ width: 1.5, height: 4, background: "rgba(255,255,255,0.25)", borderRadius: "0 1px 1px 0" }} />
            </div>
          </div>
        </div>

        {appContent}

        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          width: 134, height: 5, borderRadius: 100, background: "rgba(255,255,255,0.15)", zIndex: 30,
        }} />
      </div>
    </div>
  );
}
