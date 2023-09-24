import { Paper } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CommuteIcon from "@mui/icons-material/Commute";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { IOSSwitch } from "../../style";
import FormControlLabel from "@mui/material/FormControlLabel";
import dayjs from "dayjs";
import axios from "axios";
import { ROLE_ID } from "../../../constant";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
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
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { API_DOMAIN } from "../../../constant";

export const Statistic = () => {
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
      title: "Customer name",
      dataIndex: "person",
      key: "person",
      render: (item) => {
        return item?.Name;
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

  const [mileStone, setMileStone] = useState(new Date());
  const [trips, setTrips] = useState([]);
  const [tripsCount, setTripsCount] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [open, setOpen] = useState(false);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isOnlyYear, setIsOnlyYear] = useState(false);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const roleID = Number(localStorage.getItem("RoleID"));

  useEffect(() => {
    if (
      (!accessToken &&
        (roleID !== ROLE_ID.Admin || roleID !== ROLE_ID.SuperAdmin)) ||
      (accessToken && roleID === ROLE_ID.User)
    ) {
      navigate("/");
    } else {
      const year = mileStone?.getUTCFullYear();
      const month = mileStone?.getMonth() + 1;

      if (isOnlyYear) {
        axios
          .get(`api/trip?year=${year}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setTrips(res.data.data);
            setTripsCount(res.data.total);
          });

        axios
          .get(`api/ticket?year=${year}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setTickets(res.data);
            const count = res.data.reduce((acc, cur) => {
              return acc + cur.busSeats.length;
            }, 0);
            const totalIncome = res.data.reduce((acc, cur) => {
              return acc + cur.TotalPrice;
            }, 0);

            setTicketsCount(count);
            setTotalIncome(totalIncome);
          });
      } else {
        axios
          .get(`api/trip?month=${month}&year=${year}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setTrips(res.data.data);
            setTripsCount(res.data.total);
          });

        axios
          .get(`api/ticket?month=${month}&year=${year}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setTickets(res.data);
            const count = res.data.reduce((acc, cur) => {
              return acc + cur.busSeats.length;
            }, 0);
            const totalIncome = res.data.reduce((acc, cur) => {
              return acc + cur.TotalPrice;
            }, 0);

            setTicketsCount(count);
            setTotalIncome(totalIncome);
          });
      }
    }
  }, [isOnlyYear, mileStone]);

  const handleToggleYearChange = () => {
    setIsOnlyYear(!isOnlyYear);
  };

  const handleChangeMileStone = (event) => {
    if (
      event &&
      event["$y"] &&
      !isNaN(event["$M"]) &&
      event["$y"] > 1899 &&
      event["$y"] < 2100
    ) {
      setMileStone(event["$d"]);
      console.log(event);
    }
  };

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

  const handleExportStatistic = () => {
    const year = mileStone?.getUTCFullYear();
    const month = mileStone?.getMonth() + 1;
    if (isOnlyYear) {
      window.location.href = `${API_DOMAIN}/api/export?year=${year}`;
    } else {
      window.location.href = `${API_DOMAIN}/api/export?year=${year}&month=${month}`;
    }
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Paper
          elevation={10}
          sx={{
            p: 3,
          }}
          style={{
            width: "28.5%",
            borderLeft: "50px solid #32C408",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex" }}>
            <b style={{ fontSize: "120%" }}>Total income (VND)</b>
            <MonetizationOnIcon style={{ marginLeft: "2%" }} />
          </div>
          <div style={{ fontSize: "150%", marginTop: "2%" }}>
            <b>{totalIncome?.toLocaleString("vi-VN")} VND</b>
          </div>
        </Paper>
        <Paper
          elevation={10}
          sx={{
            p: 3,
          }}
          style={{
            width: "28.5%",
            marginLeft: "5%",
            borderLeft: "50px solid #C4080E",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex" }}>
            <b style={{ fontSize: "120%" }}>Total Trip</b>
            <CommuteIcon style={{ marginLeft: "2%" }} />
          </div>
          <div style={{ fontSize: "150%", marginTop: "2%" }}>
            <b>{tripsCount}</b>
          </div>
        </Paper>
        <Paper
          elevation={10}
          sx={{
            p: 3,
          }}
          style={{
            width: "28.5%",
            marginLeft: "5%",
            borderLeft: "50px solid #085DC4",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex" }}>
            <b style={{ fontSize: "120%" }}>Total Ticket</b>
            <ConfirmationNumberIcon style={{ marginLeft: "2%" }} />
          </div>
          <div style={{ fontSize: "150%", marginTop: "2%" }}>
            <b>{ticketsCount}</b>
          </div>
        </Paper>
      </div>
      <div style={{ display: "flex" }}>
        <Paper
          style={{
            marginTop: "2%",
            width: "30%",
            display: "flex",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={handleChangeMileStone}
              label={"Statistic Milestone"}
              views={["month", "year"]}
              value={dayjs(mileStone)}
            />
          </LocalizationProvider>
          <FormControlLabel
            style={{ marginLeft: "15px" }}
            control={
              <IOSSwitch
                onClick={handleToggleYearChange}
                checked={isOnlyYear ? true : false}
              />
            }
            label={"Only year"}
          />
        </Paper>
        <Button
          style={{
            backgroundColor: "#44AE52",
            height: "60px",
            color: "white",
            marginTop: "1.7%",
            marginLeft: "56%",
          }}
          variant="contained"
          onClick={handleExportStatistic}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/826px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png"
            alt=""
            width={40}
            style={{ marginRight: "8%" }}
          />
          Export
        </Button>
      </div>
      <div style={{ marginRight: "3%", marginTop: "2%" }}>
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
                  {ticket?.trip?.startStation?.province?.Name} -{" "}
                  {ticket?.trip?.endStation?.province?.Name}
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
                  <b style={{ marginLeft: "1%" }}>{ticket?.person?.Name}</b>
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
                  <b style={{ marginLeft: "1%" }}>{ticket?.person?.Email}</b>
                </div>
                <div style={{ marginTop: "2%", fontSize: "140%" }}>
                  <FiberManualRecordIcon
                    style={{
                      fontSize: "80%",
                      marginLeft: "1%",
                      marginRight: "1%",
                    }}
                  />
                  {ticket?.trip?.startStation?.Name}
                  <div style={{ marginLeft: "5%" }}>
                    <b>{new Date(ticket?.trip?.DepartDate).toLocaleString()}</b>
                  </div>
                  <div style={{ marginTop: "2%", width: "160%" }}>
                    <FiberManualRecordIcon
                      style={{
                        fontSize: "80%",
                        marginLeft: "0.6%",
                        marginRight: "0.6%",
                      }}
                    />
                    {ticket?.trip?.endStation?.Name}
                    <div style={{ marginLeft: "3%" }}>
                      <b>
                        {new Date(ticket?.trip?.FinishDate).toLocaleString()}
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
                          ticket?.trip?.DepartDate,
                          ticket?.trip?.FinishDate
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
                      {ticket?.TotalPrice?.toLocaleString("vi-VN") + " VND"}
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
                      {ticket?.trip?.bus?.Name} - {ticket?.trip?.bus?.RegNo}
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
                      {ticket?.trip?.bus?.busType?.Name}
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
                        {ticket?.busSeats
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
                        marginTop: "1.5%",
                      }}
                    />
                    Bought Date :
                    <div style={{ marginLeft: "1%" }}>
                      {new Date(ticket?.BoughtDate).toLocaleString()}
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
