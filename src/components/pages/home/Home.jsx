import React from "react";
import conectadoImage from "../../assets/conectado.jpeg";
import { Box, Typography, Fade } from "@mui/material";

const Home = () => {
  return (
    <Box
      className="home-container"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Texto con efecto Fade */}
      <Box sx={{ zIndex: 2 }}>
        <Fade in={true} timeout={1000}>
          <Typography variant="h2" sx={{ color: '#FFA500', mb: 2, fontFamily: 'Roboto, sans-serif', textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            Si estás buscando empleo o simplemente quieres explorar nuevas oportunidades, ¡esta es tu oportunidad!
          </Typography>
        </Fade>
        
        <Fade in={true} timeout={1500}>
          <Typography variant="h4" sx={{ color: '#FFA500', mb: 2, fontFamily: 'Roboto, sans-serif', textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            Carga tu CV en nuestra página y déjanos ayudarte a encontrar la oportunidad perfecta para ti.
          </Typography>
        </Fade>
        
        <Fade in={true} timeout={2000}>
          <Typography variant="h4" sx={{ color: '#FFA500', fontFamily: 'Roboto, sans-serif', textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            ¡No pierdas más tiempo y únete a nosotros en esta misión de impulsar tu carrera profesional!
          </Typography>
        </Fade>
      </Box>
      
      {/* Imagen */}
      <img src={conectadoImage} alt="Conectado" style={{ width: "100%", zIndex: 0, position: "relative", marginTop: "20px" }} />
    </Box >
  );
};

export default Home;
