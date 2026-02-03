# Project Manager Application

A comprehensive project management application with market trend analysis, business idea generation, time tracking, and profit estimation features.

## Features

### 📊 Dashboard
- Overview of all projects and statistics
- Trending market opportunities
- Top business ideas with ROI projections

### 📁 Project Management
- Create, view, and delete projects
- Track project status (Planning, In Progress, Completed)
- Set budgets and timelines
- Task management within projects

### ⏱️ Time Tracking
- Real-time timer for tracking work hours
- Start/stop timer functionality
- View time entries and total hours tracked
- Associate time entries with projects

### 📈 Market Trends
- View current market trends and growth rates
- Search and filter trends by name or opportunity
- Identify high-demand market segments
- Opportunities for business development

### 💡 Business Ideas
- Pre-generated business ideas with investment requirements
- Filter by investment range and category
- View projected ROI and feasibility scores
- Categorized by industry (AI, E-commerce, Health Tech, etc.)

### 💰 Profit Estimation
- Calculate projected profits and ROI
- Input initial investment, monthly revenue/expenses
- Adjustable growth rate and projection period
- Monthly breakdown table with cumulative profits
- Break-even analysis

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **REST API** - Backend services

### Frontend
- **React 18** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
project-manager-app/
├── backend/
│   ├── package.json
│   └── server.js          # Main server file with all APIs
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── index.css
│   │   └── App.js         # Main React component
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Step 1: Install Backend Dependencies
```bash
cd project-manager-app/backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd project-manager-app/frontend
npm install
```

## Running the Application

### Start the Backend Server
```bash
cd project-manager-app/backend
npm start
```
The backend will run on `http://localhost:5000`

### Start the Frontend Application
```bash
cd project-manager-app/frontend
npm start
```
The frontend will open in your browser at `http://localhost:3000`

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/tasks` - Add task to project

### Time Tracking
- `GET /api/time-entries` - Get all time entries
- `POST /api/time-entries/start` - Start timer
- `POST /api/time-entries/:id/stop` - Stop timer
- `GET /api/time-entries/summary/:projectId` - Get time summary

### Market Trends
- `GET /api/market-trends` - Get all trends
- `GET /api/market-trends/search?q=keyword` - Search trends

### Business Ideas
- `GET /api/business-ideas` - Get all ideas
- `POST /api/business-ideas/generate` - Filter ideas

### Profit Estimation
- `POST /api/profit-estimation` - Calculate profit projections

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Usage Guide

### Creating a Project
1. Click on "Projects" in the sidebar
2. Click "+ New Project" button
3. Fill in project details (name, description, dates, budget)
4. Click "Create Project"

### Tracking Time
1. Click on "Time Tracking" in the sidebar
2. Enter a description of what you're working on
3. Click "Start Timer"
4. When done, click "Stop Timer"

### Analyzing Market Trends
1. Click on "Market Trends" in the sidebar
2. View trending markets with growth rates
3. Use the search bar to find specific trends

### Exploring Business Ideas
1. Click on "Business Ideas" in the sidebar
2. Filter by investment range and category
3. View projected ROI and feasibility

### Calculating Profits
1. Click on "Profit Estimation" in the sidebar
2. Enter your business parameters
3. Click "Calculate Profit" to see projections

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication and authorization
- Team collaboration features
- Export reports (PDF, Excel)
- Mobile application
- Real-time notifications
- Advanced analytics and charts
- Integration with external APIs (Google Trends, etc.)

## License

MIT License

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting features
- Submitting pull requests
