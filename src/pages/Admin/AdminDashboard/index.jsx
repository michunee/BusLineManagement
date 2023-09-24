import Paper from "@mui/material/Paper";
import {
  CardMedia,
  Fade,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Grid,
} from "@mui/material";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import Button from "@mui/material/Button";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect } from "react";
import axios from "axios";
import format from "date-fns/format";
import dayjs from "dayjs";
import { Card, CardActionArea, CardContent, Pagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Modal, Tag } from "antd";
import { toast } from "react-toastify";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { getTimeDifference } from "../../../base";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import InputBase from "@mui/material/InputBase";
import "react-toastify/dist/ReactToastify.css";
import { Table } from "antd";
import { ROLE_ID } from "../../../constant";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const [provinces, setProvinces] = useState([]);
  const [startProvinceID, setStartProvinceID] = useState(1);
  const [endProvinceID, setEndProvinceID] = useState(1);
  const [haveSearched, setHaveSearched] = useState(false);
  const [trips, setTrips] = useState([]);
  const [tripDate, setTripDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [totalTrip, setTotalTrip] = useState(0);
  const [openTripDetail, setOpenTripDetail] = useState(false);
  const [busSeats, setBusSeats] = useState([]);
  const [bookedBusSeatIDs, setBookedBusSeatIDs] = useState([]);
  const [busSeatsChosenID, setBusSeatsChosenID] = useState([]);
  const [trip, setTrip] = useState({});
  const [openTripOrdered, setOpenTripOrdered] = useState(false);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "person",
      key: "person",
      render: (person) => {
        return person.Name;
      },
    },
    {
      title: "Email",
      dataIndex: "person",
      key: "person",
      render: (person) => {
        return person.Email;
      },
    },
    {
      title: "Phone number",
      dataIndex: "person",
      key: "person",
      render: (person) => {
        return person.Phonenumber;
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
      title: "Total price",
      dataIndex: "TotalPrice",
      key: "TotalPrice",
      render: (item) => {
        return item?.toLocaleString("vi-VN") + " VND";
      },
    },
    {
      title: "Bus slots",
      dataIndex: "busSeats",
      key: "busSeats",
      render: (busSeats) => {
        return busSeats.map((item) => item.Name).join(", ");
      },
    },
  ];

  const accessToken = localStorage.getItem("accessToken");
  const roleID = Number(localStorage.getItem("RoleID"));

  useEffect(() => {
    localStorage.removeItem("ticketID");
    if (
      (!accessToken &&
        (roleID !== ROLE_ID.Admin || roleID !== ROLE_ID.SuperAdmin)) ||
      (accessToken && roleID === ROLE_ID.User)
    ) {
      navigate("/");
    } else {
      axios
        .get("api/trip?page=1", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setTrips(res.data.data);
        });

      axios.get("api/province").then((res) => {
        setProvinces(res.data);
      });
    }
  }, []);

  const handleStartProvinceChange = (event) => {
    setStartProvinceID(event.target.value);
  };

  const handleEndProvinceChange = (event) => {
    setEndProvinceID(event.target.value);
  };

  const handleTripDateChange = (event) => {
    if (event && event["$D"] && event["$y"] && event["$M"]) {
      setTripDate(format(event["$d"], "yyyy-MM-dd"));
    } else {
      setTripDate(null);
    }
  };

  const handleChangePage = async (event, value) => {
    setPage(value);
    if (haveSearched) {
      await axios
        .get(
          `api/trip?startProvinceID=${startProvinceID}&endProvinceID=${endProvinceID}&tripDate=${tripDate}&page=${value}`,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((res) => {
          setTrips(res.data.data);
        });
    } else {
      await axios
        .get(`api/trip?page=${value}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setTrips(res.data.data);
        });
    }
  };

  const handleSwapProvince = () => {
    setStartProvinceID(endProvinceID);
    setEndProvinceID(startProvinceID);
  };

  const handleSearchTrip = async (event) => {
    event.preventDefault();
    await axios
      .get(
        `api/trip?startProvinceID=${startProvinceID}&endProvinceID=${endProvinceID}&tripDate=${tripDate}`,
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((res) => {
        setHaveSearched(true);
        setTrips(res.data.data);
        setPage(1);
        setTotalTrip(res.data.total);
        toast.success("Find trip successfully!", {
          position: "bottom-left",
        });
      });
  };

  const handleResetTrip = async (event) => {
    event.preventDefault();
    await axios
      .get("api/trip?page=1", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTrips(res.data.data);
        setStartProvinceID(1);
        setEndProvinceID(1);
        setHaveSearched(false);
        setPage(1);
        setTripDate(format(new Date(), "yyyy-MM-dd"));
        toast.success("Reset trip successfully!", {
          position: "bottom-left",
        });
      });
  };

  const handleOpenTripDetail = (tripID) => {
    setOpenTripDetail(true);
    axios
      .get(`api/trip/${tripID}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTrip(res.data);
        setBusSeats(res.data.bus?.busType?.busSeats);
      });

    axios
      .get(`api/bus-seat?tripID=${tripID}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setBookedBusSeatIDs(res.data.map((item) => item.ID));
      });
  };

  const handleCloseTripDetail = () => {
    setOpenTripDetail(false);
    setBusSeatsChosenID([]);
    setBookedBusSeatIDs([]);
  };

  const handleChooseSeat = (seat) => {
    const IsChosenSeat = busSeatsChosenID.includes(seat.ID);
    const IsBookedSeat = bookedBusSeatIDs.includes(seat.ID);
    try {
      if (busSeatsChosenID.length === 8 && !IsChosenSeat) {
        throw new Error("You can only choose 8 seats");
      }
      if (IsChosenSeat || IsBookedSeat) {
        setBusSeatsChosenID(
          busSeatsChosenID.filter((item) => item !== seat.ID)
        );
        console.log(busSeatsChosenID.filter((item) => item !== seat.ID));
      } else {
        setBusSeatsChosenID([...busSeatsChosenID, seat.ID]);
        console.log([...busSeatsChosenID, seat.ID]);
      }
    } catch (err) {
      toast.error(err.message, {
        position: "bottom-left",
      });
    }
  };

  const handleOpenTripOrdered = () => {
    setOpenTripOrdered(true);
    axios
      .get(`api/ticket?tripID=${trip.ID}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTickets(res.data);
        console.log(res.data);
      });
  };
  const handleCloseTripOrdered = () => {
    setOpenTripOrdered(false);
  };

  return (
    <div>
      <Paper
        sx={{
          p: 5,
          marginLeft: "1%",
          borderRadius: 6,
          width: "95%",
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
        elevation={8}
      >
        <TripOriginIcon
          style={{ marginTop: "1%", color: "#0D83DA", fontSize: "200%" }}
        />
        <FormControl
          style={{ marginLeft: "1%", width: "25%", backgroundColor: "white" }}
        >
          <InputLabel id="demo-simple-select-label">
            <b>Start Province</b>
          </InputLabel>
          <Select
            style={{
              borderRadius: "35px",
            }}
            MenuProps={{
              style: {
                maxHeight: 400,
              },
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="StartProvince"
            value={startProvinceID}
            onChange={handleStartProvinceChange}
          >
            {provinces.map((item) => {
              return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <Button
          onClick={handleSwapProvince}
          style={{ marginBottom: "2%", marginLeft: "1%" }}
          sx={{ borderRadius: 28 }}
        >
          <SwapHorizIcon style={{ fontSize: "200%", color: "black" }} />
        </Button>
        <TripOriginIcon
          style={{
            marginLeft: "1%",
            marginTop: "1%",
            color: "#F41148",
            fontSize: "200%",
          }}
        />
        <FormControl
          style={{ marginLeft: "1%", width: "25%", backgroundColor: "white" }}
        >
          <InputLabel id="demo-simple-select-label">
            <b>End Province</b>
          </InputLabel>
          <Select
            style={{
              borderRadius: "35px",
            }}
            MenuProps={{
              style: {
                maxHeight: 400,
              },
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="EndProvince"
            value={endProvinceID}
            onChange={handleEndProvinceChange}
          >
            {provinces.map((item) => {
              return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl
          style={{ marginLeft: "1%", width: "15%", backgroundColor: "white" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={handleTripDateChange}
              value={dayjs(tripDate)}
            />
          </LocalizationProvider>
        </FormControl>
        <Button
          style={{
            marginLeft: "1%",
            marginBottom: "2%",
            padding: "1%",
            backgroundColor: "#DAF337",
            color: "black",
          }}
          variant="contained"
          onClick={handleSearchTrip}
        >
          Search Trip
        </Button>
        <Button
          onClick={handleResetTrip}
          style={{ marginBottom: "2%", marginLeft: "1%", height: "50px" }}
          variant="contained"
          color="error"
        >
          <RestartAltIcon />
        </Button>
      </Paper>
      {haveSearched ? (
        <div style={{ marginTop: "1%", marginLeft: "1%", fontSize: "110%" }}>
          <b>{totalTrip} results found</b>
        </div>
      ) : (
        <div></div>
      )}
      <Grid
        style={{ marginTop: "1%", width: "98%" }}
        container
        spacing={1}
        item
        md={12}
      >
        {trips.map((item) => {
          return (
            <Grid item md={6} key={item.ID}>
              <Card
                sx={{
                  ":hover": {
                    boxShadow: 20, // theme.shadows[20]
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleOpenTripDetail(item.ID)}
                  component="div"
                >
                  <CardContent
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <Grid md={1}>
                      <img
                        style={{ width: "200px", height: "150px" }}
                        src={item.endStation.province.ImageUrl}
                        alt=""
                      />
                    </Grid>
                    <Grid item md={5}>
                      <h3 style={{ marginLeft: "70%", width: "200%" }}>
                        <b>
                          {item.startStation?.province.Name} -{" "}
                          {item.endStation?.province.Name}
                        </b>
                      </h3>
                      <div
                        style={{
                          marginLeft: "70%",
                          width: "200%",
                          marginTop: "5%",
                          fontSize: "110%",
                        }}
                      >
                        <TripOriginIcon
                          style={{
                            fontSize: "100%",
                            marginRight: "1%",
                            paddingTop: "1%",
                          }}
                        />
                        {item.startStation?.Name}
                        <div style={{ fontSize: "90%", marginLeft: "5%" }}>
                          <b>{new Date(item.DepartDate).toLocaleString()}</b>
                        </div>
                      </div>
                      <div
                        style={{
                          marginLeft: "70%",
                          width: "200%",
                          marginTop: "2%",
                          fontSize: "110%",
                        }}
                      >
                        <LocationOnIcon
                          style={{
                            fontSize: "100%",
                            marginRight: "1%",
                            paddingTop: "1%",
                          }}
                        />
                        {item.endStation?.Name}
                        <div style={{ fontSize: "90%", marginLeft: "5%" }}>
                          <b> {new Date(item.FinishDate).toLocaleString()}</b>
                        </div>
                      </div>
                      <div
                        style={{
                          marginLeft: "70%",
                          marginTop: "2%",
                          width: "200%",
                          display: "flex",
                        }}
                      >
                        <b>Duration : </b>
                        <div style={{ marginLeft: "1%", color: "red" }}>
                          {getTimeDifference(item.DepartDate, item.FinishDate)}
                        </div>
                      </div>
                      <div
                        style={{
                          marginLeft: "70%",
                          marginTop: "1%",
                          width: "200%",
                        }}
                      >
                        <div style={{ display: "inline" }}>
                          <b>Price : </b>
                        </div>
                        <div
                          style={{
                            display: "inline",
                            fontSize: "120%",
                            color: "#5058DB",
                          }}
                        >
                          <b>{item.Price?.toLocaleString("vi-VN") + " VND"}</b>
                        </div>
                        <div
                          style={{
                            marginTop: "1%",
                            width: "200%",
                            display: "flex",
                          }}
                        >
                          <b>Slot : </b>
                          <b style={{ marginLeft: "1%", color: "red" }}>
                            {item.bus?.busType?.SeatNum}
                          </b>
                          <b style={{ marginLeft: "5%" }}>Empty : </b>
                          <b style={{ marginLeft: "1%", color: "red" }}>
                            {item.bus?.busType?.SeatNum -
                              item.tickets
                                .map((ticket) => {
                                  return ticket.busSeats;
                                })
                                .map((busSeat) => {
                                  return busSeat.length;
                                })
                                .reduce((a, b) => a + b, 0)}
                          </b>
                        </div>
                        <div style={{ display: "inline" }}>
                          {item.IsCancelled ? (
                            <Tag
                              style={{
                                marginLeft: "55%",
                                fontSize: "100%",
                              }}
                              color="gold"
                            >
                              Cancelled
                            </Tag>
                          ) : (
                            <Tag
                              style={{
                                marginLeft: "55%",
                                fontSize: "100%",
                              }}
                              color="green"
                            >
                              Active
                            </Tag>
                          )}
                        </div>
                      </div>
                    </Grid>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Modal
        destroyOnClose
        centered
        open={openTripDetail}
        onCancel={handleCloseTripDetail}
        width={1300}
        footer={null}
      >
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Paper elevation={12} style={{ paddingBottom: "5%" }}>
              <Paper
                elevation={12}
                style={{ paddingBottom: "3%", backgroundColor: "#5058DB" }}
              >
                <div style={{ display: "flex" }}>
                  <LocationOnIcon
                    style={{
                      color: "white",
                      marginTop: "4.5%",
                      marginLeft: "3%",
                    }}
                  />
                  <h2
                    style={{
                      marginLeft: "1%",
                      marginTop: "4%",
                      color: "white",
                      borderRadius: "100px",
                    }}
                  >
                    <b>Trip information detail</b>
                  </h2>
                </div>
              </Paper>
              <Grid
                container
                className="animate__animated animate__fadeIn"
                spacing={2}
              >
                <Grid
                  item
                  xs={3}
                  style={{ marginTop: "5%" }}
                  className="animate__animated animate__fadeInLeft"
                >
                  <Fade in>
                    <CardMedia
                      component="img"
                      style={{
                        marginLeft: "10%",
                        width: "140%",
                      }}
                      image={trip.startStation?.province?.ImageUrl}
                      alt={trip.ID}
                    />
                  </Fade>
                  <Fade in>
                    <CardMedia
                      component="img"
                      style={{
                        marginLeft: "10%",
                        width: "140%",
                      }}
                      image={trip.endStation?.province?.ImageUrl}
                      alt={trip.ID}
                    />
                  </Fade>
                  <Fade in>
                    <CardMedia
                      component="img"
                      style={{
                        marginLeft: "10%",
                        marginTop: "10%",
                        width: "140%",
                      }}
                      image={trip.bus?.ImageUrl}
                      alt={trip.ID}
                    />
                  </Fade>
                </Grid>
                <Grid item xs={9}>
                  <List style={{ marginLeft: "13%", marginTop: "3%" }}>
                    <ListItem
                      style={{
                        justifyContent: "space-between",
                        marginLeft: "5%",
                      }}
                    >
                      <h2 style={{ fontSize: "170%" }}>
                        {trip.startStation?.province?.Name} -{" "}
                        {trip.endStation?.province?.Name}
                      </h2>
                    </ListItem>
                    <div style={{ fontSize: "120%" }}>
                      <ListItem>
                        <div
                          style={{
                            marginLeft: "0.4%",
                            marginTop: "6%",
                            width: "160%",
                          }}
                        >
                          <TripOriginIcon
                            style={{
                              fontSize: "100%",
                              marginRight: "1%",
                              paddingTop: "1%",
                              color: "blue",
                            }}
                          />
                          {trip.startStation?.Name}
                          <div style={{ marginLeft: "5%" }}>
                            <b>{new Date(trip.DepartDate).toLocaleString()}</b>
                          </div>
                        </div>
                      </ListItem>
                      <ListItem>
                        <div style={{ width: "160%" }}>
                          <LocationOnIcon
                            style={{
                              fontSize: "120%",
                              marginRight: "1%",
                              paddingTop: "1%",
                              color: "red",
                            }}
                          />
                          {trip.endStation?.Name}
                          <div style={{ marginLeft: "5%" }}>
                            <b> {new Date(trip.FinishDate).toLocaleString()}</b>
                          </div>
                        </div>
                      </ListItem>
                      <ListItem style={{ marginTop: "1%" }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Duration :</b>
                        <div style={{ marginLeft: "1%", color: "red" }}>
                          <b>
                            {getTimeDifference(
                              trip.DepartDate,
                              trip.FinishDate
                            )}
                          </b>
                        </div>
                      </ListItem>
                      <ListItem style={{ marginTop: "1%" }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Price :</b>
                        <div
                          style={{
                            fontSize: "130%",
                            marginLeft: "1%",
                            color: "#5058DB",
                          }}
                        >
                          <b>{trip.Price?.toLocaleString("vi-VN") + " VND"}</b>
                        </div>
                      </ListItem>
                      <ListItem style={{ marginTop: "1%" }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Bus :</b>
                        <div style={{ marginLeft: "1%" }}>
                          {trip.bus?.Name} - {trip.bus?.RegNo}
                        </div>
                      </ListItem>
                      <ListItem style={{ marginTop: "1%" }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Bus Type :</b>
                        <div style={{ marginLeft: "1%" }}>
                          {trip.bus?.busType?.Name}
                        </div>
                      </ListItem>
                      <ListItem style={{ marginTop: "1%" }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Driver :</b>
                        <div style={{ marginLeft: "1%" }}>
                          {trip.driver?.Name}
                        </div>
                      </ListItem>
                      <ListItem style={{ marginTop: "1%", marginBottom: "1%" }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Slot :</b>
                        <div style={{ marginLeft: "1%", color: "red" }}>
                          <b>{trip.bus?.busType?.SeatNum}</b>
                        </div>
                      </ListItem>
                      <ListItem style={{ marginBottom: "1%" }}>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Empty :</b>
                        <div style={{ marginLeft: "1%", color: "red" }}>
                          <b>
                            {trip.bus?.busType?.SeatNum -
                              bookedBusSeatIDs.length}
                          </b>
                        </div>
                      </ListItem>
                      <ListItem>
                        <FiberManualRecordIcon
                          style={{
                            fontSize: "80%",
                            marginLeft: "1%",
                            marginRight: "1%",
                          }}
                        />
                        <b>Status :</b>
                        <div
                          style={{
                            marginLeft: "1%",
                            color: "red",
                          }}
                        >
                          {trip.IsCancelled ? (
                            <Tag style={{ fontSize: "100%" }} color="#f50">
                              Cancelled
                            </Tag>
                          ) : (
                            <Tag style={{ fontSize: "100%" }} color="#87d068">
                              Active
                            </Tag>
                          )}
                        </div>
                      </ListItem>
                    </div>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper elevation={10} style={{ paddingTop: "3%" }}>
              {trip.bus?.BusTypeID === 1 ? (
                /*------------------------------------- BUS 16 SEAT -----------------------------------------------*/
                <Paper
                  elevation={12}
                  style={{
                    backgroundColor: "#F3EFDA",
                    width: "50%",
                    marginLeft: "26%",
                    borderRadius: "30px",
                    marginBottom: "3%",
                    paddingTop: "3%",
                    paddingBottom: "1.5%",
                  }}
                >
                  <Grid
                    style={{
                      marginTop: "0.1%",
                    }}
                    container
                    spacing={2}
                  >
                    <Grid item xs={6}>
                      {busSeats.slice(0, 8).map((item) => {
                        return (
                          <Button
                            onClick={() => handleChooseSeat(item)}
                            value={item.ID}
                            style={{
                              padding: "15px",
                              marginLeft: "40%",
                              marginTop: "6%",
                              backgroundColor: bookedBusSeatIDs.includes(
                                item.ID
                              )
                                ? "#E3584D"
                                : busSeatsChosenID.includes(item.ID)
                                ? "#71ED58"
                                : "#CFC6C5",
                            }}
                            variant="contained"
                          >
                            {item.Name}
                          </Button>
                        );
                      })}
                    </Grid>
                    <Grid item xs={6}>
                      {busSeats.slice(8, 16).map((item) => {
                        return (
                          <Button
                            onClick={() => handleChooseSeat(item)}
                            style={{
                              padding: "15px",
                              marginLeft: "10%",
                              marginTop: "6%",
                              backgroundColor: bookedBusSeatIDs.includes(
                                item.ID
                              )
                                ? "#E3584D"
                                : busSeatsChosenID.includes(item.ID)
                                ? "#71ED58"
                                : "#CFC6C5",
                            }}
                            variant="contained"
                          >
                            {item.Name}
                          </Button>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Paper>
              ) : trip.bus?.BusTypeID === 2 ? (
                /*------------------------------------- BUS 28 SEAT -----------------------------------------------*/
                <Paper
                  elevation={12}
                  style={{
                    backgroundColor: "#F3EFDA",
                    width: "70%",
                    marginLeft: "15%",
                    borderRadius: "30px",
                    marginBottom: "3%",
                    paddingTop: "3%",
                    paddingBottom: "1.5%",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      {busSeats.slice(0, 7).map((item) => {
                        return (
                          <Button
                            onClick={() => handleChooseSeat(item)}
                            style={{
                              padding: "15px",
                              marginLeft: "20%",
                              marginTop: "23.5%",
                              backgroundColor: bookedBusSeatIDs.includes(
                                item.ID
                              )
                                ? "#E3584D"
                                : busSeatsChosenID.includes(item.ID)
                                ? "#71ED58"
                                : "#CFC6C5",
                            }}
                            variant="contained"
                          >
                            {item.Name}
                          </Button>
                        );
                      })}
                    </Grid>
                    <Grid item xs={3}>
                      {busSeats.slice(7, 14).map((item) => {
                        return (
                          <Button
                            onClick={() => handleChooseSeat(item)}
                            style={{
                              padding: "15px",
                              marginTop: "23.5%",
                              backgroundColor: bookedBusSeatIDs.includes(
                                item.ID
                              )
                                ? "#E3584D"
                                : busSeatsChosenID.includes(item.ID)
                                ? "#71ED58"
                                : "#CFC6C5",
                            }}
                            variant="contained"
                          >
                            {item.Name}
                          </Button>
                        );
                      })}
                    </Grid>
                    <Grid item xs={3}>
                      {busSeats.slice(14, 21).map((item) => {
                        return (
                          <Button
                            onClick={() => handleChooseSeat(item)}
                            style={{
                              padding: "15px",
                              marginLeft: "17%",
                              marginTop: "23.5%",
                              backgroundColor: bookedBusSeatIDs.includes(
                                item.ID
                              )
                                ? "#E3584D"
                                : busSeatsChosenID.includes(item.ID)
                                ? "#71ED58"
                                : "#CFC6C5",
                            }}
                            variant="contained"
                          >
                            {item.Name}
                          </Button>
                        );
                      })}
                    </Grid>
                    <Grid item xs={3}>
                      {busSeats.slice(21, 29).map((item) => {
                        return (
                          <Button
                            onClick={() => handleChooseSeat(item)}
                            style={{
                              padding: "15px",
                              marginTop: "23.5%",
                              backgroundColor: bookedBusSeatIDs.includes(
                                item.ID
                              )
                                ? "#E3584D"
                                : busSeatsChosenID.includes(item.ID)
                                ? "#71ED58"
                                : "#CFC6C5",
                            }}
                            variant="contained"
                          >
                            {item.Name}
                          </Button>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Paper>
              ) : trip.bus?.BusTypeID === 3 ? (
                /*------------------------------------- BUS 32 SEAT -----------------------------------------------*/
                <div>
                  <div style={{ fontSize: "130%" }}>
                    <b style={{ marginLeft: "16%" }}>1.ST FLOOR</b>
                    <b style={{ marginLeft: "29%" }}>2.ND FLOOR</b>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Paper
                      elevation={12}
                      style={{
                        backgroundColor: "#F3EFDA",
                        width: "47%",
                        marginLeft: "2%",
                        borderRadius: "30px",
                        marginBottom: "3%",
                        paddingTop: "3%",
                        paddingBottom: "1.5%",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          {busSeats.slice(0, 8).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "15px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                        <Grid item xs={6}>
                          {busSeats.slice(8, 16).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "15px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Paper>
                    <Paper
                      elevation={12}
                      style={{
                        backgroundColor: "#F3EFDA",
                        width: "47%",
                        marginLeft: "2%",
                        borderRadius: "30px",
                        marginBottom: "3%",
                        paddingTop: "3%",
                        paddingBottom: "1.5%",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          {busSeats.slice(16, 24).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "15px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                        <Grid item xs={6}>
                          {busSeats.slice(24, 32).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "15px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                </div>
              ) : (
                /*------------------------------------- BUS 40 SEAT -----------------------------------------------*/
                <div>
                  <div style={{ fontSize: "130%" }}>
                    <b style={{ marginLeft: "16%" }}>1.ST FLOOR</b>
                    <b style={{ marginLeft: "29%" }}>2.ND FLOOR</b>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Paper
                      elevation={12}
                      style={{
                        backgroundColor: "#F3EFDA",
                        width: "47%",
                        marginLeft: "2%",
                        borderRadius: "30px",
                        paddingTop: "3%",
                        paddingBottom: "0.5%",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          {busSeats.slice(0, 10).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "10px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                        <Grid item xs={6}>
                          {busSeats.slice(10, 20).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "10px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Paper>
                    <Paper
                      elevation={12}
                      style={{
                        backgroundColor: "#F3EFDA",
                        width: "47%",
                        marginLeft: "2%",
                        borderRadius: "30px",
                        paddingTop: "3%",
                        paddingBottom: "0.5%",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          {busSeats.slice(20, 30).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "10px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                        <Grid item xs={6}>
                          {busSeats.slice(30, 40).map((item) => {
                            return (
                              <Button
                                onClick={() => handleChooseSeat(item)}
                                style={{
                                  padding: "10px",
                                  marginLeft: "20%",
                                  marginTop: "5%",
                                  backgroundColor: bookedBusSeatIDs.includes(
                                    item.ID
                                  )
                                    ? "#E3584D"
                                    : busSeatsChosenID.includes(item.ID)
                                    ? "#71ED58"
                                    : "#CFC6C5",
                                }}
                                variant="contained"
                              >
                                {item.Name}
                              </Button>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
                </div>
              )}
              <Paper elevation={12} style={{ paddingTop: "3%" }}>
                <div>
                  <Button
                    variant="contained"
                    style={{
                      minWidth: "3%",
                      height: "30px",
                      backgroundColor: "#E3584D",
                      marginLeft: "10%",
                    }}
                  ></Button>
                  <b
                    style={{
                      fontSize: "120%",
                      marginLeft: "1%",
                      marginRight: "10%",
                    }}
                  >
                    Ordered
                  </b>
                  <Button
                    variant="contained"
                    style={{
                      minWidth: "3%",
                      height: "30px",
                      backgroundColor: "#CFC6C5",
                    }}
                  ></Button>
                  <b
                    style={{
                      fontSize: "120%",
                      marginLeft: "1%",
                      marginRight: "10%",
                    }}
                  >
                    Empty
                  </b>
                  <Button
                    variant="contained"
                    style={{
                      minWidth: "3%",
                      height: "30px",
                      backgroundColor: "#71ED58",
                    }}
                  ></Button>
                  <b
                    style={{
                      fontSize: "120%",
                      marginLeft: "1%",
                    }}
                  >
                    Pending
                  </b>
                </div>
                <div style={{ display: "flex" }}>
                  <b
                    style={{
                      fontSize: "140%",
                      marginLeft: "3%",
                      fontWeight: "bold",
                      marginTop: "2%",
                    }}
                  >
                    Bus Slots :
                  </b>
                  <div
                    style={{
                      fontSize: "140%",
                      marginLeft: "3%",
                      fontWeight: "bold",
                      marginTop: "2%",
                    }}
                  >
                    {busSeatsChosenID
                      .map((item) => {
                        return busSeats.find((seat) => seat.ID === item).Name;
                      })
                      .join(", ")}
                  </div>
                </div>
                <b
                  style={{
                    fontSize: "140%",
                    marginLeft: "3%",
                    fontWeight: "bold",
                  }}
                >
                  Total Price :
                </b>
                <InputBase
                  style={{ color: "red", fontSize: "160%", fontWeight: "bold" }}
                  sx={{ ml: 2, flex: 1, width: 200 }}
                  readOnly
                  value={
                    (trip.Price * busSeatsChosenID.length)?.toLocaleString(
                      "vi-VN"
                    ) + " VND"
                  }
                  placeholder="0 đ"
                />

                <Button
                  color="primary"
                  onClick={handleOpenTripOrdered}
                  variant="contained"
                  style={{
                    marginLeft: "34%",
                    marginBottom: "4%",
                    marginTop: "1%",
                  }}
                >
                  View trip ordered
                </Button>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openTripOrdered}
        onCancel={handleCloseTripOrdered}
        width={1300}
        footer={null}
      >
        <b style={{ fontSize: "150%", marginLeft: "42%" }}>
          Trip ordered information
        </b>
        <Table
          style={{ marginTop: "2%" }}
          rowKey="Id"
          columns={columns}
          dataSource={tickets}
        />
      </Modal>
      <Stack direction="row" mt="20px" justifyContent="center" spacing={2}>
        <Pagination
          color="error"
          count={30}
          page={page}
          onChange={handleChangePage}
        ></Pagination>
      </Stack>
    </div>
  );
};

export default AdminDashboard;
