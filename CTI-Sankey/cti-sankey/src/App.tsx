import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  Database, 
  Building2, 
  User, 
  Bell, 
  Target, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  BookOpen,
  X,
  Plus
} from 'lucide-react';
import './index.css';

// --- Placeholder Components for Content ---
const Step1Content = ({ onNextStep }: { onNextStep: () => void }) => (
  <div className="step1-container">
    <div className="search-row">
      <div className="search-input-wrapper">
        <input type="text" value="Logitech PRO X2 SUPERSTRIKE" readOnly className="search-input" />
        <Search className="search-icon" size={20} />
      </div>
      <div className="filter-dropdown">
        <span>Filter by supplier</span>
        <ChevronDown size={20} />
      </div>
    </div>
    
    <div className="results-card">
      <div className="pill-container">
        <span className="info-pill">Select a label or start a search</span>
      </div>
      
      <table className="results-table">
        <thead>
          <tr>
            <th>Assessment</th>
            <th>Material circularity</th>
            <th>Circular outflow</th>
            <th>Outflow mass</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="result-row dynamic-hover-row">
            <td>
              <div className="assessment-title">Logitech PRO X2 SUPERSTRIKE</div>
              <div className="assessment-tags">
                <span className="tag">Mouse and peripherals</span>
                <span className="tag">Report / 2024 / E5</span>
              </div>
            </td>
            <td>45%</td>
            <td>1,824.824 kg</td>
            <td>1,824.824 kg</td>
            <td className="action-cell">
              <button className="icon-action-btn default-action"><ChevronRight size={20} /></button>
              <button className="analize-btn hover-action" onClick={onNextStep}>ANALIZE <ChevronRight size={18} /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const FlowRow = ({ 
  type,
  strategy,
  onStrategyChange,
  tags, 
  name, 
  mass, 
  linearPct,
  potentialRecoveryPct,
  actualRecoveryPct,
  circularMass, 
  circularPct, 
  linearPctOut 
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (newStrategy: string) => {
    onStrategyChange(newStrategy);
    setIsOpen(false);
  };

  const getButtonStyle = () => {
    if (strategy === 'REFUSE') return 'strategy-select refuse';
    if (strategy === 'REDUCE') return 'strategy-select reduce';
    if (strategy === 'IMPROVE') return 'strategy-select reduce'; // reuse styling for now
    return 'strategy-select default';
  };

  return (
    <tr className="flow-row">
      <td>
        <div className="flow-tags">
          {tags.map((tag: string, i: number) => (
            <span key={i} className={`mini-tag ${tag.toLowerCase().replace(' ', '-')}`}>
              {tag}
            </span>
          ))}
          {strategy !== 'SELECT' && (
            <span className={`mini-tag ${strategy.toLowerCase()}`}>
              FOCUS {strategy}
            </span>
          )}
        </div>
        <div className="flow-name">{name}</div>
      </td>
      <td className="num" style={{textAlign: 'right'}}>{typeof mass === 'number' ? '0,' + mass.toFixed(3).split('.')[1] : mass}</td>
      
      {type === 'inflow' ? (
        <td className="num" style={{textAlign: 'right'}}>{linearPct}</td>
      ) : (
        <>
          <td className="num" style={{textAlign: 'right'}}>{potentialRecoveryPct}</td>
          <td className="num" style={{textAlign: 'right'}}>{actualRecoveryPct}</td>
        </>
      )}

      <td className="num" style={{textAlign: 'right'}}>{typeof circularMass === 'number' ? '0,' + circularMass.toFixed(3).split('.')[1] : circularMass}</td>
      <td colSpan={2}>
        <div className="stacked-bar-cell">
          <div className="stacked-bar">
            <div className="bar circular" style={{width: `${circularPct}%`}}></div>
            <div className="bar linear" style={{width: `${linearPctOut}%`}}></div>
          </div>
          <div className="stacked-labels">
            <div>{circularPct},00 % <span className="text-light">C-O</span></div>
            <div>{linearPctOut},00 % <span className="text-light">L-O</span></div>
          </div>
        </div>
      </td>
      <td>
        <div className="dropdown-container">
          <button 
            className={getButtonStyle()} 
            onClick={() => setIsOpen(!isOpen)}
          >
            {strategy} <ChevronDown size={16} />
          </button>
          {isOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => handleSelect('REFUSE')}>REFUSE</div>
              <div className="dropdown-item" onClick={() => handleSelect('REDUCE')}>REDUCE</div>
              {type === 'outflow' && <div className="dropdown-item" onClick={() => handleSelect('IMPROVE')}>IMPROVE</div>}
              <div className="dropdown-item" onClick={() => handleSelect('SELECT')}>CLEAR</div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const Step2Content = ({ flows, onStrategyChange }: any) => {
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [activeTab, setActiveTab] = useState<'inflow' | 'outflow'>('inflow');

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredFlows = flows.filter((f: any) => f.type === activeTab);

  const sortedFlows = React.useMemo(() => {
    let sortableItems = [...filteredFlows];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredFlows, sortConfig]);

  const SortArrow = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <span className="sort-arrow" />;
    return <span className={`sort-arrow ${sortConfig.direction}`} />;
  };

  return (
  <div className="step2-container">
    {/* Selected Assessment Bar */}
    <div className="selected-assessment-bar">
      <h3 className="section-label">Selected assessment</h3>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Assessment</th>
            <th>Total mass (kg)</th>
            <th>Material circularity</th>
            <th>Linear mass (kg)</th>
            <th><span className="legend-box circular"></span> Circular inflow</th>
            <th><span className="legend-box linear"></span> Linear inflow</th>
            <th><span className="legend-box circular"></span> Circular outflow</th>
            <th><span className="legend-box linear"></span> Linear outflow</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-600 text-dark">Logitech PRO X2 SUPERSTRIKE</td>
            <td>0,<span className="text-light">000000</span></td>
            <td>54,60</td>
            <td>262,<span className="text-light">000000</span></td>
            <td colSpan={2}>
              <div className="stacked-bar-cell">
                <div className="stacked-bar">
                  <div className="bar circular" style={{width: '54.6%'}}></div>
                  <div className="bar linear" style={{width: '45.4%'}}></div>
                </div>
                <div className="stacked-labels">
                  <div>54,6 % <span className="text-light">C-I</span></div>
                  <div>45,4 % <span className="text-light">L-I</span></div>
                </div>
              </div>
            </td>
            <td colSpan={2}>
              <div className="stacked-bar-cell">
                <div className="stacked-bar">
                  <div className="bar circular" style={{width: '54.6%'}}></div>
                  <div className="bar linear" style={{width: '45.4%'}}></div>
                </div>
                <div className="stacked-labels">
                  <div>54,6 % <span className="text-light">C-O</span></div>
                  <div>45,4 % <span className="text-light">L-O</span></div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    {/* Circularity strategy selection Card */}
    <div className="strategy-card glass-panel">
      <h2 className="strategy-title">Circularity strategy selection</h2>
      <p className="strategy-subtitle">
        Select the R-strategies for your inflows and outflows. This defines the scope of your scenario.
      </p>
      
      <div className="strategy-controls">
        <div className="flow-toggles">
          <button className={`toggle-btn ${activeTab === 'inflow' ? 'active' : ''}`} onClick={() => setActiveTab('inflow')}>INFLOWS</button>
          <button className={`toggle-btn ${activeTab === 'outflow' ? 'active' : ''}`} onClick={() => setActiveTab('outflow')}>OUTFLOWS</button>
        </div>
        
        <div className="filter-dropdown">
          <div>
            <div className="dropdown-label">Product, packaging and waste</div>
            <div className="dropdown-sub">Discover product and packaging hotspots</div>
          </div>
          <ChevronDown size={20} />
        </div>
        
        <div className="checkbox-control">
          <input type="checkbox" id="show-assigned" />
          <label htmlFor="show-assigned">SHOW STRATEGY ASSIGNED ONLY</label>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="flows-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} className={sortConfig?.key === 'name' ? 'col-sort-active' : ''}>
                Flows <SortArrow columnKey="name" />
              </th>
              <th className={`num ${sortConfig?.key === 'mass' ? 'col-sort-active' : ''}`} onClick={() => requestSort('mass')} style={{textAlign: 'right'}}>
                Total mass (kg) <SortArrow columnKey="mass" />
              </th>

              {activeTab === 'inflow' ? (
                <th className={`num ${sortConfig?.key === 'linearPct' ? 'col-sort-active' : ''}`} onClick={() => requestSort('linearPct')} style={{textAlign: 'right'}}>
                  Linear % <SortArrow columnKey="linearPct" />
                </th>
              ) : (
                <>
                  <th className={`num ${sortConfig?.key === 'potentialRecoveryPct' ? 'col-sort-active' : ''}`} onClick={() => requestSort('potentialRecoveryPct')} style={{textAlign: 'right'}}>
                    Potential recovery % <SortArrow columnKey="potentialRecoveryPct" />
                  </th>
                  <th className={`num ${sortConfig?.key === 'actualRecoveryPct' ? 'col-sort-active' : ''}`} onClick={() => requestSort('actualRecoveryPct')} style={{textAlign: 'right'}}>
                    Actual recovery % <SortArrow columnKey="actualRecoveryPct" />
                  </th>
                </>
              )}

              <th className={`num ${sortConfig?.key === 'circularMass' ? 'col-sort-active' : ''}`} onClick={() => requestSort('circularMass')} style={{textAlign: 'right'}}>
                Circular mass (kg) <SortArrow columnKey="circularMass" />
              </th>
              <th onClick={() => requestSort('circularPct')} className={sortConfig?.key === 'circularPct' ? 'col-sort-active' : ''}>
                <span className="legend-box circular"></span> Circular outflow <SortArrow columnKey="circularPct" />
              </th>
              <th onClick={() => requestSort('linearPctOut')} className={sortConfig?.key === 'linearPctOut' ? 'col-sort-active' : ''}>
                <span className="legend-box linear"></span> Linear outflow <SortArrow columnKey="linearPctOut" />
              </th>
              <th onClick={() => requestSort('strategy')} className={sortConfig?.key === 'strategy' ? 'col-sort-active' : ''} style={{textAlign: 'right'}}>
                Strategy <SortArrow columnKey="strategy" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFlows.map((flow: any) => (
              <FlowRow
                key={flow.id}
                type={flow.type}
                strategy={flow.strategy}
                onStrategyChange={(newStrategy: string) => onStrategyChange(flow.id, newStrategy)}
                name={flow.name}
                mass={flow.mass}
                linearPct={flow.linearPct ? flow.linearPct + ',00' : ''}
                potentialRecoveryPct={flow.potentialRecoveryPct ? flow.potentialRecoveryPct + ',00' : ''}
                actualRecoveryPct={flow.actualRecoveryPct ? flow.actualRecoveryPct + ',00' : ''}
                circularMass={flow.circularMass}
                circularPct={flow.circularPct}
                linearPctOut={flow.linearPctOut}
                tags={flow.tags}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

const Step3Content = ({ flows }: any) => {
  const shortlistedFlows = flows.filter((f: any) => f.type === 'inflow' && (f.strategy === 'REFUSE' || f.strategy === 'REDUCE'));
  const shortlistedOutflows = flows.filter((f: any) => f.type === 'outflow' && f.strategy !== 'SELECT');

  const [edits, setEdits] = useState(() => {
    const initial: Record<string, any> = {};
    shortlistedFlows.forEach((f: any) => {
      initial[f.id] = {
        newMass: f.mass.toFixed(3).replace('.', ','),
        newLinearPct: f.linearPct.toString()
      };
    });
    shortlistedOutflows.forEach((f: any) => {
      initial[f.id] = {
        newMass: f.mass.toFixed(3).replace('.', ','),
        newActualRecoveryPct: f.actualRecoveryPct.toString()
      };
    });
    return initial;
  });

  const handleEdit = (id: string, field: string, value: string) => {
    setEdits((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  let totalMass = 0;
  let totalCircularMass = 0;
  
  flows.forEach((f: any) => {
    const edit = edits[f.id];
    if (edit && shortlistedFlows.some((sf: any) => sf.id === f.id)) {
      const parsedMass = parseFloat(edit.newMass.replace(',', '.'));
      const parsedLinear = parseFloat(edit.newLinearPct.replace(',', '.'));
      const m = isNaN(parsedMass) ? 0 : parsedMass;
      const l = isNaN(parsedLinear) ? 0 : parsedLinear;
      const cMass = m * (Math.max(0, 100 - l) / 100);
      totalMass += m;
      totalCircularMass += cMass;
    } else {
      totalMass += f.mass;
      totalCircularMass += f.circularMass;
    }
  });
  
  const totalLinearMass = totalMass - totalCircularMass;
  const circularPct = totalMass > 0 ? (totalCircularMass / totalMass) * 100 : 0;
  const linearPct = totalMass > 0 ? (totalLinearMass / totalMass) * 100 : 0;

  const actualRecoveryPct = circularPct * 0.8;
  const lostPotentialPct = circularPct * 0.2;
  const circularOutflowMass = totalMass * (actualRecoveryPct / 100);
  const linearOutflowMass = totalMass - circularOutflowMass;
  const linearOutflowPct = 100 - actualRecoveryPct;

  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedShortlisted = React.useMemo(() => {
    let sortableItems = [...shortlistedFlows];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [shortlistedFlows, sortConfig]);

  const SortArrow = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <span className="sort-arrow" />;
    return <span className={`sort-arrow ${sortConfig.direction}`} />;
  };

  return (
    <div className="step3-container">
      <div className="scenario-name-bar">
        <div className="scenario-label-wrap">
          <span className="scenario-label text-white">Scenario name</span>
          <span className="unsaved-badge">UNSAVED CHANGES</span>
        </div>
        <div className="scenario-input">Logitech PRO X2 SUPERSTRIKE baseline</div>
      </div>
      
      <div className="analyze-card glass-panel">
        <h2 className="strategy-title">Analyze and improve</h2>
        <p className="strategy-subtitle" style={{marginBottom: '1rem'}}>
          Analyze the circular performance of your flows, adjust their values, and explore improvement scenarios
        </p>
        
        <div className="scenario-dropdown-wrap">
          <div className="dropdown-label" style={{marginBottom: '0.5rem'}}>Scenario</div>
          <div className="filter-dropdown" style={{maxWidth: '300px'}}>
            <div className="dropdown-label">Baseline assessment performance</div>
            <ChevronDown size={20} />
          </div>
        </div>
        
        <div className="sankey-mocks">
           <div className="sankey-card">
             <h3 className="sankey-title">Inflow</h3>
             <div style={{height: '250px', position: 'relative', display: 'flex', flexDirection: 'column'}}>
               <div style={{flex: 1, display: 'flex', alignItems: 'center', position: 'relative'}}>
                 <div style={{width: '90%', height: `${Math.max(20, circularPct)}%`, minHeight: '20px', background: '#C4DD8A', borderTopRightRadius: '40px', borderBottomRightRadius: '40px'}}></div>
                 <div style={{position: 'absolute', right: '1rem', top: '10px', textAlign: 'right'}}>
                   <div style={{fontSize: '0.75rem', fontWeight: 700, color: '#1B1B3A'}}>Circular inflow</div>
                   <div style={{fontSize: '1.5rem', fontWeight: 800, color: '#1B1B3A'}}>{circularPct.toFixed(1).replace('.', ',')}%</div>
                   <div style={{fontSize: '0.75rem', color: '#1B1B3A'}}>{totalCircularMass.toFixed(3).replace('.', ',')} kg</div>
                 </div>
               </div>
               <div style={{flex: 1, display: 'flex', alignItems: 'center', position: 'relative'}}>
                 <div style={{width: '90%', height: `${Math.max(20, linearPct)}%`, minHeight: '20px', background: '#E2E8F0', borderTopRightRadius: '40px', borderBottomRightRadius: '40px'}}></div>
                 <div style={{position: 'absolute', right: '1rem', bottom: '10px', textAlign: 'right'}}>
                   <div style={{fontSize: '1.5rem', fontWeight: 800, color: '#1B1B3A'}}>{linearPct.toFixed(1).replace('.', ',')}%</div>
                   <div style={{fontSize: '0.75rem', color: '#1B1B3A'}}>{totalLinearMass.toFixed(3).replace('.', ',')} kg</div>
                   <div style={{fontSize: '0.75rem', fontWeight: 700, color: '#1B1B3A'}}>Linear inflow</div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="sankey-card">
             <h3 className="sankey-title">Breakdown of mass</h3>
             <div style={{height: '250px', position: 'relative', display: 'flex', flexDirection: 'column'}}>
               <div style={{display: 'flex', height: '100%'}}>
                 <div style={{flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '0.5rem', borderRight: '2px solid white'}}>
                   <div style={{flex: 1, background: '#C4DD8A', padding: '0.5rem'}}>
                     <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#1B1B3A'}}>Recovery potential</div>
                     <div style={{fontSize: '1.25rem', fontWeight: 800, color: '#1B1B3A'}}>{circularPct.toFixed(1).replace('.', ',')}%</div>
                     <div style={{fontSize: '0.65rem', color: '#1B1B3A'}}>{totalCircularMass.toFixed(3).replace('.', ',')} kg</div>
                   </div>
                   <div style={{flex: 1, background: '#E2E8F0', padding: '0.5rem'}}>
                     <div style={{fontSize: '1.25rem', fontWeight: 800, color: '#1B1B3A'}}>{linearPct.toFixed(1).replace('.', ',')}%</div>
                     <div style={{fontSize: '0.65rem', color: '#1B1B3A'}}>{totalLinearMass.toFixed(3).replace('.', ',')} kg</div>
                     <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#1B1B3A'}}>Linear outflow</div>
                   </div>
                 </div>
                 <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                   <div style={{flex: 1, background: '#C4DD8A', padding: '0.5rem'}}>
                     <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#1B1B3A'}}>Actual recovery</div>
                     <div style={{fontSize: '1.25rem', fontWeight: 800, color: '#1B1B3A'}}>{actualRecoveryPct.toFixed(1).replace('.', ',')}%</div>
                     <div style={{fontSize: '0.65rem', color: '#1B1B3A'}}>{circularOutflowMass.toFixed(3).replace('.', ',')} kg</div>
                   </div>
                   <div style={{height: '60px', background: 'linear-gradient(to right, #C4DD8A, #E2E8F0)', padding: '0.5rem', textAlign: 'center'}}>
                     <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#1B1B3A'}}>Lost potential</div>
                     <div style={{fontSize: '1.1rem', fontWeight: 800, color: '#1B1B3A'}}>{lostPotentialPct.toFixed(1).replace('.', ',')}%</div>
                     <div style={{fontSize: '0.65rem', color: '#1B1B3A'}}>{(totalCircularMass - circularOutflowMass).toFixed(3).replace('.', ',')} kg</div>
                   </div>
                   <div style={{flex: 1, background: '#E2E8F0'}}></div>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="sankey-card">
             <h3 className="sankey-title">Outflow</h3>
             <div style={{height: '250px', position: 'relative', display: 'flex', flexDirection: 'column'}}>
               <div style={{flex: 1, display: 'flex', alignItems: 'center', position: 'relative'}}>
                 <div style={{width: '90%', height: `${Math.max(20, actualRecoveryPct)}%`, minHeight: '20px', background: '#C4DD8A', borderTopLeftRadius: '40px', borderBottomLeftRadius: '40px', marginLeft: '10%'}}></div>
                 <div style={{position: 'absolute', left: '1rem', top: '10px', textAlign: 'left'}}>
                   <div style={{fontSize: '0.75rem', fontWeight: 700, color: '#1B1B3A'}}>Circular outflow</div>
                   <div style={{fontSize: '1.5rem', fontWeight: 800, color: '#1B1B3A'}}>{actualRecoveryPct.toFixed(1).replace('.', ',')}%</div>
                   <div style={{fontSize: '0.75rem', color: '#1B1B3A'}}>{circularOutflowMass.toFixed(3).replace('.', ',')} kg</div>
                 </div>
               </div>
               <div style={{flex: 1, display: 'flex', alignItems: 'center', position: 'relative'}}>
                 <div style={{width: '90%', height: `${Math.max(20, linearOutflowPct)}%`, minHeight: '20px', background: '#E2E8F0', borderTopLeftRadius: '40px', borderBottomLeftRadius: '40px', marginLeft: '10%'}}></div>
                 <div style={{position: 'absolute', left: '1rem', bottom: '10px', textAlign: 'left'}}>
                   <div style={{fontSize: '1.5rem', fontWeight: 800, color: '#1B1B3A'}}>{linearOutflowPct.toFixed(1).replace('.', ',')}%</div>
                   <div style={{fontSize: '0.75rem', color: '#1B1B3A'}}>{linearOutflowMass.toFixed(3).replace('.', ',')} kg</div>
                   <div style={{fontSize: '0.75rem', fontWeight: 700, color: '#1B1B3A'}}>Linear outflow</div>
                 </div>
               </div>
             </div>
           </div>
        </div>
        
        <div className="collapsible-bar">
          <span>Scenario performance vs Baseline Product Performance</span>
          <ChevronDown size={20} />
        </div>
      </div>
      
      <div className="flows-section">
        <div className="section-header">
          <h2 className="section-title">INFLOWS</h2>
          <button className="add-flow-btn"><Plus size={16}/> ADD INFLOW</button>
        </div>
        
        <div className="table-wrapper">
          <table className="flows-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} className={sortConfig?.key === 'name' ? 'col-sort-active' : ''}>
                  INFLOWS <SortArrow columnKey="name" />
                </th>
                <th className={`num ${sortConfig?.key === 'mass' ? 'col-sort-active' : ''}`} onClick={() => requestSort('mass')} style={{textAlign: 'right'}}>
                  Total mass (kg) <SortArrow columnKey="mass" />
                </th>
                <th className={`num ${sortConfig?.key === 'linearPct' ? 'col-sort-active' : ''}`} onClick={() => requestSort('linearPct')} style={{textAlign: 'right'}}>
                  Linear % <SortArrow columnKey="linearPct" />
                </th>
                <th className={`num ${sortConfig?.key === 'circularMass' ? 'col-sort-active' : ''}`} onClick={() => requestSort('circularMass')} style={{textAlign: 'right'}}>
                  Circular mass (kg) <SortArrow columnKey="circularMass" />
                </th>
                <th onClick={() => requestSort('circularPct')} className={sortConfig?.key === 'circularPct' ? 'col-sort-active' : ''}>
                  <span className="legend-box circular"></span> Circular outflow <SortArrow columnKey="circularPct" />
                </th>
                <th onClick={() => requestSort('linearPctOut')} className={sortConfig?.key === 'linearPctOut' ? 'col-sort-active' : ''}>
                  <span className="legend-box linear"></span> Linear outflow <SortArrow columnKey="linearPctOut" />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedShortlisted.map((flow: any) => {
                 const currentEdit = edits[flow.id] || { newMass: flow.mass.toFixed(3).replace('.', ','), newLinearPct: flow.linearPct.toString() };
                 
                 const rawNewMass = parseFloat(currentEdit.newMass.replace(',', '.'));
                 const parsedNewMass = isNaN(rawNewMass) ? 0 : rawNewMass;
                 const massDiff = parsedNewMass - flow.mass;
                 
                 const rawNewLinear = parseFloat(currentEdit.newLinearPct.replace(',', '.'));
                 const parsedNewLinear = isNaN(rawNewLinear) ? 0 : rawNewLinear;
                 
                 const newCircularPct = Math.max(0, 100 - parsedNewLinear);
                 const newCircularMass = parsedNewMass * (newCircularPct / 100);
                 const circularDiff = newCircularMass - flow.circularMass;

                 let statusTagClass = 'refuse-yellow';
                 let statusLabel = flow.strategy;
  
                 if (flow.strategy === 'REFUSE') {
                   if (parsedNewMass === 0) statusTagClass = 'refuse-green';
                   else statusTagClass = 'refuse-yellow';
                 } else if (flow.strategy === 'REDUCE') {
                   if (parsedNewMass < flow.mass) statusTagClass = 'reduce-green';
                   else statusTagClass = 'reduce-yellow';
                 }
  
                 return (
                   <tr className="flow-row" key={flow.id}>
                     <td>
                       <div className="flow-tags">
                         {flow.tags.map((tag: string, i: number) => (
                           <span key={i} className={`mini-tag ${tag.toLowerCase().replace(' ', '-')}`}>{tag}</span>
                         ))}
                         <span className={`mini-tag ${flow.strategy.toLowerCase()}`}>FOCUS {flow.strategy}</span>
                         <span className={`mini-tag ${statusTagClass}`}>{statusLabel}</span>
                       </div>
                       <div className="flow-name">{flow.name}</div>
                     </td>

                     <td className="num" style={{ verticalAlign: 'bottom', textAlign: 'right' }}>
                       <div style={{ height: '18px', fontSize: '12px', fontWeight: 600 }}>
                         {Math.abs(massDiff) > 0.000001 && (
                           <span style={{color: massDiff < 0 ? '#22C55E' : '#EF4444'}}>
                             {massDiff > 0 ? '+' : '-'}{Math.abs(massDiff).toFixed(3).replace('.', ',')}
                           </span>
                         )}
                       </div>
                       <input 
                         type="text" 
                         value={currentEdit.newMass} 
                         onChange={(e) => handleEdit(flow.id, 'newMass', e.target.value)} 
                         style={{ 
                           width: '100%', 
                           border: 'none', 
                           background: 'transparent', 
                           outline: 'none', 
                           color: 'inherit',
                           fontFamily: 'inherit',
                           fontSize: 'inherit',
                           fontWeight: 600,
                           textAlign: 'right',
                           padding: 0 
                         }}
                       />
                     </td>

                     <td className="num" style={{ verticalAlign: 'bottom', textAlign: 'right' }}>
                       <div style={{ height: '18px', fontSize: '12px', fontWeight: 600 }}>
                         {Math.abs(parsedNewLinear - flow.linearPct) > 0.01 && (
                           <span style={{color: (parsedNewLinear - flow.linearPct) < 0 ? '#22C55E' : '#EF4444'}}>
                             {(parsedNewLinear - flow.linearPct) > 0 ? '+' : '-'}{Math.abs(parsedNewLinear - flow.linearPct).toFixed(2).replace('.', ',')}
                           </span>
                         )}
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                         <input 
                           type="text" 
                           value={currentEdit.newLinearPct} 
                           onChange={(e) => handleEdit(flow.id, 'newLinearPct', e.target.value)} 
                           style={{ 
                             flex: 1,
                             minWidth: 0,
                             border: 'none', 
                             background: 'transparent', 
                             outline: 'none', 
                             color: 'inherit',
                             fontFamily: 'inherit',
                             fontSize: 'inherit',
                             fontWeight: 600,
                             textAlign: 'right',
                             padding: 0 
                           }}
                         />
                         <span style={{ fontWeight: 600, marginLeft: '2px' }}>%</span>
                       </div>
                     </td>

                     <td className="num" style={{ verticalAlign: 'bottom', paddingBottom: '16px', textAlign: 'right' }}>
                       <div style={{ height: '18px', fontSize: '12px', fontWeight: 600 }}>
                         {Math.abs(circularDiff) > 0.000001 && (
                           <span style={{color: circularDiff > 0 ? '#22C55E' : '#EF4444'}}>
                             {circularDiff > 0 ? '+' : '-'}{Math.abs(circularDiff).toFixed(3).replace('.', ',')}
                           </span>
                         )}
                       </div>
                       <div style={{ fontWeight: 600 }}>{newCircularMass.toFixed(3).replace('.', ',')}</div>
                     </td>

                     <td colSpan={2} style={{ verticalAlign: 'bottom', paddingBottom: '16px' }}>
                       <div className="stacked-bar-cell">
                         <div className="stacked-bar">
                           <div className="bar linear" style={{width: `${parsedNewLinear}%`}}></div>
                           <div className="bar circular" style={{width: `${newCircularPct}%`}}></div>
                         </div>
                         <div className="stacked-labels">
                           <div>{newCircularPct.toFixed(2).replace('.', ',')} % <span className="text-light">C-I</span></div>
                           <div>{parsedNewLinear.toFixed(2).replace('.', ',')} % <span className="text-light">L-I</span></div>
                         </div>
                       </div>
                     </td>
                     <td></td>
                   </tr>
                 );
              })}
              {shortlistedFlows.length === 0 && (
                <tr>
                  <td colSpan={7} style={{textAlign: 'center', padding: '3rem', color: '#64748B', fontWeight: 600}}>No selected strategy inflows.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="section-header" style={{marginTop: '3rem'}}>
          <h2 className="section-title">OUTFLOWS</h2>
          <button className="add-flow-btn"><Plus size={16}/> ADD OUTFLOW</button>
        </div>
        
        <div className="table-wrapper">
          <table className="flows-table">
            <thead>
              <tr>
                <th>OUTFLOWS</th>
                <th className="num" style={{textAlign: 'right'}}>Total mass (kg)</th>
                <th className="num" style={{textAlign: 'right'}}>Potential recovery %</th>
                <th className="num" style={{textAlign: 'right'}}>Actual recovery %</th>
                <th className="num" style={{textAlign: 'right'}}>Circular mass (kg)</th>
                <th><span className="legend-box circular"></span> Circular outflow &nbsp;&nbsp;<span className="legend-box linear"></span> Linear outflow</th>
              </tr>
            </thead>
            <tbody>
              {shortlistedOutflows.map((flow: any) => {
                 const currentEdit = edits[flow.id] || { newMass: flow.mass.toFixed(3).replace('.', ','), newActualRecoveryPct: flow.actualRecoveryPct.toString() };
                 
                 const rawNewMass = parseFloat(currentEdit.newMass.replace(',', '.'));
                 const parsedNewMass = isNaN(rawNewMass) ? 0 : rawNewMass;
                 const massDiff = parsedNewMass - flow.mass;
                 
                 const rawNewActual = parseFloat(currentEdit.newActualRecoveryPct.replace(',', '.'));
                 const parsedNewActual = isNaN(rawNewActual) ? 0 : rawNewActual;
                 
                 const newCircularMass = parsedNewMass * (parsedNewActual / 100);
                 const circularDiff = newCircularMass - flow.circularMass;
                 const newLinearPct = 100 - parsedNewActual;

                 let statusTagClass = 'reduce-yellow';
                 if (parsedNewActual > flow.actualRecoveryPct) statusTagClass = 'reduce-green';
  
                 return (
                   <tr className="flow-row" key={flow.id}>
                     <td>
                       <div className="flow-tags">
                         {flow.tags.map((tag: string, i: number) => (
                           <span key={i} className={`mini-tag ${tag.toLowerCase().replace(' ', '-')}`}>{tag}</span>
                         ))}
                         <span className={`mini-tag ${flow.strategy.toLowerCase()}`}>FOCUS {flow.strategy}</span>
                         <span className={`mini-tag ${statusTagClass}`}>{flow.strategy}</span>
                       </div>
                       <div className="flow-name">{flow.name}</div>
                     </td>

                     <td className="num" style={{ verticalAlign: 'bottom', textAlign: 'right' }}>
                       <div style={{ height: '18px', fontSize: '12px', fontWeight: 600 }}>
                         {Math.abs(massDiff) > 0.000001 && (
                           <span style={{color: massDiff < 0 ? '#22C55E' : '#EF4444'}}>
                             {massDiff > 0 ? '+' : '-'}{Math.abs(massDiff).toFixed(3).replace('.', ',')}
                           </span>
                         )}
                       </div>
                       <input 
                         type="text" 
                         value={currentEdit.newMass} 
                         onChange={(e) => handleEdit(flow.id, 'newMass', e.target.value)} 
                         style={{ 
                           width: '100%', 
                           border: 'none', 
                           background: 'transparent', 
                           outline: 'none', 
                           color: 'inherit',
                           fontFamily: 'inherit',
                           fontSize: 'inherit',
                           fontWeight: 600,
                           textAlign: 'right',
                           padding: 0 
                         }}
                       />
                     </td>

                     <td className="num" style={{ verticalAlign: 'bottom', textAlign: 'right', paddingBottom: '16px' }}>
                       <div style={{ height: '18px' }}></div>
                       <div style={{ fontWeight: 600 }}>{flow.potentialRecoveryPct.toFixed(2).replace('.', ',')}</div>
                     </td>

                     <td className="num" style={{ verticalAlign: 'bottom', textAlign: 'right' }}>
                       <div style={{ height: '18px', fontSize: '12px', fontWeight: 600 }}>
                         {Math.abs(parsedNewActual - flow.actualRecoveryPct) > 0.01 && (
                           <span style={{color: (parsedNewActual - flow.actualRecoveryPct) > 0 ? '#22C55E' : '#EF4444'}}>
                             {(parsedNewActual - flow.actualRecoveryPct) > 0 ? '+' : '-'}{Math.abs(parsedNewActual - flow.actualRecoveryPct).toFixed(2).replace('.', ',')}
                           </span>
                         )}
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                         <input 
                           type="text" 
                           value={currentEdit.newActualRecoveryPct} 
                           onChange={(e) => handleEdit(flow.id, 'newActualRecoveryPct', e.target.value)} 
                           style={{ 
                             flex: 1,
                             minWidth: 0,
                             border: 'none', 
                             background: 'transparent', 
                             outline: 'none', 
                             color: 'inherit',
                             fontFamily: 'inherit',
                             fontSize: 'inherit',
                             fontWeight: 600,
                             textAlign: 'right',
                             padding: 0 
                           }}
                         />
                         <span style={{ fontWeight: 600, marginLeft: '2px' }}>%</span>
                       </div>
                     </td>

                     <td className="num" style={{ verticalAlign: 'bottom', paddingBottom: '16px', textAlign: 'right' }}>
                       <div style={{ height: '18px', fontSize: '12px', fontWeight: 600 }}>
                         {Math.abs(circularDiff) > 0.000001 && (
                           <span style={{color: circularDiff > 0 ? '#22C55E' : '#EF4444'}}>
                             {circularDiff > 0 ? '+' : '-'}{Math.abs(circularDiff).toFixed(3).replace('.', ',')}
                           </span>
                         )}
                       </div>
                       <div style={{ fontWeight: 600 }}>{newCircularMass.toFixed(3).replace('.', ',')}</div>
                     </td>

                     <td style={{ verticalAlign: 'bottom', paddingBottom: '16px' }}>
                       <div className="stacked-bar-cell">
                         <div className="stacked-bar">
                           <div className="bar circular" style={{width: `${parsedNewActual}%`}}></div>
                           <div className="bar linear" style={{width: `${newLinearPct}%`}}></div>
                         </div>
                         <div className="stacked-labels">
                           <div>{parsedNewActual.toFixed(2).replace('.', ',')} % <span className="text-light">C-O</span></div>
                           <div>{newLinearPct.toFixed(2).replace('.', ',')} % <span className="text-light">L-O</span></div>
                         </div>
                       </div>
                     </td>
                   </tr>
                 );
              })}
              {shortlistedOutflows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', padding: '3rem', color: '#64748B', fontWeight: 600}}>No focused outflows.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="change-log-container">
        <div className="change-log-col">
          <h4>Inflow Change Log</h4>
          <ul className="change-log-list">
            {shortlistedFlows.map((flow: any) => {
               const currentEdit = edits[flow.id] || { newMass: flow.mass.toFixed(3).replace('.', ',') };
               const parsedNewMass = parseFloat(currentEdit.newMass.replace(',', '.'));
               const newMass = isNaN(parsedNewMass) ? 0 : parsedNewMass;
               
               if (Math.abs(newMass - flow.mass) < 0.000001) return null;

               let impactStr = '';
               let impactColor = '';
               let achievedStr = '';
  
               if (flow.strategy === 'REFUSE') {
                 if (newMass === 0) {
                   achievedStr = 'REFUSE target was achieved.';
                   impactStr = 'Improvement';
                   impactColor = '#22C55E';
                 } else {
                   achievedStr = 'REFUSE target was partially achieved.';
                   impactStr = 'Half improvement';
                   impactColor = '#FBBF24';
                 }
               } else if (flow.strategy === 'REDUCE') {
                 if (newMass < flow.mass) {
                   achievedStr = 'REDUCE target was achieved.';
                   impactStr = 'Improvement';
                   impactColor = '#22C55E';
                 } else {
                   achievedStr = 'No REDUCE applied yet.';
                   impactStr = 'Neutral';
                   impactColor = '#94A3B8';
                 }
               }
  
               return (
                 <li key={flow.id}>
                   <strong>{flow.name}</strong> was updated for {flow.strategy}: total mass <strong>{flow.mass.toFixed(3)} kg -&gt; {newMass.toFixed(3)} kg</strong>; {achievedStr} Overall impact: <span style={{color: impactColor, fontWeight: 700}}>{impactStr}</span>.
                 </li>
               );
            })}
            {shortlistedFlows.filter((f: any) => {
               const parsed = parseFloat((edits[f.id]?.newMass || '').replace(',', '.'));
               return Math.abs((isNaN(parsed) ? 0 : parsed) - f.mass) > 0.000001;
            }).length === 0 && (
              <p style={{margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.6)'}}>No manual edits applied yet. Type in the table to see impact.</p>
            )}
          </ul>
        </div>
        <div className="change-log-col">
          <h4>Outflow Change Log</h4>
          <ul className="change-log-list">
            {shortlistedOutflows.map((flow: any) => {
               const currentEdit = edits[flow.id] || { newActualRecoveryPct: flow.actualRecoveryPct.toString() };
               const parsedNewActual = parseFloat(currentEdit.newActualRecoveryPct.replace(',', '.'));
               const newActual = isNaN(parsedNewActual) ? 0 : parsedNewActual;
               
               if (Math.abs(newActual - flow.actualRecoveryPct) < 0.01) return null;

               let impactStr = newActual > flow.actualRecoveryPct ? 'Improvement' : 'Decline';
               let impactColor = newActual > flow.actualRecoveryPct ? '#22C55E' : '#EF4444';
  
               return (
                 <li key={flow.id}>
                   <strong>{flow.name}</strong> was updated for {flow.strategy}: Actual Recovery <strong>{flow.actualRecoveryPct.toFixed(2)}% -&gt; {newActual.toFixed(2)}%</strong>. Overall impact: <span style={{color: impactColor, fontWeight: 700}}>{impactStr}</span>.
                 </li>
               );
            })}
            {shortlistedOutflows.filter((f: any) => {
               const parsed = parseFloat((edits[f.id]?.newActualRecoveryPct || '').replace(',', '.'));
               return Math.abs((isNaN(parsed) ? 0 : parsed) - f.actualRecoveryPct) > 0.01;
            }).length === 0 && (
              <p style={{margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.6)'}}>No outflow changes were applied in this review.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeMenu, setActiveMenu] = useState('analysis');
  const [currentStep, setCurrentStep] = useState(2);
  const [flows, setFlows] = useState([
    { id: 'f1', type: 'inflow', name: 'ABS plastic housing – polycarbonate blend', mass: 0.032, linearPct: 60, circularMass: 0.0128, circularPct: 40, linearPctOut: 60, tags: ['PRODUCT'], strategy: 'REFUSE' },
    { id: 'f2', type: 'inflow', name: 'Rechargeable Li-ion Battery – lithium cobalt oxide', mass: 0.012, linearPct: 85, circularMass: 0.0018, circularPct: 15, linearPctOut: 85, tags: ['PRODUCT'], strategy: 'REDUCE' },
    { id: 'f3', type: 'inflow', name: 'PCB circuit board – FR4 fiberglass composite', mass: 0.016, linearPct: 50, circularMass: 0.008, circularPct: 50, linearPctOut: 50, tags: ['PRODUCT'], strategy: 'SELECT' },
    { id: 'f4', type: 'inflow', name: 'Carton packaging box', mass: 0.080, linearPct: 100, circularMass: 0.000, circularPct: 0, linearPctOut: 100, tags: ['PACKAGING'], strategy: 'SELECT' },
    { id: 'f5', type: 'inflow', name: 'Plastic cover film – PET', mass: 0.020, linearPct: 100, circularMass: 0.000, circularPct: 0, linearPctOut: 100, tags: ['PACKAGING'], strategy: 'SELECT' },
    { id: 'o1', type: 'outflow', name: 'Product assembly end of life', mass: 0.060, potentialRecoveryPct: 50, actualRecoveryPct: 20, circularMass: 0.012, circularPct: 20, linearPctOut: 80, tags: ['PRODUCT'], strategy: 'IMPROVE' },
    { id: 'o2', type: 'outflow', name: 'Packaging waste collection', mass: 0.100, potentialRecoveryPct: 100, actualRecoveryPct: 80, circularMass: 0.080, circularPct: 80, linearPctOut: 20, tags: ['PACKAGING'], strategy: 'SELECT' }
  ]);

  const handleStrategyChange = (id: string, strategy: string) => {
    setFlows(prev => prev.map(f => f.id === id ? { ...f, strategy } : f));
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Find your assessment to analyse";
      case 2: return "Set circularity intentions and goals";
      case 3: return "Set circularity intentions and goals";
      default: return "";
    }
  };

  const getStepSubtitle = () => {
    switch(currentStep) {
      case 1: return "Search by the name, or use the labels to find which assessment to work on";
      case 2: return "Define which material flows you want to Refuse (eliminate) or Reduce. Flows with no strategy will remain at their baseline values.";
      case 3: return "Define which material flows you want to Refuse (eliminate) or Reduce. Flows with no strategy will remain at their baseline values.";
      default: return "";
    }
  };

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">CTI<br/>TOOL<span className="logo-pro">PRO</span></div>
        </div>
        
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveMenu('dashboard')}>
            <div className="icon-wrapper"><LayoutDashboard size={20} /></div>
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeMenu === 'analysis' ? 'active' : ''}`} onClick={() => setActiveMenu('analysis')}>
            <div className="icon-wrapper"><BarChart2 size={20} /></div>
            <span>Analysis</span>
          </div>
          <div className={`nav-item ${activeMenu === 'assessments' ? 'active' : ''}`} onClick={() => setActiveMenu('assessments')}>
            <div className="icon-wrapper"><Database size={20} /></div>
            <span>Assessments</span>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className={`nav-item ${activeMenu === 'organization' ? 'active' : ''}`} onClick={() => setActiveMenu('organization')}>
            <div className="icon-wrapper"><Building2 size={20} /></div>
            <span>Organization</span>
          </div>
          <div className={`nav-item ${activeMenu === 'personal' ? 'active' : ''}`} onClick={() => setActiveMenu('personal')}>
            <div className="icon-wrapper"><User size={20} /></div>
            <span>Personal</span>
          </div>
          
          <div className="powered-by">
            Powered by
            <div className="circ-iq-logo">CIRC<br/>IQ</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="main-wrapper">
        {/* TOP ACTIONS */}
        <div className="top-actions">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <button className="top-btn">
            <Target size={18} /> GOALS
          </button>
          <button className="top-btn primary">
            <BookOpen size={18} /> CIRCULAR GUIDANCE
          </button>
        </div>

        {/* HEADER BANNER WITH STEPS */}
        <div className="page-header-banner">
          <div className="steps-container">
            <div className={`step ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
              STEP 1
            </div>
            <div className="step-divider"></div>
            <div className={`step ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>
              STEP 2
            </div>
            <div className="step-divider"></div>
            <div className={`step ${currentStep === 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
              STEP 3
            </div>
          </div>

          <h1 className="header-title">{getStepTitle()}</h1>
          <p className="header-subtitle">{getStepSubtitle()}</p>
        </div>

        {/* PAGE CONTENT */}
        <div className="page-content">
          {currentStep === 1 && <Step1Content onNextStep={() => setCurrentStep(2)} />}
          {currentStep === 2 && <Step2Content flows={flows} onStrategyChange={handleStrategyChange} />}
          {currentStep === 3 && <Step3Content flows={flows} />}

          {/* Stepper Navigation */}
          <div className="operation-island">
            <button 
              className="nav-arrow-btn" 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              style={{ opacity: currentStep === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="island-right">
              {currentStep < 3 ? (
                <button 
                  className="next-step-btn"
                  onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                >
                  NEXT
                </button>
              ) : (
                <button 
                  className="next-step-btn"
                  onClick={() => alert("Scenario created!")}
                >
                  CREATE NEW SCENARIO
                </button>
              )}
              
              <button className="nav-arrow-btn" onClick={() => console.log('close')}>
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
