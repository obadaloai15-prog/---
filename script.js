window.showFull = function(type) {
  const pages = { wbl: 'wbl-guide.html', terms: 'terms.html', info: 'extra-info.html' };
  // تم التعديل هنا للفتح في نفس التبويبة
  window.location.href = pages[type];
};

class DataManager {
  constructor(key) {
    this.key = key;
  }
  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
    return data;
  }
  getAll() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }
  add(item) {
    const items = this.getAll();
    item.id = Date.now();
    item.createdAt = new Date().toISOString();
    items.push(item);
    this.save(items);
    return item;
  }
  update(id, item) {
    const items = this.getAll();
    const index = items.findIndex(i => i.id == id);
    if (index > -1) {
      items[index] = { ...items[index], ...item };
      this.save(items);
    }
  }
}

window.studentsDB = new DataManager('students');
window.providersDB = new DataManager('providers');
window.evalsDB = new DataManager('evals');
window.schoolsDB = new DataManager('schools');

if (!localStorage.getItem('students')) {
  window.studentsDB.add({ name: 'أحمد محمد علي', nationalId: '9901234567', grade: '11', specialization: 'تقنية المعلومات', school: 'مدرسة الأمل', status: 'نشط', startDate: '2024-01-15' });
  window.studentsDB.add({ name: 'سارة عبدالله خالد', nationalId: '9907654321', grade: '10', specialization: 'المحاسبة', school: 'مدرسة النور', status: 'منتهي', startDate: '2024-01-10' });
  window.studentsDB.add({ name: 'محمد يوسف أحمد', nationalId: '9905551234', grade: '12', specialization: 'الكهرباء', school: 'مدرسة التقدم', status: 'نشط', startDate: '2024-01-20' });
  
  window.providersDB.add({ name: 'شركة التقنية الحديثة', governorate: 'عمان', specialization: 'تقنية', status: 'معتمد' });
  window.providersDB.add({ name: 'مكتب الأعمال المحاسبي', governorate: 'إربد', specialization: 'محاسبة', status: 'معتمد' });
  window.providersDB.add({ name: 'مؤسسة الطاقة الكهربائية', governorate: 'الزرقاء', specialization: 'كهرباء', status: 'معتمد' });
  
  window.schoolsDB.add({ name: 'مدرسة الأمل', governorate: 'عمان', studentsCount: 45, status: 'مشاركة' });
  window.schoolsDB.add({ name: 'مدرسة النور', governorate: 'إربد', studentsCount: 32, status: 'مشاركة' });
  window.schoolsDB.add({ name: 'مدرسة التقدم', governorate: 'الزرقاء', studentsCount: 28, status: 'مشاركة' });
}
  
  document.querySelectorAll('form').forEach(form => {
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      let saved = false;
      if (form.id?.includes('student') || form.id?.includes('Form')) {
        window.studentsDB.add(data);
        saved = true;
      } else if (form.id?.includes('provider')) {
        window.providersDB.add(data);
        saved = true;
      } else if (form.id?.includes('eval') || form.id?.includes('otp')) {
        window.evalsDB.add(data);
        saved = true;
      }
      showToast(saved ? 'تم الحفظ في قاعدة البيانات المحلية!' : 'تم الحفظ!', 'success');
      form.reset();
    };
  });
  
  setTimeout(() => {
    document.querySelectorAll('.loading-container, .number').forEach(el => {
      if (el.classList.contains('loading-container')) {
        el.innerHTML = `
          <div>بيانات تجريبية محملة (${window.studentsDB.getAll().length} طالب)</div>
          <table class="table">
            <tbody>
              <tr><td>أحمد محمد</td><td>نشط</td></tr>
              <tr><td>سارة عبدالله</td><td>منتهي</td></tr>
            </tbody>
          </table>
        `;
      } else {
        el.textContent = window.studentsDB.getAll().length;
      }
    });
  }, 500);
  
  window.showToast = (msg, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.remove(), 3000);
  };
  
  console.log('✅ الكود مكتمل - شرح كامل, يعمل offline!');
// دالة لبناء السهم والتحكم بالشريط
// وظيفة إعداد الشريط الجانبي - وضعناها خارج window.onload لضمان عملها
function setupSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('div[style*="margin-right"]') || document.querySelector('.portal-content');

    if (sidebar) {
        // حذف أي زر قديم
        const oldBtn = document.querySelector('.toggle-sidebar-btn');
        if (oldBtn) oldBtn.remove();

        const btn = document.createElement('button');
        btn.className = 'toggle-sidebar-btn';
        btn.innerHTML = '❮'; 
        sidebar.appendChild(btn);

        // ضبط المحتوى الرئيسي عند البداية (وضع الفتح)
        if (mainContent) {
            mainContent.style.transition = "margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
            mainContent.style.marginRight = "280px"; // الفاصل الكبير عند الفتح
        }

        btn.onclick = function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('closed');
            const isClosed = sidebar.classList.contains('closed');
            
            if (mainContent) {
                // الفاصل الكبير: 60px عند الإغلاق ليبقى السهم حراً، و 280px عند الفتح
                mainContent.style.marginRight = isClosed ? "60px" : "280px";
            }
            
            btn.innerHTML = isClosed ? '❯' : '❮';
        };
    }
}

