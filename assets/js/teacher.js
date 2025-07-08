// assets/js/teacher.js

document.addEventListener('DOMContentLoaded', () => {
  initDB(() => {
    const user = JSON.parse(localStorage.getItem('asnan360_user'));
    if (!user || user.role !== 'teacher') {
      alert('🚫 الوصول للمدرّسين فقط');
      window.location.href = 'login.html';
      return;
    }

    document.getElementById('teacherWelcome').textContent =
      `مرحباً ${user.name}، إليك أدواتك لإدارة الدورات والأسئلة`;

    let courses = JSON.parse(localStorage.getItem('asnan360_courses')) || [];
    const newCourseName = document.getElementById('newCourseName');
    const addCourseBtn  = document.getElementById('addCourseBtn');
    const courseList    = document.getElementById('courseList');
    const logoutBtn     = document.getElementById('logoutTeacherBtn');

    function saveCourses() {
      localStorage.setItem('asnan360_courses', JSON.stringify(courses));
    }

    function renderCourses() {
      courseList.innerHTML = '';
      courses.forEach(course => {
        const li = document.createElement('li');
        li.className = 'p-4 bg-gray-100 rounded-lg mb-4 flex justify-between items-center';
        li.innerHTML = `
          <span class="font-semibold">${course.name}</span>
          <button data-id="${course.id}"
                  class="delete-btn px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400">
            حذف
          </button>`;
        courseList.appendChild(li);
        li.querySelector('.delete-btn').addEventListener('click', () => {
          if (!confirm('هل تريد حذف هذه الدورة؟')) return;
          courses = courses.filter(c => c.id !== course.id);
          saveCourses();
          renderCourses();
          renderQuestions();
        });
      });
    }

    addCourseBtn.addEventListener('click', () => {
      const name = newCourseName.value.trim();
      if (!name) return alert('❌ أدخل اسم الدورة');
      courses.push({ id: Date.now(), name, videos: [], files: [] });
      saveCourses();
      newCourseName.value = '';
      renderCourses();
    });

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('asnan360_user');
      alert('👋 تم تسجيل الخروج');
      window.location.href = 'login.html';
    });

    renderCourses();
    renderQuestions();
  });
});

// عرض الأسئلة والرد عليها
function renderQuestions() {
  const questionList = document.getElementById('questionList');
  questionList.innerHTML = '';
  getAllQuestions(list => {
    const courses = JSON.parse(localStorage.getItem('asnan360_courses')) || [];
    list.forEach(q => {
      const course = courses.find(c => c.id === q.courseId);
      if (!course) return;
      const li = document.createElement('li');
      li.className = 'p-4 bg-gray-50 rounded-lg mb-2';
      li.innerHTML = `
        <p><b>الدورة:</b> ${course.name}</p>
        <p><b>الطالب:</b> ${q.studentName}</p>
        <p class="mt-2"><b>السؤال:</b> ${q.text}</p>
        <textarea id="ans-${q.qid}"
                  class="w-full p-2 border rounded-lg my-2"
                  placeholder="اكتب إجابتك هنا">${q.answer || ''}</textarea>
        <button data-qid="${q.qid}"
                class="answer-btn px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
          حفظ الرد
        </button>`;
      questionList.appendChild(li);

      li.querySelector('.answer-btn').addEventListener('click', () => {
        const answerText = document.getElementById(`ans-${q.qid}`).value.trim();
        if (!answerText) return alert('❌ اكتب الإجابة أولاً');
        answerQuestion(q.qid, answerText, () => {
          alert('✅ تم حفظ الإجابة');
          renderQuestions();
        });
      });
    });
  });
}