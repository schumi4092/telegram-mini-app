document.addEventListener('DOMContentLoaded', function() {
    const openCalendarBtn = document.getElementById('openCalendar');
    const calendarModal = document.getElementById('calendarModal');
    const calendar = document.getElementById('calendar');
    const successModal = document.getElementById('successModal');
    const closeBtns = document.querySelectorAll('.close');
    const rewardMessage = document.getElementById('reward-message');

    openCalendarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calendarModal.style.display = 'block';
        generateCalendar();
    });

    closeBtns.forEach(btn => {
        btn.onclick = function() {
            calendarModal.style.display = 'none';
            successModal.style.display = 'none';
        }
    });

    window.onclick = function(event) {
        if (event.target == calendarModal) {
            calendarModal.style.display = 'none';
        }
        if (event.target == successModal) {
            successModal.style.display = 'none';
        }
    };

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
            } else if (i === today.getDate()) {
                day.classList.add('today');
                day.addEventListener('click', checkIn);
            }
            
            calendar.appendChild(day);
        }
    }

    function checkIn() {
        if (this.classList.contains('checked')) {
            alert('您今天已經簽到過了！');
            return;
        }

        this.classList.add('checked');
        this.removeEventListener('click', checkIn);

        // 生成隨機獎勵
        const rewards = ['10 積分', '20 積分', '50 積分', '100 積分', '幸運抽獎機會'];
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

        rewardMessage.textContent = `恭喜您獲得 ${randomReward}！`;
        calendarModal.style.display = 'none';
        successModal.style.display = 'block';
    }

    // 如果有 QR code 掃描頁面，可以在這裡添加相關代碼
});

document.addEventListener('DOMContentLoaded', function() {
    const exchangeInput = document.getElementById('exchange-input');
    const confirmExchangeBtn = document.getElementById('confirm-exchange');
    const successModal = document.getElementById('successModal');
    const closeBtn = successModal.querySelector('.close');
    const rewardMessage = document.getElementById('reward-message');

    confirmExchangeBtn.addEventListener('click', function() {
        const exchangeCode = exchangeInput.value.trim();
        if (exchangeCode) {
            exchangeReward(exchangeCode);
        } else {
            alert('請輸入有效的兌換碼！');
        }
    });

    closeBtn.onclick = function() {
        successModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == successModal) {
            successModal.style.display = 'none';
        }
    }

    function exchangeReward(code) {
        // 這裡應該是實際的 API 調用來驗證兌換碼
        // 現在我們用一個模擬的隨機結果
        const isValid = Math.random() < 0.8; // 80% 的概率有效
        
        if (isValid) {
            const rewards = ['10 積分', '20 積分', '50 積分', '100 積分', '幸運抽獎機會'];
            const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
            rewardMessage.textContent = `恭喜您獲得 ${randomReward}！`;
            successModal.style.display = 'block';
        } else {
            alert('無效的兌換碼，請重試。');
        }
        
        exchangeInput.value = ''; // 清空輸入欄位
    }

    // 保留其他可能需要的功能...
});
