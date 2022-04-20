import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Navbar from "./partials/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={[<Navbar/>, <Dashboard/>]} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
