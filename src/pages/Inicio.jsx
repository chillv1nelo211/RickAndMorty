import { NavBar } from "../components/navBar";
import { BuscadorDePersonajes } from "../components/buscador";
export const Inicio = () => {
  return (
    <div>
      <div className="header">
        <NavBar />
      </div>

      <div className="main">
        <BuscadorDePersonajes />
      </div>

      <div className="footer"></div>
    </div>
  );
};
