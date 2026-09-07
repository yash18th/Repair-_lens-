import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Layers, 
  X,
  FileImage
} from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;
const SLOTS = ['closeup', 'fullView', 'label', 'altAngle'];

const SLOT_LABELS = {
  closeup: 'Photo 1 (Primary / Close-up)',
  fullView: 'Photo 2 (Full View)',
  label: 'Photo 3 (Label / Back)',
  altAngle: 'Photo 4 (Side / Detail)'
};

// Word-boundary regex matching to avoid false positives (e.g. "application.png" or "location.jpg")
const UNRELATED_PATTERNS = {
  phone: [
    /\b(car|cars|automobile|automotive|bumper|fender|windshield|sedan|suv|bmw|audi|toyota|honda|chevy|camaro|mustang|porsche|ferrari|motorcycle|scooter|tire|tyre|wheel|wheels|dog|cat|pet|pizza|burger|salad|flower|tree|landscape)\b/i
  ],
  electronics: [
    /\b(car|cars|automobile|bumper|fender|windshield|sedan|suv|bmw|toyota|motorcycle|dog|cat|pet|pizza|burger|flower)\b/i
  ],
  appliance: [
    /\b(car|cars|automobile|bumper|fender|sedan|suv|bmw|toyota|motorcycle)\b/i
  ]
};

export default function ImageUploader({ 
  angles = {}, 
  selectedCategory = 'phone', 
  onAngleUpdated, 
  onRemoveAngle,
  onClearAllAngles 
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Active uploaded photos list
  const uploadedEntries = Object.entries(angles || {})
    .filter(([_, photo]) => Boolean(photo))
    .map(([slot, photo]) => ({ slot, ...photo }));

  const hasPhotos = uploadedEntries.length > 0;
  const canAddMore = uploadedEntries.length < SLOTS.length;

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const processFiles = (fileList) => {
    if (!fileList || !fileList.length) return;

    setErrorMessage(null);
    const validFiles = [];

    for (const file of fileList) {
      const lowerName = (file.name || '').toLowerCase();
      const patterns = UNRELATED_PATTERNS[selectedCategory] || [];
      const isUnrelated = patterns.some(pattern => pattern.test(lowerName));

      if (isUnrelated) {
        setErrorMessage(`🚫 Invalid Content: "${file.name}" appears unrelated to ${selectedCategory.toUpperCase()} diagnostics. Please upload photos of your ${selectedCategory}.`);
        continue;
      }

      if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        setErrorMessage(`Format not supported for "${file.name}". Please upload JPG, PNG, or WEBP.`);
        continue;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the ${MAX_SIZE_MB}MB size limit.`);
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) return;

    // Find currently unoccupied slots
    const unoccupiedSlots = SLOTS.filter(slot => !angles?.[slot]);
    const targetSlots = unoccupiedSlots.length > 0 ? unoccupiedSlots : SLOTS;

    // Assign files to available slots
    validFiles.slice(0, targetSlots.length).forEach((file, idx) => {
      const slot = targetSlots[idx];
      const previewUrl = URL.createObjectURL(file);
      onAngleUpdated(slot, {
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type.split('/')[1]?.toUpperCase() || 'IMG',
        previewUrl
      });
    });
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget && e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden file input supporting multiple selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-between space-x-2 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* When photos are uploaded: Show grid of photo cards + Add More button */}
      {hasPhotos ? (
        <div className="space-y-4">
          
          {/* Header toolbar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Layers className="w-4 h-4" />
              <span>Uploaded Inspection Photos ({uploadedEntries.length} / {SLOTS.length})</span>
            </div>

            <div className="flex items-center space-x-3">
              {canAddMore && (
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Photo</span>
                </button>
              )}

              {onClearAllAngles && (
                <button
                  type="button"
                  onClick={onClearAllAngles}
                  className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uploadedEntries.map((item) => (
              <div 
                key={item.slot}
                className="relative rounded-xl border border-slate-800 bg-slate-900/90 p-4 flex items-center space-x-4 shadow-lg hover:border-purple-500/40 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Metadata & Controls */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block truncate">
                    {SLOT_LABELS[item.slot] || 'Inspection Photo'}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {item.size} • {item.type}
                  </p>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onRemoveAngle && onRemoveAngle(item.slot)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 py-0.5 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Drop Target Card if under limit */}
            {canAddMore && (
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                className={`rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[110px] ${
                  isDragOver
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-800 hover:border-purple-500/50 bg-slate-900/40 hover:bg-slate-900/80'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-2 text-purple-400 pointer-events-none">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 pointer-events-none">
                  Add Additional Angle / Photo
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 pointer-events-none">
                  Drag & drop or click to browse
                </span>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Empty State: Big Multi-Image Drag & Drop Area */
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center select-none ${
            isDragOver
              ? 'border-purple-500 bg-purple-500/20 scale-[1.01] shadow-2xl shadow-purple-500/20'
              : 'border-slate-700 hover:border-purple-400 bg-slate-900/60 hover:bg-slate-900/90'
          }`}
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          {/* Icon */}
          <div className="relative z-10 w-20 h-20 mb-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/50 group-hover:bg-purple-600/20 transition-all duration-300 shadow-xl pointer-events-none">
            <UploadCloud className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>

          {/* Titles */}
          <h3 className="relative z-10 text-xl sm:text-2xl font-black text-white mb-2 pointer-events-none">
            {isDragOver ? 'Drop your photos here!' : 'Upload Damage Photos'}
          </h3>
          <p className="relative z-10 text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed pointer-events-none">
            Drag & drop <strong>single or multiple photos</strong> here, or click to browse. Upload close-ups, full device views, or multiple damage angles for deep AI inspection.
          </p>

          {/* CTA Button */}
          <div className="relative z-10 inline-flex items-center px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all duration-200 space-x-2 pointer-events-none">
            <ImageIcon className="w-5 h-5" />
            <span>Select Photo(s) to Upload</span>
          </div>

          {/* Supported formats */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-slate-400 pointer-events-none">
            <span className="font-semibold text-purple-300">Single or Multi-photo upload</span>
            <span>•</span>
            <span>JPG, PNG, WEBP</span>
            <span>•</span>
            <span>Up to 10MB each</span>
          </div>
        </div>
      )}
    </div>
  );
}
