import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardMedia, CardContent, Box, Link } from '@mui/material';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'
import './App.css';

const api_key = '97fc0410';
// const movie_title = 'Barry';

function App() {
  const [movieData, setMovieData] = useState(null);
  const [pelicula, setPelicula] = useState('Barry')
  const [fontSize, setFontSize] = useState(45)
  const [borde, setBorde] = useState(0)
  const [colo, setColo] = useState('f0f2f5')

  const commands = [
    {
      command: 'película *',
      callback: (pel) => {setPelicula(pel)}
    },
    {
      command: 'tamaño del título *',
      callback: (tam) => {
        setFontSize(parseInt(tam))
      }
    },
    {
      command: 'borde de la imagen *',
      callback: (bor) => {
        setBorde(parseInt(bor))
      }
    },
    {
      command: 'color del fondo *',
      callback: (colo) => {
        setColo(colo)
      }
    }
  ]

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands })
  if (!browserSupportsSpeechRecognition) {
    return null
  }

  useEffect(() => {
    console.log('Buscando película:', pelicula);
    fetch(`https://www.omdbapi.com/?apikey=${api_key}&t=${pelicula}&language=es`)
      .then((response) => response.json())
      .then((data) => {
        setMovieData(data);
      })
      .catch((error) => console.error('Error al obtener los datos de la película:', error));
  }, [pelicula]);
  
  

  if (!movieData || !movieData.Title) {
    return <div className="App">Cargando información de la película...</div>;
  }

  return (
    <Box className="main-container" style={{backgroundColor: `${colo}`}}>
    <Container maxWidth="lg" className="movie-container">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography style={{fontSize: `${fontSize}px`}} className='header-title' variant="h3" color="primary" gutterBottom>
            Información de la Película
          </Typography>
          <Typography variant="h4" color="secondary">
            {movieData.Title} ({movieData.Year})
          </Typography>
        </Box>
        <div className='botones'>
          <p>di película "Nombre de la pelicula"</p>
          <button className='btnstart' onClick={SpeechRecognition.startListening}>Start</button>
          <button className='btnstop' onClick={SpeechRecognition.stopListening}>Stop</button>
          <p>{transcript}</p>
        </div>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card className="movie-card" style={{borderRadius: `${borde}%`}}>
              <CardMedia
                component="img"
                height="100%"
                className='a'
                image={movieData.Poster}
                alt={movieData.Title}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={8}>
            <Card sx={{ padding: 3 }} className="movie-details-card">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Detalles de la Película
                </Typography>
                <div className="movie-details">
                  <Typography variant="body1" color="textSecondary" >
                  Género: {movieData.Genre}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" >
                    Clasificación: {movieData.Rated}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Estreno: {movieData.Released}
                  </Typography>
                  <Typography  variant="body1" color="textSecondary">
                    Duración: {movieData.Runtime}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Director: {movieData.Director}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Guionista: {movieData.Writer}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Actores: {movieData.Actors}
                  </Typography>
                  <Typography  variant="body1" color="textSecondary">
                    Idioma: {movieData.Language}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    País: {movieData.Country}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Premios: {movieData.Awards}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ padding: 3, mt: 3 }} className="movie-plot-card">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Argumento:
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {movieData.Plot}
                </Typography>

                <Typography variant="h6" color="primary" gutterBottom>
                  Calificaciones:
                </Typography>
                <ul>
                  {movieData.Ratings && movieData.Ratings.map((rating) => (
                    <li key={rating.Source}>
                      <Typography className='te' variant="body1" color="textSecondary">
                        {rating.Source}: {rating.Value}
                      </Typography>
                    </li>
                  ))}
                </ul>

                <Typography variant="body1" color="textSecondary">
                  Metascore: {movieData.Metascore}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  IMDb Rating: {movieData.imdbRating}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Votos IMDb: {movieData.imdbVotes}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Taquilla: {movieData.BoxOffice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;