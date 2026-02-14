// เพิ่มที่บรรทัดแรกของไฟล์ JS
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu: เปิดเมนูเมื่อคลิก
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', openMenu);
    }
});

function openMenu() {
    document.getElementById('sideMenu').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeMenu() {
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// ปิดเมนูด้วยปุ่ม X
document.getElementById('closeMenu').addEventListener('click', closeMenu);

// ปิดเมนูเมื่อคลิกที่ overlay
document.getElementById('overlay').addEventListener('click', closeMenu);

// Toggle submenu SHOP ALL
const shopAllHeader = document.getElementById('shopAllHeader');
const submenu = document.getElementById('submenu');
const toggleIcon = document.getElementById('toggleIcon');

shopAllHeader.addEventListener('click', () => {
    submenu.classList.toggle('active');
    toggleIcon.classList.toggle('active');
});

// ============ Personal Color Slider ============
document.addEventListener('DOMContentLoaded', function() {
    const personalSlides = document.querySelectorAll('.personal-color-slide');
    const prevPersonalBtn = document.querySelector('.prev-personal');
    const nextPersonalBtn = document.querySelector('.next-personal');
    let currentPersonal = 0;

    function showPersonalSlide(idx) {
        personalSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
        currentPersonal = idx;
    }

    function nextPersonalSlide() {
        let nextIdx = (currentPersonal + 1) % personalSlides.length;
        showPersonalSlide(nextIdx);
    }

    function prevPersonalSlide() {
        let prevIdx = (currentPersonal - 1 + personalSlides.length) % personalSlides.length;
        showPersonalSlide(prevIdx);
    }

    if (nextPersonalBtn) nextPersonalBtn.addEventListener('click', nextPersonalSlide);
    if (prevPersonalBtn) prevPersonalBtn.addEventListener('click', prevPersonalSlide);


    // Show first slide
    showPersonalSlide(0);
});
// ============ Load Best Seller from API (array -> build slider) ============
async function loadBestSeller() {
    try {
        const response = await fetch('http://localhost:5000/api/bestseller');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const payload = await response.json();
        const products = payload && payload.data ? payload.data : (Array.isArray(payload) ? payload : []);
        console.log('Best seller data:', products);

        const bestSellerContent = document.querySelector('.best-seller-feature-section');
        if (!bestSellerContent) return;

        if (!products || products.length === 0) {
            bestSellerContent.innerHTML = '<p>ไม่มีสินค้า Bestseller </p>';
            return;
        }

        // สร้าง slides, controls และ dots
        const slidesHtml = products.map((product, idx) => {
            const imageUrl = product.Image && (product.Image.startsWith('http') || product.Image.startsWith('/'))
                ? product.Image
                : `http://localhost:5000/uploads/${product.Image}`;

            return `
                <div class="feature-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                    <div class="column left-col video-media-col">
                        <img src="${imageUrl}" alt="${product.Product_name}" class="feature-video product-single-image" onerror="this.src='https://via.placeholder.com/600x600?text=No+Image'">
                    </div>
                    <div class="column right-col video-info-col">
                        <div class="video-info-content">
                            <h4 class="video-product-subtitle">BEST SELLER</h4>
                            <h3 class="video-product-title">${product.Product_name}</h3>
                            <p class="video-product-desc">${product.Product_detail || ''}</p>
                            <a href="${product.Product_name === 'Better than contour' ? '/best1' : '#shop-now'}" class="shop-now-button">SHOP NOW</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('\n');

        const dotsHtml = products.map((_, idx) => `<span class="dot-feature ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`).join('');

        bestSellerContent.innerHTML = `
            <div class="feature-slider-container">
                <button class="feature-control prev-feature" aria-label="Previous">‹</button>
                <div class="feature-slides">${slidesHtml}</div>
                <button class="feature-control next-feature" aria-label="Next">›</button>
                <div class="feature-dots">${dotsHtml}</div>
            </div>
        `;

        // หลังจากสร้าง DOM แล้ว ให้เชื่อมตัวแปรและ listeners แบบปลอดภัย
        initFeatureSlider();

    } catch (error) {
        console.error('Error loading best seller:', error);
    }
}

// เรียก loadBestSeller เมื่อหน้า load เสร็จ
document.addEventListener('DOMContentLoaded', loadBestSeller);

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
    
    // ตั้งให้วิดีโอเล่นอัตโนมัติเมื่อ slide active
    const video = slides[index].querySelector('.slide-video');
    if (video) {
        video.currentTime = 0; // เริ่มต้นวิดีโอใหม่
        video.play();
    }
}

function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
}

function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

// เมื่อวิดีโอเล่นจบให้เปลี่ยน slide
document.querySelectorAll('.slide-video').forEach((video, index) => {
    video.addEventListener('ended', () => {
        nextSlide();
    }, { once: false });
    video.play().catch(err => {});
});

dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.slideIndex);
        showSlide(index);
    });
});
// Drag/Swipe เพื่อเลื่อน slide
let startX = 0;
let endX = 0;
const sliderContainer = document.querySelector('.slider-container');

