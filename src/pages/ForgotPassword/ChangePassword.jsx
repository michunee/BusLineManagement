import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SignUpContainer } from "../SignUp/style";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useParams } from "react-router-dom";

const theme = createTheme();

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { email, password } = useParams();

  console.log(email);
  console.log(password);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      Email: data.get("email"),
      Password: data.get("password"),
      ConfirmPassword: data.get("confirmPassword"),
      HashedEmail: email,
      HashedPassword: password,
    };

    axios
      .post(`api/person/change-password`, body)
      .then((res) => {
        toast.success("Change password successfully!", {
          position: "bottom-right",
        });
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <SignUpContainer>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src="https://buslinemanagement.s3.ap-southeast-1.amazonaws.com/travelbus.jpg"
                alt=""
                width={200}
                style={{ marginLeft: "25%" }}
              />
              <Avatar
                style={{ marginLeft: "45%" }}
                sx={{ m: 1, bgcolor: "primary.main" }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                style={{ marginLeft: "20%", marginTop: "13%" }}
              >
                Change new Password
              </Typography>
              <Box
                onSubmit={handleSubmit}
                component="form"
                noValidate
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      style={{ width: "90%", marginLeft: "5%" }}
                      autoComplete="given-name"
                      name="email"
                      required
                      fullWidth
                      id="email"
                      label="Enter your email address"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      style={{ width: "90%", marginLeft: "5%" }}
                      autoComplete="given-name"
                      name="password"
                      required
                      type="password"
                      fullWidth
                      id="password"
                      label="Enter new password"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      style={{ width: "90%", marginLeft: "5%" }}
                      autoComplete="given-name"
                      name="confirmPassword"
                      required
                      type="password"
                      fullWidth
                      id="confirmPassword"
                      label="Confirm new password"
                      autoFocus
                    />
                  </Grid>
                </Grid>
                <Link style={{ marginLeft: "5%" }} href="/" variant="body2">
                  Go to sign in page
                </Link>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{ width: "30%", marginLeft: "31%" }}
                >
                  Submit
                </LoadingButton>
              </Box>
            </Box>
          </Container>
        </SignUpContainer>
      </div>
    </ThemeProvider>
  );
};
