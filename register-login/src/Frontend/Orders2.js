import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Account.css";
import "./Orders.css";

const STATUS_STEPS = [
    { key: "placed",    label: "Order List",        icon: "/status-placed.png" },
    { key: "accepted",  label: "Awaiting Payment",  icon: "/status-accepted.png" },
    { key: "progress",  label: "Accepted",          icon: "/status-progress1.png" },
    { key: "ontheway",  label: "Shipped",           icon: "/status-onway.png" },
];

function OrderStatusTracker({ currentStatus }) {
    const currentIdx = STATUS_STEPS.findIndex(s => s.key === currentStatus);
    return (
        <div className="order-status-tracker">
            <div className="ost-title">Order Status</div>
            <div className="ost-steps">
                {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentIdx;
                    return (
                        <div className="ost-step" key={step.key}>
                            {i < STATUS_STEPS.length - 1 && (
                                <div className={`ost-line${done && i < currentIdx ? " done" : ""}`} />
                            )}
                            <img
                                src={step.icon}
                                alt={step.label}
                                className="ost-icon"
                            />
                            <span className="ost-label">{step.label}</span>
                            <div className={`ost-circle${done ? " done" : ""}`}>
                                {done && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Orders2() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("id");

    const memberId = sessionStorage.getItem("Member_id");
    const userEmail = sessionStorage.getItem("userEmail") || "";
    const username = sessionStorage.getItem("username") || userEmail.split("@")[0] || "User";

    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [shopAllOpen, setShopAllOpen] = useState(false);
    const [announcementIdx, setAnnouncementIdx] = useState(0);
    const [order, setOrder] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(true);
    const [countdown, setCountdown] = useState("24:00:00");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [expired, setExpired] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({ Name: '', Surname: '', Phone: '', Address: '' });
    const [addressSaving, setAddressSaving] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [promotionMap, setPromotionMap] = useState({});

    const announcements = [
        "[NEW!] Glasting Color Gloss Mini เปิดตัวพร้อมโปรโมชั่นสุดพิเศษ",
        "[NEW!] 4in1 Han All Eyepot Liner จะเป็นยังไงถ้ารวมอายแชโดว์ อายไลน์เนอร์ เข้าด้วยกัน",
        "Free Shipping! สั่งซื้อครบ 500 บาท จัดส่งฟรีทั่วประเทศ",
    ];

    useEffect(() => {
        if (!userEmail) { window.location.href = "/auth"; return; }
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/promotion')
            .then(r => r.json())
            .then(d => {
                const map = {};
                (d.promotions || []).forEach(p => {
                    map[Number(p.Promotion_id)] = { discount_value: Number(p.Discount_value) || 0, discountType: p.DiscountType || '' };
                });
                setPromotionMap(map);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnnouncementIdx(i => (i + 1) % announcements.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // โหลด order จาก API
    useEffect(() => {
        if (!memberId || !orderId) { setLoadingOrder(false); return; }
        setLoadingOrder(true);
        fetch(`http://localhost:5000/api/orders/${memberId}`)
            .then(r => r.json())
            .then(d => {
                const found = (d.orders || []).find(o => String(o.Order_id) === String(orderId));
                setOrder(found || null);
                setLoadingOrder(false);
            })
            .catch(() => setLoadingOrder(false));
    }, [orderId, memberId]);

    // countdown timer (สำหรับ order ที่ยังไม่ส่งสลิป: Status='O' หรือ 'P' เก่าที่ยังไม่มี Invoice_pic)
    const needsPayment = order?.Status === 'O' || (order?.Status === 'P' && !order?.Invoice_pic);

    // คำนวณตรงระหว่าง render → ไม่ต้องรอ useEffect cycle เลย
    // ถ้า Order_date อยู่ในอนาคต (data error) ให้ใช้ Date.now() เป็น effective start แทน
    const deadline = order?.Order_date
        ? Math.min(new Date(order.Order_date).getTime(), Date.now()) + 24 * 60 * 60 * 1000
        : null;
    const isExpired = !!(deadline && needsPayment && Date.now() >= deadline);

    useEffect(() => {
        if (!order?.Order_date || !needsPayment) return;
        const effectiveStart = Math.min(new Date(order.Order_date).getTime(), Date.now());
        const deadline = effectiveStart + 24 * 60 * 60 * 1000;
        let intervalId;
        let cancelCalled = false;

        const tick = () => {
            const diff = deadline - Date.now();
            if (diff <= 0) {
                setCountdown("00:00:00");
                setExpired(true);
                setOrder(prev => prev ? { ...prev, Status: 'Ca' } : prev); // อัปเดต UI ทันที ไม่รอ API
                clearInterval(intervalId);
                if (!cancelCalled) {
                    cancelCalled = true;
                    // ยิง API เบื้องหลัง ไม่ await ไม่ block UI
                    fetch("http://localhost:5000/api/orders/cancel", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ Order_id: orderId }),
                    }).catch(err => console.error("auto-cancel error:", err));
                }
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
        };

        // ตรวจสอบทันทีเมื่อ user กลับมาที่ tab/window (รองรับกรณีเปลี่ยนเวลาในเครื่อง)
        const onVisible = () => { if (document.visibilityState === "visible") tick(); };
        const onFocus   = () => tick();
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", onFocus);

        // ถ้าหมดเวลาตั้งแต่ตอนโหลด ไม่ต้อง start interval
        if (deadline - Date.now() <= 0) return;
        tick();
        intervalId = setInterval(tick, 1000);
        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("focus", onFocus);
        };
    }, [order]);

    // ── ตรวจจับการเปลี่ยนเวลาในเครื่องแยกต่างหาก (clock-jump detection) ──
    useEffect(() => {
        if (!order?.Order_date || !needsPayment) return;
        const effectiveStart = Math.min(new Date(order.Order_date).getTime(), Date.now());
        const deadline = effectiveStart + 24 * 60 * 60 * 1000;
        let lastTs = Date.now();
        let jumpCancelCalled = false;

        const detectJump = () => {
            const now = Date.now();
            const elapsed = now - lastTs;
            lastTs = now;
            // ถ้า elapsed > 3 วินาที แสดงว่านาฬิกากระโดด (ปกติ tick ทุก 2000ms)
            if (elapsed > 3000 && now >= deadline && !jumpCancelCalled) {
                jumpCancelCalled = true;
                setCountdown("00:00:00");
                setExpired(true);
                setOrder(prev => prev ? { ...prev, Status: 'Ca' } : prev);
                fetch("http://localhost:5000/api/orders/cancel", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Order_id: orderId }),
                }).catch(err => console.error("clock-jump cancel error:", err));
            }
        };

        const jumpInterval = setInterval(detectJump, 2000);
        return () => clearInterval(jumpInterval);
    }, [order]);

    const handleLogout = () => {
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("Member_id");
        window.location.href = "/auth";
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const openAddressModal = () => {
        setAddressForm({
            Name: order?.Name || '',
            Surname: order?.Surname || '',
            Phone: order?.Phone || '',
            Address: order?.Address || '',
        });
        setAddressError('');
        setShowAddressModal(true);
    };

    const cancelAddressEdit = () => {
        setShowAddressModal(false);
        setAddressError('');
    };

    const handleAddressSave = async () => {
        if (!addressForm.Name.trim() || !addressForm.Address.trim()) {
            setAddressError('กรุณากรอกชื่อและที่อยู่');
            return;
        }
        setAddressSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${order.Order_id}/address`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...addressForm, member_id: memberId }),
            });
            const data = await res.json();
            if (!res.ok) { setAddressError(data.error || 'เกิดข้อผิดพลาด'); return; }
            setOrder(o => ({ ...o, ...addressForm }));
            setShowAddressModal(false);
        } catch (e) {
            setAddressError('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setAddressSaving(false);
        }
    };

    const handleReorder = async () => {
        if (!order?.items || order.items.length === 0) return;
        try {
            // ดึง cart ปัจจุบันจาก backend ก่อน เพื่อ merge
            const res = await fetch(`http://localhost:5000/api/cart/${memberId}`);
            const data = await res.json();
            const existing = (data.cart || []).filter(i => i.Product_id);

            // รวมรายการเดิม + รายการใหม่จาก order
            const merged = [...existing];
            order.items.forEach(item => {
                const found = merged.find(c => c.Product_id === item.id);
                if (found) {
                    found.Quantity += item.qty;
                    found.Total = found.Quantity * found.Price;
                } else {
                    merged.push({
                        Product_id: item.id,
                        Quantity:   item.qty,
                        Price:      item.price,
                        Total:      item.price * item.qty,
                    });
                }
            });

            await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Member_id:  memberId,
                    cart_items: merged.map(i => ({
                        Product_id: i.Product_id,
                        Quantity:   i.Quantity,
                        Price:      i.Price,
                        Total:      i.Total,
                    })),
                }),
            });

            // ลบ order ที่ยกเลิกออกจาก localStorage (จะสร้างใหม่เมื่อไปถึงหน้า Pay)
            const allOrders = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
            const filtered = allOrders.filter(o => String(o.id) !== String(orderId));
            localStorage.setItem("pendingOrders", JSON.stringify(filtered));

            navigate("/cart");
        } catch (err) {
            console.error("reorder error:", err);
        }
    };

    const confirmCancel = async () => {
        try {
            await fetch("http://localhost:5000/api/orders/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Order_id: orderId }),
            });
        } catch (err) {
            console.error("cancel order error:", err);
        }
        setShowCancelModal(false);
        navigate("/orders");
    };

    // O หรือ P ที่ไม่มี slip = Order List, P ที่มี slip = To Pay, A/S/R/C/Ca = ตามปกติ
    const currentStatus = (() => {
        if (!order) return "placed";
        if (order.Status === 'O') return "placed";
        if (order.Status === 'P') return order.Invoice_pic ? "accepted" : "placed";
        return { A: "progress", S: "ontheway", R: "delivered", C: "cancelled", Ca: "placed" }[order.Status] || "placed";
    })();

    return (
        <>
            {/* ── Cancel Confirm Modal ── */}
            {showCancelModal && (
                <div className="cancel-modal-backdrop" onClick={() => setShowCancelModal(false)}>
                    <div className="cancel-modal" onClick={e => e.stopPropagation()}>
                        <div className="cancel-modal-icon">
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="11" stroke="#e74c3c" strokeWidth="1.5" fill="#fdf0ef"/>
                                <path d="M12 7v5.5" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="12" cy="16.5" r="1" fill="#e74c3c"/>
                            </svg>
                        </div>
                        <div className="cancel-modal-title">ยกเลิกคำสั่งซื้อ</div>
                        <div className="cancel-modal-desc">คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?<br/>การดำเนินการนี้ไม่สามารถย้อนกลับได้</div>
                        <div className="cancel-modal-actions">
                            <button className="cancel-modal-no" onClick={() => setShowCancelModal(false)}>ไม่ยกเลิก</button>
                            <button className="cancel-modal-yes" onClick={confirmCancel}>ยืนยันยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Address: inline (no popup) ── */}

            {/* ── Announcement Bar ── */}
            <div className="announcement-bar">
                {announcements.map((text, i) => (
                    <div key={i} className={`announcement-slide${i === announcementIdx ? " active" : ""}`}>
                        <span>{text}</span>
                    </div>
                ))}
            </div>

            {/* ── Overlay ── */}
            <div className={`overlay${sideMenuOpen ? " active" : ""}`} onClick={() => setSideMenuOpen(false)} />

            {/* ── Side Menu ── */}
            <div className={`side-menu${sideMenuOpen ? " active" : ""}`}>
                <div className="close-btn" onClick={() => setSideMenuOpen(false)}>✕</div>
                <div className="login-section">
                    <span onClick={() => { window.location.href = "/app"; }}>REGISTER</span>
                    <span className="divider">|</span>
                    <span onClick={() => { window.location.href = "/app"; }}>LOGIN</span>
                </div>
                <ul>
                    <li onClick={() => navigate("/")}>MYPAGE</li>
                    <div className="menu-header" onClick={() => setShopAllOpen(!shopAllOpen)}>
                        <span>SHOP ALL</span>
                        <span className={`toggle-icon${shopAllOpen ? " active" : ""}`}>+</span>
                    </div>
                    <ul className={`submenu${shopAllOpen ? " active" : ""}`}>
                        <li onClick={() => navigate("/promotion")}>PROMOTION</li>
                        <li onClick={() => navigate("/bestsellerform")}>BEST</li>
                        <li onClick={() => navigate("/new")}>NEW</li>
                        <li onClick={() => navigate("/face")}>FACE</li>
                        <li onClick={() => navigate("/eye")}>EYE</li>
                        <li onClick={() => navigate("/lip")}>LIP</li>
                        <li onClick={() => navigate("/cheek")}>CHEEK</li>
                    </ul>
                    <li className="title">EVENT</li>
                    <li className="title">MEMBERSHIP</li>
                    <li className="title">REVIEW</li>
                    <li className="title">STOCKIST</li>
                    <li className="title">ABOUT US</li>
                    <li className="title">COMMUNITY</li>
                </ul>
            </div>

            {/* ── Header ── */}
            <header className="main-header">
                <div className="menu-icon" onClick={() => setSideMenuOpen(true)}>
                    <div className="bar" /><div className="bar" /><div className="bar" />
                </div>
                <div className="logo-container" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                    <h1 className="romand-logo">rom&amp;nd</h1>
                </div>
                <div className="header-icons">
                    <span className="icon-link" style={{ cursor: "pointer" }} onClick={() => navigate("/account")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </span>
                    <span className="icon-link cart-icon" style={{ cursor: "pointer" }} onClick={() => navigate("/cart")}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </span>
                </div>
            </header>

            {/* ── Account Layout ── */}
            <div className="account-layout">

                {/* LEFT: Sidebar */}
                <div className="account-sidebar">
                    <div className="sidebar-welcome">Welcome, {username}.</div>
                    <nav className="sidebar-nav">
                        <button className="sidebar-item" onClick={() => navigate("/account")}>
                            <span className="sidebar-icon">
                                <img src="/user.png" alt="icon" style={{ width: 24, height: 24, verticalAlign: "middle" }} />
                            </span>
                            <span>ข้อมูลส่วนตัว</span>
                        </button>
                        <button className="sidebar-item active" onClick={() => navigate("/orders")}>
                            <span className="sidebar-icon">
                                <img src="/cart1.png" alt="icon" style={{ width: 24, height: 24, verticalAlign: "middle" }} />
                            </span>
                            <span>การซื้อของฉัน</span>
                        </button>
                        <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
                            <span className="sidebar-icon">
                                <img src="/logout.png" alt="logout" style={{ width: 24, height: 24, verticalAlign: "middle" }} />
                            </span>
                            <span>ออกจากระบบ</span>
                        </button>
                    </nav>
                </div>

                {/* RIGHT: Order Detail */}
                <div className="account-content">
                    {/* ปุ่มกลับ */}
                    <div className="orders-header" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button
                            onClick={() => navigate("/orders")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 20,
                                color: "#c0607a",
                                padding: "4px 8px 4px 0",
                                lineHeight: 1,
                            }}
                        >
                            ‹
                        </button>
                        <span className="orders-title">รายละเอียดคำสั่งซื้อ</span>
                    </div>

                    {loadingOrder ? (
                        <div style={{ padding: "32px", textAlign: "center", color: "#999" }}>กำลังโหลด...</div>
                    ) : !order ? (
                        <div style={{ padding: "32px", textAlign: "center", color: "#999" }}>
                            ไม่พบรายการนี้
                        </div>
                    ) : (
                        <>
                            {/* Order Status Tracker */}
                            <div className="order-block">
                                <OrderStatusTracker currentStatus={currentStatus} />
                            </div>

                            {/* รายการสินค้า + ยอดรวม + footer ในกรอบขาว */}
                            <div className="order-status-tracker" style={{ marginTop: 0 }}>

                                {/* ── ข้อมูลการจัดส่ง ── */}
                                {order.TrackingNo && (
                                    <div style={{ padding: '14px 20px 0' }}>
                                        <div style={{ background: '#ffffff', border: '1px solid #FF8FAB', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <img src="/shipping.png" alt="shipping" style={{ width: 23, height: 23, objectFit: 'contain' }} />
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: '#000000', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>ข้อมูลการจัดส่ง</div>
                                                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a1a' }}>
                                                    Flash Express : <span style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{order.TrackingNo}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── ที่อยู่จัดส่ง ── */}
                                {order.Address && (
                                    <div style={{ padding: '10px 20px 0' }}>
                                        <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 10, padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                <div style={{ fontSize: 15, fontWeight: 700, color: '#000000', textTransform: 'uppercase', letterSpacing: '.8px' }}>ที่อยู่จัดส่ง</div>
                                                {['O', 'P'].includes(order.Status) && !showAddressModal && (
                                                    <button onClick={openAddressModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 6, color: '#888', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                        แก้ไข
                                                    </button>
                                                )}
                                            </div>

                                            {!showAddressModal ? (
                                                /* ── View Mode ── */
                                                <>
                                                    <div style={{ fontSize: 13.5, color: '#333', lineHeight: 1.5 }}>{order.Name} {order.Surname}</div>
                                                    {order.Phone && <div style={{ fontSize: 12.5, color: '#666', marginTop: 2 }}>{order.Phone}</div>}
                                                    <div style={{ fontSize: 13, color: '#555', marginTop: 4, lineHeight: 1.6 }}>{order.Address}</div>
                                                </>
                                            ) : (
                                                /* ── Edit Mode (inline, same style as AdminOrders) ── */
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
                                                        <div>
                                                            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9a9a9a', marginBottom: 4 }}>ชื่อ</div>
                                                            <input
                                                                value={addressForm.Name}
                                                                onChange={e => setAddressForm(f => ({ ...f, Name: e.target.value }))}
                                                                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', fontSize: 13, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9a9a9a', marginBottom: 4 }}>นามสกุล</div>
                                                            <input
                                                                value={addressForm.Surname}
                                                                onChange={e => setAddressForm(f => ({ ...f, Surname: e.target.value }))}
                                                                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', fontSize: 13, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9a9a9a', marginBottom: 4 }}>เบอร์โทร</div>
                                                        <input
                                                            value={addressForm.Phone}
                                                            onChange={e => setAddressForm(f => ({ ...f, Phone: e.target.value }))}
                                                            style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', fontSize: 13, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: '#9a9a9a', marginBottom: 4 }}>ที่อยู่จัดส่ง</div>
                                                        <textarea
                                                            value={addressForm.Address}
                                                            onChange={e => setAddressForm(f => ({ ...f, Address: e.target.value }))}
                                                            rows={2}
                                                            style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', fontSize: 13, background: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                                                        />
                                                    </div>
                                                    {addressError && <div style={{ color: '#e74c3c', fontSize: 12 }}>{addressError}</div>}
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 2 }}>
                                                        <button onClick={cancelAddressEdit} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: '#6b6b6b' }}>ยกเลิก</button>
                                                        <button onClick={handleAddressSave} disabled={addressSaving} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#FFC2D1', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: '#1a1a1a' }}>
                                                            {addressSaving ? 'บันทึก...' : 'บันทึก'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pending-order-items" style={{ marginTop: (order.Address || order.TrackingNo) ? 14 : 0 }}>
                                    {(order.detail_summary ? order.detail_summary.split(';;') : []).map((s, i) => {
                                        const [name, qty, price, image, model, promoId] = s.split('|');
                                        return (
                                            <div className="pending-order-item-row" key={i}>
                                                <div className="pending-order-item-img">
                                                    {image ? (
                                                        <img
                                                            src={`http://localhost:5000/uploads/${image.replace(/^uploads[\/\\]/, "")}`}
                                                            alt={name}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <div className="pending-order-img-placeholder">{(name || '?')[0]}</div>
                                                    )}
                                                </div>
                                                <div className="pending-order-item-info">
                                                    <span className="pending-order-item-name">
                                                        {Number(price) === 0 && (
                                                            <span style={{ display: 'inline-block', background: 'transparent', color: '#e0006b', border: '1.5px solid #e0006b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', padding: '1px 7px', marginRight: '6px', verticalAlign: 'middle' }}>Buy 1 Get 1</span>
                                                        )}
                                                        {Number(price) > 0 && promoId != null && promotionMap[Number(promoId)] && !/^buy\s+\d+\s+get\s+\d+/i.test(promotionMap[Number(promoId)].discountType) && (
                                                            <span style={{ display: 'inline-block', background: 'transparent', color: '#e0006b', border: '1.5px solid #e0006b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', padding: '1px 7px', marginRight: '6px', verticalAlign: 'middle' }}>{promotionMap[Number(promoId)].discount_value}%</span>
                                                        )}
                                                        {name}
                                                    </span>
                                                    {model && <span className="pending-order-item-model">{model}</span>}
                                                    <span className="pending-order-item-qty">x{qty}</span>
                                                </div>
                                                <div className="pending-order-item-price">
                                                    {Number(price) === 0
                                                        ? <span style={{ color: '#e0006b', fontWeight: 'bold' }}>฿0</span>
                                                        : `฿${(Number(price) * Number(qty)).toLocaleString()}`
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* ยอดรวม */}
                                <div className="pending-order-subtotal">
                                    ยอดรวม: <strong>฿{Number(order.Proprice).toLocaleString()}</strong>
                                </div>

                                <div className="pending-order-footer">
                                    <div className="pending-order-countdown" style={{
                                        color: order.Status === 'Ca' ? '#c0392b'
                                             : order.Status === 'C'  ? '#1e8449'
                                             : order.Status === 'A'  ? '#2980b9'
                                             : order.Status === 'S'  ? '#27ae60'
                                             : order.Status === 'R'  ? '#7b1fa2'
                                             : (order.Status === 'P' && order.Invoice_pic) ? '#f39c12'
                                             : '#5c6bc0',
                                        fontWeight: 500
                                    }}>
                                    {(needsPayment && !isExpired)
                                            ? ' สร้างรายการสั่งซื้อ'
                                            : { P: ' รอตรวจสอบ', A: ' ยืนยันคำสั่งซื้อ', S: ' จัดส่งสินค้าแล้ว', R: ' ถึงผู้รับแล้ว', C: ' เสร็จเรียบร้อย', Ca: ' ยกเลิกคำสั่งซื้อ'}[isExpired ? 'Ca' : order.Status] || ''
                                        }
                                    </div>
                                    {(needsPayment || isExpired) && (
                                        <div className="pending-order-btn-group">
                                            {(isExpired || expired) ? (
                                                <div className="pending-order-countdown" style={{ color: '#c0392b' }}>
                                                    ⏰ หมดเวลาชำระเงิน — คำสั่งซื้อถูกยกเลิกอัตโนมัติ
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="pending-order-countdown">
                                                        ชำระภายใน <span className="countdown-time">{countdown}</span> ผ่านการโอนเงิน
                                                    </div>
                                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                        <button
                                                            className="pending-order-pay-btn"
                                                            onClick={() => navigate(`/pay?orderId=${order.Order_id}`)}
                                                        >
                                                            ชำระเงิน
                                                        </button>
                                                        <button className="pending-order-cancel-btn" onClick={handleCancel}>ยกเลิกสินค้า</button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-column">
                        <h3>Contact Us</h3>
                        <p>romand202208@gmail.com</p>
                    </div>
                    <div className="footer-column">
                        <h3>Customer Service</h3>
                        <ul>
                            <li><a href="#">นโยบายความเป็นส่วนตัว</a></li>
                            <li><a href="#">การคืน / การขอเงินคืน</a></li>
                            <li><a href="#">เงื่อนไขการให้บริการ</a></li>
                            <li><a href="#">ข้อมูลการจัดส่ง</a></li>
                            <li><a href="#">California Proposition 65</a></li>
                            <li><a href="#">CCPA &amp; US Privacy Laws</a></li>
                            <li><a href="#">Accessibility Statement</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Newsletter</h3>
                        <p>สมัครรับข่าวสาร ข้อเสนอพิเศษ และอัปเดตจากเรา</p><br />
                        <p className="highlight">❤️ รับส่วนลดเพิ่มอีก 20% ทันที!</p><br />
                        <form onSubmit={e => e.preventDefault()}>
                            <input type="email" placeholder="Enter email" className="email-input" />
                            <button className="signup-btn" type="submit">Sign up</button>
                        </form>
                    </div>
                </div>
            </footer>
        </>
    );
}
