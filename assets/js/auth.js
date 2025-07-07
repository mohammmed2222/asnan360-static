// helper: الحصول على المستخدمين من localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

// helper: حفظ مستخدم جديد
function saveUser(u) {
  const users = getUsers();
  users.push(u);
  localStorage.setItem('users', JSON.stringify(users));
}

// helper: البحث عن مستخدم
function findUser(email, pwd) {
  return getUsers().find(u => u.email === email && u.pwd === pwd);
}

// تسجيل جديد
if (window.location.pathname.endsWith('register.html')) {
  document.getElementById('registerForm').onsubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const pwd   = e.target.password.value;
    if (findUser(email, pwd)) {
      alert('❌ البريد مسجل مسبقًا');
    } else {
      saveUser({ email, pwd });
      alert('✅ تم التسجيل بنجاح');
      window.location = 'login.html';
    }
  };
}

// تسجيل دخول
if (window.location.pathname.endsWith('login.html')) {
  document.getElementById('loginForm').onsubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const pwd   = e.target.password.value;
    if (findUser(email, pwd)) {
      localStorage.setItem('asnan360-user', email);
      window.location = 'dashboard.html';
    } else {
      alert('❌ بيانات خاطئة');
    }
  };
}

// حماية صفحة dashboard
if (window.location.pathname.endsWith('dashboard.html')) {
  const user = localStorage.getItem('asnan360-user');
  if (!user) window.location = 'login.html';
  document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('asnan360-user');
    window.location = 'login.html';
  };
}