import { useState, useEffect } from "react";
import { characterService } from "../api/services/userService";

export const MostrarInformacion = ({ id }) => {
  const [info, setInfo] = useState(null);
  const [episodios, setEpisodios] = useState([]);
  useEffect(() => {
    //si id es igual a -1 entonces retorna un div vacio
    if (id == -1) {
      return <div></div>;
    }

    //obetener al personaje con el id que nos pasaron a la  funcion
    const fetchData = async () => {
      const response = await characterService.getOne(id);

      const ids = response.data.episode
        .map((url) => url.split("/").pop())
        .join(",");
      const resEpisodios = await fetch(
        `https://rickandmortyapi.com/api/episode/${ids}`
      );
      const dataEpisodios = await resEpisodios.json();

      const listaEpisodios = Array.isArray(dataEpisodios)
        ? dataEpisodios.map((ep) => ep.name)
        : [dataEpisodios.name];

      setEpisodios(listaEpisodios);
      setInfo(response.data);
      setTimeout(() => {
        const modal = document.getElementById("my_modal_1");
        if (modal) {
          modal.showModal();
        }
      }, 0);
    };

    fetchData();
  }, [id]);

  if (!info) return <div>Cargando...</div>;

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Information</h3>
        <img src={info.image} alt={"imagen de" + info.name} />
        <p className="py-4">{info.name}</p>
        {episodios.map((valor, idx) => (
          <li key={idx}>{valor}</li>
        ))}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
