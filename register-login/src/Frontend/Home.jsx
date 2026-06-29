import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Home.css";
const API = process.env.REACT_APP_API_URL;
const PUBLIC_URL = process.env.PUBLIC_URL || '';


function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [shopAllOpen, setShopAllOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentArrival, setCurrentArrival] = useState(0);
  const [currentPersonal, setCurrentPersonal] = useState(0);
  const [currentBest, setCurrentBest] = useState(0);
  const [currentGirl, setCurrentGirl] = useState(6); // starts at middle copy of tripled array
  const [girlNoTransition, setGirlNoTransition] = useState(false);
  const [girlDragOffset, setGirlDragOffset] = useState(0);
  const [girlDragging, setGirlDragging] = useState(false);
  const [girlProducts, setGirlProducts] = useState({});
  const [girlProductIdx, setGirlProductIdx] = useState({});
  const [personalProducts, setPersonalProducts] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  const addToGirlCart = async (e, product) => {
    e.stopPropagation();
    const memberId = sessionStorage.getItem('Member_id');
    if (!memberId) { return; }
    try {
      let oldCart = [];
      const res = await fetch(`${API}/api/cart/${memberId}`);
      const data = await res.json();
      if (data.cart) {
        oldCart = data.cart.filter(i => i.Product_id).map(i => ({
          Product_id: i.Product_id,
          Quantity: Number(i.Quantity) || 0,
          Price: Number(i.Price) || 0,
          Total: (Number(i.Price) || 0) * (Number(i.Quantity) || 0)
        }));
      }
      let found = false;
      const newCart = oldCart.map(i => {
        if (i.Product_id === product.Product_id) {
          found = true;
          return { ...i, Quantity: i.Quantity + 1, Total: i.Price * (i.Quantity + 1) };
        }
        return i;
      });
      if (!found) {
        newCart.push({ Product_id: product.Product_id, Quantity: 1, Price: Number(product.Product_price) || 0, Total: Number(product.Product_price) || 0 });
      }
      await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Member_id: memberId, cart_items: newCart })
      });
      navigate('/cart');
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err);
    }
  };

  const girlSlides = [
    {
      video: `${PUBLIC_URL}/Home/girl_1.mp4`,
      productIds: [7, 127]
    },
    {
      video: `${PUBLIC_URL}/Home/girl_2.mp4`,
      productIds: [105, 8, 82]
    },
    {
      video: `${PUBLIC_URL}/Home/girl_3.mp4`,
      productIds: [31]
    },
    {
      video: `${PUBLIC_URL}/Home/girl_4.mp4`,
      productIds: [97]
    },
    {
      video: `${PUBLIC_URL}/Home/girl_5.mp4`,
      productIds: [100, 101, 102, 103, 104, 105]
    },
    {
      video: `${PUBLIC_URL}/Home/girl_6.mp4`,
      productIds: [61]
    },
  ];

  const loopedGirlSlides = [...girlSlides, ...girlSlides, ...girlSlides];

  const arrivalSlides = [
    {
      subtitle: "TteokGloss🍡",
      title: <>Glasting Color Gloss<br />#Tteok edition !</>,
      desc: "เฉดสีนุ่มหนึบ หวานละมุนดุจขนมต๊อกเกาหลี จับคู่มาอย่างลงตัว เตรียมพร้อมให้ rommates ช้อปแล้ว",
      video: `${PUBLIC_URL}/Home/new_1.mp4`
    },
    {
      subtitle: "4 in 1 UP DOWN LEFT RIGHT",
      title: <>Han All Eye<br />Pot Liner</>,
      desc: "คอมพลีทลุคดวงตาดูกว้าง สวยโดดเด่นใน 4 ขั้นตอนง่าย ๆ ลงสี ตามทิศของลูกศรได้เลย",
      video: `${PUBLIC_URL}/Home/new_2.mp4`
    },
    {
      subtitle: "Rolling Rooling",
      title: <>Juicy Roll<br />Cheek</>,
      desc: "บลัชผลไม้เสกแก้มใสยิ่งทายิ่ง POP!",
      video: `${PUBLIC_URL}/Home/new_3.mp4`
    },
    {
      subtitle: "♥️🧡💛💚💙💜💗",
      title: <>SLIDE IN COLOR<br />SHADOW</>,
      desc: "สไลด์ปุ๊บ! เปิดโลกแห่งสีสันปั้บ! ในสไลด์เดียวเปิดโลกแห่งสีสัน ครบคอลเลคชั่นถึง 49 เฉดสี",
      video: `${PUBLIC_URL}/Home/new_4.mp4`
    }
  ];

  const personalSlides = [
    { bigImg: `${PUBLIC_URL}/Home/per_1.jpg`, productIds: [119, 53, 124, 125] },
    { bigImg: `${PUBLIC_URL}/Home/per_2.jpg`, productIds: [131, 134, 139, 55] },
    { bigImg: `${PUBLIC_URL}/Home/per_3.jpg`, productIds: [129, 4, 137, 12] },
    { bigImg: `${PUBLIC_URL}/Home/per_4.jpg`, productIds: [120, 136, 138, 57] },
  ];

  // ดึงจำนวนสินค้าใน cart จาก backend
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

  // Search: fetch results when query changes
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    fetch(`${API}/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      .then(r => r.json())
      .then(d => { setSearchResults(Array.isArray(d) ? d : (d.products || [])); setSearchLoading(false); })
      .catch(() => { setSearchResults([]); setSearchLoading(false); });
  }, [searchQuery]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  // --- Video Slider State ---
  const videoList = [
    `${PUBLIC_URL}/Home/slide_1.mp4`,
    `${PUBLIC_URL}/Home/slide_2.mp4`,
    `${PUBLIC_URL}/Home/slide_3.mp4`
  ];
  const [currentVideo, setCurrentVideo] = useState(0);
  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const mouseStartX = useRef(null);
  const isMouseDown = useRef(false);

  // Arrival slider — drag & video refs
  const videoRefs = useRef([]);
  const girlVideoRefs = useRef([]);
  const arrivalDragStart = useRef(null);
  const arrivalIsDragging = useRef(false);

  // Best slider — drag refs
  const bestDragStart = useRef(null);
  const bestIsDragging = useRef(false);

  // Girl slider — drag refs
  const girlDragStartX = useRef(null);
  const girlIsDragging = useRef(false);

  // Auto-advance to next video when ended
  const handleVideoEnded = () => {
    setCurrentVideo((prev) => (prev + 1) % videoList.length);
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentVideo((prev) => (prev - 1 + videoList.length) % videoList.length);
      } else {
        setCurrentVideo((prev) => (prev + 1) % videoList.length);
      }
    }
    touchStartX.current = null;
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
  };
  const handleMouseUp = (e) => {
    if (!isMouseDown.current || mouseStartX.current === null) return;
    const mouseEndX = e.clientX;
    const diff = mouseEndX - mouseStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentVideo((prev) => (prev - 1 + videoList.length) % videoList.length);
      } else {
        setCurrentVideo((prev) => (prev + 1) % videoList.length);
      }
    }
    isMouseDown.current = false;
    mouseStartX.current = null;
  };
  const handleMouseLeave = () => {
    isMouseDown.current = false;
    mouseStartX.current = null;
  };

  // Arrival slider — play/pause ตาม currentArrival และ auto-advance เมื่อวิดีโอจบ
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentArrival) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentArrival]);

  // ROM&ND Girl slider — play/pause ตาม currentGirl
  useEffect(() => {
    girlVideoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentGirl) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentGirl]);

  // Infinite loop: reset position silently when near edges
  useEffect(() => {
    const n = girlSlides.length;
    if (currentGirl >= 2 * n) {
      setGirlNoTransition(true);
      setCurrentGirl(p => p - n);
    } else if (currentGirl < n) {
      setGirlNoTransition(true);
      setCurrentGirl(p => p + n);
    }
  }, [currentGirl]);

  useEffect(() => {
    if (girlNoTransition) {
      const raf = requestAnimationFrame(() => setGirlNoTransition(false));
      return () => cancelAnimationFrame(raf);
    }
  }, [girlNoTransition]);

  // Arrival slider — mouse drag handlers
  const handleArrivalMouseDown = (e) => {
    arrivalIsDragging.current = true;
    arrivalDragStart.current = e.clientX;
  };
  const handleArrivalMouseUp = (e) => {
    if (!arrivalIsDragging.current) return;
    arrivalIsDragging.current = false;
    const diff = arrivalDragStart.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentArrival(i => (i + 1) % arrivalSlides.length);
      else setCurrentArrival(i => (i - 1 + arrivalSlides.length) % arrivalSlides.length);
    }
    arrivalDragStart.current = null;
  };
  const handleArrivalMouseLeave = () => {
    arrivalIsDragging.current = false;
    arrivalDragStart.current = null;
  };

  // Arrival slider — touch handlers
  const handleArrivalTouchStart = (e) => {
    arrivalDragStart.current = e.touches[0].clientX;
  };
  const handleArrivalTouchEnd = (e) => {
    if (arrivalDragStart.current === null) return;
    const diff = arrivalDragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentArrival(i => (i + 1) % arrivalSlides.length);
      else setCurrentArrival(i => (i - 1 + arrivalSlides.length) % arrivalSlides.length);
    }
    arrivalDragStart.current = null;
  };

  // Best slider — drag handlers
  const handleBestMouseDown = (e) => { bestIsDragging.current = true; bestDragStart.current = e.clientX; };
  const handleBestMouseUp = (e) => {
    if (!bestIsDragging.current) return;
    bestIsDragging.current = false;
    const diff = bestDragStart.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentBest(i => (i + 1) % bestsellers.length);
      else setCurrentBest(i => (i - 1 + bestsellers.length) % bestsellers.length);
    }
    bestDragStart.current = null;
  };
  const handleBestMouseLeave = () => { bestIsDragging.current = false; bestDragStart.current = null; };
  const handleBestTouchStart = (e) => { bestDragStart.current = e.touches[0].clientX; };
  const handleBestTouchEnd = (e) => {
    if (bestDragStart.current === null) return;
    const diff = bestDragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentBest(i => (i + 1) % bestsellers.length);
      else setCurrentBest(i => (i - 1 + bestsellers.length) % bestsellers.length);
    }
    bestDragStart.current = null;
  };

  // Girl slider — smooth drag handlers
  const handleGirlMouseDown = (e) => {
    girlIsDragging.current = true;
    girlDragStartX.current = e.clientX;
    setGirlDragging(true);
    e.preventDefault();
  };
  const handleGirlMouseMove = (e) => {
    if (!girlIsDragging.current) return;
    setGirlDragOffset(e.clientX - girlDragStartX.current);
  };
  const handleGirlMouseUp = (e) => {
    if (!girlIsDragging.current) return;
    girlIsDragging.current = false;
    setGirlDragging(false);
    const diff = girlDragStartX.current - e.clientX;
    const slideW = window.innerWidth * 0.20;
    if (Math.abs(diff) > slideW * 0.25) {
      if (diff > 0) setCurrentGirl(i => i + 1);
      else setCurrentGirl(i => i - 1);
    }
    setGirlDragOffset(0);
    girlDragStartX.current = null;
  };
  const handleGirlMouseLeave = () => {
    if (!girlIsDragging.current) return;
    girlIsDragging.current = false;
    setGirlDragging(false);
    setGirlDragOffset(0);
    girlDragStartX.current = null;
  };
  const handleGirlTouchStart = (e) => { girlDragStartX.current = e.touches[0].clientX; };
  const handleGirlTouchEnd = (e) => {
    if (girlDragStartX.current === null) return;
    const diff = girlDragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setCurrentGirl(i => i + 1);
      else setCurrentGirl(i => i - 1);
    }
    girlDragStartX.current = null;
  };

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
    fetch(`${API}/api/bestseller`)
      .then(res => res.json())
      .then(result => setBestsellers(Array.isArray(result.data) ? result.data : []))
      .catch(() => setBestsellers([]));

    // Fetch personal color products
    const allPersonalIds = [...new Set(personalSlides.flatMap(s => s.productIds))];
    Promise.all(
      allPersonalIds.map(id =>
        fetch(`${API}/api/best/${id}`)
          .then(r => r.json())
          .catch(() => null)
      )
    ).then(results => {
      const map = {};
      results.forEach(p => { if (p && p.Product_id) map[p.Product_id] = p; });
      setPersonalProducts(map);
    });

    // Fetch girl slide products
    const allIds = [...new Set(girlSlides.flatMap(s => s.productIds))];
    Promise.all(
      allIds.map(id =>
        fetch(`${API}/api/best/${id}`)
          .then(r => r.json())
          .catch(() => null)
      )
    ).then(results => {
      const map = {};
      results.forEach(p => { if (p && p.Product_id) map[p.Product_id] = p; });
      setGirlProducts(map);
    });
  }, []);

  // Announcement auto-slide
  useEffect(() => {
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
          <span style={{cursor:'pointer'}} onClick={() => window.location.href='/auth'}>REGISTER</span>
          <span className="divider">|</span>
          <span style={{cursor:'pointer'}} onClick={() => window.location.href='/auth'}>LOGIN</span>
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
            <li style={{cursor:'pointer'}} onClick={() => navigate('/new')}>NEW</li>
						<li style={{cursor:'pointer'}} onClick={() => navigate('/face')}>FACE</li>
						<li style={{cursor:'pointer'}} onClick={() => navigate('/eye')}>EYE</li>
						<li style={{cursor:'pointer'}} onClick={() => navigate('/lip')}>LIP</li>
						<li style={{cursor:'pointer'}} onClick={() => navigate('/cheek')}>CHEEK</li>
          </ul>
          <li className="title">ABOUT US</li>
          <li className="title">CATALOG</li>
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
          <div ref={searchRef} style={{ position: 'relative' }}>
            <form className={`search-form${searchOpen ? ' active-search' : ''}`} onSubmit={e => e.preventDefault()}>
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                className="search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus={searchOpen}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    navigate(`/best1/${searchResults[0].Product_id}`);
                    setSearchOpen(false); setSearchQuery(''); setSearchResults([]);
                  }
                }}
              />
              <button className="search-button icon-link" type="button" onClick={() => { setSearchOpen(o => !o); if (searchOpen) { setSearchQuery(""); setSearchResults([]); } }}>
                {searchOpen
                  ? <i className="fa-solid fa-xmark" style={{ fontSize: 18, color: '#333' }}></i>
                  : <svg className="search-icon svg-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                }
              </button>
            </form>
            {searchOpen && (searchQuery.trim()) && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '320px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.13)', zIndex: 9999, maxHeight: '360px', overflowY: 'auto', padding: '8px 0' }}>
                {searchLoading && <div style={{ padding: '16px', textAlign: 'center', color: '#999', fontSize: 14 }}>กำลังค้นหา...</div>}
                {!searchLoading && searchResults.length === 0 && <div style={{ padding: '16px', textAlign: 'center', color: '#999', fontSize: 14 }}>ไม่พบสินค้า</div>}
                {!searchLoading && searchResults.map(p => (
                  <div key={p.Product_id} onClick={() => { navigate(`/best1/${p.Product_id}`); setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', cursor: 'pointer', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <img src={p.Product_image ? `${API}/uploads/${p.Product_image}` : '/placeholder.png'} alt={p.Product_name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid #eee' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.Product_name}</div>
                      <div style={{ fontSize: 12.5, color: '#e05c8a', marginTop: 2 }}>฿{Number(p.Product_price).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </span>
        </div>
      </header>

      {/* Slider */}
      <div className="slider-container" style={{ width: '100vw', maxWidth: '100%', overflow: 'hidden', margin: '0 auto', borderRadius: '0' }}>
        <div
          className="slider-track"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'relative',
            width: '100vw',
            maxWidth: '1400px',
            height: '420px',
            margin: '0 auto',
            userSelect: 'none',
            cursor: 'grab',
            overflow: 'hidden',
            display: 'block',
          }}
        >
          {videoList.map((src, idx) => (
            <video
              key={idx}
              autoPlay={currentVideo === idx}
              muted
              playsInline
              className="slide-video"
              onEnded={handleVideoEnded}
              style={{
                width: '100%',
                height: '420px',
                objectFit: 'cover',
                borderRadius: '0',
                background: 'transparent',
                display: currentVideo === idx ? 'block' : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: currentVideo === idx ? 1 : 0,
                transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
                zIndex: currentVideo === idx ? 2 : 1,
              }}
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
        <div className="slider-dots" style={{ textAlign: 'center', marginTop: '8px' }}>
          {videoList.map((_, idx) => (
            <span
              key={idx}
              className={`dot${currentVideo === idx ? ' active' : ''}`}
              data-slide-index={idx}
              onClick={() => setCurrentVideo(idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
      </div>

      {/* Product Categories Section */}
      <section className="product-categories-section">
        <div className="category-grid" id="categoryGrid">
          {categories.length > 0 ? (
            categories.map(type => {
              const routeMap = {
                BEST: '/bestsellerform',
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

      {/* Best Seller Section */}
      <section className="section-header-best-seller">
        <div className="header-container-best-seller">
          <h2 className="title-best-seller">BEST SELLER</h2>
          <span className="plus-icon" style={{cursor:'pointer'}} onClick={() => window.location.href='/bestsellerform'}>+</span>
        </div> 
      </section>
      <section className="best-seller-feature-section">
        <div className="feature-slider-container">
          <button
            className="feature-control prev-feature"
            aria-label="Previous"
            onClick={() => setCurrentBest(i => (i - 1 + Math.max(bestsellers.length, 1)) % Math.max(bestsellers.length, 1))}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="feature-control next-feature"
            aria-label="Next"
            onClick={() => setCurrentBest(i => (i + 1) % Math.max(bestsellers.length, 1))}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
          </button>

          {bestsellers.length > 0 ? (
            <div
              className="best-seller-slides-wrapper"
              style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentBest * 100}%)`, height: '100%', cursor: 'grab' }}
              onMouseDown={handleBestMouseDown}
              onMouseUp={handleBestMouseUp}
              onMouseLeave={handleBestMouseLeave}
              onTouchStart={handleBestTouchStart}
              onTouchEnd={handleBestTouchEnd}
            >
              {bestsellers.map((product, idx) => (
                <div className="best-seller-slide" key={product.Product_id} style={{ minWidth: '100%' }}>
                  <div className="best-slide-left">
                    <img
                      src={product.Image ? (product.Image.startsWith('http') ? product.Image : `${API}/uploads/${product.Image}`) : 'https://via.placeholder.com/600x600?text=No+Image'}
                      alt={product.Product_name}
                    />
                  </div>
                  <div className="best-slide-right">
                    <p className="best-slide-rank"># {idx + 1} BEST SELLER</p>
                    <h2 className="best-slide-name">{product.Product_name}</h2>
                    <p className="best-slide-price">{product.Product_price}฿</p>
                    <a href="/bestsellerform" className="feature-shop-btn">SHOP NOW</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: '#aaa' }}>ไม่มีสินค้า Best Seller</div>
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="header-section-new-arrivals">
        <div className="header-container-new-arrivals">
          <span className="plus-icon-new-arrivals">+</span>
          <h2 className="title-new-arrivals">NEW ARRIVALS</h2>
        </div>
      </section>

      {/* Product Video Feature Section */}
      <section className="product-video-feature-section">
        <div className="feature-slider-container">
          <button
            className="feature-control prev-feature"
            aria-label="Previous Item"
            onClick={() => setCurrentArrival(i => (i - 1 + arrivalSlides.length) % arrivalSlides.length)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="feature-control next-feature"
            aria-label="Next Item"
            onClick={() => setCurrentArrival(i => (i + 1) % arrivalSlides.length)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
          </button>
          <div
            className="feature-slides-wrapper"
            style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentArrival * 100}%)`, width: '100%', cursor: 'grab' }}
            onMouseDown={handleArrivalMouseDown}
            onMouseUp={handleArrivalMouseUp}
            onMouseLeave={handleArrivalMouseLeave}
            onTouchStart={handleArrivalTouchStart}
            onTouchEnd={handleArrivalTouchEnd}
          >
            {arrivalSlides.map((slide, idx) => (
              <div className="product-feature-slide" key={idx} style={{ minWidth: '100%' }}>
                <div className="feature-content-left">
                  <p className="feature-subtitle">{slide.subtitle}</p>
                  <h2 className="feature-title">{slide.title}</h2>
                  <p className="feature-description">{slide.desc}</p>
                  <a href="/new" className="feature-shop-btn">SHOP NOW</a>
                </div>
                <div className="feature-video-right">
                  <video
                    ref={el => videoRefs.current[idx] = el}
                    src={slide.video}
                    muted
                    playsInline
                    className="feature-video"
                    onEnded={() => setCurrentArrival(i => (i + 1) % arrivalSlides.length)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Color Slider Section */}
      <section className="header-section-romand-pick">
        <div className="header-container-romand-pick">
          <h2 className="title-romand-pick">ROM&ND PERSONAL COLOR</h2>
        </div>
      </section>
      <div className="personal-color-slider-container">
        <button
          className="personal-control prev-personal"
          aria-label="Previous"
          onClick={() => setCurrentPersonal(i => (i - 1 + personalSlides.length) % personalSlides.length)}
        >‹</button>
        <div className="personal-color-slides" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentPersonal * 100}%)` }}>
            {personalSlides.map((slide, idx) => (
              <div className="personal-color-slide" key={idx} style={{ minWidth: '100%' }}>
                <div className="personal-hero-image">
                  <img src={slide.bigImg} alt={`Personal Color ${idx + 1}`} />
                </div>
                <div className="personal-products-grid">
                  {slide.productIds.map((pid) => {
                    const p = personalProducts[pid];
                    if (!p) return null;
                    return (
                      <div className="personal-product-card" key={pid} style={{cursor:'pointer'}} onClick={() => { window.scrollTo(0,0); navigate('/best1/' + pid); }}>
                        <div className="personal-product-card-img-wrap">
                          <img src={`${API}/uploads/${p.Image}`} alt={p.Product_name} />
                          <div className="personal-product-card-overlay" />
                        </div>
                        <div className="personal-product-card-info">
                          <p className="personal-product-name">{p.Product_name}</p>
                          <div className="personal-product-price">
                            <span className="personal-product-price-val">{Number(p.Product_price).toLocaleString('th-TH', { minimumFractionDigits: 0 })}฿</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="personal-control next-personal"
          aria-label="Next"
          onClick={() => setCurrentPersonal(i => (i + 1) % personalSlides.length)}
        >›</button>
      </div>

      {/* WITH OUR ROM&ND GIRL Section */}
      <section className="romand-girl-section">
        <div className="romand-girl-header">
          <h2 className="romand-girl-title">WITH OUR ROM&amp;ND GIRL</h2>
        </div>
        <div className="romand-girl-outer"
          onMouseDown={handleGirlMouseDown}
          onMouseMove={handleGirlMouseMove}
          onMouseUp={handleGirlMouseUp}
          onMouseLeave={handleGirlMouseLeave}
          onTouchStart={handleGirlTouchStart}
          onTouchEnd={handleGirlTouchEnd}
          style={{ cursor: girlDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="romand-girl-track"
            style={{
              transform: `translateX(calc(50vw - 10vw - ${currentGirl * 20}vw + ${girlDragOffset}px))`,
              transition: (girlDragging || girlNoTransition) ? 'none' : 'transform 0.45s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            {loopedGirlSlides.map((slide, idx) => (
              <div className={`romand-girl-slide${currentGirl === idx ? ' active' : ''}`} key={idx}>
                <div className="romand-girl-video-wrapper">
                  <video
                    ref={el => girlVideoRefs.current[idx] = el}
                    src={slide.video}
                    muted
                    playsInline
                    loop
                    className="romand-girl-video"
                  />
                </div>
                {(() => {
                  const realIdx = idx % girlSlides.length;
                  const pIds = slide.productIds.filter(pid => girlProducts[pid]);
                  if (pIds.length === 0) return null;
                  const activeP = girlProductIdx[realIdx] || 0;
                  const pid = pIds[activeP];
                  const p = girlProducts[pid];
                  return (
                    <div className="romand-girl-mini-carousel">
                      <div className="romand-girl-product-card" onClick={() => navigate(`/best1/${pid}`)} style={{cursor:'pointer'}}>
                        <img src={p.Image ? `${API}/uploads/${p.Image.replace(/^uploads[\/]/, '')}` : '/placeholder.png'} alt={p.Product_name} className="romand-girl-product-img" />
                        <div className="romand-girl-product-info">
                          <span className="romand-girl-product-name">{p.Product_name}</span>
                          <div className="romand-girl-product-price">
                            <span className="romand-girl-sale-price">{Number(p.Product_price).toFixed(2)} ฿</span>
                          </div>
                        </div>
                        <button className="romand-girl-cart-btn" onClick={e => addToGirlCart(e, p)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        </button>
                      </div>
                      {pIds.length > 1 && (
                        <div className="romand-girl-mini-nav">
                          <button className="romand-girl-mini-arrow" onClick={e => { e.stopPropagation(); setGirlProductIdx(prev => ({...prev, [realIdx]: (activeP - 1 + pIds.length) % pIds.length})); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                          </button>
                          <div className="romand-girl-mini-dots">
                            {pIds.map((_, di) => (
                              <span key={di} className={`romand-girl-mini-dot${di === activeP ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setGirlProductIdx(prev => ({...prev, [realIdx]: di})); }} />
                            ))}
                          </div>
                          <button className="romand-girl-mini-arrow" onClick={e => { e.stopPropagation(); setGirlProductIdx(prev => ({...prev, [realIdx]: (activeP + 1) % pIds.length})); }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
        <div className="romand-girl-dots">
          {girlSlides.map((_, idx) => (
            <span
              key={idx}
              className={`dot${(currentGirl % girlSlides.length) === idx ? ' active' : ''}`}
              onClick={() => setCurrentGirl(girlSlides.length + idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <div className="banner-container">
          {/* About Us */}
          <div className="flip-card" onClick={() => navigate('/about')} style={{cursor:'pointer'}}>
            <div className="flip-card-inner">
              <div className="flip-card-front" style={{ backgroundImage: `url('${PUBLIC_URL}/Home/aboutme.webp')` }}>
                <div className="flip-card-overlay">
                  <h3 className="flip-card-title">ABOUT US</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>ABOUT ROM&amp;ND</h3>
                <p>ROM&amp;ND เป็นแบรนด์เมคอัพเกาหลีที่มุ่งมั่นสร้างสรรค์ผลิตภัณฑ์ที่ช่วยให้ทุกคนรู้สึกสวยงามในแบบของตัวเอง ด้วยสีสันที่หลากหลายและฟอร์มูล่าคุณภาพสูง</p>
                <a href="/about" className="flip-btn">อ่านเพิ่มเติม</a>
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div className="flip-card" onClick={() => navigate('/bestsellerform')} style={{cursor:'pointer'}}>
            <div className="flip-card-inner">
              <div className="flip-card-front" style={{ backgroundImage: `url('${PUBLIC_URL}/Home/product_catalog.jpg')` }}>
                <div className="flip-card-overlay">
                  <h3 className="flip-card-title">ROM&amp;ND CATALOG</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>CATALOG 2025</h3>
                <p>ค้นพบคอลเลกชันล่าสุดของเรา ครอบคลุมทุกหมวดหมู่ตั้งแต่ลิปสติก อายแชโดว์ บลัช ไปจนถึงสกินแคร์ ครบครันในที่เดียว</p>
                <a href="/products" className="flip-btn">ดูแคตตาล็อก</a>
              </div>
            </div>
          </div>

          {/* Instagram */}
          <div className="flip-card" onClick={() => window.open('https://www.instagram.com/romandofficial_th', '_blank')} style={{cursor:'pointer'}}>
            <div className="flip-card-inner">
              <div className="flip-card-front" style={{ backgroundImage: `url('${PUBLIC_URL}/Home/instagram.jpg')` }}>
                <div className="flip-card-overlay">
                  <h3 className="flip-card-title">INSTAGRAM</h3>
                </div>
              </div>
              <div className="flip-card-back">
                <h3>@romandofficial_th</h3>
                <p>ติดตามเราบน Instagram เพื่อรับข่าวสารล่าสุด แรงบันดาลใจการแต่งหน้า และโปรโมชั่นพิเศษก่อนใคร</p>
                <a href="https://www.instagram.com/romandofficial_th" target="_blank" rel="noreferrer" className="flip-btn">ติดตามเลย</a>
              </div>
            </div>
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
    </>
  );
}

export default Home;
