let currentCategory = 'all';
const newsContainer = document.getElementById('newsContainer');
const sectionTitle = document.getElementById('sectionTitle');

// قائمة الجوال
document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('mainNav').classList.toggle('active');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// صندوق البحث
document.getElementById('searchToggle').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('searchBox').classList.toggle('active');
});

// زر العودة للأعلى
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// تحميل الأخبار
function loadNews(category = 'all') {
    let query = db.collection('news')
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc');
    
    if (category !== 'all') {
        query = query.where('category', '==', category);
    }
    
    query.get().then((snapshot) => {
        if (snapshot.empty) {
            newsContainer.innerHTML = '<p class="no-news">لا توجد أخبار</p>';
            return;
        }
        
        let html = '';
        let featuredNews = [];
        
        snapshot.forEach((doc) => {
            const news = doc.data();
            const newsId = doc.id;
            
            html += `
                <article class="news-card">
                    <div class="card-image">
                        <img src="${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/800x400?text=صورة'">
                        <span class="category-tag ${news.category}">${news.category}</span>
                    </div>
                    <div class="card-content">
                        <h3><a href="article.html?id=${newsId}">${news.title}</a></h3>
                        <p class="excerpt">${news.excerpt}</p>
                        <a href="article.html?id=${newsId}" class="read-more">اقرأ المزيد <i class="fas fa-arrow-left"></i></a>
                    </div>
                </article>
            `;
            
            if (featuredNews.length < 3) {
                featuredNews.push({...news, id: newsId});
            }
        });
        
        newsContainer.innerHTML = html;
        
        if (category === 'all') {
            displaySlider(featuredNews);
        }
    }).catch((error) => {
        newsContainer.innerHTML = '<p class="error">حدث خطأ في تحميل الأخبار</p>';
    });
}

// عرض السلايدر
function displaySlider(news) {
    const heroSlider = document.getElementById('heroSlider');
    const sliderMain = document.getElementById('sliderMain');
    
    if (!heroSlider || !sliderMain || news.length === 0) return;
    
    heroSlider.style.display = 'block';
    sliderMain.innerHTML = '';
    
    news.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="slide-content">
                <span class="category-tag ${item.category}">${item.category}</span>
                <h2><a href="article.html?id=${item.id}">${item.title}</a></h2>
            </div>
        `;
        sliderMain.appendChild(slide);
    });
    
    let currentSlide = 0;
    setInterval(() => {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// الفلترة حسب القسم
function filterByCategory(category) {
    currentCategory = category;
    sectionTitle.innerHTML = `${category} <span class="header-line"></span>`;
    loadNews(category);
}

// البحث
function searchNews() {
    const query = document.getElementById('searchInput').value.trim();
    if (query.length < 2) return;
    
    db.collection('news').where('status', '==', 'published').get().then((snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
            const news = doc.data();
            if (news.title.includes(query) || news.content.includes(query)) {
                results.push({...news, id: doc.id});
            }
        });
        
        if (results.length === 0) {
            newsContainer.innerHTML = '<p class="no-news">لا توجد نتائج</p>';
        } else {
            sectionTitle.innerHTML = `نتائج البحث عن: ${query} <span class="header-line"></span>`;
            let html = '';
            results.forEach((news) => {
                html += `
                    <article class="news-card">
                        <div class="card-image">
                            <img src="${news.image}" alt="${news.title}">
                            <span class="category-tag ${news.category}">${news.category}</span>
                        </div>
                        <div class="card-content">
                            <h3><a href="article.html?id=${news.id}">${news.title}</a></h3>
                            <p class="excerpt">${news.excerpt}</p>
                            <a href="article.html?id=${news.id}" class="read-more">اقرأ المزيد</a>
                        </div>
                    </article>
                `;
            });
            newsContainer.innerHTML = html;
        }
    });
}

// تحميل الأخبار عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

// جعل الدوال عامة
window.filterByCategory = filterByCategory;
window.searchNews = searchNews;