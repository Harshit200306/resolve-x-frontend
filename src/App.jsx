import { Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

import UserDashboard from './dashboards/UserDashboard'
import WorkerDashboard from './dashboards/WorkerDashboard'
import ComplaintChatbot from './dashboards/ComplaintChatbot'

function App() {
return ( <Routes>
<Route path="/" element={<LandingPage />} />

```
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />

  <Route path="/user-dashboard" element={<UserDashboard />} />
  <Route path="/worker-dashboard" element={<WorkerDashboard />} />

  <Route path="/complaint-chatbot" element={<ComplaintChatbot />} />

  <Route path="*" element={<NotFoundPage />} />
</Routes>


)
}

export default App
