import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './best1.css';
const API = process.env.REACT_APP_API_URL;

const Best1 = () => {
  const { id } = useParams();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [shopAllOpen, setShopAllOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [descOpen, setDescOpen] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedMainImg, setSelectedMainImg] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  
  const fetchCartCount = async () => {
    const memberId = sessionStorage.getItem('Member_id');
    if (!memberId) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch(`${API}/api/cart/${memberId}`);
      const data = await res.json();
      if (data.cart) {
      
        const count = data.cart.filter(item => item.Product_id).reduce((sum, item) => sum + (Number(item.Quantity) || 0), 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  
  useEffect(() => {
    fetchCartCount();
  }, []);

  
  React.useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/best/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('ไม่พบข้อมูลสินค้า');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setSelectedMainImg(null);
        setError(null);
      })
      .catch(err => {
        setProduct(null);
        setError('ไม่พบข้อมูลสินค้า หรือ server ไม่ตอบสนอง');
      });
  }, [id]);

  
  React.useEffect(() => {
    if (!product?.Image) return;
    const fname = product.Image.split('/').pop().toLowerCase();
    let endpoint = '/api/best';
    if (fname.startsWith('face_')) endpoint = '/api/face';
    else if (fname.startsWith('eye_')) endpoint = '/api/eye';
    else if (fname.startsWith('lip_')) endpoint = '/api/lip';
    else if (fname.startsWith('cheek_')) endpoint = '/api/cheek';
    else if (fname.startsWith('new_')) endpoint = '/api/new';
    fetch(`${API}${endpoint}`)
      .then(r => r.json())
      .then(d => setAllProducts(d.data || []))
      .catch(() => setAllProducts([]));
  }, [product]);

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

  // Computed: prefix, variants, colors
  const getImgPrefix = (img) => {
    if (!img) return null;
    const fname = img.split('/').pop();
    const m = fname.match(/^([a-zA-Z]+_\d+)\./i);
    return m ? m[1] : null;
  };
  const productPrefix = product ? getImgPrefix(product.Image) : null;
  const variants = productPrefix
    ? allProducts
        .filter(p => p.Image && getImgPrefix(p.Image) === productPrefix)
        .sort((a, b) => {
          const getSuf = img => parseFloat(img.split('/').pop().replace(productPrefix + '.', '')) || 0;
          return getSuf(a.Image) - getSuf(b.Image);
        })
    : [];
  const colors = variants.filter(v => v.Color).map(v => ({
    color: v.Color,
    Product_id: v.Product_id,
    Product_name: v.Product_name,
  }));

  return (
    <>
      {/* Announcement Bar */}
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
         
          <span className="icon-link" style={{cursor:'pointer'}} onClick={() => navigate('/account')}>
            			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              			<circle cx="12" cy="7" r="4"></circle>
            			</svg>
          </span>

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

      {/* Overlay & Side Menu */}
      <div className={`overlay${sideMenuOpen ? ' active' : ''}`} onClick={() => setSideMenuOpen(false)}></div>
      <div className={`side-menu${sideMenuOpen ? ' active' : ''}`} id="sideMenu">
        <div className="close-btn" id="closeMenu" onClick={() => setSideMenuOpen(false)}>?</div>
        <div className="login-section">
          <span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/auth'; }}>REGISTER</span>
          <span className="divider">|</span>
          <span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/auth'; }}>LOGIN</span>
        </div>
        <ul>
          <li style={{cursor:'pointer'}} onClick={() => navigate('/')}>MYPAGE</li>
          <li className="menu-header" id="shopAllHeader" onClick={() => setShopAllOpen(!shopAllOpen)}>
            <span>SHOP ALL</span>
            <span className={`toggle-icon${shopAllOpen ? ' active' : ''}`} id="toggleIcon">+</span>
          </li>
          <ul className={`submenu${shopAllOpen ? ' active' : ''}`} id="submenu">
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

      {/* Product Section */}
      <section className="product-section">
        <div className="product-main">
          <div className="product-image-gallery" style={{display:'flex',flexDirection:'row',alignItems:'flex-start',gap:'12px'}}>
            {/* Thumbnail strip on left */}
            {(() => {
              const galleryImgs = product?.gallery_images || [];
              const mainUrl = product ? `${API}/uploads/${product.Image.replace(/^uploads[\/]/, '')}` : null;
              // Use product gallery if any, else fall back to variants
              const thumbList = galleryImgs.length > 0
                ? [{ key: 'main', url: mainUrl }, ...galleryImgs.map(g => ({ key: g.id, url: `${API}/uploads/${g.Image.replace(/^uploads[\/]/, '')}` }))]
                : variants.length > 1
                  ? variants.map(v => ({ key: v.Product_id, url: `${API}/uploads/${v.Image.replace(/^uploads[\/]/, '')}` }))
                  : [];
              const currentMain = selectedMainImg || mainUrl;
              return thumbList.length > 1 ? (
                <div className="thumb-strip" style={{display:'flex',flexDirection:'column',gap:'10px',alignItems:'center'}}>
                  {thumbList.map(t => (
                    <img
                      key={t.key}
                      className={`thumb${currentMain === t.url ? ' thumb-active' : ''}`}
                      src={t.url}
                      alt=""
                      onClick={() => setSelectedMainImg(t.url)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              ) : null;
            })()}
            {/* Main image + color swatches */}
            <div className="main-image-wrap" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              {error ? (
                <div style={{color:'red',padding:'32px'}}>{error}</div>
              ) : product ? (
                <div style={{position:'relative',display:'inline-block'}}>
                  <img
                    className="main-image"
                    src={selectedMainImg || `${API}/uploads/${product.Image.replace(/^uploads[\/]/, '')}`}
                    alt={product.Product_name}
                    style={product.Stock != null && Number(product.Stock) === 0 ? {opacity:0.55} : {}}
                  />
                  {product.Stock != null && Number(product.Stock) === 0 && (
                    <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'110px',height:'110px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,30,30,0.85)',color:'#fff',fontSize:'16px',fontWeight:'bold',zIndex:2,textAlign:'center',lineHeight:'1.4',pointerEvents:'none'}}>?????????</div>
                  )}
                </div>
              ) : (
                <div style={{height:'300px',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>
              )}
              {colors.length > 0 && (
                <div className="color-swatches">
                  {colors.map(c => (
                    <span
                      key={c.Product_id}
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: c.color, display: 'inline-block',
                        cursor: c.Product_id !== parseInt(id) ? 'pointer' : 'default',
                        outline: c.Product_id === parseInt(id) ? '2px solid #aaa' : 'none',
                        outlineOffset: '2px',
                      }}
                      onClick={() => c.Product_id !== parseInt(id) && navigate(`/best1/${c.Product_id}`)}
                      title={c.Product_name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="product-info">
            <span className="sale-badge">Sale</span>
            <h2 className="product-title">{product ? product.Product_name : error ? '' : 'Loading...'}</h2>
            <p className="product-desc">{product ? product.Product_model : error ? '' : ''}</p>
            <div className="product-tags">
              <span>#Romand</span>
              {product?.Product_model && <span>#{product.Product_model}</span>}
              {(product?.Type_name || allProducts.find(p => p.Product_id === parseInt(id))?.Type_name) && (
                <span>#{product?.Type_name || allProducts.find(p => p.Product_id === parseInt(id))?.Type_name}</span>
              )}
            </div>

            {product?.Description && (
              <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7, margin: '4px 0 0 0' }}>{product.Description}</p>
            )}
            
            <div className="product-price-row" style={{marginTop: '12px'}}>
              <span className="product-price" style={{color:'#1a1a1a'}}>{product ? `${product.Product_price} ?` : error ? '' : ''}</span>
            </div>

            <div className="product-qty-row" style={{marginTop: '-22px'}}>
              <button className="qty-btn" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
              <span className="qty">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="add-to-cart-btn" style={product?.Stock != null && Number(product.Stock) === 0 ? {background:'#bbb',cursor:'not-allowed',opacity:0.7, marginTop: '4px'} : {marginTop: '4px'}} disabled={product?.Stock != null && Number(product.Stock) === 0} onClick={async () => {
              try {
                const memberId = sessionStorage.getItem('Member_id');
                console.log('product', product);
                console.log('memberId', memberId);
                if (!product) return;
                if (!memberId) {
                  setShowLoginModal(true);
                  return;
                }
                
                let oldCart = [];
                try {
                  console.log('Fetching old cart...');
                  const res = await fetch(`${API}/api/cart/${memberId}`);
                  const data = await res.json();
                  console.log('Fetched cart data:', data);
                  if (data.cart) {
                    oldCart = data.cart.filter(item => item.Product_id).map(item => ({
                      Product_id: item.Product_id,
                      Quantity: Number(item.Quantity) || 0,
                      Price: Number(item.Price) || 0,
                      Total: (Number(item.Price) || 0) * (Number(item.Quantity) || 0)
                    }));
                  }
                } catch (e) {
                  console.log('Error fetching old cart:', e);
                }
             
                let found = false;
                const newCart = oldCart.map(i => {
                  if (i.Product_id === product.Product_id) {
                    found = true;
                    return { ...i, Quantity: i.Quantity + qty, Total: i.Price * (i.Quantity + qty) };
                  }
                  return i;
                });
                if (!found) {
                  newCart.push({
                    Product_id: product.Product_id,
                    Quantity: qty,
                    Price: Number(product.Product_price) || 0,
                    Total: (Number(product.Product_price) || 0) * qty
                  });
                }
                console.log('newCart', newCart);
                // sync ?? backend
                await fetch(`${API}/api/cart`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ Member_id: memberId, cart_items: newCart })
                });
                console.log('Navigate to cart');
                
                console.log('before navigate');
                try {
                  navigate('/cart');
                  console.log('after navigate');
                } catch (navErr) {
                  console.log('navigate error', navErr);
                }
              } catch (err) {
                alert('เกิดข้อผิดพลาด: ' + err);
                console.log('ERROR:', err);
              }
            }}>Add to Cart</button>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="product-tabs-section">
        <div className="product-tabs">
          <button className="tab-btn" style={{color:'#bbb'}}>DESCRIPTION</button>
        </div>
        <hr className="tab-divider" />
        <div className="tab-content">
          <div className="accordion">
            <div
              className="accordion-header"
              style={{fontWeight:'bold',padding:'16px 0',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}
              onClick={() => setDescOpen(o => !o)}
            >
              DESCRIPTION
              <span style={{fontSize:'18px',fontWeight:'bold',transform: descOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s'}}>&#x25BC;</span>
            </div>
            <hr style={{margin:'0'}} />
            {descOpen && (
              <div style={{padding:'16px 0 0 0'}}>
                {product?.Sale_date && (() => {
                  const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
                  const d = new Date(product.Sale_date);
                  const txt = `วางจำหน่าย ${d.getUTCDate()} ${THAI_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()+543}`;
                  return <div style={{fontSize:'16px',color:'#b06070',fontWeight:'500',marginBottom:'10px'}}>{txt}</div>;
                })()}
                {product?.Product_detail ? (
                  <img
                    src={`${API}/uploads/${product.Product_detail}`}
                    alt="product detail"
                    style={{width:'100%',borderRadius:8,display:'block'}}
                  />
                ) : (
                  <p style={{color:'#aaa',fontSize:13}}>ยังไม่มีรายละเอียด</p>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
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

      {/* Login Required Modal */}
      {showLoginModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={() => setShowLoginModal(false)}>
          <div style={{background:'#fff',borderRadius:16,padding:'36px 40px',maxWidth:340,width:'90%',textAlign:'center',boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:40,marginBottom:12}}><img src="/lock.png" alt="lock" style={{width:40,height:40}} /></div>
            <div style={{fontWeight:700,fontSize:18,marginBottom:8,color:'#1a1a1a'}}>กรุณาเข้าสู่ระบบ</div>
            <div style={{color:'#888',fontSize:14,marginBottom:24}}>คุณต้อง login เพื่อเพิ่มสินค้าลงตะกร้า</div>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              <button onClick={() => setShowLoginModal(false)} style={{padding:'10px 22px',borderRadius:8,border:'1px solid #ddd',background:'#f5f5f5',cursor:'pointer',fontWeight:600}}>ยกเลิก</button>
              <button onClick={() => navigate('/auth')} style={{padding:'10px 22px',borderRadius:8,border:'none',background:'#1a1a1a',color:'#fff',cursor:'pointer',fontWeight:600}}>Login</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Best1;
