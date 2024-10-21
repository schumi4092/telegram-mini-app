(function () {
  "use strict";

  const items = ["5", "10", "15", "20"];
  const couponValues = [5, 10, 15, 20];

  let userBalance = 0;
  let userCoupons = {
    5: 0,
    10: 0,
    15: 0,
    20: 0
  };

  const userIdDisplay = document.getElementById("user-id");
  const balanceDisplay = document.getElementById("balance");
  const couponDisplays = {
    5: document.getElementById("coupon-5"),
    10: document.getElementById("coupon-10"),
    15: document.getElementById("coupon-15"),
    20: document.getElementById("coupon-20")
  };
  const door = document.querySelector(".door");
  const spinButton = document.querySelector("#spinner");

  // 更新顯示
  function updateDisplays() {
    balanceDisplay.textContent = userBalance;
    for (const value of couponValues) {
      couponDisplays[value].textContent = userCoupons[value] || 0;
    }
  }

  // 從服務器獲取用戶數據
  async function fetchUserData() {
    try {
      const telegramId = '666'; // 使用固定的 Telegram ID
      const response = await fetch(`/api/user_data?telegram_id=${telegramId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("從服務器獲取的數據：", data);
      userIdDisplay.textContent = data.telegram_id;
      userBalance = data.balance;
      userCoupons = {
        5: data.coupon_5,
        10: data.coupon_10,
        15: data.coupon_15,
        20: data.coupon_20
      };
      updateDisplays();
    } catch (error) {
      console.error("獲取用戶數據時出錯：", error);
    }
  }

  // 創建輪盤
  function createBoxes() {
    const boxes = door.querySelector(".boxes");
    const boxesClone = boxes.cloneNode(false);

    for (let i = 0; i < 20; i++) {
      const box = document.createElement("div");
      box.classList.add("box");
      box.style.width = door.clientWidth + "px";
      box.style.height = door.clientHeight + "px";
      box.textContent = items[Math.floor(Math.random() * items.length)];
      boxesClone.appendChild(box);
    }

    boxesClone.style.transform = `translateY(-${door.clientHeight * (boxesClone.children.length - 1)}px)`;
    door.replaceChild(boxesClone, boxes);
  }

  // 旋轉輪盤
  async function spin() {
    if (userBalance < 10) {
      alert("餘額不足，無法進行遊戲");
      return;
    }

    spinButton.disabled = true;

    createBoxes();

    const boxes = door.querySelector(".boxes");
    const duration = 5;
    const finalPosition = Math.floor(Math.random() * 4);

    boxes.style.transition = `transform ${duration}s cubic-bezier(.17,.67,.83,.67)`;
    boxes.style.transform = `translateY(-${finalPosition * door.clientHeight}px)`;

    await new Promise(resolve => setTimeout(resolve, duration * 1000));

    const result = parseInt(boxes.children[finalPosition].textContent);
    
    // 更新服務器數據
    const response = await fetch('/api/update_user_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        telegram_id: '666',
        coupon_value: result 
      }),
    });
    const updatedData = await response.json();
    
    userBalance = updatedData.balance;
    userCoupons[result] = updatedData[`coupon_${result}`];
    updateDisplays();
    showCongratsPopup(result);

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
  fetchUserData();
})();