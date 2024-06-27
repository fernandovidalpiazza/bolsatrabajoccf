import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Box } from '@mui/material';
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

      <Box className={styles.carouselContainer}>
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          transitionTime={500}
          stopOnHover={true}
          emulateTouch={true}
          swipeable={true}
        >
          <div>
            <img src={img1} alt="Slide 1" className={styles.slideImage} />
          </div>
          <div>
            <img src={img2} alt="Slide 2" className={styles.slideImage} />
          </div>
          <div>
            <img src={img3} alt="Slide 3" className={styles.slideImage} />
          </div>
          <div>
            <img src={img4} alt="Slide 4" className={styles.slideImage} />
          </div>
        </Carousel>
      </Box>
    </Box>
  );
};

export default Home;
