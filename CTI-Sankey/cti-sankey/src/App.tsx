import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './index.css';

const CHART_HEIGHT = 450;

// Data Structure
const nodes = [
  { name: 'Circular Inflow', itemStyle: { color: '#BCE28A' } },
  { name: 'Linear Inflow', itemStyle: { color: '#D7D8DB' } },
  { name: 'Total Inflow', itemStyle: { color: '#1B184F' } },
];

const baselineLinks = [
  { source: 'Circular Inflow', target: 'Total Inflow', value: 3000, lineStyle: { color: '#BCE28A' } },
  { source: 'Linear Inflow', target: 'Total Inflow', value: 7000, lineStyle: { color: '#D7D8DB' } },
];

const scenarioLinks = [
  { source: 'Circular Inflow', target: 'Total Inflow', value: 8000, lineStyle: { color: '#BCE28A' } },
  { source: 'Linear Inflow', target: 'Total Inflow', value: 2000, lineStyle: { color: '#D7D8DB' } },
];

const getChartOption = (dataLinks: any[]) => {
  return {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    animationDurationUpdate: 1500, // Smooth 1.5s transition
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'sankey',
        left: '5%',
        right: '15%',
        top: '10%',
        bottom: '10%',
        layoutIterations: 0, // Keep node positions fixed
        nodeAlign: 'justify',
        data: nodes,
        links: dataLinks,
        emphasis: { focus: 'adjacency' },
        lineStyle: { opacity: 0.6, curveness: 0.3 },
        label: {
          color: '#1D1D41',
          fontSize: 14,
          fontWeight: 600,
          formatter: '{b}'
        }
      }
    ]
  };
};

// -- Feature 1: Animated Toggle --
const AnimatedToggleView = () => {
  const [isScenario, setIsScenario] = useState(false);
  const links = isScenario ? scenarioLinks : baselineLinks;
  
  return (
    <div className="glass-card sankey-toggle-container">
      <div className="segmented-control">
        <button 
          className={`segmented-btn ${!isScenario ? 'active' : ''}`}
          onClick={() => setIsScenario(false)}
        >
          Baseline
        </button>
        <button 
          className={`segmented-btn ${isScenario ? 'active' : ''}`}
          onClick={() => setIsScenario(true)}
        >
          Scenario
        </button>
      </div>

      <div style={{ width: '100%', height: CHART_HEIGHT }}>
        <ReactECharts 
          option={getChartOption(links)} 
          style={{ height: '100%', width: '100%' }}
          notMerge={false} // Important for animation between states
          lazyUpdate={true}
        />
      </div>

      <div className="metrics-row">
        <div className="metric circular">
          <div className="metric-label">Circular Inflow</div>
          <div className="metric-value">{isScenario ? '8,000' : '3,000'} <span style={{fontSize: '1rem'}}>Kg</span></div>
        </div>
        <div className="metric">
          <div className="metric-label">Linear Inflow</div>
          <div className="metric-value" style={{color: '#64748B'}}>{isScenario ? '2,000' : '7,000'} <span style={{fontSize: '1rem'}}>Kg</span></div>
        </div>
      </div>
    </div>
  );
};

// -- Feature 2: Side-By-Side with Diff --
const SideBySideView = () => {
  return (
    <div className="glass-card side-by-side-layout">
      {/* Baseline Chart */}
      <div className="side-card">
        <div className="side-card-title">Inflow Baseline</div>
        <div style={{ width: '100%', height: CHART_HEIGHT }}>
          <ReactECharts 
            option={getChartOption(baselineLinks)} 
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <div className="metrics-row" style={{borderStyle: 'none', marginTop: 0}}>
          <div className="metric circular">
            <div className="metric-label">Circular</div>
            <div className="metric-value">3,000 <span style={{fontSize: '0.8rem'}}>Kg</span></div>
          </div>
          <div className="metric">
            <div className="metric-label">Linear</div>
            <div className="metric-value" style={{color: '#64748B'}}>7,000 <span style={{fontSize: '0.8rem'}}>Kg</span></div>
          </div>
        </div>
      </div>

      {/* Scenario Chart with Deltas */}
      <div className="side-card">
        <div className="side-card-title">Inflow Scenario</div>
        <div style={{ width: '100%', height: CHART_HEIGHT }}>
          <ReactECharts 
            option={getChartOption(scenarioLinks)} 
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <div className="metrics-row" style={{borderStyle: 'none', marginTop: 0}}>
          <div className="metric circular">
            <div className="metric-label">Circular</div>
            <div className="metric-value" style={{display: 'flex', alignItems: 'center'}}>
              8,000 <span style={{fontSize: '0.8rem', marginLeft: 4}}>Kg</span>
              <span className="diff-badge positive">
                <ArrowUp size={14} style={{marginRight: 2}}/> 5k
              </span>
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Linear</div>
            <div className="metric-value" style={{color: '#64748B', display: 'flex', alignItems: 'center'}}>
              2,000 <span style={{fontSize: '0.8rem', marginLeft: 4}}>Kg</span>
              <span className="diff-badge negative">
                <ArrowDown size={14} style={{marginRight: 2}}/> 5k
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState<'animated' | 'sidebyside'>('animated');

  return (
    <div className="app-container">
      <h1 className="title">Flow Comparison Dashboard</h1>
      <p className="subtitle">Visualizing changes between Baseline and Scenario flows</p>
      
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'animated' ? 'active' : ''}`}
          onClick={() => setActiveTab('animated')}
        >
          Version 1: Animated Toggle
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sidebyside' ? 'active' : ''}`}
          onClick={() => setActiveTab('sidebyside')}
        >
          Version 2: Side-by-Side Diff
        </button>
      </div>

      <div className="content-area">
        {activeTab === 'animated' ? <AnimatedToggleView /> : <SideBySideView />}
      </div>
    </div>
  );
}

export default App;
