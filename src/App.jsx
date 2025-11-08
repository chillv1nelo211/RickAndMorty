import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Inicio } from "./pages/Inicio";
import { Favoritos } from "./pages/Favoritos";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
