import { useEffect, useState } from "react";
import { characterService } from "../api/services/userService";
import { MostrarInformacion } from "./mostrarInfo";

export const BuscadorDePersonajes = () => {
  const [characters, setCharacters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    Alive: false,
    Dead: false,
    unknown: false,
  });
  const [texto, setTexto] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  //Estado de favoritos basado en IDs, no índices
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem("activo");
    if (!guardados) return {};
    try {
      const parsed = JSON.parse(guardados);
      const { data, timestamp } = parsed;
      // Expiración a 1 minuto
      if (Date.now() - timestamp > 60000) {
        localStorage.removeItem("activo");
        return {};
      }
      return data || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const data = { data: favoritos, timestamp: Date.now() };
    localStorage.setItem("activo", JSON.stringify(data));
  }, [favoritos]);

  // ✅ Borrar automáticamente después de 1 minuto
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("activo");
      setFavoritos({});
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await characterService.getAll(page);
      const data = response.data;

      setCharacters((prev) => {
        const nuevos = [...prev, ...data.results];
        const unicos = nuevos.filter(
          (personaje, index, self) =>
            index === self.findIndex((p) => p.id === personaje.id)
        );
        return unicos;
      });

      if (!data.info.next) setHasMore(false);
    } catch (error) {
      console.error("Error al obtener personajes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  //  Filtrado dinámico
  useEffect(() => {
    const textoMinus = texto.toLowerCase();
    let filtrados = characters.filter((dato) =>
      dato.name.toLowerCase().includes(textoMinus)
    );

    setIdSeleccionado(-1);

    const filtroActivo = Object.values(filtros).some((v) => v === true);
    if (filtroActivo) {
      filtrados = filtrados.filter((dato) => filtros[dato.status] === true);
    }

    setFiltered(filtrados);
  }, [texto, filtros, characters]);

  const toggleFiltro = (status) => {
    setFiltros((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  //  Alternar favoritos por ID (no índice)
  const toggleFavorito = (id) => {
    setFavoritos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      {/* 🔎 Buscador */}
      <label className="input">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ingresa tu personaje"
        />
      </label>

      <div className="flex gap-4 mt-2">
        {["Alive", "Dead", "unknown"].map((estado) => (
          <label key={estado} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filtros[estado]}
              onChange={() => toggleFiltro(estado)}
              className="checkbox"
            />
            <span>{estado}</span>
          </label>
        ))}
      </div>

      <ul className="list bg-base-100 rounded-box shadow-md mt-4">
        {filtered.map((valor) => (
          <li
            key={valor.id}
            id={valor.id}
            onClick={() => {
              setIdSeleccionado(null);
              setTimeout(() => setIdSeleccionado(valor.id), 0);
            }}
          >
            <div className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              {valor.status}
            </div>
            <div className="list-row">
              <div>
                <img className="size-10 rounded-box" src={valor.image} />
              </div>
              <div>
                <div>{valor.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {valor.species}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {valor.origin.name}
                </div>
              </div>

              {/*Favoritos */}
              <input
                type="checkbox"
                onClick={(e) => e.stopPropagation()}
                checked={!!favoritos[valor.id]}
                onChange={() => toggleFavorito(valor.id)}
              />
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}

      {idSeleccionado !== null && idSeleccionado !== -1 && (
        <div>
          <MostrarInformacion id={idSeleccionado} />
        </div>
      )}
    </div>
  );
};
