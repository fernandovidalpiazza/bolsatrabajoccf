import React from 'react';
import { Box } from '@mui/material';
import placa1 from '../../assets/placa1.jpeg';
import placa2 from '../../assets/placa2.jpeg';

const Home = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Box
        component="img"
        src={placa2}
        alt="placa2"
        sx={{ width: '100%', maxWidth: 1800, height: '100vh' }}
      />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box
          component="img"
          src={placa1}
          alt="placa1"
          sx={{ width: '100%', maxWidth: 1800, height: '100vh' }}
        />
      </Box>
    </Box>
  );
};

export default Home;
