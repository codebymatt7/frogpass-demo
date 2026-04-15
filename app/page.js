"use client";
import { useState, useEffect } from "react";

const C = {
  bg: "#0A0A12",
  card: "#13131F",
  purple: "#4D1979",
  purpleLight: "#6B3FA0",
  purpleDark: "#2D0E4A",
  gold: "#C9A84C",
  goldLight: "#E8D5A0",
  white: "#FFFFFF",
  text: "rgba(255,255,255,0.88)",
  textMuted: "rgba(255,255,255,0.45)",
  textDim: "rgba(255,255,255,0.2)",
  border: "rgba(255,255,255,0.06)",
  green: "#34D399",
};

const TIERS = [
  { name: "Bronze", threshold: 0, color: "#CD7F32", icon: "🥉" },
  { name: "Silver", threshold: 150, color: "#9CA0A6", icon: "🥈" },
  { name: "Gold", threshold: 350, color: "#C9A84C", icon: "🥇" },
  { name: "Purple", threshold: 600, color: "#8B5CF6", icon: "💜" },
];

const USER = { name: "Matt N.", points: 430, tier: "Gold", gamesAttended: 14, rank: 3, org: "Phi Delta Theta" };

const UPCOMING_GAMES = [
  { sport: "Volleyball", opponent: "Kansas State", date: "Tue, Apr 15", time: "7:00 PM", venue: "University Rec Center", multiplier: 3, points: 30, icon: "🏐", predicted: "Low turnout" },
  { sport: "Baseball", opponent: "Oklahoma State", date: "Wed, Apr 16", time: "6:30 PM", venue: "Lupton Stadium", multiplier: 2, points: 20, icon: "⚾", predicted: "Moderate" },
  { sport: "Women's Soccer", opponent: "West Virginia", date: "Fri, Apr 18", time: "7:00 PM", venue: "Garvey-Rosenthal Stadium", multiplier: 3, points: 30, icon: "⚽", predicted: "Low turnout" },
  { sport: "Men's Basketball", opponent: "Texas Tech", date: "Sat, Apr 19", time: "2:00 PM", venue: "Schollmaier Arena", multiplier: 1, points: 10, icon: "🏀", predicted: "High demand" },
  { sport: "Baseball", opponent: "Baylor", date: "Sat, Apr 19", time: "6:00 PM", venue: "Lupton Stadium", multiplier: 1, points: 10, icon: "⚾", predicted: "High demand" },
  { sport: "Volleyball", opponent: "UCF", date: "Tue, Apr 22", time: "7:00 PM", venue: "University Rec Center", multiplier: 3, points: 30, icon: "🏐", predicted: "Low turnout" },
];

const PAST_GAMES = [
  { sport: "Football", opponent: "Texas Tech", points: 10, date: "Nov 2" },
  { sport: "Volleyball", opponent: "BYU", points: 30, date: "Nov 5" },
  { sport: "Women's Soccer", opponent: "UCF", points: 30, date: "Nov 8" },
  { sport: "Men's Basketball", opponent: "Houston", points: 10, date: "Nov 12" },
  { sport: "Baseball", opponent: "Baylor", points: 20, date: "Mar 4" },
  { sport: "Volleyball", opponent: "Iowa State", points: 30, date: "Mar 7" },
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
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color: C.bg,
      background: multiplier >= 3 ? C.gold : C.goldLight,
      padding: "3px 10px", borderRadius: 6, letterSpacing: 0.3, whiteSpace: "nowrap",
    }}>{multiplier}× PTS</span>
  );
}

function ProgressBar({ current, from, to, fromColor, toColor }) {
  const pct = Math.min(((current - from) / (to - from)) * 100, 100);
  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 6, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 100,
          background: `linear-gradient(90deg, ${fromColor}, ${toColor})`,
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: C.textDim, fontWeight: 500 }}>{from}</span>
        <span style={{ fontSize: 10, color: C.textDim, fontWeight: 500 }}>{to}</span>
      </div>
    </div>
  );
}

function SegmentedControl({ options, active, onChange }) {
  return (
    <div style={{
      display: "flex", background: C.card, borderRadius: 12, padding: 3, marginBottom: 16,
      border: `1px solid ${C.border}`,
    }}>
      {options.map(o => (
        <div key={o.id} onClick={() => onChange(o.id)} style={{
          flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 10,
          fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
          background: active === o.id ? C.purple : "transparent",
          color: active === o.id ? C.white : C.textMuted,
        }}>{o.label}</div>
      ))}
    </div>
  );
}

