// ================================================
// 🤖 سكريبت الأخبار التلقائي - أبو السعد للاخبار
// ================================================
// المتطلبات: Node.js مثبت على جهازك
// تشغيل مرة واحدة: node auto-news.js
// تشغيل كل ساعة تلقائياً: node auto-news.js --auto
// ================================================

const https = require('https');

// ============================
// ⚙️ الإعدادات - عدّلها هنا
// ============================
const CONFIG = {
  NEWS_API_KEY: '656b1a0c41ef4c669992ba209ae77cd2',
  FIREBASE_PROJECT_ID: 'abu-el-saad-news',
  FIREBASE_API_KEY: 'AIzaSyBiLnQKblUsRxmz6rUWAb7RpbFUakeWX_E',
  
  // كم خبر تجيب كل مرة (أقصى 10 في الخطة المجانية)
  MAX_NEWS: 10,
  
  // كل كام دقيقة تتحدث الأخبار (لو شغّلت --auto)
  INTERVAL_MINUTES: 60,
};

// ============================
// 🗺️ خريطة التصنيفات
// ============================
const CATEGORY_MAP = {
  'politics': 'سياسة',
  'sport': 'رياضة',
  'sports': 'رياضة',
  'technology': 'تكنولوجيا',
  'science': 'تكنولوجيا',
  'business': 'اقتصاد',
  'economy': 'اقتصاد',
  'entertainment': 'فن',
  'health': 'صحة',
  'general': 'عام',
};

// ============================
// 🔧 دوال مساعدة
// ============================

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('فشل تحليل الرد: ' + data.substring(0, 100))); }
      });
    }).on('error', reject);
  });
}

function httpsPost(hostname, path, data, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(responseData)); }
        catch (e) { reject(new Error('فشل تحليل رد Firebase')); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpsPatch(hostname, path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname,
      path,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(responseData)); }
        catch (e) { reject(new Error('فشل تحليل رد Firebase PATCH')); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ============================
// 📰 جلب الأخبار من NewsAPI
// ============================
async function fetchEgyptianNews() {
  console.log('\n📡 جاري جلب الأخبار المصرية من NewsAPI...');

  // جلب أخبار مصر بالعربي
  const url = `https://newsapi.org/v2/top-headlines?country=eg&pageSize=${CONFIG.MAX_NEWS}&apiKey=${CONFIG.NEWS_API_KEY}`;

  const result = await httpsGet(url);

  if (result.status !== 'ok') {
    throw new Error('خطأ من NewsAPI: ' + (result.message || result.status));
  }

  const articles = result.articles.filter(a =>
    a.title && a.title !== '[Removed]' &&
    a.description && a.description !== '[Removed]'
  );

  console.log(`✅ تم جلب ${articles.length} خبر`);
  return articles;
}

// ============================
// 🔍 التحقق من وجود الخبر مسبقاً
// ============================
async function checkNewsExists(title) {
  try {
    const encodedQuery = encodeURIComponent(JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'news' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'sourceTitle' },
            op: 'EQUAL',
            value: { stringValue: title }
          }
        },
        limit: 1
      }
    }));

    // نستخدم طريقة أبسط: نجيب آخر 50 خبر ونتحقق
    return false; // سنتحقق بطريقة أخرى لاحقاً
  } catch (e) {
    return false;
  }
}

