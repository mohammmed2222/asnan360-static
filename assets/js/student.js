document.addEventListener('DOMContentLoaded', () => {
  initDB(() => {
    const user = JSON.parse(localStorage.getItem('asnan360_user'));
    if (!user || user.role !== 'student') {
      alert("🚫 دخول الطالب فقط");
      window.location.href = 'index.html';
      return;
    }

    const courses = JSON.parse(localStorage.getItem('asnan360_courses')) || [];
    const welcomeEl = document.getElementById('studentWelcome');
    const courseList = document.getElementById('courseList');
    const logoutBtn = document.getElementById('logoutStudentBtn');

    welcomeEl.textContent = `مرحباً ${user.name}، هذه الدورات المتاحة لك:`;

    function renderCourses() {
      courseList.innerHTML = '';
      if (!courses.length) {
        courseList.innerHTML = `<li class="text-gray-600">لا توجد دورات حالياً.</li>`;
        return;
      }

      courses.forEach(course => {
        const li = document.createElement('li');
        li.className = 'p-4 bg-gray-100 rounded-lg mb-4';
        li.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="font-semibold">${course.name}</span>
            <button class="toggle-btn px-3 py-1 bg-blue-500 text-white rounded-lg">عرض التفاصيل</button>
          </div>
          <div class="course-details hidden mt-4 space-y-2">
            <div>
              <h4 class="font-semibold">🎥 فيديوهات الدورة</h4>
              <ul class="list-disc list-inside text-sm text-gray-700">
                ${course.videos?.length ? course.videos.map(v => `<li>${v}</li>`).join('') : '<li>لا توجد فيديوهات</li>'}
              </ul>
            </div>
            <div>
              <h4 class="font-semibold">📂 ملفات تعليمية</h4>
              <ul class="list-disc list-inside text-sm text-gray-700">
                ${course.files?.length ? course.files.map(f => `<li>${f}</li>`).join('') : '<li>لا توجد ملفات</li>'}
              </ul>
            </div>
            <div class="mt-4">
              <h4 class="font-semibold">❓ اسأل المدرّس</h4>
              <textarea id="q-input-${course.id}" class="w-full p-2 border rounded-lg mb-2" placeholder="اكتب سؤالك هنا"></textarea>
              <button data-id="${course.id}"