import React from 'react';
import conectadoImage from "../../assets/conectado.jpeg"; // Importa la imagen

const Home = () => {
  return (
    <div style={{ 
      backgroundImage: `url(${conectadoImage})`, // Utiliza la imagen importada
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', // Ajusta la altura como desees
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff', // Color del texto sobre la imagen de fondo
      textAlign: 'center',
      fontFamily: 'Roboto, sans-serif' // Aplica la fuente Roboto
    }}>
     
      <h2>Si estás buscando empleo o simplemente quieres explorar nuevas oportunidades, ¡esta es tu oportunidad! Carga tu CV en nuestra página y déjanos ayudarte a encontrar la oportunidad perfecta para ti.</h2>
      <h3>¡No pierdas más tiempo y únete a nosotros en esta misión de impulsar tu carrera profesional! Haz clic en el enlace a continuación para cargar tu CV:</h3>
    </div>
  );
};

export default Home;
