// routes/cdek.routes.ts
import express from 'express';
import axios from 'axios';

const router = express.Router();

// ============================================
// КОНФИГУРАЦИЯ CDEK
// ============================================
// ⚠️ Для продакшена используй переменные окружения!
// Сейчас для теста используем публичные тестовые ключи
const CDEK_ACCOUNT = process.env.CDEK_ACCOUNT || 'EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI';
const CDEK_PASSWORD = process.env.CDEK_PASSWORD || 'PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG';
const CDEK_API_URL = 'https://api.cdek.ru/v2';

// Кэш для токена
let cdekToken: string | null = null;
let tokenExpiry: number | null = null;
let cache = new Map();

// ============================================
// ПОЛУЧЕНИЕ ТОКЕНА CDEK
// ============================================
async function getCdekToken() {
  // Если токен ещё валиден (с запасом 1 минута)
  if (cdekToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cdekToken;
  }

  try {
    console.log('🔄 Получение нового токена CDEK...');

    const response = await axios.post(`${CDEK_API_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: CDEK_ACCOUNT,
      client_secret: CDEK_PASSWORD,
    });

    cdekToken = response.data.access_token;
    // Устанавливаем expiry на 5 минут меньше реального (запас)
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 300000;

    console.log('✅ CDEK токен получен');
    return cdekToken;
  } catch (error: any) {
    console.error('❌ Ошибка получения CDEK токена:', error.response?.data || error.message);
    throw new Error('Не удалось получить токен CDEK');
  }
}

// ============================================
// 1. ПОЛУЧИТЬ ПВЗ ПО ГОРОДУ
// ============================================
router.get('/pvz', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city || typeof city !== 'string' || city.length < 2) {
      return res.status(400).json({ error: 'Город слишком короткий (минимум 2 символа)' });
    }

    // Проверяем кэш
    const cacheKey = `pvz_${city.toLowerCase().trim()}`;
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      console.log(`📦 CDEK кэш: ${cacheKey}`);
      return res.json({ pvz: cached });
    }

    const token = await getCdekToken();

    console.log(`🔍 Поиск города: ${city}`);

    // 1. Ищем город в CDEK
    const cityResponse = await axios.get(`${CDEK_API_URL}/cities`, {
      params: {
        q: city,
        lang: 'rus',
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!cityResponse.data || cityResponse.data.length === 0) {
      return res.json({ pvz: [] });
    }

    // Берём первый найденный город
    const cityData = cityResponse.data[0];
    const cityCode = cityData.code;
    const cityName = cityData.name;

    console.log(`🏙 Найден город: ${cityName} (код: ${cityCode})`);

    // 2. Получаем ПВЗ по городу
    const pvzResponse = await axios.get(`${CDEK_API_URL}/deliverypoints`, {
      params: {
        city_code: cityCode,
        type: 'PVZ',
        lang: 'rus',
        size: 100, // максимум ПВЗ
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Форматируем ответ
    const pvz = (pvzResponse.data || []).map((p: any) => ({
      address: p.location?.address || p.address || 'Адрес не указан',
      lat: p.location?.latitude || p.coord?.lat || 0,
      lng: p.location?.longitude || p.coord?.lng || 0,
      code: p.code || '',
      workTime: p.work_time || p.workTime || 'Не указано',
      city: cityName,
      nearest: false,
      phone: p.phone || '',
      note: p.note || '',
    }));

    // Кэшируем на 10 минут
    cache.set(cacheKey, pvz);
    setTimeout(() => cache.delete(cacheKey), 10 * 60 * 1000);

    console.log(`✅ Найдено ПВЗ: ${pvz.length} в городе ${cityName}`);

    res.json({ pvz });
  } catch (error: any) {
    console.error('❌ Ошибка получения ПВЗ:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Ошибка получения пунктов выдачи',
      details: error.response?.data || error.message
    });
  }
});

// ============================================
// 2. ПОЛУЧИТЬ БЛИЖАЙШИЕ ПВЗ ПО КООРДИНАТАМ
// ============================================
router.get('/pvz/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Не указаны координаты' });
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({ error: 'Неверный формат координат' });
    }

    // Проверяем кэш
    const cacheKey = `nearby_${latNum.toFixed(4)}_${lngNum.toFixed(4)}_${radius}`;
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      console.log(`📦 Кэш ближайших ПВЗ`);
      return res.json({ pvz: cached });
    }

    const token = await getCdekToken();

    console.log(`📍 Поиск ближайших ПВЗ к (${latNum}, ${lngNum})`);

    const response = await axios.get(`${CDEK_API_URL}/deliverypoints`, {
      params: {
        lat: latNum,
        lng: lngNum,
        radius: Number(radius),
        type: 'PVZ',
        lang: 'rus',
        size: 20,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const pvz = (response.data || []).map((p: any) => ({
      address: p.location?.address || p.address || 'Адрес не указан',
      lat: p.location?.latitude || p.coord?.lat || 0,
      lng: p.location?.longitude || p.coord?.lng || 0,
      code: p.code || '',
      workTime: p.work_time || p.workTime || 'Не указано',
      distance: p.distance || 0,
      nearest: true,
      phone: p.phone || '',
      note: p.note || '',
    }));

    // Сортируем по расстоянию
    pvz.sort((a: any, b: any) => (a.distance || 999999) - (b.distance || 999999));

    // Кэшируем на 5 минут
    cache.set(cacheKey, pvz);
    setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);

    console.log(`✅ Найдено ближайших ПВЗ: ${pvz.length}`);

    res.json({ pvz });
  } catch (error: any) {
    console.error('❌ Ошибка получения ближайших ПВЗ:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Ошибка получения пунктов выдачи',
      details: error.response?.data || error.message
    });
  }
});

// ============================================
// 3. ПОИСК ГОРОДОВ (автодополнение)
// ============================================
router.get('/cities', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.json({ cities: [] });
    }

    // Проверяем кэш
    const cacheKey = `cities_${query.toLowerCase().trim()}`;
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      console.log(`📦 Кэш городов: ${query}`);
      return res.json({ cities: cached });
    }

    const token = await getCdekToken();

    const response = await axios.get(`${CDEK_API_URL}/cities`, {
      params: {
        q: query,
        lang: 'rus',
        limit: 20,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cities = (response.data || []).map((c: any) => ({
      name: c.name,
      code: c.code,
      region: c.region_name || '',
    }));

    // Кэшируем на 30 минут (города редко меняются)
    cache.set(cacheKey, cities);
    setTimeout(() => cache.delete(cacheKey), 30 * 60 * 1000);

    console.log(`✅ Найдено городов: ${cities.length} по запросу "${query}"`);

    res.json({ cities });
  } catch (error: any) {
    console.error('❌ Ошибка поиска городов:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Ошибка поиска городов',
      details: error.response?.data || error.message
    });
  }
});

// ============================================
// 4. ОЧИСТКА КЭША (для админов)
// ============================================
router.delete('/cache', (req, res) => {
  cache.clear();
  console.log('🧹 Кэш CDEK очищен');
  res.json({ success: true, message: 'Кэш очищен' });
});

// ============================================
// 5. ЗДОРОВЬЕ (health check)
// ============================================
router.get('/health', async (req, res) => {
  try {
    await getCdekToken();
    res.json({
      status: 'ok',
      service: 'cdek',
      tokenValid: true,
      cacheSize: cache.size,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'cdek',
      tokenValid: false,
    });
  }
});

export default router;