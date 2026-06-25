import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import { fetchUserProfile, updateUserProfile, changePassword } from "./api";

/* ───────────── PasswordField ───────────── */
function PasswordField({ label, value, onChange, placeholder }) {
    return (
        <div className="field-group">
            <label className="field-label">{label}</label>
            <input
                type="password"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="profile-input"
            />
        </div>
    );
}

/* ───────────── InfoItem ───────────── */
function InfoItem({ label, value, editMode, onChange }) {
    return (
        <div>
            <div className="info-label">{label}</div>
            {editMode ? (
                <input value={value} onChange={onChange} className="info-input" />
            ) : (
                <div className="info-value">{value}</div>
            )}
        </div>
    );
}

/* ───────────── Sidebar ───────────── */
function AccountSidebar({ active, onSelect, username, onLogout }) {
    const menuItems = [
        { id: "dashboard", label: "ข้อมูลส่วนตัว", icon: "/user.png", iconActive: "/user1.png" },
        { id: "orders", label: "การซื้อของฉัน", icon: "/cart.png", iconActive: "/cart1.png" },
    ];

    return (
        <div className="account-sidebar">
            <div className="sidebar-welcome">Welcome, {username || ""}.</div>
            <nav className="sidebar-nav">
                                {menuItems.map(item => (
                                        <button
                                                key={item.id}
                                                className={`sidebar-item${active === item.id ? " active" : ""}`}
                                                onClick={() => onSelect(item.id)}
                                        >
                                                <span className="sidebar-icon">
                                                    {typeof item.icon === "string" && item.icon.startsWith("/") ? (
                                                        <img
                                                            src={active === item.id && item.iconActive ? item.iconActive : item.icon}
                                                            alt="icon"
                                                            style={{ width: 24, height: 24, verticalAlign: "middle" }}
                                                        />
                                                    ) : item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                        </button>
                                ))}
                <button className="sidebar-item sidebar-logout" onClick={onLogout}>
                    <span className="sidebar-icon">
                        <img src="/logout.png" alt="logout" style={{ width: 24, height: 24, verticalAlign: "middle" }} />
                    </span>
                    <span>ออกจากระบบ</span>
                </button>
            </nav>
        </div>
    );
}

/* ───────────── Main Component ───────────── */
export default function ProfileSettings() {
    const navigate = useNavigate();
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [shopAllOpen, setShopAllOpen] = useState(false);
    const [announcementIdx, setAnnouncementIdx] = useState(0);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const memberId = sessionStorage.getItem('Member_id');
        if (!memberId) return;
        fetch(`http://localhost:5000/api/cart/${memberId}`)
            .then(res => res.json())
            .then(data => {
                if (data.cart) {
                    const count = data.cart.filter(item => item.Product_id).reduce((sum, item) => sum + (Number(item.Quantity) || 0), 0);
                    setCartCount(count);
                }
            })
            .catch(() => setCartCount(0));
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
    const [toast, setToast] = useState(false);

    const [profile, setProfile] = useState({
        name: "", surname: "", email: "", contact: "", username: "", address: "",
    });

    useEffect(() => {
        const email = sessionStorage.getItem("userEmail");
        if (!email) { setIsLoggedIn(false); return; }
        setIsLoggedIn(true);
        fetchUserProfile(email)
            .then(data => {
                const p = {
                    name: data.Name || "", surname: data.Surname || "",
                    email: data.Email || "", contact: data.Phone || "",
                    username: data.Username || "", address: data.Address || "",
                };
                setProfile(p);
                setDraft(p);
            })
            .catch(() => {});
    }, []);

    const [draft, setDraft] = useState({ ...profile });

    const announcements = [
        "[NEW!] Glasting Color Gloss Mini เปิดตัวพร้อมโปรโมชั่นสุดพิเศษ",
        "[NEW!] 4in1 Han All Eyepot Liner จะเป็นยังไงถ้ารวมอายแชโดว์ อายไลน์เนอร์ เข้าด้วยกัน",
        "Free Shipping! สั่งซื้อครบ 500 บาท จัดส่งฟรีทั่วประเทศ",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setAnnouncementIdx(i => (i + 1) % announcements.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const handleEditToggle = () => {
        if (editMode) setDraft({ ...profile });
        setEditMode(!editMode);
    };

    const handleSave = async () => {
        try {
            await updateUserProfile({
                email: draft.email, name: draft.name, surname: draft.surname,
                contact: draft.contact, username: draft.username, address: draft.address,
            });
            if (passwords.current && passwords.newPw && passwords.confirm) {
                if (passwords.newPw !== passwords.confirm) {
                    alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน"); return;
                }
                await changePassword({ email: draft.email, currentPassword: passwords.current, newPassword: passwords.newPw });
                setPasswords({ current: "", newPw: "", confirm: "" });
            }
            setProfile({ ...draft });
            setEditMode(false);
            setToast(true);
            setTimeout(() => setToast(false), 2500);
        } catch {
            alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูลหรือเปลี่ยนรหัสผ่าน");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("Member_id");
        window.location.href = "/auth";
    };

    return (
        <>
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
                    <li onClick={() => { window.location.href = "/Home/home.html"; }}>MYPAGE</li>
                    <div className="menu-header" onClick={() => setShopAllOpen(!shopAllOpen)}>
                        <span>SHOP ALL</span>
                        <span className={`toggle-icon${shopAllOpen ? " active" : ""}`}>+</span>
                    </div>
                    <ul className={`submenu${shopAllOpen ? " active" : ""}`}>
                        <li style={{cursor:'pointer'}} onClick={() => navigate('/promotion')}>PROMOTION</li>
                        <li style={{cursor:'pointer'}} onClick={() => navigate('/bestsellerform')}>BEST</li>
                        <li style={{cursor:'pointer'}} onClick={() => navigate('/new')}>NEW</li>
	                    <li style={{cursor:'pointer'}} onClick={() => navigate('/face')}>FACE</li>
	                    <li style={{cursor:'pointer'}} onClick={() => navigate('/eye')}>EYE</li>
	                    <li style={{cursor:'pointer'}} onClick={() => navigate('/lip')}>LIP</li>
	                    <li style={{cursor:'pointer'}} onClick={() => navigate('/cheek')}>CHEEK</li>
                    </ul>
                    <li className="title">ABOUT US</li>
                    <li className="title">COMMUNITY</li>
                </ul>
            </div>

            {/* ── Header ── */}
            <header className="main-header">
                <div className="menu-icon" onClick={() => setSideMenuOpen(true)}>
                    <div className="bar" /><div className="bar" /><div className="bar" />
                </div>
                <div className="logo-container" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
                    <h1 className="romand-logo">rom&amp;nd</h1>
                </div>
                <div className="header-icons">
                    <a href="#account" className="icon-link">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </a>
                    <span className="icon-link cart-icon" style={{cursor:'pointer'}} onClick={() => navigate('/cart')}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg> 
                        <span className="cart-badge">{cartCount}</span>
                    </span>
                </div>
            </header>

            {/* ── Account Layout ── */}
            <div className="account-layout">

                {/* LEFT: Sidebar */}
                <AccountSidebar
                    active={activeMenu}
                    onSelect={(id) => {
                        if (id === "orders") {
                            window.location.href = "/orders";
                        } else setActiveMenu(id);
                    }}
                    username={isLoggedIn ? (profile.username || profile.name) : ""}
                    onLogout={handleLogout}
                />

                {/* RIGHT: Profile Content */}
                <div className="account-content">

                    {/* Page Header */}
                    <div className="profile-page-header">
                        <span className="profile-page-title">Profile &amp; Settings</span>
                        <div style={{display:'flex',gap:'10px'}}>
                            {!isLoggedIn && (
                                <button className="btn-edit-profile" style={{background:'#3aafa9'}} onClick={() => navigate('/auth')}>
                                    Login
                                </button>
                            )}
                            {isLoggedIn && (
                                <button
                                    className={editMode ? "btn-cancel-edit" : "btn-edit-profile"}
                                    onClick={handleEditToggle}
                                >
                                    {editMode ? "Cancel Edit" : "Edit Profile"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="profile-card">
                        <div className="card-title">Profile Information</div>
                        <div className="info-grid">
                            <InfoItem label="NAME" value={draft.name} editMode={isLoggedIn && editMode}
                                onChange={e => setDraft({ ...draft, name: e.target.value })} />
                            <InfoItem label="SURNAME" value={draft.surname} editMode={isLoggedIn && editMode}
                                onChange={e => setDraft({ ...draft, surname: e.target.value })} />
                            <InfoItem label="EMAIL" value={draft.email} editMode={isLoggedIn && editMode}
                                onChange={e => setDraft({ ...draft, email: e.target.value })} />
                            <InfoItem label="CONTACT NUMBER" value={draft.contact} editMode={isLoggedIn && editMode}
                                onChange={e => setDraft({ ...draft, contact: e.target.value })} />
                            <InfoItem label="USERNAME" value={draft.username} editMode={isLoggedIn && editMode}
                                onChange={e => setDraft({ ...draft, username: e.target.value })} />
                            <div className="full-width">
                                <InfoItem label="ADDRESS" value={draft.address} editMode={isLoggedIn && editMode}
                                    onChange={e => setDraft({ ...draft, address: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="profile-card">
                        <div className="card-title">Change Password</div>
                        <PasswordField label="Current Password" value={passwords.current}
                            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                            placeholder="Enter current password" />
                        <PasswordField label="New Password" value={passwords.newPw}
                            onChange={e => setPasswords({ ...passwords, newPw: e.target.value })}
                            placeholder="Enter new password" />
                        <PasswordField label="Confirm Password" value={passwords.confirm}
                            onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                            placeholder="Confirm new password" />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "16px" }}>
                        <button className="btn-save-changes" onClick={handleSave}>Save Changes</button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            <div className={`toast-msg${toast ? " show" : ""}`}>✓ Changes saved successfully!</div>

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