document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-scanner');
    const successModal = document.getElementById('successModal');
    const closeModal = successModal.querySelector('.close');
    const rewardMessage = document.getElementById('reward-message');
    const loadingAnimation = document.getElementById('loading-animation');

    let scanning = false;

    startButton.onclick = startScanner;
    closeModal.onclick = closeSuccessModal;

    window.onclick = function(event) {
        if (event.target == successModal) {
            closeSuccessModal();
        }
    };

    function startScanner() {
        loadingAnimation.classList.remove('hidden');
        startButton.disabled = true;

        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            scanning = true;
            startButton.style.display = 'none';
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            requestAnimationFrame(tick);
            loadingAnimation.classList.add('hidden');
        })
        .catch(function(err) {
            console.error(err);
            alert('無法訪問攝像頭，請確保已授予權限。');
            loadingAnimation.classList.add('hidden');
            startButton.disabled = false;
        });
    }

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.hidden = false;
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                console.log("Found QR code", code.data);
                handleQRCode(code.data);
                return;
            }
        }
        if (scanning) {
            requestAnimationFrame(tick);
        }
    }

    function handleQRCode(data) {
        scanning = false;
        video.srcObject.getTracks().forEach(track => track.stop());
        startButton.style.display = 'block';
        startButton.disabled = false;

        // 這裡可以添加驗證邏輯，檢查 QR code 是否有效
        const rewards = ['10 積分', '20 積分', '50 積分', '100 積分', '神秘禮物'];
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

        rewardMessage.textContent = `您已成功兌換 ${randomReward}！`;
        successModal.style.display = "block";
    }

    function closeSuccessModal() {
        successModal.style.display = "none";
    }
});
