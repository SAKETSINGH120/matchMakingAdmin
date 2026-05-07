import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ProfileView from "./ProfileView"; // Import your profile view component
import profileFallback from "/images/profilelogo.png"; // Fallback image
import { useThemeMode } from "../context/ThemeContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function BasicMenu() {
  const { logout, auth } = useAuth();
  const { theme } = useThemeMode();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileOpen = () => {
    setOpenProfile(true);
    handleCloseMenu();
  };

  const handleProfileClose = () => {
    setOpenProfile(false);
  };

  const user = auth?.user;
  const profileImage = user?.profileImage
    ? `${BASE_URL}/${user.profileImage}`
    : profileFallback;

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          minWidth: "auto",
          borderRadius: "9999px",
          padding: "4px",
        }}
      >
        <Avatar
          sx={{ width: 56, height: 56 }}
          alt={user?.userName || "Profile"}
          src={profileImage}
        />
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
        PaperProps={{
          sx: {
            mt: 1,
            backgroundColor: "var(--color-bg-secondary)",
            color: "var(--color-text-primary)",
            border: `1px solid ${isDark ? "#3A3A3A" : "#E5E7EB"}`,
            borderRadius: "12px",
          },
        }}
      >
        <MenuItem onClick={handleProfileOpen}>Profile</MenuItem>
        {/* <MenuItem onClick={handleCloseMenu}>My account</MenuItem> */}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Profile Modal with Close Icon */}
      <Dialog
        open={openProfile}
        onClose={handleProfileClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "var(--color-bg-secondary)",
            color: "var(--color-text-primary)",
            border: `1px solid ${isDark ? "#3A3A3A" : "#E5E7EB"}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${isDark ? "#3A3A3A" : "#E5E7EB"}`,
          }}
        >
          Admin Profile
          <IconButton
            aria-label="close"
            onClick={handleProfileClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ProfileView />
        </DialogContent>
      </Dialog>
    </div>
  );
}
