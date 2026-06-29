import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import SearchBar from "./SearchBar";
const API = process.env.REACT_APP_API_URL;





const ProductImage = ({ image, name }) => (
  <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {image ? (
      <img src={`${API}/uploads/${image.replace(/^uploads[\\/]/, '')}`} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <span style={{ fontSize: 28, color: '#999' }}>{name ? name[0] : '?'}</span>
    )}
  </div>
);

// ========== Component หลัก ==========
export default function Cart() {
  console.log('Cart page loaded');
  // --- State ตะกร้า ---
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const memberId = sessionStorage.getItem('Member_id'); // หรือดึงจาก context/auth
  const isLoggedIn = !!memberId;

  // --- State จาก Backend ---
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // --- State สินค้าแนะนำ ---
  const [randomProducts, setRandomProducts] = useState([]);

  // --- State Edit Option ---
  const [editingItemId, setEditingItemId] = useState(null);
  const [pendingVariant, setPendingVariant] = useState(null); // { key, color, label }

  // --- State เมนู ---
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [shopAllOpen, setShopAllOpen] = useState(false);
  const [promotionMap, setPromotionMap] = useState({}); // { promotion_id: discount_value }

  // --- State แจ้งเตือนสต๊อก ---
  const [stockError, setStockError] = useState(null);
  const [checkingStock, setCheckingStock] = useState(false);

  // Scroll to top when cart page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Fetch ทุก category สำหรับ Edit Option ---
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/face`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/lip`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/eye`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/new`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/cheek`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/api/promotion`).then(r => r.json()).catch(() => ({}))
    ]).then(([faceData, lipData, eyeData, newData, cheekData, promoData]) => {
      const all = [
        ...(Array.isArray(faceData.data) ? faceData.data : []),
        ...(Array.isArray(lipData.data) ? lipData.data : []),
        ...(Array.isArray(eyeData.data) ? eyeData.data : []),
        ...(Array.isArray(newData.data) ? newData.data : []),
        ...(Array.isArray(cheekData.data) ? cheekData.data : []),
        ...(Array.isArray(promoData.proProducts) ? promoData.proProducts : []),
      ];
      setAllProducts(all);
      // สร้าง map promotion_id → discount_value
      const pMap = {};
      if (Array.isArray(promoData.promotions)) {
        promoData.promotions.forEach(p => { pMap[p.Promotion_id] = Number(p.Discount_value) || 0; });
      }
      setPromotionMap(pMap);
    });
  }, []);

  // --- สุ่มสินค้าแนะนำ ---
  useEffect(() => {
    fetch(`${API}/api/products/random?limit=4`)
      .then(res => res.json())
      .then(data => setRandomProducts(Array.isArray(data) ? data : []))
      .catch(() => setRandomProducts([]));
  }, []);

  // --- โหลด cart จาก backend หลัง login ---
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`${API}/api/cart/${memberId}`)
      .then(res => res.json())
      .then(data => {
        if (data.cart) {
          setCart(data.cart.filter(item => item.Product_id).map(item => ({
            uid: `${item.Product_id}_${Number(item.Price) || 0}`,
            id: item.Product_id,
            name: item.Product_name,
            image: item.Image,
            model: item.Product_model,
            qty: Number(item.Quantity) || 1,
            price: Number(item.Price) || 0,
            cart_item_id: item.Cart_Item_id,
            promotion_id: item.Promotion_id || null,
            discount_value: item.Discount_value ? Number(item.Discount_value) : null
          })));
        }
      });
  }, [isLoggedIn, memberId]);

  // --- Fetch หมวดหมู่ ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/api/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // --- Auto-slide แถบประกาศ ---
  useEffect(() => {
    const slides = document.querySelectorAll('.announcement-slide');
    let idx = 0;
    const interval = setInterval(() => {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
      idx = (idx + 1) % slides.length;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // --- ฟังก์ชัน sync cart ไป backend ---
  const syncCartToBackend = (updatedCart) => {
    if (!isLoggedIn) return;
    const cart_items = updatedCart.map(item => ({
      Product_id: item.id,
      Quantity: item.qty,
      Price: item.price,
      Total: item.price * item.qty
    }));
    fetch(`${API}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Member_id: memberId, cart_items })
    });
  };

  // --- เปลี่ยน variant สินค้า (เช่น cheek_2.1 <-> cheek_2.2) ---
  const changeVariant = (oldItemId, newKey) => {
    const newProduct = allProducts.find(p => p.Image && p.Image.startsWith(newKey));
    if (!newProduct) return;
    const updated = cart.map(item =>
      item.id === oldItemId
        ? { ...item, id: newProduct.Product_id, image: newProduct.Image, name: newProduct.Product_name, price: Number(newProduct.Product_price), model: newProduct.Product_model }
        : item
    );
    setCart(updated);
    syncCartToBackend(updated);
    setEditingItemId(null);
    setPendingVariant(null);
  };

  // --- ฟังก์ชันตะกร้า ---
  const updateQty = (uid, delta) => {
    const updated = cart.map(item =>
      item.uid === uid ? { ...item, qty: Math.max(1, Number(item.qty) + delta) } : item
    );
    setCart(updated);
    syncCartToBackend(updated);
  };

  // ลบ cart item ทั้งใน state และ backend
  const removeItem = (uid) => {
    const updated = cart.filter(i => i.uid !== uid);
    setCart(updated);
    syncCartToBackend(updated);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  // --- ตรวจสต๊อกก่อน checkout ---
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingStock(true);
    setStockError(null);
    try {
      const res = await fetch(`${API}/api/orders/check-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ Product_id: i.id, Quantity: i.qty, Product_price: i.price }))
        })
      });
      if (!res.ok) {
        const data = await res.json();
        const msgs = data.errors ? data.errors : [data.error || 'ไม่สามารถตรวจสอบสต๊อกได้'];
        setStockError(msgs);
        return;
      }
      navigate('/information');
    } catch {
      setStockError(['ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้']);
    } finally {
      setCheckingStock(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{padding: '48px', textAlign: 'center', color: '#d00', fontSize: '1.2rem'}}>
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
      <div className={`overlay${sideMenuOpen ? ' active' : ''}`} onClick={() => setSideMenuOpen(false)}></div>
      <div className={`side-menu${sideMenuOpen ? ' active' : ''}`} id="sideMenu">
        <div className="close-btn" onClick={() => setSideMenuOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="login-section">
          <span style={{ cursor: 'pointer' }} onClick={() => { window.location.href = '/app'; }}>REGISTER</span>
          <span className="divider">|</span>
          <span style={{ cursor: 'pointer' }} onClick={() => { window.location.href = '/app'; }}>LOGIN</span>
        </div>
        <ul>
          <li style={{cursor:'pointer'}} onClick={() => navigate('/')}>MYPAGE</li>
          <div className="menu-header" onClick={() => setShopAllOpen(!shopAllOpen)}>
            <span>SHOP ALL</span>
            <span className={`toggle-icon${shopAllOpen ? ' active' : ''}`}>+</span>
          </div>
          <ul className={`submenu${shopAllOpen ? ' active' : ''}`}>
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

      {/* ===== Header ===== */}
      <header className="main-header">
        <div className="menu-icon" onClick={() => setSideMenuOpen(true)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="logo-container" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
          <h1 className="romand-logo">rom&amp;nd</h1>
        </div>
        <div className="header-icons">
          <SearchBar />
            <span className="icon-link" style={{cursor:'pointer'}} onClick={() => navigate('/account')}>
            	<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              	<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              	<circle cx="12" cy="7" r="4"></circle>
            	</svg>
            </span>
          <a href="#cart" className="icon-link cart-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-badge">{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
          </a>
        </div>
      </header>

      {/* ===== เนื้อหาตะกร้า ===== */}
      <div className="cart-page">
        <div className="cart-wrapper">

          {/* Breadcrumb */}
          <nav className="cart-breadcrumb">
            <span className="bc-active">Cart</span>
            <span className="bc-sep">&gt;</span>
            <span>Information</span>
            <span className="bc-sep">&gt;</span>
            <span>Shipping</span>
            <span className="bc-sep">&gt;</span>
            <span>Payment</span>
          </nav>

          <div className="cart-grid">

            {/* Cart Items */}
            <div className="cart-container">
              <div className="cart-table-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span>Delete</span>
              </div>
              <div className="cart-items-body">
                {cart.length === 0 ? (
                  <div style={{padding: '32px', textAlign: 'center', color: '#aaa'}}>Cart is empty</div>
                ) : cart.map(item => {
                  const imgFilename = (item.image || '').split('/').pop();
                  const prefixMatch = imgFilename.match(/^([a-z]+_\d+)/i);
                  const prefix = prefixMatch ? prefixMatch[1] : null;
                  const hasEdit = !!prefix;
                  const groupVariants = hasEdit ? allProducts.filter(p => p.Image && (p.Image.startsWith(prefix) || p.Image.split('/').pop().startsWith(prefix))).sort((a, b) => {
                    const numA = parseInt(((a.Image || '').match(/(\d+)\.\w+$/) || ['', '0'])[1]);
                    const numB = parseInt(((b.Image || '').match(/(\d+)\.\w+$/) || ['', '0'])[1]);
                    return numA - numB;
                  }) : [];
                  const showEdit = hasEdit && groupVariants.length >= 2;
                  const toOpt = v => ({
                    key: v.Image ? v.Image.replace(/\.(jpg|png|jpeg|webp)$/i, '') : '',
                    img: v.Image || '',
                    label: v.Product_model || v.Image || ''
                  });
                  const currentOpt = showEdit ? toOpt(groupVariants.find(v => v.Image === item.image) || groupVariants[0]) : null;
                  const isOpen = editingItemId === item.id;
                  const selected = isOpen ? (pendingVariant || currentOpt) : currentOpt;
                  return (
                  <div key={item.uid || item.id}>
                    <div className="cart-item">
                      <div className="item-info">
                        <ProductImage image={isOpen && pendingVariant ? pendingVariant.img : item.image} name={item.name} />
                        <div>
                          <div className="item-name">
                            {item.price === 0 && (
                              <span style={{ display: 'inline-block', background: 'transparent', color: '#e0006b', border: '1.5px solid #e0006b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', padding: '1px 7px', marginRight: '6px', verticalAlign: 'middle' }}>Buy 1 Get 1</span>
                            )}
                            {item.price > 0 && item.promotion_id === 1 && (
                              <span style={{ display: 'inline-block', background: 'transparent', color: '#e0006b', border: '1.5px solid #e0006b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', padding: '1px 7px', marginRight: '6px', verticalAlign: 'middle' }}>{promotionMap[1] ? `${promotionMap[1]}%` : 'SALE'}</span>
                            )}
                            {item.name}
                          </div>
                          {showEdit && (
                            <div style={{ marginTop: '4px' }}>
                              {currentOpt.label && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(currentOpt.label) && (
                                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{currentOpt.label}</div>
                              )}
                              <button
                                onClick={() => {
                                  if (isOpen) { setEditingItemId(null); setPendingVariant(null); }
                                  else { setEditingItemId(item.id); setPendingVariant(currentOpt); }
                                }}
                                style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', color: '#333' }}
                              >Edit Option</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="price">{item.price === 0 ? <span style={{color:'#e0006b',fontWeight:'bold'}}>฿0</span> : `${item.price}฿`}</div>
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={() => updateQty(item.uid, -1)} disabled={item.price === 0} style={item.price === 0 ? {opacity:0.3,cursor:'default'} : {}}>-</button>
                        <span className="qty-num">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.uid, 1)} disabled={item.price === 0} style={item.price === 0 ? {opacity:0.3,cursor:'default'} : {}}>+</button>
                      </div>
                      <div className="price">{item.price === 0 ? <span style={{color:'#e0006b',fontWeight:'bold'}}>฿0</span> : `${item.price * item.qty}฿`}</div>
                      <div>
                        <button className="del-btn" onClick={() => removeItem(item.uid)}>
                          <img src="/trash.png" alt="delete" style={{ width: 20, height: 20 }} />
                        </button>
                      </div>
                    </div>
                    {/* Dropdown panel — outside grid row so it doesn't affect column alignment */}
                    {showEdit && isOpen && (
                      <div style={{ padding: '0 12px 12px 94px' }}>
                        <div style={{
                          background: '#fff', border: '1px solid #e0e0e0',
                          borderRadius: '10px', boxShadow: '0 4px 18px rgba(0,0,0,0.13)',
                          padding: '14px 16px 12px 16px', maxWidth: '320px'
                        }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {groupVariants.map(v => {
                              const opt = toOpt(v);
                              if (!opt.img) return null;
                              const isSel = selected.key === opt.key;
                              return (
                                <div key={opt.key} onClick={() => setPendingVariant(opt)}
                                  style={{ width: 52, height: 52, borderRadius: 6, overflow: 'hidden', border: isSel ? '2px solid #e0006b' : '1.5px solid #eee', cursor: 'pointer', flexShrink: 0 }}
                                >
                                  <img src={`${API}/uploads/${opt.img.replace(/^uploads[\\/]/, '')}`} alt={opt.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: '12px', color: '#555', margin: '4px 0 14px 0' }}>{selected.label}</div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => { setEditingItemId(null); setPendingVariant(null); }}
                              style={{ fontSize: '13px', padding: '5px 18px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', color: '#555' }}>Cancel</button>
                            <button onClick={() => changeVariant(item.id, selected.key)}
                              style={{ fontSize: '13px', padding: '5px 18px', borderRadius: '6px', border: 'none', background: '#FB6F92', cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}>ตกลง</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="summary-box" style={{ marginTop: '28px' }}>
              {/* Stock Error Banner */}
              {stockError && (
                <div style={{
                  background: '#fff0f0', border: '1.5px solid #e74c3c', borderRadius: 10,
                  padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="11" stroke="#e74c3c" strokeWidth="1.5" fill="#fdf0ef"/>
                    <path d="M12 7v5.5" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16.5" r="1" fill="#e74c3c"/>
                  </svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#c0392b', fontSize: 13 }}>ไม่สามารถดำเนินการต่อได้</div>
                    {(Array.isArray(stockError) ? stockError : [stockError]).map((msg, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{msg}</div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStockError(null)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18, color: '#e74c3c', fontWeight: 'bold', padding: '0 4px', lineHeight: 1 }}
                  >&times;</button>
                </div>
              )}
              <div className="summary-title">Order summary</div>
              <div className="summary-row">
                <span>Syb total</span>
                <span>{subtotal}฿</span>
              </div>
              {/* Discount removed */}
              <div className="summary-row">
                <span>Delivery free</span>
                <span>0฿</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{total}฿</span>
              </div>
              <div className="guarantee">
                90-day quality guarantee on all items<br />
                in our store <a href="#">Details</a>
              </div>
              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cart.length === 0 || checkingStock}
                style={cart.length === 0 || checkingStock ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
              >{checkingStock ? 'กำลังตรวจสอบ...' : 'Checkout'}</button>
              <button className="continue-btn" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '30px' }}>
          {/* You might like */}
          <div className="cart-section-title">You might like</div>
          <div className="rec-grid">
            {randomProducts.map(item => (
              <div className="rec-card" key={item.Product_id} style={{cursor:'pointer'}} onClick={() => { window.scrollTo(0,0); navigate('/best1/' + item.Product_id); }}>
                <div className="rec-img">
                  {item.Image ? (
                    <img
                      src={`${API}/uploads/${item.Image.replace(/^uploads[\/]/, '')}`}
                      alt={item.Product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: 40, color: '#bbb' }}>{item.Product_name ? item.Product_name[0] : '?'}</span>
                  )}
                </div>
                <div className="rec-info">
                  <div className="rec-footer">
                    <div>
                      <div className="rec-name">
                        {item.Product_name} <span className="rec-price">{item.Product_price}฿</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>

          {/* Show more button removed */}
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