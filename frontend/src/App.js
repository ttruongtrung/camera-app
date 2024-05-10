import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminManagePage from './pages/AdminManagePage';
import VideoSegmentPage from './pages/VideoSegmentsPage';
import { AuthProvider } from './auth/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />}></Route>
        <Route path="/camera/:cameraId/segments" element={<VideoSegmentPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const AdminApp = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/cameras" element={<AdminManagePage />}></Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