// ============================
// 🔥 حفظ الخبر في Firebase
// ============================
async function saveToFirebase(article, existingTitles) {

  // تجاهل الأخبار المكررة
  if (existingTitles.has(article.title)) {
    console.log(`⏭️  مكرر، تم تجاهله: ${article.title.substring(0, 50)}...`);
    return false;
  }

  // تحديد التصنيف
  const sourceName = (article.source?.name || '').toLowerCase();
  let category = 'عام';
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (sourceName.includes(key)) { category = val; break; }
  }

  // بناء محتوى المقال
  const content = `
    <p>${article.description || ''}</p>
    ${article.content ? `<p>${article.content.replace(/\[\+\d+ chars\]/, '').trim()}</p>` : ''}
    <p style="color: #888; font-size: 0.9rem; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
      المصدر: ${article.source?.name || 'NewsAPI'} | 
      <a href="${article.url}" target="_blank" rel="nofollow" style="color: #C49A6C;">اقرأ الخبر الأصلي</a>
    </p>
  `.trim();

  // بناء الـ document بنفس structure موقعك
  const newsDoc = {
    fields: {
      title: { stringValue: article.title },
      excerpt: { stringValue: article.description || '' },
      content: { stringValue: content },
      image: { stringValue: article.urlToImage || 'https://via.placeholder.com/800x400/C49A6C/FFFFFF?text=أبو+السعد' },
      category: { stringValue: category },
      section: { stringValue: 'main' },
      author: { stringValue: article.source?.name || 'أبو السعد للاخبار' },
      sourceTitle: { stringValue: article.title },
      sourceUrl: { stringValue: article.url || '' },
      views: { integerValue: '0' },
      tags: {
        arrayValue: {
          values: [
            { stringValue: 'مصر' },
            { stringValue: category },
            { stringValue: 'أخبار' }
          ]
        }
      },
      createdAt: {
        timestampValue: new Date(article.publishedAt || Date.now()).toISOString()
      }
    }
  };

  const hostname = 'firestore.googleapis.com';
  const path = `/v1/projects/${CONFIG.FIREBASE_PROJECT_ID}/databases/(default)/documents/news?key=${CONFIG.FIREBASE_API_KEY}`;

  const result = await httpsPost(hostname, path, newsDoc, CONFIG.FIREBASE_API_KEY);

  if (result.error) {
    console.log(`❌ فشل حفظ: ${article.title.substring(0, 40)} - ${result.error.message}`);
    return false;
  }

  console.log(`✅ تم نشر: ${article.title.substring(0, 60)}...`);
  existingTitles.add(article.title);
  return true;
}

// ============================
// 📋 جلب عناوين الأخبار الموجودة
// ============================
async function getExistingTitles() {
  try {
    const hostname = 'firestore.googleapis.com';
    const path = `/v1/projects/${CONFIG.FIREBASE_PROJECT_ID}/databases/(default)/documents/news?pageSize=50&key=${CONFIG.FIREBASE_API_KEY}`;

    const result = await new Promise((resolve, reject) => {
      https.get(`https://${hostname}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { resolve({ documents: [] }); }
        });
      }).on('error', () => resolve({ documents: [] }));
    });

    const titles = new Set();
    if (result.documents) {
      result.documents.forEach(doc => {
        const title = doc.fields?.sourceTitle?.stringValue || doc.fields?.title?.stringValue;
        if (title) titles.add(title);
      });
    }

    console.log(`📋 عدد الأخبار الموجودة: ${titles.size}`);
    return titles;
  } catch (e) {
    return new Set();
  }
}

// ============================
// 🚀 الدالة الرئيسية
// ============================
async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🤖 أبو السعد - سكريبت الأخبار التلقائي  ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`⏰ ${new Date().toLocaleString('ar-EG')}`);

  try {
    // 1. جيب الأخبار الموجودة لتجنب التكرار
    const existingTitles = await getExistingTitles();

    // 2. جيب الأخبار الجديدة
    const articles = await fetchEgyptianNews();

    // 3. احفظ كل خبر في Firebase
    console.log('\n💾 جاري حفظ الأخبار في Firebase...');
    let saved = 0;
    let skipped = 0;

    for (const article of articles) {
      const success = await saveToFirebase(article, existingTitles);
      if (success) saved++;
      else skipped++;

      // انتظر ثانية بين كل خبر وتاني عشان ما تحصلش مشكلة
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n╔══════════════════════════════════════╗');
    console.log(`║  ✅ تم نشر: ${saved} خبر جديد`);
    console.log(`║  ⏭️  تم تجاهل: ${skipped} خبر مكرر`);
    console.log('╚══════════════════════════════════════╝');
    console.log('\n🌐 افتح موقعك وشوف الأخبار الجديدة!');
    console.log('🔗 https://ahmedrashadali7-sketch.github.io/abu_elsaad_news/\n');

  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    console.log('💡 تأكد من اتصالك بالإنترنت وصحة الـ API Key\n');
  }
}

// ============================
// ⏱️ التشغيل التلقائي
// ============================
const args = process.argv.slice(2);

if (args.includes('--auto')) {
  console.log(`\n⏱️  وضع التلقائي: كل ${CONFIG.INTERVAL_MINUTES} دقيقة\n`);
  main(); // شغّل فوراً
  setInterval(main, CONFIG.INTERVAL_MINUTES * 60 * 1000);
} else {
  main(); // شغّل مرة واحدة
}
