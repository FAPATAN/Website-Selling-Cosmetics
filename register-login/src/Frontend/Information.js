import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Information.css";
const API = process.env.REACT_APP_API_URL;

export default function Information() {
  const navigate = useNavigate();
  const memberId = sessionStorage.getItem('Member_id');
  const userEmail = sessionStorage.getItem('userEmail') || '';
  const isLoggedIn = !!memberId;

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [shopAllOpen, setShopAllOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [emailNews, setEmailNews] = useState(false);
  const [promotionMap, setPromotionMap] = useState({}); // { promotion_id: { discount_value, discountType } }

  const [form, setForm] = useState(() => {
    const savedKey = `shippingInfo_${memberId}`;
    const saved = memberId ? localStorage.getItem(savedKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, email: userEmail };
      } catch {}
    }
    return {
      firstName: '', lastName: '', email: userEmail, phone: '',
      address: '', apartment: '', city: '', province: 'Pathum Thani', postalCode: '', country: 'Thailand'
    };
  });

  // ???? promotion map
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

  // ???? cart ??? backend
  useEffect(() => {
    if (!memberId) return;
    fetch(`${API}/api/cart/${memberId}`)
      .then(res => res.json())
      .then(data => {
        if (data.cart) {
          const items = data.cart.filter(i => i.Product_id).map(i => ({
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

  // Auto-slide ?????????
  useEffect(() => {
    const slides = document.querySelectorAll('.announcement-slide');
    let idx = 0;
    const interval = setInterval(() => {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
      idx = (idx + 1) % slides.length;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Search toggle
  useEffect(() => {
    const searchForm = document.querySelector('.search-form');
    const searchButton = document.querySelector('.search-button');
    const searchHandler = () => searchForm?.classList.toggle('active-search');
    if (searchButton && searchForm) searchButton.addEventListener('click', searchHandler);
    return () => { if (searchButton) searchButton.removeEventListener('click', searchHandler); };
  }, []);

  const handleChange = (e) => {
    setForm(prev => {
      const updated = { ...prev, [e.target.name]: e.target.value };
      if (memberId) localStorage.setItem(`shippingInfo_${memberId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (memberId) localStorage.setItem(`shippingInfo_${memberId}`, JSON.stringify(form));
    navigate('/shipping');
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#d00', fontSize: '1.2rem' }}>
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
      <div className={`overlay${sideMenuOpen ? ' active' : ''}`} onClick={() => setSideMenuOpen(false)}></div>
      <div className={`side-menu${sideMenuOpen ? ' active' : ''}`} id="sideMenu">
        <div className="close-btn" onClick={() => setSideMenuOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="login-section">
          <span style={{ cursor: 'pointer' }} onClick={() => { window.location.href = '/auth'; }}>REGISTER</span>
          <span className="divider">|</span>
          <span style={{ cursor: 'pointer' }} onClick={() => { window.location.href = '/auth'; }}>LOGIN</span>
        </div>
        <ul>
          <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>MYPAGE</li>
          <div className="menu-header" onClick={() => setShopAllOpen(!shopAllOpen)}>
            <span>SHOP ALL</span>
            <span className={`toggle-icon${shopAllOpen ? ' active' : ''}`}>+</span>
          </div>
          <ul className={`submenu${shopAllOpen ? ' active' : ''}`}>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/promotion')}>PROMOTION</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/bestsellerform')}>BEST</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/new')}>NEW</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/face')}>FACE</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/eye')}>EYE</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/lip')}>LIP</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/cheek')}>CHEEK</li>
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
        <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
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
          <span className="icon-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/account')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <span className="icon-link cart-icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/cart')}>
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
      <div className="info-page">

        {/* ===== LEFT: Form ===== */}
        <div className="info-left">

          {/* Breadcrumb */}
          <nav className="info-breadcrumb">
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/cart')}>Cart</span>
            <span className="bc-sep">&gt;</span>
            <span className="bc-active">Information</span>
            <span className="bc-sep">&gt;</span>
            <span>Shipping</span>
            <span className="bc-sep">&gt;</span>
            <span>Payment</span>
          </nav>

          <form onSubmit={handleSubmit}>

            {/* Contact */}
            <div className="info-section">
              <div className="info-section-header">
                <h3>Contact</h3>
                <span
                  className="info-login-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    sessionStorage.removeItem('Member_id');
                    sessionStorage.removeItem('userEmail');
                    navigate('/');
                  }}
                >
                  <u>Logout</u>
                </span>
              </div>
              <div className="info-field-single">
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="Email" required
                />
              </div>
              <label className="info-checkbox-label">
                <input type="checkbox" checked={emailNews} onChange={e => setEmailNews(e.target.checked)} />
                <span>Email me with news and offers</span>
              </label>
            </div>

            {/* Shipping Address */}
            <div className="info-section">
              <h3>Shipping address</h3>

              <div className="info-field-single">
                <select name="country" value={form.country} onChange={handleChange} className="info-select">
                  <option value="Thailand">Thailand</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="info-row">
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
              </div>

              <div className="info-field-single">
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
              </div>

              <div className="info-field-single">
                <input type="text" name="apartment" value={form.apartment} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" />
              </div>

              <div className="info-row info-row-3">
                <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                <select name="province" value={form.province} onChange={handleChange} className="info-select">
                  <option value="Pathum Thani">????????</option>
                  <option value="Bangkok">?????????????</option>
                  <option value="Chiang Mai">?????????</option>
                  <option value="Phuket">??????</option>
                  <option value="Khon Kaen">???????</option>
                  <option value="Nonthaburi">???????</option>
                  <option value="Samut Prakan">???????????</option>
                  <option value="Chiang Rai">????????</option>
                  <option value="Nakhon Ratchasima">??????????</option>
                  <option value="Udon Thani">????????</option>
                  <option value="Songkhla">?????</option>
                  <option value="Surat Thani">????????????</option>
                  <option value="Rayong">?????</option>
                  <option value="Chonburi">??????</option>
                  <option value="Ayutthaya">???????????????</option>
                  <option value="Saraburi">???????</option>
                  <option value="Lopburi">??????</option>
                  <option value="Nakhon Pathom">??????</option>
                  <option value="Samut Sakhon">?????????</option>
                  <option value="Kanchanaburi">?????????</option>
                  <option value="Ratchaburi">???????</option>
                  <option value="Prachuap Khiri Khan">???????????????</option>
                  <option value="Phetchaburi">????????</option>
                  <option value="Chumphon">?????</option>
                  <option value="Nakhon Si Thammarat">?????????????</option>
                  <option value="Trang">????</option>
                  <option value="Krabi">??????</option>
                  <option value="Phang Nga">?????</option>
                  <option value="Satun">????</option>
                  <option value="Pattani">???????</option>
                  <option value="Yala">????</option>
                  <option value="Narathiwat">????????</option>
                  <option value="Loei">???</option>
                  <option value="Nong Khai">???????</option>
                  <option value="Sakon Nakhon">??????</option>
                  <option value="Nakhon Phanom">??????</option>
                  <option value="Mukdahan">????????</option>
                  <option value="Ubon Ratchathani">???????????</option>
                  <option value="Roi Et">????????</option>
                  <option value="Kalasin">?????????</option>
                  <option value="Maha Sarakham">?????????</option>
                  <option value="Buriram">?????????</option>
                  <option value="Surin">????????</option>
                  <option value="Si Sa Ket">????????</option>
                  <option value="Chaiyaphum">???????</option>
                  <option value="Lampang">?????</option>
                  <option value="Lamphun">?????</option>
                  <option value="Phrae">????</option>
                  <option value="Nan">????</option>
                  <option value="Phayao">?????</option>
                  <option value="Mae Hong Son">??????????</option>
                  <option value="Tak">???</option>
                  <option value="Sukhothai">???????</option>
                  <option value="Phitsanulok">????????</option>
                  <option value="Phichit">??????</option>
                  <option value="Kamphaeng Phet">?????????</option>
                  <option value="Nakhon Sawan">?????????</option>
                  <option value="Uthai Thani">?????????</option>
                  <option value="Chainat">??????</option>
                  <option value="Sing Buri">?????????</option>
                  <option value="Ang Thong">???????</option>
                  <option value="Suphan Buri">??????????</option>
                  <option value="Nakhon Nayok">???????</option>
                  <option value="Prachin Buri">??????????</option>
                  <option value="Sa Kaeo">???????</option>
                  <option value="Chanthaburi">????????</option>
                  <option value="Trat">????</option>
                  <option value="Phetchabun">?????????</option>
                  <option value="Uttaradit">?????????</option>
                  <option value="Nong Bua Lamphu">???????????</option>
                  <option value="Amnat Charoen">??????????</option>
                  <option value="Yasothon">?????</option>
                  <option value="Bueng Kan">??????</option>
                </select>
                <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal code" required />
              </div>

              <div className="info-field-single">
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
              </div>
            </div>

            <div className="info-actions">
              <button type="button" className="info-back-btn" onClick={() => navigate('/cart')}>
                &larr; Return to cart
              </button>
              <button type="submit" className="info-next-btn">
                Continue to shipping
              </button>
            </div>

          </form>
        </div>

        {/* ===== RIGHT: Cart Summary ===== */}
        <div className="info-right">
          {/* ?????????????? */}
          <div className="info-cart-items">
            {cart.map(item => (
              <div className="info-cart-item" key={item.id}>
                <div className="info-item-img-wrap">
                  {item.image ? (
                    <img
                      src={`${API}/uploads/${item.image.replace(/^uploads[\/]/, '')}`}
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
                    <div className="info-item-model">{item.model.replace(/\.(jpg|png|jpeg|webp)$/i, '')}</div>
                  )}
                </div>
                <div className="info-item-price">?{(item.price * item.qty).toLocaleString()}.00</div>
              </div>
            ))}
          </div>

          {/* Discount Code ????? ???????????? */}

          {/* Subtotal / Shipping / Total */}
          <div className="info-summary">
            <div className="info-summary-row">
              <span>Subtotal · {cart.length} item{cart.length !== 1 ? 's' : ''}</span>
              <span>?{subtotal.toLocaleString()}.00</span>
            </div>
            <div className="info-summary-row">
              <span>Shipping <span className="info-shipping-icon">?</span></span>
              <span className="info-shipping-calc">Calculated at next step</span>
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
