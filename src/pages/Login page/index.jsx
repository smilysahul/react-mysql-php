import React, { useState } from "react";
import Axios from "axios";
import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please fill in all the fields.");
      setUserNameError(!username);
      setPasswordError(!password);
      return;
    }

    try {
      setLoading(true);

      const response = await Axios.post("http://localhost:80/server/login.php", {
        username: username,
        password: password,
      });

      if (response.data.success) {
        setLoginStatus(true);
        setMessage("Login successful!");
        navigate("/home")
      } else {
        setLoginStatus(false);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginStatus(false);
      setMessage("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={12} style={{ padding: 20, height: "55vh", width: 280, margin: "20px auto" }}>
      <form onSubmit={handleFormSubmit} style={{ textAlign: "center" }}>
        <h2>Login</h2>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          fullWidth
          required
          autoFocus
          error={usernameError}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          variant="outlined"
          fullWidth
          required
          style={{ marginTop: 10 }}
          error={passwordError}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} color="primary" />}
          label="Remember me"
        />
        <Button variant="contained" fullWidth type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {message && (
          <Typography color={loginStatus ? "primary" : "error"} align="center" style={{ marginTop: 10 }}>
            {message}
          </Typography>
        )}

        <div style={{ marginTop: 10 }}>
          <Link to="/forgot-password" style={{ marginRight: 10 }}>
            Forgot password?
          </Link>
          <Link to="/register">Register here</Link>
        </div>
      </form>
    </Paper>
  );
};

export default Login;
