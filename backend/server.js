const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data storage (replace with database in production)
let projects = [];
let timeEntries = [];
let businessIdeas = [];
let marketTrends = [
  { id: 1, name: 'AI & Machine Learning', growth: 42, demand: 'High', opportunity: 'Enterprise automation, predictive analytics' },
  { id: 2, name: 'E-commerce', growth: 28, demand: 'High', opportunity: 'D2C brands, social commerce' },
  { id: 3, name: 'Remote Work Tools', growth: 35, demand: 'High', opportunity: 'Collaboration software, virtual offices' },
  { id: 4, name: 'Health Tech', growth: 38, demand: 'High', opportunity: 'Telemedicine, wellness apps' },
  { id: 5, name: 'Sustainable Products', growth: 25, demand: 'Medium', opportunity: 'Eco-friendly packaging, green tech' },
  { id: 6, name: 'EdTech', growth: 22, demand: 'Medium', opportunity: 'Online learning, skill development' },
  { id: 7, name: 'FinTech', growth: 30, demand: 'High', opportunity: 'Digital payments, blockchain' },
  { id: 8, name: 'Cybersecurity', growth: 45, demand: 'High', opportunity: 'Cloud security, identity management' }
];

// Generate business ideas based on trends
const generateBusinessIdeas = () => {
  const ideas = [
    { id: 1, title: 'AI-Powered Business Consultant', category: 'AI & Machine Learning', investment: 15000, projectedROI: 180, feasibility: 85 },
    { id: 2, title: 'Niche E-commerce Platform', category: 'E-commerce', investment: 8000, projectedROI: 120, feasibility: 90 },
    { id: 3, title: 'Remote Team Management SaaS', category: 'Remote Work Tools', investment: 25000, projectedROI: 200, feasibility: 75 },
    { id: 4, title: 'Telemedicine App', category: 'Health Tech', investment: 35000, projectedROI: 250, feasibility: 70 },
    { id: 5, title: 'Sustainable Product Marketplace', category: 'Sustainable Products', investment: 12000, projectedROI: 140, feasibility: 80 },
    { id: 6, title: 'Online Course Platform', category: 'EdTech', investment: 10000, projectedROI: 160, feasibility: 88 },
    { id: 7, title: 'Payment Gateway Solution', category: 'FinTech', investment: 40000, projectedROI: 300, feasibility: 65 },
    { id: 8, title: 'Security Audit Service', category: 'Cybersecurity', investment: 20000, projectedROI: 190, feasibility: 78 }
  ];
  return ideas;
};

// Initialize business ideas
businessIdeas = generateBusinessIdeas();

// ==================== PROJECT MANAGEMENT APIs ====================

// Get all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// Create new project
app.post('/api/projects', (req, res) => {
  const project = {
    id: Date.now(),
    name: req.body.name,
    description: req.body.description,
    status: req.body.status || 'Planning',
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    budget: req.body.budget || 0,
    tasks: req.body.tasks || [],
    createdAt: new Date().toISOString()
  };
  projects.push(project);
  res.json(project);
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body };
    res.json(projects[index]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  projects = projects.filter(p => p.id !== id);
  res.json({ success: true });
});

