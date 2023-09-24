import { Table } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal } from "antd";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/system";
import React from "react";
import Fade from "@mui/material/Fade";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { getTimeDifference } from "../../../base";
import { ROLE_ID } from "../../../constant";
import { useNavigate } from "react-router-dom";

export const Ticket = () => {
  const columns = [
    {
      title: "Trip",
      dataIndex: "trip",
      key: "trip",
      render: (item) => {
        return `${item?.startStation?.province?.Name} - ${item.endStation?.province?.Name}`;
      },
    },
    {
      title: "Total price",
      dataIndex: "TotalPrice",
      key: "TotalPrice",
      render: (item) => {
        return `${item?.toLocaleString("vi-VN")} VND`;
      },
    },
    {
      title: "Bus name",
      dataIndex: "trip",
      key: "trip",
      render: (item) => {
        return item?.bus?.Name;
      },
    },
    {
      title: "Bus slots",
      dataIndex: "busSeats",
      key: "busSeats",
      render: (item) => {
        return item.length;
      },
    },
    {
      title: "Bought date",
      dataIndex: "BoughtDate",
      key: "BoughtDate",
      render: (item) => {
        const date = new Date(item);
        return date.toLocaleString();
      },
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (text, data) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenTicketInfo(data)}
              aria-label="action"
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const personID = localStorage.getItem("ID");
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState({});

  const accessToken = localStorage.getItem("accessToken");
  const roleID = Number(localStorage.getItem("RoleID"));
  const navigate = useNavigate();

  useEffect(() => {
    if (
      (!accessToken && roleID !== ROLE_ID.User) ||
      (accessToken &&
        (roleID === ROLE_ID.SuperAdmin || roleID === ROLE_ID.Admin))
    ) {
      navigate("/");
    } else {
      axios
        .get(`api/ticket?personID=${personID}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setTickets(res.data);
        });
    }
  });

  const handleOpenTicketInfo = (data) => {
    setOpen(true);
    axios
      .get(`api/ticket/${data.ID}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTicket(res.data);
      });
  };

  return (
    <div>
      <div style={{ marginRight: "3%" }}>
        <Table rowKey="Id" columns={columns} dataSource={tickets} />
      </div>
      <Modal
        destroyOnClose
        centered
        open={open}
        onCancel={() => setOpen(false)}
        width={637}
        footer={null}
      >
        <Container maxWidth="lg">
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
              <Paper
                elevation={10}
                style={{ padding: "10%", width: "150%", marginLeft: "35%" }}
              >
                <b
                  style={{
                    display: "flex",
                    fontSize: "170%",
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
                    fontSize: "150%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ticket.trip?.startStation?.province?.Name} -{" "}
                  {ticket.trip?.endStation?.province?.Name}
                </b>
                <div style={{ marginTop: "6%", fontSize: "140%" }}>
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
                <div style={{ marginTop: "2%", fontSize: "140%" }}>
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
                <div style={{ marginTop: "2%", fontSize: "140%" }}>
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
                        marginTop: "1.7%",
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
                        marginTop: "1.5%",
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
                        marginTop: "1.5%",
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
                        marginTop: "1.5%",
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
                        marginTop: "1.5%",
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
                        marginTop: "1.5%",
                      }}
                    />
                    Bought Date :
                    <div style={{ marginLeft: "1%" }}>
                      {new Date(ticket.BoughtDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Modal>
    </div>
  );
};
