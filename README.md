# RepairLens - AI-Powered Repair Diagnosis Platform

RepairLens is an AI-assisted diagnostic SaaS platform designed to analyze images of damaged components, electronics, automotive bodywork, and appliances. Users can upload a photo of a damaged item to get instant severity ratings, estimated repair costs, DIY vs. Professional recommendations, and step-by-step repair guides.

---

## 🚀 Features

- **Drag & Drop Photo Uploader**: Supports `JPG`, `JPEG`, `PNG`, and `WEBP` images with size validation and preview.
- **1-Click Sample Presets**: Includes pre-loaded damage scenarios (Smartphone Screen, Circuit Board Thermal Damage, Automotive Bumper Scrape) for quick testing.
- **Neural Scanning Animation**: Real-time multi-step inspection progress bar during image analysis.
- **Structured Diagnostic Reports**:
  - **Problem Summary & Severity Badge** (`Low`, `Medium`, `High`, `Critical`)
  - **Root Cause Analysis**
  - **Estimated Repair Cost Range** (DIY Parts vs Pro Services)
  - **DIY Suitability Score & Skill Complexity Level**
  - **Interactive Step-by-step Repair Checklist** with progress tracker
- **Modern SaaS UI**: Dark mode UI built with React, Vite, Tailwind CSS, and Lucide React icons.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Steps to Run Locally

1. **Clone or navigate to the project directory**:
   ```bash
   cd REPAIRLENS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` (or the URL output in your terminal).

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Header with logo, nav links, status badge
│   ├── ImageUploader.jsx   # Drag & drop upload zone (JPG, JPEG, PNG, WEBP)
│   ├── ImagePreview.jsx    # Image thumbnail preview & file metadata
│   ├── LoadingState.jsx    # Animated scanning progress indicator
│   └── AnalysisCard.jsx    # Structured diagnostic report display
├── pages/
│   ├── Home.jsx           # Landing page, hero, uploader, & sample presets
│   └── Results.jsx        # Detailed diagnosis results page
├── services/
│   └── api.js             # Mock diagnostic service & sample data
├── App.jsx                # Main application state & routing
├── main.jsx               # React entry point
└── index.css              # Tailwind CSS directives & global styles
```

---

## ℹ️ Mock Data Notice

The current version (Frontend V1) uses simulated mock diagnostic data to demonstrate the user interface and diagnostic workflows. Real AI vision model backend APIs will replace mock outputs in future releases.