function HomeTab({ onNavigate }) {
  const tierData = TIERS.find(t => t.name === USER.tier);
  const nextTier = TIERS[TIERS.indexOf(tierData) + 1];
  const topGames = UPCOMING_GAMES.filter(g => g.multiplier >= 2).slice(0, 3);

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 2 }}>Welcome back,</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: -0.5 }}>{USER.name}</div>
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${C.purple} 0%, ${C.purpleDark} 100%)`,
        borderRadius: 20, padding: "22px 20px 18px", marginBottom: 16,
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>Total Points</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>{USER.points}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>pts</span>
            </div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.08)", borderRadius: 14,
            padding: "10px 16px", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 14, color: tierData.color, fontWeight: 700 }}>{tierData.icon} {tierData.name}</div>
            {nextTier && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{nextTier.threshold - USER.points} to {nextTier.name}</div>}
          </div>
        </div>
        {nextTier && (
          <div style={{ marginTop: 18 }}>
            <ProgressBar current={USER.points} from={tierData.threshold} to={nextTier.threshold} fromColor={tierData.color} toColor={nextTier.color} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {[
          { value: USER.gamesAttended, sub: "Games" },
          { value: `#${USER.rank}`, sub: USER.org.split(" ").slice(0,2).join(" ") },
          { value: "3🔥", sub: "Streak" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: C.card, borderRadius: 16, padding: "16px 12px",
            border: `1px solid ${C.border}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.white, letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: -0.3 }}>Boosted This Week</div>
        <div onClick={() => onNavigate("games")} style={{ fontSize: 12, color: C.gold, fontWeight: 500, cursor: "pointer" }}>See all →</div>
      </div>
      {topGames.map((g, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", padding: "14px 16px",
          background: C.card, borderRadius: 14, marginBottom: 8,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 26, marginRight: 14, width: 36, textAlign: "center" }}>{g.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{g.sport} vs {g.opponent}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{g.date} · {g.time}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
            <MultiplierBadge multiplier={g.multiplier} />
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginTop: 4 }}>+{g.points}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GamesTab() {
  const [tab, setTab] = useState("upcoming");
  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: -0.5, marginBottom: 16 }}>Games</div>
      <SegmentedControl options={[{ id: "upcoming", label: "Upcoming" }, { id: "history", label: "History" }]} active={tab} onChange={setTab} />

      {tab === "upcoming" ? (
        UPCOMING_GAMES.map((g, i) => (
          <div key={i} style={{
            background: C.card, borderRadius: 16, padding: "16px", marginBottom: 10,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 30, width: 40, textAlign: "center", flexShrink: 0 }}>{g.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{g.sport} vs {g.opponent}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{g.date} · {g.time}</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{g.venue}</div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <MultiplierBadge multiplier={g.multiplier} />
                <div style={{ fontSize: 20, fontWeight: 700, color: C.gold, marginTop: 6 }}>+{g.points}</div>
                <div style={{ fontSize: 10, color: C.textDim }}>pts</div>
              </div>
            </div>
            {g.multiplier >= 2 && (
              <div style={{
                marginTop: 12, padding: "10px 12px", borderRadius: 10,
                background: `${C.gold}08`, border: `1px solid ${C.gold}15`,
                fontSize: 12, color: C.goldLight,
              }}>
                📈 AI prediction: {g.predicted} — boosted rewards active
              </div>
            )}
          </div>
        ))
      ) : (
        <>
          {PAST_GAMES.map((g, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", padding: "14px 16px",
              background: C.card, borderRadius: 14, marginBottom: 8, border: `1px solid ${C.border}`,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, marginRight: 12, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{g.sport} vs {g.opponent}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{g.date}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>+{g.points}</div>
            </div>
          ))}
          <div style={{ textAlign: "center", padding: 16, fontSize: 12, color: C.textDim }}>Showing last 6 check-ins</div>
        </>
      )}
    </div>
  );
}

function RewardsTab() {
  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: -0.5, marginBottom: 4 }}>Rewards</div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>{USER.points} points · {USER.tier} tier</div>

      {REWARDS.map((tierGroup, ti) => {
        const tierData = TIERS.find(t => t.name === tierGroup.tier);
        const isUnlocked = USER.points >= tierData.threshold;
        const isCurrent = USER.tier === tierGroup.tier;
        return (
          <div key={ti} style={{
            marginBottom: 14, borderRadius: 16, overflow: "hidden", background: C.card,
            border: isCurrent ? `1px solid ${tierData.color}40` : `1px solid ${C.border}`,
            opacity: isUnlocked ? 1 : 0.45,
          }}>
            <div style={{
              padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: `${tierData.color}15`, border: `1px solid ${tierData.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>{tierData.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                    {tierGroup.tier}
                    {isCurrent && <span style={{ fontSize: 9, fontWeight: 600, color: tierData.color, background: `${tierData.color}18`, padding: "2px 8px", borderRadius: 6, letterSpacing: 0.5 }}>ACTIVE</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 1 }}>Unlocks at {tierData.threshold} pts</div>
                </div>
              </div>
              {!isUnlocked && <span style={{ fontSize: 12, color: C.textDim }}>🔒</span>}
            </div>
            {tierGroup.items.map((r, ri) => (
              <div key={ri} style={{
                display: "flex", alignItems: "center", padding: "12px 16px",
                borderBottom: ri < tierGroup.items.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: isUnlocked ? C.text : C.textDim }}>{r.name}</div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 12 }}>
                  {r.claimed ? (
                    <span style={{ fontSize: 11, fontWeight: 600, color: tierData.color, letterSpacing: 0.3 }}>Claimed</span>
                  ) : isUnlocked && USER.points >= r.cost ? (
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: tierData.color, padding: "6px 16px", borderRadius: 100, cursor: "pointer" }}>Redeem</div>
                  ) : (
                    <span style={{ fontSize: 12, color: C.textDim }}>{r.cost} pts</span>
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
  return (
    <div style={{ padding: "0 16px 24px" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: -0.5, marginBottom: 16 }}>Leaderboard</div>
      <SegmentedControl options={[{ id: "orgs", label: "Organizations" }, { id: "students", label: "Students" }]} active={tab} onChange={setTab} />

      {tab === "orgs" ? (
        LEADERBOARD_ORGS.map((o, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "14px 16px",
            background: C.card, borderRadius: 14, marginBottom: 8,
            border: i === 0 ? `1px solid ${C.gold}30` : `1px solid ${C.border}`,
          }}>
            <div style={{ width: 28, fontSize: i < 3 ? 16 : 14, fontWeight: 700, color: i === 0 ? C.gold : i === 1 ? C.textMuted : i === 2 ? "#CD7F32" : C.textDim, marginRight: 12, textAlign: "center" }}>
              {i < 3 ? ["🥇","🥈","🥉"][i] : o.rank}
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: C.purpleDark,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: C.goldLight, marginRight: 12,
              border: "1px solid rgba(255,255,255,0.06)",
            }}>{o.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{o.members} members</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{o.points.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: C.textDim }}>pts</div>
            </div>
          </div>
        ))
      ) : (
        LEADERBOARD_STUDENTS.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "14px 16px",
            background: s.isYou ? `${C.purple}20` : C.card, borderRadius: 14, marginBottom: 8,
            border: s.isYou ? `1px solid ${C.purple}40` : `1px solid ${C.border}`,
          }}>
            <div style={{ width: 28, fontSize: i < 3 ? 16 : 14, fontWeight: 700, color: i === 0 ? C.gold : i === 1 ? C.textMuted : i === 2 ? "#CD7F32" : C.textDim, marginRight: 12, textAlign: "center" }}>
              {i < 3 ? ["🥇","🥈","🥉"][i] : s.rank}
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: C.white, marginRight: 12, flexShrink: 0,
            }}>{s.name.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                {s.name} {s.isYou && <span style={{ fontSize: 11, color: C.gold }}>(You)</span>}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{s.games} games · {s.tier}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{s.points}</div>
              <div style={{ fontSize: 10, color: C.textDim }}>pts</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const HomeIcon = ({c}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GamesIcon = ({c}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const RewardsIcon = ({c}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const BoardIcon = ({c}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>;

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
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        padding: isMobile ? "52px 20px 14px" : "12px 20px 14px",
        background: `linear-gradient(175deg, ${C.purple} 0%, ${C.purpleDark} 100%)`,
        borderBottom: `1px solid rgba(255,255,255,0.06)`, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: -0.5 }}>FrogPass</div>
          <div style={{
            fontSize: 11, color: C.goldLight, fontWeight: 500,
            background: "rgba(255,255,255,0.08)", padding: "5px 14px",
            borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)",
          }}>{USER.points} pts · {USER.tier}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingTop: 16, paddingBottom: isMobile ? 90 : 80, WebkitOverflowScrolling: "touch" }}>
        {activeTab === "home" && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === "games" && <GamesTab />}
        {activeTab === "rewards" && <RewardsTab />}
        {activeTab === "board" && <LeaderboardTab />}
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: C.bg, borderTop: `1px solid ${C.border}`,
        display: "flex", padding: isMobile ? "8px 8px 32px" : "8px 8px 16px",
      }}>
        {tabs.map(t => {
          const active = activeTab === t.id;
          const color = active ? C.gold : "rgba(255,255,255,0.25)";
          return (
            <div key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}>
              <t.Icon c={color} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, color, letterSpacing: 0.3 }}>{t.label}</span>
            </div>
          );
        })}
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
      minHeight: "100vh", background: "#000", padding: 20,
    }}>
      <div style={{
        width: 390, height: 844, background: C.bg,
        borderRadius: 48, border: "3px solid #1E1E2A",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)",
        position: "relative",
      }}>
        <div style={{
          width: 126, height: 32, background: C.bg,
          borderRadius: "0 0 20px 20px", position: "absolute",
          top: -1, left: "50%", transform: "translateX(-50%)", zIndex: 20,
          border: "3px solid #1E1E2A", borderTop: "none",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a24", position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)" }} />
        </div>
        <div style={{ height: 52, flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 28px 4px", zIndex: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>9:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <div style={{ width: 15, height: 11, border: "1px solid rgba(255,255,255,0.4)", borderRadius: 2, position: "relative" }}>
              <div style={{ position: "absolute", right: 1, top: 1, bottom: 1, width: 9, background: "rgba(255,255,255,0.5)", borderRadius: 1 }} />
            </div>
          </div>
        </div>
        {appContent}
        <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 100, background: "rgba(255,255,255,0.12)", zIndex: 30 }} />
      </div>
    </div>
  );
}
