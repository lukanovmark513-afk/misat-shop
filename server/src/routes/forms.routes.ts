// server/src/routes/forms.routes.ts
import { Router } from 'express';
import {
  sendContactFormEmail,
  sendFaqQuestionEmail,
  sendReturnRequestEmail,
  sendGiftCardEmail
} from '../services/emailService';

const router = Router();

// Отправка формы контактов
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await sendContactFormEmail(name, email, message);
    res.json({ success: true, message: 'Сообщение отправлено' });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({ success: false, error: 'Ошибка отправки' });
  }
});

// Отправка вопроса из FAQ
router.post('/faq', async (req, res) => {
  try {
    const { name, email, question } = req.body;
    await sendFaqQuestionEmail(name, email, question);
    res.json({ success: true, message: 'Вопрос отправлен' });
  } catch (error) {
    console.error('Error sending FAQ:', error);
    res.status(500).json({ success: false, error: 'Ошибка отправки' });
  }
});

// Отправка заявки на возврат
router.post('/return', async (req, res) => {
  try {
    const { orderNumber, productName, reason, comment } = req.body;
    await sendReturnRequestEmail(orderNumber, productName, reason, comment);
    res.json({ success: true, message: 'Заявка отправлена' });
  } catch (error) {
    console.error('Error sending return request:', error);
    res.status(500).json({ success: false, error: 'Ошибка отправки' });
  }
});

// Отправка подарочного сертификата
router.post('/send-gift-card', async (req, res) => {
  try {
    const { recipientEmail, recipientName, code, amount, message, senderName } = req.body;
    await sendGiftCardEmail(recipientEmail, recipientName, code, amount, message, senderName);
    res.json({ success: true, message: 'Сертификат отправлен' });
  } catch (error) {
    console.error('Error sending gift card:', error);
    res.status(500).json({ success: false, error: 'Ошибка отправки' });
  }
});

export default router;