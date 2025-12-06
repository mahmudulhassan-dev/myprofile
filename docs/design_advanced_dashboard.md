# Advanced System Overview Dashboard - Implementation Plan

## Goal
Create a premium, responsive, and real-time System Overview Dashboard with detailed metrics (CPU, RAM, Storage, Network, Processes).

## 1. Backend Architecture
To support "Live" and "Detailed" metrics, we will integrate `systeminformation` library.

### API Endpoints
- `GET /api/admin/system/stats`: Comprehensive snapshot (CPU, Mem, Disk, Network).
  - *Response*: `{ cpu: { currentLoad, temp }, mem: { active, total }, fs: [...], network: { up, down }, processes: [top 5] }`
- `GET /api/admin/system/logs`: Advanced filtering for system activity logs.

## 2. Frontend Architecture (React + Tailwind)
Modular component design to handle complexity.

### Component Tree
- `AdvancedDashboard.jsx` (Layout Container)
  - `TopMetricsGrid.jsx` (4 Card Grid: CPU, RAM, Storage, Network)
  - `CpuMonitor.jsx` (Gauge + Line Chart + Process Table)
  - `RamMonitor.jsx` (Donut + Mix Chart)
  - `StorageMonitor.jsx` (Bar Chart + Folder Breakdown)
  - `NetworkMonitor.jsx` (Live Sparklines + Bandwidth)
  - `SecurityPanel.jsx` (Login Attempts, Health Status)

### Design System
- **Theme**: "Aurora Glass" (Glassmorphism, Gradients).
- **Icons**: `lucide-react` (Premium feel).
- **Animations**: `framer-motion` for smooth entry and number counting.
- **Charts**: `recharts` for all data visualization.

## 3. Implementation Steps
1.  **Backend**: Setup `systemController.js` with `systeminformation`.
2.  **API**: Register routes in `systemRoutes.js`.
3.  **UI Core**: Create `AdvancedDashboard` container.
4.  **Widgets**: Implement each widget one by one.
5.  **Integration**: Connect real-time polling (5s interval).
