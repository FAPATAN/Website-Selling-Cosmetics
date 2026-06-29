import API_URL from '../../config';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = `${API_URL}/api/admin`;

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
    --bg:#f0f0ec; --sidebar-bg:#e8e8e4; --card-bg:#ffffff;
    --accent:#FFC2D1; --accent-dark:#ffaabf;
    --text-primary:#1a1a1a; --text-secondary:#6b6b6b; --text-muted:#9a9a9a;
    --border:rgba(0,0,0,0.08); --shadow:0 2px 16px rgba(0,0,0,0.06);
    --radius:16px; --radius-sm:10px;
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  .apr-app { display:flex; height:100vh; background:var(--bg); font-family:'Sora',sans-serif; color:var(--text-primary); }

  /* Sidebar */
  .apr-sidebar { width:200px; background:var(--sidebar-bg); display:flex; flex-direction:column; padding:24px 16px; gap:4px; flex-shrink:0; }
  .apr-logo { display:flex; flex-direction:column; padding:8px 12px 24px; }
  .apr-logo-romd { font-family:'Georgia','Times New Roman',serif; font-size:28px; font-weight:100; letter-spacing:1.5px; line-height:1; color:#333333; text-transform:lowercase; }
  .apr-logo-tagline { font-size:7.5px; letter-spacing:3px; text-transform:uppercase; color:var(--text-muted); margin-top:3px; }
  .apr-nav-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:var(--radius-sm); font-size:13.5px; font-weight:500; color:var(--text-secondary); cursor:pointer; transition:all .15s ease; border:none; background:none; text-align:left; width:100%; }
  .apr-nav-item:hover { background:rgba(0,0,0,0.05); color:var(--text-primary); }
  .apr-nav-item.active { background:#FFC2D1; color:var(--text-primary); font-weight:600; }
  .apr-nav-icon { width:20px; height:20px; object-fit:contain; flex-shrink:0; opacity:0.7; }
  .apr-nav-item.active .apr-nav-icon { opacity:1; filter:brightness(0) invert(1); }
  .apr-nav-emoji { width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }

  /* Main */
  .apr-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
  .apr-topbar { display:flex; align-items:flex-start; justify-content:space-between; padding:24px 32px 20px; }
  .apr-topbar-title { font-size:26px; font-weight:700; letter-spacing:-.5px; }
  .apr-topbar-sub { font-size:13px; color:var(--text-muted); margin-top:2px; }
  .apr-topbar-actions { display:flex; align-items:center; gap:8px; }
  .apr-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#f093fb,#f5576c); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:14px; cursor:pointer; position:relative; }
  .apr-avatar-dot { position:absolute; bottom:2px; right:2px; width:8px; height:8px; background:#2ed573; border-radius:50%; border:2px solid var(--bg); }
  .apr-content { flex:1; padding:0 24px 24px; overflow:hidden; display:flex; flex-direction:column; }
  .apr-card { background:var(--card-bg); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; flex:1; display:flex; flex-direction:column; }

  /* Table header */
  .apr-table-header { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; }
  .apr-table-title { font-size:16px; font-weight:700; letter-spacing:-.3px; }
  .apr-table-count { font-size:13px; color:var(--text-muted); background:var(--bg); padding:3px 10px; border-radius:20px; margin-left:8px; font-weight:500; }

  /* Table */
  .apr-table-wrap { flex:1; overflow-y:auto; padding:0 24px 24px; }
  .apr-table-wrap table { width:100%; border-collapse:collapse; }
  .apr-table-wrap thead th { text-align:center; font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; padding:10px 12px; background:var(--bg); position:sticky; top:0; }
  .apr-table-wrap thead th:first-child { border-radius:var(--radius-sm) 0 0 var(--radius-sm); }
  .apr-table-wrap thead th:last-child  { border-radius:0 var(--radius-sm) var(--radius-sm) 0; }
  .apr-table-wrap tbody tr { border-bottom:1px solid var(--border); transition:background .1s; }
  .apr-table-wrap tbody tr:last-child { border-bottom:none; }
  .apr-table-wrap tbody tr:hover { background:#fafafa; }
  .apr-table-wrap td { padding:14px 12px; font-size:13.5px; color:var(--text-primary); text-align:center; }
  .apr-td-id { font-family:monospace; font-size:12px; color:var(--text-muted); }

  /* Price display */
  .apr-price-val { font-weight:700; color:#1a1a2e; font-size:14px; }
  .apr-price-sep { color:var(--text-muted); margin:0 6px; }
  .apr-type-badge { display:inline-flex; align-items:center; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; background:#f0f0f6; color:#555; }
  .apr-count-badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:12px; font-weight:600; background:#e8f5e9; color:#2e7d32; }

  /* Action btn */
  .apr-action-btns { display:flex; gap:6px; justify-content:center; }
  .apr-action-btn { width:32px; height:32px; border-radius:8px; border:1px solid var(--border); background:none; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; padding:0; font-size:15px; color:var(--text-secondary); }
  .apr-btn-edit:hover { background:#DDF2D1; border-color:#DDF2D1; }

  /* Modal */
  .apr-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; z-index:1000; backdrop-filter:blur(2px); }
  .apr-modal { background:#fff; border-radius:var(--radius); padding:32px; width:440px; max-width:95vw; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.15); }
  .apr-modal h3 { font-size:16px; font-weight:700; margin-bottom:6px; }
  .apr-modal-sub { font-size:13px; color:var(--text-muted); margin-bottom:24px; }
  .apr-modal-close { position:absolute; top:16px; right:16px; width:30px; height:30px; border-radius:50%; border:none; background:var(--bg); cursor:pointer; font-size:13px; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; transition:all .15s; }
  .apr-modal-close:hover { background:#ffe0e0; color:#c0392b; }
  .apr-form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .apr-form-label { font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; display:block; margin-bottom:5px; }
  .apr-form-input { width:100%; padding:9px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13.5px; font-family:'Sora',sans-serif; color:var(--text-primary); background:var(--bg); outline:none; transition:border-color .15s; }
  .apr-form-input:focus { border-color:var(--accent-dark); background:#fff; }
  .apr-modal-actions { display:flex; justify-content:flex-end; gap:10px; }
  .apr-modal-cancel { padding:9px 20px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg); font-size:13.5px; font-family:'Sora',sans-serif; cursor:pointer; color:var(--text-secondary); transition:all .15s; }
  .apr-modal-cancel:hover { border-color:var(--text-primary); color:var(--text-primary); }
  .apr-modal-save { padding:9px 20px; border-radius:var(--radius-sm); border:none; background:var(--text-primary); color:#fff; font-size:13.5px; font-weight:600; font-family:'Sora',sans-serif; cursor:pointer; transition:all .15s; }
  .apr-modal-save:hover { background:#333; }
  .apr-modal-save:disabled { opacity:.5; cursor:not-allowed; }
  .apr-save-error { color:#c0392b; font-size:13px; margin-bottom:10px; }

  /* Product list modal */
  .apr-prod-modal { background:#fff; border-radius:var(--radius); padding:28px; width:600px; max-width:95vw; max-height:80vh; display:flex; flex-direction:column; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.15); }
  .apr-prod-modal h3 { font-size:16px; font-weight:700; margin-bottom:4px; }
  .apr-prod-modal-sub { font-size:13px; color:var(--text-muted); margin-bottom:18px; }
  .apr-prod-list { overflow-y:auto; flex:1; }
  .apr-prod-item { display:flex; align-items:center; gap:14px; padding:10px 0; border-bottom:1px solid var(--border); }
  .apr-prod-item:last-child { border-bottom:none; }
  .apr-prod-thumb { width:44px; height:44px; border-radius:8px; object-fit:cover; border:1px solid var(--border); flex-shrink:0; }
  .apr-prod-thumb-ph { width:44px; height:44px; border-radius:8px; background:var(--bg); display:flex; align-items:center; justify-content:center; font-size:18px; border:1px solid var(--border); flex-shrink:0; }
  .apr-prod-name { font-size:13.5px; font-weight:600; color:var(--text-primary); }
  .apr-prod-model { font-size:12px; color:var(--text-muted); margin-top:2px; }
  .apr-prod-price { margin-left:auto; font-weight:700; color:#1a1a2e; font-size:13.5px; white-space:nowrap; }
  .apr-prod-color { width:16px; height:16px; border-radius:50%; border:1px solid #eee; flex-shrink:0; }
  .apr-count-badge-btn { cursor:pointer; border:none; background:none; padding:0; font-family:inherit; }
  .apr-count-badge-btn:hover .apr-count-badge { background:#c8e6c9; }

  /* Info box */
  .apr-info-box { margin:0 24px 16px; padding:14px 18px; background:#fffbe6; border:1px solid #ffe58f; border-radius:var(--radius-sm); font-size:13px; color:#7d5e00; line-height:1.6; }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#ddd; border-radius:4px; }
`;

export default function AdminPriceRange() {
  const memberId = sessionStorage.getItem("admin_Member_id") || sessionStorage.getItem("Member_id");
  const navigate = useNavigate();
  const location = useLocation();

  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ Min_price: "", Max_price: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [prodModal, setProdModal] = useState(false);
  const [prodList, setProdList] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodModalTitle, setProdModalTitle] = useState("");
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
    fetch(`${API}/price-ranges`, { headers })
      .then(r => r.json())
      .then(data => { setPriceRanges(data.priceRanges || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const openEdit = (row) => {
    setEditRow(row);
    setForm({ Min_price: row.Min_price, Max_price: row.Max_price });
    setSaveError("");
    setModal(true);
  };

  const openProdList = async (row) => {
    setProdModalTitle(`${row.Type_name || 'Price Range #' + row.Price_range_id} — ${row.product_count} ??????`);
    setProdModal(true);
    setProdLoading(true);
    try {
      const res = await fetch(`${API}/price-ranges/${row.Price_range_id}/products`, { headers });
      const data = await res.json();
      setProdList(data.products || []);
    } catch { setProdList([]); }
    setProdLoading(false);
  };

  const handleSave = async () => {
    setSaving(true); setSaveError("");
    try {
      const res = await fetch(`${API}/price-ranges/${editRow.Price_range_id}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ Min_price: Number(form.Min_price), Max_price: Number(form.Max_price) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error || `??????????????? (${res.status})`);
      setSaving(false); setModal(false); load();
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="apr-app">

        {/* SIDEBAR */}
        <aside className="apr-sidebar">
          <div className="apr-logo">
            <div className="apr-logo-romd">rom&amp;nd</div>
            <div className="apr-logo-tagline"></div>
          </div>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`apr-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.iconSrc
                ? <img src={item.iconSrc} alt={item.label} className="apr-nav-icon" />
                : <span className="apr-nav-emoji">???</span>
              }
              {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            className="apr-nav-item"
            onClick={() => { sessionStorage.clear(); window.location.href = "/"; }}
          >
            <img src="/logout.png" alt="Logout" className="apr-nav-icon" />
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="apr-main">
          <div className="apr-topbar">
            <div>
              <div className="apr-topbar-title">Price Range Management </div>
              <div className="apr-topbar-sub"></div>
            </div>
            <div className="apr-topbar-actions">
              <div className="apr-avatar">{avatarLetter}<span className="apr-avatar-dot" /></div>
            </div>
          </div>

          <div className="apr-content">
            <div className="apr-card">
              <div className="apr-table-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="apr-table-title">Price Range List</div>
                  <span className="apr-table-count">{priceRanges.length} TYPE</span>
                </div>
              </div>

              <div className="apr-table-wrap">
                {loading ? (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Loading...</div>
                ) : priceRanges.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>??????????? price_range ???????????</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Category (Type)</th>
                        <th>Min Price (?)</th>
                        <th>Max Price (?)</th>
                        <th>Products</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceRanges.map(row => (
                        <tr key={row.Price_range_id}>
                          <td><span className="apr-td-id">{row.Price_range_id}</span></td>
                          <td>
                            {row.Type_name
                              ? <span className="apr-type-badge">{row.Type_name}</span>
                              : <span style={{ color: "var(--text-muted)" }}>—</span>}
                          </td>
                          <td><span className="apr-price-val">?{Number(row.Min_price).toLocaleString()}</span></td>
                          <td><span className="apr-price-val">?{Number(row.Max_price).toLocaleString()}</span></td>
                          <td>
                            <button className="apr-count-badge-btn" onClick={() => openProdList(row)} title="???????????????">
                              <span className="apr-count-badge">{row.product_count} ??????</span>
                            </button>
                          </td>
                          <td>
                            <div className="apr-action-btns">
                              <button className="apr-action-btn apr-btn-edit" title="Edit" onClick={() => openEdit(row)}>
                                <img src="/edit.png" alt="edit" style={{width:'16px',height:'16px',objectFit:'contain'}} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PRODUCT LIST MODAL */}
      {prodModal && (
        <div className="apr-modal-backdrop" onClick={() => setProdModal(false)}>
          <div className="apr-prod-modal" onClick={e => e.stopPropagation()}>
            <button className="apr-modal-close" onClick={() => setProdModal(false)}>?</button>
            <h3>????????????</h3>
            <div className="apr-prod-modal-sub">{prodModalTitle}</div>
            <div className="apr-prod-list">
              {prodLoading ? (
                <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
              ) : prodList.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>????????????????????????</div>
              ) : prodList.map(p => (
                <div className="apr-prod-item" key={p.Product_id}>
                  {p.Image
                    ? <img src={`${API_URL}/uploads/${p.Image}`} alt={p.Product_name} className="apr-prod-thumb" />
                    : <div className="apr-prod-thumb-ph">??</div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="apr-prod-name">{p.Product_name}</div>
                    <div className="apr-prod-model">{p.Product_model || '—'}</div>
                  </div>
                  {p.Color && <span className="apr-prod-color" style={{ backgroundColor: p.Color }} title={p.Color} />}
                  <div className="apr-prod-price">?{Number(p.Product_price).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {modal && editRow && (
        <div className="apr-modal-backdrop" onClick={() => setModal(false)}>
          <div className="apr-modal" onClick={e => e.stopPropagation()}>
            <button className="apr-modal-close" onClick={() => setModal(false)}>?</button>
            <h3>Edit Price Range #{editRow.Price_range_id}</h3>
            <div className="apr-modal-sub">
              {editRow.Type_name ? `????????: ${editRow.Type_name}` : `Price Range ID: ${editRow.Price_range_id}`}
              {` · ${editRow.product_count} ??????`}
            </div>
            <div className="apr-form-row">
              <div>
                <label className="apr-form-label">Min Price (?)</label>
                <input
                  className="apr-form-input"
                  type="number"
                  min="0"
                  value={form.Min_price}
                  onChange={e => setForm(f => ({ ...f, Min_price: e.target.value }))}
                />
              </div>
              <div>
                <label className="apr-form-label">Max Price (?)</label>
                <input
                  className="apr-form-input"
                  type="number"
                  min="0"
                  value={form.Max_price}
                  onChange={e => setForm(f => ({ ...f, Max_price: e.target.value }))}
                />
              </div>
            </div>
            {saveError && <div className="apr-save-error">{saveError}</div>}
            <div className="apr-modal-actions">
              <button className="apr-modal-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="apr-modal-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
