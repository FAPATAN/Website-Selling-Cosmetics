import API_URL from '../../config';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = `${API_URL}/api/admin`;
const STATUS_LABEL = { O: "สร้างรายการสั่งซื้อ", P: "รอตรวจสอบ", A: "ยืนยันคำสั่งซื้อ", S: "จัดส่งสินค้าแล้ว", R: "ถึงผู้รับแล้ว", C: "เสร็จเรียบร้อย", Ca: "ยกเลิกคำสั่งซื้อ" };

const navItems = [
  { iconSrc: "/Dashboard.png",   label: "Dashboard",   path: "/admin" },
  { iconSrc: "/Orders.png",      label: "Orders",      path: "/admin/orders" },
  { iconSrc: "/Products.png",    label: "Products",    path: "/admin/products" },
  { iconSrc: "/Promotions.png",  label: "Promotions",  path: "/admin/promotions" },
  { iconSrc: "/price_range.png", label: "Price Range", path: "/admin/price-ranges" },
  { iconSrc: "/Members.png",     label: "Members",     path: "/admin/users" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
  :root {
    --bg: #f0f0ec; --sidebar-bg: #e8e8e4; --card-bg: #ffffff;
    --accent: #FFC2D1; --accent-dark: #ffaabf;
    --text-primary: #1a1a1a; --text-secondary: #6b6b6b; --text-muted: #9a9a9a;
    --border: rgba(0,0,0,0.08); --shadow: 0 2px 16px rgba(0,0,0,0.06);
    --radius: 16px; --radius-sm: 10px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .sd-app { display: flex; height: 100vh; background: var(--bg); font-family: 'Sora', sans-serif; color: var(--text-primary); }
  .sd-sidebar { width: 200px; background: var(--sidebar-bg); display: flex; flex-direction: column; padding: 24px 16px; gap: 4px; flex-shrink: 0; }
  .sd-logo { display: flex; flex-direction: column; padding: 8px 12px 24px; }
  .sd-logo-romd { font-family: 'Georgia','Times New Roman',serif; font-size: 28px; font-weight: 100; letter-spacing: 1.5px; color: #333333; line-height: 1; text-transform: lowercase; }
  .sd-logo-tagline { font-size: 7.5px; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); margin-top: 3px; }
  .sd-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s ease; border: none; background: none; text-align: left; width: 100%; }
  .sd-nav-item:hover { background: rgba(0,0,0,0.05); color: var(--text-primary); }
  .sd-nav-item.active { background: #FFC2D1; color: var(--text-primary); font-weight: 600; }
  .sd-nav-icon{width:20px;height:20px;object-fit:contain;flex-shrink:0;opacity:0.7;transition:opacity .15s;}
  .sd-nav-item:hover .sd-nav-icon{opacity:1;}
  .sd-nav-item.active .sd-nav-icon{opacity:1;filter:brightness(0) invert(1);}
  .sd-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .sd-topbar { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px 32px 20px; }
  .sd-topbar-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
  .sd-topbar-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
  .sd-topbar-actions { display: flex; align-items: center; gap: 8px; }
  .sd-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#f093fb,#f5576c); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; cursor: pointer; position: relative; }
  .sd-avatar-dot { position: absolute; bottom: 2px; right: 2px; width: 8px; height: 8px; background: #2ed573; border-radius: 50%; border: 2px solid var(--bg); }
  .sd-content { flex: 1; padding: 0 24px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }
  .sd-stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .sd-stat-card { border-radius: 18px; padding: 22px 22px 20px; display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07); transition: transform .18s, box-shadow .18s; cursor: default; border: 1px solid rgba(0,0,0,0.05); }
  .sd-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.11); }
  .sd-stat-card::after { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 4px; border-radius: 18px 0 0 18px; }
  .sd-stat-card-pink::after   { background: linear-gradient(180deg, #ff6b9d, #ffaabf); }
  .sd-stat-card-blue::after   { background: linear-gradient(180deg, #4a90d9, #74b3f0); }
  .sd-stat-card-green::after  { background: linear-gradient(180deg, #27ae60, #58d68d); }
  .sd-stat-card-yellow::after { background: linear-gradient(180deg, #f39c12, #f8c471); }
  .sd-stat-card-pink   { background: #ffe4ef; }
  .sd-stat-card-blue   { background: #dbeeff; }
  .sd-stat-card-green  { background: #d6f5e3; }
  .sd-stat-card-yellow { background: #fff3c4; }
  .sd-stat-blob { display: none; }
  .sd-stat-blob-pink   {}
  .sd-stat-blob-blue   {}
  .sd-stat-blob-green  {}
  .sd-stat-blob-yellow {}
  .sd-stat-top { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .sd-stat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .sd-stat-card-pink   .sd-stat-icon { background: #fff0f5; }
  .sd-stat-card-blue   .sd-stat-icon { background: #eff6ff; }
  .sd-stat-card-green  .sd-stat-icon { background: #f0faf4; }
  .sd-stat-card-yellow .sd-stat-icon { background: #fffbf0; }
  .sd-stat-icon img { width: 22px; height: 22px; object-fit: contain; }
  .sd-stat-pill { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; padding: 3px 10px; border-radius: 20px; }
  .sd-stat-card-pink   .sd-stat-pill { background: #fff0f5; color: #e0527e; }
  .sd-stat-card-blue   .sd-stat-pill { background: #eff6ff; color: #2f7ec7; }
  .sd-stat-card-green  .sd-stat-pill { background: #f0faf4; color: #1e8449; }
  .sd-stat-card-yellow .sd-stat-pill { background: #fffbf0; color: #d68910; }
  .sd-stat-val { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: var(--text-primary); position: relative; z-index: 1; }
  .sd-stat-label { font-size: 12.5px; color: rgba(0,0,0,0.4); font-weight: 500; position: relative; z-index: 1; }
  .sd-section-card { background: var(--card-bg); border-radius: var(--radius); box-shadow: var(--shadow); }
  .sd-section-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; }
  .sd-section-title { font-size: 15px; font-weight: 700; letter-spacing: -0.3px; }
  .sd-see-all { font-size: 12px; font-weight: 600; color: var(--text-muted); border: 1px solid var(--border); background: var(--bg); padding: 6px 14px; border-radius: 20px; cursor: pointer; font-family: 'Sora',sans-serif; transition: all 0.15s; }
  .sd-see-all:hover { background: #eee; color: var(--text-primary); }
  .sd-table-wrap { overflow-y: auto; max-height: 320px; padding: 0 24px 20px; border-radius: 0 0 var(--radius) var(--radius); }
  .sd-table-wrap::-webkit-scrollbar { width: 4px; }
  .sd-table-wrap::-webkit-scrollbar-track { background: transparent; }
  .sd-table-wrap::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
  .sd-table-wrap::-webkit-scrollbar-thumb:hover { background: #bbb; }
  .sd-table-wrap thead th { position: sticky; top: 0; z-index: 1; background: var(--bg); }
  .sd-table-wrap table { width: 100%; border-collapse: collapse; }
  .sd-table-wrap thead th { text-align: center; font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; background: var(--bg); }
  .sd-table-wrap thead th:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
  .sd-table-wrap thead th:last-child  { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
  .sd-table-wrap tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .sd-table-wrap tbody tr:last-child { border-bottom: none; }
  .sd-table-wrap tbody td { padding: 12px; font-size: 13px; color: var(--text-primary); text-align: center; }
  .sd-td-id { font-family: 'JetBrains Mono',monospace; font-size: 12px; color: var(--text-muted); }
  .sd-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .sd-badge-O  { background: #f0f4ff; color: #5c6bc0; }
  .sd-badge-P  { background: #fff8e1; color: #f39c12; }
  .sd-badge-A  { background: #e0f0ff; color: #2980b9; }
  .sd-badge-S  { background: #e0faf5; color: #00bfa2; }
  .sd-badge-R  { background: #f3e5ff; color: #7b52c9; }
  .sd-badge-C  { background: #e6f9ec; color: #1e8449; }
  .sd-badge-Ca { background: #ffe0e0; color: #c0392b; }
  .sd-slip-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 8px; border: 1px solid var(--border); background: none; font-size: 12px; cursor: pointer; color: var(--text-secondary); transition: all .15s; font-family: 'Sora',sans-serif; }
  .sd-slip-btn:hover { background: #f0f8ff; border-color: #9DCAEB; color: #2980b9; }
  .sd-empty { text-align: center; padding: 32px; font-size: 14px; color: var(--text-muted); }
  .sd-loading { text-align: center; padding: 48px; font-size: 14px; color: var(--text-muted); }
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
  .sd-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; cursor: pointer; backdrop-filter: blur(4px); }
  .sd-lightbox img { max-width: 80vw; max-height: 80vh; border-radius: var(--radius); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
  .sd-rev-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .sd-rev-card { background: var(--card-bg); border-radius: var(--radius); box-shadow: var(--shadow); padding: 20px 22px; display: flex; flex-direction: column; gap: 6px; position: relative; overflow: hidden; }
  .sd-rev-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px; }
  .sd-rev-card-week::before  { background: #a29bfe; }
  .sd-rev-card-month::before { background: #fd79a8; }
  .sd-rev-card-year::before  { background: #fdcb6e; }
  .sd-rev-period { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--text-muted); }
  .sd-rev-amount { font-size: 26px; font-weight: 800; letter-spacing: -1px; color: var(--text-primary); }
  .sd-rev-sub { font-size: 12px; color: var(--text-muted); }
  .sd-rev-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .sd-rev-picker { font-size: 12px; font-family: 'Sora',sans-serif; border: 1px solid var(--border); border-radius: 8px; padding: 4px 8px; background: rgba(255,255,255,0.7); color: var(--text-primary); cursor: pointer; outline: none; max-width: 140px; }
  .sd-rev-picker:focus { border-color: #a29bfe; }
  .sd-rev-chart { margin-top: 12px; }
  .sd-rev-trend { font-size: 11px; font-weight: 700; margin-left: 8px; }
  .sd-rev-trend-up   { color: #27ae60; }
  .sd-rev-trend-down { color: #e74c3c; }
  .sd-rev-trend-flat { color: #95a5a6; }
  .sd-chart-tooltip { position: absolute; background: #1a1a1a; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; pointer-events: none; white-space: nowrap; transform: translateX(-50%); z-index: 10; }
  .sd-chart-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 4px solid transparent; border-top-color: #1a1a1a; }
`;

function MiniBarChart({ data, refLabel, color, onBarClick }) {
  const [tooltip, setTooltip] = React.useState(null);
  if (!data || data.length === 0) return <div style={{height:110,display:'flex',alignItems:'center',justifyContent:'center',color:'#ccc',fontSize:12}}>ยังไม่มีข้อมูล</div>;
  const hasAny = data.some(d => d.revenue > 0);
  if (!hasAny) return <div style={{height:110,display:'flex',alignItems:'center',justifyContent:'center',color:'#ccc',fontSize:12}}>ยังไม่มีข้อมูล</div>;
  const max = Math.max(...data.map(d => d.revenue), 1);
  const n = data.length;
  const VW = 300, BAR_H = 80, LABEL_H = 22, TOP_PAD = 20;
  const TOTAL_H = BAR_H + LABEL_H + TOP_PAD;
  const BAR_W = Math.floor((VW - 20) / n * 0.55);
  const SLOT = Math.floor((VW - 20) / n);
  const OFFSET = 10;
  const fmtLabel = (label) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
      const d = new Date(label + 'T12:00:00');
      const days = ['อา','จ','อ','พ','พฤ','ศ','ส'];
      return days[d.getDay()] + '.' + d.getDate();
    }
    if (/^\d{4}-W\d{2}$/.test(label)) return 'W' + label.split('-W')[1];
    if (/^\d{4}-\d{2}$/.test(label)) {
      const [, m] = label.split('-');
      return ['ม.ค','ก.พ','มี.ค','เม.ย','พ.ค','มิ.ย','ก.ค','ส.ค','ก.ย','ต.ค','พ.ย','ธ.ค'][parseInt(m)-1] || m;
    }
    return String(parseInt(label) + 543);
  };
  const fmtVal = (v) => v >= 10000 ? (v/1000).toFixed(1) + 'k' : v >= 1000 ? (v/1000).toFixed(1) + 'k' : String(v);
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {tooltip && (
        <div className="sd-chart-tooltip" style={{ left: `${(tooltip.cx / VW) * 100}%`, top: tooltip.ty }}>
          ฿{Number(tooltip.v).toLocaleString()}
        </div>
      )}
      <svg viewBox={`0 0 ${VW} ${TOTAL_H}`} width="100%" height={TOTAL_H} style={{ display: 'block', overflow: 'visible' }}>
        {/* Y-axis guide lines */}
        {[0.25,0.5,0.75,1].map(f => (
          <line key={f}
            x1={OFFSET} y1={TOP_PAD + BAR_H - f * BAR_H}
            x2={VW - OFFSET} y2={TOP_PAD + BAR_H - f * BAR_H}
            stroke="#f0f0f0" strokeWidth={1}
          />
        ))}
        {data.map((d, i) => {
          const bh = Math.max(4, (d.revenue / max) * BAR_H);
          const active = d.label === refLabel;
          const cx = OFFSET + i * SLOT + SLOT / 2;
          const bx = cx - BAR_W / 2;
          const by = TOP_PAD + BAR_H - bh;
          return (
            <g key={i}
              onMouseEnter={() => setTooltip({ cx, ty: by - 28, v: d.revenue })}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => onBarClick && onBarClick(d.label)}
              style={{ cursor: onBarClick ? 'pointer' : 'default' }}
            >
              <rect x={bx} y={by} width={BAR_W} height={bh} rx={5}
                fill={active ? color : '#bdbdbd'}
              />
              <text x={cx} y={by - 5} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={active ? color : 'transparent'}>
                {fmtVal(d.revenue)}
              </text>
              <text x={cx} y={TOP_PAD + BAR_H + LABEL_H - 4} textAnchor="middle"
                fontSize={10} fontWeight={active ? 700 : 400} fill={active ? '#333' : '#bbb'}>
                {fmtLabel(d.label)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Trend({ history }) {
  if (!history || history.length < 2) return null;
  const cur = history[history.length - 1]?.revenue ?? 0;
  const prev = history[history.length - 2]?.revenue ?? 0;
  if (prev === 0 && cur === 0) return null;
  if (prev === 0) return null;
  const pct = Math.round((cur - prev) / prev * 100);
  if (pct === 0) return null;
  return null;
}


export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const memberId = sessionStorage.getItem("admin_Member_id") || sessionStorage.getItem("Member_id");
  const [adminName, setAdminName] = useState("");
  const avatarLetter = adminName ? adminName.charAt(0).toUpperCase() : "A";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [periodRevs, setPeriodRevs] = useState({ week: 0, month: 0, year: 0 });
  const [topSpenders, setTopSpenders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const nowDate = new Date();
  const getISOWeek = (d) => {
    const tmp = new Date(d); tmp.setHours(0,0,0,0);
    tmp.setDate(tmp.getDate() + 3 - (tmp.getDay() + 6) % 7);
    const w1 = new Date(tmp.getFullYear(), 0, 4);
    const wk = 1 + Math.round(((tmp - w1) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
    return `${tmp.getFullYear()}-W${String(wk).padStart(2, '0')}`;
  };
  const todayWeek  = getISOWeek(nowDate);
  const todayMonth = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}`;
  const todayYear  = String(nowDate.getFullYear());
  const todayDate  = `${nowDate.getFullYear()}-${String(nowDate.getMonth()+1).padStart(2,'0')}-${String(nowDate.getDate()).padStart(2,'0')}`;

  const [weekVal,  setWeekVal]  = useState(todayWeek);
  const [monthVal, setMonthVal] = useState(todayMonth);
  const [yearVal,  setYearVal]  = useState(todayYear);
  const yearOptions = Array.from({ length: 6 }, (_, i) => nowDate.getFullYear() - i);

  const [weekHistory,  setWeekHistory]  = useState([]);
  const [monthHistory, setMonthHistory] = useState([]);
  const [yearHistory,  setYearHistory]  = useState([]);
  const [weekDrillDay, setWeekDrillDay] = useState(null);
  const [dayHistory,   setDayHistory]   = useState([]);

  const getLastNMonths = (ref, n) => {
    const [yr, mo] = ref.split('-').map(Number);
    return Array.from({ length: n }, (_, i) => {
      let m = mo - (n - 1 - i), y = yr;
      while (m <= 0) { m += 12; y--; }
      return `${y}-${String(m).padStart(2, '0')}`;
    });
  };
  const getLastNYears = (ref, n) => {
    const y = parseInt(ref);
    return Array.from({ length: n }, (_, i) => String(y - (n - 1 - i)));
  };
  const getLastNWeeks = (ref, n) => {
    const [yrStr, wStr] = ref.split('-W');
    const yr = parseInt(yrStr), wk = parseInt(wStr);
    const jan4 = new Date(yr, 0, 4);
    const dow = (jan4.getDay() + 6) % 7;
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - dow + (wk - 1) * 7);
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() - (n - 1 - i) * 7);
      return getISOWeek(d);
    });
  };
  const fillGaps = (labels, apiData) => {
    const map = {};
    apiData.forEach(d => { map[d.label] = d.revenue; });
    return labels.map(label => ({ label, revenue: map[label] || 0 }));
  };
  const getWeekDays = (weekRef) => {
    const [yrStr, wStr] = weekRef.split('-W');
    const yr = parseInt(yrStr), wk = parseInt(wStr);
    const jan4 = new Date(yr, 0, 4);
    const dow = (jan4.getDay() + 6) % 7;
    const monday = new Date(yr, 0, 4 - dow + (wk - 1) * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${mm}-${dd}`;
    });
  };

  const fetchHistory = async (type, ref) => {
    try {
      const r = await fetch(`${API}/revenue/history?type=${type}&ref=${ref}`, { headers: { 'x-member-id': memberId } });
      const d = await r.json();
      const apiData = d.history || [];
      if (type === 'week') {
        setWeekHistory(fillGaps(getLastNWeeks(ref, 6), apiData));
      } else if (type === 'month') {
        setMonthHistory(fillGaps(getLastNMonths(ref, 6), apiData));
      } else {
        setYearHistory(fillGaps(getLastNYears(ref, 5), apiData));
      }
    } catch {}
  };

  useEffect(() => {
    if (stats) {
      setPeriodRevs({ week: Number(stats.revenueWeek ?? 0), month: Number(stats.revenueMonth ?? 0), year: Number(stats.revenueYear ?? 0) });
      fetchHistory('week', weekVal);
      fetchHistory('month', monthVal);
      fetchHistory('year', yearVal);
    }
  }, [stats]);

  const fetchRevenue = async (type, val, key) => {
    try {
      const param = type === 'week' ? `week=${val}` : type === 'month' ? `month=${val}` : `year=${val}`;
      const r = await fetch(`${API}/revenue?type=${type}&${param}`, { headers: { 'x-member-id': memberId } });
      const d = await r.json();
      setPeriodRevs(p => ({ ...p, [key]: Number(d.revenue ?? 0) }));
      fetchHistory(type, val);
    } catch {}
  };
  const fetchDayHistory = async (weekRef) => {
    try {
      const days = getWeekDays(weekRef);
      const start = days[0];
      const end   = days[6];
      const r = await fetch(`${API}/revenue/history?type=day&start=${start}&end=${end}`, { headers: { 'x-member-id': memberId } });
      const d = await r.json();
      setDayHistory(fillGaps(days, d.history || []));
    } catch {}
  };

  useEffect(() => {
    if (!memberId) return;
    fetch(`${API}/members/${memberId}`, { headers: { "x-member-id": memberId } })
      .then(r => r.json())
      .then(d => { if (d.Username || d.Name) setAdminName(d.Name || d.Username); })
      .catch(() => {});
  }, [memberId]);

  useEffect(() => {
    fetch(`${API}/dashboard`, { headers: { "x-member-id": memberId } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [memberId]);

  useEffect(() => {
    if (!memberId) return;
    fetch(`${API}/top-spenders`, { headers: { 'x-member-id': memberId } })
      .then(r => r.json()).then(d => setTopSpenders(d.topSpenders || [])).catch(() => {});
    fetch(`${API}/top-products`, { headers: { 'x-member-id': memberId } })
      .then(r => r.json()).then(d => setTopProducts(d.topProducts || [])).catch(() => {});
  }, [memberId]);

  return (
    <>
      <style>{styles}</style>
      <div className="sd-app">
        {/* Sidebar */}
        <aside className="sd-sidebar">
          <div className="sd-logo">
            <div className="sd-logo-romd">rom&amp;nd</div>
            <div className="sd-logo-tagline"></div>
          </div>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`sd-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.iconSrc ? <img src={item.iconSrc} alt={item.label} className="sd-nav-icon" /> : <span style={{width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>🏷️</span>}
              {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            className="sd-nav-item"
            onClick={() => { sessionStorage.clear(); window.location.href = "/"; }}
          >
            <img src="/logout.png" alt="Logout" className="sd-nav-icon" />
            Logout
          </button>
        </aside>

        {/* Main */}
        <div className="sd-main">
          <div className="sd-topbar">
            <div>
              <div className="sd-topbar-title">Dashboard</div>
              <div className="sd-topbar-sub"></div>
            </div>
            <div className="sd-topbar-actions">
              <div className="sd-avatar">
                {avatarLetter}<div className="sd-avatar-dot" />
              </div>
            </div>
          </div>

          <div className="sd-content">
            {loading ? (
              <div className="sd-loading">Loading...</div>
            ) : (
              <>
                {/* Top Spenders & Best Sellers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Top Spenders */}
                  <div className="sd-section-card">
                    <div className="sd-section-head">
                      <div className="sd-section-title"> Top Spenders</div>
                      <button className="sd-see-all" onClick={() => navigate("/admin/users", { state: { filterRole: 'Top Spenders' } })}>View All →</button>
                    </div>
                    {!topSpenders.length ? (
                      <div className="sd-empty">No data available</div>
                    ) : (
                      <div className="sd-table-wrap">
                        <table>
                          <thead><tr>
                            <th>#</th><th>Name</th><th>Email</th><th>Orders</th><th>Total</th>
                          </tr></thead>
                          <tbody>
                            {topSpenders.map((m, i) => (
                              <tr key={m.MemberID}>
                                <td style={{ fontWeight: 700, color: ['#f39c12','#95a5a6','#cd7f32','#999','#999'][i] }}>#{i + 1}</td>
                                <td>{m.Name} {m.Surname}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{m.Email}</td>
                                <td>{m.order_count}</td>
                                <td style={{ fontWeight: 700 }}>฿{Number(m.total_spent).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Best Selling Products */}
                  <div className="sd-section-card">
                    <div className="sd-section-head">
                      <div className="sd-section-title"> Best Selling Products</div>
                      <button className="sd-see-all" onClick={() => navigate("/admin/products", { state: { category: 'best' } })}>View All →</button>
                    </div>
                    {!topProducts.length ? (
                      <div className="sd-empty">No data available</div>
                    ) : (
                      <div className="sd-table-wrap">
                        <table>
                          <thead><tr>
                            <th>#</th><th>Product</th><th>Model</th><th>Price</th><th>Sold</th>
                          </tr></thead>
                          <tbody>
                            {topProducts.map((p, i) => (
                              <tr key={p.Product_id}>
                                <td style={{ fontWeight: 700, color: ['#f39c12','#95a5a6','#cd7f32','#999','#999'][i] }}>#{i + 1}</td>
                                <td style={{ textAlign: 'left' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {p.Product_img && (
                                      <img src={`${API_URL}/uploads/${p.Product_img}`} alt=""
                                        style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                                    )}
                                    <span style={{ fontSize: 13 }}>{p.Product_name}</span>
                                  </div>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.Product_model}</td>
                                <td>฿{Number(p.Product_price).toLocaleString()}</td>
                                <td style={{ fontWeight: 700 }}>{p.sold_total} ชิ้น</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue Period Cards */}
                <div className="sd-rev-grid">
                  {/* Weekly */}
                  <div className="sd-rev-card sd-rev-card-week">
                    <div className="sd-rev-top">
                      <div className="sd-rev-period" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        รายสัปดาห์
                        {weekDrillDay && (
                          <button onClick={() => setWeekDrillDay(null)} style={{ fontSize: 10, background: 'none', border: '1px solid #a29bfe', cursor: 'pointer', color: '#a29bfe', fontWeight: 700, padding: '1px 7px', borderRadius: 6, lineHeight: 1.6 }}>← กลับ</button>
                        )}
                      </div>
                      {!weekDrillDay
                        ? <input type="week" className="sd-rev-picker" value={weekVal} max={todayWeek}
                            onChange={e => { setWeekVal(e.target.value); fetchRevenue('week', e.target.value, 'week'); setWeekDrillDay(null); }}
                          />
                        : <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{weekDrillDay}</span>
                      }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <div className="sd-rev-amount">฿{periodRevs.week.toLocaleString()}</div>
                      {!weekDrillDay && <Trend history={weekHistory} />}
                    </div>
                    <div className="sd-rev-sub">{weekDrillDay ? `รายวัน ${weekDrillDay}` : 'Weekly Revenue'}</div>
                    <div className="sd-rev-chart">
                      {weekDrillDay
                        ? <MiniBarChart data={dayHistory} refLabel={todayDate} color="#a29bfe" />
                        : <MiniBarChart data={weekHistory} refLabel={weekVal} color="#a29bfe"
                            onBarClick={(label) => { setWeekDrillDay(label); fetchDayHistory(label); }}
                          />
                      }
                    </div>
                  </div>
                  {/* Monthly */}
                  <div className="sd-rev-card sd-rev-card-month">
                    <div className="sd-rev-top">
                      <div className="sd-rev-period">รายเดือน</div>
                      <input
                        type="month"
                        className="sd-rev-picker"
                        value={monthVal}
                        max={todayMonth}
                        onChange={e => { setMonthVal(e.target.value); fetchRevenue('month', e.target.value, 'month'); }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <div className="sd-rev-amount">฿{periodRevs.month.toLocaleString()}</div>
                      <Trend history={monthHistory} />
                    </div>
                    <div className="sd-rev-sub">Monthly Revenue</div>
                    <div className="sd-rev-chart"><MiniBarChart data={monthHistory} refLabel={monthVal} color="#fd79a8" /></div>
                  </div>
                  {/* Yearly */}
                  <div className="sd-rev-card sd-rev-card-year">
                    <div className="sd-rev-top">
                      <div className="sd-rev-period">รายปี</div>
                      <select
                        className="sd-rev-picker"
                        value={yearVal}
                        onChange={e => { setYearVal(e.target.value); fetchRevenue('year', e.target.value, 'year'); }}
                      >
                        {yearOptions.map(y => (
                          <option key={y} value={String(y)}>{y + 543}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <div className="sd-rev-amount">฿{periodRevs.year.toLocaleString()}</div>
                      <Trend history={yearHistory} />
                    </div>
                    <div className="sd-rev-sub">Yearly Revenue</div>
                    <div className="sd-rev-chart"><MiniBarChart data={yearHistory} refLabel={yearVal} color="#fdcb6e" /></div>
                  </div>
                </div>

                {/* Pending orders preview */}
                <div className="sd-section-card">
                  <div className="sd-section-head">
                    <div className="sd-section-title">Pending Orders (Latest)</div>
                    <button className="sd-see-all" onClick={() => navigate("/admin/orders")}>
                      View All →
                    </button>
                  </div>

                  {!stats?.pendingOrders?.length ? (
                    <div className="sd-empty">No pending orders</div>
                  ) : (
                    <div className="sd-table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Order Date</th>
                            <th>Slip</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.pendingOrders.map(o => (
                            <tr key={o.Order_id}>
                              <td><span className="sd-td-id">#{o.Order_id}</span></td>
                              <td>{o.Name} {o.Surname}</td>
                              <td style={{ fontWeight: 600 }}>฿{Number(o.Proprice).toLocaleString()}</td>
                              <td>
                                <span className={`sd-badge sd-badge-${o.Status}`}>
                                  {STATUS_LABEL[o.Status]}
                                </span>
                              </td>
                              <td>{o.Order_date ? new Date(o.Order_date).toLocaleDateString("th-TH") : "-"}</td>
                              <td>
                                {o.Invoice_pic ? (
                                  <button className="sd-slip-btn" onClick={() => setLightbox(`${API_URL}/uploads/${o.Invoice_pic}`)}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                    ดูสลิป
                                  </button>
                                ) : (
                                  <span style={{ color: "#bbb", fontSize: "0.82rem" }}>-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {lightbox && (
        <div className="sd-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="slip" />
        </div>
      )}
    </>
  );
}