sliderContainer.addEventListener('mousedown', (e) => {
    startX = e.clientX;
});

sliderContainer.addEventListener('mouseup', (e) => {
    endX = e.clientX;
    
    const diff = startX - endX;
    const threshold = 50; // ระยะขั้นต่ำในการลาก
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            nextSlide(); // ลากซ้าย → ไปข้างหน้า
        } else {
            prevSlide(); // ลากขวา → ไปข้างหลัง
        }
    }
});

// ============ Feature Slider (NEW ARRIVALS) ============
const arrivalSlides = document.querySelectorAll('.arrival-slide');
const prevFeatureButton = document.querySelector('.prev-feature');
const nextFeatureButton = document.querySelector('.next-feature');
let currentArrivalSlide = 0;

function showArrivalSlide(index) {
    arrivalSlides.forEach(slide => slide.classList.remove('active'));
    arrivalSlides[index].classList.add('active');
    currentArrivalSlide = index;
    
    // Play video เมื่อ slide active
    const video = arrivalSlides[index].querySelector('.feature-video');
    if (video) {
        video.currentTime = 0;
        video.play();
    }
}

function nextArrivalSlide() {
    let nextIndex = (currentArrivalSlide + 1) % arrivalSlides.length;
    showArrivalSlide(nextIndex);
}

function prevArrivalSlide() {
    let prevIndex = (currentArrivalSlide - 1 + arrivalSlides.length) % arrivalSlides.length;
    showArrivalSlide(prevIndex);
}

// Event listeners สำหรับปุ่มควบคุม
if (nextFeatureButton) nextFeatureButton.addEventListener('click', nextArrivalSlide);
if (prevFeatureButton) prevFeatureButton.addEventListener('click', prevArrivalSlide);

// Drag/Swipe สำหรับ Arrival Slider - ใช้ document level events
let arrivalStartX = 0;
let arrivalEndX = 0;
let isDraggingArrival = false;
const arrivalContainer = document.querySelector('.feature-slider-container');

if (arrivalContainer) {
    arrivalContainer.addEventListener('mousedown', (e) => {
        isDraggingArrival = true;
        arrivalStartX = e.clientX;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingArrival) return;
        arrivalEndX = e.clientX;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDraggingArrival) return;
        isDraggingArrival = false;
        
        const diff = arrivalStartX - arrivalEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextArrivalSlide();
            } else {
                prevArrivalSlide();
            }
        }
    });
}

// Auto-advance เมื่อ video จบ
arrivalSlides.forEach((slide, index) => {
    const video = slide.querySelector('.feature-video');
    if (video) {
        video.addEventListener('ended', () => {
            // ถ้า slide นี้เป็น slide ที่ active อยู่ ให้เลื่อนไป slide ถัดไป
            if (index === currentArrivalSlide) {
                nextArrivalSlide();
            }
        });
    }
});

const searchForm = document.querySelector('.search-form');
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');

console.log('searchForm:', searchForm);
console.log('searchButton:', searchButton);
console.log('searchInput:', searchInput);

// เปิด/ปิดเมื่อคลิกปุ่มค้นหา
if (searchButton) {
    searchButton.addEventListener('click', (e) => {
        console.log('Search button clicked!');
        e.preventDefault();
        e.stopPropagation(); // กัน event หลุดไป document

        searchForm.classList.toggle('active-search');

        if (searchForm.classList.contains('active-search')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
    }
});
}

