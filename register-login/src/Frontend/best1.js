import React, { useState } from 'react';
import './best1.css';

const Best1 = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [shopAllOpen, setShopAllOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  // ดึงข้อมูลสินค้า better than contour
  React.useEffect(() => {
    fetch('http://localhost:5000/api/best/1')
      .then(res => {
        if (!res.ok) throw new Error('ไม่พบข้อมูลสินค้า');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setError(null);
      })
      .catch(err => {
        setProduct(null);
        setError('ไม่พบข้อมูลสินค้า หรือ server ไม่ตอบสนอง');
      });
  }, []);
  // Auto-slide for announcement bar
  React.useEffect(() => {
    const slides = document.querySelectorAll('.announcement-slide');
    let idx = 0;
    const interval = setInterval(() => {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
      idx = (idx + 1) % slides.length;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* แถบประกาศสีชมพู */}
      <div className="announcement-bar">
        <div className="announcement-slide active">
          <span>[์NEW!] Glasting Color Gloss Mini เปิดตัวพร้อมโปรโมชั่นสุดพิเศษ</span>
        </div>
        <div className="announcement-slide">
          <span>[NEW!] 4in1 Han All Eyepot Liner จะเป็นยังไงถ้ารวมอายแชโดว์ อายไลน์เนอร์ เข้าด้วยกัน </span>
        </div>
        <div className="announcement-slide">
          <span> Free Shipping! สั่งซื้อครบ 500 บาท จัดส่งฟรีทั่วประเทศ</span>
        </div>
      </div>

      {/* Header: โลโก้ ขีดสามขีด ไอคอน */}
      <header className="main-header">
        <div className="menu-icon" onClick={() => setSideMenuOpen(true)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="logo-container" style={{cursor: 'pointer'}} onClick={() => window.location.href = '/Home/home.html'}>
          <h1 className="romand-logo">rom&amp;nd</h1>
        </div>
        <div className="header-icons">
          {/* แถบค้นหา */}
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
          {/* ไอคอน Account */}
          <a href="#account" className="icon-link">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>
          {/* ไอคอน Cart */}
          <a href="#cart" className="icon-link cart-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-badge">0</span>
          </a>
        </div>
      </header>

      {/* Overlay & Side Menu */}
      <div className={`overlay${sideMenuOpen ? ' active' : ''}`} onClick={() => setSideMenuOpen(false)}></div>
      <div className={`side-menu${sideMenuOpen ? ' active' : ''}`} id="sideMenu">
        <div className="close-btn" id="closeMenu" onClick={() => setSideMenuOpen(false)}>✕</div>
        <div className="login-section">
          <span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/app'; }}>REGISTER</span>
          <span className="divider">|</span>
          <span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/app'; }}>LOGIN</span>
        </div>
        <ul>
          <li style={{cursor:'pointer'}} onClick={() => { window.location.href = '/Home/home.html'; }}>MYPAGE</li>
          <li className="menu-header" id="shopAllHeader" onClick={() => setShopAllOpen(!shopAllOpen)}>
            <span>SHOP ALL</span>
            <span className={`toggle-icon${shopAllOpen ? ' active' : ''}`} id="toggleIcon">+</span>
          </li>
          <ul className={`submenu${shopAllOpen ? ' active' : ''}`} id="submenu">
            <li>Rom&nd X ZO&Friends</li>
            <li style={{cursor:'pointer'}} onClick={()=>window.location.href='/bestsellerform'}>BEST</li>
            <li>NEW</li>
            <li>FACE</li>
            <li>EYE</li>
            <li>LIP</li>
            <li>CHEEK</li>
            <li>SUNCARE</li>
            <li>NAIL</li>
          </ul>
          <li className="title">EVENT</li>
          <li className="title">MEMBERSHIP</li>
          <li className="title">REVIEW</li>
          <li className="title">STOCKIST</li>
          <li className="title">ABOUT US</li>
          <li className="title">COMMUNITY</li>
        </ul>
      </div>

      {/* Product Section */}
      <section className="product-section">
        <div className="product-main">
          <div className="product-image-gallery">
            {error ? (
              <div style={{color:'red',padding:'32px'}}>{error}</div>
            ) : product ? (
              <>
                {console.log('Image path:', product.Image)}
                <img className="main-image" src={`http://localhost:5000/uploads/${product.Image.replace(/^uploads[\\/]/, '')}`} alt={product.Product_name} />
              </>
            ) : (
              <div style={{height:'300px',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>
            )}
          </div>
          <div className="product-info">
            <span className="sale-badge">Sale</span>
            <h2 className="product-title">{product ? product.Product_name : error ? '' : 'Loading...'}</h2>
            <p className="product-desc">{product ? 'คอนทัวร์เนื้อเนียนละเอียด ติดทนตลอดวัน' : error ? '' : ''}</p>
            <div className="product-tags">
              <span>#Contour</span>
              <span>#Face</span>
              <span>#Romand</span>
            </div>
            <div className="product-rating">
              <span className="stars">★★★★★</span>
              <span className="review-count">(105)</span>
            </div>
            <div className="product-price-row">
              <span className="discount">10%</span>
              <span className="price">{product ? `${product.Product_price} ฿` : error ? '' : ''}</span>
              <span className="old-price">450.00 ฿</span>
            </div>
            <div className="product-total-row">
              <span className="total-label">Total Price</span>
              <span className="total-price">{product ? `${product.Product_price} ฿` : error ? '' : ''}</span>
              <span className="total-note">*Price before applying discounts or coupons</span>
            </div>
            <div className="product-qty-row">
              <button className="qty-btn">-</button>
              <span className="qty">1</span>
              <button className="qty-btn">+</button>
            </div>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="product-tabs-section">
        <div className="product-tabs">
          <button className="tab-btn" style={{color:'#bbb'}}>INGREDIENT</button>
          <button className="tab-btn" style={{color:'#bbb'}}>DESCRIPTION</button>
          <button className="tab-btn" style={{color:'#bbb'}}>REVIEW</button>
        </div>
        <hr className="tab-divider" />
        <div className="tab-content">
          <div className="accordion">
            <div className="accordion-header" style={{fontWeight:'bold',padding:'16px 0',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              INGREDIENT
              <span style={{fontSize:'18px',fontWeight:'bold'}}>&#x25BC;</span>
            </div>
            <hr style={{margin:'0'}} />
            {/* เนื้อหา INGREDIENT สามารถเพิ่มได้ที่นี่ */}
          </div>
          <div className="accordion">
            <div className="accordion-header" style={{fontWeight:'bold',padding:'16px 0',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              DESCRIPTION
              <span style={{fontSize:'18px',fontWeight:'bold'}}>&#x25BC;</span>
            </div>
            <hr style={{margin:'0'}} />
            {/* เนื้อหา DESCRIPTION สามารถเพิ่มได้ที่นี่ */}
          </div>
          <div className="accordion">
            <div className="accordion-header" style={{fontWeight:'bold',padding:'16px 0',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              REVIEW
              <span style={{fontSize:'18px',fontWeight:'bold'}}>&#x25BC;</span>
            </div>
            <hr style={{margin:'0'}} />
            {/* เนื้อหา REVIEW สามารถเพิ่มได้ที่นี่ */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* Contact Us */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>romand202208@gmail.com</p>
          </div>
          {/* Customer Service */}
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
          {/* Newsletter */}
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
};

export default Best1;
