import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bestsellerform1.css";

const Bestsellerform1 = ({ setIsRegisterView }) => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [bestsellers, setBestsellers] = useState([]);
	const [sideMenuOpen, setSideMenuOpen] = useState(false);
	const [shopAllOpen, setShopAllOpen] = useState(false);

	// Fetch best seller products from backend
	useEffect(() => {
		const fetchBestsellers = async () => {
			try {
				const res = await fetch("http://localhost:5000/api/bestseller");
				const result = await res.json();
				// result.data is array of products
				setBestsellers(Array.isArray(result.data) ? result.data : []);
			} catch (err) {
				setBestsellers([]);
			}
		};
		fetchBestsellers();
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

		// --- toggle ค้นหา ---
		const searchForm = document.querySelector('.search-form');
		const searchButton = document.querySelector('.search-button');
		const searchHandler = () => {
			searchForm.classList.toggle('active-search');
		};
		if (searchButton && searchForm) {
			searchButton.addEventListener('click', searchHandler);
		}

		// --- เมนูขีดสามขีด (hamburger) ---
		return () => {
			clearInterval(interval);
			if (searchButton) searchButton.removeEventListener('click', searchHandler);
			if (shopAllHeader) shopAllHeader.removeEventListener('click', toggleSubmenu);
		};
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

			{/* Overlay & Side Menu (React state) */}
			<div className={`overlay${sideMenuOpen ? ' active' : ''}`} onClick={() => setSideMenuOpen(false)}></div>
			<div className={`side-menu${sideMenuOpen ? ' active' : ''}`} id="sideMenu">
				<div className="close-btn" id="closeMenu" onClick={() => setSideMenuOpen(false)}>
					<i className="fa-solid fa-xmark"></i>
				</div>
				   <div className="login-section">
					<span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/app'; }}>REGISTER</span>
					<span className="divider">|</span>
					<span style={{cursor:'pointer'}} onClick={() => { window.location.href = '/app'; }}>LOGIN</span>
				   </div>
				   <ul>
					<li style={{cursor:'pointer'}} onClick={() => { window.location.href = '/Home/home.html'; }}>MYPAGE</li>
					<div className="menu-header" id="shopAllHeader" onClick={() => setShopAllOpen(!shopAllOpen)}>
						<span>SHOP ALL</span>
						<span className={`toggle-icon${shopAllOpen ? ' active' : ''}`} id="toggleIcon">+</span>
					</div>
					<ul className={`submenu${shopAllOpen ? ' active' : ''}`} id="submenu">
						<li>Rom&nd X ZO&Friends</li>
						<li>BEST</li>
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

			{/* หมวดหมู่ 7 วงกลม (dynamic) ย้ายมาตรงนี้ */}
			<section className="product-categories-section">
				<div className="category-grid" id="categoryGrid">
					{categories.length > 0 ? (
						categories.map(type => (
							<a href={`#${type.Type_name}`} className="category-item" key={type.Type_id}>
								<div className="category-image-wrapper">
									<img src={type.Type_pic} alt={type.Type_name} />
								</div>
								<p className="category-name">{type.Type_name}</p>
							</a>
						))
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
						<button className="filter-toggle" type="button">
							<span className="filter-label">AVAILABILITY</span>
							<span className="filter-arrow">&#x25BC;</span>
						</button>
						<div className="filter-divider"></div>
					</div>
					<div className="filter-group">
						<button className="filter-toggle" type="button">
							<span className="filter-label">PRICE</span>
							<span className="filter-arrow">&#x25BC;</span>
						</button>
						<div className="filter-divider"></div>
					</div>
				</aside>
				<section className="best-seller-grid">
					{bestsellers.length > 0 ? (
						bestsellers.map(product => (
							<div className="best-seller-card" key={product.Product_id}>
								<a href="/best1" style={{textDecoration:'none'}}>
									<div className="card-image" style={{
										backgroundImage: `url(${product.Image ? (product.Image.startsWith('http') ? product.Image : `http://localhost:5000/uploads/${product.Image}`) : 'https://via.placeholder.com/180x180?text=No+Image'})`,
										width: '180px',
										height: '180px',
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										borderRadius: '16px',
										border: '1px solid #eee',
										marginBottom: '12px'
									}}></div>
								</a>
								<div className="card-info">
									<a href="/best1" style={{color:'#222',textDecoration:'none'}}>
										<div className="card-title">{product.Product_name}</div>
									</a>
									{/* ดาวรีวิวและจำนวนรีวิว */}
									<div className="card-review" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '6px 0' }}>
										{/* ดาว 5 ดวง */}
										{[...Array(5)].map((_, i) => (
											<span key={i} style={{ color: '#FFA500', fontSize: '16px' }}>&#9733;</span>
										))}
										<span style={{ color: '#333', fontSize: '13px', marginLeft: '4px' }}>10 reviews</span>
									</div>
									{/* วงกลมระบุสี (mock: 2 สี) */}
									<div className="card-colors" style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
										{(() => {
											// Mock สีสำหรับแต่ละสินค้า
											const colorSets = [
												["#836953", "#B99C85"], // สินค้า 1
												["#665b4bff", "#B99C85"], // สินค้า 2
												["#FF8986", "#F7D6E0"], // สินค้า 3
												["#FFC39B", "#FFC2D1"] // สินค้า 4
											];
											// ใช้ index ของสินค้าใน map
											const idx = bestsellers.findIndex(p => p.Product_id === product.Product_id);
											const colors = colorSets[idx] || ["#ccc", "#eee"];
											return colors.map((color, i) => (
												<span key={i} style={{ width: '16px', height: '16px', borderRadius: '50%', background: color, display: 'inline-block', border: '1px solid #eee' }}></span>
											));
										})()}
									</div>
									<div className="card-desc">{product.Product_detail}</div>
									<div className="card-price">{product.Product_price}฿</div>
								</div>
							</div>
						))
					) : (
						<p>ไม่มีสินค้า Best Seller ในขณะนี้</p>
					)}
				</section>
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

	
	export default Bestsellerform1;