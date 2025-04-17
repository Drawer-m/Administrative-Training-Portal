import { FaRobot, FaExclamationTriangle, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };
  
  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4 font-bold text-xl border-b border-gray-700">
        Admin Portal
      </div>
      
      <nav className="mt-6">
        <button 
          onClick={() => setActiveTab('chatbot')}
          className={`flex items-center px-4 py-3 w-full text-left ${
            activeTab === 'chatbot' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          aria-label="Chatbot Testing"
        >
          <FaRobot className="mr-3" />
          Chatbot Testing
        </button>
        
        <button 
          onClick={() => setActiveTab('low-confidence')}
          className={`flex items-center px-4 py-3 w-full text-left ${
            activeTab === 'low-confidence' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          aria-label="Low Confidence Queries"
        >
          <FaExclamationTriangle className="mr-3" />
          Low Confidence
        </button>
        
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center px-4 py-3 w-full text-left ${
            activeTab === 'analytics' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          aria-label="Analytics Dashboard"
        >
          <FaChartBar className="mr-3" />
          Analytics
        </button>
      </nav>
      
      <div className="absolute bottom-0 w-64 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-700 text-red-300"
          aria-label="Log out"
        >
          <FaSignOutAlt className="mr-3" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;