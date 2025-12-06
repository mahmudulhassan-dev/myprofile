# Admin Dashboard & System Monitor - Module Documentation

## Overview
The Admin Dashboard provides a real-time overview of the system's status, including key business metrics (Projects, Services, Products), traffic analytics, and server health monitoring.

## Features
- **Overview Cards**: Real-time counts of key entities.
- **System Health**: CPU, RAM, Disk usage, and Database connectivity (polled every 15s).
- **Audit Logging**: Tracks critical admin actions (Login, Backup, Cache Clear).
- **Quick Actions**: One-click system maintenance tasks.
- **Traffic Analytics**: Visual representation of pageviews (requires `recharts` enabled).

## Environment Variables
Ensure the following variables are set in your `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=antigravity_db
JWT_SECRET=your_jwt_secret
```

## Setup & Running
1.  **Database Migration**:
    The system automatically syncs models on startup. To verify tables:
    ```sql
    SHOW TABLES; -- Should show 'SystemMetrics', 'ActivityLogs', 'DashboardAggregates'
    ```

2.  **Seed Data**:
    Run the seeder to populate mock activity logs and an admin user:
    ```bash
    node server/seed.js
    ```

3.  **Start Server**:
    ```bash
    # Backend
    node server/index.js
    
    # Frontend (Vite)
    npm run dev
    ```

## API Specification
Full OpenAPI/Swagger specification is available at:
`docs/api/openapi.yaml`

### Key Endpoints
- `GET /api/admin/dashboard/overview`: General stats.
- `GET /api/admin/dashboard/metrics`: Time-series traffic data.
- `GET /api/admin/dashboard/system-health`: Real-time server stats (CPU/RAM).
- `POST /api/admin/dashboard/actions`: Trigger system tasks.

## Testing Configuration
To simulate different dataset scenarios:
1.  **Traffic Data**: The `getMetrics` controller currently generates synthetic data for the last `n` days if no real data is found. You can modify `server/controllers/dashboardController.js` to return static test patterns.
2.  **System Load**: To test high CPU usage alerts, you can use a load testing tool like `autocannon` or artificially lower the thresholds in `DashboardOverview.jsx`.

## Troubleshooting "White Screen"
If you encounter a white screen in the Admin Panel:
1.  **Check Dependencies**: Ensure `recharts` is installed: `npm install recharts`.
2.  **Enable/Disable Charts**: 
    - Open `src/components/admin/DashboardOverview.jsx`.
    - Uncomment the `import { AreaChart ... } from 'recharts';` lines at the top.
    - Uncomment the `<AreaChart />` and `<PieChart />` blocks in the JSX.
    - Restart Vite: `npm run dev`.

## Future Improvements
- **Background Worker**: Implement a Redis-backed worker for heavy tasks like full database backups.
- **Aggregations**: Move daily `pageview` aggregation to a scheduled CRON job instead of on-demand calculation.
