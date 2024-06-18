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
        
      {/* Imagen */}
      <img src={conectadoImage} alt="Conectado" style={{ width: "100%", zIndex: 0, position: "relative", marginTop: "20px" }} />
    </Box >
    
  );
};

export default Home;
