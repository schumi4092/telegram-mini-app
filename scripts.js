document.addEventListener('DOMContentLoaded', function() {
    const openCalendarBtn = document.getElementById('openCalendar');
    const calendarModal = document.getElementById('calendarModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const calendar = document.getElementById('calendar');

    // 打開彈跳視窗
    openCalendarBtn.onclick = function() {
        calendarModal.style.display = "block";
        generateCalendar();
    }

    // 關閉彈跳視窗
    closeBtn.onclick = function() {
        calendarModal.style.display = "none";
    }

    // 點擊彈跳視窗外部關閉
    window.onclick = function(event) {
        if (event.target == calendarModal) {
            calendarModal.style.display = "none";
        }
    }

    function generateCalendar() {
        calendar.innerHTML = '';
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.textContent = i;
            
            if (i < today.getDate()) {
                day.classList.add('checked');
            }
            
            if (i === today.getDate()) {
                day.classList.add('today');
            }
            
            calendar.appendChild(day);
        }
    }
});