// Add task to project
app.post('/api/projects/:id/tasks', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (project) {
    const task = {
      id: Date.now(),
      title: req.body.title,
      status: req.body.status || 'Pending',
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      estimatedHours: req.body.estimatedHours || 0
    };
    project.tasks.push(task);
    res.json(task);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// ==================== TIME TRACKING APIs ====================

// Get all time entries
app.get('/api/time-entries', (req, res) => {
  res.json(timeEntries);
});

// Start time tracking
app.post('/api/time-entries/start', (req, res) => {
  const entry = {
    id: Date.now(),
    projectId: req.body.projectId,
    taskId: req.body.taskId,
    description: req.body.description,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: 0,
    status: 'Running'
  };
  timeEntries.push(entry);
  res.json(entry);
});

// Stop time tracking
app.post('/api/time-entries/:id/stop', (req, res) => {
  const id = parseInt(req.params.id);
  const entry = timeEntries.find(e => e.id === id);
  if (entry && entry.status === 'Running') {
    entry.endTime = new Date().toISOString();
    entry.duration = Math.round((new Date(entry.endTime) - new Date(entry.startTime)) / 1000 / 60); // in minutes
    entry.status = 'Completed';
    res.json(entry);
  } else {
    res.status(400).json({ error: 'Time entry not found or not running' });
  }
});

// Get time summary for a project
app.get('/api/time-entries/summary/:projectId', (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const entries = timeEntries.filter(e => e.projectId === projectId);
  const totalMinutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(2);
  res.json({ totalHours, totalMinutes, entries });
});

// ==================== MARKET TREND APIs ====================

// Get all market trends
app.get('/api/market-trends', (req, res) => {
  res.json(marketTrends);
});

// Search trends
app.get('/api/market-trends/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const filtered = marketTrends.filter(t => 
    t.name.toLowerCase().includes(query) || 
    t.opportunity.toLowerCase().includes(query)
  );
  res.json(filtered);
});

// ==================== BUSINESS IDEAS APIs ====================

// Get all business ideas
app.get('/api/business-ideas', (req, res) => {
  res.json(businessIdeas);
});

// Generate new ideas based on criteria
app.post('/api/business-ideas/generate', (req, res) => {
  const { minInvestment, maxInvestment, category } = req.body;
  let filtered = [...businessIdeas];
  
  if (minInvestment) {
    filtered = filtered.filter(i => i.investment >= minInvestment);
  }
  if (maxInvestment) {
    filtered = filtered.filter(i => i.investment <= maxInvestment);
  }
  if (category) {
    filtered = filtered.filter(i => i.category === category);
  }
  
  res.json(filtered);
});

// ==================== PROFIT ESTIMATION APIs ====================

// Calculate profit estimation
app.post('/api/profit-estimation', (req, res) => {
  const { initialInvestment, monthlyRevenue, monthlyExpenses, growthRate, months } = req.body;
  
  const calculations = [];
  let currentInvestment = initialInvestment;
  let cumulativeRevenue = 0;
  let cumulativeExpenses = 0;
  
  for (let i = 1; i <= months; i++) {
    const monthRevenue = monthlyRevenue * Math.pow(1 + growthRate / 100, i - 1);
    const monthExpenses = monthlyExpenses * Math.pow(1 + 0.05, i - 1); // 5% expense growth
    const profit = monthRevenue - monthExpenses;
    
    cumulativeRevenue += monthRevenue;
    cumulativeExpenses += monthExpenses;
    
    calculations.push({
      month: i,
      revenue: Math.round(monthRevenue),
      expenses: Math.round(monthExpenses),
      profit: Math.round(profit),
      cumulativeProfit: Math.round(cumulativeRevenue - cumulativeExpenses - initialInvestment),
      breakEven: cumulativeRevenue - cumulativeExpenses > initialInvestment ? i : null
    });
  }
  
  const totalProfit = calculations[calculations.length - 1].cumulativeProfit;
  const roi = ((totalProfit / initialInvestment) * 100).toFixed(2);
  const breakEvenMonth = calculations.find(c => c.cumulativeProfit > 0)?.month || null;
  
  res.json({
    calculations,
    summary: {
      totalRevenue: Math.round(cumulativeRevenue),
      totalExpenses: Math.round(cumulativeExpenses),
      totalProfit: Math.round(totalProfit),
      roi: parseFloat(roi),
      breakEvenMonth
    }
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  
  const totalTimeMinutes = timeEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const totalTimeHours = (totalTimeMinutes / 60).toFixed(2);
  
  const topTrends = marketTrends.sort((a, b) => b.growth - a.growth).slice(0, 3);
  const topIdeas = businessIdeas.sort((a, b) => b.projectedROI - a.projectedROI).slice(0, 3);
  
  res.json({
    projects: { total: totalProjects, active: activeProjects, completed: completedProjects },
    timeTracking: { totalHours: totalTimeHours, totalEntries: timeEntries.length },
    marketTrends: topTrends,
    businessIdeas: topIdeas
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
