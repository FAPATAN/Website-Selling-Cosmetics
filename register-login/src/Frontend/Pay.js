import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Pay.css";
const API = process.env.REACT_APP_API_URL;

export default function Pay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetOrderId = searchParams.get("orderId");
  const memberId = sessionStorage.getItem("Member_id");
  const userEmail = sessionStorage.getItem("userEmail") || "";
  const isLoggedIn = !!memberId;

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [shopAllOpen, setShopAllOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dbOrderId, setDbOrderId] = useState(null); // Order_id ????????? DB
  const [slipSubmitting, setSlipSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null); // null = no error, string = error message
  const [promotionMap, setPromotionMap] = useState({});

  const accountNumber = "073-899130-3";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
  };

  const handleSlipSubmit = async () => {
    if (!slipFile) return;
    setSlipSubmitting(true);

    // 1. ?????? localStorage (??????????????????????????? Orders page)
    const existing = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
    const updated = existing.map((o) => {
      const isTarget = targetOrderId
        ? String(o.id) === String(targetOrderId)
        : o.memberId === memberId && o.status === "placed" && !o.slipSent
            ? existing.filter(x => x.memberId === memberId && x.status === "placed" && !x.slipSent)
                      .sort((a, b) => b.createdAt - a.createdAt)[0]?.id === o.id
            : false;
      return isTarget ? { ...o, status: "accepted", slipSent: true } : o;
    });
    localStorage.setItem("pendingOrders", JSON.stringify(updated));

    // 2. ???????????????? Backend
    try {
      const orderId = dbOrderId;
      if (orderId) {
        const formData = new FormData();
        formData.append("Order_id", orderId);
        formData.append("slip", slipFile);
        const resp = await fetch(`${API}/api/orders/submit-slip`, {
          method: "POST",
          body: formData,
        });
        const result = await resp.json();
        if (!result.success) {
          console.error("submit-slip failed:", result);
        } else {
          // ?????? dbStatus = 'P' ?? localStorage (????????????)
          const allOrders = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
          const withStatus = allOrders.map(o => {
            const isTarget = targetOrderId
              ? String(o.id) === String(targetOrderId)
              : o.memberId === memberId && o.slipSent;
            return isTarget ? { ...o, dbStatus: "P" } : o;
          });
          localStorage.setItem("pendingOrders", JSON.stringify(withStatus));
        }
      } else {
        console.warn("submit-slip skipped: dbOrderId is null");
      }
    } catch (err) {
      console.error("submit-slip error:", err);
    }

    setSlipSubmitting(false);
    setShowSlipModal(false);
    setSlipFile(null);
    setSlipPreview(null);
    setShowSuccess(true);
  };

  // ???? dbOrderId ??? localStorage ?????????? Orders2 (cart ??????????????)
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

  useEffect(() => {
    if (!targetOrderId) return;
    const all = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
    const found = all.find(o => String(o.id) === String(targetOrderId));
    if (found?.dbOrderId) {
      setDbOrderId(found.dbOrderId);
    } else {
      // ????? Orders2 ?????? — targetOrderId ??? DB Order_id ????????
      setDbOrderId(Number(targetOrderId));
    }
  }, [targetOrderId]);

  // ?????????? Orders2 (targetOrderId ?????) ? ???? items ??? order DB ??? cart
  useEffect(() => {
    if (!targetOrderId || !memberId) return;
    fetch(`${API}/api/orders/${memberId}`)
      .then(r => r.json())
      .then(d => {
        const found = (d.orders || []).find(o => String(o.Order_id) === String(targetOrderId));
        if (!found?.detail_summary) return;
        const items = found.detail_summary.split(';;').map((s, idx) => {
          const [name, qty, price, image, model, promoId] = s.split('|');
          return {
            id: idx,
            name: name || '',
            image: image || '',
            model: model || '',
            qty: Number(qty) || 1,
            price: Number(price) || 0,
            promotion_id: Number(promoId) || 0,
          };
        });
        setCart(items);
      })
      .catch(() => {});
  }, [targetOrderId, memberId]);

  // ???? cart ??? backend
  useEffect(() => {
    if (!memberId) return;
    if (targetOrderId) return; // ????? Orders2 — ??? useEffect ?????????
    fetch(`${API}/api/cart/${memberId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cart) {
          const items = data.cart.filter((i) => i.Product_id).map((i) => ({
            id: i.Product_id,
            name: i.Product_name,
            image: i.Image,
            model: i.Product_model,
            qty: i.Quantity,
            price: Number(i.Price) || 0,
            promotion_id: i.Promotion_id || i.promotion_id,
          }));
          setCart(items);
          setCartCount(0); // ???? cart badge ?? header ?????????????? Pay (??????????????? backend)

          // ???? backend cart ????? ???????????????????? Pay (???? logic ????)
          // cart state ??? set ???????????? Pay page ????????????????????
          fetch(`${API}/api/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Member_id: memberId, cart_items: [] }),
          }).catch(() => {});

          // ?????? pending order ?? localStorage ????? user ?????? Pay
          if (items.length > 0) {
            const existing = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
            const activeOrders = existing.filter(
              (o) => o.memberId === memberId && o.deadline > Date.now()
            );
            // ????????? order ??????????????????????????????????????? (???????????????? refresh)
            const itemIds = items.map(i => i.id).sort().join(",");
            const alreadySameCart = activeOrders.find(
              (o) => o.items?.map(i => i.id).sort().join(",") === itemIds
            );
            if (!alreadySameCart) {
              const newLocalId = `PAY-${memberId}-${Date.now()}`;
              const newOrder = {
                id: newLocalId,
                memberId,
                status: "placed",
                statusLabel: "??????????",
                items: items,
                total: items.reduce((s, i) => s + i.price * i.qty, 0),
                createdAt: Date.now(),
                deadline: Date.now() + 24 * 60 * 60 * 1000,
              };

              // ????? order ?? DB
              const shippingInfo = (() => {
                try { return JSON.parse(localStorage.getItem(`shippingInfo_${memberId}`) || "{}"); }
                catch { return {}; }
              })();
              const Name    = shippingInfo.firstName || "";
              const Surname = shippingInfo.lastName  || "";
              const Phone   = shippingInfo.phone     || "";
              const Address = [
                shippingInfo.address, shippingInfo.apartment,
                shippingInfo.city, shippingInfo.province,
                shippingInfo.postalCode, shippingInfo.country,
              ].filter(Boolean).join(", ");

              localStorage.setItem("pendingOrders", JSON.stringify([...existing, newOrder]));

              fetch(`${API}/api/orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  Member_id: memberId, Name, Surname, Address, Phone,
                  items: items.map(i => ({
                    Product_id:    i.id,
                    Type_id:       null,
                    Product_model: i.model || "",
                    Product_price: i.price,
                    Quantity:      i.qty,
                    Discount:      0,
                  })),
                }),
              })
                .then(r => {
                  if (!r.ok) return r.json().then(d => { throw new Error(d.error || `HTTP ${r.status}`); });
                  return r.json();
                })
                .then(dbData => {
                  if (!dbData.Order_id) throw new Error('No Order_id returned');
                  const dbOId = dbData.Order_id;
                  setDbOrderId(dbOId);
                  // ?????? dbOrderId ?? localStorage
                  const saved = JSON.parse(localStorage.getItem("pendingOrders") || "[]");
                  const withDb = saved.map(o =>
                    o.id === newLocalId ? { ...o, dbOrderId: dbOId } : o
                  );
                  localStorage.setItem("pendingOrders", JSON.stringify(withDb));
                })
                .catch(err => {
                  console.error("create order error:", err);
                  setOrderError(err.message || '???????????????????????????');
                });

            } else if (alreadySameCart?.dbOrderId) {
              // order ?????????????? ??? dbOrderId ??? localStorage
              setDbOrderId(alreadySameCart.dbOrderId);
            }
          }
        }
      })
      .catch(() => {});
  }, [memberId]);

  // Auto-slide ?????????
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
        ????????????????????
      </div>
    );
  }

  return (
    <>
      {/* ===== ????????? ===== */}
      <div className="announcement-bar">
        <div className="announcement-slide active">
          <span>[NEW!] Rom&ndXZO&FRIENDS "?????????????????????????????????? ???????????????????????????????????????????????????????????"</span>
        </div>
        <div className="announcement-slide">
          <span>[NEW!] 4in1 Han All Eyepot Liner ?????????????????????????? ???????????? ??????????? </span>
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
          <span style={{ cursor: "pointer" }} onClick={() => { window.location.href = "/auth"; }}>REGISTER</span>
          <span className="divider">|</span>
          <span style={{ cursor: "pointer" }} onClick={() => { window.location.href = "/auth"; }}>LOGIN</span>
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
            <input type="text" placeholder="???????????????..." className="search-input" />
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
            <span className="cart-badge">{cartCount}</span>
          </span>
        </div>
      </header>

      {/* ===== Main Two-Column Layout ===== */}
      <div className="payslip-page">

        {/* ===== LEFT ===== */}
        <div className="payslip-left">

          {/* Breadcrumb removed as requested */}

          {/* ===== Order Error Banner ===== */}
          {orderError && (
            <div style={{
              background: '#fff0f0', border: '1.5px solid #e74c3c', borderRadius: 10,
              padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="#e74c3c" strokeWidth="1.5" fill="#fdf0ef"/>
                <path d="M12 7v5.5" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16.5" r="1" fill="#e74c3c"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#c0392b', fontSize: 14 }}>???????????????????????????</div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{orderError}</div>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
              >
                ???????????
              </button>
            </div>
          )}

          {/* ===== ?????????? Box ===== */}
          <div className="pending-payment-box">
            <div className="pending-payment-header">
              <span className="pending-payment-title">Awaiting Payment</span>
              <button className="pending-payment-btn">
                Pay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 4 }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <p className="pending-payment-desc">
              Please pay <strong>?{subtotal.toLocaleString()}.00</strong> within 24 hours
              to confirm your order.
            </p>
          </div>

          <h2 className="payslip-title">Payment</h2>
          <p className="payslip-sub">Please transfer to the account below, then click "Notify Payment"</p>

          {/* Bank Account Card */}
          <div className="payslip-card">
            <div className="payslip-card-top">
              <div className="payslip-account-block">
                <span className="payslip-account-number">{accountNumber}</span>
                <button className="payslip-copy-btn" onClick={handleCopy}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  {copied ? "??????????!" : "COPY"}
                </button>
              </div>
              <img src="/bank-logo.jpg" alt="bank" className="payslip-bank-logo" />
            </div>
            <div className="payslip-card-info">
              <span>?????? ?????????????? ?????</span>
              <span>????? ?.????????</span>
            </div>
          </div>

          {/* ???????????? button */}
          <div className="payslip-actions">
            <button className="ship-back-btn" onClick={() => navigate("/payment")}>
              &larr; Return to payment
            </button>
            <button className="payslip-confirm-btn" onClick={() => setShowSlipModal(true)}>
              Notify Payment (Upload Slip)
            </button>
          </div>

        </div>

        {/* ===== Slip Upload Modal ===== */}
        {showSlipModal && (
          <div className="slip-modal-overlay" onClick={() => setShowSlipModal(false)}>
            <div className="slip-modal" onClick={(e) => e.stopPropagation()}>
              <button className="slip-modal-close" onClick={() => setShowSlipModal(false)}>?</button>
              <h3 className="slip-modal-title">Attach Transfer Slip</h3>
              <p className="slip-modal-sub">Please upload your transfer slip to confirm payment.</p>
              <label className="slip-upload-area">
                {slipPreview ? (
                  <img src={slipPreview} alt="slip preview" className="slip-preview-img" />
                ) : (
                  <div className="slip-upload-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Click to select file</span>
                    <span className="slip-upload-hint">PNG, JPG, JPEG (max 5MB)</span>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleSlipChange} />
              </label>
              <button
                className="slip-submit-btn"
                disabled={!slipFile || slipSubmitting}
                onClick={handleSlipSubmit}
              >
                {slipSubmitting ? "Uploading..." : "Submit Slip"}
              </button>
            </div>
          </div>
        )}

        {/* ===== Success Popup ===== */}
        {showSuccess && (
          <div className="slip-modal-overlay" onClick={() => { setShowSuccess(false); navigate("/"); }}>
            <div className="slip-modal success-popup" onClick={(e) => e.stopPropagation()}>
              <div className="success-icon">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="9 12 11.5 14.5 15 10"></polyline>
                </svg>
              </div>
              <h3 className="slip-modal-title">?????????????????</h3>
              <p className="slip-modal-sub">???????????????????????<br/>????????????????????????????</p>
              <button className="slip-submit-btn" onClick={() => { setShowSuccess(false); navigate("/"); }}>
                ????????????
              </button>
            </div>
          </div>
        )}

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
                <div className="info-item-price">?{(item.price * item.qty).toLocaleString()}.00</div>
              </div>
            ))}
          </div>



          {/* Subtotal / Shipping / Total */}
          <div className="info-summary">
            <div className="info-summary-row">
              <span>Subtotal · {cart.length} item{cart.length !== 1 ? "s" : ""}</span>
              <span>?{subtotal.toLocaleString()}.00</span>
            </div>
            <div className="info-summary-row">
              <span>Shipping</span>
              <span style={{ color: "#222", fontWeight: 500 }}>FREE</span>
            </div>
            <div className="info-summary-row info-summary-total">
              <span><strong>Total</strong></span>
              <span><small>THB</small> <strong>?{subtotal.toLocaleString()}.00</strong></span>
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
              <li><a href="#">?????????????????????</a></li>
              <li><a href="#">?????? / ????????????</a></li>
              <li><a href="#">????????????????????</a></li>
              <li><a href="#">???????????????</a></li>
              <li><a href="#">California Proposition 65</a></li>
              <li><a href="#">CCPA & US Privacy Laws</a></li>
              <li><a href="#">Accessibility Statement</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Newsletter</h3>
            <p>??????????????? ???????????? ???????????????</p><br />
            <p className="highlight">?? ????????????????? 20% ?????!</p>
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
