
const fs = require("fs");
const path = "c:/Users/jeeha/Desktop/BeatFlix/Frontend/src/pages/AdminDashboard.js";
let content = fs.readFileSync(path, "utf8");

// 1. Add FaBars, FaTimes to imports
content = content.replace(
  /FaGoogle, FaEnvelope, FaCheckCircle, FaChartPie\n\} from 'react-icons\/fa';/,
  "FaGoogle, FaEnvelope, FaCheckCircle, FaChartPie,\n  FaBars, FaTimes\n} from 'react-icons/fa';"
);

// 2. Add isSidebarOpen state
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState\('overview'\);/,
  "const [activeTab, setActiveTab] = useState('overview');\n  const [isSidebarOpen, setIsSidebarOpen] = useState(false);"
);

// 3. Update sidebar nav buttons to close sidebar on click
content = content.replace(/onClick=\{\(\) => setActiveTab\('overview'\)\}/g, "onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}");
content = content.replace(/onClick=\{\(\) => setActiveTab\('movies'\)\}/g, "onClick={() => { setActiveTab('movies'); setIsSidebarOpen(false); }}");
content = content.replace(/onClick=\{\(\) => setActiveTab\('users'\)\}/g, "onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}");
content = content.replace(/onClick=\{\(\) => setActiveTab\('settings'\)\}/g, "onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}");

// 4. Update the layout JSX
const newLayoutStart = `
    <div className="admin-layout-simple">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <aside className={\`sidebar-simple \${isSidebarOpen ? 'open' : '}\`}>
        <div className="sidebar-brand-wrapper">
          <div className="sidebar-brand">BeatFlix</div>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}><FaTimes /></button>
        </div>
`;
content = content.replace(
  /<div className="admin-layout-simple">\s*<aside className="sidebar-simple">\s*<div className="sidebar-brand">\s*BeatFlix\s*<\/div>/,
  newLayoutStart
);

const newHeader = `
        <header className="header-simple">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <FaBars />
            </button>
            <div className="header-title">
`;
content = content.replace(
  /<header className="header-simple">\s*<div className="header-title">/,
  newHeader
);

const headerClose = `
            {activeTab === 'settings' && 'Platform Settings'}
            </div>
          </div>
          <div className="header-profile">
`;
content = content.replace(
  /\{activeTab === 'settings' && 'Platform Settings'\}\s*<\/div>\s*<div className="header-profile">/,
  headerClose
);

fs.writeFileSync(path, content);

