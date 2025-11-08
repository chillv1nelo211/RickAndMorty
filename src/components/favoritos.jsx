import { useState, useEffect } from "react";
import { characterService } from "../api/services/userService";

export const MostrarFavoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const MAX_PAGES = 42;

  // Obtener personajes (todas las páginas hasta 42)
  const fetchCharacters = async () => {
    if (!hasMore || page > MAX_PAGES) return;
    try {
      const response = await characterService.getAll(page);
      const data = response.data;
      setCharacters((prev) => [
        ...prev,
        ...data.results.filter(
          (p) => !prev.some((existing) => existing.id === p.id)
        ),
      ]);
      if (!data.info.next) setHasMore(false);
    } catch {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [page]);

  // Leer favoritos del localStorage y filtrarlos
  useEffect(() => {
    const guardados = localStorage.getItem("activo");
    if (!guardados) return;

    try {
      const parsed = JSON.parse(guardados);
      const { data, timestamp } = parsed.data
        ? parsed
        : { data: parsed, timestamp: null };

      // Expira después de 1 minuto
      if (timestamp && Date.now() - timestamp > 60000) {
        localStorage.removeItem("activo");
        setFavoritos([]);
        console.log("Favoritos expirados");
        return;
      }

      if (characters.length > 0) {
        const filtrados = characters.filter((c) => data[c.id]);
        setFavoritos(filtrados);
      }
    } catch (err) {
      console.error("Error al leer favoritos:", err);
      setFavoritos([]);
    }
  }, [characters]);

  // Cargar más páginas si no encontramos aún los favoritos
  useEffect(() => {
    if (favoritos.length === 0 && hasMore && page < MAX_PAGES) {
      const timeout = setTimeout(() => setPage((p) => p + 1), 500);
      return () => clearTimeout(timeout);
    }
  }, [favoritos, hasMore, page]);

  return (
    <div className="flex-col">
      <h2 className="text-4xl font-bold mb-4 text-center">Tus Favoritos</h2>

      {favoritos.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes personajes favoritos o ya expiraron.
        </p>
      ) : (
        <ul className="space-y-4">
          {favoritos.map((personaje) => (
            <li
              key={personaje.id}
              className="list bg-base-100 rounded-box shadow-md p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  className="size-12 rounded-full"
                  src={personaje.image}
                  alt={personaje.name}
                />
                <div>
                  <div className="font-semibold">{personaje.name}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {personaje.species} — {personaje.status}
                  </div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {personaje.origin.name}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
