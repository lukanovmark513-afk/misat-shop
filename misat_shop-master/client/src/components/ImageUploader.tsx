import React, { useState, useRef } from 'react';
import { processProductImage, getImagePreview, validateImage } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  initialImage?: string;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  initialImage,
  label = 'Фото товара'
}) => {
  const [preview, setPreview] = useState<string>(initialImage || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валидация
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Неверный формат');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');

    try {
      // Обработка изображения
      const processedFile = await processProductImage(file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.85,
        maxSizeMB: 1,
      });

      // Создаем превью
      const previewUrl = await getImagePreview(processedFile);
      setPreview(previewUrl);

      // Передаем обработанный файл
      onImageChange(processedFile);
      setProgress(100);

      console.log('✅ Фото обработано:', {
        originalSize: (file.size / 1024).toFixed(0) + ' KB',
        processedSize: (processedFile.size / 1024).toFixed(0) + ' KB',
      });
    } catch (err) {
      setError('Ошибка обработки изображения');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <label className="upload-label">
        <span>{label}</span>
      </label>

      <div
        className={`upload-area ${preview ? 'has-image' : ''}`}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isProcessing}
          style={{ display: 'none' }}
        />

        {isProcessing ? (
          <div className="processing-status">
            <div className="spinner" />
            <span>Обработка... {progress}%</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : preview ? (
          <div className="preview-container">
            <img
              src={preview}
              alt="Превью товара"
              className="preview-image"
            />
            <div className="preview-overlay">
              <span>🔄 Изменить фото</span>
            </div>
          </div>
        ) : (
          <div className="placeholder">
            <i className="fas fa-cloud-upload-alt" />
            <span>Нажмите для загрузки</span>
            <small>JPEG, PNG, WEBP до 10MB</small>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;