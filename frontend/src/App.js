import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard stats={stats} />}
        {activeTab === 'projects' && <Projects />}
        {activeTab === 'timetracking' && <TimeTracking />}
        {activeTab === 'trends' && <MarketTrends />}
        {activeTab === 'ideas' && <BusinessIdeas />}
        {activeTab === 'profit' && <ProfitEstimation />}
      </main>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'projects', icon: '📁', label: 'Projects' },
    { id: 'timetracking', icon: '⏱️', label: 'Time Tracking' },
    { id: 'trends', icon: '📈', label: 'Market Trends' },
    { id: 'ideas', icon: '💡', label: 'Business Ideas' },
    { id: 'profit', icon: '💰', label: 'Profit Estimation' }
  ];

  return (
    <aside className="sidebar">
      <h2>🚀 Project Manager</h2>
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </aside>
  );
}

function Dashboard({ stats }) {
  if (!stats) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Dashboard</h1>
        <p>Welcome to your project management dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Projects</h4>
          <div className="value">{stats.projects.total}</div>
        </div>
        <div className="stat-card">
          <h4>Active Projects</h4>
          <div className="value">{stats.projects.active}</div>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <div className="value">{stats.projects.completed}</div>
        </div>
        <div className="stat-card">
          <h4>Total Hours Tracked</h4>
          <div className="value">{stats.timeTracking.totalHours}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>🔥 Trending Opportunities</h3>
          {stats.marketTrends.map(trend => (
            <div key={trend.id} className="trend-card">
              <h4>{trend.name}</h4>
              <p>{trend.opportunity}</p>
              <div className="growth-bar">
                <div className="growth-fill" style={{ width: `${trend.growth}%` }}></div>
              </div>
              <small>Growth: {trend.growth}%</small>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>💼 Top Business Ideas</h3>
          {stats.businessIdeas.map(idea => (
            <div key={idea.id} className="idea-card">
              <h4>{idea.title}</h4>
              <p>Category: {idea.category}</p>
              <div className="idea-meta">
                <span>💵 Investment: ${idea.investment.toLocaleString()}</span>
                <span>📈 ROI: {idea.projectedROI}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const createProject = async () => {
    try {
      await axios.post(`${API_URL}/projects`, newProject);
      fetchProjects();
      setShowModal(false);
      setNewProject({ name: '', description: '', startDate: '', endDate: '', budget: 0 });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="projects">
      <div className="header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <div className="project-info">
              <h4>{project.name}</h4>
              <p>{project.description}</p>
              <p>Budget: ${project.budget.toLocaleString()}</p>
            </div>
            <div>
              <span className={`status-badge status-${project.status.toLowerCase().replace(' ', '-')}`}>
                {project.status}
              </span>
              <button
                className="btn btn-danger"
                style={{ marginLeft: '10px' }}
                onClick={() => deleteProject(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>No projects yet. Create one!</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Create New Project</h3>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={e => setNewProject({ ...newProject, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={newProject.endDate}
                onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Budget ($)</label>
              <input
                type="number"
                value={newProject.budget}
                onChange={e => setNewProject({ ...newProject, budget: parseInt(e.target.value) })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createProject}>Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeTracking() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timerRunning, setTimerRunning] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTimeEntries();
    fetchProjects();
    
    const interval = setInterval(() => {
      if (timerRunning) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerRunning]);

  const fetchTimeEntries = async () => {
    try {
      const response = await axios.get(`${API_URL}/time-entries`);
      setTimeEntries(response.data);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const startTimer = async () => {
    if (!description || projects.length === 0) {
      alert('Please enter a description and ensure you have projects');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/time-entries/start`, {
        projectId: projects[0].id,
        description
      });
      setTimerRunning(response.data);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const stopTimer = async () => {
    if (!timerRunning) return;
    
    try {
      await axios.post(`${API_URL}/time-entries/${timerRunning.id}/stop`);
      setTimerRunning(null);
      setElapsedTime(0);
      setDescription('');
      fetchTimeEntries();
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timetracking">
      <div className="header">
        <h1>Time Tracking</h1>
        <p>Track time spent on your projects</p>
      </div>

      <div className="card">
        <h3>⏱️ Timer</h3>
        <div className="timer-display">
          {formatTime(elapsedTime)}
        </div>
        <div className="form-group">
          <label>What are you working on?</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {!timerRunning ? (
            <button className="btn btn-success" onClick={startTimer}>
              ▶️ Start Timer
            </button>
          ) : (
            <button className="btn btn-danger" onClick={stopTimer}>
              ⏹️ Stop Timer
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>📋 Time Entries</h3>
        <div className="time-entries">
          {timeEntries.map(entry => (
            <div key={entry.id} className="time-entry">
              <span>{entry.description}</span>
              <span>{Math.round(entry.duration / 60)} hours</span>
              <span className="status-badge status-completed">{entry.status}</span>
            </div>
          ))}
          {timeEntries.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>No time entries yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MarketTrends() {
  const [trends, setTrends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await axios.get(`${API_URL}/market-trends`);
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  const filteredTrends = trends.filter(trend =>
    trend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trend.opportunity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="markettrends">
      <div className="header">
        <h1>Market Trends</h1>
        <p>Discover trending markets and opportunities</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search trends..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid-2">
        {filteredTrends.map(trend => (
          <div key={trend.id} className="trend-card">
            <h4>{trend.name}</h4>
            <p><strong>Opportunity:</strong> {trend.opportunity}</p>
            <p><strong>Demand:</strong> {trend.demand}</p>
            <div className="growth-bar">
              <div className="growth-fill" style={{ width: `${trend.growth}%` }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span>Growth: {trend.growth}%</span>
              <span>Demand: {trend.demand}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BusinessIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [filters, setFilters] = useState({
    minInvestment: '',
    maxInvestment: '',
    category: ''
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await axios.get(`${API_URL}/business-ideas`);
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  const filterIdeas = async () => {
    try {
      const response = await axios.post(`${API_URL}/business-ideas/generate`, {
        minInvestment: filters.minInvestment ? parseInt(filters.minInvestment) : null,
        maxInvestment: filters.maxInvestment ? parseInt(filters.maxInvestment) : null,
        category: filters.category || null
      });
      setIdeas(response.data);
    } catch (error) {
      console.error('Error filtering ideas:', error);
    }
  };

  const categories = ['AI & Machine Learning', 'E-commerce', 'Remote Work Tools', 'Health Tech', 'Sustainable Products', 'EdTech', 'FinTech', 'Cybersecurity'];

  return (
    <div className="businessideas">
      <div className="header">
        <h1>Business Ideas</h1>
        <p>Explore profitable business opportunities</p>
      </div>

      <div className="card">
        <h3>🔍 Filter Ideas</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Min Investment ($)</label>
            <input
              type="number"
              value={filters.minInvestment}
              onChange={e => setFilters({ ...filters, minInvestment: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Max Investment ($)</label>
            <input
              type="number"
              value={filters.maxInvestment}
              onChange={e => setFilters({ ...filters, maxInvestment: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={filterIdeas}>Apply Filters</button>
      </div>

      <div className="project-list">
        {ideas.map(idea => (
          <div key={idea.id} className="project-item">
            <div className="project-info">
              <h4>{idea.title}</h4>
              <p>Category: {idea.category}</p>
              <p>Feasibility: {idea.feasibility}%</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p><strong>Investment:</strong> ${idea.investment.toLocaleString()}</p>
              <p><strong>Projected ROI:</strong> {idea.projectedROI}%</p>
              <div style={{ marginTop: '10px' }}>
                <span className="status-badge status-in-progress">
                  Feasibility: {idea.feasibility}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfitEstimation() {
  const [formData, setFormData] = useState({
    initialInvestment: 10000,
    monthlyRevenue: 2000,
    monthlyExpenses: 1000,
    growthRate: 5,
    months: 12
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const calculateProfit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/profit-estimation`, formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating profit:', error);
    }
    setLoading(false);
  };

  return (
    <div className="profittestation">
      <div className="header">
        <h1>Profit Estimation</h1>
        <p>Calculate projected profits and ROI for your business</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>📊 Business Parameters</h3>
          <div className="form-group">
            <label>Initial Investment ($)</label>
            <input
              type="number"
              name="initialInvestment"
              value={formData.initialInvestment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Monthly Revenue ($)</label>
            <input
              type="number"
              name="monthlyRevenue"
              value={formData.monthlyRevenue}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Monthly Expenses ($)</label>
            <input
              type="number"
              name="monthlyExpenses"
              value={formData.monthlyExpenses}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Monthly Growth Rate (%)</label>
            <input
              type="number"
              name="growthRate"
              value={formData.growthRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Projection Period (Months)</label>
            <input
              type="number"
              name="months"
              value={formData.months}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary" onClick={calculateProfit} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Profit'}
          </button>
        </div>

        {result && (
          <div className="card">
            <h3>💰 Profit Summary</h3>
            <div className="profit-summary">
              <div className="profit-item">
                <div className="label">Total Revenue</div>
                <div className="value">${result.summary.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="profit-item">
                <div className="label">Total Expenses</div>
                <div className="value">${result.summary.totalExpenses.toLocaleString()}</div>
              </div>
              <div className="profit-item">
                <div className="label">Total Profit</div>
                <div className={`value ${result.summary.totalProfit < 0 ? 'negative' : ''}`}>
                  ${result.summary.totalProfit.toLocaleString()}
                </div>
              </div>
              <div className="profit-item">
                <div className="label">ROI</div>
                <div className={`value ${result.summary.roi < 0 ? 'negative' : ''}`}>
                  {result.summary.roi}%
                </div>
              </div>
              <div className="profit-item">
                <div className="label">Break-Even Month</div>
                <div className="value">{result.summary.breakEvenMonth || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="card">
          <h3>📈 Monthly Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {result.calculations.map(calc => (
                <tr key={calc.month}>
                  <td>{calc.month}</td>
                  <td>${calc.revenue.toLocaleString()}</td>
                  <td>${calc.expenses.toLocaleString()}</td>
                  <td style={{ color: calc.profit >= 0 ? 'green' : 'red' }}>
                    ${calc.profit.toLocaleString()}
                  </td>
                  <td style={{ color: calc.cumulativeProfit >= 0 ? 'green' : 'red' }}>
                    ${calc.cumulativeProfit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
