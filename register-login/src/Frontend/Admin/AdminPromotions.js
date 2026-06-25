import API_URL from '../../config';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  .spr-app { display:flex; height:100vh; background:var(--bg); font-family:'Sora',sans-serif; color:var(--text-primary); }

  /* ── Sidebar ── */
  .spr-sidebar { width:200px; background:var(--sidebar-bg); display:flex; flex-direction:column; padding:24px 16px; gap:4px; flex-shrink:0; }
  .spr-logo { display:flex; flex-direction:column; padding:8px 12px 24px; }
  .spr-logo-romd { font-family:'Georgia','Times New Roman',serif; font-size:28px; font-weight:100; letter-spacing:1.5px; line-height:1; color:#333333; text-transform:lowercase; }
  .spr-logo-tagline { font-size:7.5px; letter-spacing:3px; text-transform:uppercase; color:var(--text-muted); margin-top:3px; }
  .spr-nav-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:var(--radius-sm); font-size:13.5px; font-weight:500; color:var(--text-secondary); cursor:pointer; transition:all .15s ease; border:none; background:none; text-align:left; width:100%; }
  .spr-nav-item:hover { background:rgba(0,0,0,0.05); color:var(--text-primary); }
  .spr-nav-item.active { background:#FFC2D1; color:var(--text-primary); font-weight:600; }
  .spr-nav-icon { width:20px; height:20px; object-fit:contain; flex-shrink:0; opacity:0.7; transition:opacity .15s; }
  .spr-nav-item:hover .spr-nav-icon { opacity:1; }
  .spr-nav-item.active .spr-nav-icon { opacity:1; filter:brightness(0) invert(1); }

  /* ── Main layout ── */
  .spr-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
  .spr-topbar { display:flex; align-items:flex-start; justify-content:space-between; padding:24px 32px 20px; }
  .spr-topbar-title { font-size:26px; font-weight:700; letter-spacing:-.5px; }
  .spr-topbar-sub { font-size:13px; color:var(--text-muted); margin-top:2px; }
  .spr-topbar-actions { display:flex; align-items:center; gap:8px; }
  .spr-icon-btn { width:38px; height:38px; border-radius:50%; border:none; background:var(--card-bg); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:15px; color:var(--text-secondary); transition:all .15s; position:relative; box-shadow:var(--shadow); }
  .spr-icon-btn:hover { background:var(--accent); }
  .spr-notif-badge { position:absolute; top:4px; right:4px; width:8px; height:8px; background:#ff4757; border-radius:50%; border:2px solid var(--bg); }
  .spr-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#f093fb,#f5576c); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:14px; cursor:pointer; position:relative; }
  .spr-avatar-dot { position:absolute; bottom:2px; right:2px; width:8px; height:8px; background:#2ed573; border-radius:50%; border:2px solid var(--bg); }
  .spr-content { flex:1; padding:0 24px 24px; overflow:hidden; display:flex; flex-direction:column; }
  .spr-card { background:var(--card-bg); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; flex:1; display:flex; flex-direction:column; }

  /* ── Table header / controls ── */
  .spr-table-header { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; }
  .spr-table-title { font-size:16px; font-weight:700; letter-spacing:-.3px; }
  .spr-table-count { font-size:13px; color:var(--text-muted); background:var(--bg); padding:3px 10px; border-radius:20px; margin-left:8px; font-weight:500; }
  .spr-table-controls { display:flex; gap:10px; align-items:center; }
  .spr-search-wrap { display:flex; align-items:center; gap:6px; }
  .spr-search-toggle-btn { width:36px; height:36px; border-radius:var(--radius-sm); border:1px solid var(--border); background:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-secondary); transition:all .15s; font-size:15px; }
  .spr-search-toggle-btn:hover { background:var(--bg); border-color:var(--text-primary); color:var(--text-primary); }
  .spr-search-input { padding:8px 14px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg); font-size:13px; font-family:'Sora',sans-serif; color:var(--text-primary); outline:none; width:200px; animation:spr-input-in .2s ease; }
  @keyframes spr-input-in { from{opacity:0;width:0;padding:8px 0;} to{opacity:1;width:200px;padding:8px 14px;} }
  .spr-search-input:focus { border-color:var(--accent-dark); background:#fff; }
  .spr-add-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:var(--radius-sm); border:none; background:var(--text-primary); color:#fff; font-size:13px; font-weight:600; font-family:'Sora',sans-serif; cursor:pointer; transition:all .15s; }
  .spr-add-btn:hover { background:#333; }

  /* ── Table ── */
  .spr-table-wrap { flex:1; overflow-y:auto; padding:0 24px; }
  .spr-table-wrap table { width:100%; border-collapse:collapse; }
  .spr-table-wrap thead th { text-align:center; font-size:12px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; padding:10px 12px; background:var(--bg); position:sticky; top:0; }
  .spr-table-wrap thead th:first-child { border-radius:var(--radius-sm) 0 0 var(--radius-sm); }
  .spr-table-wrap thead th:last-child  { border-radius:0 var(--radius-sm) var(--radius-sm) 0; }
  .spr-table-wrap tbody tr { border-bottom:1px solid var(--border); transition:background .1s; }
  .spr-table-wrap tbody tr:last-child { border-bottom:none; }
  .spr-table-wrap tbody tr:hover { background:#fafafa; }
  .spr-table-wrap td { padding:13px 12px; font-size:13.5px; color:var(--text-primary); text-align:center; }
  .spr-td-id { font-family:monospace; font-size:12px; color:var(--text-muted); }
  .spr-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .spr-badge-percent { background:#e8f0fe; color:#1967d2; }
  .spr-badge-baht { background:#e6f4ea; color:#1e7e34; }

  /* ── Action buttons (icon style like AdminProducts) ── */
  .spr-action-btns { display:flex; gap:6px; justify-content:center; }
  .spr-action-btn { width:32px; height:32px; border-radius:8px; border:1px solid var(--border); background:none; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; padding:0; font-size:15px; color:var(--text-secondary); }
  .spr-btn-edit:hover { background:#DDF2D1; border-color:#DDF2D1; }
  .spr-btn-del:hover  { background:#FFE5EC; border-color:#FFE5EC; color:#c0392b; }

  /* ── Pagination ── */
  .spr-pagination { display:flex; align-items:center; justify-content:center; gap:6px; padding:16px 24px; border-top:1px solid var(--border); }
  .spr-page-btn { width:34px; height:34px; border-radius:50%; border:1px solid var(--border); background:none; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; font-weight:500; color:var(--text-secondary); transition:all .15s; font-family:'Sora',sans-serif; }
  .spr-page-btn:hover { border-color:var(--text-primary); color:var(--text-primary); }
  .spr-page-btn.active { background:var(--accent); border-color:var(--accent); color:var(--text-primary); font-weight:700; }
  .spr-page-arrow { width:34px; height:34px; border-radius:50%; border:1px solid var(--border); background:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-secondary); transition:all .15s; font-size:16px; }
  .spr-page-arrow:hover { background:var(--bg); }

  /* ── Modal ── */
  .spr-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; z-index:1000; backdrop-filter:blur(2px); }
  .spr-modal { background:#fff; border-radius:var(--radius); padding:32px; width:560px; max-width:95vw; position:relative; box-shadow:0 20px 60px rgba(0,0,0,0.15); }
  .spr-modal h3 { font-size:16px; font-weight:700; margin-bottom:20px; }
  .spr-modal-close { position:absolute; top:16px; right:16px; width:30px; height:30px; border-radius:50%; border:none; background:var(--bg); cursor:pointer; font-size:13px; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; transition:all .15s; }
  .spr-modal-close:hover { background:#ffe0e0; color:#c0392b; }
  .spr-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px; }
  .spr-form-grid .full { grid-column:1/-1; }
  .spr-form-label { font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; display:block; margin-bottom:5px; }
  .spr-form-input,.spr-form-select,.spr-form-textarea { width:100%; padding:9px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13.5px; font-family:'Sora',sans-serif; color:var(--text-primary); background:var(--bg); outline:none; transition:border-color .15s; }
  .spr-form-input:focus,.spr-form-select:focus,.spr-form-textarea:focus { border-color:var(--accent-dark); background:#fff; }
  .spr-form-textarea { resize:vertical; min-height:70px; }
  .spr-modal-actions { display:flex; justify-content:flex-end; gap:10px; }
  .spr-modal-cancel { padding:9px 20px; border-radius:var(--radius-sm); border:1px solid var(--border); background:var(--bg); font-size:13.5px; font-family:'Sora',sans-serif; cursor:pointer; color:var(--text-secondary); transition:all .15s; }
  .spr-modal-cancel:hover { border-color:var(--text-primary); color:var(--text-primary); }
  .spr-modal-save { padding:9px 20px; border-radius:var(--radius-sm); border:none; background:var(--text-primary); color:#fff; font-size:13.5px; font-weight:600; font-family:'Sora',sans-serif; cursor:pointer; transition:all .15s; }
  .spr-modal-save:hover { background:#333; }
  .spr-modal-save:disabled { opacity:.5; cursor:not-allowed; }
  .spr-modal-del { background:#c0392b; } .spr-modal-del:hover { background:#a93226; }

  /* ── Products Modal ── */
  .spr-promo-modal { width:620px; max-height:82vh; display:flex; flex-direction:column; padding:28px; }
  .spr-promo-modal-title { font-size:16px; font-weight:700; margin-bottom:4px; }
  .spr-promo-modal-sub { font-size:12px; color:var(--text-muted); }
  .spr-promo-info-row { display:flex; align-items:center; gap:8px; margin:12px 0 16px; }
  .spr-promo-tag { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
  .spr-promo-tag-percent { background:#e8f0fe; color:#1967d2; }
  .spr-promo-tag-baht { background:#e6f4ea; color:#1e7e34; }
  .spr-promo-discount-val { font-size:13px; font-weight:700; color:#e75480; }
  .spr-promo-count { font-size:12px; color:var(--text-muted); }
  .spr-product-list { overflow-y:auto; flex:1; }
  .spr-product-list::-webkit-scrollbar{width:4px;}
  .spr-product-list::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
  .spr-product-item { display:flex; align-items:center; gap:14px; padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border); margin-bottom:8px; transition:background .1s; }
  .spr-product-item:hover { background:#fafafa; }
  .spr-product-img { width:56px; height:56px; border-radius:8px; object-fit:cover; border:1px solid var(--border); flex-shrink:0; }
  .spr-product-img-ph { width:56px; height:56px; border-radius:8px; background:#f0f0ec; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; border:1px solid var(--border); }
  .spr-product-info { flex:1; min-width:0; }
  .spr-product-name { font-size:13.5px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .spr-product-model { font-size:12px; color:var(--text-muted); margin-top:2px; }
  .spr-product-price-wrap { text-align:right; flex-shrink:0; }
  .spr-product-price-orig { font-size:11px; color:var(--text-muted); text-decoration:line-through; }
  .spr-product-price-new { font-size:14px; font-weight:700; color:#e75480; }
  .spr-empty-products { text-align:center; padding:40px 20px; color:var(--text-muted); font-size:14px; }

  /* ── Products count badge in table ── */
  .spr-prod-btn { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:600; background:#fff3e0; color:#e65100; border:1px solid #ffe0b2; cursor:pointer; transition:all .15s; }
  .spr-prod-btn:hover { background:#ffe0b2; }
  .spr-status-y { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; background:#e8f5e9; color:#2e7d32; }
  .spr-status-n { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; background:#f5f5f5; color:#9a9a9a; }
  .spr-date-text { font-size:12px; color:var(--text-secondary); white-space:nowrap; }

  /* ── Product remove / add-to-promo ── */
  .spr-prod-remove-btn { width:22px; height:22px; border-radius:50%; border:1px solid #ffd0d0; background:#fff5f5; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#c0392b; font-size:11px; flex-shrink:0; transition:all .15s; margin-left:8px; }
  .spr-prod-remove-btn:hover { background:#ffe5e5; border-color:#c0392b; }
  .spr-move-select { width:100%; padding:9px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13.5px; font-family:'Sora',sans-serif; background:var(--bg); color:var(--text-primary); outline:none; margin-top:4px; cursor:pointer; }
  .spr-move-select:focus { border-color:var(--accent-dark); background:#fff; }
  /* ── Max buy (Buy1Get1 limit) ── */
  .spr-maxbuy-row { display:flex; align-items:center; gap:5px; margin-top:5px; flex-wrap:wrap; }
  .spr-maxbuy-label { font-size:11px; color:var(--text-muted); white-space:nowrap; }
  .spr-maxbuy-input { width:58px; padding:2px 6px; border:1px solid var(--border); border-radius:6px; font-size:12px; font-family:'Sora',sans-serif; background:var(--bg); outline:none; text-align:center; }
  .spr-maxbuy-input:focus { border-color:var(--accent-dark); background:#fff; }
  .spr-quota-bar-wrap { display:flex; align-items:center; gap:6px; margin-top:5px; }
  .spr-quota-text { font-size:12px; font-weight:600; color:#e75480; white-space:nowrap; }
  .spr-quota-set { font-size:11px; color:var(--text-muted); white-space:nowrap; }
  .spr-quota-input { width:52px; padding:2px 5px; border:1px solid var(--border); border-radius:6px; font-size:12px; font-family:'Sora',sans-serif; background:var(--bg); outline:none; text-align:center; }
  .spr-quota-input:focus { border-color:var(--accent-dark); background:#fff; }
  .spr-quota-unlimited { font-size:11px; color:var(--text-muted); font-style:italic; margin-top:4px; }
  .spr-quota-reset-btn { font-size:11px; padding:2px 7px; border-radius:6px; border:1px solid #e0a0a0; background:#fff5f5; color:#c0392b; cursor:pointer; font-family:'Sora',sans-serif; transition:all .15s; }
  .spr-quota-reset-btn:hover { background:#ffe5e5; border-color:#c0392b; }
  .spr-add-section { border-top:1px solid var(--border); margin-top:12px; padding-top:12px; flex-shrink:0; }
  .spr-add-section-toggle { display:flex; align-items:center; gap:6px; background:none; border:none; cursor:pointer; font-size:13px; font-weight:600; color:var(--text-primary); padding:0; font-family:'Sora',sans-serif; }
  .spr-add-section-toggle:hover { color:#e75480; }
  .spr-add-search { width:100%; padding:7px 12px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:13px; font-family:'Sora',sans-serif; background:var(--bg); outline:none; margin:10px 0 8px; }
  .spr-add-search:focus { border-color:var(--accent-dark); background:#fff; }
  .spr-avail-list { max-height:180px; overflow-y:auto; }
  .spr-avail-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; transition:background .1s; }
  .spr-avail-item:hover { background:#fafafa; }
  .spr-avail-img { width:36px; height:36px; border-radius:6px; object-fit:cover; border:1px solid var(--border); flex-shrink:0; }
  .spr-avail-img-ph { width:36px; height:36px; border-radius:6px; background:#f0f0ec; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .spr-avail-name { flex:1; font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .spr-avail-model { font-size:11px; color:var(--text-muted); }
  .spr-avail-add-btn { width:26px; height:26px; border-radius:50%; border:none; background:var(--text-primary); color:#fff; font-size:18px; line-height:1; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:all .15s; }
  .spr-avail-add-btn:hover { background:#333; }
  .spr-avail-add-btn:disabled { opacity:.4; cursor:not-allowed; }
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
`;

const API = `${API_URL}/api/admin`;
const ROWS_PER_PAGE = 10;
const DISCOUNT_TYPES = [
  { value: "percent",  label: "Percent (%)" },
  { value: "baht",     label: "Amount (฿)" },
  { value: "buy_get",  label: "ซื้อ X แถม Y (Buy X Get Y)" },
];
const EMPTY_FORM = { Promotion_name: "", DiscountType: "percent", Discount_value: "", condition: "", StartDate: "", EndDate: "", Status: "Y", buyQty: "1", getQty: "1" };

const navItems = [
  { iconSrc: "/Dashboard.png",   label: "Dashboard",   path: "/admin" },
  { iconSrc: "/Orders.png",      label: "Orders",      path: "/admin/orders" },
  { iconSrc: "/Products.png",    label: "Products",    path: "/admin/products" },
  { iconSrc: "/Promotions.png",  label: "Promotions",  path: "/admin/promotions" },
  { iconSrc: "/price_range.png", label: "Price Range", path: "/admin/price-ranges" },
  { iconSrc: "/Members.png",     label: "Members",     path: "/admin/users" },
];

export default function AdminPromotions() {
  const memberId = sessionStorage.getItem("admin_Member_id") || sessionStorage.getItem("Member_id");
  const navigate = useNavigate();
  const location = useLocation();
  const [promos, setPromos]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [promoProducts, setPromoProducts] = useState(null); // { promo, products }
  const [loadingProds, setLoadingProds] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [addProdOpen, setAddProdOpen] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addingProd, setAddingProd] = useState(null);
  const [maxBuyEdits, setMaxBuyEdits] = useState({});
  const [adminName, setAdminName] = useState("");
  const [allTypes, setAllTypes] = useState([]);
  const [moveModal, setMoveModal] = useState({ open: false, productId: null, productName: '', selectedTypeId: '' });
  const avatarLetter = adminName ? adminName.charAt(0).toUpperCase() : "A";

  const headers = { "x-member-id": memberId };

  useEffect(() => {
    if (!memberId) return;
    fetch(`${API}/members/${memberId}`, { headers: { "x-member-id": memberId } })
      .then(r => r.json())
      .then(d => { if (d.Username || d.Name) setAdminName(d.Name || d.Username); })
      .catch(() => {});
  }, [memberId]);

  useEffect(() => {
    fetch(`${API}/types`, { headers })
      .then(r => r.json())
      .then(d => setAllTypes(Array.isArray(d) ? d : (Array.isArray(d.types) ? d.types : [])))
      .catch(() => {});
  }, []);

  const openPromoProducts = async (promo) => {
    setLoadingProds(true);
    setPromoProducts({ promo, products: [] });
    setAddProdOpen(false);
    setAddSearch("");
    setMaxBuyEdits({});
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API}/promotions/${promo.Promotion_id}/products`, { headers }),
        fetch(`${API}/products`, { headers }),
      ]);
      const d1 = await r1.json();
      const d2 = await r2.json();
      setPromoProducts({ promo, products: d1.products || [] });
      setAllProducts(d2.products || []);
    } catch {
      setPromoProducts({ promo, products: [] });
      setAllProducts([]);
    }
    setLoadingProds(false);
  };

  const handleAddProduct = async (product) => {
    setAddingProd(product.Product_id);
    try {
      await fetch(`${API}/promotions/${promoProducts.promo.Promotion_id}/products`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ Product_id: product.Product_id }),
      });
      const res = await fetch(`${API}/promotions/${promoProducts.promo.Promotion_id}/products`, { headers });
      const data = await res.json();
      setPromoProducts(prev => ({ ...prev, products: data.products || [] }));
    } catch {}
    setAddingProd(null);
  };

  const handleRemoveProduct = (productId) => {
    const prod = (promoProducts?.products || []).find(p => p.Product_id === productId);
    setMoveModal({ open: true, productId, productName: prod?.Product_name || '', selectedTypeId: '' });
  };

  const confirmMoveProduct = async () => {
    const { productId, selectedTypeId } = moveModal;
    setMoveModal(prev => ({ ...prev, open: false }));
    try {
      // 1) ลบออกจาก pro_product
      await fetch(`${API}/promotions/${promoProducts.promo.Promotion_id}/products/${productId}`, {
        method: 'DELETE', headers,
      });
      // 2) เปลี่ยน Type_id ถ้าเลือก
      if (selectedTypeId) {
        await fetch(`${API}/products/${productId}/type`, {
          method: 'PATCH',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ Type_id: selectedTypeId }),
        });
      }
      setPromoProducts(prev => ({
        ...prev,
        products: prev.products.filter(p => p.Product_id !== productId),
      }));
    } catch {}
  };

  const handleResetQuota = async (productId) => {
    if (!window.confirm('รีเซ็ตโควต้าที่ใช้ไปกลับเป็น 0 ใช่ไหม?')) return;
    try {
      const res = await fetch(`${API}/promotions/${promoProducts.promo.Promotion_id}/products/${productId}/reset-quota`, {
        method: 'PUT',
        headers,
      });
      if (!res.ok) throw new Error('reset failed');
      // re-fetch จาก DB เพื่อให้ค่าตรงจริง
      const r = await fetch(`${API}/promotions/${promoProducts.promo.Promotion_id}/products`, { headers });
      const data = await r.json();
      setPromoProducts(prev => ({ ...prev, products: data.products || [] }));
    } catch {
      alert('รีเซ็ตไม่สำเร็จ — กรุณา restart backend แล้วลองใหม่');
    }
  };

  const handleUpdateMaxBuy = async (productId, value) => {
    const maxBuy = parseInt(value, 10);
    if (isNaN(maxBuy) || maxBuy < 0) return;
    try {
      await fetch(`${API}/promotions/${promoProducts.promo.Promotion_id}/products/${productId}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ Max_buy: maxBuy }),
      });
      setPromoProducts(prev => ({
        ...prev,
        products: prev.products.map(p =>
          p.Product_id === productId ? { ...p, Max_buy: maxBuy } : p
        ),
      }));
    } catch {}
  };

  const calcFinalPrice = (price, promo) => {
    const p = Number(price);
    if (!p) return null;
    const val = Number(String(promo.Discount_value).replace('%', ''));
    if (!val) return null;
    if (promo.DiscountType === 'percent') return Math.round(p * (1 - val / 100));
    if (promo.DiscountType === 'baht') return Math.max(0, p - val);
    return null;
  };

  const load = () => {
    setLoading(true);
    fetch(`${API}/promotions`, { headers })
      .then(r => r.json())
      .then(d => { setPromos(d.promotions || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const fmtDateInput = (dt) => {
    if (!dt) return "";
    const d = new Date(dt);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  const fmtDateDisplay = (dt) => {
    if (!dt) return "-";
    const d = new Date(dt);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setModal(true); };

  const openEdit = (p) => {
    let discType = p.DiscountType || "percent";
    if (discType === 'percentage') discType = 'percent'; // normalize old DB value
    let buyQ = "1", getQ = "1";
    const buyGetMatch = typeof discType === 'string' && discType.match(/^buy\s+(\d+)\s+get\s+(\d+)/i);
    if (buyGetMatch) { buyQ = buyGetMatch[1]; getQ = buyGetMatch[2]; discType = "buy_get"; }
    setForm({
      Promotion_name: p.Promotion_name || "",
      DiscountType:   discType,
      Discount_value: p.Discount_value != null ? String(p.Discount_value).replace("%", "") : "",
      condition:      p.condition      || "",
      StartDate:      fmtDateInput(p.StartDate),
      EndDate:        fmtDateInput(p.EndDate),
      Status:         p.Status || "Y",
      buyQty: buyQ,
      getQty: getQ,
    });
    setEditId(p.Promotion_id);
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editId ? `${API}/promotions/${editId}` : `${API}/promotions`;
    const payload = { ...form };
    if (form.DiscountType === "buy_get") {
      payload.DiscountType = `buy ${form.buyQty || 1} get ${form.getQty || 1}`;
      payload.Discount_value = 0;
    }
    delete payload.buyQty;
    delete payload.getQty;
    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false); setModal(false); load();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/promotions/${id}`, { method: "DELETE", headers });
    setConfirmDelete(null); load();
  };

  const filtered = promos.filter(p =>
    `${p.Promotion_id} ${p.Promotion_name} ${p.condition}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData   = filtered.slice((activePage - 1) * ROWS_PER_PAGE, activePage * ROWS_PER_PAGE);
  const changePage = (p) => { if (p >= 1 && p <= totalPages) setActivePage(p); };

  return (
    <>
      <style>{styles}</style>
      <div className="spr-app">

        {/* SIDEBAR */}
        <aside className="spr-sidebar">
          <div className="spr-logo">
            <div className="spr-logo-romd">rom&amp;nd</div>
            <div className="spr-logo-tagline"></div>
          </div>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`spr-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.iconSrc ? <img src={item.iconSrc} alt={item.label} className="spr-nav-icon" /> : <span style={{width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>🏷️</span>}
              {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            className="spr-nav-item"
            onClick={() => { sessionStorage.clear(); window.location.href = "/"; }}
          >
            <img src="/logout.png" alt="Logout" className="spr-nav-icon" />
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="spr-main">
          <div className="spr-topbar">
            <div>
              <div className="spr-topbar-title">Promotion Management</div>
              <div className="spr-topbar-sub"></div>
            </div>
            <div className="spr-topbar-actions">
              <div className="spr-avatar">{avatarLetter}<span className="spr-avatar-dot" /></div>
            </div>
          </div>

          <div className="spr-content">
            <div className="spr-card">
              <div className="spr-table-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="spr-table-title">Promotion List</div>
                  <span className="spr-table-count">{filtered.length} LISTS</span>
                </div>
                <div className="spr-table-controls">
                  <div className="spr-search-wrap">
                    <button
                      className="spr-search-toggle-btn"
                      onClick={() => { if (searchOpen) { setSearch(""); setActivePage(1); } setSearchOpen(v => !v); }}
                    >
                      {searchOpen ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      )}
                    </button>
                    {searchOpen && (
                      <input
                        className="spr-search-input"
                        placeholder="Search promotions..."
                        value={search}
                        autoFocus
                        onChange={e => { setSearch(e.target.value); setActivePage(1); }}
                      />
                    )}
                  </div>
                  <button className="spr-add-btn" onClick={openNew}>+ Add Promotion</button>
                </div>
              </div>

              <div className="spr-table-wrap">
                {loading ? (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Loading...</div>
                ) : pageData.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No promotions found</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Promotion Name</th>
                        <th>Products</th>
                        <th>Discount</th>
                        <th>Condition</th>
                        <th>StartDate/EndDate</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.map(p => (
                        <tr key={p.Promotion_id}>
                          <td className="spr-td-id">{p.Promotion_id}</td>
                          <td style={{ fontWeight: 500 }}>{p.Promotion_name}</td>
                          <td>
                            <button className="spr-prod-btn" onClick={() => openPromoProducts(p)}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                              ดูสินค้า
                            </button>
                          </td>
                          <td style={{ fontWeight: 600, color: "#e75480" }}>
                            {/^buy\s+\d+\s+get\s+\d+/i.test(p.DiscountType || '')
                              ? <span style={{background:'#fff3e0',color:'#e65100',padding:'2px 8px',borderRadius:'12px',fontSize:'12px',fontWeight:700}}>{p.DiscountType}</span>
                              : p.Discount_value != null
                                ? `${String(p.Discount_value).replace("%", "")}${(p.DiscountType === "percent" || p.DiscountType === "percentage") ? "%" : " \u0e3f"}`
                                : "-"}
                          </td>
                          <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{p.condition || "-"}</td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                              <span className="spr-date-text">{fmtDateDisplay(p.StartDate)}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ถึง</span>
                              <span className="spr-date-text">{fmtDateDisplay(p.EndDate)}</span>
                            </div>
                          </td>
                          <td>
                            {p.Status === 'Y'
                              ? <span className="spr-status-y">● Active</span>
                              : <span className="spr-status-n">● Inactive</span>}
                          </td>
                          <td>
                            <div className="spr-action-btns">
                              <button className="spr-action-btn spr-btn-edit" onClick={() => openEdit(p)} title="Edit">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button className="spr-action-btn spr-btn-del" onClick={() => setConfirmDelete(p)} title="Delete">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
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
              <div className="spr-pagination">
                <button className="spr-page-arrow" onClick={() => changePage(activePage - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`spr-page-btn ${activePage === p ? "active" : ""}`} onClick={() => changePage(p)}>{p}</button>
                ))}
                <button className="spr-page-arrow" onClick={() => changePage(activePage + 1)}>›</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div className="spr-modal-backdrop" onClick={() => setModal(false)}>
          <div className="spr-modal" onClick={e => e.stopPropagation()}>
            <button className="spr-modal-close" onClick={() => setModal(false)}>✕</button>
            <h3>{editId ? `Edit Promotion #${editId}` : "Add New Promotion"}</h3>
            <div className="spr-form-grid">
              <div className="full">
                <label className="spr-form-label">Promotion Name</label>
                <input className="spr-form-input" placeholder="e.g. Summer Sale 20%" value={form.Promotion_name} onChange={e => setForm(f => ({ ...f, Promotion_name: e.target.value }))} />
              </div>
              <div>
                <label className="spr-form-label">Discount Type</label>
                <select className="spr-form-select" value={form.DiscountType} onChange={e => setForm(f => ({ ...f, DiscountType: e.target.value, Discount_value: e.target.value === 'buy_get' ? '0' : f.Discount_value }))}>
                  {DISCOUNT_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              {form.DiscountType === "buy_get" ? (
                <div style={{display:'flex', gap:'10px', alignItems:'flex-end'}}>
                  <div style={{flex:1}}>
                    <label className="spr-form-label">ซื้อ (Buy)</label>
                    <input className="spr-form-input" type="number" min="1" value={form.buyQty} onChange={e => setForm(f => ({...f, buyQty: e.target.value}))} />
                  </div>
                  <div style={{paddingBottom:'9px', color:'var(--text-muted)', fontWeight:700, fontSize:'16px', flexShrink:0}}>แถม</div>
                  <div style={{flex:1}}>
                    <label className="spr-form-label">แถม (Get Free)</label>
                    <input className="spr-form-input" type="number" min="1" value={form.getQty} onChange={e => setForm(f => ({...f, getQty: e.target.value}))} />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="spr-form-label">Discount Value {form.DiscountType === "percent" ? "(%)" : "(฿)"}</label>
                  <input className="spr-form-input" type="number" min="0" placeholder={form.DiscountType === "percent" ? "e.g. 20" : "e.g. 100"} value={form.Discount_value} onChange={e => setForm(f => ({ ...f, Discount_value: e.target.value }))} />
                </div>
              )}
              <div>
                <label className="spr-form-label">Start Date</label>
                <input className="spr-form-input" type="date" value={form.StartDate} onChange={e => setForm(f => ({ ...f, StartDate: e.target.value }))} />
              </div>
              <div>
                <label className="spr-form-label">End Date</label>
                <input className="spr-form-input" type="date" value={form.EndDate} onChange={e => setForm(f => ({ ...f, EndDate: e.target.value }))} />
              </div>
              <div>
                <label className="spr-form-label">Status</label>
                <select className="spr-form-select" value={form.Status} onChange={e => setForm(f => ({ ...f, Status: e.target.value }))}>
                  <option value="Y">● Active (เปิดใช้งาน)</option>
                  <option value="N">● Inactive (ปิดใช้งาน)</option>
                </select>
              </div>
              <div className="full">
                <label className="spr-form-label">Condition</label>
                <textarea className="spr-form-textarea" placeholder="e.g. Minimum order 500 ฿" value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} />
              </div>
            </div>
            <div className="spr-modal-actions">
              <button className="spr-modal-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="spr-modal-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* PROMO PRODUCTS MODAL */}
      {promoProducts && (
        <div className="spr-modal-backdrop" onClick={() => setPromoProducts(null)}>
          <div className="spr-modal spr-promo-modal" onClick={e => e.stopPropagation()}>
            <button className="spr-modal-close" onClick={() => setPromoProducts(null)}>✕</button>
            <div className="spr-promo-modal-title">🛍️ {promoProducts.promo.Promotion_name}</div>
            <div className="spr-promo-modal-sub">{promoProducts.promo.condition}</div>
            <div className="spr-promo-info-row">
              <span className={`spr-promo-tag ${promoProducts.promo.DiscountType === 'percent' ? 'spr-promo-tag-percent' : 'spr-promo-tag-baht'}`}>
                {promoProducts.promo.DiscountType === 'percent' ? 'Percent' : 'Amount'}
              </span>
              <span className="spr-promo-discount-val">
                {promoProducts.promo.Discount_value != null
                  ? `${String(promoProducts.promo.Discount_value).replace('%','')}${promoProducts.promo.DiscountType === 'percent' ? '% off' : ' ฿ off'}`
                  : '-'}
              </span>
              <span className="spr-promo-count">· {promoProducts.products.length} สินค้า</span>
            </div>
            <div className="spr-product-list">
              {loadingProds ? (
                <div className="spr-empty-products">กำลังโหลด...</div>
              ) : promoProducts.products.length === 0 ? (
                <div className="spr-empty-products">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                  ยังไม่มีสินค้าในโปรโมชั่นนี้
                </div>
              ) : (
                promoProducts.products.map((prod, i) => {
                  const finalPrice = calcFinalPrice(prod.Product_price, promoProducts.promo);
                  const isBuy1Get1 = promoProducts.promo.DiscountType === 'buy 1 get 1';
                  return (
                    <div className="spr-product-item" key={prod.Product_id || i}>
                      {prod.image_url ? (
                        <img className="spr-product-img" src={prod.image_url} alt={prod.Product_name}
                          onError={e => { e.target.style.display='none'; }}
                        />
                      ) : (
                        <div className="spr-product-img-ph">🧴</div>
                      )}
                      <div className="spr-product-info">
                        <div className="spr-product-name">{prod.Product_name}</div>
                        <div className="spr-product-model">{prod.Product_model || ''}</div>
                        {isBuy1Get1 && (() => {
                          const quota = prod.Max_buy ?? 0;
                          const used  = prod.Promo_used ?? 0;
                          const remaining = quota > 0 ? quota - used : null;
                          const editVal = maxBuyEdits[prod.Product_id] ?? quota;
                          return (
                            <div>
                              {quota > 0 ? (
                                <div className="spr-quota-bar-wrap">
                                  <span className="spr-quota-text" style={remaining === 0 ? {color:'#c0392b'} : {}}>เหลือ {remaining} / {quota} ชิ้น</span>
                                  {used > 0 && (
                                    <button
                                      className="spr-quota-reset-btn"
                                      onClick={() => handleResetQuota(prod.Product_id)}
                                      title="รีเซ็ตโควต้าที่ใช้ไปกลับเป็น 0"
                                    >รีเซ็ต</button>
                                  )}
                                </div>
                              ) : (
                                <div className="spr-quota-unlimited">ไม่จำกัดโควต้า</div>
                              )}
                              <div className="spr-quota-bar-wrap">
                                <span className="spr-quota-set">โควต้าทั้งหมด:</span>
                                <input
                                  className="spr-quota-input"
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={editVal}
                                  onChange={e => setMaxBuyEdits(prev => ({ ...prev, [prod.Product_id]: e.target.value }))}
                                  onBlur={e => handleUpdateMaxBuy(prod.Product_id, e.target.value)}
                                />
                                <span className="spr-quota-set">ชิ้น (0=ไม่จำกัด)</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="spr-product-price-wrap">
                        {finalPrice && finalPrice !== Number(prod.Product_price) && (
                          <div className="spr-product-price-orig">฿{Number(prod.Product_price).toLocaleString()}</div>
                        )}
                        <div className="spr-product-price-new">
                          ฿{(finalPrice ?? Number(prod.Product_price)).toLocaleString()}
                        </div>
                      </div>
                      <button className="spr-prod-remove-btn" onClick={() => handleRemoveProduct(prod.Product_id)} title="นำออกจากโปรโมชั่น">✕</button>
                    </div>
                  );
                })
              )}
            </div>

            {/* ADD PRODUCTS SECTION */}
            {(() => {
              const inIds = new Set((promoProducts.products || []).map(p => p.Product_id));
              const available = allProducts
                .filter(p => !inIds.has(p.Product_id))
                .filter(p => !addSearch || `${p.Product_name} ${p.Product_model || ''}`.toLowerCase().includes(addSearch.toLowerCase()));
              return (
                <div className="spr-add-section">
                  <button className="spr-add-section-toggle" onClick={() => setAddProdOpen(v => !v)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {addProdOpen
                        ? <line x1="5" y1="12" x2="19" y2="12"/>
                        : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
                    </svg>
                    {addProdOpen ? 'ซ่อน' : 'เพิ่มสินค้าเข้าโปรโมชั่น'}
                  </button>
                  {addProdOpen && (
                    <>
                      <input
                        className="spr-add-search"
                        placeholder="ค้นหาสินค้า..."
                        value={addSearch}
                        onChange={e => setAddSearch(e.target.value)}
                        autoFocus
                      />
                      <div className="spr-avail-list">
                        {available.length === 0 ? (
                          <div style={{ padding: '12px 0', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                            {addSearch ? 'ไม่พบสินค้า' : 'สินค้าทั้งหมดอยู่ในโปรโมชั่นนี้แล้ว'}
                          </div>
                        ) : available.map(p => (
                          <div className="spr-avail-item" key={p.Product_id}>
                            {p.Image ? (
                              <img className="spr-avail-img" src={`${API_URL}/uploads/${p.Image}`} alt={p.Product_name} onError={e => { e.target.style.display = 'none'; }} />
                            ) : (
                              <div className="spr-avail-img-ph">🧴</div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="spr-avail-name">{p.Product_name}</div>
                              <div className="spr-avail-model">{p.Product_model || ''}</div>
                            </div>
                            <button
                              className="spr-avail-add-btn"
                              disabled={addingProd === p.Product_id}
                              onClick={() => handleAddProduct(p)}
                              title="เพิ่มเข้าโปรโมชั่น"
                            >
                              {addingProd === p.Product_id ? '…' : '+'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            <div className="spr-modal-actions" style={{ marginTop: 16 }}>
              <button className="spr-modal-cancel" onClick={() => setPromoProducts(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="spr-modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="spr-modal" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>
              Delete promotion <strong>{confirmDelete.Promotion_name}</strong>? This cannot be undone.
            </p>
            <div className="spr-modal-actions">
              <button className="spr-modal-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="spr-modal-save spr-modal-del" onClick={() => handleDelete(confirmDelete.Promotion_id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {moveModal.open && (
        <div className="spr-modal-backdrop" onClick={() => setMoveModal(prev => ({ ...prev, open: false }))}>
          <div className="spr-modal" style={{ width: 400 }} onClick={e => e.stopPropagation()}>
            <button className="spr-modal-close" onClick={() => setMoveModal(prev => ({ ...prev, open: false }))}>✕</button>
            <h3>นำสินค้าออกจากโปรโมชั่น</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 16 }}>
              <strong>{moveModal.productName}</strong> จะถูกนำออกจากโปรโมชั่น<br/>
              เลือกหมวดหมู่ใหม่ที่ต้องการย้ายไป:
            </p>
            <select
              className="spr-move-select"
              value={moveModal.selectedTypeId}
              onChange={e => setMoveModal(prev => ({ ...prev, selectedTypeId: e.target.value }))}
            >
              <option value="">— ไม่เปลี่ยนหมวดหมู่ (ลบออกจากโปรโมชั่นเท่านั้น) —</option>
              {allTypes
                .filter(t => !['promotion', 'best'].includes(t.Type_name.toLowerCase()))
                .map(t => (
                  <option key={t.Type_id} value={t.Type_id}>{t.Type_name.toUpperCase()}</option>
                ))
              }
            </select>
            <div className="spr-modal-actions" style={{ marginTop: 24 }}>
              <button className="spr-modal-cancel" onClick={() => setMoveModal(prev => ({ ...prev, open: false }))}>ยกเลิก</button>
              <button className="spr-modal-save spr-modal-del" onClick={confirmMoveProduct}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
