import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

# 設置日誌
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

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
    使用 /start 命令來顯示遊戲按鈕
    """
    await update.message.reply_text(help_text)

def main() -> None:
    """啟動bot"""
    application = Application.builder().token('7504718790:AAFNjAZ_6vQ3dJpsA2DH4Ficyf5uiD98i7U').build()

    # 添加命令處理器
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))

    # 開始輪詢
    application.run_polling()

if __name__ == '__main__':
    main()
