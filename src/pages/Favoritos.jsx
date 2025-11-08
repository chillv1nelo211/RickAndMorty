import { NavBar } from "../components/navBar";
import { MostrarFavoritos } from "../components/favoritos";
export const Favoritos = () => {
  return (
    <div>
      <div className="header">
        <NavBar />
      </div>

      <div className="main">
        <MostrarFavoritos />
      </div>

      <div className="footer"></div>
    </div>
  );
};
