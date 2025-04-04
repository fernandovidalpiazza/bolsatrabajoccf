import React, { useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, Outlet, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AuthContext } from "../../../context/AuthContext";
import { logout } from "../../../firebaseConfig";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { menuItems } from "../../../router/navigation";

function Navbar(props) {
  const { logoutContext, user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const navigate = useNavigate();
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (user?.email) {
        try {
          const q = query(collection(db, "cv"), where("Email", "==", user.email));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data?.Foto) {
              setProfilePhoto(data.Foto);
            }
          });
        } catch (error) {
          console.error("Error fetching profile photo:", error);
        }
      }
    };
    fetchProfilePhoto();
  }, [user]);

  const handleLogout = () => {
    logout();
    logoutContext();
    navigate("/login");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            {menuItems.map(({ id, path, title }) => (
              <Button key={id} color="inherit" component={Link} to={path}>{title}</Button>
            ))}
            {user.rol === rolAdmin && (
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleAvatarClick} color="inherit">
              {profilePhoto ? (
                <Avatar src={profilePhoto} alt="Usuario" />
              ) : (
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                style: { direction: "ltr" }
              }}
            >
              <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 1 }} /> Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Navbar;
