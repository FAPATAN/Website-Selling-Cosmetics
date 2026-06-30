import API_URL from '../../config';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = `${API_URL}/api/admin`;
const ROWS_PER_PAGE = 10;

const navItems = [
  { iconSrc: "/Dashboard.png",   label: "Dashboard",   path: "/admin" },
  { iconSrc: "/Orders.png",      label: "Orders",      path: "/admin/orders" },
  { iconSrc: "/Products.png",    label: "Products",    path: "/admin/products" },
  { iconSrc: "/Promotions.png",  label: "Promotions",  path: "/admin/promotions" },
  { iconSrc: "/price_range.png", label: "Price Range", path: "/admin/price-ranges" },
  { iconSrc: "/Members.png",     label: "Members",     path: "/admin/users" },
];

const STATUS_OPTIONS = [
  { value: "O",  label: " สร้างรายการสั่งซื้อ" },
  { value: "P",  label: " รอตรวจสอบการชำระเงิน" },
  { value: "A",  label: " ยืนยันคำสั่งซื้อ" },
  { value: "S",  label: " จัดส่งสินค้าแล้ว" },
];
const STATUS_LABEL = { O: "สร้างรายการสั่งซื้อ", P: "รอตรวจสอบการชำระเงิน", A: "ยืนยันคำสั่งซื้อ", S: "จัดส่งสินค้าแล้ว", R: "ยกเลิก", C: "เสร็จสิ้น", Ca: "กำลังยกเลิก" };

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
  .so-app { display: flex; height: 100vh; background: var(--bg); font-family: 'Sora',sans-serif; color: var(--text-primary); }
  .so-sidebar { width: 200px; background: var(--sidebar-bg); display: flex; flex-direction: column; padding: 24px 16px; gap: 4px; flex-shrink: 0; }
  .so-logo { display: flex; flex-direction: column; padding: 8px 12px 24px; }
  .so-logo-romd { font-family: 'Georgia','Times New Roman',serif; font-size: 28px; font-weight: 100; letter-spacing: 1.5px; color: #333333; line-height: 1; text-transform: lowercase; }
  .so-logo-tagline { font-size: 7.5px; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); margin-top: 3px; }
  .so-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s ease; border: none; background: none; text-align: left; width: 100%; }
  .so-nav-item:hover { background: rgba(0,0,0,0.05); color: var(--text-primary); }
  .so-nav-item.active { background: #FFC2D1; color: var(--text-primary); font-weight: 600; }
  .so-nav-icon{width:20px;height:20px;object-fit:contain;flex-shrink:0;opacity:0.7;transition:opacity .15s;}
  .so-nav-item:hover .so-nav-icon{opacity:1;}
  .so-nav-item.active .so-nav-icon{opacity:1;filter:brightness(0) invert(1);}
  .so-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .so-topbar { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px 32px 20px; }
  .so-topbar-title { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
  .so-topbar-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
  .so-topbar-actions { display: flex; align-items: center; gap: 8px; }
  .so-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#f093fb,#f5576c); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; cursor: pointer; position: relative; }
  .so-avatar-dot { position: absolute; bottom: 2px; right: 2px; width: 8px; height: 8px; background: #2ed573; border-radius: 50%; border: 2px solid var(--bg); }
  .so-content { flex: 1; padding: 0 24px 24px; overflow: hidden; display: flex; flex-direction: column; }
  .so-card { background: var(--card-bg); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; flex: 1; display: flex; flex-direction: column; }
  .so-table-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; }
  .so-table-title { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
  .so-table-count { font-size: 13px; color: var(--text-muted); background: var(--bg); padding: 3px 10px; border-radius: 20px; margin-left: 8px; font-weight: 500; }
  .so-table-controls { display: flex; gap: 10px; align-items: center; }
  .so-search-wrap { display: flex; align-items: center; gap: 6px; }
  .so-search-toggle-btn { width: 36px; height: 36px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all .15s; }
  .so-search-toggle-btn:hover { background: var(--bg); border-color: var(--text-primary); color: var(--text-primary); }
  .so-search-input { padding: 8px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); font-size: 13px; font-family: 'Sora',sans-serif; color: var(--text-primary); outline: none; width: 200px; animation: so-input-in .2s ease; }
  @keyframes so-input-in { from { opacity: 0; width: 0; padding: 8px 0; } to { opacity: 1; width: 200px; padding: 8px 14px; } }
  .so-search-input:focus { border-color: var(--accent-dark); background: #fff; }
  .so-slip-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 8px; border: 1px solid var(--border); background: none; font-size: 12px; cursor: pointer; color: var(--text-secondary); transition: all .15s; font-family: 'Sora',sans-serif; }
  .so-slip-btn:hover { background: #f0f8ff; border-color: #9DCAEB; color: #2980b9; }
  .so-table-wrap { flex: 1; overflow-y: auto; padding: 0 24px; }
  .so-table-wrap table { width: 100%; border-collapse: collapse; }
  .so-table-wrap thead th { text-align: center; font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; background: var(--bg); position: sticky; top: 0; }
  .so-table-wrap thead th:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
  .so-table-wrap thead th:last-child  { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
  .so-table-wrap tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .so-table-wrap tbody tr:last-child { border-bottom: none; }
  .so-table-wrap tbody tr:hover { background: #fafafa; }
  .so-table-wrap td { padding: 13px 12px; font-size: 13.5px; color: var(--text-primary); text-align: center; }
  .so-td-id { font-family: 'JetBrains Mono',monospace; font-size: 12px; color: var(--text-muted); }
  .so-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .so-badge-O  { background: #dde3ff; color: #3949ab; }
  .so-badge-P  { background: #ffedb3; color: #e67e00; }
  .so-badge-A  { background: #c8e6fa; color: #1565c0; }
  .so-badge-S  { background: #c8ecd2; color: #1a7a40; }
  .so-badge-R  { background: #e0cefc; color: #6a1fa2; }
  .so-badge-C  { background: #c5f0d3; color: #14703a; }
  .so-badge-Ca { background: #ffc8c8; color: #b71c1c; }
  .so-slip-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 1px solid var(--border); transition: transform 0.15s; }
  .so-slip-thumb:hover { transform: scale(1.1); }
  .so-table-wrap thead th.so-col-items,
  .so-table-wrap tbody td.so-col-items { width: 90px; text-align: center; padding-left: 0; padding-right: 90px; }
  .so-items-list { display: flex; flex-direction: column; gap: 3px; }
  .so-item-row { font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
  .so-item-more { font-size: 11px; color: var(--text-muted); font-style: italic; }
  .so-items-total { display: inline-block; margin-top: 4px; font-size: 11px; font-weight: 600; color: var(--accent-dark); background: #fff0f5; border-radius: 20px; padding: 1px 8px; }
  .so-status-select { padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg); font-size: 12.5px; font-family: 'Sora',sans-serif; color: var(--text-primary); outline: none; cursor: pointer; transition: border-color 0.15s; }
  .so-status-select:focus { border-color: var(--accent-dark); }
  .so-status-select-O  { background: #f0f4ff; color: #5c6bc0; border-color: #c5cae9; font-weight: 600; }
  .so-status-select-P  { background: #fff8e1; color: #f39c12; border-color: #ffe082; font-weight: 600; }
  .so-status-select-A  { background: #e0f0ff; color: #2980b9; border-color: #90caf9; font-weight: 600; }
  .so-status-select-S  { background: #e8f5e9; color: #27ae60; border-color: #a5d6a7; font-weight: 600; }
  .so-status-select-R  { background: #ede7f6; color: #7b1fa2; border-color: #ce93d8; font-weight: 600; }
  .so-status-select-C  { background: #e6f9ec; color: #1e8449; border-color: #a5d6a7; font-weight: 600; }
  .so-status-select-Ca { background: #ffe0e0; color: #c0392b; border-color: #ffaaaa; font-weight: 600; }
  .so-saving-text { font-size: 11px; color: var(--text-muted); margin-left: 6px; }
  .so-status-badge-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 13px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: filter .15s; font-family: 'Sora',sans-serif; }
  .so-status-badge-btn:hover { filter: brightness(0.93); }
  .so-status-modal { background: #fff; border-radius: var(--radius); box-shadow: 0 20px 60px rgba(0,0,0,0.25); width: 420px; max-width: 95vw; overflow: hidden; }
  .so-status-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; cursor: pointer; transition: background .12s; border: 2px solid transparent; margin-bottom: 6px; font-family: 'Sora',sans-serif; font-weight: 700; font-size: 13.5px; }
  .so-status-option:hover { filter: brightness(0.95); }
  .so-status-option.selected { border-color: currentColor; opacity: 1; }
  .so-status-option:not(.selected) { opacity: 0.8; }
  .so-tracking-wrap { margin-top: 14px; padding: 12px 14px; background: #f0fbf4; border-radius: 10px; border: 1px solid #a5d6a7; }
  .so-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 16px 24px; border-top: 1px solid var(--border); }
  .so-page-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: none; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text-secondary); transition: all 0.15s; font-family: 'Sora',sans-serif; }
  .so-page-btn:hover { border-color: var(--text-primary); color: var(--text-primary); }
  .so-page-btn.active { background: var(--accent); border-color: var(--accent); color: var(--text-primary); font-weight: 700; }
  .so-page-arrow { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.15s; font-size: 16px; }
  .so-page-arrow:hover { background: var(--bg); }
  .so-empty { text-align: center; padding: 40px; font-size: 14px; color: var(--text-muted); }
  .so-loading { text-align: center; padding: 48px; font-size: 14px; color: var(--text-muted); }
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
  .so-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; cursor: pointer; backdrop-filter: blur(4px); }
  .so-lightbox img { max-width: 80vw; max-height: 80vh; border-radius: var(--radius); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
  .so-view-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 8px; border: 1px solid #FFC2D1; background: #fff0f5; font-size: 12px; font-weight: 600; cursor: pointer; color: #c0527a; transition: all .15s; font-family: 'Sora',sans-serif; white-space: nowrap; }
  .so-view-btn:hover { background: #FFC2D1; color: #7a1a3a; border-color: #ffaabf; }
  .so-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 3000; backdrop-filter: blur(4px); }
  .so-modal { background: #fff; border-radius: var(--radius); box-shadow: 0 20px 60px rgba(0,0,0,0.2); width: 520px; max-width: 95vw; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; }
  .so-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px 14px; border-bottom: 1px solid var(--border); }
  .so-modal-title { font-size: 16px; font-weight: 700; }
  .so-modal-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .so-modal-close { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border); background: none; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; color: var(--text-secondary); transition: all .15s; }
  .so-modal-close:hover { background: #ffe0e8; border-color: #ffaabf; color: #c0392b; }
  .so-modal-body { overflow-y: auto; padding: 16px 22px; flex: 1; }
  .so-modal-item { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .so-modal-item:last-child { border-bottom: none; }
  .so-modal-img { width: 56px; height: 56px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border); background: #f5f5f5; flex-shrink: 0; }
  .so-modal-img-placeholder { width: 56px; height: 56px; border-radius: 10px; border: 1px solid var(--border); background: #f5f5f5; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 22px; }
  .so-modal-item-info { flex: 1; min-width: 0; }
  .so-modal-item-name { font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .so-modal-item-model { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
  .so-modal-item-qty { font-size: 13px; font-weight: 600; color: var(--text-secondary); white-space: nowrap; text-align: right; }
  .so-modal-item-price { font-size: 13px; font-weight: 700; color: #c0527a; white-space: nowrap; text-align: right; }
  .so-modal-footer { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; flex-direction: column; align-items: stretch; gap: 10px; }
  .so-modal-total-label { font-size: 13px; color: var(--text-muted); }
  .so-modal-total-value { font-size: 16px; font-weight: 700; color: var(--text-primary); }
  .so-modal-loading { text-align: center; padding: 32px; color: var(--text-muted); font-size: 13px; }
  .so-modal-info { background: #fafafa; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; }
  .so-modal-info-row { display: flex; flex-direction: column; gap: 2px; }
  .so-modal-info-row.full { grid-column: 1 / -1; }
  .so-modal-info-label { font-size: 10.5px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; }
  .so-modal-info-value { font-size: 13px; color: var(--text-primary); font-weight: 500; word-break: break-all; }
  .so-modal-edit-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: none; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--text-secondary); transition: all .15s; font-family: 'Sora',sans-serif; }
  .so-modal-edit-btn:hover { background: #fff0f5; border-color: #FFC2D1; color: #c0527a; }
  .so-modal-save-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: none; background: #FFC2D1; font-size: 12.5px; font-weight: 700; cursor: pointer; color: #7a1a3a; transition: all .15s; font-family: 'Sora',sans-serif; }
  .so-modal-save-btn:hover { background: #ffaabf; }
  .so-modal-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .so-modal-cancel-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: none; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--text-secondary); transition: all .15s; font-family: 'Sora',sans-serif; }
  .so-modal-cancel-btn:hover { background: var(--bg); }
  .so-edit-input { width: 100%; padding: 7px 10px; border-radius: 8px; border: 1px solid var(--border); font-size: 13px; font-family: 'Sora',sans-serif; color: var(--text-primary); background: #fff; outline: none; box-sizing: border-box; }
  .so-edit-input:focus { border-color: #FFC2D1; }
  .so-promo-badge { display: inline-block; background: transparent; color: #e0006b; border: 1.5px solid #e0006b; border-radius: 4px; font-size: 11px; font-weight: bold; padding: 1px 7px; margin-right: 6px; flex-shrink: 0; vertical-align: middle; white-space: nowrap; }
`;

export default function AdminOrders() {
  const navigate = useNavigate();
  const location = useLocation();
  const memberId = sessionStorage.getItem("admin_Member_id") || sessionStorage.getItem("Member_id");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [saving, setSaving] = useState({});
  const [page, setPage] = useState(1);
  const [itemsModal, setItemsModal] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [statusForm, setStatusForm] = useState({ newStatus: '', trackingNo: '' });
  const [statusSaving, setStatusSaving] = useState(false);
  const [adminName, setAdminName] = useState("");
  const avatarLetter = adminName ? adminName.charAt(0).toUpperCase() : "A";

  useEffect(() => {
    if (!memberId) return;
    fetch(`${API}/members/${memberId}`, { headers: { "x-member-id": memberId } })
      .then(r => r.json())
      .then(d => { if (d.Username || d.Name) setAdminName(d.Name || d.Username); })
      .catch(() => {});
  }, [memberId]);

  const openItemsModal = async (order) => {
    setItemsModal({ order, items: [] });
    setEditInfo(false);
    setEditForm({ Name: order.Name, Surname: order.Surname, Email: order.Email || '', Phone: order.Phone || '', Address: order.Address || '' });
    setItemsLoading(true);
    try {
      const res = await fetch(`${API}/orders/${order.Order_id}/items`, { headers });
      const data = await res.json();
      setItemsModal({ order, items: data.items || [] });
    } catch {
      setItemsModal({ order, items: [] });
    } finally {
      setItemsLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!itemsModal) return;
    setEditSaving(true);
    try {
      await fetch(`${API}/orders/${itemsModal.order.Order_id}/info`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const updatedOrder = { ...itemsModal.order, ...editForm };
      setItemsModal(m => ({ ...m, order: updatedOrder }));
      setOrders(prev => prev.map(o => o.Order_id === itemsModal.order.Order_id ? { ...o, ...editForm } : o));
      setEditInfo(false);
    } finally {
      setEditSaving(false);
    }
  };

  const openStatusModal = (order) => {
    const displayStatus = (order.Status === 'P' && !order.Invoice_pic) ? 'O' : order.Status;
    setStatusForm({ newStatus: displayStatus, trackingNo: order.TrackingNo || '' });
    setStatusModal(order);
  };

  const handleStatusSave = async () => {
    if (!statusModal) return;
    setStatusSaving(true);
    await fetch(`${API}/orders/${statusModal.Order_id}/status`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ Status: statusForm.newStatus, TrackingNo: statusForm.trackingNo }),
    });
    setStatusSaving(false);
    setOrders(prev => prev.map(o => o.Order_id === statusModal.Order_id ? { ...o, Status: statusForm.newStatus, TrackingNo: statusForm.trackingNo } : o));
    setStatusModal(null);
  };

  const load = () => {
    setLoading(true);
    fetch(`${API}/orders`, { headers })
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setSaving(s => ({ ...s, [orderId]: true }));
    await fetch(`${API}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ Status: newStatus }),
    });
    setSaving(s => ({ ...s, [orderId]: false }));
    setOrders(prev => prev.map(o => o.Order_id === orderId ? { ...o, Status: newStatus } : o));
  };

  const filtered = orders.filter(o =>
    `${o.Order_id} ${o.Name} ${o.Surname} ${o.Phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <>
      <style>{styles}</style>
      <div className="so-app">
        {/* Lightbox */}
        {lightbox && (
          <div className="so-lightbox" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="slip" />
          </div>
        )}

        {/* Status Modal */}
        {statusModal && (
          <div className="so-modal-overlay" onClick={() => setStatusModal(null)}>
            <div className="so-status-modal" onClick={e => e.stopPropagation()}>
              <div className="so-modal-header">
                <div>
                  <div className="so-modal-title">เปลี่ยนสถานะ</div>
                  <div className="so-modal-sub">#{statusModal.Order_id} — {statusModal.Name} {statusModal.Surname}</div>
                </div>
                <button className="so-modal-close" onClick={() => setStatusModal(null)}>✕</button>
              </div>
              <div className="so-modal-body">
                {STATUS_OPTIONS.map(s => (
                  <div
                    key={s.value}
                    className={`so-status-option so-badge-${s.value} ${statusForm.newStatus === s.value ? 'selected' : ''}`}
                    onClick={() => setStatusForm(f => ({ ...f, newStatus: s.value }))}
                  >
                    <span style={{ fontSize: 16 }}>{s.label.split(' ')[0]}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label.slice(s.label.indexOf(' ') + 1)}</span>
                  </div>
                ))}
                {statusForm.newStatus === 'S' && (
                  <div className="so-tracking-wrap">
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#27ae60', display: 'block', marginBottom: 6 }}> หมายเลขพัสดุ</label>
                    <input
                      className="so-edit-input"
                      placeholder="กรอกหมายเลขพัสดุ..."
                      value={statusForm.trackingNo}
                      onChange={e => setStatusForm(f => ({ ...f, trackingNo: e.target.value }))}
                    />
                  </div>
                )}
              </div>
              <div className="so-modal-footer" style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <button className="so-modal-cancel-btn" onClick={() => setStatusModal(null)}>ยกเลิก</button>
                <button className="so-modal-save-btn" disabled={statusSaving} onClick={handleStatusSave}>
                  {statusSaving ? 'บันทึก...' : 'บันทึก'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items Modal */}
        {itemsModal && (
          <div className="so-modal-overlay" onClick={() => setItemsModal(null)}>
            <div className="so-modal" onClick={e => e.stopPropagation()}>
              <div className="so-modal-header">
                <div>
                  <div className="so-modal-title">รายการสินค้า — #{itemsModal.order.Order_id}</div>
                  <div className="so-modal-sub">{itemsModal.order.Name} {itemsModal.order.Surname}</div>
                </div>
                <button className="so-modal-close" onClick={() => setItemsModal(null)}>✕</button>
              </div>
              <div className="so-modal-body">
                {/* Customer Info */}
                {!editInfo ? (
                  <div className="so-modal-info">
                    <div className="so-modal-info-row">
                      <span className="so-modal-info-label">ชื่อ-นามสกุล</span>
                      <span className="so-modal-info-value">{itemsModal.order.Name} {itemsModal.order.Surname}</span>
                    </div>
                    <div className="so-modal-info-row">
                      <span className="so-modal-info-label">อีเมล</span>
                      <span className="so-modal-info-value">{itemsModal.order.Email || '-'}</span>
                    </div>
                    <div className="so-modal-info-row">
                      <span className="so-modal-info-label">เบอร์โทร</span>
                      <span className="so-modal-info-value">{itemsModal.order.Phone || '-'}</span>
                    </div>
                    <div className="so-modal-info-row">
                      <span className="so-modal-info-label">วันที่สั่ง</span>
                      <span className="so-modal-info-value">{itemsModal.order.Order_date ? new Date(itemsModal.order.Order_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                    <div className="so-modal-info-row">
                      <span className="so-modal-info-label">วันโอน</span>
                      <span className="so-modal-info-value">{itemsModal.order.Invoice_date ? new Date(itemsModal.order.Invoice_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                    <div className="so-modal-info-row full">
                      <span className="so-modal-info-label">ที่อยู่จัดส่ง</span>
                      <span className="so-modal-info-value">{itemsModal.order.Address || '-'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="so-modal-info" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
                      <div className="so-modal-info-row">
                        <span className="so-modal-info-label">ชื่อ</span>
                        <input className="so-edit-input" value={editForm.Name} onChange={e => setEditForm(f => ({ ...f, Name: e.target.value }))} />
                      </div>
                      <div className="so-modal-info-row">
                        <span className="so-modal-info-label">นามสกุล</span>
                        <input className="so-edit-input" value={editForm.Surname} onChange={e => setEditForm(f => ({ ...f, Surname: e.target.value }))} />
                      </div>
                      <div className="so-modal-info-row">
                        <span className="so-modal-info-label">อีเมล</span>
                        <input className="so-edit-input" value={editForm.Email} onChange={e => setEditForm(f => ({ ...f, Email: e.target.value }))} />
                      </div>
                      <div className="so-modal-info-row">
                        <span className="so-modal-info-label">เบอร์โทร</span>
                        <input className="so-edit-input" value={editForm.Phone} onChange={e => setEditForm(f => ({ ...f, Phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="so-modal-info-row">
                      <span className="so-modal-info-label">ที่อยู่จัดส่ง</span>
                      <input className="so-edit-input" value={editForm.Address} onChange={e => setEditForm(f => ({ ...f, Address: e.target.value }))} />
                    </div>
                  </div>
                )}
                {itemsLoading ? (
                  <div className="so-modal-loading">กำลังโหลด...</div>
                ) : itemsModal.items.length === 0 ? (
                  <div className="so-modal-loading">ไม่พบรายการสินค้า</div>
                ) : (
                  itemsModal.items.map(item => (
                    <div key={item.Order_detail_id} className="so-modal-item">
                      {item.Image ? (
                        <img
                          className="so-modal-img"
                          src={`${API_URL}/uploads/${item.Image}`}
                          alt={item.Product_name || item.Product_model}
                        />
                      ) : (
                        <div className="so-modal-img-placeholder">🛍</div>
                      )}
                      <div className="so-modal-item-info">
                        <div className="so-modal-item-name">
                          {item.DiscountType === 'percentage' && (
                            <span className="so-promo-badge">{item.Discount_value}%</span>
                          )}
                          {item.DiscountType === 'buy 1 get 1' && Number(item.Total) === 0 && (
                            <span className="so-promo-badge">Buy 1 Get 1</span>
                          )}
                          {item.Product_name || item.Product_model}
                        </div>
                        {item.Product_name && item.Product_model !== item.Product_name && (
                          <div className="so-modal-item-model">{item.Product_model}</div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="so-modal-item-qty">x{item.Quantity}</div>
                        <div className="so-modal-item-price">฿{Number(item.Total).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="so-modal-footer">
                {!editInfo ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="so-modal-total-label">ยอดรวมทั้งหมด</span>
                      <span className="so-modal-total-value">฿{Number(itemsModal.order.Proprice).toLocaleString()}</span>
                    </div>
                    <button className="so-modal-edit-btn" style={{ alignSelf: 'flex-end' }} onClick={() => setEditInfo(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      แก้ไขข้อมูล
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, width: '100%' }}>
                    <button className="so-modal-cancel-btn" onClick={() => { setEditInfo(false); setEditForm({ Name: itemsModal.order.Name, Surname: itemsModal.order.Surname, Email: itemsModal.order.Email || '', Phone: itemsModal.order.Phone || '', Address: itemsModal.order.Address || '' }); }}>ยกเลิก</button>
                    <button className="so-modal-save-btn" disabled={editSaving} onClick={handleSaveInfo}>{editSaving ? 'บันทึก...' : 'บันทึก'}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <aside className="so-sidebar">
          <div className="so-logo">
            <div className="so-logo-romd">rom&amp;nd</div>
            <div className="so-logo-tagline"></div>
          </div>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`so-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.iconSrc ? <img src={item.iconSrc} alt={item.label} className="so-nav-icon" /> : <span style={{width:'20px',height:'20px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>🏷️</span>}
              {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            className="so-nav-item"
            onClick={() => { sessionStorage.clear(); window.location.href = "/"; }}
          >
            <img src="/logout.png" alt="Logout" className="so-nav-icon" />
            Logout
          </button>
        </aside>

        {/* Main */}
        <div className="so-main">
          <div className="so-topbar">
            <div>
              <div className="so-topbar-title">Orders Management</div>
              <div className="so-topbar-sub"></div>
            </div>
            <div className="so-topbar-actions">
              <div className="so-avatar">
                {avatarLetter}<div className="so-avatar-dot" />
              </div>
            </div>
          </div>

          <div className="so-content">
            <div className="so-card">
              {/* Table header */}
              <div className="so-table-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="so-table-title">Order List</div>
                  <span className="so-table-count">{filtered.length} ORDERS</span>
                </div>
                <div className="so-table-controls">
                  <div className="so-search-wrap">
                    <button className="so-search-toggle-btn" onClick={() => { if (showSearch) { setSearch(""); setPage(1); } setShowSearch(v => !v); }}>
                      {showSearch ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      )}
                    </button>
                    {showSearch && (
                      <input
                        className="so-search-input"
                        placeholder="ค้นหา ชื่อ / เลขที่..."
                        value={search}
                        autoFocus
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="so-table-wrap">
                {loading ? (
                  <div className="so-loading">กำลังโหลด...</div>
                ) : pageData.length === 0 ? (
                  <div className="so-empty">ไม่พบคำสั่งซื้อ</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th className="so-col-items">Items</th>
                        <th>Total</th>
                        <th>Order Date</th>
                        <th>Slip</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.map(o => (
                        <tr key={o.Order_id}>
                          <td><span className="so-td-id">#{o.Order_id}</span></td>
                          <td style={{ fontWeight: 500 }}>{o.Name} {o.Surname}</td>
                          <td>
                            <button className="so-view-btn" onClick={() => openItemsModal(o)}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              ดูรายการ
                            </button>
                          </td>
                          <td className="so-col-items" style={{ fontWeight: 600 }}>
                            {(() => {
                              const items = o.detail_summary
                                ? o.detail_summary.split(';;').map(s => { const [, qty] = s.split('|'); return parseInt(qty) || 1; })
                                : [];
                              const totalQty = items.reduce((sum, q) => sum + q, 0);
                              return totalQty > 0 ? <span style={{ fontWeight: 600 }}>{totalQty}</span> : <span style={{ color: '#bbb' }}>-</span>;
                            })()}
                          </td>
                          <td style={{ fontWeight: 600 }}>฿{Number(o.Proprice).toLocaleString()}</td>
                          <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                            {o.Order_date ? new Date(o.Order_date).toLocaleDateString("th-TH") : "-"}
                          </td>
                          <td>
                            {o.Invoice_pic ? (
                              <button className="so-slip-btn" onClick={() => setLightbox(`${API_URL}/uploads/${o.Invoice_pic}`)}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                ดูสลิป
                              </button>
                            ) : (
                              <span style={{ color: "#bbb", fontSize: "0.82rem" }}>-</span>
                            )}
                          </td>
                          <td>
                            {(() => {
                              const isExpired = o.Order_date &&
                                (new Date() - new Date(o.Order_date)) > 24 * 60 * 60 * 1000 &&
                                (o.Status === 'O' || (o.Status === 'P' && !o.Invoice_pic));
                              if (o.Status === 'Ca' || isExpired) {
                                return (
                                  <button
                                    className="so-status-badge-btn so-badge-Ca"
                                    onClick={() => openStatusModal(o)}
                                  >
                                    ยกเลิกสินค้า
                                  </button>
                                );
                              }
                              const displayStatus = (o.Status === 'P' && !o.Invoice_pic) ? 'O' : o.Status;
                              const opt = STATUS_OPTIONS.find(s => s.value === displayStatus);
                              return (
                                <button
                                  className={`so-status-badge-btn so-badge-${displayStatus}`}
                                  onClick={() => openStatusModal(o)}
                                >
                                  {opt ? opt.label : displayStatus}
                                </button>
                              );
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="so-pagination">
                  <button className="so-page-arrow" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`so-page-btn ${page === p ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="so-page-arrow" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
