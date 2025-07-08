// assets/js/student.js

document.addEventListener('DOMContentLoaded', () => {
  initDB(() => {                     // 1. تهيئة IndexedDB ثم ...
    const user = JSON.parse(localStorage.getItem('asnan360_user'));
    if (!user || user.role !== 'student') {
      alert("🚫 الوصول للطلاب فقط");
      window.location.href = 'login.html';
      return;
    }

    const courses    = JSON.parse(localStorage.getItem('asnan360_courses')) || [];
    const welcomeEl  = document.getElementById('studentWelcome');
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
                ${course.videos.length
                  ? course.videos.map(v => `<li>${v}</li>`).join('')
                  : '<li class="text-gray-600">لا توجد فيديوهات بعد.</li>'}
              </ul>
            </div>
            <div>
              <h4 class="font-semibold">📂 ملفات تعليمية</h4>
              <ul class="list-disc list-inside text-sm text-gray-700">
                ${course.files.length
                  ? course.files.map(f => `<li>${f}</li>`).join('')
                  : '<li class="text-gray-600">لا توجد ملفات بعد.</li>'}
              </ul>
            </div>

            <!-- هنا القسم الجديد: اسأل المدرّس -->
            <div class="mt-4">
              <h4 class="font-semibold">❓ اسأل المدرّس</h4>
              <textarea id="q-input-${course.id}"
                        class="w-full p-2 border rounded-lg mb-2"
                        placeholder="اكتب سؤالك هنا"></textarea>
              <button data-id="${course.id}"
                      class="ask-btn px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400">
                إرسال السؤال
              </button>
              <ul id="q-list-${course.id}"
                  class="mt-3 list-disc list-inside text-sm text-gray-700"></ul>
            </div>
          </div>`;

        courseList.appendChild(li);

        // فتح/إغلاق تفاصيل الدورة
        li.querySelector('.toggle-btn')
          .addEventListener('click', () => {
            li.querySelector('.course-details').classList.toggle('hidden');
          });

        // عرض الأسئلة المرسلة مسبقًا
        renderQuestions(course.id);

        // إرسال سؤال جديد
        li.querySelector('.ask-btn').addEventListener('click', () => {
          const qText = document.getElementById(`q-input-${course.id}`).value.trim();
          if (!qText) return alert("❌ اكتب سؤالك أولاً");
          const rec = {
            courseId: course.id,
            studentName: user.name,
            text: qText,
            answer: null,
            timestamp: Date.now()
          };
          addQuestion(rec, () => {
            renderQuestions(course.id);
            document.getElementById(`q-input-${course.id}`).value = '';
          });
        });
      });
    }

    function renderQuestions(courseId) {
      getQuestionsByCourse(courseId, list => {
        const ul = document.getElementById(`q-list-${courseId}`);
        ul.innerHTML = list.map(q => `
          <li class="mb-2">
            <b>${q.studentName}:</b> ${q.text}
            ${q.answer
              ? `<div class="mt-1 px-3 py-2 bg-gray-100 rounded">${q.answer}</div>`
              : `<i class="text-gray-500">لم يتم الرد بعد</i>`}
          </li>`).join('');
      });
    }

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('asnan360_user');
      window.location.href = 'login.html';
    });

    renderCourses();
  });
});