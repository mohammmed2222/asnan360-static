// assets/js/teacher.js

document.addEventListener('DOMContentLoaded', () => {
  // حماية الوصول للمدرّس فقط
  const user = JSON.parse(localStorage.getItem('asnan360_user'));
  if (!user || user.role !== 'teacher') {
    alert('🚫 الوصول للمدرّسين فقط');
    return window.location.href = 'login.html';
  }

  // ترحيب المستخدم
  document.getElementById('teacherWelcome').textContent =
    `مرحباً ${user.name}، إليك أدواتك لإدارة الدورات`;

  // تحميل الدورات من LocalStorage أو تهيئة مصفوفة جديدة
  let courses = JSON.parse(localStorage.getItem('asnan360_courses')) || [];

  // مراجع للعناصر في DOM
  const newCourseName = document.getElementById('newCourseName');
  const addCourseBtn  = document.getElementById('addCourseBtn');
  const courseList    = document.getElementById('courseList');
  const logoutBtn     = document.getElementById('logoutTeacherBtn');

  // دالة لحفظ الدورات في localStorage
  function saveCourses() {
    localStorage.setItem('asnan360_courses', JSON.stringify(courses));
  }

  // دالة لإعادة رسم قائمة الدورات
  function renderCourses() {
    courseList.innerHTML = '';
    courses.forEach(course => {
      const li = document.createElement('li');
      li.className = 'p-4 bg-gray-100 rounded-lg';

      li.innerHTML = `
        <div class="flex justify-between items-center">
          <span class="font-semibold">${course.name}</span>
          <div class="space-x-2 rtl:space-x-reverse">
            <button data-id="${course.id}"
                    class="toggle-btn px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-400">
              تفاصيل
            </button>
            <button data-id="${course.id}"
                    class="delete-btn px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400">
              حذف
            </button>
          </div>
        </div>
        <div id="details-${course.id}" class="hidden mt-4 space-y-3">
          <div>
            <label class="block mb-1 font-semibold">رفع فيديو جديد</label>
            <input type="file" id="videoInput-${course.id}"
                   class="border p-1 rounded-lg mb-1 w-full">
            <button data-id="${course.id}"
                    class="upload-video-btn px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-400">
              رفع الفيديو
            </button>
          </div>
          <ul id="videoList-${course.id}"
              class="list-disc list-inside text-sm text-gray-700">
            ${course.videos.map(v => `<li>${v}</li>`).join('')}
          </ul>
          <div>
            <label class="block mb-1 font-semibold">رفع ملف تعليمي</label>
            <input type="file" id="fileInput-${course.id}"
                   class="border p-1 rounded-lg mb-1 w-full">
            <button data-id="${course.id}"
                    class="upload-file-btn px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400">
              رفع الملف
            </button>
          </div>
          <ul id="fileList-${course.id}"
              class="list-disc list-inside text-sm text-gray-700">
            ${course.files.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      `;

      courseList.appendChild(li);

      // تفعيل أزرار التفاصيل، الحذف، رفع الفيديو، ورفع الملف
      li.querySelector('.toggle-btn')
        .addEventListener('click', () => {
          document.getElementById(`details-${course.id}`)
            .classList.toggle('hidden');
        });

      li.querySelector('.delete-btn')
        .addEventListener('click', () => {
          if (!confirm('هل تريد حذف هذه الدورة؟')) return;
          courses = courses.filter(c => c.id !== course.id);
          saveCourses();
          renderCourses();
        });

      li.querySelector('.upload-video-btn')
        .addEventListener('click', () => {
          const input = document.getElementById(`videoInput-${course.id}`);
          const file  = input.files[0];
          if (!file) return alert('❌ اختر ملف فيديو أولاً');
          course.videos.push(file.name);
          saveCourses();
          renderCourses();
        });

      li.querySelector('.upload-file-btn')
        .addEventListener('click', () => {
          const input = document.getElementById(`fileInput-${course.id}`);
          const file  = input.files[0];
          if (!file) return alert('❌ اختر ملف تعليمي أولاً');
          course.files.push(file.name);
          saveCourses();
          renderCourses();
        });
    });
  }

  // إضافة دورة جديدة
  addCourseBtn.addEventListener('click', () => {
    const name = newCourseName.value.trim();
    if (!name) return alert('❌ أدخل اسم الدورة');
    const id = Date.now();
    courses.push({ id, name, videos: [], files: [] });
    saveCourses();
    newCourseName.value = '';
    renderCourses();
  });

  // تفعيل زر الخروج
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('asnan360_user');
    alert('👋 تم تسجيل الخروج');
    window.location.href = 'login.html';
  });

  // رسم أولي
  renderCourses();
});