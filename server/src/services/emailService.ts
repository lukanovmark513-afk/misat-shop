// server/src/services/emailService.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ============ НАСТРОЙКИ ДЛЯ GMAIL ============
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: '8888888gorni@gmail.com',
    pass: 'lzikvbvzepkqhvjt'  // пароль приложения
  }
});

// Проверка подключения
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail SMTP не подключен:', error);
  } else {
    console.log('✅ Gmail SMTP готов к отправке');
  }
});

// ============ ОТПРАВКА ФОРМ С САЙТА ============

// Отправка сообщения из формы "Контакты"
export const sendContactFormEmail = async (name: string, email: string, message: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"MISAT Shop" <8888888gorni@gmail.com>',
      to: '8888888gorni@gmail.com',
      subject: `📧 Новое сообщение с сайта от ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Новое сообщение с сайта</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 10px;">
            <p><strong>Отправитель:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Сообщение:</strong></p>
            <p style="background: white; padding: 10px; border-radius: 5px;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">Отправлено с сайта misat.ru</p>
        </div>
      `
    });
    console.log('✅ Письмо с контактами отправлено');
    return { success: true };
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    return { success: false };
  }
};

// Отправка вопроса из FAQ
export const sendFaqQuestionEmail = async (name: string, email: string, question: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"MISAT Shop" <8888888gorni@gmail.com>',
      to: '8888888gorni@gmail.com',
      subject: `❓ Новый вопрос от ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Новый вопрос с сайта</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 10px;">
            <p><strong>Отправитель:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Вопрос:</strong></p>
            <p style="background: white; padding: 10px; border-radius: 5px;">${question}</p>
          </div>
        </div>
      `
    });
    console.log('✅ Вопрос из FAQ отправлен');
    return { success: true };
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    return { success: false };
  }
};

// Отправка заявки на возврат
export const sendReturnRequestEmail = async (orderNumber: string, productName: string, reason: string, comment: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"MISAT Shop" <8888888gorni@gmail.com>',
      to: '8888888gorni@gmail.com',
      subject: `🔄 Заявка на возврат - заказ ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Новая заявка на возврат</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 10px;">
            <p><strong>Номер заказа:</strong> ${orderNumber}</p>
            <p><strong>Товар:</strong> ${productName || 'Не указан'}</p>
            <p><strong>Причина:</strong> ${reason}</p>
            <p><strong>Комментарий:</strong> ${comment || 'Нет комментария'}</p>
          </div>
        </div>
      `
    });
    console.log('✅ Заявка на возврат отправлена');
    return { success: true };
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    return { success: false };
  }
};

// Отправка подарочного сертификата
export const sendGiftCardEmail = async (recipientEmail: string, recipientName: string, code: string, amount: number, message: string, senderName: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"MISAT Shop" <8888888gorni@gmail.com>',
      to: recipientEmail,
      subject: `🎁 Вам подарили сертификат MISAT на ${amount} ₽!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; overflow: hidden;">
          <div style="background: #000; padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">MISAT</h1>
            <p style="color: #888; margin: 10px 0 0;">Подарочный сертификат</p>
          </div>

          <div style="padding: 30px;">
            <p style="font-size: 18px;">Здравствуйте, ${recipientName || 'друг'}!</p>
            <p>${senderName} дарит вам сертификат на <strong style="font-size: 24px; color: #000;">${amount.toLocaleString()} ₽</strong> в интернет-магазине MISAT.</p>

            ${message ? `<div style="background: #f5f5f5; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; font-style: italic;">"${message}"</p>
            </div>` : ''}

            <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <p style="margin: 0 0 5px; color: #666;">Код сертификата:</p>
              <p style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">${code}</p>
            </div>

            <p>Активируйте код на сайте <strong>misat.ru</strong> в разделе "Подарочные сертификаты".</p>
            <p>Сертификат действителен в течение 1 года.</p>

            <a href="http://localhost:5173/gift-card" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Активировать сертификат</a>
          </div>

          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; margin: 0;">С уважением, команда MISAT</p>
          </div>
        </div>
      `
    });
    console.log('✅ Письмо с сертификатом отправлено на:', recipientEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Ошибка отправки сертификата:', error);
    return { success: false };
  }
};

// ============ ОТПРАВКА ПОДТВЕРЖДЕНИЙ ============

// Отправка подтверждения регистрации
export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"MISAT Shop" <8888888gorni@gmail.com>',
      to: email,
      subject: 'Добро пожаловать в MISAT!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Добро пожаловать в <span style="font-weight: bold;">MISAT</span>!</h1>
          <p>Здравствуйте, ${name}!</p>
          <p>Спасибо за регистрацию в нашем магазине.</p>
          <p>Первый заказ со скидкой 10% по промокоду: <strong>WELCOME10</strong></p>
          <br>
          <p>С уважением,<br>Команда MISAT</p>
        </div>
      `
    });
    console.log('✅ Welcome email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    return { success: false };
  }
};

// Отправка подтверждения заказа
export const sendOrderConfirmation = async (email: string, name: string, orderNumber: string, total: number) => {
  try {
    const info = await transporter.sendMail({
      from: '"MISAT Shop" <8888888gorni@gmail.com>',
      to: email,
      subject: `Заказ ${orderNumber} оформлен!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Заказ <span style="font-weight: bold;">${orderNumber}</span> оформлен!</h1>
          <p>Здравствуйте, ${name}!</p>
          <p>Ваш заказ успешно оформлен на сумму <strong>${total.toLocaleString()} ₽</strong>.</p>
          <p>Статус заказа: <strong style="color: #ff6600;">Ожидает обработки</strong></p>
          <br>
          <a href="http://localhost:5173/orders" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Перейти к заказам</a>
        </div>
      `
    });
    console.log('✅ Order confirmation sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Order confirmation error:', error);
    return { success: false };
  }
};

// Отправка уведомления об изменении статуса заказа
export const sendOrderStatusUpdate = async (email: string, name: string, orderNumber: string, status: string) => {
  const statusText: Record<string, string> = {
    pending: 'Ожидает обработки',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
  };

  try {
    const info = await transporter.sendMail({
      from: '"MISAT Shop" <8888888gorni@gmail.com>',
      to: email,
      subject: `Статус заказа ${orderNumber} изменён`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Статус заказа <span style="font-weight: bold;">${orderNumber}</span> изменён</h1>
          <p>Здравствуйте, ${name}!</p>
          <p>Статус вашего заказа изменился на: <strong>${statusText[status]}</strong></p>
          <br>
          <a href="http://localhost:5173/orders" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Подробнее</a>
        </div>
      `
    });
    console.log('✅ Status update sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Status update error:', error);
    return { success: false };
  }
};