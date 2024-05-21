import { ChangeEvent, useEffect, useState } from "react";
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';


export type Character = {
  id: number,
  name: string,
  status: string,
  species: string,
  type: string,
  gender: string,
  origin: {
    name: string,
    url: string
  },
  location: {
    name: string,
    url: string,
  },
  image: string,
  episode: string[],
  created: string,
}


export type Episode = {
  id: number,
  name: string,
  air_date: string,
  episode: string,
  characters: string[],
  url: string,
  created: string
}


function App() {
  const [data, setData] = useState<Character>();
  const [episodes, setEpisodes] = useState<Episode[]>();
  const [inputValue, setInputValue] = useState('');
  const [id, setId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleClick() {
    console.log('CHAMOU', inputValue)
    setId(Number(inputValue));

  }

  function handleNext() {
    const next = id + 1;
    setId(next);
    setInputValue(String(next));
  }

  function handlePrev() {
    const prev = id - 1;
    setId(prev);
    setInputValue(String(prev));
  }


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      if (response.status === 200) {
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false);
      } else {
        alert('ERROR, nenhum personagem encontrado')

      }
    };

    fetchData();
  }, [id]);


  useEffect(() => {
    const numbersOfEp = data && data.episode.map((episodeUrl: string) => {
      const episodeNumber = parseInt(episodeUrl.split('/').pop() || '');
      return episodeNumber
    })

    if (numbersOfEp && numbersOfEp.length > 0) {
      const fetchData = async () => {
        const response = await fetch(`https://rickandmortyapi.com/api/episode/${numbersOfEp}`);
        try {
          const jsonData = await response.json();
          const jsonData2 = Array.isArray(jsonData) ? jsonData : [{ ...jsonData }]
          setEpisodes(jsonData2)
        } catch (error) {
          console.error(error)
        }
      }
      fetchData()
    }
  }, [data])


  if (isLoading) {
    return <div>Carregando...</div>;
  }


  return (
    <div>
      {data && (
        <div>
          <aside className="image">
            <Image src={data.image} fluid roundedCircle />;
          </aside>
          <main className="info">
            <Card>
              <Card.Body>
                <h2>{data.name}</h2>
                <p>Status: {data.status}</p>
                <p>Especie: {data.species}</p>
                <p>Gênero: {data.gender}</p>
                <p>Origem: {data.origin.name ?? 'Desconhecido'}</p>
                <p>Localidade: {data.location.name ?? 'Desconhecido'}</p>
                <p>Criada: {data.created}</p>
                <div className="formGroup">
                  <label htmlFor="">Id do personagem: </label>
                  <input id="inputId" type="number" className="formControl" value={inputValue} onChange={handleChange} placeholder="Insira a id de busca" />
                  <button type="button" className="btn btn-primary" onClick={handleClick}>Ir</button>
                </div>
                <div className="buttons">
                  <button type="button" className="btn btn-dark btn-lg" onClick={handlePrev}>&lt; Anterior</button>
                  <button type="button" className="btn btn-dark btn-lg" onClick={handleNext}>Proximo &gt;</button>
                </div>
              </Card.Body>
            </Card>
          </main>
          <footer className="eps">
            <h2>Episódios</h2>
            <div className="grid">
              {episodes && episodes.length > 0 && episodes.map((episode, index) => {
                return (
                  <Card className="card">
                    <Card.Body key={index} className="col">
                      Episódio {episode.name}
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </footer>
        </div >
      )
      }
    </div >
  );
};


export default App