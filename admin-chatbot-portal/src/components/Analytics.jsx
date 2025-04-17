import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Analytics = ({ queries }) => {
  // Generate mock data for demonstration
  const generateMockData = () => {
    return {
      dailyQueries: [45, 52, 38, 60, 55, 78, 42],
      responseTime: [0.8, 0.7, 0.9, 0.6, 0.8, 0.7, 0.5],
      categories: {
        'Student Services': 35,
        'Course Information': 28,
        'Technical Support': 18,
        'Faculty Questions': 12,
        'Other': 7
      }
    };
  };

  const mockData = generateMockData();
  
  // Calculate confidence metrics from actual queries
  const confidenceData = {
    high: queries.filter(q => q.confidence >= 70).length,
    medium: queries.filter(q => q.confidence >= 50 && q.confidence < 70).length,
    low: queries.filter(q => q.confidence < 50).length,
    total: queries.length + mockData.dailyQueries.reduce((acc, val) => acc + val, 0) - (queries.length)
  };

  const barData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Queries per Day',
        data: mockData.dailyQueries,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 1,
      }
    ]
  };

  const lineData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Avg. Response Time (s)',
        data: mockData.responseTime,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const doughnutData = {
    labels: Object.keys(mockData.categories),
    datasets: [{
      data: Object.values(mockData.categories),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Queries</h3>
          <p className="text-2xl font-bold">{confidenceData.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">High Confidence</h3>
          <p className="text-2xl font-bold text-green-600">{confidenceData.high}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Medium Confidence</h3>
          <p className="text-2xl font-bold text-yellow-600">{confidenceData.medium}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Low Confidence</h3>
          <p className="text-2xl font-bold text-red-600">{confidenceData.low}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Queries per Day</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Response Time</h3>
          <Line data={lineData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Query Categories</h3>
          <div className="w-full max-w-md mx-auto">
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Recent Improvements</h3>
          <ul className="space-y-2">
            <li className="p-2 border-l-4 border-green-500 bg-green-50">
              <p className="font-medium">Course Registration Process</p>
              <p className="text-sm text-gray-600">Confidence improved from 48% to 92%</p>
            </li>
            <li className="p-2 border-l-4 border-green-500 bg-green-50">
              <p className="font-medium">Financial Aid Requirements</p>
              <p className="text-sm text-gray-600">Confidence improved from 53% to 88%</p>
            </li>
            <li className="p-2 border-l-4 border-yellow-500 bg-yellow-50">
              <p className="font-medium">Campus Housing Options</p>
              <p className="text-sm text-gray-600">In progress - Current confidence 67%</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;