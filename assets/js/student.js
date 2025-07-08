// assets/js/student.js

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('asnan360_user'));
  if (!user || user.role !== 'student') {
    alert("🚫 الوصول للطلاب فقط");
    window.location.href = 'login.html';
    return;
  }

  const courses = JSON.parse(localStorage.getItem('asnan360_courses')) || [];
  console.log("📦 تحميل الدورات:", courses);

  const welcomeEl = document.getElementById('studentWelcome');
  const courseList = document.getElementById('courseList');
  const logoutBtn  = document.getElementById('logoutStudentBtn');

  welcomeEl.textContent = `مرحباً ${user.name}، هذه الدورات المتاحة لك:`;

  function renderCourses() {
    courseList.innerHTML = '';
    if (courses.length === 0) {
      courseList.innerHTML = `<li class="text-gray-600">لا توجد دورات متاحة حالياً.</li>`;
      return;
    }

    courses.forEach(course => {
      const li = document.createElement('li');
      li.className = 'p-4 bg-gray-100 rounded-lg mb-4';

      li.innerHTML = `
        <div class="flex justify-between items-center">
          <span class="font-semibold">${course.name}</span>
          <button class="toggle-btn px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
            عرض التفاصيل
          </button>
        </div>
        <div class="course-details hidden mt-4 space-y-2">
          <div>
            <h4 class="font-semibold">🎥 فيديوهات الدورة</h4>
            <ul class="list-disc list-inside text-sm text-gray-700">
              ${
                course.videos.length
                  ? course.videos.map(v => `<li>${v}</li>`).join('')
                  : `<li class="text-gray-600">لا توجد فيديوهات بعد.</li>`
              }
            </ul>
          </div>
          <div>
            <h4 class="font-semibold">📂 ملفات تعليمية</h4>
            <ul class="list-disc list-inside text-sm text-gray-700">
              ${
                course.files.length
                  ? course.files.map(f => `<li>${f}</li>`).join('')
                  : `<li class="text-gray-600">لا توجد ملفات بعد.</li>`
              }
            </ul>
          </div>
        </div>
      `;

      const toggleBtn = li.querySelector('.toggle-btn');
      const detailsEl = li.querySelector('.course-details');
      toggleBtn.addEventListener('click', () => {
        detailsEl.classList.toggle('hidden');
      });

      courseList.appendChild(li);
    });
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('asnan360_user');
    alert('👋 تم تسجيل الخروج');
    window.location.href = 'login.html';
  });

  renderCourses();
});