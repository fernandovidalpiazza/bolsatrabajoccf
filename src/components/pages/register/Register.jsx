import React, { useState } from 'react';
import { Box, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signUp, db } from "../../../firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { RingLoader } from "react-spinners";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
      password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir').required('Confirme la contraseña')
    }),
    onSubmit: async (values) => {
      setLoading(true); // Activar el loader al enviar el formulario
      try {
        // Verificar si el usuario ya está registrado
        const docSnap = await getDoc(doc(db, "users", values.email));
        if (docSnap.exists()) {
          // Mostrar Sweet Alert de error si el usuario ya está registrado
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: '¡Usted ya está registrado!',
          });
          setIsButtonVisible(true); // Volver a mostrar el botón si hay error
          return; // Salir de la función onSubmit si el usuario ya está registrado
        }

        // Si el usuario no está registrado, proceder con el registro
        let res = await signUp(values);
        if (res.user.uid) {
          await setDoc(doc(db, "users", res.user.uid), { rol: "user" });
        }
        // Mostrar Sweet Alert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Usted se ha registrado correctamente.',
          timer: 2000, // Tiempo de espera en milisegundos
          timerProgressBar: true, // Mostrar barra de progreso
          
        }).then(() => {
          navigate("/login");
        });
      } catch (error) {
        // Manejar específicamente el caso de correo electrónico en uso
        if (error.code === 'auth/email-already-in-use') {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: '¡No pudiste registrarte, el correo ya está en uso. Intenta con otro correo o inicia sesión!',
          });
        } else {
          // Mostrar Sweet Alert de error general si hay otros errores
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: '¡Ha ocurrido un error al registrar!',
          });
          console.error(error);
        }
      } finally {
        setLoading(false); // Desactivar el loader después de completar el registro, incluso si hay errores
        setIsButtonVisible(true); // Mostrar el botón de registro nuevamente al finalizar
      }
    }
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsButtonVisible(false);
    formik.handleSubmit();
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <Grid
          container
          rowSpacing={2}
          justifyContent={"center"}
        >
          <Grid item xs={10} md={12}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff color="primary" />
                      ) : (
                        <Visibility color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
              {formik.touched.password && formik.errors.password && <p>{formik.errors.password}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={10} md={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-confirmPassword">
                Confirmar contraseña
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff color="primary" />
                      ) : (
                        <Visibility color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirmar contraseña"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <p>{formik.errors.confirmPassword}</p>}
            </FormControl>
          </Grid>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={7}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  height: '56px' // Ajusta la altura según el tamaño del botón
                }}
              >
                {loading && <RingLoader color="red" size={50} />} {/* Spinner de carga con color rojo */}
                {!loading && isButtonVisible && (
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      textShadow: "2px 2px 2px grey",
                    }}
                  >
                    Registrarme
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={10} md={7}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Regresar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Register;
