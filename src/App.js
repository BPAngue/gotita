import { useState, useEffect, useRef } from "react";

const PURPLE = "#7C3AED";
const PINK = "#EC4899";
const LAVENDER = "#EDE9F6";
const LIGHT_PURPLE = "#A78BFA";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Pacifico&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Nunito', sans-serif; }
  .phone-wrap { width: 360px; height: 100%; background: ${LAVENDER}; overflow: hidden; position: relative; display: flex; flex-direction: column; flex: 1; }
  .screen { width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; }
  .screen::-webkit-scrollbar { width: 3px; }
  .screen::-webkit-scrollbar-thumb { background: ${LIGHT_PURPLE}; border-radius: 10px; }
  input { font-family: 'Nunito', sans-serif; }
  button { font-family: 'Nunito', sans-serif; cursor: pointer; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(60px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes confetti { 0% { transform:translateY(0) rotate(0); opacity:1; } 100% { transform:translateY(200px) rotate(720deg); opacity:0; } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes bellShake { 0%,100%{transform:rotate(0)} 15%{transform:rotate(14deg)} 30%{transform:rotate(-10deg)} 45%{transform:rotate(8deg)} 60%{transform:rotate(-5deg)} 75%{transform:rotate(3deg)} }
  .fade-in { animation: fadeIn 0.5s ease forwards; }
  .slide-up { animation: slideUp 0.4s ease forwards; }
  .slide-down { animation: slideDown 0.35s ease forwards; }
  .pulse { animation: pulse 2s infinite; }
  .bell-shake { animation: bellShake 0.6s ease; }
  .star-filled { color: #FBBF24; }
  .star-empty { color: #D1D5DB; }
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "white" }) => {
  const icons = {
    wallet: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H5a2 2 0 00-2 2v2h16V5a2 2 0 00-2-2z"/><circle cx="16" cy="14" r="1" fill={color} stroke="none"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    briefcase: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
    account: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
    orders: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.45-1.45a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>,
    eye_off: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    chevron_down: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>,
    cash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12H2M22 12h-4"/></svg>,
    transfer: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="8" cy="12" r="4"/><path d="M16 8l4 4-4 4M20 12H12"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
    location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    like: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>,
    complaint: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><dot cx="12" cy="16" r="1"/><circle cx="12" cy="16" r="1" fill={color}/></svg>,
    support: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81"/><circle cx="12" cy="12" r="4"/><path d="M22 12h-2M4 12H2M12 4V2M12 22v-2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
    cooking: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M9 11l3-3 3 3M12 8V3M4 19h16M4 19a2 2 0 002 2h12a2 2 0 002-2M4 19V9a8 8 0 0116 0v10"/></svg>,
    cleaning: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 22v-4M19.07 19.07l-2.83-2.83M22 12h-4M19.07 4.93l-2.83 2.83"/><circle cx="12" cy="12" r="3"/></svg>,
    laundry: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="4"/><circle cx="8" cy="6" r="1" fill={color}/></svg>,
    iron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M3 18h18M3 18V8h8l6 4v6"/><path d="M15 8v6"/></svg>,
    massage: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><circle cx="12" cy="5" r="2"/><path d="M12 7v6l-4 4M12 13l4 4M8 21h8"/></svg>,
    prayer: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M18 3a3 3 0 00-3 3l-7 9a3 3 0 000 6h1a3 3 0 003-3l7-9a3 3 0 000-6z"/><path d="M6 3a3 3 0 013 3v1"/></svg>,
    garden: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M12 22V12M12 12C12 7 7 3 2 3c0 5 4 9 10 9zM12 12c0-5 5-9 10-9 0 5-4 9-10 9z"/></svg>,
    care: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    manicure: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M18 2l4 4-14 14H4v-4L18 2z"/><path d="M14 6l4 4"/></svg>,
  };
  return icons[name] || <span style={{fontSize:size}}>●</span>;
};

// ─── STARS ───────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.floor(rating) ? "#FBBF24" : i === Math.ceil(rating) && rating % 1 >= 0.4 ? "#FBBF24" : "#D1D5DB", fontSize: size }}>
          {i <= Math.floor(rating) ? "★" : i === Math.ceil(rating) && rating % 1 >= 0.4 ? "½" : "★"}
        </span>
      ))}
    </span>
  );
};

