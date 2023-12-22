import React, { useState, useRef } from "react";
import Axios from "axios";
import Grid from "@mui/material/Grid";
import { Avatar, Button, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";

const Register = () => {
  const [userNameReg, setUserNameReg] = useState(""); // for registration
  const [passwordReg, setPasswordReg] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");

  //to clear the values in the text field
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [userNameRegError, setUserNameRegError] = useState(false); // for registration
  const [passwordRegError, setPasswordRegError] = useState(false);

  Axios.defaults.withCredentials = true;

  const register = async () => {
    // Check if any of the fields are empty
    if (!userNameReg) {
      setRegistrationStatus("Please fill in all the fields.");
      setUserNameRegError(true);
      return;
    }
    if (!passwordReg) {
      setRegistrationStatus("Please fill in all the fields.");
      setPasswordRegError(true);
      return;
    }

    Axios.post("http://localhost:80/server/registration.php", {
      username: userNameReg,
      password: passwordReg,
    })
      .then((response) => {
        if (response.data.success) {
          setRegistrationStatus("Registration successful!"); // Set success message
          setUserNameReg("");
          setPasswordReg("");
          if (usernameRef.current) usernameRef.current.value = "";
          if (passwordRef.current) passwordRef.current.value = "";
        } else {
          setRegistrationStatus("Error in registration. Please try again."); // Set error message
        }
      })
      .catch((error) => {
        if (error.response) {
          // The server responded with an error status code
          if (error.response.status === 404) {
            toast.error("Error in registration. Please try again.");
          } else {
            toast.warn("An error occurred. Please try again later.");
          }
        } else if (error.request) {
          // The request was made, but no response was received
          toast.error("Server is not responding. Please try again later.");
        } else {
          // Something happened in setting up the request
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  const paperStyle = {
    padding: 20,
    height: "50vh",
    width: 280,
    margin: "20px auto",
  };

  const textFieldStyle = {
    marginTop: 10,
  };

  const loginlinkstyle = {
    fontSize: 15,
    color: "red",
    marginLeft: "auto",
  };

  return (
    <Grid>
      <Paper elevation={12} style={paperStyle}>
        <Grid align={"center"}>
          <h2>Register</h2>
          <TextField
            id="username"
            label="username"
            variant="outlined"
            fullWidth
            required
            autoFocus
            error={userNameRegError}
            onChange={(e) => {
              setUserNameReg(e.target.value);
            }}
            inputRef={usernameRef}
          />
          <TextField
            id="password"
            type="password"
            label="password"
            variant="outlined"
            fullWidth
            required
            error={passwordRegError}
            style={textFieldStyle}
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
            inputRef={passwordRef}
          />
        </Grid>

        <Button
          variant="contained"
          fullWidth
          style={{ marginTop: 10 }}
          onClick={register}
        >
          Register
        </Button>

        {registrationStatus && (
          <Typography
            variant="body2"
            color={
              registrationStatus.includes("successful") ? "primary" : "error"
            }
            style={{
              marginTop: 10,
              textAlign: "center",
              alignContent: "center",
            }}
          >
            {registrationStatus}
          </Typography>
        )}

        <Grid
          container
          justifyContent="space-between"
          style={{ marginTop: 10, paddingTop: 10 }}
        >
          <Typography underline="hover" fontSize={15}>
            Already have an account ?
          </Typography>
          <Link to="/" underline="none" style={loginlinkstyle}>
            Login here
          </Link>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Register;