// تفعيل الوظيفة
document.addEventListener('DOMContentLoaded', setupSidebar);
window.onload = function() {
    console.log("تم تحميل الصفحة بنجاح - نظام البحث والوضع الليلي يعمل الآن");

    // --- 1. إعدادات نظام البحث ---
    const searchInput = document.getElementById('mainSearch');
    const suggestionsBox = document.getElementById('searchSuggestions');

    const searchItems = [
        { name: "بوابة المدرسة", url: "school.html" },
        { name: "بوابة المديرية", url: "directorate.html" },
        { name: "بوابة الوزارة - إحصائيات", url: "ministry.html" },
        { name: "بوابة الطالب - التقييم", url: "student.html" },
        { name: "بوابة مزودي التدريب", url: "provider.html" }
    ];

    if (searchInput && suggestionsBox) {
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase().trim();
            suggestionsBox.innerHTML = ''; 

            if (searchText.length > 0) {
                const matches = searchItems.filter(item => item.name.includes(searchText));
                if (matches.length > 0) {
                    suggestionsBox.style.display = 'block';
                    matches.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.innerHTML = `🔍 ${item.name}`;
                        div.onclick = function() {
                            window.location.href = item.url;
                        };
                        suggestionsBox.appendChild(div);
                    });
                } else {
                    suggestionsBox.style.display = 'none';
                }
            } else {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    // --- 2. إعدادات الوضع الليلي ---
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            // تغيير الرمز داخل الزر
            themeBtn.innerHTML = isDark ? '☀️' : '🌙';
            
            // حفظ الحالة
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // تشغيل الوضع المحفوظ عند فتح الصفحة
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeBtn.innerHTML = '☀️';
        }
    }
};
// يوضع في بداية ملف script.js
document.addEventListener('touchstart', function(){}, {passive: true});
/**
 * حل جذري للهواتف: حذف السهم ومنع إزاحة المحتوى برمجياً
 */
function fixMobileLayout() {
    // التحقق مما إذا كان الجهاز هاتف (عرض الشاشة أقل من 768px)
    if (window.innerWidth <= 768) {
        
        // 1. حذف زر السهم (Toggle Button) تماماً من واجهة الهاتف
        const toggleButtons = document.querySelectorAll('.toggle-btn, .sidebar-toggle, #sidebarToggle, [class*="toggle"]');
        toggleButtons.forEach(btn => btn.remove());

        // 2. إزالة الكلاسات التي تسبب الإزاحة من السايدبار والمحتوى
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.portal-content');

        if (sidebar) {
            sidebar.classList.remove('active', 'sidebar-open');
            sidebar.style.transform = 'none'; // إلغاء أي تحريك مخفي
        }

        if (content) {
            content.classList.remove('active', 'sidebar-open');
            // تصفير الإزاحة يدوياً لضمان عدم بقاء أي أثر
            content.style.marginRight = "0px";
            content.style.marginLeft = "0px";
            content.style.transform = "none";
            content.style.transition = "none";
        }

        // 3. تعطيل وظيفة التبديل (Toggle Function) برمجياً لمنع استدعائها
        window.toggleSidebar = function() {
            console.log("Sidebar toggle is disabled on mobile.");
            return false;
        };

        // 4. منع أي عملية "إضافة كلاسات" للمحتوى تسبب إزاحة مستقبلاً
        const observer = new MutationObserver(() => {
            if (content && (content.style.marginRight !== "0px" || content.style.transform !== "none")) {
                content.style.marginRight = "0px";
                content.style.transform = "none";
            }
        });

        if (content) {
            observer.observe(content, { attributes: true, attributeFilter: ['style', 'class'] });
        }
    }
}

// تشغيل الوظيفة عند تحميل الصفحة وعند تغيير حجم الشاشة
window.addEventListener('load', fixMobileLayout);
window.addEventListener('resize', fixMobileLayout);

function fixMobileLayout() {
    const width = window.innerWidth;
    const content = document.querySelector('.portal-content');
    const sidebar = document.querySelector('.sidebar');

    if (width <= 768) {
        // في الموبايل: نمنع الجافاسكريبت من إضافة أي أرقام
        if (content) {
            content.style.marginRight = "0px"; 
            content.style.width = "100%";
            content.style.setProperty('margin-right', '0px', 'important'); // تأكيد المنع
        }
        if (sidebar) {
            sidebar.classList.add('closed');
        }
    } else {
        // في الكمبيوتر: أعد القيم التي تريدها
        if (content && sidebar && !sidebar.classList.contains('closed')) {
            content.style.marginRight = "280px";
            content.style.width = "calc(100% - 280px)";
        }
    }
}
