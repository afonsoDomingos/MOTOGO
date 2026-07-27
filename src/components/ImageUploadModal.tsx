import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, X, Loader2 } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onImageUploaded: (url: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  title = 'Upload de Imagem para Cloudinary',
  onImageUploaded
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Compress and resize image using HTML5 Canvas to prevent 413 Payload Too Large
  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to JPEG with 0.85 quality (~150KB size)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressedBase64);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = (err) => reject(err);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setErrorMsg('');

      try {
        const compressed = await resizeAndCompressImage(file);
        setPreviewUrl(compressed);
      } catch {
        setErrorMsg('Erro ao ler a imagem selecionada.');
      }
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) {
      setErrorMsg('Por favor selecione uma imagem primeiro.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: previewUrl,
          folder: 'motogo_uploads'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedUrl(data.url);
        onImageUploaded(data.url);
        setTimeout(() => {
          setLoading(false);
          onClose();
        }, 1200);
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${response.status}: Falha no upload`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao enviar imagem para o Cloudinary (dnvnftvky).');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-gray-100 text-gray-400 hover:text-gray-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Zone */}
        <div className="space-y-3">
          <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-center hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 mx-auto rounded-xl object-cover shadow-sm border border-gray-200"
              />
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto text-gray-400" />
                <div className="text-xs font-extrabold text-gray-700">Clique ou arraste para selecionar imagem</div>
                <div className="text-[10px] text-gray-400">Compressão automática • Cloudinary dnvnftvky</div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-200">
              {errorMsg}
            </div>
          )}

          {uploadedUrl && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-1.5 border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              <span>Imagem salva com sucesso no Cloudinary!</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !previewUrl}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando para Cloudinary...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Confirmar Upload (Cloudinary)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
