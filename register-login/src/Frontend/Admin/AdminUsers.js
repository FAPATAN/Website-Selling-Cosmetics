import API_URL from '../../config';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

  :root {
    --bg: #f0f0ec;
    --sidebar-bg: #e8e8e4;
    --card-bg: #ffffff;
    --accent: #FFC2D1;
    --accent-dark: #b8d432;
    --text-primary: #1a1a1a;
    --text-secondary: #6b6b6b;
    --text-muted: #9a9a9a;
    --border: rgba(0,0,0,0.08);
    --shadow: 0 2px 16px rgba(0,0,0,0.06);
    --radius: 16px;
    --radius-sm: 10px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .su-app {
    display: flex;
    height: 100vh;
    background: var(--bg);
    font-family: 'Sora', sans-serif;
    color: var(--text-primary);
  }

  .su-sidebar {
    width: 200px;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    gap: 4px;
    flex-shrink: 0;
  }

  .su-logo { display: flex; flex-direction: column; padding: 8px 12px 24px; }

  .su-logo-romd {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 28px; font-weight: 100;
    letter-spacing: 1.5px; color: #333333; line-height: 1; text-transform: lowercase;
  }

  .su-logo-tagline {
    font-size: 7.5px; letter-spacing: 3px;
    text-transform: uppercase; color: var(--text-muted); margin-top: 3px;
  }

  .su-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    font-size: 13.5px; font-weight: 500; color: var(--text-secondary);
    cursor: pointer; transition: all 0.15s ease;
    border: none; background: none; text-align: left; width: 100%;
  }

  .su-nav-item:hover { background: rgba(0,0,0,0.05); color: var(--text-primary); }
  .su-nav-item.active { background: #FFC2D1; color: var(--text-primary); font-weight: 600; }
  .su-nav-icon{width:20px;height:20px;object-fit:contain;flex-shrink:0;opacity:0.7;transition:opacity .15s;}
  .su-nav-item:hover .su-nav-icon{opacity:1;}
  .su-nav-item.active .su-nav-icon{opacity:1;filter:brightness(0) invert(1);}

  .su-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .su-topbar {
    display: flex; align-items: flex-start;
    justify-content: space-between; padding: 24px 32px 20px;
  }

  .su-topbar-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
  .su-topbar-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
  .su-topbar-actions { display: flex; align-items: center; gap: 8px; }

  .su-icon-btn {
    width: 38px; height: 38px; border-radius: 50%;
    border: none; background: var(--card-bg);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px; color: var(--text-secondary);
    transition: all 0.15s; position: relative; box-shadow: var(--shadow);
  }

  .su-icon-btn:hover { background: var(--accent); color: var(--text-primary); }

  .su-notif-badge {
    position: absolute; top: 4px; right: 4px;
    width: 8px; height: 8px; background: #ff4757;
    border-radius: 50%; border: 2px solid var(--bg);
  }

  .su-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700; font-size: 14px;
    cursor: pointer; position: relative;
  }

  .su-avatar-dot {
    position: absolute; bottom: 2px; right: 2px;
    width: 8px; height: 8px; background: #2ed573;
    border-radius: 50%; border: 2px solid var(--bg);
  }

  .su-content { flex: 1; padding: 0 24px 24px; overflow: hidden; display: flex; flex-direction: column; }

  .su-card {
    background: var(--card-bg); border-radius: var(--radius);
    box-shadow: var(--shadow); overflow: hidden;
    flex: 1; display: flex; flex-direction: column;
  }

  .su-cat-bar { display: flex; gap: 8px; flex-wrap: wrap; padding: 16px 24px 0; }
  .su-cat-pill { display: flex; flex-direction: column; align-items: flex-start; padding: 10px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: #fff; cursor: pointer; transition: all .15s; min-width: 72px; font-family: 'Sora', sans-serif; }
  .su-cat-pill:hover { border-color: var(--accent-dark); }
  .su-cat-pill.active { background: var(--text-primary); border-color: var(--text-primary); color: #fff; }
  .su-cat-pill-label { font-size: 12px; font-weight: 500; white-space: nowrap; }
  .su-cat-pill-count { font-size: 15px; font-weight: 700; margin-top: 2px; }

  .su-table-header {
    display: flex; align-items: center;
    justify-content: space-between; padding: 18px 24px;
  }

  .su-table-title { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
  .su-table-controls { display: flex; gap: 10px; align-items: center; }

  .su-search-wrap { display: flex; align-items: center; gap: 6px; }
  .su-search-toggle-btn { width: 36px; height: 36px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all .15s; }
  .su-search-toggle-btn:hover { background: var(--bg); border-color: var(--text-primary); color: var(--text-primary); }
  .su-search-input { padding: 8px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); font-size: 13px; font-family: 'Sora', sans-serif; color: var(--text-primary); outline: none; width: 200px; animation: su-input-in .2s ease; }
  @keyframes su-input-in { from { opacity: 0; width: 0; padding: 8px 0; } to { opacity: 1; width: 200px; padding: 8px 14px; } }
  .su-search-input:focus { border-color: var(--accent-dark); background: #fff; }
  .su-add-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-sm); border: none; background: var(--text-primary); color: #fff; font-size: 13px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; transition: all .15s; }
  .su-add-btn:hover { background: #333; }

  .su-table-wrap { flex: 1; overflow-y: auto; padding: 0 24px; }
  .su-table-wrap table { width: 100%; border-collapse: collapse; }

  .su-table-wrap thead th {
    text-align: center; font-size: 12px; font-weight: 600;
    color: var(--text-muted); text-transform: uppercase;
    letter-spacing: 0.5px; padding: 10px 12px;
    background: var(--bg); position: sticky; top: 0;
  }

  .su-table-wrap thead th:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
  .su-table-wrap thead th:last-child  { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }

  .su-table-wrap tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .su-table-wrap tbody tr:last-child { border-bottom: none; }
  .su-table-wrap tbody tr:hover { background: #fafafa; }

  .su-table-wrap td { padding: 13px 12px; font-size: 13.5px; color: var(--text-primary); text-align: center; }

  .su-td-id { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-muted); }

  .su-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
  }

  .su-badge-silver   { background: #DDF2D1; color: #0a7e07; }
  .su-badge-gold     { background: #fff8e1; color: #b8860b; }
  .su-badge-platinum { background: #e8f5e9; color: #2e7d32; }
  .su-badge-admin    { background: #ede7f6; color: #4527a0; }

  .su-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .su-action-btns { display: flex; gap: 6px; justify-content: center; }

  .su-action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; padding: 0; }
  .su-action-btn img { width: 16px; height: 16px; object-fit: contain; }
  .su-action-btn-edit:hover { background: #DDF2D1; border-color: #DDF2D1; }
  .su-action-btn-del:hover { background: #FFE5EC; border-color: #FFE5EC; }
  .su-action-btn-del:disabled { opacity: 0.3; cursor: not-allowed; }

  .su-pagination {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; padding: 16px 24px; border-top: 1px solid var(--border);
  }

  .su-page-btn {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1px solid var(--border); background: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 13px; font-weight: 500;
    color: var(--text-secondary); transition: all 0.15s;
    font-family: 'Sora', sans-serif;
  }

  .su-page-btn:hover { border-color: var(--text-primary); color: var(--text-primary); }
  .su-page-btn.active { background: var(--accent); border-color: var(--accent); color: var(--text-primary); font-weight: 700; }

  .su-page-arrow {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1px solid var(--border); background: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-secondary); transition: all 0.15s; font-size: 16px;
  }

  .su-page-arrow:hover { background: var(--bg); }

  .su-modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.35);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; backdrop-filter: blur(2px);
  }

  .su-modal {
    background: #fff; border-radius: var(--radius); padding: 32px;
    width: 480px; max-width: 95vw; position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }

  .su-modal h3 { font-size: 16px; font-weight: 700; margin-bottom: 20px; color: var(--text-primary); }

  .su-modal-close {
    position: absolute; top: 16px; right: 16px;
    width: 30px; height: 30px; border-radius: 50%;
    border: none; background: var(--bg); cursor: pointer;
    font-size: 13px; color: var(--text-secondary);
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }

  .su-modal-close:hover { background: #ffe0e0; color: #c0392b; }

  .su-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .su-form-grid .full { grid-column: 1 / -1; }

  .su-form-label {
    font-size: 11px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;
  }

  .su-form-input, .su-form-select, .su-form-textarea {
    width: 100%; padding: 9px 12px;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13.5px; font-family: 'Sora', sans-serif;
    color: var(--text-primary); background: var(--bg); outline: none; transition: border-color 0.15s;
  }

  .su-form-input:focus, .su-form-select:focus, .su-form-textarea:focus { border-color: var(--accent-dark); background: #fff; }
  .su-form-textarea { resize: vertical; min-height: 70px; }

  .su-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

  .su-modal-cancel {
    padding: 9px 20px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--bg);
    font-size: 13.5px; font-family: 'Sora', sans-serif;
    cursor: pointer; color: var(--text-secondary); transition: all 0.15s;
  }

  .su-modal-cancel:hover { border-color: var(--text-primary); color: var(--text-primary); }

  .su-modal-save {
    padding: 9px 20px; border-radius: var(--radius-sm);
    border: none; background: var(--text-primary);
    color: #fff; font-size: 13.5px; font-weight: 600;
    font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.15s;
  }

  .su-modal-save:hover { background: #333; }
  .su-modal-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .su-modal-del { background: #c0392b; }
  .su-modal-del:hover { background: #a93226; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
`;

const API = `${API_URL}/api/admin`;

const EMPTY_FORM = {
  Username: "", Name: "", Surname: "", Email: "",
  Phone: "", Address: "", Member_role: "M", Status: "Y",
};

const ROWS_PER_PAGE = 10;

const navItems = [
  { iconSrc: "/Dashboard.png",   label: "Dashboard",   path: "/admin" },
  { iconSrc: "/Orders.png",      label: "Orders",      path: "/admin/orders" },
  { iconSrc: "/Products.png",    label: "Products",    path: "/admin/products" },
  { iconSrc: "/Promotions.png",  label: "Promotions",  path: "/admin/promotions" },
  { iconSrc: "/price_range.png", label: "Price Range", path: "/admin/price-ranges" },
  { iconSrc: "/Members.png",     label: "Members",     path: "/admin/users" },
];

const badgeClass = (role) =>
  role === "A" ? "su-badge su-badge-admin" : "su-badge su-badge-silver";

const roleLabel = (role) => (role === "A" ? "Admin" : "Member");

export default function AdminUsers() {
  const memberId = sessionStorage.getItem("admin_Member_id") || sessionStorage.getItem("Member_id");
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [modal, setModal]           = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editId, setEditId]         = useState(null);
  const [saving, setSaving]         = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab]   = useState("Member");
  const [activePage, setActivePage] = useState(1);
  const [filterRole, setFilterRole] = useState(location.state?.filterRole || "All");
  const [sortBySpent, setSortBySpent] = useState(false);
  const [adminName, setAdminName] = useState("");
  const avatarLetter = adminName ? adminName.charAt(0).toUpperCase() : "A";

  const headers = { "x-member-id": memberId };

  useEffect(() => {
    if (!memberId) return;
    fetch(`${API}/members/${memberId}`, { headers: { "x-member-id": memberId } })
      .then(r => r.json())
      .then(d => { if (d.Username || d.Name) setAdminName(d.Name || d.Username); })
      .catch(() => {});
  }, [memberId]);

  const load = () => {
    setLoading(true);
    fetch(`${API}/members`, { headers })
      .then(r => r.json())
      .then(d => { setUsers(d.members || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, Member_role: "M", Status: "Y", Password: "" });
    setEditId(null);
    setModal(true);
  };

  const openEdit = (u) => {
    setForm({
      Username:    u.Username    || "",
      Name:        u.Name        || "",
      Surname:     u.Surname     || "",
      Email:       u.Email       || "",
      Phone:       u.Phone       || "",
      Address:     u.Address     || "",
      Member_role: u.Member_role || "M",
      Status:      u.Status      || "Y",
    });
    setEditId(u.MemberID);
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let res;
      if (editId) {
        res = await fetch(`${API}/members/${editId}`, {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(`${API}/members`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      const data = await res.json();
      if (!res.ok || data.error) {
        alert(`???????????????: ${data.error || res.status}`);
        setSaving(false);
        return;
      }
    } catch (err) {
      alert(`??????????????: ${err.message}`);
      setSaving(false);
      return;
    }
    setSaving(false);
    setModal(false);
    load();
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/members/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert('???????????: ' + (data.error || '??????????????'));
        setConfirmDelete(null);
        return;
      }
    } catch (e) {
      alert('???????????: ' + e.message);
      setConfirmDelete(null);
      return;
    }
    setConfirmDelete(null);
    load();
  };

  const filtered = users.filter(u => {
    const matchSearch = `${u.MemberID} ${u.Username} ${u.Name} ${u.Surname} ${u.Email}`
      .toLowerCase().includes(search.toLowerCase());
    const matchRole =
      filterRole === "All" ? true :
      filterRole === "Admin" ? u.Member_role === "A" :
      u.Member_role !== "A";
    return matchSearch && matchRole;
  });

  const sortedFiltered = sortBySpent
    ? [...filtered].sort((a, b) => Number(b.total_spent) - Number(a.total_spent))
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / ROWS_PER_PAGE));
  const pageData   = sortedFiltered.slice((activePage - 1) * ROWS_PER_PAGE, activePage * ROWS_PER_PAGE);

  const changePage = (p) => {
    if (p < 1 || p > totalPages) return;
    setActivePage(p);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="su-app">

        {/* -- SIDEBAR -- */}
        <aside className="su-sidebar">
          <div className="su-logo">
            <div className="su-logo-romd">rom&amp;nd</div>
            <div className="su-logo-tagline"></div>
          </div>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`su-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.iconSrc ? <img src={item.iconSrc} alt={item.label} className="su-nav-icon" /> : <span style={{width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>???</span>}
              {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            className="su-nav-item"
            onClick={() => { sessionStorage.clear(); window.location.href = "/"; }}
          >
            <img src="/logout.png" alt="Logout" className="su-nav-icon" />
            Logout
          </button>
        </aside>

        {/* -- MAIN -- */}
        <main className="su-main">

          {/* TOPBAR */}
          <div className="su-topbar">
            <div>
              <div className="su-topbar-title">Welcome, Admin </div>
              <div className="su-topbar-sub"></div>
            </div>
            <div className="su-topbar-actions">
              <div className="su-avatar">
                {avatarLetter}
                <span className="su-avatar-dot" />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="su-content">
            <div className="su-card">

              {/* PILLS */}
              <div className="su-cat-bar">
                {[
                  { label: "All",    value: "All",    count: users.length },
                  { label: "Member", value: "Member", count: users.filter(u => u.Member_role !== "A").length },
                  { label: "Admin",  value: "Admin",  count: users.filter(u => u.Member_role === "A").length },
                ].map(pill => (
                  <button
                    key={pill.value}
                    className={`su-cat-pill ${filterRole === pill.value ? "active" : ""}`}
                    onClick={() => { setFilterRole(pill.value); setActivePage(1); }}
                  >
                    <span className="su-cat-pill-label">{pill.label}</span>
                    <span className="su-cat-pill-count">{pill.count}</span>
                  </button>
                ))}
              </div>

              {/* TABLE HEADER */}
              <div className="su-table-header">
                <div className="su-table-title">Member List</div>
                <div className="su-table-controls">
                  <div className="su-search-wrap">
                    <button className="su-search-toggle-btn" onClick={() => { if (showSearch) { setSearch(""); setActivePage(1); } setShowSearch(v => !v); }}>
                      {showSearch ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      )}
                    </button>
                    {showSearch && (
                      <input
                        className="su-search-input"
                        placeholder="Search members..."
                        value={search}
                        autoFocus
                        onChange={e => { setSearch(e.target.value); setActivePage(1); }}
                      />
                    )}
                  </div>
                  <button className="su-add-btn" onClick={openNew}>+ Add Member</button>
                </div>
              </div>

              {/* TABLE */}
              <div className="su-table-wrap">
                {loading ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Loading...</div>
                ) : pageData.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No members found</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Member ID</th>
                        <th>Member Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th
                          style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                          onClick={() => { setSortBySpent(v => !v); setActivePage(1); }}
                        >
                          Total Spent {sortBySpent ? '?' : '?'}
                        </th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.map((u) => (
                        <tr key={u.MemberID}>
                          <td className="su-td-id">{u.MemberID}</td>
                          <td style={{ fontWeight: 500 }}>{u.Name} {u.Surname}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{u.Phone || "-"}</td>
                          <td style={{ color: "var(--text-secondary)" }}>{u.Email || "-"}</td>
                          <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{u.Address || "-"}</td>
                          <td style={{ fontWeight: sortBySpent ? 700 : 400, color: sortBySpent ? '#e0527e' : 'inherit' }}>
                            {Number(u.total_spent) > 0 ? `?${Number(u.total_spent).toLocaleString()}` : <span style={{ color: '#ccc' }}>—</span>}
                          </td>
                          <td>
                            <span className={badgeClass(u.Member_role)}>
                              <span className="su-badge-dot" />
                              {roleLabel(u.Member_role)}
                            </span>
                          </td>
                          <td>
                            <div className="su-action-btns">
                              <button className="su-action-btn su-action-btn-edit" title="Edit" onClick={() => openEdit(u)}>
                                <img src="/edit.png" alt="edit" />
                              </button>
                              <button
                                className="su-action-btn su-action-btn-del"
                                title="Delete"
                                onClick={() => setConfirmDelete(u)}
                                disabled={u.MemberID === Number(memberId)}
                              >
                                <img src="/bin.png" alt="delete" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* PAGINATION */}
              <div className="su-pagination">
                <button className="su-page-arrow" onClick={() => changePage(activePage - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`su-page-btn ${activePage === p ? "active" : ""}`}
                    onClick={() => changePage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button className="su-page-arrow" onClick={() => changePage(activePage + 1)}>›</button>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* -- Edit Modal -- */}
      {modal && (
        <div className="su-modal-backdrop" onClick={() => setModal(false)}>
          <div className="su-modal" onClick={e => e.stopPropagation()}>
            <button className="su-modal-close" onClick={() => setModal(false)}>?</button>
            <h3>{editId ? `Edit Member #${editId}` : "Add Member"}</h3>
            <div className="su-form-grid">
              {[
                ["Username", "Username"],
                ...(editId ? [] : [["Password", "Password"]]),
                ["Name",     "First Name"],
                ["Surname",  "Last Name"],
                ["Email",    "Email"],
                ["Phone",    "Phone"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="su-form-label">{label}</label>
                  <input
                    className="su-form-input"
                    type={key === "Password" ? "password" : "text"}
                    value={form[key] || ""}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="su-form-label">Role</label>
                <select
                  className="su-form-select"
                  value={form.Member_role}
                  onChange={e => setForm(f => ({ ...f, Member_role: e.target.value }))}
                >
                  <option value="M">Member</option>
                  <option value="A">Admin</option>
                </select>
              </div>
              <div>
                <label className="su-form-label">Status</label>
                <select
                  className="su-form-select"
                  value={form.Status}
                  onChange={e => setForm(f => ({ ...f, Status: e.target.value }))}
                >
                  <option value="Y">Active</option>
                  <option value="N">Inactive</option>
                </select>
              </div>
              <div className="full">
                <label className="su-form-label">Address</label>
                <textarea
                  className="su-form-textarea"
                  value={form.Address}
                  onChange={e => setForm(f => ({ ...f, Address: e.target.value }))}
                />
              </div>
            </div>
            <div className="su-modal-actions">
              <button className="su-modal-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="su-modal-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -- Confirm Delete -- */}
      {confirmDelete && (
        <div className="su-modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="su-modal" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>
              Are you sure you want to delete <strong>{confirmDelete.Username}</strong>?<br />
              This action cannot be undone.
            </p>
            <div className="su-modal-actions">
              <button className="su-modal-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="su-modal-save su-modal-del"
                onClick={() => handleDelete(confirmDelete.MemberID)}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
