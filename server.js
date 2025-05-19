const express = require('express');
  const path = require('path');
  const { Telegraf } = require('telegraf');
  const app = express();
  const port = process.env.PORT || 8080

  // Замените на ваш токен бота
  const bot = new Telegraf('7829405846:AAGlZF7XnsE-hLmL2mVASe3WcWfcXuY4Y5U');

  // Парсинг JSON для webhook
  app.use(express.json());

  // Обслуживание статических файлов
  app.use(express.static(path.join(__dirname)));

  // Маршрут для корневого пути
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
  });

  // Обработка команды /start
  bot.command('start', (ctx) => {
      ctx.reply('Добро пожаловать! Нажмите кнопку ниже.', {
          reply_markup: {
              keyboard: [[{ text: 'Открыть список задач', web_app: { url: 'https://api.telegram.org/bot<7829405846:AAGlZF7XnsE-hLmL2mVASe3WcWfcXuY4Y5U>/setWebhook?url=https://your-render-url.onrender.com/webhook' } }]],
              resize_keyboard: true
          }
      });
  });

  // Обработка данных от Mini App
  bot.on('web_app_data', (ctx) => {
      const data = JSON.parse(ctx.webAppData.data);
      if (data.action === 'add') ctx.reply(`Задача добавлена: ${data.task}`);
      else if (data.action === 'delete') ctx.reply(`Задача удалена (ID: ${data.taskId})`);
      else if (data.action === 'get_tasks') ctx.reply('Задачи запрошены.');
  });

  // Webhook для Telegram
  app.post('/webhook', (req, res) => {
      bot.handleUpdate(req.body);
      res.sendStatus(200);
  });

  // Запуск сервера
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
  });

  // Убедитесь, что polling не запускается
  // bot.launch() удалён