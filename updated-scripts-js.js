document.addEventListener('DOMContentLoaded', function() {
    let web3;
    const connectButton = document.getElementById('connectWallet');
    const walletAddressDisplay = document.getElementById('walletAddress');
    const connectionStatus = document.getElementById('connectionStatus');
    const walletModal = document.getElementById('walletModal');
    const mainContent = document.getElementById('mainContent');

    const openCalendarBtn = document.getElementById('openCalendar');
    const calendarModal = document.getElementById('calendarModal');
    const calendar = document.getElementById('calendar');
    const successModal = document.getElementById('successModal');
    const closeBtns = document.querySelectorAll('.close');
    const rewardMessage = document.getElementById('reward-message');

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                connectionStatus.textContent = '正在連接...';
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);
                
                const accounts = await web3.eth.getAccounts();
                const address = accounts[0];
                
                walletAddressDisplay.textContent = `錢包地址: ${address}`;
                connectButton.textContent = '錢包已連接';
                connectButton.disabled = true;
                connectionStatus.textContent = '連接成功！';

                // 連接成功後，隱藏錢包模態框並顯示主要內容
                setTimeout(() => {
                    walletModal.style.display = 'none';
                    mainContent.style.display = 'block';
                }, 1000);

            } catch (error) {
                console.error("連接錢包時出錯:", error);
                connectionStatus.textContent = '連接失敗，請重試。';
            }
        } else {
            connectionStatus.textContent = '請安裝 MetaMask 或其他以太坊錢包擴展程序。';
        }
    }

    connectButton.addEventListener('click', connectWallet);

    // 檢查是否已經連接
    window.addEventListener('load', async () => {
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            try {
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    const address = accounts[0];
                    walletAddressDisplay.textContent = `錢包地址: ${address}`;
                    connectButton.textContent = '錢包已連接';
                    connectButton.disabled = true;
                    connectionStatus.textContent = '已連接';

                    // 如果已經連接，直接顯示主要內容
                    walletModal.style.display = 'none';
                    mainContent.style.display = 'block';
                }
            } catch (error) {
                console.error("檢查錢包連接狀態時出錯:", error);
            }
        }
    });

    // 以下是原有的日曆相關代碼
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
        // ... 原有的 generateCalendar 函數代碼 ...
    }

    function checkIn() {
        // ... 原有的 checkIn 函數代碼 ...
    }
});
