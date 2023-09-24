import { Box, Button, Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import { useEffect, useState } from "react";
import axios from "axios";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { getTimeDifference } from "../base";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({});
  const ticketID = localStorage.getItem("ticketID");

  useEffect(() => {
    if (!ticketID) {
      navigate("/");
    } else {
      axios
        .get(`api/ticket/${ticketID}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setTicket(res.data);
        });
    }
  }, []);

  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Paper
          elevation={10}
          sx={{
            p: 5,
            display: "flex",
            justifyContent: "center",
            marginBottom: "7%",
          }}
        >
          <Fade in>
            <Box
              width={400}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <CreditScoreIcon sx={{ fontSize: 100, color: "green" }} />
              <Typography variant="h4" sx={{ mt: 2 }}>
                Payment success
              </Typography>
              <Typography variant="h6" gutterBottom>
                Thank you for your order!
              </Typography>
              <Typography variant="subtitle1">
                The TravelBus team sincerely thanks and wishes you a nice day!
              </Typography>
              <Paper elevation={10} style={{ padding: "10%", width: "150%" }}>
                <b
                  style={{
                    display: "flex",
                    fontSize: "140%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "green",
                  }}
                >
                  Ticket information
                </b>
                <br />
                <b
                  style={{
                    display: "flex",
                    fontSize: "120%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ticket.trip?.startStation?.province?.Name} -{" "}
                  {ticket.trip?.endStation?.province?.Name}
                </b>
                <div style={{ marginTop: "6%", fontSize: "110%" }}>
                  <FiberManualRecordIcon
                    style={{
                      fontSize: "80%",
                      marginLeft: "1%",
                      marginRight: "1%",
                    }}
                  />
                  Customer Name :
                  <b style={{ marginLeft: "1%" }}>{ticket.person?.Name}</b>
                </div>
                <div style={{ marginTop: "2%", fontSize: "110%" }}>
                  <FiberManualRecordIcon
                    style={{
                      fontSize: "80%",
                      marginLeft: "1%",
                      marginRight: "1%",
                    }}
                  />
                  Customer Email :
                  <b style={{ marginLeft: "1%" }}>{ticket.person?.Email}</b>
                </div>
                <div style={{ marginTop: "2%", fontSize: "110%" }}>
                  <FiberManualRecordIcon
                    style={{
                      fontSize: "80%",
                      marginLeft: "1%",
                      marginRight: "1%",
                    }}
                  />
                  {ticket.trip?.startStation?.Name}
                  <div style={{ marginLeft: "5%" }}>
                    <b>{new Date(ticket.trip?.DepartDate).toLocaleString()}</b>
                  </div>
                  <div style={{ marginTop: "2%", width: "160%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "0.6%",
                        marginRight: "0.6%",
                      }}
                    />
                    {ticket.trip?.endStation?.Name}
                    <div style={{ marginLeft: "3%" }}>
                      <b>
                        {new Date(ticket.trip?.FinishDate).toLocaleString()}
                      </b>
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: "2%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "1%",
                        marginRight: "1%",
                        marginTop: "0.7%",
                      }}
                    />
                    Duration :
                    <div style={{ marginLeft: "1%" }}>
                      <b>
                        {getTimeDifference(
                          ticket.trip?.DepartDate,
                          ticket.trip?.FinishDate
                        )}
                      </b>
                    </div>
                  </div>
                  <div style={{ marginTop: "2%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "1%",
                        marginRight: "1%",
                      }}
                    />
                    Total Price :
                    <b style={{ marginLeft: "1%" }}>
                      {ticket.TotalPrice?.toLocaleString("vi-VN") + " VND"}
                    </b>
                  </div>
                  <div style={{ display: "flex", marginTop: "2%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "1%",
                        marginRight: "1%",
                        marginTop: "0.5%",
                      }}
                    />
                    Bus :
                    <div style={{ marginLeft: "1%" }}>
                      {ticket.trip?.bus?.Name} - {ticket.trip?.bus?.RegNo}
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: "2%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "1%",
                        marginRight: "1%",
                        marginTop: "0.5%",
                      }}
                    />
                    Bus Type :
                    <div style={{ marginLeft: "1%" }}>
                      {ticket.trip?.bus?.busType?.Name}
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: "2%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "1%",
                        marginRight: "1%",
                        marginTop: "0.5%",
                      }}
                    />
                    Bus Slots :
                    <div style={{ marginLeft: "1%" }}>
                      <b>
                        {ticket.busSeats
                          ?.map((seat) => {
                            return seat.Name;
                          })
                          .join(", ")}
                      </b>
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: "2%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "1%",
                        marginRight: "1%",
                        marginTop: "0.5%",
                      }}
                    />
                    Driver :
                    <div style={{ marginLeft: "1%" }}>
                      {ticket?.trip?.driver?.Name}
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: "2%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "1%",
                        marginRight: "1%",
                        marginTop: "0.5%",
                      }}
                    />
                    Bought Date :
                    <div style={{ marginLeft: "1%" }}>
                      {new Date(ticket.BoughtDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Paper>
              <Button
                sx={{ mt: 3 }}
                onClick={() => navigate("/user/ticket")}
                startIcon={<ArrowBackIcon />}
              >
                Back to view booked tickets
              </Button>
            </Box>
          </Fade>
        </Paper>
      </Container>
    </div>
  );
};

export default PaymentSuccess;
