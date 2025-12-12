import { Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import HomePage from './pages/public/HomePage.jsx'
import TakeQuizPage from './pages/public/TakeQuizPage.jsx'
import QuizResultsPage from './pages/public/QuizResultsPage.jsx'
import LoginPage from './pages/admin/LoginPage.jsx'
import QuizListPage from './pages/admin/QuizListPage.jsx'
import QuizCreatePage from './pages/admin/QuizCreatePage.jsx'
import QuizEditPage from './pages/admin/QuizEditPage.jsx'

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:id" element={<TakeQuizPage />} />
          <Route path="/quiz/:id/results" element={<QuizResultsPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/quizzes" replace />} />
          <Route path="quizzes" element={<QuizListPage />} />
          <Route path="quizzes/create" element={<QuizCreatePage />} />
          <Route path="quizzes/:id/edit" element={<QuizEditPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
