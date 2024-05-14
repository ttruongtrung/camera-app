import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminManagePage from './pages/AdminManagePage';
import VideoSegmentPage from './pages/VideoSegmentsPage';
import { AuthProvider } from './auth/AuthContext';
import Modal from 'react-modal';
Modal.setAppElement('#root');

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
          <Route path="/*" element={<AdminLoginPage />}></Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
