import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Promotion.css";
import SearchBar from "./SearchBar";

const Promotionform = ({ setIsRegisterView }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [shopAllOpen, setShopAllOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [priceOpen, setPriceOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(990);
    const [priceRange, setPriceRange] = useState([0, 990]);
    const [selectedVariants, setSelectedVariants] = useState({});

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

    // Fetch ALL products from backend (for promotion_1.jpg - promotion_8.jpg)
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/promotion");
                const result = await res.json();
                setAllProducts(Array.isArray(result.proProducts) ? result.proProducts : []);
                setPromotions(Array.isArray(result.promotions) ? result.promotions : []);
            } catch (err) {
                setAllProducts([]);
                setPromotions([]);
            }
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        // Fetch categories from backend
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/categories");
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        // --- แถบประกาศ auto-slide ---
        const slides = document.querySelectorAll('.announcement-slide');
        let idx = 0;
        const interval = setInterval(() => {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
            idx = (idx + 1) % slides.length;
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // --- toggle submenu SHOP ALL ---
        const shopAllHeader = document.getElementById('shopAllHeader');
        const submenu = document.getElementById('submenu');
        const toggleIcon = document.getElementById('toggleIcon');
        const toggleSubmenu = () => {
            submenu.classList.toggle('active');
            toggleIcon.classList.toggle('active');
        };
        if (shopAllHeader && submenu && toggleIcon) {
            shopAllHeader.addEventListener('click', toggleSubmenu);
        }
        // --- แทบประกาศ auto-slide ---
        const slides = document.querySelectorAll('.announcement-slide');
        let idx = 0;
        const interval = setInterval(() => {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
            idx = (idx + 1) % slides.length;
        }, 3500);

        // --- เมนูขีดสามขีด (hamburger) ---
        return () => {
            clearInterval(interval);
            if (shopAllHeader) shopAllHeader.removeEventListener('click', toggleSubmenu);
        };
    }, []);

    // ดึง min/max price จาก backend (price_range id=2)
    useEffect(() => {
        fetch("http://localhost:5000/api/price-range/3")
            .then(res => res.json())
            .then(({ min, max }) => {
                setMinPrice(min);
                setMaxPrice(max);
                setPriceRange([min, max]);
            });
    }, []);

    // helper: match image path ทั้ง "pro_1.1.jpg" และ "products/pro_1.1.jpg"
    const imgMatch = (img, key) => img === key || img.split('/').pop() === key || img.startsWith(key) || img.split('/').pop().startsWith(key);

    return (
        <>
            {/* แถบประกาศสีชมพู */}
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

            {/* Overlay & Side Menu (React state) */}
            <div className={`overlay${sideMenuOpen ? ' active' : ''}`} onClick={() => setSideMenuOpen(false)}></div>
            <div className={`side-menu${sideMenuOpen ? ' active' : ''}`} id="sideMenu">
                <div className="close-btn" id="closeMenu" onClick={() => setSideMenuOpen(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </div>
                   <div className="login-section">
                    <span style={{cursor:'pointer'}} onClick={() => navigate('/insert')}>REGISTER</span>
                    <span className="divider">|</span>
                    <span style={{cursor:'pointer'}} onClick={() => navigate('/login')}>LOGIN</span>
                   </div>
                   <ul>
                    <li style={{cursor:'pointer'}} onClick={() => navigate('/')}>MYPAGE</li>
                    <div className="menu-header" id="shopAllHeader" onClick={() => setShopAllOpen(!shopAllOpen)}>
                        <span>SHOP ALL</span>
                        <span className={`toggle-icon${shopAllOpen ? ' active' : ''}`} id="toggleIcon">+</span>
                    </div>
                    <ul className={`submenu${shopAllOpen ? ' active' : ''}`} id="submenu">
                        <li>PROMOTION</li>
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

            {/* Header: โลโก้ ขีดสามขีด ไอคอน */}
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
                    {/* แถบค้นหา */}
                    <SearchBar />
                    {/* ไอคอน Account */}
                    <span className="icon-link" style={{cursor:'pointer'}} onClick={() => navigate('/account')}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </span>
                    {/* ไอคอน Cart */}
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

            {/* หมวดหมู่ 7 วงกลม (dynamic) ย้ายมาตรงนี้ */}
            {/* Product Categories Section */}
      	<section className="product-categories-section">
        	<div className="category-grid" id="categoryGrid">
          		{categories.length > 0 ? (
            	categories.map(type => {
              	const routeMap = {
                BEST: '/bestsellerform',
                NEW: '/new',
                FACE: '/face',
                EYE: '/eye',
                LIP: '/lip',
                CHEEK: '/cheek',
              };
              const route = routeMap[(type.Type_name || '').toUpperCase()] || '#';
              return (
                <div
                  className="category-item"
                  key={type.Type_id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(route)}
                >
                  <div className="category-image-wrapper">
                    <img src={type.Type_pic} alt={type.Type_name} />
                  </div>
                  <p className="category-name">{type.Type_name}</p>
                </div>
              );
            })
          ) : (
            <p>โหลดข้อมูลประเภทสินค้าไม่สำเร็จ</p>
          )}
        	</div>
      	</section>

            {/* PROMOTION Section Header (no plus icon) */}

            <section className="section-header-promotion">
                <div className="header-container">
                    <h2 className="section-title">PROMOTION</h2>
                </div>
            </section>

            {/* Filter Sidebar (Availability, Price) */}
            <div className="promotion-content-layout">
                <aside className="filter-sidebar">
                    <div className="filter-group">
                        <button className="filter-toggle" type="button" onClick={() => setPriceOpen(!priceOpen)}>
                            <span className="filter-label">PRICE</span>
                            <span className="filter-arrow">&#x25BC;</span>
                        </button>
                        <div className="filter-divider"></div>
                        {priceOpen && (
                            <div className="filter-price-section">
                                <input type="range" min={minPrice} max={maxPrice} value={priceRange[1]} className="filter-price-slider" onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} />
                                <div className="filter-price-inputs">
                                    <div className="filter-price-box">
                                        <span className="filter-currency">฿</span>
                                        <input type="number" value={priceRange[0]} min={minPrice} max={priceRange[1]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} />
                                    </div>
                                    <span className="filter-price-to">to</span>
                                    <div className="filter-price-box">
                                        <span className="filter-currency">฿</span>
                                        <input type="number" value={priceRange[1]} min={priceRange[0]} max={maxPrice} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
                                {/* สองแถวสินค้า: flex column */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', margin: '0 0 64px 0' }}>
                                    {[...promotions].sort((a, b) => {
                                        const aIsBuyGet = /^buy\s+\d+\s+get\s+\d+/i.test(a.DiscountType || '');
                                        const bIsBuyGet = /^buy\s+\d+\s+get\s+\d+/i.test(b.DiscountType || '');
                                        return (aIsBuyGet ? 0 : 1) - (bIsBuyGet ? 0 : 1);
                                    }).map(promo => {
                                        const promoProducts = allProducts.filter(p => Number(p.Promotion_id) === Number(promo.Promotion_id));
                                        if (promoProducts.length === 0) return null;
                                        const buyGetMatch = (promo.DiscountType || '').match(/^buy\s+(\d+)\s+get\s+(\d+)/i);
                                        const isBuy1Get1 = !!buyGetMatch;
                                        const buyQty = buyGetMatch ? Number(buyGetMatch[1]) : 1;
                                        const getQty = buyGetMatch ? Number(buyGetMatch[2]) : 1;
                                        return (
                                            <React.Fragment key={promo.Promotion_id}>
                                                {/* Banner */}
                                                {isBuy1Get1 ? (
                                                    promo.condition && (
                                                        <div className="promo-banner-green">
                                                            <div className="promo-b3-accent-green"></div>
                                                            <div className="promo-b3-body">
                                                                <div className="promo-b3-inner">
                                                                    <div className="promo-b3-buy1">1<sup style={{fontSize:'18px'}}>+</sup>1</div>
                                                                    <div className="promo-b3-divider-green"></div>
                                                                    <div>
                                                                        <div className="promo-b3-title" style={{color:'#222'}}>{promo.condition}</div>
                                                                        <div className="promo-b3-desc" style={{color:'#222'}}>ซื้อ {buyQty} แถม {getQty} เฉพาะสินค้าที่ร่วมรายการ!</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                ) : (
                                                    promo.condition && (
                                                        <div className="promo-banner-3">
                                                            <div className="promo-b3-accent"></div>
                                                            <div className="promo-b3-body">
                                                                <div className="promo-b3-inner">
                                                                    <div className="promo-b3-percent"><sup>-</sup>{promo.Discount_value || 0}<sup>%</sup></div>
                                                                    <div className="promo-b3-divider"></div>
                                                                    <div>
                                                                        <div className="promo-b3-title">{promo.condition.replace(/\d+(\.\d+)?%/, promo.Discount_value + '%')}</div>
                                                                        <div className="promo-b3-desc">เลือกซื้อสินค้าที่ร่วมรายการด้านล่าง</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}

                                                {/* Product grid */}
                                                <div className="promotion-grid">
                                                    {isBuy1Get1 ? (
                                                        // Buy 1 Get 1: แสดงตรงๆ ทีละสินค้า
                                                        promoProducts
                                                            .filter(p => Number(p.Product_price) <= priceRange[1])
                                                            .map(product => {
                                                            const imgSrc = product.Image
                                                                ? (product.Image.startsWith('http') ? product.Image : `http://localhost:5000/uploads/${product.Image}`)
                                                                : '';
                                                            return (
                                                                <div className="promotion-card" key={product.Product_id}>
                                                                    <a href={`/best2/${product.Product_id}`} style={{textDecoration:'none'}}>
                                                                        <div style={{position:'relative', width:'100%', aspectRatio:'1/1', marginBottom:'12px'}}>
                                                                            <div style={{ position: 'absolute', top: '-4px', left: '-7px', zIndex: 2 }}>
                                                                                <div style={{ backgroundColor: '#FF6347', color: '#fff', fontWeight: 'bold', borderRadius: '4px', padding: '4px 14px', fontSize: '13px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>Buy {buyQty} Get {getQty}</div>
                                                                            </div>
                                                                            {product.Stock != null && Number(product.Stock) === 0 && (
                                                                                <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'86px',height:'86px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,30,30,0.85)',color:'#fff',fontSize:'13px',fontWeight:'bold',zIndex:2,textAlign:'center',lineHeight:'1.4'}}>สินค้าหมด</div>
                                                                            )}
                                                                            {imgSrc ? (
                                                                                <div className="card-image" style={{ backgroundImage: `url(${imgSrc})`, width: '180px', height: '180px', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', border: '1px solid #eee', marginBottom: '12px' }}></div>
                                                                            ) : (
                                                                                <div style={{width:'180px', height:'180px', borderRadius:'16px', border:'1px solid #eee', background:'#f5f5f5', marginBottom:'12px'}}></div>
                                                                            )}
                                                                        </div>
                                                                    </a>
                                                                    <div className="card-info">
                                                                        <a href={`/best2/${product.Product_id}`} style={{color:'#222',textDecoration:'none'}}>
                                                                            <div className="card-title">{product.Product_name}</div>
                                                                            {product.Product_model && <div className="card-model">{product.Product_model}</div>}
                                                                        </a>
                                                                        <div className="card-price">
                                                                            <span style={{color:'#e53322', fontWeight:'bold'}}>{Number(product.Product_price).toFixed(2)}฿</span>
                                                                            <span style={{color:'#212121', fontWeight:'bold', fontSize:'12px', marginLeft:'8px'}}>+ ฟรี {getQty} ชิ้น!</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        // % ส่วนลด: group ตาม image prefix
                                                        (() => {
                                                            const seenPrefixes = new Set();
                                                            const groups = [];
                                                            promoProducts.forEach(p => {
                                                                if (!p.Image) return;
                                                                const fileName = p.Image.split('/').pop();
                                                                const prefix = fileName.split('.')[0];
                                                                if (!seenPrefixes.has(prefix)) {
                                                                    seenPrefixes.add(prefix);
                                                                    groups.push({ prefix, baseProduct: p });
                                                                }
                                                            });
                                                            return groups.map(({ prefix, baseProduct }) => {
                                                                if (Number(baseProduct.Product_price) > priceRange[1]) return null;
                                                                const variants = promoProducts.filter(p => p.Image && p.Image.split('/').pop().startsWith(prefix + '.'));
                                                                const swatchColors = variants.filter(v => v.Color).map(v => ({ color: v.Color, img: v.Image }));
                                                                const selectedId = selectedVariants[prefix] || baseProduct.Product_id;
                                                                const product = variants.find(v => v.Product_id === selectedId) || baseProduct;
                                                                const imgSrc = product.Image
                                                                    ? (product.Image.startsWith('http') ? product.Image : `http://localhost:5000/uploads/${product.Image}`)
                                                                    : '';
                                                                return (
                                                                    <div className="promotion-card" key={prefix}>
                                                                        <div style={{cursor:'pointer'}} onClick={() => navigate(`/best2/${product.Product_id}`)}>
                                                                            <div style={{position:'relative', width:'100%', aspectRatio:'1/1'}}>
                                                                                <div style={{ position: 'absolute', top: '-4px', left: '-7px', zIndex: 2 }}>
                                                                                    <div style={{ backgroundColor: '#FF6347', color: '#fff', fontWeight: 'bold', borderRadius: '4px', padding: '4px 14px', fontSize: '13px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                                                                                        {(product?.Discount_value || 0) + '%'}
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{position:'relative', display:'inline-block'}}>
                                                                                    <div className="card-image" style={{ backgroundImage: `url(${imgSrc})`, width: '180px', height: '180px', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', border: '1px solid #eee', marginBottom: '12px' }}></div>
                                                                                    {product.Stock != null && Number(product.Stock) === 0 && (
                                                                                        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'86px',height:'86px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,30,30,0.85)',color:'#fff',fontSize:'13px',fontWeight:'bold',zIndex:2,textAlign:'center',lineHeight:'1.4'}}>สินค้าหมด</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="card-info">
                                                                            <div style={{color:'#222', cursor:'pointer'}} onClick={() => navigate(`/best2/${product.Product_id}`)}>
                                                                                <div className="card-title">{product.Product_name}</div>
                                                                                {product.Product_model && <div className="card-model">{product.Product_model}</div>}
                                                                            </div>
                                                                            {swatchColors.length > 1 && (
                                                                                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                                                                    {swatchColors.map((item, i) => (
                                                                                        <span key={i} title={item.img}
                                                                                            onClick={() => {
                                                                                                const variantProduct = variants.find(v => v.Image === item.img);
                                                                                                if (variantProduct) setSelectedVariants(prev => ({ ...prev, [prefix]: variantProduct.Product_id }));
                                                                                            }}
                                                                                            style={{ width: '16px', height: '16px', borderRadius: '50%', background: item.color, display: 'inline-block', border: '1px solid #eee', cursor: 'pointer' }}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                            <div className="card-price">
                                                                                <span style={{textDecoration:'line-through', color:'#aaa', fontSize:'13px', marginRight:'6px'}}>{Number(product.Product_price).toFixed(2)}฿</span>
                                                                                <span style={{color:'#e53322', fontWeight:'bold'}}>{(Number(product.Product_price) * (1 - (Number(product.Discount_value) || 0) / 100)).toFixed(2)}฿</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            });
                                                        })()
                                                    )}
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
            </div>

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

    
    export default Promotionform;
