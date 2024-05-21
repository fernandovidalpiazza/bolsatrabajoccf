import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db, loginGoogle, onSigIn } from "../../../firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import Swal from 'sweetalert2';

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object({
    email: Yup.string().email('Email no válido').required('Email es requerido'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await onSigIn(values);
        if (res?.user) {
          const userCollection = collection(db, "users");
          const userRef = doc(userCollection, res.user.uid);
          const userDoc = await getDoc(userRef);
          let finalyUser = {
            email: res.user.email,
            rol: userDoc.data().rol,
          };
          handleLogin(finalyUser);
          navigate("/");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usted no está registrado!, Verifique su contraseña su mail, o regístrese',
          });
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Usted no está registrado!, Verifique su contraseña su mail, o regístrese',
        });
      }
    },
  });

  const googleSingIn = async () => {
    try {
      let res = await loginGoogle();
      let finalyUser = {
        email: res.user.email,
        rol: "user"
      };
      handleLogin(finalyUser);
      navigate("/");
      
    } catch (error) {
      console.log(error);
      alert('Error al iniciar sesión con Google. Por favor, inténtelo de nuevo.');
    }
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
      <form onSubmit={formik.handleSubmit}>
        <Grid container rowSpacing={2} justifyContent={"center"}>
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
            <FormControl variant="outlined" fullWidth error={formik.touched.password && Boolean(formik.errors.password)}>
              <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff color="primary" /> : <Visibility color="primary" />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
              {formik.touched.password && formik.errors.password && (
                <Typography variant="caption" color="error">{formik.errors.password}</Typography>
              )}
            </FormControl>
          </Grid>
          <Link to="/forgot-password" style={{ color: "steelblue", marginTop: "10px" }}>
            ¿Olvidaste tu contraseña?
          </Link>
          <Grid container justifyContent="center" spacing={3} mt={2}>
            <Grid item xs={10} md={5}>
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
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="ingresa con google">
                <Button
                  variant="contained"
                  startIcon={<GoogleIcon />}
                  onClick={googleSingIn}
                  type="button"
                  fullWidth
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Ingresa con google
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={10} md={8}>
              <Typography color={"secondary.primary"} variant={"h6"} mt={1} align="center">
                ¿Aún no tienes cuenta?
              </Typography>
            </Grid>
            <Grid item xs={10} md={5}>
              <Tooltip title="ingresa con google">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/register")}
                  type="button"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    textShadow: "2px 2px 2px grey",
                  }}
                >
                  Regístrate
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Login;
