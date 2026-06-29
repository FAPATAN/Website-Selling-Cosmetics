import API_URL from '../../config';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
  :root {
    --bg:#f0f0ec;--sidebar-bg:#e8e8e4;--card-bg:#ffffff;
    --accent:#FFC2D1;--accent-dark:#ffaabf;
    --text-primary:#1a1a1a;--text-secondary:#6b6b6b;--text-muted:#9a9a9a;
    --border:rgba(0,0,0,0.08);--shadow:0 2px 16px rgba(0,0,0,0.06);
    --radius:16px;--radius-sm:10px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  .sp-app{display:flex;height:100vh;background:var(--bg);font-family:'Sora',sans-serif;color:var(--text-primary);}
  .sp-sidebar{width:200px;background:var(--sidebar-bg);display:flex;flex-direction:column;padding:24px 16px;gap:4px;flex-shrink:0;}
  .sp-logo{display:flex;flex-direction:column;padding:8px 12px 24px;}
  .sp-logo-romd{font-family:'Georgia',serif;font-size:28px;font-weight:100;letter-spacing:1.5px;line-height:1;color:#333333;text-transform:lowercase;}
  .sp-logo-tagline{font-size:7.5px;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);margin-top:3px;}
  .sp-nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius-sm);font-size:13.5px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:all .15s ease;border:none;background:none;text-align:left;width:100%;}
  .sp-nav-item:hover{background:rgba(0,0,0,0.05);color:var(--text-primary);}
  .sp-nav-item.active{background:#FFC2D1;color:var(--text-primary);font-weight:600;}
  .sp-nav-icon{width:20px;height:20px;object-fit:contain;flex-shrink:0;opacity:0.7;transition:opacity .15s;}
  .sp-nav-item:hover .sp-nav-icon{opacity:1;}
  .sp-nav-item.active .sp-nav-icon{opacity:1;filter:brightness(0) invert(1);}
  .sp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .sp-topbar{display:flex;align-items:flex-start;justify-content:space-between;padding:24px 32px 20px;}
  .sp-topbar-title{font-size:26px;font-weight:700;letter-spacing:-.5px;}
  .sp-topbar-sub{font-size:13px;color:var(--text-muted);margin-top:2px;}
  .sp-topbar-actions{display:flex;align-items:center;gap:8px;}
  .sp-icon-btn{width:38px;height:38px;border-radius:50%;border:none;background:var(--card-bg);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;color:var(--text-secondary);transition:all .15s;position:relative;box-shadow:var(--shadow);}
  .sp-icon-btn:hover{background:var(--accent);}
  .sp-notif-badge{position:absolute;top:4px;right:4px;width:8px;height:8px;background:#ff4757;border-radius:50%;border:2px solid var(--bg);}
  .sp-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#f093fb,#f5576c);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;cursor:pointer;position:relative;}
  .sp-avatar-dot{position:absolute;bottom:2px;right:2px;width:8px;height:8px;background:#2ed573;border-radius:50%;border:2px solid var(--bg);}
  .sp-content{flex:1;padding:0 24px 24px;overflow:hidden;display:flex;flex-direction:column;}
  .sp-card{background:var(--card-bg);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;flex:1;display:flex;flex-direction:column;}
  .sp-table-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;}
  .sp-table-title{font-size:16px;font-weight:700;letter-spacing:-.3px;}
  .sp-table-count{font-size:13px;color:var(--text-muted);background:var(--bg);padding:3px 10px;border-radius:20px;margin-left:8px;font-weight:500;}
  .sp-table-controls{display:flex;gap:10px;align-items:center;}
  .sp-search-wrap{display:flex;align-items:center;gap:6px;}
  .sp-search-toggle-btn{width:36px;height:36px;border-radius:var(--radius-sm);border:1px solid var(--border);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);transition:all .15s;}
  .sp-search-toggle-btn:hover{background:var(--bg);border-color:var(--text-primary);color:var(--text-primary);}
  .sp-search-input{padding:8px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg);font-size:13px;font-family:'Sora',sans-serif;color:var(--text-primary);outline:none;width:200px;animation:sp-input-in .2s ease;}
  @keyframes sp-input-in{from{opacity:0;width:0;padding:8px 0;}to{opacity:1;width:200px;padding:8px 14px;}}
  .sp-search-input:focus{border-color:var(--accent-dark);background:#fff;}
  .sp-add-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--radius-sm);border:none;background:var(--text-primary);color:#fff;font-size:13px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:all .15s;}
  .sp-add-btn:hover{background:#333;}
  .sp-table-wrap{flex:1;overflow-y:auto;padding:0 24px;}
  .sp-table-wrap table{width:100%;border-collapse:collapse;}
  .sp-table-wrap thead th{text-align:center;font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;padding:10px 12px;background:var(--bg);position:sticky;top:0;}
  .sp-table-wrap thead th:first-child{border-radius:var(--radius-sm) 0 0 var(--radius-sm);}
  .sp-table-wrap thead th:last-child{border-radius:0 var(--radius-sm) var(--radius-sm) 0;}
  .sp-table-wrap tbody tr{border-bottom:1px solid var(--border);transition:background .1s;}
  .sp-table-wrap tbody tr:last-child{border-bottom:none;}
  .sp-table-wrap tbody tr:hover{background:#fafafa;}
  .sp-table-wrap td{padding:13px 12px;font-size:13.5px;color:var(--text-primary);text-align:center;}
  .sp-td-id{font-family:monospace;font-size:12px;color:var(--text-muted);}
  .sp-thumb{width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid var(--border);}
  .sp-thumb-ph{width:44px;height:44px;border-radius:8px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:18px;border:1px solid var(--border);}
  .sp-action-btns{display:flex;gap:6px;justify-content:center;}
  .sp-action-btn{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;padding:0;}
  .sp-action-btn img{width:16px;height:16px;object-fit:contain;}
  .sp-btn-edit{color:var(--text-secondary);}
  .sp-btn-edit:hover{background:#DDF2D1;border-color:#DDF2D1;}
  .sp-btn-del{color:var(--text-secondary);}
  .sp-btn-del:hover{background:#FFE5EC;border-color:#FFE5EC;}
  .sp-btn-gallery{color:var(--text-secondary);}
  .sp-btn-gallery:hover{background:#E0F0FF;border-color:#E0F0FF;}
  .sp-pagination{display:flex;align-items:center;justify-content:center;gap:6px;padding:16px 24px;border-top:1px solid var(--border);}
  .sp-page-btn{width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;font-weight:500;color:var(--text-secondary);transition:all .15s;font-family:'Sora',sans-serif;}
  .sp-page-btn:hover{border-color:var(--text-primary);color:var(--text-primary);}
  .sp-page-btn.active{background:var(--accent);border-color:var(--accent);color:var(--text-primary);font-weight:700;}
  .sp-page-arrow{width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);transition:all .15s;font-size:16px;}
  .sp-page-arrow:hover{background:var(--bg);}
  .sp-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(2px);}
  .sp-modal{background:#fff;border-radius:var(--radius);padding:32px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.15);}
  .sp-modal h3{font-size:16px;font-weight:700;margin-bottom:20px;}
  .sp-modal-close{position:absolute;top:16px;right:16px;width:30px;height:30px;border-radius:50%;border:none;background:var(--bg);cursor:pointer;font-size:13px;color:var(--text-secondary);display:flex;align-items:center;justify-content:center;transition:all .15s;}
  .sp-modal-close:hover{background:#ffe0e0;color:#c0392b;}
  .sp-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;}
  .sp-form-grid .full{grid-column:1/-1;}
  .sp-form-label{font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px;}
  .sp-form-input,.sp-form-select,.sp-form-textarea{width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13.5px;font-family:'Sora',sans-serif;color:var(--text-primary);background:var(--bg);outline:none;transition:border-color .15s;}
  .sp-form-input:focus,.sp-form-select:focus,.sp-form-textarea:focus{border-color:var(--accent-dark);background:#fff;}
  .sp-form-textarea{resize:vertical;min-height:70px;}
  .sp-modal-actions{display:flex;justify-content:flex-end;gap:10px;}
  .sp-modal-cancel{padding:9px 20px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg);font-size:13.5px;font-family:'Sora',sans-serif;cursor:pointer;color:var(--text-secondary);transition:all .15s;}
  .sp-modal-cancel:hover{border-color:var(--text-primary);color:var(--text-primary);}
  .sp-modal-save{padding:9px 20px;border-radius:var(--radius-sm);border:none;background:var(--text-primary);color:#fff;font-size:13.5px;font-weight:600;font-family:'Sora',sans-serif;cursor:pointer;transition:all .15s;}
  .sp-modal-save:hover{background:#333;}
  .sp-modal-save:disabled{opacity:.5;cursor:not-allowed;}
  .sp-modal-del{background:#c0392b;}.sp-modal-del:hover{background:#a93226;}
  .sp-cat-bar{display:flex;gap:8px;flex-wrap:wrap;padding:0 24px 16px;}
  .sp-cat-pill{display:flex;flex-direction:column;align-items:flex-start;padding:10px 16px;border-radius:var(--radius-sm);border:1px solid var(--border);background:#fff;cursor:pointer;transition:all .15s;min-width:72px;font-family:'Sora',sans-serif;}
  .sp-cat-pill:hover{border-color:var(--accent-dark);background:#fff;}
  .sp-cat-pill.active{background:var(--text-primary);border-color:var(--text-primary);color:#fff;}
  .sp-cat-pill-label{font-size:12px;font-weight:500;white-space:nowrap;}
  .sp-cat-pill-count{font-size:15px;font-weight:700;margin-top:2px;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
  .sp-color-swatch{display:inline-block;width:20px;height:20px;border-radius:50%;border:2px solid rgba(0,0,0,0.12);cursor:pointer;flex-shrink:0;transition:transform .15s;}
  .sp-color-swatch:hover{transform:scale(1.15);}
  .sp-color-empty{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;border:1.5px dashed #ccc;color:#ccc;font-size:13px;cursor:pointer;transition:all .15s;}
  .sp-color-empty:hover{border-color:#FFC2D1;color:#FFC2D1;}
  .sp-color-picker-wrap{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
  .sp-color-picker-input{width:44px;height:36px;border-radius:8px;border:1px solid var(--border);padding:2px;cursor:pointer;background:none;}
  .sp-color-hex-input{flex:1;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:'Sora',sans-serif;color:var(--text-primary);background:var(--bg);outline:none;}
  .sp-color-hex-input:focus{border-color:var(--accent-dark);background:#fff;}
  .sp-color-clear-btn{padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:none;font-size:12px;cursor:pointer;color:var(--text-secondary);font-family:'Sora',sans-serif;transition:all .15s;}
  .sp-color-clear-btn:hover{background:#ffe0e0;border-color:#ffaaaa;color:#c0392b;}
  .sp-gallery-grid{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;}
  .sp-gallery-item{position:relative;width:80px;height:80px;border-radius:8px;overflow:hidden;border:1px solid var(--border);}
  .sp-gallery-item img{width:100%;height:100%;object-fit:cover;}
  .sp-gallery-del{position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;border:none;background:rgba(0,0,0,0.55);color:#fff;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
  .sp-gallery-del:hover{background:#c0392b;}
  .sp-gallery-empty{color:var(--text-muted);font-size:13px;margin-bottom:16px;}
`;

const API = `${API_URL}/api/admin`;
const ROWS_PER_PAGE = 10;
const EMPTY_FORM = {
  Type_id: "", Product_name: "", Product_model: "",
  Product_price: "", imageFile: null, detailImageFile: null, Color: "", Stock: "", Sale_date: "", Description: "",
};

const navItems = [
  { iconSrc: "/Dashboard.png",   label: "Dashboard",   path: "/admin" },
  { iconSrc: "/Orders.png",      label: "Orders",      path: "/admin/orders" },
  { iconSrc: "/Products.png",    label: "Products",    path: "/admin/products" },
  { iconSrc: "/Promotions.png",  label: "Promotions",  path: "/admin/promotions" },
  { iconSrc: "/price_range.png", label: "Price Range", path: "/admin/price-ranges" },
  { iconSrc: "/Members.png",     label: "Members",     path: "/admin/users" },
];

export default function AdminProducts() {
  const memberId = sessionStorage.getItem("admin_Member_id") || sessionStorage.getItem("Member_id");
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [types, setTypes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [preview, setPreview]   = useState(null);
  const [detailPreview, setDetailPreview] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(location.state?.category || "all");
  const [galleryModal, setGalleryModal] = useState(false);
  const [galleryProductId, setGalleryProductId] = useState(null);
  const [galleryProductName, setGalleryProductName] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [gallerySaving, setGallerySaving] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [clearDetailImage, setClearDetailImage] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [soldModal, setSoldModal] = useState({ open: false, productId: null, productName: '', value: '' });
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
    Promise.all([
      fetch(`${API}/products`, { headers }).then(r => r.json()),
      fetch(`${API}/types`,    { headers }).then(r => r.json()),
    ]).then(([pd, td]) => {
      setProducts(pd.products || []);
      setTypes(td.types || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setForm(EMPTY_FORM); setPreview(null); setDetailPreview(null); setEditId(null); setClearDetailImage(false); setModal(true); };

  const openEdit = (p) => {
    setForm({
      Type_id: p.Type_id || "", Product_name: p.Product_name || "",
      Product_model: p.Product_model || "",
      Product_price: p.Product_price || "", imageFile: null, detailImageFile: null, Color: p.Color || "", Stock: p.Stock !== undefined ? String(p.Stock) : "",
      Sale_date: p.Sale_date ? p.Sale_date.split('T')[0] : "", Description: p.Description || "",
    });
    setPreview(p.Image ? `${API_URL}/uploads/${p.Image}` : null);
    setDetailPreview(p.Product_detail ? `${API_URL}/uploads/${p.Product_detail}` : null);
    setEditId(p.Product_id);
    setClearDetailImage(false);
    setModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleDetailImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, detailImageFile: file }));
    setDetailPreview(URL.createObjectURL(file));
    setClearDetailImage(false);
  };

  const handleSave = async () => {
    setSaveError("");
    // Validate required fields before sending to prevent wasted AUTO_INCREMENT IDs
    if (!form.Type_id) return setSaveError("?????????? Category");
    if (!form.Product_name.trim()) return setSaveError("???????????????????");
    if (!form.Product_price || isNaN(Number(form.Product_price)) || Number(form.Product_price) <= 0) return setSaveError("???????????????????????");
    if (!editId && !form.imageFile) return setSaveError("??????????????????????");
    if (!memberId) return setSaveError("????? login ???????? (????? Member_id)");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("Type_id", form.Type_id);
      fd.append("Product_name", form.Product_name);
      fd.append("Product_model", form.Product_model);
      fd.append("Product_price", form.Product_price);
      fd.append("Color", form.Color || "");
      if (form.Stock !== "") fd.append("Stock", form.Stock);
      fd.append("Sale_date", form.Sale_date || "");
      fd.append("Description", form.Description || "");
      if (form.imageFile) fd.append("image", form.imageFile);
      if (form.detailImageFile) fd.append("detailImage", form.detailImageFile);
      if (clearDetailImage) fd.append("clearDetail", "1");
      const url = editId ? `${API}/products/${editId}` : `${API}/products`;
      const res = await fetch(url, { method: editId ? "PUT" : "POST", headers, body: fd }).catch(e => { throw new Error(`????????? server ?????? — ??????? backend ??????? (port 5000)\n[${e.name}: ${e.message}]`); });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error || `??????????????? (${res.status})`);
      setSaving(false); setModal(false); load();
    } catch (err) {
      setSaveError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/products/${id}`, { method: "DELETE", headers });
    setConfirmDelete(null); load();
  };

  const loadGallery = async (productId) => {
    try {
      const res = await fetch(`${API}/products/${productId}/images`, { headers });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      setGalleryImages(data.images || []);
    } catch (err) {
      setGalleryError(`????????????????: ${err.message}`);
    }
  };

  const openGallery = (p) => {
    setGalleryProductId(p.Product_id);
    setGalleryProductName(p.Product_name);
    setGalleryFiles([]);
    setGalleryError('');
    setGalleryModal(true);
    loadGallery(p.Product_id);
  };

  const handleGalleryUpload = async () => {
    if (!galleryFiles.length) return;
    setGalleryUploading(true);
    setGalleryError('');
    try {
      for (const file of galleryFiles) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await fetch(`${API}/products/${galleryProductId}/images`, { method: 'POST', headers, body: fd });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || `???????????????? (HTTP ${res.status})`);
        }
      }
      setGalleryFiles([]);
      await loadGallery(galleryProductId);
    } catch (err) {
      if (err.name === 'TypeError') {
        setGalleryError('????????? server ?????? — ??????? backend ??????? (port 5000)');
      } else {
        setGalleryError(`????????????????: ${err.message}`);
      }
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleGalleryDelete = async (imgId) => {
    await fetch(`${API}/products-images/${imgId}`, { method: 'DELETE', headers });
    await loadGallery(galleryProductId);
  };

  const moveGalleryImage = (idx, direction) => {
    setGalleryImages(prev => {
      const arr = [...prev];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= arr.length) return arr;
      [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
      return arr;
    });
  };

  const handleGallerySaveOrder = async () => {
    setGallerySaving(true);
    const orders = galleryImages.map((img, i) => ({ id: img.id, sort_order: i }));
    await fetch(`${API}/products/${galleryProductId}/images/reorder`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders })
    });
    setGallerySaving(false);
  };

  const handleUpdateSold = async () => {
    const v = parseInt(soldModal.value, 10);
    if (isNaN(v) || v < 0) return;
    await fetch(`${API}/products/${soldModal.productId}/sold`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_sold: v }),
    });
    setSoldModal({ open: false, productId: null, productName: '', value: '' });
    load();
  };

  const filtered = products.filter(p => {
    const matchSearch = `${p.Product_id} ${p.Product_name} ${p.Type_name}`.toLowerCase().includes(search.toLowerCase());
    // "BEST" pill: ????????????????? > 0 (??????????? Type_id)
    const isBestPill = activeCategory === "best";
    const matchCat = isBestPill
      ? Number(p.total_sold) > 0
      : (activeCategory === "all" || String(p.Type_id) === String(activeCategory));
    return matchSearch && matchCat;
  });

  // ???????? total_sold DESC, Product_id ASC ??????????? BEST tab
  const sortedFiltered = activeCategory === "best"
    ? [...filtered].sort((a, b) => {
        const diff = Number(b.total_sold) - Number(a.total_sold);
        return diff !== 0 ? diff : Number(a.Product_id) - Number(b.Product_id);
      })
    : filtered;

  const categoryCounts = types.map(t => ({
    ...t,
    count: products.filter(p => String(p.Type_id) === String(t.Type_id)).length,
  }));

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / ROWS_PER_PAGE));
  const pageData   = sortedFiltered.slice((activePage - 1) * ROWS_PER_PAGE, activePage * ROWS_PER_PAGE);
  const changePage = (p) => { if (p >= 1 && p <= totalPages) setActivePage(p); };

  const getCatClass = (name) => {
    if (!name) return "sp-cat-tag";
    const n = name.toLowerCase();
    if (n.includes("lip"))   return "sp-cat-tag sp-cat-tag-lip";
    if (n.includes("cheek")) return "sp-cat-tag sp-cat-tag-cheek";
    if (n.includes("eye"))   return "sp-cat-tag sp-cat-tag-eye";
    if (n.includes("face"))  return "sp-cat-tag sp-cat-tag-face";
    if (n.includes("new"))   return "sp-cat-tag sp-cat-tag-new";
    return "sp-cat-tag";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sp-app">

        {/* SIDEBAR */}
        <aside className="sp-sidebar">
          <div className="sp-logo">
            <div className="sp-logo-romd">rom&amp;nd</div>
            <div className="sp-logo-tagline"></div>
          </div>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`sp-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.iconSrc ? <img src={item.iconSrc} alt={item.label} className="sp-nav-icon" /> : <span style={{width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>???</span>}
              {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            className="sp-nav-item"
            onClick={() => { sessionStorage.clear(); window.location.href = "/"; }}
          >
            <img src="/logout.png" alt="Logout" className="sp-nav-icon" />
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="sp-main">
          <div className="sp-topbar">
            <div className="sp-topbar-left">
              <div className="sp-topbar-icon"></div>
              <div>
                <div className="sp-topbar-title">Product Management</div>
                <div className="sp-topbar-sub"></div>
              </div>
            </div>
            <div className="sp-topbar-actions">
              <div className="sp-avatar">{avatarLetter}<span className="sp-avatar-dot" /></div>
            </div>
          </div>

          <div className="sp-content">
            <div className="sp-card">
              <div className="sp-table-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="sp-table-title">Product List</div>
                  <span className="sp-table-count">{sortedFiltered.length} ITEMS</span>
                </div>
                <div className="sp-table-controls">
                  <div className="sp-search-wrap">
                    <button className="sp-search-toggle-btn" onClick={() => { if (searchOpen) { setSearch(""); setActivePage(1); } setSearchOpen(v => !v); }}>
                      {searchOpen ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      )}
                    </button>
                    {searchOpen && (
                      <input
                        className="sp-search-input"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setActivePage(1); }}
                        autoFocus
                      />
                    )}
                  </div>
                  <button className="sp-add-btn" onClick={openNew}>+ Add Product</button>
                </div>
              </div>

              {/* Category filter pills */}
              {!loading && (
                <div className="sp-cat-bar">
                  <button
                    className={`sp-cat-pill ${activeCategory === "all" ? "active" : ""}`}
                    onClick={() => { setActiveCategory("all"); setActivePage(1); }}
                  >
                    <span className="sp-cat-pill-label">All</span>
                    <span className="sp-cat-pill-count">{products.length}</span>
                  </button>
                  {/* BEST pill: ????????????? bestseller ranking (total_sold > 0) */}
                  <button
                    className={`sp-cat-pill ${activeCategory === "best" ? "active" : ""}`}
                    onClick={() => { setActiveCategory("best"); setActivePage(1); }}
                  >
                    <span className="sp-cat-pill-label">BEST</span>
                    <span className="sp-cat-pill-count">{products.filter(p => Number(p.total_sold) > 0).length}</span>
                  </button>
                  {categoryCounts.filter(t => t.Type_name?.toUpperCase() !== 'BEST').map(t => (
                    <button
                      key={t.Type_id}
                      className={`sp-cat-pill ${String(activeCategory) === String(t.Type_id) ? "active" : ""}`}
                      onClick={() => { setActiveCategory(String(t.Type_id)); setActivePage(1); }}
                    >
                      <span className="sp-cat-pill-label">{t.Type_name}</span>
                      <span className="sp-cat-pill-count">{t.count}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="sp-table-wrap">
                {loading ? (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Loading...</div>
                ) : pageData.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No products found</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Model</th>
                        <th>Color</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Sold</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.map(p => (
                        <tr key={p.Product_id}>
                          <td><span className="sp-td-id">{p.Product_id}</span></td>
                          <td>
                            {p.Image
                              ? <img src={`${API_URL}/uploads/${p.Image}`} alt={p.Product_name} className="sp-thumb" />
                              : <div className="sp-thumb-ph">??</div>}
                          </td>
                          <td>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <span className="sp-product-name">{p.Product_name}</span>

                              </div>
                            </td>
                          <td>{p.Type_name ? <span className={getCatClass(p.Type_name)}>{p.Type_name}</span> : <span style={{color:"var(--text-muted)"}}>—</span>}</td>
                          <td style={{ color: "var(--text-muted)", fontSize: 12.5 }}>{p.Product_model || "—"}</td>
                          <td>
                            {String(p.Type_id) !== "1" ? (
                              p.Color
                                ? <span className="sp-color-swatch" style={{ backgroundColor: p.Color }} title={p.Color} onClick={() => openEdit(p)} />
                                : <span className="sp-color-empty" title="???????" onClick={() => openEdit(p)}>+</span>
                            ) : <span style={{ color: '#ddd' }}>—</span>}
                          </td>
                          <td>
                            <span style={{
                              fontWeight: 600,
                              fontSize: 13,
                              color: Number(p.Stock) === 0 ? '#c0392b' : Number(p.Stock) <= 5 ? '#e67e22' : '#27ae60'
                            }}>
                              {Number(p.Stock).toLocaleString()}
                            </span>
                          </td>
                          <td><span style={{ fontWeight: 700, color: "#1a1a2e" }}>?{Number(p.Product_price).toLocaleString()}</span></td>
                          <td>
                            <span
                              style={{ fontWeight: 600, fontSize: 13, color: Number(p.total_sold) > 0 ? '#c0607a' : 'var(--text-muted)', cursor: 'pointer' }}
                              title="????????????????????"
                              onClick={() => setSoldModal({ open: true, productId: p.Product_id, productName: p.Product_name, value: String(p.total_sold) })}
                            >
                              {Number(p.total_sold).toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <div className="sp-action-btns">
                              <button className="sp-action-btn sp-btn-edit" title="Edit" onClick={() => openEdit(p)}>
                                <img src="/edit.png" alt="edit" />
                              </button>
                              <button className="sp-action-btn sp-btn-gallery" title="Gallery" onClick={() => openGallery(p)}>
                                <img src="/gallery.png" alt="gallery" />
                              </button>
                              <button className="sp-action-btn sp-btn-del" title="Delete" onClick={() => setConfirmDelete(p)}>
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
              <div className="sp-pagination">
                <button className="sp-page-arrow" onClick={() => changePage(activePage - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`sp-page-btn ${activePage === p ? "active" : ""}`} onClick={() => changePage(p)}>{p}</button>
                ))}
                <button className="sp-page-arrow" onClick={() => changePage(activePage + 1)}>›</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div className="sp-modal-backdrop" onClick={() => setModal(false)}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>
            <button className="sp-modal-close" onClick={() => setModal(false)}>?</button>
            <h3>{editId ? `Edit Product #${editId}` : "Add New Product"}</h3>
            <div className="sp-form-grid">
              <div className="full">
                <label className="sp-form-label">Category</label>
                <select className="sp-form-select" value={form.Type_id} onChange={e => setForm(f => ({ ...f, Type_id: e.target.value }))}>
                  <option value="">-- Select Category --</option>
                  {types.map(t => <option key={t.Type_id} value={t.Type_id}>{t.Type_name}</option>)}
                </select>
              </div>
              <div className="full">
                <label className="sp-form-label">Product Name</label>
                <input className="sp-form-input" value={form.Product_name} onChange={e => setForm(f => ({ ...f, Product_name: e.target.value }))} />
              </div>
              <div>
                <label className="sp-form-label">Model</label>
                <input className="sp-form-input" value={form.Product_model} onChange={e => setForm(f => ({ ...f, Product_model: e.target.value }))} />
              </div>
              <div>
                <label className="sp-form-label">Price (?)</label>
                <input className="sp-form-input" type="number" min="0" value={form.Product_price} onChange={e => setForm(f => ({ ...f, Product_price: e.target.value }))} />
              </div>
              <div>
                <label className="sp-form-label">Stock (????????????)</label>
                <input className="sp-form-input" type="number" min="0" placeholder="0" value={form.Stock} onChange={e => setForm(f => ({ ...f, Stock: e.target.value }))} />
              </div>
              <div>
                <label className="sp-form-label">????????????? (Sale Date)</label>
                <input className="sp-form-input" type="date" value={form.Sale_date} onChange={e => setForm(f => ({ ...f, Sale_date: e.target.value }))} />
              </div>
              <div className="full">
                <label className="sp-form-label">Description</label>
                <textarea className="sp-form-textarea" value={form.Description} onChange={e => setForm(f => ({ ...f, Description: e.target.value }))} />
              </div>
              {String(form.Type_id) !== "1" && (
                <div className="full">
                  <label className="sp-form-label">Color (???????)</label>
                  <div className="sp-color-picker-wrap">
                    <input
                      type="color"
                      className="sp-color-picker-input"
                      value={form.Color || "#ffffff"}
                      onChange={e => setForm(f => ({ ...f, Color: e.target.value }))}
                    />
                    <input
                      className="sp-color-hex-input"
                      placeholder="#hex ???? CSS color"
                      value={form.Color}
                      onChange={e => setForm(f => ({ ...f, Color: e.target.value }))}
                    />
                    {form.Color && (
                      <button className="sp-color-clear-btn" onClick={() => setForm(f => ({ ...f, Color: "" }))}>????</button>
                    )}
                  </div>
                  {form.Color && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="sp-color-swatch" style={{ backgroundColor: form.Color, width: 28, height: 28 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>?????????????</span>
                    </div>
                  )}
                </div>
              )}
              <div className="full">
                <label className="sp-form-label">Product Image (???????)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: 13 }} />
                {preview && <img src={preview} alt="preview" style={{ marginTop: 10, width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />}
              </div>
              <div className="full">
                <label className="sp-form-label">Detail Image (???????????????????)</label>
                <input type="file" accept="image/*" onChange={handleDetailImageChange} style={{ fontSize: 13 }} />
                {detailPreview && (
                  <div style={{ marginTop: 10, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                      <img src={detailPreview} alt="detail preview" style={{ width: '100%', display: 'block' }} />
                    </div>
                    <div style={{ padding: '8px 10px', background: '#fff8f8', borderTop: '1px solid var(--border)' }}>
                      <button
                        type="button"
                        onClick={() => { setDetailPreview(null); setForm(f => ({ ...f, detailImageFile: null })); setClearDetailImage(true); }}
                        style={{ fontSize: 12, color: '#c0392b', background: 'none', border: '1px solid #e0b0b0', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}
                      >
                        ? ????? Detail ???
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {saveError && <div style={{ color: 'red', marginBottom: 8, fontSize: 13 }}>{saveError}</div>}
            <div className="sp-modal-actions">
              <button className="sp-modal-cancel" onClick={() => setModal(false)}>Cancel</button>
              <button className="sp-modal-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {galleryModal && (
        <div className="sp-modal-backdrop" onClick={() => setGalleryModal(false)}>
          <div className="sp-modal" style={{width:520}} onClick={e => e.stopPropagation()}>
            <button className="sp-modal-close" onClick={() => setGalleryModal(false)}>?</button>
            <h3>Gallery — {galleryProductName}</h3>
            <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:16}}>???????? 1 = ??????????????????? ??? ?? ??????????????? ?????? Save Order</p>
            {galleryError && (
              <div style={{color:'#c0392b',fontSize:13,marginBottom:12,padding:'8px 12px',background:'#fff0f0',borderRadius:6,border:'1px solid #f5c6cb'}}>
                ?? {galleryError}
              </div>
            )}
            {galleryImages.length === 0
              ? <div className="sp-gallery-empty">????????????????????</div>
              : <>
                  <div className="sp-gallery-grid">
                    {galleryImages.map((img, i) => (
                      <div key={img.id} className="sp-gallery-item" style={{position:'relative',width:90,height:90}}>
                        <img src={`${API_URL}/uploads/${img.Image}`} alt="gallery" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                        <span style={{position:'absolute',top:2,left:2,background:'rgba(0,0,0,0.55)',color:'#fff',fontSize:10,padding:'1px 5px',borderRadius:4,fontWeight:700}}>{i+1}</span>
                        <button className="sp-gallery-del" title="??" onClick={() => handleGalleryDelete(img.id)}>?</button>
                        <div style={{position:'absolute',bottom:2,left:2,display:'flex',flexDirection:'column',gap:1}}>
                          <button onClick={() => moveGalleryImage(i, -1)} disabled={i===0}
                            style={{width:18,height:18,border:'none',borderRadius:3,background:'rgba(255,255,255,0.85)',cursor:'pointer',fontSize:10,padding:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:i===0?0.3:1}}>?</button>
                          <button onClick={() => moveGalleryImage(i, 1)} disabled={i===galleryImages.length-1}
                            style={{width:18,height:18,border:'none',borderRadius:3,background:'rgba(255,255,255,0.85)',cursor:'pointer',fontSize:10,padding:0,display:'flex',alignItems:'center',justifyContent:'center',opacity:i===galleryImages.length-1?0.3:1}}>?</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:16}}>
                    <button className="sp-modal-save" onClick={handleGallerySaveOrder} disabled={gallerySaving} style={{padding:'8px 20px'}}>
                      {gallerySaving ? 'Saving...' : '?? Save Order'}
                    </button>
                  </div>
                </>
            }
            <label className="sp-form-label">????????????</label>
            <div style={{display:'flex',gap:10,alignItems:'center',marginTop:6}}>
              <input type="file" accept="image/*" multiple style={{fontSize:13,flex:1}}
                onChange={e => setGalleryFiles(Array.from(e.target.files))} />
              {galleryFiles.length > 0 && <span style={{fontSize:12,color:'var(--text-muted)',whiteSpace:'nowrap'}}>{galleryFiles.length} ???</span>}
              <button className="sp-modal-save" style={{whiteSpace:'nowrap'}}
                onClick={handleGalleryUpload} disabled={!galleryFiles.length || galleryUploading}>
                {galleryUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOLD EDIT MODAL */}
      {soldModal.open && (
        <div className="sp-modal-backdrop" onClick={() => setSoldModal({ open: false, productId: null, productName: '', value: '' })}>
          <div className="sp-modal" style={{ width: 360 }} onClick={e => e.stopPropagation()}>
            <button className="sp-modal-close" onClick={() => setSoldModal({ open: false, productId: null, productName: '', value: '' })}>?</button>
            <h3>??????????? (total_sold)</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{soldModal.productName}</p>
            <label className="sp-form-label">??????????????</label>
            <input
              className="sp-form-input"
              type="number"
              min="0"
              value={soldModal.value}
              onChange={e => setSoldModal(s => ({ ...s, value: e.target.value }))}
              style={{ marginBottom: 20 }}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleUpdateSold()}
            />
            <div className="sp-modal-actions">
              <button className="sp-modal-cancel" onClick={() => setSoldModal({ open: false, productId: null, productName: '', value: '' })}>Cancel</button>
              <button className="sp-modal-save" onClick={handleUpdateSold}>??????</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="sp-modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="sp-modal" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 24 }}>
              Delete <strong>{confirmDelete.Product_name}</strong>? This cannot be undone.
            </p>
            <div className="sp-modal-actions">
              <button className="sp-modal-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="sp-modal-save sp-modal-del" onClick={() => handleDelete(confirmDelete.Product_id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
