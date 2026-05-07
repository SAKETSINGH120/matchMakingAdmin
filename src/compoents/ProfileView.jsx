import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import profileFallback from "/images/profilelogo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProfileView = () => {
  const { auth, logout } = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${BASE_URL}/api/admin/passwordUpdate`,
        {
          currentPassword: formData.currentPassword,
          password: formData.password,
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      setSuccess("Password changed successfully");
      setFormData({ currentPassword: "", password: "", confirmPassword: "" });
      setShowPasswordForm(false);
      logout();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const profileImage = user.profileImage
    ? `${BASE_URL}/${user.profileImage}`
    : profileFallback;

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: { xs: 2, sm: 3 },
        backgroundColor: "var(--color-bg-primary)",
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "visible",
          backgroundColor: "var(--color-bg-secondary)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(to left, #45d85e, #1F4926)",
            height: 100,
            borderRadius: "16px 16px 0 0",
            position: "relative",
          }}
        >
          <Avatar
            src={profileImage || "/images/defaultUser.jpg"}
            alt={user?.userName || "Profile"}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid var(--color-border-strong)",
              position: "absolute",
              bottom: -60,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "var(--color-bg-secondary)",
            }}
          />
        </Box>
        <CardContent sx={{ pt: 10, pb: 4 }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "var(--color-text-primary)" }}
          >
            {user.userName}
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 1, color: "var(--color-text-secondary)" }}
          >
            {user.email}
          </Typography>
          {user.role && (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-text-secondary)" }}
              >
                Role: {user.role.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-text-secondary)" }}
              >
                Permissions: {user.role.permission?.length || 0}
              </Typography>
            </Box>
          )}
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "var(--color-text-secondary)" }}
          >
            Joined on: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setShowPasswordForm(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "medium",
                px: 3,
                py: 1,
                borderColor: "#1F4926",
                color: "#1F4926",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(31, 73, 38, 0.12)",
                },
              }}
            >
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      {showPasswordForm && (
        <Card
          sx={{
            mt: 3,
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            backgroundColor: "var(--color-bg-secondary)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: "var(--color-text-primary)",
              }}
            >
              Change Password
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                autoComplete="current-password"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "var(--color-text-secondary)",
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-text-primary)",
                    backgroundColor: "var(--color-input-bg)",
                    "& fieldset": { borderColor: "var(--color-input-border)" },
                    "&:hover fieldset": {
                      borderColor: "var(--color-border-strong)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-focus-border)",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                autoComplete="new-password"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "var(--color-text-secondary)",
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-text-primary)",
                    backgroundColor: "var(--color-input-bg)",
                    "& fieldset": { borderColor: "var(--color-input-border)" },
                    "&:hover fieldset": {
                      borderColor: "var(--color-border-strong)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-focus-border)",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                autoComplete="new-password"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "var(--color-text-secondary)",
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-text-primary)",
                    backgroundColor: "var(--color-input-bg)",
                    "& fieldset": { borderColor: "var(--color-input-border)" },
                    "&:hover fieldset": {
                      borderColor: "var(--color-border-strong)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-focus-border)",
                    },
                  },
                }}
              />
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: "medium",
                    background: "linear-gradient(to right, #EA2829, #800303)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(to right, #800303, #EA2829)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Change Password"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setShowPasswordForm(false)}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: "medium",
                    borderColor: "#800303",
                    color: "#800303",
                    "&:hover": {
                      backgroundColor: "#80030320",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProfileView;
