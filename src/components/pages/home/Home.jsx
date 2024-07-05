import React from 'react';
import { Box } from '@mui/material';
import placa1 from '../../assets/placa1.jpeg';
import placa2 from '../../assets/placa2.jpeg';

import styles from './styles.module.css';

const Home = () => {
  return (
    <Box className={styles.homeContainer}>
      <img src={placa1} alt="placa1" className={styles.conectadoImage} />
      <Box className={styles.gridContainer}>
        <img src={placa2} alt="placa2" className={styles.conectadoImage} />
      </Box>
    </Box>
  );
};

export default Home;
