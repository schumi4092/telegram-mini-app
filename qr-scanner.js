document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    const ctx = canvas.getContext('2d');
    const qrResult = document.getElementById('qr-result');
    const startButton = document.getElementById('start-scanner');
    const successModal = document.getElementById('successModal');
    const closeModal = successModal.querySelector('.close');
    const rewardMessage = document.getElementById('reward-message');

    let scanning = false;

    startButton.onclick = startScanner;
    closeModal.onclick = function() {
        successModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == successModal) {
            successModal.style.display = "none";
        }
    };

    function startScanner() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            scanning = true;
            startButton.hidden = true;
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(function(err) {
            console.error(err);
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
        canvas.hidden = true;
        startButton.hidden = false;

        // 這裡可以添加驗證邏輯，檢查 QR code 是否有效
        // 現在我們假設所有的 QR codes 都是有效的
        const rewards = ['10 積分', '20 積分', '50 積分', '100 積分', '神秘禮物'];
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

        rewardMessage.textContent = `您已成功兌換 ${randomReward}！`;
        successModal.style.display = "block";
    }
});