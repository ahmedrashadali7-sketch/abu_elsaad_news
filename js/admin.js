<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - إضافة خبر | أبو السعد</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Cairo', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .admin-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .admin-header {
            background: #2C3E50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .admin-header h1 { font-size: 2rem; }
        .admin-header h1 span { color: #C49A6C; }
        .admin-body { padding: 40px; }
        
        .user-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-right: 4px solid #C49A6C;
        }
        
        .logout-btn {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Cairo', sans-serif;
        }
        .logout-btn:hover { background: #c0392b; }
        
        .form-group { margin-bottom: 25px; }
        .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #2C3E50;
        }
        .form-group label i { color: #C49A6C; margin-left: 8px; }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e1e1;
            border-radius: 12px;
            font-family: 'Cairo', sans-serif;
            font-size: 1rem;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #C49A6C;
        }
        .form-group textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
        }
        .category-option {
            background: #f8f9fa;
            border: 2px solid #e1e1e1;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        .category-option:hover {
            border-color: #C49A6C;
            background: #fef9f4;
        }
        .category-option.selected {
            background: #C49A6C;
            border-color: #C49A6C;
            color: white;
        }
        .category-option input[type="radio"] { display: none; }
        
        .image-upload-area {
            border: 3px dashed #C49A6C;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            cursor: pointer;
            background: #fef9f4;
            margin: 15px 0;
        }
        .image-upload-area i {
            font-size: 4rem;
            color: #C49A6C;
            margin-bottom: 15px;
        }
        
        .image-preview {
            margin: 20px 0;
            display: none;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }
        .image-preview img {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
        }
        .remove-image {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #e74c3c;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
        }
        
        .progress-bar {
            width: 100%;
            height: 30px;
            background: #f0f0f0;
            border-radius: 15px;
            overflow: hidden;
            margin: 15px 0;
            display: none;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #C49A6C, #a57d54);
            width: 0%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: width 0.3s;
        }
        
        .btn-submit {
            background: linear-gradient(135deg, #C49A6C, #a57d54);
            color: white;
            padding: 18px;
            border: none;
            border-radius: 15px;
            font-size: 1.3rem;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            font-family: 'Cairo', sans-serif;
            margin-top: 20px;
        }
        .btn-submit:disabled { background: #ccc; cursor: not-allowed; }
        
        .message {
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            display: none;
            text-align: center;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border-right: 4px solid #28a745;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border-right: 4px solid #dc3545;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1>أبو السعد <span>للاخبار</span></h1>
            <p>لوحة تحكم المشرف</p>
        </div>
        
        <div class="admin-body">
            <!-- معلومات المستخدم -->
            <div id="userInfo" class="user-info">
                <span><i class="fas fa-user"></i> <span id="userEmail">جاري التحميل...</span></span>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> تسجيل خروج
                </button>
            </div>
            
            <!-- رسائل -->
            <div id="message" class="message"></div>
            
            <!-- لاحظ: مش بنستخدم form tag هنا عشان نمنع الـ refresh -->
            <div>
                <div class="form-group">
                    <label><i class="fas fa-heading"></i> عنوان الخبر</label>
                    <input type="text" id="title" required placeholder="أدخل عنوان الخبر">
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-align-left"></i> ملخص الخبر</label>
                    <textarea id="excerpt" required placeholder="ملخص مختصر للخبر"></textarea>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-file-alt"></i> المحتوى الكامل</label>
                    <textarea id="content" required placeholder="المحتوى الكامل للخبر"></textarea>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-tag"></i> القسم</label>
                    <div class="categories-grid" id="categoryContainer">
                        <div class="category-option" data-category="سياسة">
                            <i class="fas fa-landmark"></i>
                            <span>سياسة</span>
                            <input type="radio" name="category" value="سياسة">
                        </div>
                        <div class="category-option" data-category="رياضة">
                            <i class="fas fa-futbol"></i>
                            <span>رياضة</span>
                            <input type="radio" name="category" value="رياضة">
                        </div>
                        <div class="category-option" data-category="فن">
                            <i class="fas fa-music"></i>
                            <span>فن</span>
                            <input type="radio" name="category" value="فن">
                        </div>
                        <div class="category-option" data-category="اقتصاد">
                            <i class="fas fa-chart-line"></i>
                            <span>اقتصاد</span>
                            <input type="radio" name="category" value="اقتصاد">
                        </div>
                        <div class="category-option" data-category="تكنولوجيا">
                            <i class="fas fa-microchip"></i>
                            <span>تكنولوجيا</span>
                            <input type="radio" name="category" value="تكنولوجيا">
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-image"></i> صورة الخبر</label>
                    <div class="image-upload-area" id="imageUploadArea">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>اضغط لاختيار صورة</p>
                        <small>jpg, png, gif (الحد الأقصى 5 ميجابايت)</small>
                        <input type="file" id="imageInput" accept="image/*" style="display: none;">
                    </div>
                    
                    <div class="progress-bar" id="uploadProgress">
                        <div class="progress-fill" id="progressFill">0%</div>
                    </div>
                    
                    <div class="image-preview" id="imagePreview">
                        <img src="" alt="معاينة">
                        <button type="button" class="remove-image" onclick="removeImage()">✕</button>
                    </div>
                </div>
                
                <button class="btn-submit" id="submitBtn" onclick="publishNews()">
                    <i class="fas fa-paper-plane"></i> نشر الخبر
                </button>
            </div>
        </div>
    </div>
    
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js"></script>
    <script src="js/firebase-config.js"></script>
    
    <script>
      
        // عناصر الصفحة
        const auth = firebase.auth();
        const db = firebase.firestore();
        const storage = firebase.storage();
        
        let selectedFile = null;
        
        // التحقق من تسجيل الدخول
        auth.onAuthStateChanged((user) => {
            if (user) {
                document.getElementById('userEmail').textContent = user.email;
                console.log('✅ مستخدم:', user.email);
            } else {
                window.location.href = 'login.html';
            }
        });
        
        // تسجيل الخروج
        window.logout = function() {
            auth.signOut().then(() => {
                window.location.href = 'login.html';
            });
        };
        
        // اختيار القسم
        document.querySelectorAll('.category-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.category-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                this.querySelector('input[type="radio"]').checked = true;
            });
        });
        
        // رفع الصورة
        document.getElementById('imageUploadArea').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        
        document.getElementById('imageInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.startsWith('image/')) {
                showMessage('الرجاء اختيار صورة فقط', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showMessage('الصورة كبيرة جداً (الحد الأقصى 5 ميجابايت)', 'error');
                return;
            }
            
            selectedFile = file;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('#imagePreview img').src = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
                document.getElementById('imageUploadArea').style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
        
        window.removeImage = function() {
            selectedFile = null;
            document.getElementById('imageInput').value = '';
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('imageUploadArea').style.display = 'block';
        };
        
        function showMessage(text, type) {
            const msg = document.getElementById('message');
            msg.className = `message ${type}`;
            msg.textContent = text;
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 3000);
        }
        
        // رفع الصورة إلى Storage
        async function uploadImage(file) {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(7);
            const fileName = `news/${timestamp}_${random}_${file.name}`;
            const storageRef = storage.ref(fileName);
            const uploadTask = storageRef.put(file);
            
            const progressBar = document.getElementById('uploadProgress');
            const progressFill = document.getElementById('progressFill');
            progressBar.style.display = 'block';
            
            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        progressFill.style.width = progress + '%';
                        progressFill.textContent = Math.round(progress) + '%';
                    },
                    (error) => {
                        progressBar.style.display = 'none';
                        reject(error);
                    },
                    async () => {
                        const url = await uploadTask.snapshot.ref.getDownloadURL();
                        progressBar.style.display = 'none';
                        resolve(url);
                    }
                );
            });
        }
        
        // دالة نشر الخبر (بدون ريفريش)
        window.publishNews = async function() {
            console.log('📝 بدء نشر الخبر...');
            
            if (!selectedFile) {
                showMessage('الرجاء اختيار صورة', 'error');
                return;
            }
            
            const category = document.querySelector('input[name="category"]:checked');
            if (!category) {
                showMessage('الرجاء اختيار القسم', 'error');
                return;
            }
            
            const title = document.getElementById('title').value;
            const excerpt = document.getElementById('excerpt').value;
            const content = document.getElementById('content').value;
            
            if (!title || !excerpt || !content) {
                showMessage('الرجاء ملء جميع الحقول', 'error');
                return;
            }
            
            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.innerHTML = 'جاري النشر...';
            
            try {
                // 1. رفع الصورة
                showMessage('جاري رفع الصورة...', 'success');
                const imageUrl = await uploadImage(selectedFile);
                
                // 2. حفظ الخبر
                showMessage('جاري حفظ الخبر...', 'success');
                await db.collection('news').add({
                    title: title,
                    excerpt: excerpt,
                    content: content,
                    category: category.value,
                    image: imageUrl,
                    views: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    author: auth.currentUser.email
                });
                
                // 3. نجاح
                showMessage('✅ تم نشر الخبر بنجاح', 'success');
                
                // 4. تفريغ الحقول
                document.getElementById('title').value = '';
                document.getElementById('excerpt').value = '';
                document.getElementById('content').value = '';
                removeImage();
                
                document.querySelectorAll('.category-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
            } catch (error) {
                console.error('❌ خطأ:', error);
                showMessage('❌ خطأ: ' + error.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> نشر الخبر';
            }
        };
    </script>
</body>
</html>