// assets/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm    = document.getElementById('loginForm');

  // حفظ الحساب عند التسجيل
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();

      const name     = registerForm.fullname.value;
      const email    = registerForm.email.value;
      const password = registerForm.password.value;
      const role     = registerForm.role.value;

      // حفظ البيانات مع الدور في localStorage
      const user = { name, email, password, role };
      localStorage.setItem('asnan360_user', JSON.stringify(user));

      alert('✅ تم إنشاء الحساب بنجاح!');
      window.location.href = 'login.html';
    });
  }

  // التحقق وتوجيه حسب الدور عند تسجيل الدخول
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const email    = loginForm.email.value;
      const password = loginForm.password.value;
      const saved    = JSON.parse(localStorage.getItem('asnan360_user'));

      if (saved && saved.email === email && saved.password === password) {
        alert('🎉 مرحباً بعودتك، ' + saved.name);

        // توجيه المدرّس إلى صفحة المدرّس والطالب إلى صفحة الطالب
        if (saved.role === 'teacher') {
          window.location.href = 'teacher.html';
        } else {
          window.location.href = 'student.html';
        }
      } else {
        alert('❌ معلومات الدخول غير صحيحة');
      }
    });
  }
});


// عرض اسم المستخدم في لوحة التحكم (dashboard)
document.addEventListener('DOMContentLoaded', () => {
  const welcome   = document.getElementById('welcomeMessage');
  const logoutBtn = document.getElementById('logoutBtn');

  if (welcome && logoutBtn) {
    const user = JSON.parse(localStorage.getItem('asnan360_user'));

    if (user) {
      welcome.textContent = `مرحباً ${user.name}، نحن سعداء بعودتك!`;
    } else {
      window.location.href = 'login.html';
    }

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('asnan360_user');
      alert('👋 تم تسجيل الخروج بنجاح');
      window.location.href = 'login.html';
    });
  }
});