import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminManagePage from './pages/AdminManagePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />}></Route>
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