// ─── INPUT FIELD ─────────────────────────────────────────────────────────────
const InputField = ({ icon, placeholder, type = "text", value, onChange, rightIcon, onRightClick }) => (
  <div style={{ background: PURPLE, borderRadius: 50, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 0 rgba(0,0,0,0.2)", marginBottom: 12 }}>
    {icon && <span style={{ opacity: 0.9 }}><Icon name={icon} size={18} /></span>}
    <input
      type={type} value={value} onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 15, fontWeight: 600, "::placeholder": { color: "rgba(255,255,255,0.7)" } }}
    />
    {rightIcon && <span onClick={onRightClick} style={{ cursor: "pointer", opacity: 0.9 }}><Icon name={rightIcon} size={18} /></span>}
  </div>
);

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
const BottomNav = ({ active, onNav, role }) => {
  const customerItems = [
    { id: "wallet", icon: "wallet", label: "Wallet" },
    { id: "chat", icon: "chat", label: "Chat" },
    { id: "home", icon: "briefcase", label: "", center: true },
    { id: "account", icon: "account", label: "Account" },
    { id: "orders", icon: "orders", label: "Orders" },
  ];
  const titaItems = [
    { id: "wallet", icon: "wallet", label: "Wallet" },
    { id: "chat", icon: "chat", label: "Chat" },
    { id: "titahome", icon: "briefcase", label: "", center: true },
    { id: "account", icon: "account", label: "Account" },
    { id: "commission", icon: "orders", label: "Jobs" },
  ];
  const items = role === "tita" ? titaItems : customerItems;
  const navBg = role === "tita" ? "#1E1040" : PURPLE;
  const centerBg = role === "tita" ? "#7C3AED" : PINK;
  const centerGlow = role === "tita" ? "0 -4px 20px rgba(124,58,237,0.6)" : "0 -4px 20px rgba(236,72,153,0.5)";
  return (
    <div style={{ background: navBg, padding: "8px 10px 12px", display: "flex", justifyContent: "space-around", alignItems: "center", flexShrink: 0, boxShadow: "0 -4px 20px rgba(0,0,0,0.2)" }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNav(item.id)}
          style={{ background: item.center ? centerBg : "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: item.center ? "14px" : "6px 10px", borderRadius: item.center ? "50%" : 8, cursor: "pointer", boxShadow: item.center ? centerGlow : "none", transform: item.center ? "translateY(-8px)" : "none", minWidth: item.center ? 56 : 40, minHeight: item.center ? 56 : 40, justifyContent: "center" }}>
          <Icon name={item.icon} size={item.center ? 26 : 22} color={active === item.id && !item.center ? "#F9A8D4" : "white"} />
          {!item.center && <span style={{ color: active === item.id ? "#F9A8D4" : "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700 }}>{item.label}</span>}
        </button>
      ))}
    </div>
  );
};

// ─── HEADER ──────────────────────────────────────────────────────────────────
const Header = ({ title, onBack, white }) => (
  <div style={{ background: white ? "transparent" : PURPLE, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
    {onBack && (
      <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Icon name="back" size={20} />
      </button>
    )}
    <span style={{ color: "white", fontSize: 22, fontWeight: 800 }}>{title}</span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// SCREENS
// ════════════════════════════════════════════════════════════════════════════

// SPLASH
const SplashScreen = ({ nav }) => {
  useEffect(() => { const t = setTimeout(() => {}, 0); return () => clearTimeout(t); }, []);
  return (
    <div className="screen" style={{ background: "white", justifyContent: "center", alignItems: "center", gap: 60 }}>
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <GoTitaLogo size={1.4} />
      </div>
      <button className="pulse" onClick={() => nav("login")}
        style={{ background: `linear-gradient(135deg, ${PINK}, #F472B6)`, color: "white", border: "none", borderRadius: 50, padding: "18px 60px", fontSize: 17, fontWeight: 900, letterSpacing: 2, boxShadow: "0 6px 0 rgba(236,72,153,0.35), 0 12px 30px rgba(236,72,153,0.3)", cursor: "pointer" }}>
        GET STARTED
      </button>
    </div>
  );
};

// LOGO COMPONENT
const GoTitaLogo = ({ size = 1 }) => (
  <div style={{ transform: `scale(${size})`, transformOrigin: "center" }}>
    <svg width="220" height="90" viewBox="0 0 220 90">
      <text x="10" y="72" fontFamily="Pacifico, cursive" fontSize="72" fill={PINK} opacity="0.95">Go</text>
      <circle cx="140" cy="35" r="22" fill="none" stroke={PINK} strokeWidth="8"/>
      <line x1="152" y1="52" x2="164" y2="67" stroke={PINK} strokeWidth="8" strokeLinecap="round"/>
      <path d="M158 20 Q170 10 180 18 Q195 8 200 20 Q210 10 205 30 Q200 45 185 55 Q175 48 165 35" fill={PINK} opacity="0.85"/>
      <text x="105" y="82" fontFamily="Pacifico, cursive" fontSize="36" fill={PINK}>tita</text>
    </svg>
  </div>
);

// LOGIN
const LoginScreen = ({ nav, setRole }) => {
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [loginRole, setLoginRole] = useState("customer");
  return (
    <div className="screen" style={{ background: LAVENDER, padding: "40px 30px 30px", justifyContent: "center", gap: 0 }}>
      <div className="fade-in" style={{ textAlign: "center", marginBottom: 10 }}>
        <GoTitaLogo size={0.85} />
        <h1 style={{ fontFamily: "Pacifico, cursive", fontSize: 42, background: `linear-gradient(135deg, ${PINK}, #C026D3)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 4px rgba(236,72,153,0.3))", marginTop: -6 }}>Login</h1>
      </div>
      {/* Role Switcher */}
      <div style={{ background: "white", borderRadius: 50, padding: 4, display: "flex", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        {["customer", "tita"].map(r => (
          <button key={r} onClick={() => setLoginRole(r)} style={{ flex: 1, padding: "10px", borderRadius: 50, border: "none", background: loginRole === r ? (r === "tita" ? PURPLE : PINK) : "transparent", color: loginRole === r ? "white" : "#aaa", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>{r === "customer" ? "🛍️" : "👩‍🍳"}</span>
            <span>{r === "customer" ? "Customer" : "Tita"}</span>
          </button>
        ))}
      </div>
      <div className="slide-up">
        <InputField icon="phone" placeholder="Enter Mobile Number" value={phone} onChange={setPhone} />
        <InputField icon="lock" placeholder="Enter Password" type="password" value={pw} onChange={setPw} rightIcon="eye_off" />
        <div style={{ textAlign: "right", marginTop: -4, marginBottom: 24 }}>
          <span style={{ color: PURPLE, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Forgot Password?</span>
        </div>
        <button onClick={() => { if (setRole) setRole(loginRole); nav(loginRole === "tita" ? "titahome" : "home"); }}
          style={{ width: "100%", background: loginRole === "tita" ? `linear-gradient(135deg, ${PURPLE}, #5B21B6)` : `linear-gradient(135deg, ${PINK}, #C026D3)`, color: "white", border: "none", borderRadius: 50, padding: "18px", fontSize: 17, fontWeight: 900, letterSpacing: 2, boxShadow: "0 4px 0 rgba(0,0,0,0.2)", cursor: "pointer", marginBottom: 24 }}>LOGIN</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#ccc" }} />
          <span style={{ color: "#999", fontSize: 13 }}>Login with</span>
          <div style={{ flex: 1, height: 1, background: "#ccc" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28 }}>
          <button style={{ background: "white", border: "none", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer", fontSize: 24 }}>G</button>
          <button style={{ background: "#1877F2", border: "none", borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer", color: "white", fontWeight: 900, fontSize: 22 }}>f</button>
        </div>
        <p style={{ textAlign: "center", color: "#666", fontSize: 14 }}>
          Don't have an account? <span onClick={() => nav("signup")} style={{ color: PURPLE, fontWeight: 800, cursor: "pointer" }}>Register</span>
        </p>
      </div>
    </div>
  );
};

// ─── SIGNUP ROLE CHOOSER ─────────────────────────────────────────────────────
const SignupScreen = ({ nav }) => (
  <div className="screen" style={{ background: LAVENDER, justifyContent: "center", alignItems: "center", padding: "40px 28px" }}>
    <div className="fade-in" style={{ width: "100%" }}>
      {/* Back */}
      <button onClick={() => nav("login")} style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: 6, color: PURPLE, fontWeight: 800, fontSize: 14, marginBottom: 24, cursor: "pointer" }}>
        <Icon name="back" size={18} color={PURPLE} /> Back to Login
      </button>

      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <GoTitaLogo size={0.9} />
      </div>
      <h2 style={{ fontFamily: "Pacifico, cursive", fontSize: 32, background: `linear-gradient(135deg, ${PINK}, #C026D3)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center", marginBottom: 8 }}>Join GoTita!</h2>
      <p style={{ textAlign: "center", color: "#888", fontSize: 14, fontWeight: 600, marginBottom: 36 }}>Who are you signing up as?</p>

      {/* Customer Card */}
      <button onClick={() => nav("signupCustomer")} style={{ width: "100%", background: "white", border: `3px solid ${LAVENDER}`, borderRadius: 24, padding: "24px 20px", display: "flex", alignItems: "center", gap: 18, marginBottom: 16, cursor: "pointer", boxShadow: "0 6px 24px rgba(124,58,237,0.1)", transition: "transform 0.15s", textAlign: "left" }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}22, ${PINK}44)`, border: `3px solid ${PINK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>🛍️</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: PURPLE, fontSize: 18, fontWeight: 900, marginBottom: 4 }}>I'm a Customer</p>
          <p style={{ color: "#888", fontSize: 13, lineHeight: 1.5 }}>I want to find and hire a Tita for household services.</p>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="back" size={16} color="white" />
        </div>
      </button>

      {/* Tita Card */}
      <button onClick={() => nav("signupTita")} style={{ width: "100%", background: "white", border: `3px solid ${LAVENDER}`, borderRadius: 24, padding: "24px 20px", display: "flex", alignItems: "center", gap: 18, marginBottom: 32, cursor: "pointer", boxShadow: "0 6px 24px rgba(124,58,237,0.1)", transition: "transform 0.15s", textAlign: "left" }}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${PURPLE}22, ${PURPLE}44)`, border: `3px solid ${PURPLE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>👩‍🍳</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: PURPLE, fontSize: 18, fontWeight: 900, marginBottom: 4 }}>I'm a Tita</p>
          <p style={{ color: "#888", fontSize: 13, lineHeight: 1.5 }}>I want to offer my skills and earn by helping others.</p>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="back" size={16} color="white" />
        </div>
      </button>

      <p style={{ textAlign: "center", color: "#888", fontSize: 14 }}>
        Already have an account? <span onClick={() => nav("login")} style={{ color: PURPLE, fontWeight: 800, cursor: "pointer" }}>Login</span>
      </p>
    </div>
  </div>
);

// ─── SHARED SOCIAL BUTTONS ────────────────────────────────────────────────────
const SocialSignup = ({ label }) => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ flex: 1, height: 1, background: "#ccc" }} />
      <span style={{ color: "#999", fontSize: 12 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#ccc" }} />
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
      <button style={{ background: "white", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer", fontSize: 20, fontWeight: 900, color: "#EA4335" }}>G</button>
      <button style={{ background: "#1877F2", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", fontWeight: 900, fontSize: 20 }}>f</button>
    </div>
  </>
);

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
const StepBar = ({ current, total }) => (
  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
    {[...Array(total)].map((_, i) => (
      <div key={i} style={{ height: 6, flex: 1, borderRadius: 3, background: i < current ? PURPLE : i === current ? PINK : "#ddd", transition: "all 0.3s" }} />
    ))}
  </div>
);

// ─── CUSTOMER SIGNUP ─────────────────────────────────────────────────────────
const CustomerSignupScreen = ({ nav }) => {
  const [step, setStep] = useState(0); // 0=basic info, 1=account info
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPw: "", address: "", birthdate: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="screen" style={{ background: LAVENDER }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${PINK}, #C026D3)`, padding: "20px 20px 28px", borderRadius: "0 0 28px 28px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={() => step === 0 ? nav("signup") : setStep(0)} style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="back" size={18} />
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🛍️</span>
              <span style={{ color: "white", fontSize: 20, fontWeight: 900 }}>Customer Sign Up</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Step {step + 1} of 2 — {step === 0 ? "Personal Information" : "Account Setup"}</p>
          </div>
        </div>
        <StepBar current={step} total={2} />
      </div>

      <div className="slide-up" style={{ padding: "20px 24px", flex: 1, overflowY: "auto" }}>
        {step === 0 && (
          <>
            <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Personal Information</h3>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: PURPLE, borderRadius: 50, padding: "13px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
                <Icon name="user" size={15} /><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First Name" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, fontWeight: 600, width: "100%" }} />
              </div>
              <div style={{ flex: 1, background: PURPLE, borderRadius: 50, padding: "13px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
                <Icon name="user" size={15} /><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last Name" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, fontWeight: 600, width: "100%" }} />
              </div>
            </div>
            <div style={{ background: PURPLE, borderRadius: 50, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
              <Icon name="location" size={16} /><input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Home Address" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 14, fontWeight: 600 }} />
            </div>
            <div style={{ background: PURPLE, borderRadius: 50, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🎂</span><input value={form.birthdate} onChange={e => set("birthdate", e.target.value)} placeholder="Date of Birth (MM/DD/YYYY)" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 14, fontWeight: 600 }} />
            </div>
            {/* Gender selector */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: PURPLE, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Gender</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["Woman", "Man", "Prefer not to say"].map(g => (
                  <button key={g} style={{ flex: 1, padding: "10px 6px", borderRadius: 50, border: `2px solid ${PURPLE}`, background: form.gender === g ? PURPLE : "white", color: form.gender === g ? "white" : PURPLE, fontSize: 11, fontWeight: 800, cursor: "pointer" }} onClick={() => set("gender", g)}>{g}</button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(1)} style={{ width: "100%", background: `linear-gradient(135deg, ${PINK}, #C026D3)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 15px rgba(236,72,153,0.35)" }}>Next →</button>
          </>
        )}
        {step === 1 && (
          <>
            <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Account Setup</h3>
            <InputField icon="phone" placeholder="Mobile Number" value={form.phone} onChange={v => set("phone", v)} />
            <InputField icon="user" placeholder="Email Address" value={form.email} onChange={v => set("email", v)} />
            <InputField icon="lock" placeholder="Create Password" type="password" value={form.password} onChange={v => set("password", v)} rightIcon="eye_off" />
            <InputField icon="lock" placeholder="Confirm Password" type="password" value={form.confirmPw} onChange={v => set("confirmPw", v)} />
            <div style={{ background: LAVENDER, borderRadius: 14, padding: "12px 16px", marginBottom: 20, border: `1px solid ${LIGHT_PURPLE}` }}>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" style={{ marginTop: 3, accentColor: PURPLE }} />
                <span style={{ color: "#666", fontSize: 12, lineHeight: 1.5 }}>I agree to the <span style={{ color: PURPLE, fontWeight: 800 }}>Terms of Service</span> and <span style={{ color: PURPLE, fontWeight: 800 }}>Privacy Policy</span> of GoTita.</span>
              </label>
            </div>
            <button onClick={() => nav("signupCustomerDone")} style={{ width: "100%", background: `linear-gradient(135deg, ${PINK}, #C026D3)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 15px rgba(236,72,153,0.35)", marginBottom: 20 }}>Create Account 🎉</button>
            <SocialSignup label="Or sign up with" />
            <p style={{ textAlign: "center", color: "#888", fontSize: 13 }}>Already have an account? <span onClick={() => nav("login")} style={{ color: PURPLE, fontWeight: 800, cursor: "pointer" }}>Login</span></p>
          </>
        )}
      </div>
    </div>
  );
};

// ─── TITA SIGNUP ─────────────────────────────────────────────────────────────
const ALL_SERVICES = ["Cooking", "Cleaning", "Laundry", "Clothes Ironing", "Massage", "Prayer/Sabat", "Caregiving", "Gardening", "Manicure/Pedicure", "Manaratbat / Manghihilot", "Tutoring", "Errand / Pasabuy"];

const TitaSignupScreen = ({ nav }) => {
  const [step, setStep] = useState(0); // 0=personal, 1=account, 2=services, 3=review
  const [form, setForm] = useState({ firstName: "", lastName: "", age: "", address: "", gender: "", phone: "", email: "", password: "", confirmPw: "", services: [], rate: "", bio: "", idType: "", availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false } });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleService = (s) => set("services", form.services.includes(s) ? form.services.filter(x => x !== s) : [...form.services, s]);
  const toggleDay = (d) => set("availability", { ...form.availability, [d]: !form.availability[d] });
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const steps = ["Personal", "Account", "Services", "Review"];

  return (
    <div className="screen" style={{ background: LAVENDER }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}, #5B21B6)`, padding: "20px 20px 28px", borderRadius: "0 0 28px 28px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={() => step === 0 ? nav("signup") : setStep(s => s - 1)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="back" size={18} />
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>👩‍🍳</span>
              <span style={{ color: "white", fontSize: 20, fontWeight: 900 }}>Tita Sign Up</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Step {step + 1} of 4 — {steps[step]}</p>
          </div>
        </div>
        <StepBar current={step} total={4} />
      </div>

      <div className="slide-up" style={{ padding: "20px 24px", flex: 1, overflowY: "auto" }}>
        {/* STEP 0: Personal */}
        {step === 0 && (
          <>
            <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Personal Information</h3>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: PURPLE, borderRadius: 50, padding: "13px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
                <Icon name="user" size={15} /><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First Name" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, fontWeight: 600, width: "100%" }} />
              </div>
              <div style={{ flex: 1, background: PURPLE, borderRadius: 50, padding: "13px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
                <Icon name="user" size={15} /><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last Name" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, fontWeight: 600, width: "100%" }} />
              </div>
            </div>
            <div style={{ background: PURPLE, borderRadius: 50, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🎂</span><input value={form.age} onChange={e => set("age", e.target.value)} placeholder="Age" type="number" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 14, fontWeight: 600 }} />
            </div>
            <div style={{ background: PURPLE, borderRadius: 50, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 12 }}>
              <Icon name="location" size={16} /><input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Home Address" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 14, fontWeight: 600 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: PURPLE, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Gender</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["Woman", "Man", "Other"].map(g => (
                  <button key={g} style={{ flex: 1, padding: "10px 4px", borderRadius: 50, border: `2px solid ${PURPLE}`, background: form.gender === g ? PURPLE : "white", color: form.gender === g ? "white" : PURPLE, fontSize: 11, fontWeight: 800, cursor: "pointer" }} onClick={() => set("gender", g)}>{g}</button>
                ))}
              </div>
            </div>
            {/* Valid ID */}
            <div style={{ background: PURPLE, borderRadius: 16, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 0 rgba(0,0,0,0.15)" }}>
              <span style={{ fontSize: 18 }}>🪪</span>
              <select value={form.idType} onChange={e => set("idType", e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: form.idType ? "white" : "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600 }}>
                <option value="">Select Valid ID Type</option>
                <option style={{ color: "#333" }}>PhilSys / National ID</option>
                <option style={{ color: "#333" }}>Driver's License</option>
                <option style={{ color: "#333" }}>Passport</option>
                <option style={{ color: "#333" }}>Voter's ID</option>
                <option style={{ color: "#333" }}>SSS / GSIS ID</option>
                <option style={{ color: "#333" }}>Postal ID</option>
              </select>
            </div>
            <button onClick={() => setStep(1)} style={{ width: "100%", background: `linear-gradient(135deg, ${PURPLE}, #5B21B6)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 15px rgba(124,58,237,0.35)" }}>Next →</button>
          </>
        )}

        {/* STEP 1: Account */}
        {step === 1 && (
          <>
            <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Account Setup</h3>
            <InputField icon="phone" placeholder="Mobile Number" value={form.phone} onChange={v => set("phone", v)} />
            <InputField icon="user" placeholder="Email Address" value={form.email} onChange={v => set("email", v)} />
            <InputField icon="lock" placeholder="Create Password" type="password" value={form.password} onChange={v => set("password", v)} rightIcon="eye_off" />
            <InputField icon="lock" placeholder="Confirm Password" type="password" value={form.confirmPw} onChange={v => set("confirmPw", v)} />
            <div style={{ background: LAVENDER, borderRadius: 16, padding: "14px 16px", marginBottom: 20, border: `2px solid ${LIGHT_PURPLE}` }}>
              <p style={{ color: PURPLE, fontSize: 13, fontWeight: 800, marginBottom: 6 }}>📋 Recovery Email</p>
              <input value={form.recoveryEmail || ""} onChange={e => set("recoveryEmail", e.target.value)} placeholder="e.g. family_member@email.com" style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#444", fontSize: 13, fontWeight: 600 }} />
            </div>
            <button onClick={() => setStep(2)} style={{ width: "100%", background: `linear-gradient(135deg, ${PURPLE}, #5B21B6)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 15px rgba(124,58,237,0.35)" }}>Next →</button>
          </>
        )}

        {/* STEP 2: Services */}
        {step === 2 && (
          <>
            <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 900, marginBottom: 6 }}>Services You Offer</h3>
            <p style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>Select all that apply</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {ALL_SERVICES.map(s => (
                <button key={s} onClick={() => toggleService(s)} style={{ padding: "8px 14px", borderRadius: 50, border: `2px solid ${form.services.includes(s) ? PURPLE : "#ddd"}`, background: form.services.includes(s) ? PURPLE : "white", color: form.services.includes(s) ? "white" : "#666", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                  {form.services.includes(s) ? "✓ " : ""}{s}
                </button>
              ))}
            </div>

            <h3 style={{ color: PURPLE, fontSize: 15, fontWeight: 900, marginBottom: 10 }}>Service Rate (per session)</h3>
            <div style={{ background: PURPLE, borderRadius: 50, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 0 rgba(0,0,0,0.15)", marginBottom: 20 }}>
              <span style={{ color: "white", fontWeight: 800, fontSize: 15 }}>₱</span>
              <input value={form.rate} onChange={e => set("rate", e.target.value)} placeholder="e.g. 500" type="number" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 14, fontWeight: 600 }} />
            </div>

            <h3 style={{ color: PURPLE, fontSize: 15, fontWeight: 900, marginBottom: 10 }}>Availability</h3>
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {days.map(d => (
                <button key={d} onClick={() => toggleDay(d)} style={{ flex: 1, minWidth: 38, padding: "10px 4px", borderRadius: 12, border: `2px solid ${form.availability[d] ? PURPLE : "#ddd"}`, background: form.availability[d] ? PURPLE : "white", color: form.availability[d] ? "white" : "#bbb", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{d}</button>
              ))}
            </div>

            <h3 style={{ color: PURPLE, fontSize: 15, fontWeight: 900, marginBottom: 10 }}>About You (Bio)</h3>
            <div style={{ background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 20, border: `2px solid ${LIGHT_PURPLE}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <textarea value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Tell customers about yourself — your experience, skills, and why they should hire you!" rows={4} style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#444", fontSize: 13, fontWeight: 600, resize: "none", lineHeight: 1.6 }} />
            </div>
            <button onClick={() => setStep(3)} style={{ width: "100%", background: `linear-gradient(135deg, ${PURPLE}, #5B21B6)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 15px rgba(124,58,237,0.35)" }}>Next →</button>
          </>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <>
            <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 900, marginBottom: 4 }}>Review Your Profile</h3>
            <p style={{ color: "#999", fontSize: 12, marginBottom: 20 }}>Confirm your details before submitting</p>

            {/* Summary cards */}
            {[
              { title: "👤 Personal", rows: [["Name", `${form.firstName || "—"} ${form.lastName || "—"}`], ["Age", form.age || "—"], ["Address", form.address || "—"], ["Gender", form.gender || "—"], ["Valid ID", form.idType || "—"]] },
              { title: "🔐 Account", rows: [["Phone", form.phone || "—"], ["Email", form.email || "—"], ["Password", form.password ? "••••••••" : "—"]] },
              { title: "💼 Services", rows: [["Offers", form.services.length ? form.services.join(", ") : "None selected"], ["Rate", form.rate ? `₱${form.rate}/session` : "—"], ["Days", Object.entries(form.availability).filter(([, v]) => v).map(([k]) => k).join(", ") || "None"]] },
            ].map(card => (
              <div key={card.title} style={{ background: "white", borderRadius: 18, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${LAVENDER}` }}>
                <p style={{ color: PURPLE, fontWeight: 900, fontSize: 14, marginBottom: 10 }}>{card.title}</p>
                {card.rows.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #faf5ff" }}>
                    <span style={{ color: "#aaa", fontSize: 12, fontWeight: 700 }}>{k}</span>
                    <span style={{ color: "#444", fontSize: 12, fontWeight: 600, maxWidth: "60%", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}

            {form.bio && (
              <div style={{ background: "white", borderRadius: 18, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${LAVENDER}` }}>
                <p style={{ color: PURPLE, fontWeight: 900, fontSize: 14, marginBottom: 8 }}>📝 Your Bio</p>
                <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6 }}>{form.bio}</p>
              </div>
            )}

            <div style={{ background: LAVENDER, borderRadius: 14, padding: "12px 16px", marginBottom: 20, border: `1px solid ${LIGHT_PURPLE}` }}>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                <input type="checkbox" style={{ marginTop: 3, accentColor: PURPLE }} />
                <span style={{ color: "#666", fontSize: 12, lineHeight: 1.5 }}>I agree to the <span style={{ color: PURPLE, fontWeight: 800 }}>Terms of Service</span>, <span style={{ color: PURPLE, fontWeight: 800 }}>Privacy Policy</span>, and <span style={{ color: PURPLE, fontWeight: 800 }}>Tita Code of Conduct</span>.</span>
              </label>
            </div>

            <button onClick={() => nav("signupTitaDone")} style={{ width: "100%", background: `linear-gradient(135deg, ${PURPLE}, #5B21B6)`, color: "white", border: "none", borderRadius: 50, padding: "18px", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)", marginBottom: 16 }}>
              Submit Application 🎉
            </button>
            <SocialSignup label="Or sign up with" />
            <p style={{ textAlign: "center", color: "#888", fontSize: 13 }}>Already have an account? <span onClick={() => nav("login")} style={{ color: PURPLE, fontWeight: 800, cursor: "pointer" }}>Login</span></p>
          </>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS PANEL
// ════════════════════════════════════════════════════════════════════════════
const CUSTOMER_NOTIFS = [
  { id: 1, type: "booking",  emoji: "✅", title: "Booking Confirmed!",          body: "Nena Dimagiba accepted your Manaratbat request for Oct 10 at 10:00 AM.",  time: "2 min ago",    unread: true  },
  { id: 2, type: "order",    emoji: "🚶", title: "Tita is on her way!",         body: "Aling Sayo is heading to your location. ETA: ~15 minutes.",              time: "18 min ago",   unread: true  },
  { id: 3, type: "promo",    emoji: "🎉", title: "Weekend Promo!",               body: "Get 20% off on Cleaning and Laundry services this Saturday and Sunday.", time: "1 hr ago",     unread: true  },
  { id: 4, type: "payment",  emoji: "💳", title: "Payment Successful",           body: "PHP 542.00 was deducted from your wallet for your Manaratbat session.",  time: "2 hrs ago",    unread: false },
  { id: 5, type: "review",   emoji: "⭐", title: "Rate Your Last Service",       body: "How was your experience with Alice Bungisngis? Tap to leave a review.",   time: "Yesterday",    unread: false },
  { id: 6, type: "booking",  emoji: "📅", title: "Upcoming Booking Reminder",   body: "You have a Massage session with Alice B. tomorrow at 11:00 AM.",         time: "Yesterday",    unread: false },
  { id: 7, type: "order",    emoji: "❌", title: "Booking Cancelled",            body: "Your Cleaning session on Sept 28 was cancelled. A refund is processing.",time: "2 days ago",   unread: false },
  { id: 8, type: "system",   emoji: "🛡️", title: "Security Alert",              body: "Your account was accessed from a new device. Tap to review.",            time: "3 days ago",   unread: false },
  { id: 9, type: "promo",    emoji: "💜", title: "New Titas Near You!",          body: "3 new Titas just joined in your area. Browse and find your match!",      time: "4 days ago",   unread: false },
];

const TITA_NOTIFS = [
  { id: 1, type: "booking",  emoji: "🔔", title: "New Booking Request!",         body: "Maria Santos wants to hire you for Cooking on Oct 12 at 2:00 PM.",      time: "Just now",     unread: true  },
  { id: 2, type: "booking",  emoji: "🔔", title: "New Booking Request!",         body: "Luz Reyes requested a Cleaning session for tomorrow at 9:00 AM.",       time: "5 min ago",    unread: true  },
  { id: 3, type: "payment",  emoji: "💰", title: "Payment Received!",            body: "PHP 542.00 was added to your wallet from your Manaratbat session.",     time: "1 hr ago",     unread: true  },
  { id: 4, type: "review",   emoji: "⭐", title: "New 5-Star Review!",           body: "K*** K**** gave you 5 stars: Niceeeee! I-hihire ko ulit si Nanay.",     time: "3 hrs ago",    unread: false },
  { id: 5, type: "system",   emoji: "📊", title: "Weekly Earnings Summary",      body: "You earned PHP 3,640 this week — 12% more than last week. Great job!",  time: "Yesterday",    unread: false },
  { id: 6, type: "booking",  emoji: "📅", title: "Reminder: Job Tomorrow",       body: "Don't forget your Laundry session with Ana Cruz at 8:00 AM tomorrow.",  time: "Yesterday",    unread: false },
  { id: 7, type: "system",   emoji: "🏆", title: "Achievement Unlocked!",        body: "You completed 100+ jobs! You are now a GoTita Gold Tita.",              time: "2 days ago",   unread: false },
  { id: 8, type: "review",   emoji: "💬", title: "Customer Left a Comment",      body: "A****** B****: Ang bait ni nanay grabe, highly recommended!",           time: "5 days ago",   unread: false },
];

const TYPE_COLORS = {
  booking: { bg: "#EDE9FE", accent: PURPLE,    label: "Booking" },
  payment: { bg: "#D1FAE5", accent: "#059669", label: "Payment" },
  review:  { bg: "#FEF3C7", accent: "#D97706", label: "Review"  },
  promo:   { bg: "#FCE7F3", accent: PINK,      label: "Promo"   },
  order:   { bg: "#DBEAFE", accent: "#2563EB", label: "Order"   },
  system:  { bg: "#F3F4F6", accent: "#6B7280", label: "System"  },
};

const NotificationsPanel = ({ open, onClose, role, notifications, setNotifications }) => {
  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter(n => n.unread).length;

  const filters = role === "tita"
    ? ["all", "booking", "payment", "review", "system"]
    : ["all", "booking", "order",   "payment", "promo" ];

  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  const markRead    = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const markAllRead = ()   => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const dismiss     = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const accentGrad = role === "tita"
    ? "linear-gradient(135deg, #1E1040, #2d1b69)"
    : `linear-gradient(135deg, ${PURPLE}, #5B21B6)`;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity 0.3s" }} />

      {/* Panel slides down from top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, maxHeight: "88%", background: "white", borderRadius: "0 0 28px 28px", zIndex: 50, display: "flex", flexDirection: "column", boxShadow: "0 12px 48px rgba(0,0,0,0.25)", transform: open ? "translateY(0)" : "translateY(-105%)", transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden" }}>

        {/* ── Header ── */}
        <div style={{ background: accentGrad, padding: "18px 20px 16px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Icon name="bell" size={22} color="white" />
                {unreadCount > 0 && (
                  <div style={{ position: "absolute", top: -5, right: -5, background: PINK, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid transparent" }}>
                    <span style={{ color: "white", fontSize: 9, fontWeight: 900 }}>{unreadCount}</span>
                  </div>
                )}
              </div>
              <h2 style={{ color: "white", fontSize: 20, fontWeight: 900 }}>Notifications</h2>
              {unreadCount > 0 && (
                <div style={{ background: PINK, borderRadius: 50, padding: "2px 10px" }}>
                  <span style={{ color: "white", fontSize: 11, fontWeight: 800 }}>{unreadCount} new</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 50, padding: "6px 12px", color: "white", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                  Mark all read
                </button>
              )}
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="close" size={16} color="white" />
              </button>
            </div>
          </div>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)", border: "none", borderRadius: 50, padding: "6px 14px", color: filter === f ? PURPLE : "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0, textTransform: "capitalize" }}>
                {f === "all" ? `All (${notifications.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── List ── */}
        <div style={{ flex: 1, overflowY: "auto", background: "#F9F7FF" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🔕</div>
              <p style={{ color: "#aaa", fontSize: 15, fontWeight: 700 }}>No notifications here</p>
              <p style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>You are all caught up!</p>
            </div>
          ) : (
            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((n, i) => {
                const tc = TYPE_COLORS[n.type] || TYPE_COLORS.system;
                return (
                  <div key={n.id} onClick={() => markRead(n.id)}
                    style={{ background: n.unread ? "white" : "#FAFAFA", borderRadius: 18, padding: "14px 40px 12px 14px", display: "flex", gap: 12, alignItems: "flex-start", boxShadow: n.unread ? "0 3px 16px rgba(124,58,237,0.1)" : "0 1px 4px rgba(0,0,0,0.04)", border: n.unread ? `1.5px solid ${tc.accent}30` : "1.5px solid #f0eeff", cursor: "pointer", position: "relative", transition: "opacity 0.2s" }}>

                    {/* Unread dot */}
                    {n.unread && <div style={{ position: "absolute", top: 16, right: 38, width: 8, height: 8, borderRadius: "50%", background: tc.accent }} />}

                    {/* Icon bubble */}
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: `1px solid ${tc.accent}20` }}>
                      {n.emoji}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ color: tc.accent, fontSize: 10, fontWeight: 800, background: tc.bg, padding: "2px 8px", borderRadius: 50, border: `1px solid ${tc.accent}30` }}>{tc.label}</span>
                        <span style={{ color: "#bbb", fontSize: 10, fontWeight: 600 }}>{n.time}</span>
                      </div>
                      <p style={{ color: n.unread ? "#1a1a2e" : "#555", fontSize: 13, fontWeight: n.unread ? 800 : 600, marginBottom: 3, lineHeight: 1.35 }}>{n.title}</p>
                      <p style={{ color: "#888", fontSize: 12, lineHeight: 1.5 }}>{n.body}</p>
                    </div>

                    {/* Dismiss button */}
                    <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      style={{ position: "absolute", top: 10, right: 10, background: "#f0eeff", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.7 }}>
                      <Icon name="close" size={11} color="#888" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "12px 16px 16px", background: "white", borderTop: "1px solid #f0eeff", flexShrink: 0, textAlign: "center" }}>
          <button onClick={() => { setNotifications([]); setFilter("all"); }}
            style={{ background: "transparent", border: "none", color: "#ccc", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Clear all notifications
          </button>
        </div>
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// BURGER MENU DRAWER
// ════════════════════════════════════════════════════════════════════════════
const BurgerMenu = ({ open, onClose, nav, role }) => {
  const customerLinks = [
    { emoji: "🏠", label: "Home", screen: "home" },
    { emoji: "🗺️", label: "Browse Services", screen: "map" },
    { emoji: "📦", label: "My Orders", screen: "orders" },
    { emoji: "💬", label: "Messages", screen: "chat" },
    { emoji: "💜", label: "My Wallet", screen: "wallet" },
    { emoji: "👤", label: "My Account", screen: "account" },
  ];
  const titaLinks = [
    { emoji: "📊", label: "Dashboard", screen: "titahome" },
    { emoji: "💼", label: "My Jobs", screen: "commission" },
    { emoji: "💬", label: "Messages", screen: "chat" },
    { emoji: "💜", label: "My Earnings", screen: "wallet" },
    { emoji: "👤", label: "My Profile", screen: "account" },
    { emoji: "⭐", label: "My Reviews", screen: "orders" },
  ];
  const links = role === "tita" ? titaLinks : customerLinks;
  const accentColor = role === "tita" ? PURPLE : PINK;
  const bgGrad = role === "tita"
    ? "linear-gradient(180deg, #1E1040 0%, #2d1b69 100%)"
    : "linear-gradient(180deg, #5B21B6 0%, #7C3AED 100%)";

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity 0.3s" }} />
      {/* Drawer */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "78%", height: "100%", background: bgGrad, zIndex: 50, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.4)" }}>
        {/* Header */}
        <div style={{ padding: "52px 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <GoTitaLogo size={0.6} />
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="close" size={18} />
            </button>
          </div>
          {/* Profile row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: "3px solid rgba(255,255,255,0.3)" }}>
              {role === "tita" ? "👩‍🍳" : "👧"}
            </div>
            <div>
              <p style={{ color: "white", fontSize: 17, fontWeight: 900 }}>Juana Dela Cruz</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "3px 10px", marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: role === "tita" ? "#22C55E" : accentColor }} />
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 700 }}>{role === "tita" ? "Tita · Active" : "Customer"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          {links.map((link, i) => (
            <button key={i} onClick={() => { nav(link.screen); onClose(); }}
              style={{ width: "100%", background: "transparent", border: "none", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "background 0.2s", textAlign: "left" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ fontSize: 22, width: 32, textAlign: "center" }}>{link.emoji}</span>
              <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>{link.label}</span>
            </button>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "10px 24px" }} />

          {/* Role switch shortcut */}
          <div style={{ padding: "10px 24px" }}>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Switch View</p>
            <button onClick={() => { nav(role === "tita" ? "home" : "titahome"); onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "12px 16px", cursor: "pointer", width: "100%" }}>
              <span style={{ fontSize: 20 }}>{role === "tita" ? "🛍️" : "👩‍🍳"}</span>
              <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>View as {role === "tita" ? "Customer" : "Tita"}</span>
            </button>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "10px 24px" }} />

          {[
            { emoji: "🔔", label: "Notifications" },
            { emoji: "🛡️", label: "Privacy & Safety" },
            { emoji: "❓", label: "Help & Support" },
            { emoji: "⚙️", label: "Settings" },
          ].map((item, i) => (
            <button key={i} onClick={onClose} style={{ width: "100%", background: "transparent", border: "none", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{item.emoji}</span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600 }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={() => { nav("splash"); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "12px 16px", cursor: "pointer", width: "100%" }}>
            <span style={{ fontSize: 20 }}>🚪</span>
            <span style={{ color: "#FCA5A5", fontSize: 14, fontWeight: 800 }}>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// CUSTOMER HOME DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
const HomeScreen = ({ nav, onMenuOpen, onBellOpen, unreadCount }) => {
  const [slide, setSlide] = useState(0);
  const banners = [
    { text: "Wala nang oras para magluto? Ipaluto na kay Tita 'yan!", emoji: "🍲", color: "#2d1b69" },
    { text: "Maraming damit na labhan? Hayaan na si Tita!", emoji: "👗", color: "#1e3a5f" },
    { text: "Kailangan ng massahe? Tawagan si Tita ngayon!", emoji: "💆", color: "#1a3320" },
  ];
  const services = [
    { id: "cooking", icon: "cooking", label: "Cooking" },
    { id: "cleaning", icon: "cleaning", label: "Cleaning" },
    { id: "laundry", icon: "laundry", label: "Laundry" },
    { id: "iron", icon: "iron", label: "Ironing" },
    { id: "massage", icon: "massage", label: "Massage" },
    { id: "prayer", icon: "prayer", label: "Prayer/Sabat" },
    { id: "care", icon: "care", label: "Caregiving" },
    { id: "garden", icon: "garden", label: "Gardening" },
    { id: "manicure", icon: "manicure", label: "Manicure" },
  ];
  const recentTitas = [
    { name: "Nena D.", emoji: "👩", rating: 4.5 },
    { name: "Aling Sayo", emoji: "🧓", rating: 4.8 },
    { name: "Alice B.", emoji: "👵", rating: 4.2 },
  ];
  useEffect(() => { const t = setInterval(() => setSlide(s => (s + 1) % 3), 3500); return () => clearInterval(t); }, []);

  return (
    <div className="screen" style={{ background: LAVENDER }}>
      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}, #5B21B6)`, padding: "20px 20px 32px", borderRadius: "0 0 28px 28px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👧</div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600 }}>Welcome back, Customer!</p>
              <h2 style={{ color: "white", fontSize: 20, fontWeight: 900 }}>Hello, Juana! 👋</h2>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onBellOpen} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Icon name="bell" size={18} />
              {unreadCount > 0 && <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: PINK, border: "2px solid white" }} />}
            </button>
            <button onClick={onMenuOpen} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="menu" size={18} />
            </button>
          </div>
        </div>
        {/* Search */}
        <div onClick={() => nav("map")} style={{ background: "white", borderRadius: 50, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          <input placeholder="Looking for a service?" readOnly style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#888", fontWeight: 600, cursor: "pointer" }} />
          <div style={{ background: PINK, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="search" size={15} color="white" />
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ padding: "16px 16px 0", display: "flex", gap: 10 }}>
        {[
          { label: "Active Orders", value: "2", emoji: "📦", color: PURPLE },
          { label: "Fave Titas", value: "5", emoji: "💜", color: PINK },
          { label: "Wallet", value: "₱2,045", emoji: "💳", color: "#059669" },
        ].map((stat, i) => (
          <div key={i} style={{ flex: 1, background: "white", borderRadius: 16, padding: "12px 10px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.emoji}</div>
            <p style={{ color: stat.color, fontSize: 16, fontWeight: 900 }}>{stat.value}</p>
            <p style={{ color: "#aaa", fontSize: 9, fontWeight: 700 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Banner Carousel ── */}
      <div style={{ padding: "14px 16px 0", flexShrink: 0 }}>
        <div style={{ borderRadius: 20, overflow: "hidden", height: 140, background: banners[slide].color, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
            <span style={{ fontSize: 44 }}>{banners[slide].emoji}</span>
            <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 14, padding: "10px 14px", flex: 1, position: "relative" }}>
              <p style={{ color: "#333", fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>{banners[slide].text}</p>
              <div style={{ position: "absolute", left: -7, top: "50%", transform: "translateY(-50%)", borderRight: "7px solid rgba(255,255,255,0.92)", borderTop: "6px solid transparent", borderBottom: "6px solid transparent" }} />
            </div>
            <span style={{ fontSize: 40, position: "absolute", right: 16, bottom: 30 }}>👩‍🍳</span>
          </div>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: i === slide ? 16 : 6, height: 6, borderRadius: 3, background: i === slide ? "white" : "rgba(255,255,255,0.35)", transition: "all 0.3s" }} />)}
          </div>
        </div>
      </div>

      {/* ── Recently Hired ── */}
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ color: PURPLE, fontSize: 15, fontWeight: 900 }}>Recently Hired</h3>
          <span onClick={() => nav("chat")} style={{ color: PINK, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>See All →</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {recentTitas.map((t, i) => (
            <button key={i} onClick={() => nav("titaProfile")} style={{ flex: 1, background: "white", border: "none", borderRadius: 16, padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: LAVENDER, border: `2px solid ${PURPLE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.emoji}</div>
              <span style={{ color: PURPLE, fontSize: 10, fontWeight: 800 }}>{t.name}</span>
              <span style={{ color: "#FBBF24", fontSize: 10 }}>★ {t.rating}</span>
            </button>
          ))}
          <button onClick={() => nav("map")} style={{ flex: 1, background: LAVENDER, border: `2px dashed ${LIGHT_PURPLE}`, borderRadius: 16, padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>➕</span>
            <span style={{ color: PURPLE, fontSize: 10, fontWeight: 800 }}>Find Tita</span>
          </button>
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div style={{ padding: "14px 16px 20px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ color: PURPLE, fontSize: 15, fontWeight: 900 }}>Services</h3>
          <span onClick={() => nav("map")} style={{ color: PINK, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Browse Map →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {services.map(s => (
            <button key={s.id} onClick={() => nav("map")} style={{ background: "white", border: "none", borderRadius: 16, padding: "14px 6px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
              <Icon name={s.icon} size={30} color={PINK} />
              <span style={{ color: "#555", fontSize: 10, fontWeight: 700, textAlign: "center" }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// TITA HOME DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
const TitaHomeScreen = ({ nav, onMenuOpen, onBellOpen, unreadCount }) => {
  const [accepting, setAccepting] = useState(true);
  const bookings = [
    { name: "Maria Santos", service: "Cooking", time: "Today, 2:00 PM", status: "confirmed", emoji: "👩" },
    { name: "Luz Reyes", service: "Cleaning", time: "Tomorrow, 9:00 AM", status: "pending", emoji: "👱‍♀️" },
    { name: "Ana Cruz", service: "Laundry", time: "Oct 14, 8:00 AM", status: "confirmed", emoji: "🧕" },
  ];
  const weekEarnings = [320, 480, 550, 410, 600, 750, 530];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxE = Math.max(...weekEarnings);

  return (
    <div className="screen" style={{ background: "#F0EBF8" }}>
      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #1E1040, #2d1b69)", padding: "20px 20px 30px", borderRadius: "0 0 28px 28px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(236,72,153,0.3)", border: "3px solid rgba(236,72,153,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👩‍🍳</div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: accepting ? "#22C55E" : "#6B7280", border: "2px solid #1E1040" }} />
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600 }}>Tita Dashboard</p>
              <h2 style={{ color: "white", fontSize: 20, fontWeight: 900 }}>Magandang araw, Juana! 🌸</h2>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onBellOpen} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Icon name="bell" size={18} />
              {unreadCount > 0 && <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: PINK, border: "2px solid #1E1040" }} />}
            </button>
            <button onClick={onMenuOpen} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="menu" size={18} />
            </button>
          </div>
        </div>

        {/* Status toggle + stats row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.08)", borderRadius: 18, padding: "14px 18px" }}>
          <div>
            <p style={{ color: accepting ? "#4ADE80" : "#9CA3AF", fontSize: 13, fontWeight: 800, marginBottom: 2 }}>
              {accepting ? "● Accepting Jobs" : "● Not Available"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Tap to {accepting ? "go offline" : "go online"}</p>
          </div>
          <div onClick={() => setAccepting(!accepting)} style={{ width: 54, height: 28, borderRadius: 14, background: accepting ? "#22C55E" : "rgba(255,255,255,0.2)", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: accepting ? 28 : 3, width: 22, height: 22, borderRadius: "50%", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", transition: "left 0.3s" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
        {/* ── Earnings This Week ── */}
        <div style={{ background: "white", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <p style={{ color: "#aaa", fontSize: 12, fontWeight: 700 }}>This Week's Earnings</p>
              <p style={{ color: PURPLE, fontSize: 28, fontWeight: 900 }}>₱3,640</p>
              <p style={{ color: "#22C55E", fontSize: 12, fontWeight: 700 }}>▲ 12% vs last week</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#aaa", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>This Month</p>
              <p style={{ color: PURPLE, fontSize: 18, fontWeight: 900 }}>₱14,250</p>
            </div>
          </div>
          {/* Mini bar chart */}
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
            {weekEarnings.map((e, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: `${(e / maxE) * 48}px`, borderRadius: "4px 4px 0 0", background: i === 5 ? PURPLE : LAVENDER, transition: "height 0.3s" }} />
                <span style={{ color: "#aaa", fontSize: 9, fontWeight: 700 }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Stats Row ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Rating", value: "4.8 ★", color: "#FBBF24", emoji: "⭐" },
            { label: "Total Jobs", value: "127", color: PURPLE, emoji: "✅" },
            { label: "Response", value: "96%", color: "#22C55E", emoji: "⚡" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "white", borderRadius: 16, padding: "12px 8px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.emoji}</div>
              <p style={{ color: s.color, fontSize: 15, fontWeight: 900 }}>{s.value}</p>
              <p style={{ color: "#bbb", fontSize: 9, fontWeight: 700 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Upcoming Bookings ── */}
        <div style={{ background: "white", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ color: PURPLE, fontSize: 15, fontWeight: 900 }}>Upcoming Bookings</h3>
            <span onClick={() => nav("commission")} style={{ color: PINK, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>See All →</span>
          </div>
          {bookings.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < bookings.length - 1 ? "1px solid #f5f0ff" : "none" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: LAVENDER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{b.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#333", fontSize: 13, fontWeight: 800 }}>{b.name}</p>
                <p style={{ color: "#888", fontSize: 11 }}>{b.service} · {b.time}</p>
              </div>
              <div style={{ background: b.status === "confirmed" ? "#D1FAE5" : "#FEF3C7", color: b.status === "confirmed" ? "#059669" : "#D97706", borderRadius: 50, padding: "4px 10px", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>
                {b.status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Reviews ── */}
        <div style={{ background: "white", borderRadius: 20, padding: "18px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ color: PURPLE, fontSize: 15, fontWeight: 900 }}>Recent Reviews</h3>
            <span style={{ color: PINK, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>See All →</span>
          </div>
          {[
            { reviewer: "K*** K****", stars: 5, text: "Niceeeee! I-hihire ko ulit si Nanay.", time: "2 days ago" },
            { reviewer: "A****** B****", stars: 4, text: "Ang bait ni nanay grabe, highly recommended!", time: "5 days ago" },
          ].map((r, i) => (
            <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i === 0 ? "1px solid #f5f0ff" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: PURPLE, fontSize: 13, fontWeight: 800 }}>{r.reviewer}</span>
                <span style={{ color: "#FBBF24", fontSize: 12 }}>{"★".repeat(r.stars)}</span>
              </div>
              <p style={{ color: "#666", fontSize: 12, lineHeight: 1.5 }}>{r.text}</p>
              <p style={{ color: "#bbb", fontSize: 10, marginTop: 4 }}>{r.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// MAP SCREEN
const MapScreen = ({ nav }) => {
  const [showResults, setShowResults] = useState(false);
  const [search, setSearch] = useState("Manaratbat");
  const pins = [
    { top: "22%", left: "18%", emoji: "👵" },
    { top: "42%", left: "62%", emoji: "👩" },
    { top: "68%", left: "14%", emoji: "🧓" },
  ];
  return (
    <div className="screen" style={{ background: LAVENDER, position: "relative" }}>
      {/* Fake Map */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#f0ede8" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <rect width="100%" height="100%" fill="#f5f1eb"/>
          {[...Array(8)].map((_, i) => <line key={i} x1={0} y1={i * 80} x2="100%" y2={i * 80} stroke="#e0d8cc" strokeWidth="1" />)}
          {[...Array(6)].map((_, i) => <line key={i} x1={i * 80} y1={0} x2={i * 80} y2="100%" stroke="#e0d8cc" strokeWidth="1" />)}
          <rect x="40" y="60" width="70" height="50" rx="4" fill="#ddd9d0" />
          <rect x="150" y="30" width="90" height="40" rx="4" fill="#ccc6b8" />
          <rect x="60" y="160" width="50" height="60" rx="4" fill="#ddd9d0" />
          <rect x="200" y="140" width="80" height="55" rx="4" fill="#ccc6b8" />
          <rect x="20" y="280" width="60" height="45" rx="4" fill="#ddd9d0" />
          <rect x="160" y="270" width="100" height="60" rx="4" fill="#d4d0c8" />
          <path d="M0 130 Q180 130 380 100" stroke="#ddd" strokeWidth="22" fill="none" />
          <path d="M100 0 Q100 200 120 400" stroke="#ddd" strokeWidth="18" fill="none" />
          <path d="M220 50 Q240 250 210 450" stroke="#e8e0d4" strokeWidth="14" fill="none" />
          <text x="160" y="120" fill="#aaa" fontSize="11" fontFamily="sans-serif">Casa Anson</text>
          <text x="30" y="55" fill="#aaa" fontSize="10" fontFamily="sans-serif">Jones Street</text>
          <text x="10" y="180" fill="#aaa" fontSize="10" fontFamily="sans-serif" transform="rotate(-90 10 180)">M.H. del Pilar</text>
          <text x="80" y="320" fill="#aaa" fontSize="10" fontFamily="sans-serif">Cirilo Roy</text>
          <text x="80" y="334" fill="#aaa" fontSize="10" fontFamily="sans-serif">Montejo NHS</text>
          <text x="30" y="395" fill="#aaa" fontSize="9" fontFamily="sans-serif">Sacred Heart</text>
          <text x="280" y="390" fill="#aaa" fontSize="9" fontFamily="sans-serif">Brgy 6 Hall</text>
        </svg>
        {/* User dot */}
        <div style={{ position: "absolute", top: "47%", left: "46%", width: 20, height: 20, borderRadius: "50%", background: PURPLE, border: "3px solid white", boxShadow: "0 0 0 6px rgba(124,58,237,0.2)" }} />
        {/* Tita pins */}
        {pins.map((p, i) => (
          <div key={i} onClick={() => setShowResults(true)} style={{ position: "absolute", top: p.top, left: p.left, cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "white", border: "3px solid #DC2626", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>{p.emoji}</div>
            <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "12px solid #DC2626", margin: "0 auto" }} />
          </div>
        ))}
      </div>
      {/* Bottom Bar */}
      <div style={{ background: PURPLE, padding: "14px 16px 20px", flexShrink: 0 }}>
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 50, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setShowResults(true)} placeholder="Looking for a service?" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 15, fontWeight: 600 }} />
          <div style={{ background: PINK, borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="search" size={14} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => nav("home")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="back" size={18} />
          </button>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600 }}>Shown in Map:</p>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ color: "white", fontSize: 15, fontWeight: 800 }}>{search}</span>
              <Icon name="chevron_down" size={16} />
            </div>
          </div>
        </div>
      </div>
      {/* Search Results Modal */}
      {showResults && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <div className="slide-up" style={{ background: "white", margin: "0 0", borderRadius: "0 0 24px 24px", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: PURPLE, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "white", fontSize: 17, fontWeight: 800 }}>Search Results</span>
              <button onClick={() => setShowResults(false)} style={{ background: "white", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="close" size={16} color={PURPLE} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {[
                { name: "Nena Dimagiba", role: "Manaratbat", rating: 4.5, count: 57 },
                { name: "Herma Dela Cruz", role: "Manaratbat, Tagaluto, etc.", rating: 4.2, count: 23 },
                { name: "Ma. Teresa Manaog", role: "Manaratbat, Caregiver", rating: 4.5, count: 2 },
                { name: "Julita Palacio", role: "Manaratbat, Manghihilot", rating: 3.0, count: 54 },
              ].map((t, i) => (
                <button key={i} onClick={() => nav("titaProfile")} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "white", border: "1px solid #f0e8ff", borderRadius: 16, marginBottom: 10, width: "100%", cursor: "pointer", textAlign: "left", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: LAVENDER, border: `3px solid ${PURPLE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                    {["👩", "👩‍🦱", "👵", "🧓"][i]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: PURPLE, fontSize: 16, fontWeight: 800, marginBottom: 2 }}>{t.name}</p>
                    <p style={{ color: "#888", fontSize: 12, fontStyle: "italic", marginBottom: 4 }}>{t.role}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Stars rating={t.rating} size={13} />
                      <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>{t.rating} ({t.count})</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// TITA PROFILE
const TitaProfileScreen = ({ nav }) => {
  const [tab, setTab] = useState("about");
  const tabs = ["about", "service", "ratings"];
  return (
    <div className="screen" style={{ background: "transparent", position: "relative" }}>
      {/* Blurred map bg */}
      <div style={{ position: "absolute", inset: 0, background: "#e8e4de", zIndex: 0, filter: "blur(2px) opacity(0.5)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", flexDirection: "column" }}>
        {/* Modal Card */}
        <div className="slide-up" style={{ background: "white", margin: "0 0", borderRadius: "0 0 24px 24px", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: PURPLE, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontStyle: "italic" }}>Viewing Tita's Profile</span>
            <button onClick={() => nav("map")} style={{ background: "white", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="close" size={16} color={PURPLE} />
            </button>
          </div>
          {/* Profile Header */}
          <div style={{ padding: "20px 20px 0", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: LAVENDER, border: `3px solid ${PURPLE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>👩</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: PURPLE, fontSize: 20, fontWeight: 900 }}>Nena Dimagiba</h2>
              <p style={{ color: "#888", fontStyle: "italic", fontSize: 14 }}>Manaratbat</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars rating={4.5} size={15} />
                <span style={{ color: "#666", fontSize: 13, fontWeight: 700 }}>4.5 (54)</span>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", padding: "16px 20px 0", gap: 0 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 4px", border: "none", background: tab === t ? PINK : PURPLE, color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer", borderRadius: t === "about" ? "50px 0 0 50px" : t === "ratings" ? "0 50px 50px 0" : 0, textTransform: "capitalize", transition: "all 0.2s" }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            {tab === "about" && (
              <div>
                <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Tita's Introduction</h3>
                <div style={{ background: "#111", borderRadius: 12, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="play" size={22} color="white" />
                  </div>
                </div>
                <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, textAlign: "justify", marginBottom: 20 }}>
                  Ako si Nena A. Dimagiba, isang manaratbat na taos-pusong nag-aalay ng panalangin at serbisyo bilang bahagi ng aking pananampalataya. Layunin kong maging daluyan ng pag-asa, kaginhawaan, at paggabay espiritwal sa aking kapwa habang tapat na naglilingkod sa Diyos at sa komunidad.
                </p>
                <button onClick={() => nav("hiring")} style={{ width: "100%", background: `linear-gradient(135deg, ${PURPLE}, #9B5CF6)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 18, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 15px rgba(124,58,237,0.4)" }}>
                  Hire Now
                </button>
              </div>
            )}
            {tab === "service" && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 8 }}>Services Offered</h4>
                  <span style={{ background: LAVENDER, color: PURPLE, padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 700 }}>Manaratbat</span>
                </div>
                <div style={{ height: 1, background: "#eee", marginBottom: 14 }} />
                <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 8 }}>Service Rate (per session)</h4>
                <p style={{ color: "#444", fontWeight: 700, marginBottom: 14 }}>Php 500.00</p>
                <div style={{ height: 1, background: "#eee", marginBottom: 14 }} />
                <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 12 }}>Work Schedule</h4>
                {[["Sundays", "Unavailable"], ["Mondays", "6:00 AM - 5:00 PM"], ["Tuesdays", "6:00 AM - 5:00 PM"], ["Wednesdays", "6:00 AM - 5:00 PM"], ["Thursdays", "6:00 AM - 5:00 PM"], ["Fridays", "6:00 AM - 5:00 PM"], ["Saturdays", "10:00 AM - 5:00 PM"]].map(([day, hrs]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <span style={{ color: LIGHT_PURPLE, fontSize: 13, fontWeight: 700 }}>{day}</span>
                    <span style={{ color: hrs === "Unavailable" ? "#DC2626" : "#444", fontSize: 13, fontWeight: 600 }}>{hrs}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: "#eee", margin: "14px 0" }} />
                <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 6 }}>Lead Time</h4>
                <p style={{ color: "#555", fontSize: 13, lineHeight: 1.6 }}>Please book at least <strong>4 hours</strong> before the expected service.</p>
                <p style={{ color: "#888", fontSize: 11, fontStyle: "italic", marginTop: 4 }}>This is in consideration of our tita's preparation time.</p>
                <button onClick={() => nav("hiring")} style={{ width: "100%", background: `linear-gradient(135deg, ${PURPLE}, #9B5CF6)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 18, fontWeight: 900, cursor: "pointer", marginTop: 20, boxShadow: "0 4px 15px rgba(124,58,237,0.4)" }}>Hire Now</button>
              </div>
            )}
            {tab === "ratings" && (
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {["All Reviews", "5 ⭐", "4 ⭐", "3 ⭐", "2 ⭐", "1 ⭐"].map((f, i) => (
                    <button key={i} style={{ background: i === 0 ? PURPLE : LAVENDER, color: i === 0 ? "white" : PURPLE, border: "none", borderRadius: 50, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{f}</button>
                  ))}
                </div>
                <p style={{ color: LIGHT_PURPLE, fontSize: 13, marginBottom: 14 }}>Viewing 57 Reviews</p>
                {[
                  { name: "N*** R*** S**e", stars: 5, comment: "I-hihire ko ulit si Nanay.", time: "12 months ago", likes: 12 },
                  { name: "A****** B****", stars: 5, comment: "Ang bait ni nanay grabe", time: "2 weeks ago", likes: 3 },
                  { name: "T****** S*****", stars: 4, comment: "I give 4 stars kasi ang tagal dumating ni nanay", time: "1 day ago", likes: 1 },
                  { name: "K****** K****", stars: 5, comment: "Niceeeee", time: "6 months ago", likes: 9 },
                  { name: "J*** D*** C***", stars: 5, comment: "Hire ulitttttt", time: "1 day ago", likes: 0 },
                ].map((r, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #f0e8ff", paddingBottom: 14, marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: LAVENDER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: PURPLE, fontSize: 13, fontWeight: 800 }}>{r.name}</span>
                          <Stars rating={r.stars} size={12} />
                        </div>
                        <p style={{ color: "#555", fontSize: 13, margin: "4px 0" }}>{r.comment}</p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#aaa", fontSize: 11 }}>{r.time}</span>
                          <span style={{ color: LIGHT_PURPLE, fontSize: 11, fontWeight: 700 }}>👍 {r.likes} Likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Bottom Search */}
        <div style={{ background: PURPLE, padding: "10px 16px 14px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => nav("map")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="back" size={18} />
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Shown in Map:</p>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "6px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                <span style={{ color: "white", fontSize: 14, fontWeight: 800 }}>Manaratbat</span>
                <Icon name="chevron_down" size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// HIRING
const HiringScreen = ({ nav }) => {
  const [date, setDate] = useState("October 10, 2025");
  const [time, setTime] = useState("10:00 AM");
  return (
    <div className="screen" style={{ background: LAVENDER }}>
      <div style={{ background: PURPLE, padding: "20px 20px 16px" }}>
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 900 }}>Hiring Page</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Please enter the necessary information.</p>
      </div>
      <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: LAVENDER, border: `3px solid ${PURPLE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative" }}>
              👩
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: "#22C55E", border: "2px solid white" }} />
            </div>
            <div>
              <h3 style={{ color: PURPLE, fontWeight: 900, fontSize: 17 }}>Nena Dimagiba</h3>
              <p style={{ color: "#888", fontSize: 13 }}>Tacloban City</p>
              <div style={{ display: "flex", gap: 4 }}>
                <Stars rating={4.5} size={12} />
                <span style={{ color: "#666", fontSize: 12, fontWeight: 700 }}>4.5 (54)</span>
              </div>
            </div>
          </div>
          {/* Service Selection */}
          <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 10 }}>Select a Service</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["Manaratbat"].map(s => (
              <div key={s} style={{ background: "#22C55E", color: "white", borderRadius: 50, padding: "8px 16px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✓</span>{s}
              </div>
            ))}
          </div>
          {/* Date & Time */}
          <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 12 }}>Select Date and Time of Service</h4>
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <span style={{ color: LIGHT_PURPLE, fontSize: 14, fontWeight: 700, minWidth: 40 }}>Date</span>
            <select value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1, background: LAVENDER, border: `1px solid ${LIGHT_PURPLE}`, borderRadius: 50, padding: "8px 16px", color: PURPLE, fontWeight: 700, fontSize: 13, outline: "none" }}>
              <option>October 10, 2025</option><option>October 11, 2025</option><option>October 12, 2025</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
            <span style={{ color: LIGHT_PURPLE, fontSize: 14, fontWeight: 700, minWidth: 40 }}>Time</span>
            <select value={time} onChange={e => setTime(e.target.value)} style={{ flex: 1, background: LAVENDER, border: `1px solid ${LIGHT_PURPLE}`, borderRadius: 50, padding: "8px 16px", color: PURPLE, fontWeight: 700, fontSize: 13, outline: "none" }}>
              <option>10:00 AM</option><option>11:00 AM</option><option>1:00 PM</option><option>3:00 PM</option>
            </select>
          </div>
          {/* Location */}
          <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 10 }}>Location of Service</h4>
          <div style={{ background: LAVENDER, borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ color: "#555", fontSize: 13, fontWeight: 600 }}>Brgy. 84, San Jose, Tacloban City</span>
            <Icon name="chevron_down" size={16} color={PURPLE} />
          </div>
          {/* Fees */}
          <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 12 }}>Fees</h4>
          <div style={{ background: PURPLE, borderRadius: 16, padding: 16, color: "white" }}>
            {[["Service Fee", "Php 500.00"], ["Distance Fee", "Php 12.00"], ["Platform Fee", "Php 30.00"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                <span style={{ opacity: 0.8 }}>{k}</span><span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 900, fontSize: 16 }}>Total Fee</span>
              <span style={{ fontWeight: 900, fontSize: 18 }}>Php 542.00</span>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button onClick={() => nav("titaProfile")} style={{ flex: 1, background: LAVENDER, color: PURPLE, border: "none", borderRadius: 50, padding: "16px", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>Cancel</button>
            <button onClick={() => nav("confirmation")} style={{ flex: 1, background: `linear-gradient(135deg, ${PINK}, #C026D3)`, color: "white", border: "none", borderRadius: 50, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 15px rgba(236,72,153,0.4)" }}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CONFIRMATION
const ConfirmationScreen = ({ nav }) => {
  const [confetti] = useState([...Array(20)].map((_, i) => ({ x: Math.random() * 100, delay: Math.random() * 1.5, color: ["#EC4899", "#7C3AED", "#FBBF24", "#22C55E", "#3B82F6"][i % 5] })));
  return (
    <div className="screen" style={{ background: PURPLE, justifyContent: "center", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {confetti.map((c, i) => (
        <div key={i} style={{ position: "absolute", top: "-10%", left: `${c.x}%`, width: 10, height: 10, borderRadius: 2, background: c.color, animation: `confetti 2.5s ${c.delay}s ease-in infinite` }} />
      ))}
      <button onClick={() => nav("home")} style={{ position: "absolute", top: 20, left: 20, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Icon name="close" size={18} />
      </button>
      <div className="slide-up" style={{ background: "white", borderRadius: 24, margin: "0 20px", padding: "30px 24px", width: "90%", maxWidth: 380, position: "relative", zIndex: 2 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#22C55E", margin: "-50px auto 20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(34,197,94,0.4)" }}>
          <Icon name="check" size={30} />
        </div>
        <h2 style={{ color: PURPLE, fontSize: 24, fontWeight: 900, textAlign: "center", marginBottom: 8 }}>You've Hired a Tita!</h2>
        <p style={{ color: "#888", fontSize: 14, textAlign: "center", marginBottom: 4 }}>You've Paid</p>
        <p style={{ color: PURPLE, fontSize: 36, fontWeight: 900, textAlign: "center", marginBottom: 20 }}><span style={{ fontSize: 18, verticalAlign: "middle" }}>PHP </span>542.00</p>
        <div style={{ borderTop: "1px solid #f0e8ff", paddingTop: 16, marginBottom: 16 }}>
          <h4 style={{ color: PURPLE, fontWeight: 800, marginBottom: 10 }}>Service Details:</h4>
          {[["Tita", "Nena Dimagiba"], ["Category", "Manaratbat"], ["Date", "October 10, 2025"], ["Time", "10:00 AM"], ["Location", "Brgy. 84, San Jose, Tacloban City"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ color: PURPLE, fontSize: 13, fontWeight: 800, minWidth: 70 }}>{k}:</span>
              <span style={{ color: "#555", fontSize: 13, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: LAVENDER, borderRadius: 16, padding: 14 }}>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>Transaction ID: TX8R5L9M2QW7D3KP</p>
          <p style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>Date & Time: October 8, 2025, 5:03 PM</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#888", fontSize: 12 }}>Paid By: Wallet</span>
            <span style={{ color: PURPLE, fontSize: 12, fontWeight: 800 }}>Balance: PHP 1515.50</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 48, marginTop: 20 }}>🎉</div>
    </div>
  );
};

// WALLET
const WalletScreen = ({ nav }) => (
  <div className="screen" style={{ background: PURPLE }}>
    <Header title="Wallet" onBack={() => nav("home")} />
    <div style={{ padding: "0 16px 16px", flex: 1, overflowY: "auto" }}>
      <div style={{ background: "white", borderRadius: 24, padding: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
        <p style={{ color: PINK, fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Balance:</p>
        <p style={{ color: PURPLE, fontSize: 38, fontWeight: 900, marginBottom: 4 }}>PHP 2045.50</p>
        <p style={{ color: PURPLE, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>Wallet ID: 390128093208901</p>
        {/* QR Code */}
        <div style={{ background: LAVENDER, borderRadius: 16, padding: 12, marginBottom: 24, border: `3px solid ${PURPLE}` }}>
          <div style={{ background: "white", borderRadius: 10, padding: 16 }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", maxWidth: 200, margin: "0 auto", display: "block" }}>
              {/* Simplified QR pattern */}
              <rect width="100" height="100" fill="white"/>
              {[...Array(10)].flatMap((_, r) => [...Array(10)].map((_, c) => {
                const pattern = ((r * 7 + c * 3 + r * c) % 3 === 0) || (r < 3 && c < 3) || (r < 3 && c > 6) || (r > 6 && c < 3);
                return pattern ? <rect key={`${r}-${c}`} x={c * 10} y={r * 10} width="10" height="10" fill="#1a1a1a"/> : null;
              }))}
              <rect x="0" y="0" width="30" height="30" fill="#1a1a1a" rx="2"/>
              <rect x="4" y="4" width="22" height="22" fill="white" rx="1"/>
              <rect x="8" y="8" width="14" height="14" fill="#1a1a1a" rx="1"/>
              <rect x="70" y="0" width="30" height="30" fill="#1a1a1a" rx="2"/>
              <rect x="74" y="4" width="22" height="22" fill="white" rx="1"/>
              <rect x="78" y="8" width="14" height="14" fill="#1a1a1a" rx="1"/>
              <rect x="0" y="70" width="30" height="30" fill="#1a1a1a" rx="2"/>
              <rect x="4" y="74" width="22" height="22" fill="white" rx="1"/>
              <rect x="8" y="78" width="14" height="14" fill="#1a1a1a" rx="1"/>
            </svg>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {[{ icon: "cash", label: "Cash-in" }, { icon: "transfer", label: "Fund Transfer" }, { icon: "history", label: "Transaction\nHistory" }].map(btn => (
            <button key={btn.label} style={{ flex: 1, background: "#F9F5FF", border: "none", borderRadius: 14, padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
              <Icon name={btn.icon} size={28} color={PINK} />
              <span style={{ color: "#555", fontSize: 11, fontWeight: 700, textAlign: "center", whiteSpace: "pre-line" }}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// CHAT
const ChatScreen = ({ nav }) => {
  const convos = [
    { name: "Nena Dimagiba", role: "Manaratbat", msg: "Damo nga salamat ha paghire ha....", time: "16min", online: true },
    { name: "Aling Sayo", role: "Labandera", msg: "Aadi na aq", time: "3 months", online: false },
    { name: "Alice Bungisngis", role: "Masahista", msg: "Salamat ineng", time: "8 months", online: true },
    { name: "Edna Dela Cruz", role: "Manikurista", msg: "Salamat anak", time: "9 months", online: false },
  ];
  return (
    <div className="screen" style={{ background: LAVENDER }}>
      <Header title="Chat" onBack={() => nav("home")} />
      <div style={{ padding: "0 16px", flex: 1, overflowY: "auto" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ background: LAVENDER, borderRadius: 50, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <input placeholder="Search conversations..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#555" }} />
            <Icon name="search" size={18} color={PINK} />
          </div>
          {convos.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < convos.length - 1 ? "1px solid #f5f0ff" : "none", cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: LAVENDER, border: `2px solid ${PURPLE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {["👩", "🧓", "👵", "👩‍🦱"][i]}
                </div>
                {c.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: "#22C55E", border: "2px solid white" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ color: PURPLE, fontWeight: 800, fontSize: 15 }}>{c.name}</span>
                  <span style={{ color: "#bbb", fontSize: 11 }}>·{c.time}</span>
                </div>
                <span style={{ background: LAVENDER, color: PURPLE, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 50, display: "inline-block", marginBottom: 3 }}>{c.role}</span>
                <p style={{ color: "#888", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 16px 16px", display: "flex", gap: 12 }}>
        <button style={{ flex: 1, background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 16, padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="5" stroke="#DC2626" strokeWidth="2"/><path d="M12 13v5M12 18h-2M12 18h2" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="8" r="1" fill="#DC2626"/></svg>
          <span style={{ color: "#DC2626", fontSize: 11, fontWeight: 700 }}>File a Complaint</span>
        </button>
        <button style={{ flex: 1, background: LAVENDER, border: `1px solid ${LIGHT_PURPLE}`, borderRadius: 16, padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <Icon name="support" size={28} color={PURPLE} />
          <span style={{ color: PURPLE, fontSize: 11, fontWeight: 700 }}>Chat Support</span>
        </button>
      </div>
    </div>
  );
};

// ORDERS
const OrdersScreen = ({ nav }) => {
  const [filter, setFilter] = useState("All");
  const orders = [
    { tx: "TX9M3D7K1W4F8B6HQ", cat: "Cooking", icon: "cooking", amount: "PHP 550.00", date: "8 October 2025, 7:00 PM", status: "Completed" },
    { tx: "TX4G8N2Q1VZ7R5LP", cat: "Prayer/Sabat", icon: "prayer", amount: "PHP 530.00", date: "8 October 2025, 5:03 PM", status: "Ongoing" },
    { tx: "TX2R9P5L8C1T7J3NW", cat: "Cleaning", icon: "cleaning", amount: "Gardening", date: "28 September 2025, 8:02 AM", status: "Cancelled" },
    { tx: "TX6B1Z4Q8M9D2F7VR", cat: "Massage", icon: "massage", amount: "PHP 560.00", date: "17 September 2025, 11:00 AM", status: "Completed" },
    { tx: "TX3K7L9W2N6R1H5QP", cat: "Cooking", icon: "cooking", amount: "PHP 1050.00", date: "16 September 2025, 12:34 PM", status: "Completed" },
    { tx: "TX5J2V8C4R9M1T6LB", cat: "Manicure/Pedicure", icon: "manicure", amount: "PHP 426.00", date: "11 September 2025, 9:34 AM", status: "Cancelled" },
    { tx: "TX7D4Q1Z9L3K8P2FW", cat: "Clothes Ironing", icon: "iron", amount: "PHP 634.00", date: "7 September 2025, 2:34 PM", status: "Completed" },
  ];
  const statusColor = { Completed: "#22C55E", Ongoing: "#3B82F6", Cancelled: "#DC2626" };
  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);
  return (
    <div className="screen" style={{ background: LAVENDER }}>
      <Header title="Orders" onBack={() => nav("home")} />
      <div style={{ padding: "0 16px", flex: 1, overflowY: "auto" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ background: LAVENDER, borderRadius: 50, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <input placeholder="Search orders..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14 }} />
            <Icon name="search" size={18} color={PINK} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["All", "Ongoing", "Completed", "Cancelled"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, background: filter === f ? PURPLE : LAVENDER, color: filter === f ? "white" : PURPLE, border: "none", borderRadius: 50, padding: "8px 4px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{f}</button>
            ))}
          </div>
          {filtered.map((o, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px", background: "#fdfaff", borderRadius: 14, marginBottom: 10, border: "1px solid #f0e8ff" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: LAVENDER, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={o.icon} size={26} color={PINK} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ color: PURPLE, fontSize: 11, fontWeight: 800 }}>ID: {o.tx.slice(0, 14)}</span>
                  <span style={{ color: statusColor[o.status], fontSize: 11, fontWeight: 900, fontStyle: "italic" }}>{o.status}</span>
                </div>
                <p style={{ color: "#444", fontSize: 12, fontWeight: 700 }}>Category: {o.cat}</p>
                <p style={{ color: "#666", fontSize: 11 }}>Amount: {o.amount}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <span style={{ color: "#999", fontSize: 10 }}>{o.date}</span>
                  <button style={{ background: PURPLE, color: "white", border: "none", borderRadius: 50, padding: "4px 14px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Rate</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ACCOUNT
const AccountScreen = ({ nav }) => {
  const [isTita] = useState(true);
  return (
    <div className="screen" style={{ background: PURPLE }}>
      <Header title="Account" onBack={() => nav("home")} />
      <div style={{ padding: "0 16px 16px", flex: 1, overflowY: "auto" }}>
        {/* Personal Info */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: PINK, fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 16 }}>Personal Information</h3>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 76, height: 76, borderRadius: "50%", background: LAVENDER, border: `3px solid ${PURPLE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>👵</div>
              <button style={{ position: "absolute", bottom: 0, right: 0, background: PINK, border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="edit" size={12} />
              </button>
            </div>
            <div style={{ flex: 1 }}>
              {[["First Name", "Juana"], ["Middle Name", "Alos"], ["Last Name", "Dela Cruz"], ["Age", "56"], ["Address", "Llorente, E. Samar"], ["Gender", "Woman"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ color: PINK, fontSize: 11, fontWeight: 800 }}>{k}:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#666", fontSize: 11 }}>{v}</span>
                    <Icon name="edit" size={12} color={LIGHT_PURPLE} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Account Info */}
        <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: PINK, fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 16 }}>Account Information</h3>
          {[["Phone", "09237231436"], ["Email", "j_dcruz@gmail.com"], ["Login Password", "must be updated regularly"], ["Recovery Email", "j1_delacruz@gmail.com"], ["Account ID", "849205371642"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #faf5ff" }}>
              <span style={{ color: PINK, fontSize: 12, fontWeight: 800 }}>{k}:</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: k === "Login Password" ? "#999" : "#666", fontSize: 11, fontStyle: k === "Login Password" ? "italic" : "normal" }}>{v}</span>
                {k !== "Account ID" && <Icon name="edit" size={12} color={LIGHT_PURPLE} />}
              </div>
            </div>
          ))}
        </div>
        {/* Tita Info or CTA */}
        {isTita ? (
          <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: PINK, fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 16 }}>Tita Information</h3>
            {["Services Offered", "Service Rate", "Work Hours", "Valid IDs", "Tita's Bio", "Tita's Video Introduction"].map(item => (
              <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #faf5ff" }}>
                <span style={{ color: PINK, fontSize: 13, fontWeight: 800 }}>{item}</span>
                <Icon name="edit" size={14} color={LIGHT_PURPLE} />
              </div>
            ))}
            <button onClick={() => nav("commission")} style={{ width: "100%", background: `linear-gradient(135deg, ${PURPLE}, #9B5CF6)`, color: "white", border: "none", borderRadius: 50, padding: "14px", fontSize: 15, fontWeight: 900, cursor: "pointer", marginTop: 16 }}>
              Manage Commissions
            </button>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 20, padding: 24, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: PURPLE, fontSize: 16, fontWeight: 900, marginBottom: 16 }}>Want to work with GoTita?</h3>
            <button style={{ background: PURPLE, color: "white", border: "none", borderRadius: 50, padding: "14px 32px", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>Be a Tita Now!</button>
            <div style={{ fontSize: 48, marginTop: 12 }}>🙌</div>
          </div>
        )}
      </div>
    </div>
  );
};

// COMMISSION
const CommissionScreen = ({ nav }) => {
  const [accepting, setAccepting] = useState(true);
  return (
    <div className="screen" style={{ background: PURPLE }}>
      <div style={{ background: PURPLE, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => nav("account")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="back" size={20} />
        </button>
        <Icon name="briefcase" size={26} />
      </div>
      <div style={{ padding: "0 16px 16px", flex: 1 }}>
        <div style={{ background: "white", borderRadius: 24, overflow: "hidden", padding: "0 0 30px" }}>
          {/* Bunting */}
          <div style={{ padding: "16px 10px 10px", background: "linear-gradient(to right, #fef9c3, #fce7f3)", display: "flex", gap: 6, justifyContent: "center" }}>
            {["🔴", "🟡", "🟢", "🔵", "🟣", "🔴", "🟡", "🟢", "🔵"].map((c, i) => <span key={i} style={{ fontSize: 12 }}>{c}</span>)}
          </div>
          <div style={{ padding: "30px 24px 20px", textAlign: "center" }}>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 900, lineHeight: 1.4, marginBottom: 24 }}>
              {accepting ? "You are accepting commissions right now" : "Sometimes you need to rest"}
            </h2>
            {/* Toggle */}
            <div onClick={() => setAccepting(!accepting)} style={{ display: "inline-flex", background: LAVENDER, border: `2px solid ${PURPLE}`, borderRadius: 50, padding: 4, cursor: "pointer", marginBottom: 24 }}>
              <div style={{ width: 80, height: 36, borderRadius: 50, display: "flex", alignItems: "center", justifyContent: accepting ? "flex-end" : "flex-start", transition: "all 0.3s", padding: "0 4px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: accepting ? "#22C55E" : PURPLE, boxShadow: "0 3px 10px rgba(0,0,0,0.2)", transition: "all 0.3s", transform: accepting ? "translateX(44px)" : "translateX(0)" }} />
              </div>
            </div>
            <div style={{ fontSize: 80 }}>🙌</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
const NAV_SCREENS = ["home", "titahome", "wallet", "chat", "account", "orders", "commission"];

export default function GoTitaApp() {
  const [screen, setScreen] = useState("splash");
  const [role, setRole] = useState("customer"); // "customer" | "tita"
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [customerNotifs, setCustomerNotifs] = useState(CUSTOMER_NOTIFS);
  const [titaNotifs, setTitaNotifs] = useState(TITA_NOTIFS);

  const notifications    = role === "tita" ? titaNotifs    : customerNotifs;
  const setNotifications = role === "tita" ? setTitaNotifs : setCustomerNotifs;
  const unreadCount      = notifications.filter(n => n.unread).length;

  const nav = (s) => {
    if (s === "titahome") setRole("tita");
    if (s === "home")     setRole("customer");
    if (s === "signupTitaDone")    { setRole("tita");     setScreen("titahome"); return; }
    if (s === "signupCustomerDone"){ setRole("customer"); setScreen("home");     return; }
    setScreen(s);
    setMenuOpen(false);
    setNotifOpen(false);
  };

  const showNav = NAV_SCREENS.includes(screen);

  const renderScreen = () => {
    const bellProps = { onBellOpen: () => setNotifOpen(true), unreadCount };
    switch (screen) {
      case "splash":       return <SplashScreen nav={nav} />;
      case "login":        return <LoginScreen nav={nav} setRole={setRole} />;
      case "signup":       return <SignupScreen nav={nav} />;
      case "signupCustomer": return <CustomerSignupScreen nav={nav} />;
      case "signupTita":   return <TitaSignupScreen nav={nav} />;
      case "home":         return <HomeScreen nav={nav} onMenuOpen={() => setMenuOpen(true)} {...bellProps} />;
      case "titahome":     return <TitaHomeScreen nav={nav} onMenuOpen={() => setMenuOpen(true)} {...bellProps} />;
      case "map":          return <MapScreen nav={nav} />;
      case "titaProfile":  return <TitaProfileScreen nav={nav} />;
      case "hiring":       return <HiringScreen nav={nav} />;
      case "confirmation": return <ConfirmationScreen nav={nav} />;
      case "wallet":       return <WalletScreen nav={nav} />;
      case "chat":         return <ChatScreen nav={nav} />;
      case "orders":       return <OrdersScreen nav={nav} />;
      case "account":      return <AccountScreen nav={nav} />;
      case "commission":   return <CommissionScreen nav={nav} />;
      default:             return <HomeScreen nav={nav} onMenuOpen={() => setMenuOpen(true)} {...bellProps} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ position: "relative" }}>
        {/* Phone shell */}
        <div style={{ width: 360, height: 800, borderRadius: 40, background: "#0d0d1a", boxShadow: "0 0 0 2px #2a2a4a, 0 0 60px rgba(124,58,237,0.4), 0 30px 80px rgba(0,0,0,0.6)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Status bar */}
          <div style={{ background: "#0d0d1a", padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 800 }}>9:41</span>
            <div style={{ width: 80, height: 14, background: "#0d0d1a", borderRadius: 10, border: "1.5px solid #2a2a4a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 40, height: 6, background: "#1a1a2e", borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><rect x="0" y="4" width="2" height="6" rx="1" fill="rgba(255,255,255,0.7)"/><rect x="3" y="2.5" width="2" height="7.5" rx="1" fill="rgba(255,255,255,0.7)"/><rect x="6" y="1" width="2" height="9" rx="1" fill="rgba(255,255,255,0.7)"/><rect x="9" y="0" width="2" height="10" rx="1" fill="rgba(255,255,255,0.7)"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="rgba(255,255,255,0.7)"><path d="M7 1C4.5 1 2.3 2 0.8 3.6L2.2 5C3.4 3.8 5.1 3 7 3s3.6.8 4.8 2L13.2 3.6C11.7 2 9.5 1 7 1zM7 5c-1.4 0-2.6.5-3.5 1.4L4.9 7.8C5.5 7.3 6.2 7 7 7s1.5.3 2.1.8L10.5 6.4C9.6 5.5 8.4 5 7 5zM7 9l1.4 1.4L7 12l-1.4-1.6L7 9z"/></svg>
              <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                <div style={{ width: 20, height: 10, border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 3, position: "relative", display: "flex", alignItems: "center", padding: "0 2px" }}>
                  <div style={{ width: "75%", height: 6, background: "#22C55E", borderRadius: 1 }} />
                  <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, background: "rgba(255,255,255,0.5)", borderRadius: 1 }} />
                </div>
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="phone-wrap">
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
              {renderScreen()}
              <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} role={role} notifications={notifications} setNotifications={setNotifications} />
              <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} nav={nav} role={role} />
            </div>
            {showNav && <BottomNav active={screen} onNav={nav} role={role} />}
          </div>

          {/* Home indicator */}
          <div style={{ background: "#0d0d1a", padding: "8px 0 10px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 100, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </>
  );
}