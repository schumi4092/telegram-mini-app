// telegram-login.js
(async function () {
    "use strict";

    // Telegram 登录处理
    async function handleTelegramLogin() {
        try {
            const response = await fetch('/auth/telegram');
            const data = await response.json();

            if (data.success) {
                // 登录成功后，更新用户信息或跳转页面
                window.location.href = '/dashboard'; // 假设跳转到用户主页面
            } else {
                alert('登录失败，请重试');
            }
        } catch (error) {
            console.error('登录出错', error);
        }
    }

    // 监听 Telegram 登录按钮的事件
    // 可以监听或者直接通过 auth-url 自动处理
})();
