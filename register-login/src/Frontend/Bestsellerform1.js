import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bestsellerform1.css";
import SearchBar from "./SearchBar";

const Bestsellerform1 = ({ setIsRegisterView }) => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [bestsellers, setBestsellers] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const [shopAllOpen, setShopAllOpen] = useState(false);
	const [priceOpen, setPriceOpen] = useState(false);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(2320);
	const [priceRange, setPriceRange] = useState([0, 2320]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [proProducts, setProProducts] = useState([]);
	const [selectedImages, setSelectedImages] = useState({});
	const [allColors, setAllColors] = useState([]);
	const API = process.env.REACT_APP_API_URL;

	// ??? Color ???????????????? (?????? sibling color swatches)
	useEffect(() => {
		fetch(`${API}/api/product-colors`)
			.then(r => r.json())
			.then(data => setAllColors(Array.isArray(data.data) ? data.data : []))
			.catch(() => setAllColors([]));
	}, []);

	// ?????????????????? (?????????? badge + ??????)
	useEffect(() => {
		fetch(`${API}/api/promotion`)
			.then(r => r.json())
			.then(data => setProProducts(Array.isArray(data.proProducts) ? data.proProducts : []))
			.catch(() => setProProducts([]));
	}, []);

	// Fetch ALL products from backend (for best_1.jpg - best_8.jpg)
	useEffect(() => {
		const fetchAllProducts = async () => {
			try {
				const res = await fetch(`${API}/api/best`);
				const result = await res.json();
				console.log('API /api/best result.data:', result.data);
				const products = Array.isArray(result.data) ? result.data : [];
				setAllProducts(products);
				setBestsellers(products.slice(0, 4));
			} catch (err) {
				setAllProducts([]);
				setBestsellers([]);
			}
		};
		fetchAllProducts();
	}, []);

	useEffect(() => {
		// Fetch categories from backend
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

	useEffect(() => {
		// --- ????????? auto-slide ---
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
		// --- ????????? auto-slide ---
		const slides = document.querySelectorAll('.announcement-slide');
		let idx = 0;
		const interval = setInterval(() => {
			slides.forEach((slide, i) => slide.classList.toggle('active', i === idx));
			idx = (idx + 1) % slides.length;
		}, 3500);

		// --- ????????????? (hamburger) ---
		return () => {
			clearInterval(interval);
			if (shopAllHeader) shopAllHeader.removeEventListener('click', toggleSubmenu);
		};
	}, []);

	// ??? min/max price ??? backend (price_range table, BEST = id 1)
	useEffect(() => {
		fetch(`${API}/api/price-range/1`)
			.then(res => res.json())
			.then(({ min, max }) => {
				setMinPrice(min);
				setMaxPrice(max);
				setPriceRange([min, max]);
			});
	}, []);

	// ???????????????????????? /api/best (backend filter by image LIKE 'best_%')
	const filteredBest8 = allProducts
		.filter(p => Number(p.Product_price) <= priceRange[1]);

// ?????????????? APPLY ????????

	return (
		<>
			{/* ??????????????? */}
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
						<li style={{cursor:'pointer'}} onClick={() => navigate('/promotion')}>PROMOTION</li>
						<li>BEST</li>
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

			{/* Header: ????? ????????? ????? */}
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
					{/* ???????? */}
					<SearchBar />
					{/* ????? Account */}
					<span className="icon-link" style={{cursor:'pointer'}} onClick={() => navigate('/account')}>
            			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              			<circle cx="12" cy="7" r="4"></circle>
            			</svg>
          			</span>
					{/* ????? Cart */}
					<span className="icon-link cart-icon" style={{cursor:'pointer'}} onClick={() => navigate('/cart')}>
            			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              			<circle cx="9" cy="21" r="1"></circle>
              			<circle cx="20" cy="21" r="1"></circle>
              			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            			</svg> 
            			<span className="cart-badge">0</span>
          			</span>
				</div>
			</header>

			{/* ???????? 7 ????? (dynamic) ???????????? */}
			{/* Product Categories Section */}
      	<section className="product-categories-section">
        <div className="category-grid" id="categoryGrid">
          {categories.length > 0 ? (
            categories.map(type => {
              const routeMap = {
                NEW: '/new',
                PROMOTION: '/promotion',
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

			{/* BEST SELLER Section Header (no plus icon) */}

			<section className="section-header-best-seller">
				<div className="header-container">
					<h2 className="section-title">BEST SELLER</h2>
				</div>
			</section>

			{/* Filter Sidebar (Availability, Price) */}
			<div className="bestseller-content-layout">
				<aside className="filter-sidebar">

					<div className="filter-group">
						<button
							className="filter-toggle"
							type="button"
							onClick={() => setPriceOpen(!priceOpen)}
						>
							<span className="filter-label">PRICE</span>
							<span className="filter-arrow">&#x25BC;</span>
						</button>
						<div className="filter-divider"></div>
						{priceOpen && (
							<div className="filter-price-section">
								<input
									type="range"
									min={minPrice}
									max={maxPrice}
									value={priceRange[1]}
									className="filter-price-slider"
									onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
								/>
								<div className="filter-price-inputs">
									<div className="filter-price-box">
										<span className="filter-currency">?</span>
										<input
											type="number"
											value={priceRange[0]}
											min={minPrice}
											max={priceRange[1]}
											onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
										/>
									</div>
									<span className="filter-price-to">to</span>
									<div className="filter-price-box">
										<span className="filter-currency">?</span>
										<input
											type="number"
											value={priceRange[1]}
											min={priceRange[0]}
											max={maxPrice}
											onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</aside>
							{/* Grid ??????: ???????? total_sold DESC ??? API */}
							<div className="best-seller-grid" style={{ margin: '0 0 64px 0' }}>
								{(() => {
									const REGEX = /^best_(\d+)\./i;
									const renderedGroups = new Set();
									const cards = [];

									allProducts.forEach(product => {
										if (!product.Image) return;
										if (Number(product.Product_price) > priceRange[1]) return;

										const filename = product.Image.split('/').pop();
										const m = filename.match(REGEX);

										if (m) {
											// ?????? best_N convention � ???? grouped card ????? color swatches
											const num = parseInt(m[1]);
											if (renderedGroups.has(num)) return; // ????????
											renderedGroups.add(num);

											const variantKey = selectedImages[num] || ('best_' + num + '.');
											const groupProduct = allProducts.find(p => p.Image && p.Image.split('/').pop().startsWith(variantKey)) ||
												allProducts.find(p => p.Image && new RegExp('^best_' + num + '\\.', 'i').test(p.Image.split('/').pop()));
											if (!groupProduct || Number(groupProduct.Product_price) > priceRange[1]) return;

											const imgSrc = groupProduct.Image.startsWith('http') ? groupProduct.Image : `${API}/uploads/${groupProduct.Image}`;
											const variants = allProducts
												.filter(p => p.Image && new RegExp('^best_' + num + '\\.', 'i').test(p.Image.split('/').pop()))
												.sort((a, b) => {
													const getSuffix = img => parseFloat(img.split('/').pop().replace(new RegExp('^best_' + num + '\\.', 'i'), '')) || 0;
													return getSuffix(a.Image) - getSuffix(b.Image);
												});
											const colors = variants.filter(v => v.Color).map(v => ({ color: v.Color, imgKey: v.Image.split('/').pop() }));
											const promo = proProducts.find(pp => pp.Product_id === groupProduct.Product_id);
											const discount = promo ? Number(promo.Discount_value) || 0 : 0;
											const originalPrice = Number(groupProduct.Product_price);
											const discountedPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : null;
											const link = promo ? '/best2/' + groupProduct.Product_id : '/best1/' + groupProduct.Product_id;

											cards.push(
												<div className="best-seller-card" key={'g_' + num}>
													<a href={link} style={{textDecoration:'none',display:'block',width:'100%'}}>
														<div style={{position:'relative', width:'100%', aspectRatio:'1/1', marginBottom:'12px'}}>
															{discount > 0 && (
																<div style={{ position: 'absolute', top: '-4px', left: '-7px', zIndex: 2,
																  backgroundColor: '#FF6347', color: '#fff', fontWeight: 'bold',
																  borderRadius: '4px', padding: '2px 10px', fontSize: '13px' }}>
																  {discount}%
																</div>
															)}
															<div className="card-image" style={{
																backgroundImage: `url(${imgSrc})`,
																width: '180px', height: '180px',
																backgroundSize: 'cover', backgroundPosition: 'center',
																borderRadius: '16px', border: '1px solid #eee',
															filter: 'none'
														}}></div>
														{groupProduct.Stock != null && Number(groupProduct.Stock) === 0 && (
															<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'86px',height:'86px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,30,30,0.85)',color:'#fff',fontSize:'13px',fontWeight:'bold',zIndex:2,textAlign:'center',lineHeight:'1.4'}}>?????????</div>
															)}
														</div>
													</a>
													<div className="card-info">
														<a href={link} style={{color:'#222',textDecoration:'none'}}>
															<div className="card-title">{groupProduct.Product_name}</div>
															{groupProduct.Product_model && <div className="card-model">{groupProduct.Product_model}</div>}
														</a>
														{(() => {
															const gBase = groupProduct.Product_name.replace(/\s+N?\d+$/, '');
															const gSiblings = allColors.filter(p => p.Product_name.replace(/\s+N?\d+$/, '') === gBase);
															if (colors.length === 0 && gSiblings.length === 0) return null;
															return (
																<div className="card-colors" style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
																	{colors.map((item, i) => (
																	  <span key={'i'+i}
																	    onClick={() => setSelectedImages(prev => ({ ...prev, [num]: item.imgKey }))}
																	    style={{ width: '20px', height: '20px', borderRadius: '50%', background: item.color,
																	      display: 'inline-block', border: '1px solid #eee', cursor: 'pointer' }}
																	  />
																	))}
																	{gSiblings.map((v, i) => {
																		const vLink = proProducts.find(pp => pp.Product_id === v.Product_id) ? '/best2/'+v.Product_id : '/best1/'+v.Product_id;
																		return (<a key={'s'+i} href={vLink} style={{textDecoration:'none'}}><span style={{width:'20px',height:'20px',borderRadius:'50%',background:v.Color,display:'inline-block',border:'1px solid #eee',outline:v.Product_id===groupProduct.Product_id?'2px solid #aaa':'none',outlineOffset:'2px',cursor:'pointer'}} /></a>);
																	})}
																</div>
															);
														})()}
														{groupProduct.Product_detail && !/\.(jpg|jpeg|png|gif|webp)$/i.test(groupProduct.Product_detail) && (
											<div className="card-desc">{groupProduct.Product_detail}</div>
										)}
														{discountedPrice ? (
															<div className="card-price">
																<span style={{textDecoration:'line-through', color:'#aaa', fontSize:'13px', marginRight:'6px'}}>{originalPrice}?</span>
																<span style={{color:'#e53322', fontWeight:'bold'}}>{discountedPrice}?</span>
															</div>
														) : (
															<div className="card-price">{originalPrice}?</div>
														)}
													</div>
												</div>
											);
										} else {
											// ?????? type ???? � ???????? card ??????
											const imgSrc = product.Image.startsWith('http') ? product.Image : `${API}/uploads/${product.Image}`;
											const promo = proProducts.find(pp => pp.Product_id === product.Product_id);
											const discount = promo ? Number(promo.Discount_value) || 0 : 0;
											const originalPrice = Number(product.Product_price);
											const discountedPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : null;
											const link = promo ? '/best2/' + product.Product_id : '/best1/' + product.Product_id;

											cards.push(
												<div className="best-seller-card" key={'s_' + product.Product_id}>
													<a href={link} style={{textDecoration:'none',display:'block',width:'100%'}}>
														<div style={{position:'relative', width:'100%', aspectRatio:'1/1', marginBottom:'12px'}}>
															{discount > 0 && (
																<div style={{ position: 'absolute', top: '-4px', left: '-7px', zIndex: 2,
																  backgroundColor: '#FF6347', color: '#fff', fontWeight: 'bold',
																  borderRadius: '4px', padding: '2px 10px', fontSize: '13px' }}>
																  {discount}%
																</div>
															)}
															<div className="card-image" style={{
																backgroundImage: `url(${imgSrc})`,
																width: '180px', height: '180px',
																backgroundSize: 'cover', backgroundPosition: 'center',
																borderRadius: '16px', border: '1px solid #eee',
															filter: 'none'
														}}></div>
														{product.Stock != null && Number(product.Stock) === 0 && (
															<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'86px',height:'86px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,30,30,0.85)',color:'#fff',fontSize:'13px',fontWeight:'bold',zIndex:2,textAlign:'center',lineHeight:'1.4'}}>?????????</div>
															)}
														</div>
													</a>
													<div className="card-info">
														<a href={link} style={{color:'#222',textDecoration:'none'}}>
															<div className="card-title">{product.Product_name}</div>
															{product.Product_model && <div className="card-model">{product.Product_model}</div>}
														</a>
														{(() => { const sBase = product.Product_name.replace(/\s+N?\d+$/, ''); const sc = allColors.filter(p => p.Product_name.replace(/\s+N?\d+$/, '') === sBase); return sc.length > 0 && (<div className="card-colors" style={{display:'flex',gap:'8px',marginBottom:'6px'}}>{sc.map((v,i) => { const vLink = proProducts.find(pp=>pp.Product_id===v.Product_id) ? '/best2/'+v.Product_id : '/best1/'+v.Product_id; return (<a key={i} href={vLink} style={{textDecoration:'none'}}><span style={{width:'20px',height:'20px',borderRadius:'50%',background:v.Color,display:'inline-block',border:'1px solid #eee',outline:v.Product_id===product.Product_id?'2px solid #aaa':'none',outlineOffset:'2px',cursor:'pointer'}} /></a>); })}</div>); })()}
														{product.Product_detail && !/\.(jpg|jpeg|png|gif|webp)$/i.test(product.Product_detail) && (
											<div className="card-desc">{product.Product_detail}</div>
										)}
														{discountedPrice ? (
															<div className="card-price">
																<span style={{textDecoration:'line-through', color:'#aaa', fontSize:'13px', marginRight:'6px'}}>{originalPrice}?</span>
																<span style={{color:'#e53322', fontWeight:'bold'}}>{discountedPrice}?</span>
															</div>
														) : (
															<div className="card-price">{originalPrice}?</div>
														)}
													</div>
												</div>
											);
										}
									});

									if (cards.length === 0) return <p>ไม่มีสินค้า Best Seller ในขณะนี้</p>;
									return cards;
								})()}
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

	
	export default Bestsellerform1;
