import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Shipping.css";
const API = process.env.REACT_APP_API_URL;

export default function Shipping() {
  const navigate = useNavigate();
  const memberId = sessionStorage.getItem("Member_id");
  const userEmail = sessionStorage.getItem("userEmail") || "";
  const isLoggedIn = !!memberId;

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [shopAllOpen, setShopAllOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [promotionMap, setPromotionMap] = useState({});

  // อ่านข้อมูลที่บันทึกจากหน้า Information
  const shippingInfo = (() => {
    try { return JSON.parse(localStorage.getItem(`shippingInfo_${memberId}`) || "{}"); }
    catch { return {}; }
  })();

  const fullAddress = [
    shippingInfo.address,
    shippingInfo.apartment,
    shippingInfo.city,
    shippingInfo.province,
    shippingInfo.postalCode,
    shippingInfo.country,
  ].filter(Boolean).join(", ");

  const contactEmail = userEmail;

  // โหลด promotion map
  useEffect(() => {
    fetch(`${API}/api/promotion`)
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

  // โหลด cart จาก backend
  useEffect(() => {
    if (!memberId) return;
    fetch(`${API}/api/cart/${memberId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          const items = data.cart.filter((i) => i.Product_id).map((i) => ({
            id: i.Product_id,
            name: i.Product_name,
            image: i.Image,
            model: i.Product_model,
            qty: Number(i.Quantity),
            price: Number(i.Price) || 0,
            promotion_id: i.Promotion_id || i.promotion_id,
            discount_value: i.Discount_value != null ? Number(i.Discount_value) : null,
          }));
          setCart(items);
          setCartCount(items.reduce((s, i) => s + i.qty, 0));
        }
      })
      .catch(() => {});
  }, [memberId]);

  // Auto-slide แถบประกาศ
  useEffect(() => {
    const slides = document.querySelectorAll(".announcement-slide");
    let idx = 0;
    const interval = setInterval(() => {
      slides.forEach((slide, i) => slide.classList.toggle("active", i === idx));
      idx = (idx + 1) % slides.length;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Search toggle
  useEffect(() => {
    const searchForm = document.querySelector(".search-form");
    const searchButton = document.querySelector(".search-button");
    const searchHandler = () => searchForm?.classList.toggle("active-search");
    if (searchButton && searchForm) searchButton.addEventListener("click", searchHandler);
    return () => { if (searchButton) searchButton.removeEventListener("click", searchHandler); };
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: "#d00", fontSize: "1.2rem" }}>
        กรุณาเข้าสู่ระบบก่อน
      </div>
    );
  }

  return (
    <>
      {/* ===== แถบประกาศ ===== */}
      <div className="announcement-bar">
        <div className="announcement-slide active">
          <span>[NEW!] Rom&ndXZO&FRIENDS "มากกว่าความน่ารักและเสน่ห์เหลือล้น เราหวังว่าคอลเลคชั่นนี้จะมอบความอบอุ่นและกล้าหาญให้กับทุกคน"</span>
        </div>
        <div className="announcement-slide">
          <span>[NEW!] 4in1 Han All Eyepot Liner จะเป็นยังไงถ้ารวมอายแชโดว์ อายไลน์เนอร์ เข้าด้วยกัน </span>
        </div>
        <div className="announcement-slide">
          <span>Best Tint Edition Set Lip Tints 01&amp;02 Buy 1 Get 1 Free!!</span>
        </div>
      </div>

      {/* ===== Overlay & Side Menu ===== */}
      <div className={`overlay${sideMenuOpen ? " active" : ""}`} onClick={() => setSideMenuOpen(false)}></div>
      <div className={`side-menu${sideMenuOpen ? " active" : ""}`} id="sideMenu">
        <div className="close-btn" onClick={() => setSideMenuOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="login-section">
          <span style={{ cursor: "pointer" }} onClick={() => { window.location.href = "/app"; }}>REGISTER</span>
          <span className="divider">|</span>
          <span style={{ cursor: "pointer" }} onClick={() => { window.location.href = "/app"; }}>LOGIN</span>
        </div>
        <ul>
          <li style={{ cursor: "pointer" }} onClick={() => navigate("/")}>MYPAGE</li>
          <div className="menu-header" onClick={() => setShopAllOpen(!shopAllOpen)}>
            <span>SHOP ALL</span>
            <span className={`toggle-icon${shopAllOpen ? " active" : ""}`}>+</span>
          </div>
          <ul className={`submenu${shopAllOpen ? " active" : ""}`}>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/promotion")}>PROMOTION</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/bestsellerform")}>BEST</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/new")}>NEW</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/face")}>FACE</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/eye")}>EYE</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/lip")}>LIP</li>
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/cheek")}>CHEEK</li>
          </ul>
          <li className="title">ABOUT US</li>
          <li className="title">COMMUNITY</li>
        </ul>
      </div>

      {/* ===== Header ===== */}
      <header className="main-header">
        <div className="menu-icon" onClick={() => setSideMenuOpen(true)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="logo-container" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <h1 className="romand-logo">rom&amp;nd</h1>
        </div>
        <div className="header-icons">
          <form action="" className="search-form">
            <input type="text" placeholder="พิมพ์เพื่อค้นหา..." className="search-input" />
            <button className="search-button icon-link" type="button">
              <svg className="search-icon svg-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <i className="fa-solid fa-xmark search-close"></i>
            </button>
          </form>
          <span className="icon-link" style={{ cursor: "pointer" }} onClick={() => navigate("/account")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <span className="icon-link cart-icon" style={{ cursor: "pointer" }} onClick={() => navigate("/cart")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </span>
        </div>
      </header>

      {/* ===== Main Two-Column Layout ===== */}
      <div className="ship-page">

        {/* ===== LEFT ===== */}
        <div className="ship-left">

          {/* Breadcrumb */}
          <nav className="ship-breadcrumb">
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/cart")}>Cart</span>
            <span className="bc-sep">&gt;</span>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/information")}>Information</span>
            <span className="bc-sep">&gt;</span>
            <span className="bc-active">Shipping</span>
            <span className="bc-sep">&gt;</span>
            <span>Payment</span>
          </nav>

          {/* Contact & Ship to summary */}
          <div className="ship-summary-box">
            <div className="ship-summary-row">
              <span className="ship-summary-label">Contact</span>
              <span className="ship-summary-value">{contactEmail}</span>
              <span className="ship-summary-change" onClick={() => navigate("/information")}>Change</span>
            </div>
            <div className="ship-summary-divider" />
            <div className="ship-summary-row">
              <span className="ship-summary-label">Ship to</span>
              <span className="ship-summary-value">{fullAddress || "—"}</span>
              <span className="ship-summary-change" onClick={() => navigate("/information")}>Change</span>
            </div>
          </div>

          {/* Shipping method */}
          <div className="ship-method-section">
            <h3 className="ship-method-title">Shipping method</h3>
            <div className="ship-method-option selected">
              <div className="ship-method-radio">
                <span className="ship-radio-dot" />
              </div>
              <div className="ship-method-info">
                <span className="ship-method-name">DHL Express</span>
                <span className="ship-method-sub">Tracking number provided</span>
              </div>
              <span className="ship-method-price">FREE</span>
            </div>
          </div>

          {/* Actions */}
          <div className="ship-actions">
            <button className="ship-back-btn" onClick={() => navigate("/information")}>
              &larr; Return to information
            </button>
            <button className="ship-next-btn" onClick={() => navigate("/payment")}>
              Continue to payment
            </button>
          </div>

        </div>

        {/* ===== RIGHT: Cart Summary ===== */}
        <div className="info-right">
          <div className="info-cart-items">
            {cart.map((item) => (
              <div className="info-cart-item" key={item.id}>
                <div className="info-item-img-wrap">
                  {item.image ? (
                    <img
                      src={`${API}/uploads/${item.image.replace(/^uploads[\/]/, "")}`}
                      alt={item.name}
                    />
                  ) : (
                    <div className="info-item-img-placeholder">{item.name?.[0]}</div>
                  )}
                  <span className="info-item-qty">{item.qty}</span>
                </div>
                <div className="info-item-detail">
                  <div className="info-item-name">
                    {item.price === 0 && (
                      <span style={{ display: 'inline-block', color: '#e0006b', border: '1.5px solid #e0006b', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', padding: '1px 5px', marginRight: '5px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Buy 1 Get 1</span>
                    )}
                    {item.price > 0 && item.promotion_id != null && promotionMap[Number(item.promotion_id)] && !/^buy\s+\d+\s+get\s+\d+/i.test(promotionMap[Number(item.promotion_id)].discountType) && (
                      <span style={{ display: 'inline-block', color: '#e0006b', border: '1.5px solid #e0006b', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', padding: '1px 5px', marginRight: '5px', verticalAlign: 'middle' }}>{promotionMap[Number(item.promotion_id)].discount_value}%</span>
                    )}
                    {item.name}
                  </div>
                  {item.model && (
                    <div className="info-item-model">{item.model.replace(/\.(jpg|png|jpeg|webp)$/i, "")}</div>
                  )}
                </div>
                <div className="info-item-price">฿{(item.price * item.qty).toLocaleString()}.00</div>
              </div>
            ))}
          </div>

          {/* Discount Code */}

          {/* Subtotal / Shipping / Total */}
          <div className="info-summary">
            <div className="info-summary-row">
              <span>Subtotal · {cart.length} item{cart.length !== 1 ? "s" : ""}</span>
              <span>฿{subtotal.toLocaleString()}.00</span>
            </div>
            <div className="info-summary-row">
              <span>Shipping</span>
              <span style={{ color: "#222", fontWeight: 500 }}>FREE</span>
            </div>
            <div className="info-summary-row info-summary-total">
              <span><strong>Total</strong></span>
              <span><small>THB</small> <strong>฿{subtotal.toLocaleString()}.00</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* ===== Footer ===== */}
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
              <li><a href="#">CCPA & US Privacy Laws</a></li>
              <li><a href="#">Accessibility Statement</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Newsletter</h3>
            <p>สมัครรับข่าวสาร ข้อเสนอพิเศษ และอัปเดตจากเรา</p><br />
            <p className="highlight">❤️ รับส่วนลดเพิ่มอีก 20% ทันที!</p>
            <br />
            <form>
              <input type="email" placeholder="Enter email" className="email-input" />
              <button className="signup-btn">Sign up</button>
            </form>
            <div className="footer-icons">
              <a href="#"></a>
              <a href="#"></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
