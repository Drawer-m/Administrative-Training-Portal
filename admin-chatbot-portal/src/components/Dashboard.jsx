import { useState } from 'react';
import Chatbot from './Chatbot';
import LowConfidence from './LowConfidence';
import Analytics from './Analytics';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [lowConfidenceQueries, setLowConfidenceQueries] = useState([]);
  const [activeTab, setActiveTab] = useState('chatbot');
  const [isLoading, setIsLoading] = useState(false);

  const handleLowConfidence = (query) => {
    setLowConfidenceQueries(prev => [...prev, query]);
  };

  const handleResolveQuery = (index) => {
    setLowConfidenceQueries(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddTrainingData = (query, response) => {
    // Simulate adding training data
    console.log(`Adding training data for: ${query} with response: ${response}`);
    // In a real app, you would make an API call to add this to your training data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Remove from low confidence list
      handleResolveQuery(lowConfidenceQueries.findIndex(q => q.question === query));
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Training Portal</h1>
        
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p>Processing request...</p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'chatbot' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Chatbot Testing</h2>
            <Chatbot onLowConfidence={handleLowConfidence} />
          </div>
        )}
        
        {activeTab === 'low-confidence' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Low Confidence Queries</h2>
            <LowConfidence 
              queries={lowConfidenceQueries} 
              onResolve={handleResolveQuery}
              onAddTraining={handleAddTrainingData}
            />
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
            <Analytics queries={lowConfidenceQueries} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;