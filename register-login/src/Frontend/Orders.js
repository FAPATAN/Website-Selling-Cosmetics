import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import "./Orders.css";
const API = process.env.REACT_APP_API_URL;

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

export default function Orders() {
    const navigate = useNavigate();
    const memberId = sessionStorage.getItem("Member_id");
    const userEmail = sessionStorage.getItem("userEmail") || "";
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [shopAllOpen, setShopAllOpen] = useState(false);
    const [announcementIdx, setAnnouncementIdx] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const username = sessionStorage.getItem("username") || userEmail.split("@")[0] || "User";
    const isLoggedIn = !!memberId && !!userEmail;
    const [showLoginModal, setShowLoginModal] = useState(false);

    const announcements = [
        "[NEW!] Glasting Color Gloss Mini ?????????????????????????????",
        "[NEW!] 4in1 Han All Eyepot Liner ?????????????????????????? ???????????? ???????????",
        "Free Shipping! ??????????? 500 ??? ???????????????????",
    ];

    useEffect(() => {
        if (!userEmail) { setShowLoginModal(true); }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnnouncementIdx(i => (i + 1) % announcements.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // ???? orders ??? API
    useEffect(() => {
        if (!memberId) return;
        setLoadingOrders(true);
        fetch(`${API}/api/orders/${memberId}`)
            .then(r => r.json())
            .then(d => { setPendingOrders(d.orders || []); setLoadingOrders(false); })
            .catch(() => setLoadingOrders(false));
    }, [memberId]);

    const handleLogout = () => {
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("Member_id");
        window.location.href = "/auth";
    };

    return (
        <>
            {/* -- Announcement Bar -- */}
            <div className="announcement-bar">
                {announcements.map((text, i) => (
                    <div key={i} className={`announcement-slide${i === announcementIdx ? " active" : ""}`}>
                        <span>{text}</span>
                    </div>
                ))}
            </div>

            {/* -- Overlay -- */}
            <div className={`overlay${sideMenuOpen ? " active" : ""}`} onClick={() => setSideMenuOpen(false)} />

            {/* -- Side Menu -- */}
            <div className={`side-menu${sideMenuOpen ? " active" : ""}`}>
                <div className="close-btn" onClick={() => setSideMenuOpen(false)}>?</div>
                <div className="login-section">
                    <span onClick={() => { window.location.href = "/auth"; }}>REGISTER</span>
                    <span className="divider">|</span>
                    <span onClick={() => { window.location.href = "/auth"; }}>LOGIN</span>
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

            {/* -- Header -- */}
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
                        <span className="cart-badge">0</span>
                    </span>
                </div>
            </header>

            {/* -- Account Layout -- */}
            <div className="account-layout">

                {/* LEFT: Sidebar */}
                <div className="account-sidebar">
                    <div className="sidebar-welcome">Welcome, {username}.</div>
                    <nav className="sidebar-nav">
                        <button className="sidebar-item" onClick={() => navigate("/account")}>
                            <span className="sidebar-icon">
                                <img src="/user.png" alt="icon" style={{ width: 24, height: 24, verticalAlign: "middle" }} />
                            </span>
                            <span>?????????????</span>
                        </button>
                        <button className="sidebar-item active" onClick={() => navigate("/orders")}>
                            <span className="sidebar-icon">
                                <img src="/cart1.png" alt="icon" style={{ width: 24, height: 24, verticalAlign: "middle" }} />
                            </span>
                            <span>?????????????</span>
                        </button>
                        <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
                            <span className="sidebar-icon">
                                <img src="/logout.png" alt="logout" style={{ width: 24, height: 24, verticalAlign: "middle" }} />
                            </span>
                            <span>??????????</span>
                        </button>
                    </nav>
                </div>

                {/* RIGHT: Orders Content */}
                <div className="account-content">
                    <div className="orders-header">
                        <span className="orders-title">?????????????</span>
                    </div>

                    <div className="orders-list">
                        {loadingOrders ? (
                            <div style={{ padding: "32px", textAlign: "center", color: "#999" }}>?????????...</div>
                        ) : pendingOrders.length === 0 ? (
                            <div style={{ padding: "32px", textAlign: "center", color: "#999" }}>???????????????????</div>
                        ) : (
                            <div className="order-numbered-list">
                                {pendingOrders.map((order, idx) => {
                                    const items = order.detail_summary
                                        ? order.detail_summary.split(';;').map(s => { const [name, qty, price, image] = s.split('|'); return { name, qty: parseInt(qty)||1, price, image }; })
                                        : [];
                                    const displayStatus = (order.Status === 'P' && !order.Invoice_pic) ? 'O' : order.Status;
                                    const statusBadge = {
                                        O:  { cls: "order-created",         text: " ???????????????????" },
                                        P:  { cls: "waiting",               text: " ?????????" },
                                        A:  { cls: "slip-sent",             text: " ????????????????" },
                                        S:  { cls: "status-delivered",      text: " ????????????????" },
                                        R:  { cls: "status-delivered",      text: " ?????????????" },
                                        C:  { cls: "slip-sent",             text: " ??????????????" },
                                        Ca: { cls: "status-cancelled-order",text: " ????????????????" },
                                    }[displayStatus] || { cls: "order-created", text: " ???????????????????" };
                                    return (
                                        <div
                                            key={order.Order_id}
                                            className="order-numbered-item"
                                            onClick={() => navigate(`/orders2?id=${order.Order_id}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="order-numbered-row">
                                                <div className="order-numbered-left">
                                                    <span className="order-numbered-index">{idx + 1}</span>
                                                    <div className="order-numbered-info">
                                                        <span className="order-numbered-title">
                                                            {items[0]?.name || `Order #${order.Order_id}`}{items.length > 1 ? ` +${items.length - 1} ??????` : ""}
                                                        </span>
                                                        <span className="order-numbered-total">?{Number(order.Proprice).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="order-numbered-right">
                                                    <span className={`order-status-badge ${statusBadge.cls}`}>{statusBadge.text}</span>
                                                    <span className="order-numbered-arrow">›</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* -- Footer -- */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-column">
                        <h3>Contact Us</h3>
                        <p>romand202208@gmail.com</p>
                    </div>
                    <div className="footer-column">
                        <h3>Customer Service</h3>
                        <ul>
                            <li><a href="#">?????????????????????</a></li>
                            <li><a href="#">?????? / ????????????</a></li>
                            <li><a href="#">????????????????????</a></li>
                            <li><a href="#">???????????????</a></li>
                            <li><a href="#">California Proposition 65</a></li>
                            <li><a href="#">CCPA &amp; US Privacy Laws</a></li>
                            <li><a href="#">Accessibility Statement</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Newsletter</h3>
                        <p>??????????????? ???????????? ???????????????</p><br />
                        <p className="highlight">?? ????????????????? 20% ?????!</p><br />
                        <form onSubmit={e => e.preventDefault()}>
                            <input type="email" placeholder="Enter email" className="email-input" />
                            <button className="signup-btn" type="submit">Sign up</button>
                        </form>
                    </div>
                </div>
            </footer>

            {/* Login Required Modal */}
            {showLoginModal && (
                <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={() => setShowLoginModal(false)}>
                    <div style={{background:'#fff',borderRadius:16,padding:'36px 40px',maxWidth:340,width:'90%',textAlign:'center',boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}} onClick={e => e.stopPropagation()}>
                        <div style={{fontSize:40,marginBottom:12}}><img src="/lock.png" alt="lock" style={{width:40,height:40}} /></div>
                        <div style={{fontWeight:700,fontSize:18,marginBottom:8,color:'#1a1a1a'}}>????????????????????</div>
                        <div style={{color:'#888',fontSize:14,marginBottom:24}}>??????? login ?????????????????????????</div>
                        <div style={{display:'flex',gap:10,justifyContent:'center'}}>
                            <button onClick={() => navigate(-1)} style={{padding:'10px 22px',borderRadius:8,border:'1px solid #ddd',background:'#f5f5f5',cursor:'pointer',fontWeight:600}}>??????</button>
                            <button onClick={() => navigate('/auth')} style={{padding:'10px 22px',borderRadius:8,border:'none',background:'#1a1a1a',color:'#fff',cursor:'pointer',fontWeight:600}}>Login</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
