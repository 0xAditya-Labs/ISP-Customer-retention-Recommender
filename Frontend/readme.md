# 📱 Telecom Churn Frontend

This is the React-based frontend application for the Telecom Churn Prediction system. It provides a premium, high-performance interface for business agents to analyze customer data and calculate ROI on retention campaigns.

## 📂 Folder Structure

```text
Frontend/
├── src/
│   ├── components/            # UI Components
│   │   ├── ActionTable.jsx    # Table displaying customers, drivers, and actions
│   │   ├── FileUploadArea.jsx # Drag-and-drop CSV/Excel upload zone
│   │   ├── Header.jsx         # Top navigation bar
│   │   ├── Layout.jsx         # Main layout wrapper (Sidebar + Header + Content)
│   │   ├── LoadingSpinner.jsx # Premium AI analysis animation
│   │   ├── LoginPage.jsx      # Glassmorphism sign-in screen
│   │   ├── ROIMetricCards.jsx # Dynamic ROI and metrics visualization
│   │   └── Sidebar.jsx        # Navigation and theme controls
│   │
│   ├── hooks/                 # Custom React Hooks
│   │   └── useChurnData.js    # Core logic: API calls, state, and ROI math
│   │
│   ├── App.jsx                # Main orchestrator & Auth router
│   ├── index.css              # Tailwind & Global styles
│   └── main.jsx               # React entry point
│
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Design system configuration
└── vite.config.js             # Build tool configuration
```

## 🛠️ Tech Stack

- **React + Vite**: High-speed frontend framework and bundler.
- **Tailwind CSS**: Modern utility-first styling for a premium look.
- **Lucide React**: For consistent, high-quality iconography.
- **Fetch API**: For secure communication with the FastAPI backend.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔐 Authentication

The application currently uses a hardcoded demonstration authentication layer.
- **Default Username**: `admin`
- **Default Password**: `admin123`

This can be upgraded to full JWT/OAuth2 by modifying the `verify_token` dependency in the backend and the `LoginPage` handler in the frontend.
