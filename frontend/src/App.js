import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminManagePage from './pages/AdminManagePage';
import VideoSegmentPage from './pages/VideoSegmentsPage';

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
      <Routes>
        <Route path="/cameras" element={<AdminManagePage />}></Route>
      </Routes>
    </>
  );
}

export default App;
