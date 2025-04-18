# Administrative Training Portal with Integrated AI Chatbot

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green)

A full-fledged administrative interface where administrators can test, monitor, and improve an AI-powered educational chatbot. This portal enables administrators to analyze chatbot performance, manage low-confidence responses, and enhance the AI through training data input.

![Dashboard Screenshot](https://via.placeholder.com/800x450?text=AdminBot+Dashboard)

## 🚀 Live Demo

**Deployment URL**: [Administrative Training Portal](https://admin-chatbot-portal.vercel.app/)

**Admin Credentials**:
- Username: `admin`
- Password: `admin123`

## ✨ Features

### 🔒 Authentication
- Secure admin-only access
- Session persistence with localStorage
- Clear error handling for failed login attempts

### 🤖 Chatbot Testing Interface
- Real-time AI-powered responses using Google's Gemini API
- Dynamic confidence scoring with visual indicators
- Interactive Q&A testing environment
- Frequently asked questions panel for quick testing

### 📊 Analytics Dashboard
- Visual representation of chatbot performance metrics
- Confidence score trends over time
- Response time monitoring
- Query categorization breakdown
- Performance improvement tracking

### ⚠️ Low Confidence Query Management
- Dedicated interface for reviewing problematic queries
- Tools to add training data for query improvement
- Options to mark queries as resolved or flag for review
- Confidence score visualization

### 🎨 Accessibility Features
- Multiple theme options (Light, Dark, High Contrast)
- Font size and family adjustment
- Line height customization
- Focus outline toggles
- Custom background color options
- ARIA labels and keyboard navigation support

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Components**: Material-UI
- **Styling**: CSS + Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Routing**: React Router
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel

## 📋 Project Structure

```
admin-chatbot-portal/
├── public/
├── src/
│   ├── components/
│   │   ├── Accessibility.jsx       # Theme context provider
│   │   ├── AccessibilityPanel.jsx  # Accessibility controls UI
│   │   ├── Analytics.jsx           # Analytics dashboard
│   │   ├── Chatbot.jsx             # Chatbot testing interface
│   │   ├── Dashboard.jsx           # Main dashboard layout
│   │   ├── Login.jsx               # Authentication screen
│   │   ├── LowConfidence.jsx       # Low confidence queries management
│   │   └── Sidebar.jsx             # Navigation sidebar
│   ├── services/
│   │   └── apiservice.js           # API integration service
│   ├── App.jsx                     # Main application component
│   ├── index.css                   # Global styles
│   ├── main.jsx                    # Application entry point
│   └── theme.css                   # Theme variables
├── .gitignore
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🏃‍♀️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Administrative-Training-Portal.git
   cd Administrative-Training-Portal/admin-chatbot-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the admin-chatbot-portal directory with your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🖥️ Usage Guide

### Administrator Login

1. Navigate to the login page
2. Enter credentials (admin/admin123)
3. Upon successful authentication, you'll be redirected to the dashboard

### Testing the Chatbot

1. Navigate to "Chatbot Tester" from the sidebar
2. Type questions in the input field and press "Send"
3. View the chatbot's response along with its confidence score
4. Use the FAQ panel for quick testing with common questions

### Managing Low Confidence Queries

1. Navigate to "Low Confidence" from the sidebar
2. Browse the list of queries that received low confidence scores
3. Select a query to view details
4. Choose to:
   - Add training data to improve the response
   - Mark the query as resolved
   - Flag the query for further review

### Viewing Analytics

1. Navigate to "Analytics" from the sidebar
2. Explore various charts and metrics showing:
   - Query volume over time
   - Average confidence scores
   - Response time metrics
   - Query categorization
   - Recent improvements

### Customizing Accessibility Options

1. Navigate to "Accessibility" from the sidebar
2. Adjust theme settings:
   - Light, Dark, or High Contrast themes
   - Custom background colors
3. Modify text display:
   - Font size
   - Font family
   - Line height
   - Bold/italic options
4. Toggle focus outlines for keyboard navigation

## 👩‍💻 Development Approach

### Architecture Decisions

1. **Component-Based Structure**: The application is built with a modular component architecture to maximize reusability and maintainability.

2. **Context API for Theme Management**: React's Context API powers the theme switching and accessibility features, allowing for global state management without prop drilling.

3. **Responsive Design**: The interface uses responsive design principles with Material-UI's Grid system and media queries to ensure a seamless experience across all device sizes.

4. **Mock Data Integration**: Where appropriate, the application uses carefully crafted mock data to simulate a complete experience without requiring a full backend implementation.

5. **Progressive Enhancement**: Core functionality works with baseline technology, while enhanced features are provided when available.

### Accessibility Considerations

- **Screen Reader Support**: ARIA labels and semantic HTML for screen reader compatibility
- **Keyboard Navigation**: Complete keyboard navigability throughout the application
- **Theme Options**: Light, dark, and high-contrast themes for different visual needs
- **Text Customization**: Font size, family, and spacing adjustments
- **Focus Management**: Visible focus indicators and logical tab order

## 🔍 Future Enhancements

- Integration with backend systems for permanent data storage
- User management with different permission levels
- Advanced analytics with machine learning insights
- Batch training data upload functionality
- Multilingual support for the chatbot interface

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Your Name](https://github.com/yourusername) - Initial work and maintenance

## 🙏 Acknowledgments

- Google Gemini API for powering the AI responses
- Material-UI team for the component library
- Vercel for hosting the application