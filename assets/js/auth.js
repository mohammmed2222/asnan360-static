document.getElementById('loginBtn').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const role = document.getElementById('role').value;
  if (!name || !role) return alert('❌ أدخل الاسم والنوع');

  localStorage.setItem('asnan360_user', JSON.stringify({ name, role }));
  const url = role === 'student' ? 'student.html' : 'teacher.html';
  window.location.href = url;
});