// กด Enter เพื่อค้นหา
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();

        const text = searchInput.value.trim();
        if (text) console.log("ค้นหา:", text);

        searchForm.classList.remove('active-search');
        searchInput.value = '';
        searchInput.blur();
    }
});

// ปิดเมื่อคลิกข้างนอก
document.addEventListener('click', (e) => {
    // ถ้าคลิกใน form → ไม่ปิด
    if (searchForm.contains(e.target)) return;

    // ถ้าคลิกนอก form → ปิด
    searchForm.classList.remove('active-search');
    searchInput.value = '';
});


// ฟังก์ชันช่วยเริ่มสไลเดอร์อย่างปลอดภัยหลังสร้าง DOM
function initFeatureSlider(root = document) {
    const featureSlides = root.querySelectorAll('.feature-slide');
    const featureDots = root.querySelectorAll('.dot-feature');
    const prevFeatureButton = root.querySelector('.prev-feature');
    const nextFeatureButton = root.querySelector('.next-feature');

    if (!featureSlides || featureSlides.length === 0) return;

    let currentFeatureSlide = 0;

    function showFeatureSlide(index) {
        if (!featureSlides || featureSlides.length === 0) return;
        if (typeof index !== 'number' || index < 0 || index >= featureSlides.length) index = 0;

        featureSlides.forEach(slide => slide.classList.remove('active'));
        if (featureDots && featureDots.length) featureDots.forEach(dot => dot.classList.remove('active'));

        const slide = featureSlides[index];
        if (slide) slide.classList.add('active');
        if (featureDots && featureDots[index]) featureDots[index].classList.add('active');

        currentFeatureSlide = index;
    }

    function nextFeatureSlide() {
        let nextIndex = (currentFeatureSlide + 1) % featureSlides.length;
        showFeatureSlide(nextIndex);
    }

    function prevFeatureSlide() {
        let prevIndex = (currentFeatureSlide - 1 + featureSlides.length) % featureSlides.length;
        showFeatureSlide(prevIndex);
    }

    if (nextFeatureButton) nextFeatureButton.addEventListener('click', nextFeatureSlide);
    if (prevFeatureButton) prevFeatureButton.addEventListener('click', prevFeatureSlide);

    if (featureDots && featureDots.length) {
        featureDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index || e.target.getAttribute('data-index'));
                if (!isNaN(index)) showFeatureSlide(index);
            });
        });
    }

    // ตั้ง slide เริ่มต้น
    showFeatureSlide(0);

    // Drag / Touch support for sliding (mouse and touch swipe)
    const container = root.querySelector('.feature-slider-container') || document.querySelector('.feature-slider-container');
    if (container) {
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        const threshold = 50; // px required to count as swipe

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            currentX = startX;
            container.classList.add('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            container.classList.remove('dragging');
            const diff = startX - currentX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextFeatureSlide();
                } else {
                    prevFeatureSlide();
                }
            }
            startX = 0; currentX = 0;
        });

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            isDragging = true;
            startX = e.touches[0].clientX;
            currentX = startX;
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging || !e.touches || e.touches.length === 0) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - currentX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) nextFeatureSlide(); else prevFeatureSlide();
            }
            startX = 0; currentX = 0;
        });
    }
}

// ดึงข้อมูลประเภทสินค้าและสร้าง category-item
// ต้องรันหลัง DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', async function() {
    const grid = document.getElementById('categoryGrid');
    if (grid) {
        try {
            const res = await fetch('http://localhost:5000/api/categories');
            const types = await res.json();
            grid.innerHTML = types.map(type => `
                <a href="${type.Type_name === 'rom&nd X Zo^Friends' ? '/bestseller1' : '#' + type.Type_name}" class="category-item">
                    <div class="category-image-wrapper">
                        <img src="${type.Type_pic}" alt="${type.Type_name}">
                    </div>
                    <p class="category-name">${type.Type_name}</p>
                </a>
            `).join('');
        } catch (err) {
            grid.innerHTML = '<p>โหลดข้อมูลประเภทสินค้าไม่สำเร็จ</p>';
        }
    }
});