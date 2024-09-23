(function () {
    "use strict";
  
    const items = ["🍓", "🍋", "🍉", "🍒"];
    const couponValues = [5, 10, 15, 20];
  
    let userBalance = parseInt(localStorage.getItem('userBalance')) || 10000;
    let userCoupons = JSON.parse(localStorage.getItem('userCoupons')) || {
      5: 0,
      10: 0,
      15: 0,
      20: 0
    };
  
    const balanceDisplay = document.querySelector(".balance");
    const couponDisplays = {
      5: document.getElementById("coupon-5"),
      10: document.getElementById("coupon-10"),
      15: document.getElementById("coupon-15"),
      20: document.getElementById("coupon-20")
    };
    const doors = document.querySelectorAll(".door");
    const spinButton = document.querySelector("#spinner");
  
    // 更新顯示
    function updateDisplays() {
      balanceDisplay.textContent = `當前餘額：${userBalance}u`;
      for (const value of couponValues) {
        couponDisplays[value].textContent = userCoupons[value] || 0; // 確保顯示 0
      }
    }
  
    // 保存用戶數據
    function saveData() {
      localStorage.setItem('userBalance', userBalance);
      localStorage.setItem('userCoupons', JSON.stringify(userCoupons));
    }
  
    // 創建轉輪
    function createBoxes(door) {
      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);
  
      for (let i = 0; i < 3; i++) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.textContent = items[Math.floor(Math.random() * items.length)];
        boxesClone.appendChild(box);
      }
  
      boxesClone.style.transform = `translateY(-${door.clientHeight * 2}px)`;
      door.replaceChild(boxesClone, boxes);
    }
  
    // 旋轉轉輪
    async function spin() {
      if (userBalance < 10) {
        alert("餘額不足，無法進行遊戲");
        return;
      }
  
      userBalance -= 10;
      updateDisplays();
      saveData();
  
      spinButton.disabled = true;
  
      for (const door of doors) {
        createBoxes(door);
      }
  
      const results = [];
  
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];
        const boxes = door.querySelector(".boxes");
        const duration = (i + 1) * 1;
  
        boxes.style.transition = `transform ${duration}s ease-in-out`;
        boxes.style.transform = "translateY(0)";
  
        await new Promise(resolve => setTimeout(resolve, duration * 1000));
  
        results.push(boxes.children[0].textContent);
      }
  
      // 檢查三個轉輪是否相同
      if (results.every(val => val === results[0])) {
        const randomCouponValue = couponValues[Math.floor(Math.random() * couponValues.length)];
        userCoupons[randomCouponValue]++;
        updateDisplays();
        saveData();
        showCongratsPopup(randomCouponValue);
      }
  
      spinButton.disabled = false;
    }
  
    // 顯示恭喜彈出窗口
    function showCongratsPopup(couponValue) {
      const popup = document.createElement("div");
      popup.classList.add("congrats-popup");
      popup.textContent = `恭喜！你贏得了 ${couponValue}u 折價券`;
      document.body.appendChild(popup);
  
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 3000);
    }
  
    spinButton.addEventListener("click", spin);
    updateDisplays();
  })();
  