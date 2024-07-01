import React from 'react';
import { Box, Grid } from '@mui/material';
import img1 from '../../assets/1.jpeg';
import img2 from '../../assets/2.jpeg';
import img3 from '../../assets/3.jpeg';
import img4 from '../../assets/4.jpeg';
import conectado from '../../assets/conectado.jpeg';
import styles from './styles.module.css'; // Corrige la importación de estilos

const Home = () => {
  return (
    <Box className={styles.homeContainer}>
      <img src={conectado} alt="Conectado" className={styles.conectadoImage} />

      <Box className={styles.gridContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={6}>
            <img src={img1} alt="Image 1" className={styles.gridImage} />
          </Grid>
          <Grid item xs={12} sm={3} md={6}>
            <img src={img2} alt="Image 2" className={styles.gridImage} />
          </Grid>
          <Grid item xs={12} sm={3} md={6}>
            <img src={img3} alt="Image 3" className={styles.gridImage} />
          </Grid>
          <Grid item xs={12} sm={3} md={6}>
            <img src={img4} alt="Image 4" className={styles.gridImage} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
