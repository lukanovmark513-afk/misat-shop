import * as ort from 'onnxruntime-web';

// ============================================
// 🔥 AI ОБРЕЗКА ТОВАРА (YOLOv8)
// ============================================

// Классы которые нас интересуют (одежда, обувь, аксессуары)
const TARGET_CLASSES = [
  'person', 'shoe', 'sneaker', 'boot', 'clothing',
  'coat', 'jacket', 'dress', 'shirt', 'pants',
  'bag', 'watch', 'sunglasses', 'hat', 'cap',
  'sports ball', 'skateboard', 'bicycle'
];

interface Detection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  classId: number;
  className: string;
}

let model: ort.InferenceSession | null = null;

// ============================================
// ЗАГРУЗКА МОДЕЛИ
// ============================================
export const loadModel = async (): Promise<ort.InferenceSession> => {
  if (model) return model;

  try {
    const modelPath = '/models/yolov8n.onnx';
    console.log('🔄 Загрузка AI модели...');

    model = await ort.InferenceSession.create(modelPath, {
      executionProviders: ['wasm'],
    });

    console.log('✅ AI модель загружена!');
    return model;
  } catch (error) {
    console.error('❌ Ошибка загрузки модели:', error);
    throw error;
  }
};

// ============================================
// ПРЕДОБРАБОТКА ИЗОБРАЖЕНИЯ
// ============================================
const preprocessImage = (image: HTMLImageElement): {
  tensor: ort.Tensor;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
} => {
  const targetSize = 640;
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(image, 0, 0, targetSize, targetSize);

  const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
  const { data } = imageData;

  // Преобразуем в формат для модели
  const input = new Float32Array(1 * 3 * targetSize * targetSize);
  for (let i = 0; i < data.length; i += 4) {
    const pixel = i / 4;
    const x = pixel % targetSize;
    const y = Math.floor(pixel / targetSize);
    const idx = y * targetSize + x;
    input[idx] = data[i] / 255;
    input[targetSize * targetSize + idx] = data[i + 1] / 255;
    input[2 * targetSize * targetSize + idx] = data[i + 2] / 255;
  }

  const tensor = new ort.Tensor('float32', input, [1, 3, targetSize, targetSize]);

  return {
    tensor,
    width: image.width,
    height: image.height,
    scaleX: image.width / targetSize,
    scaleY: image.height / targetSize,
  };
};

// ============================================
// ОБРАБОТКА РЕЗУЛЬТАТОВ ДЕТЕКЦИИ
// ============================================
const processDetections = (
  output: any,
  scaleX: number,
  scaleY: number,
  width: number,
  height: number,
  confidenceThreshold: number = 0.4
): Detection[] => {
  const data = output.data;
  const numDetections = data.length / 6;
  const detections: Detection[] = [];

  for (let i = 0; i < numDetections; i++) {
    const idx = i * 6;
    const x = data[idx] * scaleX;
    const y = data[idx + 1] * scaleY;
    const w = data[idx + 2] * scaleX;
    const h = data[idx + 3] * scaleY;
    const confidence = data[idx + 4];
    const classId = Math.round(data[idx + 5]);

    if (confidence < confidenceThreshold) continue;

    // Проверяем, что это нужный класс
    // В YOLOv8 классы: 0 - person, 1-80 - предметы
    // Нас интересуют любые предметы, не только люди
    detections.push({
      x,
      y,
      width: w,
      height: h,
      confidence,
      classId,
      className: `class_${classId}`,
    });
  }

  return detections;
};

// ============================================
// НАХОДИМ ЛУЧШИЙ ОБЪЕКТ
// ============================================
const findBestObject = (detections: Detection[]): Detection | null => {
  if (detections.length === 0) return null;

  // Сортируем по уверенности и выбираем лучший
  detections.sort((a, b) => b.confidence - a.confidence);

  // Возвращаем самый уверенный объект
  return detections[0];
};

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ - AI ОБРЕЗКА
// ============================================
export const cropWithAI = async (
  imageSrc: string,
  paddingPercent: number = 0.1
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Загружаем изображение
      const img = new Image();
      img.src = imageSrc;

      await new Promise((resolveImg) => {
        img.onload = resolveImg;
        img.onerror = reject;
      });

      // Загружаем модель
      const session = await loadModel();

      // Предобработка
      const { tensor, scaleX, scaleY, width, height } = preprocessImage(img);

      // Запуск детекции
      const feeds: Record<string, ort.Tensor> = {
        images: tensor,
      };

      const results = await session.run(feeds);
      const output = results['output0'];

      // Обработка результатов
      const detections = processDetections(output, scaleX, scaleY, width, height);

      // Находим лучший объект
      const bestObject = findBestObject(detections);

      // Если объект найден - обрезаем
      if (bestObject) {
        const SIZE = 1440;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d')!;

        // Добавляем отступ
        const padding = Math.max(
          bestObject.width * paddingPercent,
          bestObject.height * paddingPercent
        );

        let cropX = Math.max(0, bestObject.x - padding);
        let cropY = Math.max(0, bestObject.y - padding);
        let cropWidth = Math.min(width - cropX, bestObject.width + padding * 2);
        let cropHeight = Math.min(height - cropY, bestObject.height + padding * 2);

        // Делаем квадрат
        const cropSize = Math.max(cropWidth, cropHeight);
        const centerX = cropX + cropWidth / 2;
        const centerY = cropY + cropHeight / 2;

        cropX = Math.max(0, centerX - cropSize / 2);
        cropY = Math.max(0, centerY - cropSize / 2);
        cropWidth = Math.min(width - cropX, cropSize);
        cropHeight = Math.min(height - cropY, cropSize);

        // Создаем квадратную обрезку
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, SIZE, SIZE);

        console.log('✅ AI обрезка выполнена!');
        resolve(canvas.toDataURL('image/jpeg', 1.0));
      } else {
        // Если объект не найден - делаем обрезку по центру
        console.log('⚠️ Объект не найден, обрезка по центру');
        const SIZE = 1440;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d')!;

        const minSize = Math.min(width, height);
        const sx = (width - minSize) / 2;
        const sy = (height - minSize) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, minSize, minSize, 0, 0, SIZE, SIZE);

        resolve(canvas.toDataURL('image/jpeg', 1.0));
      }
    } catch (error) {
      console.error('❌ Ошибка AI обрезки:', error);
      reject(error);
    }
  });
};

// ============================================
// ФУНКЦИЯ ДЛЯ АДМИНКИ
// ============================================
export const processImageWithAI = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      try {
        const imageSrc = e.target?.result as string;
        const result = await cropWithAI(imageSrc, 0.1);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
  });
};