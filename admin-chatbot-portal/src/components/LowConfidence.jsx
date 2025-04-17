import { useState } from 'react';

const LowConfidence = ({ queries, onResolve, onAddTraining }) => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [trainingResponse, setTrainingResponse] = useState('');
  const [action, setAction] = useState('');

  const handleQueryClick = (query, index) => {
    setSelectedQuery({ ...query, index });
    setTrainingResponse('');
    setAction('');
  };

  const handleAddTraining = () => {
    if (!trainingResponse.trim()) {
      alert('Please provide a response for training');
      return;
    }
    onAddTraining(selectedQuery.question, trainingResponse);
    setSelectedQuery(null);
  };

  const handleAction = (action) => {
    setAction(action);
  };

  const handleResolve = () => {
    onResolve(selectedQuery.index);
    setSelectedQuery(null);
  };

  return (
    <div className="flex md:flex-row flex-col">
      <div className="md:w-1/2 w-full mr-4">
        <h3 className="text-lg font-medium mb-3">Low Confidence Queries</h3>
        {queries.length === 0 ? (
          <p className="text-gray-500">No low-confidence queries yet.</p>
        ) : (
          <ul className="space-y-2">
            {queries.map((q, idx) => (
              <li 
                key={idx}
                onClick={() => handleQueryClick(q, idx)}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                  selectedQuery && selectedQuery.index === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{q.question}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    q.confidence < 30 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {q.confidence}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedQuery && (
        <div className="md:w-1/2 w-full mt-4 md:mt-0 border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Query Details</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Question:</p>
            <p className="font-medium">{selectedQuery.question}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Confidence:</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${selectedQuery.confidence < 30 ? 'bg-red-500' : 'bg-yellow-500'}`}
                style={{ width: `${selectedQuery.confidence}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1">{selectedQuery.confidence}% confidence</p>
          </div>

          <div className="mb-4">
            <p className="font-medium mb-2">Take action:</p>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleAction('train')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  action === 'train' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Add Training Data
              </button>
              <button 
                onClick={handleResolve}
                className="px-3 py-2 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200"
              >
                Mark as Resolved
              </button>
              <button 
                onClick={() => handleAction('flag')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  action === 'flag' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Flag for Review
              </button>
            </div>
          </div>

          {action === 'train' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provide correct response for training:
              </label>
              <textarea
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={trainingResponse}
                onChange={(e) => setTrainingResponse(e.target.value)}
                placeholder="Enter the correct response..."
              ></textarea>
              <button
                onClick={handleAddTraining}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Training Data
              </button>
            </div>
          )}

          {action === 'flag' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">
                This query has been flagged for review by the AI team. They will analyze and improve the model accordingly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LowConfidence;