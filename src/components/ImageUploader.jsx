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
  const [isGlowActive, setIsGlowActive] = useState(false);
  const fileInputRef = useRef(null);
  const glowTimerRef = useRef(null);

  // Active uploaded photos list
  const uploadedEntries = Object.entries(angles || {})
    .filter(([_, photo]) => Boolean(photo))
    .map(([slot, photo]) => ({ slot, ...photo }));

  const hasPhotos = uploadedEntries.length > 0;
  const canAddMore = uploadedEntries.length < SLOTS.length;

  const triggerGlow = () => {
    if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    setIsGlowActive(true);
    glowTimerRef.current = setTimeout(() => {
      setIsGlowActive(false);
    }, 600);
  };

  const handleBrowseClick = () => {
    triggerGlow();
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
        setErrorMessage(`Invalid Content: "${file.name}" appears unrelated to ${selectedCategory.toUpperCase()} diagnostics. Please upload photos of your ${selectedCategory}.`);
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
        <div className="p-3.5 rounded-lg bg-[#A65D5D]/10 border border-[#A65D5D]/30 text-[#F5F7FA] text-xs flex items-center justify-between space-x-2 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-[#A65D5D] flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="text-[#A7B0BD] hover:text-[#F5F7FA] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* When photos are uploaded: Show grid of photo cards + Add More button */}
      {hasPhotos ? (
        <div className="space-y-4">
          
          {/* Header toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#202731]">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#A7B0BD]">
              <Layers className="w-3.5 h-3.5 text-[#8294AA]" />
              <span>Inspection Photos ({uploadedEntries.length} / {SLOTS.length})</span>
            </div>

            <div className="flex items-center space-x-3">
              {canAddMore && (
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="px-2.5 py-1.5 rounded-md bg-[#141922] hover:bg-[#141922] text-[#F5F7FA] border border-[#202731] text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#A7B0BD]" />
                  <span>Add Photo</span>
                </button>
              )}

              {onClearAllAngles && (
                <button
                  type="button"
                  onClick={onClearAllAngles}
                  className="text-xs text-[#667180] hover:text-[#A65D5D] px-2 py-1 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uploadedEntries.map((item) => (
              <div 
                key={item.slot}
                className="relative rounded-lg border border-[#202731] bg-[#10141A] p-3.5 flex items-center space-x-3.5 hover:border-[#283240] transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-[#0C1015] border border-[#202731] flex-shrink-0">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-[#07090C]/90 text-[9px] font-medium text-[#4F8A68] border border-[#4F8A68]/30 flex items-center space-x-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Metadata & Controls */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#8294AA] block truncate">
                    {SLOT_LABELS[item.slot] || 'Inspection Photo'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-medium text-[#F5F7FA] truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[#667180] font-mono">
                    {item.size} • {item.type}
                  </p>

                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => onRemoveAngle && onRemoveAngle(item.slot)}
                      className="text-[11px] text-[#667180] hover:text-[#A65D5D] flex items-center space-x-1 py-0.5 transition-colors cursor-pointer"
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
                className={`rounded-lg border border-dashed p-5 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[100px] ${
                  isDragOver
                    ? 'border-[#8294AA] bg-[#141922]'
                    : 'border-[#202731] hover:border-[#283240] bg-[#0C1015] hover:bg-[#10141A]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#141922] border border-[#202731] flex items-center justify-center mb-1.5 text-[#A7B0BD] pointer-events-none">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-[#F5F7FA] pointer-events-none">
                  Add Additional Angle / Photo
                </span>
                <span className="text-[10px] text-[#667180] mt-0.5 pointer-events-none">
                  Drag & drop or click to browse
                </span>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Empty State: Technical Drag & Drop Area */
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`relative group cursor-pointer overflow-hidden rounded-xl border border-dashed transition-colors duration-150 p-8 sm:p-12 text-center flex flex-col items-center justify-center select-none ${
            isDragOver
              ? 'border-[#8294AA] bg-[#141922]'
              : 'border-[#202731] hover:border-[#283240] bg-[#0C1015] hover:bg-[#10141A]'
          }`}
        >
          {/* Monochrome Icon */}
          <div className="relative z-10 w-14 h-14 mb-3.5 rounded-xl bg-[#141922] border border-[#202731] flex items-center justify-center text-[#A7B0BD] pointer-events-none">
            <UploadCloud className="w-7 h-7 text-[#A7B0BD]" />
          </div>

          {/* Titles */}
          <h3 className="relative z-10 text-base sm:text-lg font-semibold text-[#F5F7FA] mb-1.5 pointer-events-none">
            {isDragOver ? 'Release to upload inspection photos' : 'Upload Inspection Photos'}
          </h3>
          <p className="relative z-10 text-xs sm:text-sm text-[#A7B0BD] max-w-md mb-5 leading-relaxed pointer-events-none">
            Drag & drop single or multi-angle hardware photos, or click to browse. Supports close-ups, full overview, and component serial labels.
          </p>

          {/* Classy Professional CTA Button */}
          <div className="relative z-10 inline-flex items-center px-4 py-2.5 rounded-lg border border-[#283240] bg-[#141922] hover:bg-[#1A222E] text-[#F5F7FA] font-medium text-xs tracking-wide space-x-2 pointer-events-none shadow-sm">
            <ImageIcon className="w-4 h-4 text-[#A7B0BD]" />
            <span>Select Photo(s) to Upload</span>
          </div>

          {/* Supported formats */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-[#667180] pointer-events-none">
            <span>Single or multi-angle capture</span>
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
