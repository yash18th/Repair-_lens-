import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, Sparkles, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;

const UNRELATED_KEYWORDS = {
  phone: ['car', 'bumper', 'auto', 'chevy', 'camaro', 'honda', 'toyota', 'bmw', 'vehicle', 'truck', 'tire', 'wheel', 'motorcycle', 'dog', 'cat', 'flower', 'food', 'landscape'],
  electronics: ['car', 'bumper', 'auto', 'chevy', 'camaro', 'vehicle', 'truck', 'dog', 'cat', 'flower'],
  appliance: ['car', 'bumper', 'auto', 'chevy', 'camaro', 'vehicle', 'truck']
};

export default function ImageUploader({ angles, selectedCategory = 'phone', onAngleUpdated, onRemoveAngle }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Check if main photo exists (stored in 'closeup' or primary slot)
  const currentPhoto = angles?.closeup || Object.values(angles || {}).find(Boolean);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const processFile = (file) => {
    if (!file) return;

    // Check for invalid/unrelated content keywords in filename
    const lowerName = (file.name || '').toLowerCase();
    const invalidKeywords = UNRELATED_KEYWORDS[selectedCategory] || [];
    const isUnrelated = invalidKeywords.some(kw => lowerName.includes(kw));

    if (isUnrelated) {
      setErrorMessage(`🚫 Invalid Image Content: "${file.name}" is unrelated to ${selectedCategory.toUpperCase()} diagnostics. Please upload a clear photo of a ${selectedCategory === 'phone' ? 'smartphone display or chassis' : selectedCategory}.`);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage(`Invalid file format (${file.name}). Please upload JPG, PNG, or WEBP.`);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File ${file.name} is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setErrorMessage(null);
    const previewUrl = URL.createObjectURL(file);
    
    // Assign file to primary slot ('closeup')
    onAngleUpdated('closeup', {
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type.split('/')[1].toUpperCase(),
      previewUrl
    });
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    if (onRemoveAngle) {
      onRemoveAngle('closeup');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Invisible file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Single Upload Area */}
      {currentPhoto ? (
        /* Single Uploaded Image Preview Box */
        <div className="relative rounded-2xl border-2 border-purple-500/50 bg-slate-900/90 p-5 sm:p-6 overflow-hidden shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Image Thumbnail */}
            <div className="relative w-full md:w-56 aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
              <img
                src={currentPhoto.previewUrl}
                alt={currentPhoto.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-slate-950/90 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Photo Uploaded</span>
              </div>
            </div>

            {/* Image Metadata & Controls */}
            <div className="flex-1 space-y-3 text-left w-full">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 font-mono text-xs font-semibold border border-purple-500/20 capitalize">
                  {selectedCategory} Category Photo
                </span>
                <h3 className="text-lg font-bold text-white truncate max-w-md mt-1">
                  {currentPhoto.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Size: <strong className="text-slate-200">{currentPhoto.size}</strong> • Format: <strong className="text-slate-200">{currentPhoto.type}</strong>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleBrowseClick}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span>Change Photo</span>
                </button>

                <button
                  onClick={handleRemove}
                  className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 font-semibold text-xs border border-red-500/30 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Single Drag & Drop Box when no photo uploaded */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center ${
            isDragOver
              ? 'border-purple-500 bg-purple-500/15 scale-[1.01] shadow-2xl shadow-purple-500/20'
              : 'border-slate-700 hover:border-purple-400 bg-slate-900/60 hover:bg-slate-900/90'
          }`}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="relative z-10 w-20 h-20 mb-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/50 group-hover:bg-purple-600/20 transition-all duration-300 shadow-xl">
            <UploadCloud className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>

          <h3 className="relative z-10 text-xl sm:text-2xl font-black text-white mb-2">
            {isDragOver ? 'Drop your photo here!' : 'Upload Damage Photo'}
          </h3>
          <p className="relative z-10 text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            Drag & drop your damage photo here or click to browse. Our AI will analyze the crack, dent, or component issue automatically.
          </p>

          <div className="relative z-10 inline-flex items-center px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all duration-200 space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Select Photo to Upload</span>
          </div>

          <div className="relative z-10 flex items-center justify-center space-x-2 mt-5 text-xs text-slate-400">
            <span>Supported: JPG, JPEG, PNG, WEBP</span>
            <span>•</span>
            <span>Max size: 10MB</span>
          </div>
        </div>
      )}
    </div>
  );
}

