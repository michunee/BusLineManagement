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
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { GENDER } from "../../constant";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import format from "date-fns/format";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

const theme = createTheme();

export default function SignUp() {
  const [gender, setGender] = useState(10);
  const [birthDate, setBirthDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      Email: data.get("email"),
      Password: data.get("password"),
      Name: data.get("name"),
      ConfirmPassword: data.get("confirmPassword"),
      CardID: data.get("cardID"),
      Phonenumber: data.get("phonenumber"),
      Gender: gender === 10 ? GENDER.Male : GENDER.Femail,
      DateOfBirth: birthDate ? format(birthDate["$d"], "yyyy-MM-dd") : null,
      Address: data.get("address"),
    };

    setLoading(true);

    axios
      .post("api/person/signup", body)
      .then((res) => {
        toast.success(
          "Sign up successfully! Please check your email to verify your account.",
          { position: "bottom-right" }
        );
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message, { position: "bottom-left" });
      });
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleChangeBirthDate = (newValue) => {
    if (newValue && newValue["$D"] && newValue["$y"] && newValue["$M"]) {
      setBirthDate(newValue);
    } else {
      setBirthDate(null);
    }
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
                alignItems: "center",
              }}
            >
              <img
                src="https://buslinemanagement.s3.ap-southeast-1.amazonaws.com/travelbus.jpg"
                alt=""
                width={140}
              />

              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirm-password"
                      autoComplete="confirm-password"
                    />
                  </Grid>
                  <div className="gender-box">
                    <FormControl style={{ minWidth: 150 }}>
                      <InputLabel id="demo-simple-select-label">
                        Gender*
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        label="gender*"
                        onChange={handleGenderChange}
                      >
                        <MenuItem value={10}>Male</MenuItem>
                        <MenuItem value={20}>Female</MenuItem>
                      </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of birth*"
                        sx={{ marginLeft: "16px", width: "58%" }}
                        value={birthDate}
                        onChange={handleChangeBirthDate}
                      />
                    </LocalizationProvider>
                  </div>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="cardID"
                      label="Card ID"
                      type="cardID"
                      id="cardID"
                      autoComplete="cardID"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      name="phonenumber"
                      label="Phone Number"
                      type="phonenumber"
                      id="phonenumber"
                      autoComplete="phonenumber"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="address"
                      label="Address"
                      type="address"
                      id="address"
                      autoComplete="address"
                    />
                  </Grid>
                </Grid>
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  loading={loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </LoadingButton>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </SignUpContainer>
      </div>
    </ThemeProvider>
  );
}
