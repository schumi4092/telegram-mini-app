import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup ,ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
from datetime import datetime, timedelta

# 設置日誌
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# 用戶數據存儲（在實際應用中，這應該使用數據庫）
user_data = {}

# url="https://t.me/SCU_slotbot/slotgame"
# 命令處理函數

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    keyboard = [
        [InlineKeyboardButton("🎮 Play game", url="https://t.me/SCU_slotbot/slotgame")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text='歡迎使用東吳拉霸機，點擊下方按鈕開始遊戲或使用 /help 查看可用命令。',
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """顯示幫助信息"""
    help_text = """
    可用命令：
    /start - 開始使用bot並顯示遊戲按鈕
    /help - 顯示此幫助信息
    /checkin - 每日簽到
    /points - 查看您的積分
    使用 /start 命令來顯示遊戲按鈕
    """
    await update.message.reply_text(help_text)

async def daily_checkin(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """處理每日簽到"""
    user_id = update.effective_user.id
    current_time = datetime.now()
    
    if user_id not in user_data:
        user_data[user_id] = {"last_checkin": None, "points": 0}
    
    last_checkin = user_data[user_id]["last_checkin"]
    
    if last_checkin is None or current_time - last_checkin > timedelta(days=1):
        user_data[user_id]["last_checkin"] = current_time
        user_data[user_id]["points"] += 10
        await update.message.reply_text("簽到成功！您獲得了10積分。")
    else:
        await update.message.reply_text("您今天已經簽到過了，明天再來吧！")

async def check_points(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """查看用戶積分"""
    user_id = update.effective_user.id
    points = user_data.get(user_id, {}).get("points", 0)
    await update.message.reply_text(f"您當前的積分是：{points}")

def main() -> None:
    """啟動bot"""
    application = Application.builder().token('7504718790:AAFNjAZ_6vQ3dJpsA2DH4Ficyf5uiD98i7U').build()

    # 添加命令處理器
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("checkin", daily_checkin))
    application.add_handler(CommandHandler("points", check_points))

    # 開始輪詢
    application.run_polling()

if __name__ == '__main__':
    main()