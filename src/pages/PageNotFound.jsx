import { Container } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => (
  <div>
    <Container sx={{ mt: 10 }} maxWidth="lg">
      <img
        src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
        alt="not-found"
      />
      <Link to="/">Go Home</Link>
    </Container>
  </div>
);

export default PageNotFound;
