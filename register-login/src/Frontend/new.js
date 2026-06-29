
import React, { useEffect, useState } from "react";
	import { useNavigate } from "react-router-dom";
	import "./new.css";
	import SearchBar from "./SearchBar";
const API = process.env.REACT_APP_API_URL;

const NewSection = ({ setIsRegisterView }) => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [newArrivals, setNewArrivals] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const [shopAllOpen, setShopAllOpen] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	const [priceOpen, setPriceOpen] = useState(false);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(2320);
	const [priceRange, setPriceRange] = useState([0, 2320]);
	const [selectedImages, setSelectedImages] = useState({});

	useEffect(() => {
		const memberId = sessionStorage.getItem('Member_id');
		if (!memberId) return;
		fetch(`${API}/api/cart/${memberId}`)
			.then(res => res.json())
			.then(data => {
				if (data.cart) {
					const count = data.cart.filter(item => item.Product_id).reduce((sum, item) => sum + (Number(item.Quantity) || 0), 0);
					setCartCount(count);
				}
			})
			.catch(() => setCartCount(0));
	}, []);

	// Fetch ALL products from backend (for best_1.jpg - best_8.jpg)
	useEffect(() => {
		const fetchAllProducts = async () => {
			try {
				const res = await fetch(`${API}/api/new`);
				const result = await res.json();
				setAllProducts(Array.isArray(result.data) ? result.data : []);
				// ??????? newArrivals ???? 4 ?????????????????????? (?????????????? new_1.1.jpg, new_1.2.jpg ???)
				setNewArrivals((Array.isArray(result.data) ? result.data : []).slice(0, 4));
			} catch (err) {
				setAllProducts([]);
				setNewArrivals([]);
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

	// ??? min/max price ??? backend (price_range)
	useEffect(() => {
		fetch(`${API}/api/price-range/2`)
			.then(res => res.json())
			.then(({ min, max }) => {
				setMinPrice(min);
				setMaxPrice(max);
				setPriceRange([min, max]);
			});
	}, []);

	// helper: match image path ???? "new_1.1.jpg" ??? "products/new_1.1.jpg"
	const imgMatch = (img, key) => img.startsWith(key) || img.split('/').pop().startsWith(key);

	return (
		<>
			{/* ??????????????? */}
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

			{/* Overlay & Side Menu (React state) */}
			<div className={`overlay${sideMenuOpen ? ' active' : ''}`} onClick={() => setSideMenuOpen(false)}></div>
			<div className={`side-menu${sideMenuOpen ? ' active' : ''}`} id="sideMenu">
				<div className="close-btn" id="closeMenu" onClick={() => setSideMenuOpen(false)}>
					<i className="fa-solid fa-xmark"></i>
				</div>
				   <div className="login-section">
					<span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/auth'; }}>REGISTER</span>
					<span className="divider">|</span>
					<span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/auth'; }}>LOGIN</span>
				   </div>
				   <ul>
					<li style={{cursor:'pointer'}} onClick={() => navigate('/')}>MYPAGE</li>
					<div className="menu-header" id="shopAllHeader" onClick={() => setShopAllOpen(!shopAllOpen)}>
						<span>SHOP ALL</span>
						<span className={`toggle-icon${shopAllOpen ? ' active' : ''}`} id="toggleIcon">+</span>
					</div>
					<ul className={`submenu${shopAllOpen ? ' active' : ''}`} id="submenu">
						<li style={{cursor:'pointer'}} onClick={() => navigate('/promotion')}>PROMOTION</li>
            			<li style={{cursor:'pointer'}} onClick={() => navigate('/bestsellerform')}>BEST</li>
            			<li>NEW</li>
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
                        <span className="cart-badge">{cartCount}</span>
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
                BEST: '/bestsellerform',
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
            <p>???????????????????????????????</p>
          )}
        	</div>
      	</section>

			{/* NEW ARRIVALS Section Header (no plus icon) */}

			<section className="section-header-new-arrivals">
				<div className="header-container">
					<h2 className="section-title">NEW ARRIVALS</h2>
				</div>
			</section>

			{/* Filter Sidebar (Availability, Price) */}
			<div className="new-arrivals-content-layout">
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
										<span className="filter-currency">?</span>
										<input type="number" value={priceRange[0]} min={minPrice} max={priceRange[1]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} />
									</div>
									<span className="filter-price-to">to</span>
									<div className="filter-price-box">
										<span className="filter-currency">?</span>
										<input type="number" value={priceRange[1]} min={priceRange[0]} max={maxPrice} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} />
									</div>
								</div>
							</div>
						)}
					</div>
				</aside>
{/* ????????? dynamic: 4 ???????????? ??????????????? */}
							<div className="new-arrivals-grid" style={{ margin: '0 0 64px 0' }}>
								{(() => {
									const REGEX = /^new_(\d+)\./i;

									const groupNums = [...new Set(
										allProducts
											.filter(p => p.Image)
											.map(p => {
												const m = p.Image.split('/').pop().match(REGEX);
												return m ? parseInt(m[1]) : null;
											})
											.filter(n => n !== null)
									)].sort((a, b) => a - b);

									const conventionIds = new Set(
										allProducts.filter(p => p.Image && p.Image.split('/').pop().match(REGEX)).map(p => p.Product_id)
									);
									const standaloneProducts = allProducts.filter(p => !conventionIds.has(p.Product_id));

									const groupedCards = groupNums.map(num => {
										const prefix = `new_${num}`;
										const variantKey = selectedImages[num] || `new_${num}.1`;
										const product = allProducts.find(p => p.Image && imgMatch(p.Image, variantKey));
										if (!product || Number(product.Product_price) > priceRange[1]) return null;
										const imgSrc = product.Image.startsWith('http') ? product.Image : `${API}/uploads/${product.Image}`;
										const name = product.Product_name;
										const price = product.Product_price;
										const detail = product.Product_detail;
										const variants = allProducts
											.filter(p => p.Image && imgMatch(p.Image, prefix + '.'))
											.sort((a, b) => {
												const getSuffix = img => {
													const fname = img.split('/').pop();
													const after = fname.replace(prefix + '.', '');
													return parseFloat(after) || 0;
												};
												return getSuffix(a.Image) - getSuffix(b.Image);
											});
										const colors = variants.filter(v => v.Color).map(v => ({ color: v.Color, img: v.Image.split('/').pop() }));
										return (
											<div className="new-arrivals-card" key={`g_${num}`}>
												<a href={`/best1/${product.Product_id}`} style={{textDecoration:'none'}}>
													<div style={{position:'relative', display:'block'}}>
													<div className="card-image" style={{
														backgroundImage: `url(${imgSrc})`,
														width: '180px', height: '180px',
														backgroundSize: 'cover', backgroundPosition: 'center',
														borderRadius: '16px', border: '1px solid #eee', marginBottom: '12px'
													}}></div>
													{product.Stock != null && Number(product.Stock) === 0 && (
														<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'86px',height:'86px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,30,30,0.85)',color:'#fff',fontSize:'13px',fontWeight:'bold',zIndex:2,textAlign:'center',lineHeight:'1.4'}}>?????????</div>
													)}
													</div>
												</a>
												<div className="card-info">
													<a href={`/best1/${product.Product_id}`} style={{color:'#222',textDecoration:'none'}}>
														<div className="card-title">{name}</div>
                                {product.Product_model && <div className="card-model">{product.Product_model}</div>}
													</a>
													{colors.length > 0 && (
													<div className="card-colors" style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
													  {colors.map((item, i) => (
														<span
														  key={i}
														  onClick={item.img ? () => setSelectedImages(prev => ({ ...prev, [num]: item.img })) : undefined}
														  style={{
															width: '16px', height: '16px', borderRadius: '50%',
															background: item.color, display: 'inline-block',
															border: '1px solid #eee',
															cursor: item.img ? 'pointer' : 'default'
														  }}
														></span>
													  ))}
													</div>
													)}
													{detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(detail) && <div className="card-desc">{detail}</div>}
													<div className="card-price">{price}?</div>
												</div>
											</div>
										);
									});

									const standaloneCards = standaloneProducts.map(product => {
										if (Number(product.Product_price) > priceRange[1]) return null;
										const imgSrc = product.Image
											? (product.Image.startsWith('http') ? product.Image : `${API}/uploads/${product.Image}`)
											: 'https://via.placeholder.com/180x180?text=No+Image';
										const colors = product.Color ? [{ color: product.Color, img: null }] : [];
										return (
											<div className="new-arrivals-card" key={`s_${product.Product_id}`}>
												<a href={`/best1/${product.Product_id}`} style={{textDecoration:'none'}}>
													<div style={{position:'relative', display:'block'}}>
													<div className="card-image" style={{
														backgroundImage: `url(${imgSrc})`,
														width: '180px', height: '180px',
														backgroundSize: 'cover', backgroundPosition: 'center',
														borderRadius: '16px', border: '1px solid #eee', marginBottom: '12px'
													}}></div>
													{product.Stock != null && Number(product.Stock) === 0 && (
														<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'86px',height:'86px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(30,30,30,0.85)',color:'#fff',fontSize:'13px',fontWeight:'bold',zIndex:2,textAlign:'center',lineHeight:'1.4'}}>?????????</div>
													)}
													</div>
												</a>
												<div className="card-info">
													<a href={`/best1/${product.Product_id}`} style={{color:'#222',textDecoration:'none'}}>
														<div className="card-title">{product.Product_name}</div>
                                {product.Product_model && <div className="card-model">{product.Product_model}</div>}
													</a>
													{colors.length > 0 && (
													<div className="card-colors" style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
													  {colors.map((item, i) => (
														<span key={i} style={{
															width: '16px', height: '16px', borderRadius: '50%',
															background: item.color, display: 'inline-block',
															border: '1px solid #eee'
														}}></span>
													  ))}
													</div>
													)}
													{product.Product_detail && !/\.(jpg|jpeg|png|gif|webp|jfif|avif)$/i.test(product.Product_detail) && <div className="card-desc">{product.Product_detail}</div>}
													<div className="card-price">{product.Product_price}?</div>
												</div>
											</div>
										);
									});

									return [...groupedCards, ...standaloneCards];
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

	
	export default NewSection;
