import { Table } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal } from "antd";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MapIcon from "@mui/icons-material/Map";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import dayjs from "dayjs";
import { format } from "date-fns";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getTimeDifference } from "../../../base";
import { IOSSwitch } from "../../style";
import { useNavigate } from "react-router-dom";
import { ROLE_ID } from "../../../constant";

const Trip = () => {
  const columns = [
    {
      title: "Start province",
      dataIndex: "startStation",
      key: "startStation",
      render: (item) => {
        return item?.province?.Name;
      },
    },
    {
      title: "End province",
      dataIndex: "endStation",
      key: "endStation",
      render: (item) => {
        return item?.province?.Name;
      },
    },
    {
      title: "Departure time",
      dataIndex: "DepartDate",
      key: "DepartureDate",
      render: (item) => {
        const date = new Date(item);
        return date.toLocaleString();
      },
    },
    {
      title: "Finish time",
      dataIndex: "FinishDate",
      key: "FinishDate",
      render: (item) => {
        const date = new Date(item);
        return date.toLocaleString();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "35%",
      render: (text, data) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenTripInfo(data)}
              aria-label="action"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => handleOpenTripEdit(data)}
              style={{ marginLeft: "2%" }}
              aria-label="action"
            >
              <EditIcon />
            </IconButton>
            <FormControlLabel
              style={{ marginLeft: "2%" }}
              control={
                <IOSSwitch
                  onClick={() => handleCancelledStatusChange(data)}
                  checked={data.IsCancelled ? true : false}
                />
              }
              label="Cancelled"
            />
            <FormControlLabel
              control={
                <IOSSwitch
                  onClick={() => handleCompletedStatusChange(data)}
                  checked={data.IsCompleted ? true : false}
                />
              }
              label="Completed"
            />
          </>
        );
      },
    },
  ];

  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState({});
  const [openInfo, setOpenInfo] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [startProvinceID, setStartProvinceID] = useState(1);
  const [endProvinceID, setEndProvinceID] = useState(1);
  const [tripDate, setTripDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [openAddTrip, setOpenAddTrip] = useState(false);

  // Add trip modal
  const [startProvinceAddTripID, setStartProvinceAddTripID] = useState(1);
  const [endProvinceAddTripID, setEndProvinceAddTripID] = useState(1);
  const [startStationAddTrip, setStartStationAddTrip] = useState([]);
  const [endStationAddTrip, setEndStationAddTrip] = useState([]);
  const [startStationAddTripID, setStartStationAddTripID] = useState(1);
  const [endStationAddTripID, setEndStationAddTripID] = useState(1);
  const [priceAddTrip, setPriceAddTrip] = useState(0);
  const [busAddTripID, setBusAddTripID] = useState(1);
  const [busAddTrip, setBusAddTrip] = useState([]);
  const [driversAddTrip, setDriversAddTrip] = useState([]);
  const [driverAddTripID, setDriverAddTripID] = useState(1);
  const [imageUrlAddTrip, setImageUrlAddTrip] = useState("");
  const [departureTimeAddTrip, setDepartureTimeAddTrip] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [finishTimeAddTrip, setFinishTimeAddTrip] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [duration, setDuration] = useState("");

  //Edit trip
  const [editTripID, setEditTripID] = useState(1);
  const [startProvinceEditTripID, setStartProvinceEditTripID] = useState(1);
  const [endProvinceEditTripID, setEndProvinceEditTripID] = useState(1);
  const [startProvinceEditTrip, setStartProvinceEditTrip] = useState([]);
  const [endProvinceEditTrip, setEndProvinceEditTrip] = useState([]);
  const [startStationEditTripID, setStartStationEditTripID] = useState(1);
  const [endStationEditTripID, setEndStationEditTripID] = useState(1);
  const [startStationEditTrip, setStartStationEditTrip] = useState([]);
  const [endStationEditTrip, setEndStationEditTrip] = useState([]);
  const [priceEditTrip, setPriceEditTrip] = useState(0);
  const [busEditTripID, setBusEditTripID] = useState(1);
  const [driverEditTripID, setDriverEditTripID] = useState(1);
  const [busesEditTrip, setBusesEditTrip] = useState([]);
  const [driversEditTrip, setDriversEditTrip] = useState([]);
  const [imageUrlEditTrip, setImageUrlEditTrip] = useState("");
  const [durationEditTrip, setDurationEditTrip] = useState("");
  const [departureTimeEditTrip, setDepartureTimeEditTrip] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [finishTimeEditTrip, setFinishTimeEditTrip] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
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
      axios
        .get("api/trip", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setTrips(res.data.data);
        });

      axios.get("api/province").then((res) => {
        setProvinces(res.data);
        setImageUrlAddTrip(res.data[0].ImageUrl);
      });
    }
  }, []);

  const handleCancelledStatusChange = async (trip) => {
    const input = {
      TripID: trip.ID,
      IsCancelled: !trip.IsCancelled,
    };

    await axios.patch(`api/trip/cancel`, input, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });

    await axios
      .get("api/trip", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTrips(res.data.data);
      });
  };

  const handleCompletedStatusChange = async (trip) => {
    const input = {
      TripID: trip.ID,
      IsCompleted: !trip.IsCompleted,
    };

    await axios.patch(`api/trip/complete`, input, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });

    await axios
      .get("api/trip", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTrips(res.data.data);
      });
  };

  const handleOpenTripInfo = async (trip) => {
    await axios
      .get(`api/trip/${trip.ID}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTrip(res.data);
      });

    setOpenInfo(true);
  };

  const handleTripDateChange = (event) => {
    setTripDate(format(event["$d"], "yyyy-MM-dd"));
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
        setTrips(res.data.data);
        toast.success("Find trip successfully!", {
          position: "bottom-left",
        });
      });
  };

  const handleResetTrip = async (event) => {
    event.preventDefault();
    await axios
      .get("api/trip", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setTrips(res.data.data);
        setStartProvinceID(1);
        setEndProvinceID(1);
        setTripDate(format(new Date(), "yyyy-MM-dd"));
        toast.success("Reset trip successfully!", {
          position: "bottom-left",
        });
      });
  };

  const handleSwapProvince = () => {
    setStartProvinceID(endProvinceID);
    setEndProvinceID(startProvinceID);
  };

  const handleOpenAddTrip = async () => {
    setOpenAddTrip(true);
    await axios.get(`api/station?provinceID=1&IsActive=true`).then((res) => {
      setStartProvinceAddTripID(1);
      setEndProvinceAddTripID(1);
      setStartStationAddTrip(res.data);
      setEndStationAddTrip(res.data);
      setStartStationAddTripID(res.data[0]?.ID);
      setEndStationAddTripID(res.data[0]?.ID);
      setImageUrlAddTrip(res.data[0]?.province?.ImageUrl);
    });

    await axios
      .get("api/bus/active", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setBusAddTrip(res.data);
        setBusAddTripID(res.data[0].ID);
      });

    await axios
      .get("api/driver/active", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setDriversAddTrip(res.data);
        setDriverAddTripID(res.data[0].ID);
      });
  };

  const handleChangeStartProvinceAddTrip = async (event) => {
    setStartProvinceAddTripID(event.target.value);
    await axios
      .get(`api/station?provinceID=${event.target.value}&IsActive=true`)
      .then((res) => {
        setStartStationAddTrip(res.data);
        setStartStationAddTripID(res.data[0].ID);
      });
  };

  const handleChangeEndProvinceAddTrip = async (event) => {
    setEndProvinceAddTripID(event.target.value);
    await axios
      .get(`api/station?provinceID=${event.target.value}&IsActive=true`)
      .then((res) => {
        setEndStationAddTrip(res.data);
        setEndStationAddTripID(res.data[0].ID);
        setImageUrlAddTrip(provinces[event.target.value - 1]?.ImageUrl);
      });
  };

  const handleChangeStartStationAddTrip = (event) => {
    setStartStationAddTripID(event.target.value);
  };

  const handleChangeEndStationAddTrip = (event) => {
    setEndStationAddTripID(event.target.value);
  };

  const handleChangeBusAddTrip = (event) => {
    setBusAddTripID(event.target.value);
  };

  const handleChangeDriverAddTrip = (event) => {
    setDriverAddTripID(event.target.value);
  };

  const handleChangeBusEditTrip = (event) => {
    setBusEditTripID(event.target.value);
  };

  const handleChangeDriverEditTrip = (event) => {
    setDriverEditTripID(event.target.value);
  };

  const handleChangeDepartureTimeAddTrip = (event) => {
    setDepartureTimeAddTrip(event);
    const tripDuration = getTimeDifference(event, finishTimeAddTrip);
    setDuration(tripDuration);
  };

  const handleChangeDepartureTimeEditTrip = (event) => {
    setDepartureTimeEditTrip(event);
    const tripDuration = getTimeDifference(event, finishTimeEditTrip);
    setDurationEditTrip(tripDuration);
  };

  const handleChangeFinishTimeAddTrip = (event) => {
    setFinishTimeAddTrip(event);
    const tripDuration = getTimeDifference(departureTimeAddTrip, event);
    setDuration(tripDuration);
  };

  const handleChangeFinishTimeEditTrip = (event) => {
    setFinishTimeEditTrip(event);
    const tripDuration = getTimeDifference(departureTimeEditTrip, event);
    setDurationEditTrip(tripDuration);
  };

  const handleAddNewTrip = async (event) => {
    event.preventDefault();

    const body = {
      StartStationID: startStationAddTripID,
      EndStationID: endStationAddTripID,
      Price: priceAddTrip,
      BusID: busAddTripID,
      DriverID: driverAddTripID,
      DepartDate: departureTimeAddTrip,
      FinishDate: finishTimeAddTrip,
    };

    await axios
      .post("api/trip", body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(async (res) => {
        setOpenAddTrip(false);
        toast.success("Add new trip successfully!", {
          position: "bottom-left",
        });
        await axios
          .get("api/trip", {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setTrips(res.data.data);
            setStartProvinceID(1);
            setEndProvinceID(1);
            setTripDate(format(new Date(), "yyyy-MM-dd"));
          });
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  const handleOpenTripEdit = async (trip) => {
    await axios
      .get(`api/trip/${trip.ID}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setEditTripID(trip.ID);
        setStartProvinceEditTripID(res.data.startStation?.ProvinceID);
        setEndProvinceEditTripID(res.data.endStation?.ProvinceID);
        setStartStationEditTripID(res.data?.StartStationID);
        setEndStationEditTripID(res.data?.EndStationID);
        setStartProvinceEditTrip(res.data.startStation?.province);
        setEndProvinceEditTrip(res.data.endStation?.province);
        setStartStationEditTrip(res.data.startStation);
        setEndStationEditTrip(res.data.endStation);
        setPriceEditTrip(res.data.Price);
        setBusEditTripID(res.data.BusID);
        setDriverEditTripID(res.data.DriverID);
        setDepartureTimeEditTrip(res.data.DepartDate);
        setFinishTimeEditTrip(res.data.FinishDate);
        setImageUrlEditTrip(res.data.endStation?.province.ImageUrl);
        setDurationEditTrip(
          getTimeDifference(res.data.DepartDate, res.data.FinishDate)
        );
      });
    await axios
      .get("api/bus/active", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setBusesEditTrip(res.data);
      });

    await axios
      .get("api/driver/active", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setDriversEditTrip(res.data);
      });
    setOpenEdit(true);
  };

  const handleEditTrip = async (event) => {
    event.preventDefault();
    const body = {
      TripID: editTripID,
      DepartDate: departureTimeEditTrip,
      FinishDate: finishTimeEditTrip,
      Price: priceEditTrip,
      BusID: busEditTripID,
      DriverID: driverEditTripID,
    };

    await axios
      .patch("api/trip", body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(async (res) => {
        toast.success("Edit trip successfully!", {
          position: "bottom-left",
        });
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  return (
    <>
      <FormControl style={{ width: "15%", backgroundColor: "white" }}>
        <InputLabel id="demo-simple-select-label">Start Province</InputLabel>
        <Select
          MenuProps={{
            style: {
              maxHeight: 400,
            },
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={startProvinceID}
          onChange={(e) => setStartProvinceID(e.target.value)}
          label="StartProvince"
        >
          {provinces.map((item) => {
            return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <Button onClick={handleSwapProvince} sx={{ borderRadius: 28 }}>
        <SwapHorizIcon />
      </Button>
      <FormControl style={{ width: "15%", backgroundColor: "white" }}>
        <InputLabel id="demo-simple-select-label">End Province</InputLabel>
        <Select
          MenuProps={{
            style: {
              maxHeight: 400,
            },
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={endProvinceID}
          onChange={(e) => setEndProvinceID(e.target.value)}
          label="EndProvince"
        >
          {provinces.map((item) => {
            return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <FormControl
        style={{ marginLeft: "3%", width: "15%", backgroundColor: "white" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker onChange={handleTripDateChange} value={dayjs(tripDate)} />
        </LocalizationProvider>
      </FormControl>
      <Button
        onClick={handleSearchTrip}
        style={{ marginLeft: "1%", height: "50px" }}
        variant="contained"
      >
        <MapIcon />
      </Button>
      <Button
        onClick={handleResetTrip}
        style={{ marginLeft: "1%", height: "50px" }}
        variant="contained"
        color="error"
      >
        <RestartAltIcon />
      </Button>
      <Button
        onClick={handleOpenAddTrip}
        style={{ marginLeft: "23%" }}
        variant="contained"
        color="success"
      >
        Create Trip
      </Button>
      <div style={{ marginTop: "2%", marginRight: "3%" }}>
        <Table rowKey="Id" columns={columns} dataSource={trips} />
      </div>
      <Modal
        destroyOnClose
        centered
        open={openInfo}
        onCancel={() => setOpenInfo(false)}
        width={800}
        footer={null}
      >
        <div style={{ fontSize: "120%" }}>
          <h2 style={{ display: "inline" }}>Trip information :</h2>
          <div
            style={{
              display: "inline",
              marginLeft: "4%",
              fontSize: "130%",
            }}
          >
            <b>
              {trip.startStation?.province.Name} {"-> "}
              {trip.endStation?.province.Name}
            </b>
          </div>
          <img
            src={trip.endStation?.province.ImageUrl}
            alt="img"
            style={{
              marginTop: "3%",
              marginLeft: "20%",
              width: "60%",
              height: "240px",
            }}
          />
          <div>
            <b>Route : </b>
            {trip.startStation?.Name} {"->"} {trip.endStation?.Name}
          </div>
          <div>
            <b></b>
          </div>
          <div>
            <b>Price : </b>
            {trip.Price?.toLocaleString("vi-VN") + " VND"}
          </div>
          <div>
            <b>Departure Time : </b>
            {new Date(trip.DepartDate).toLocaleString()}
          </div>
          <div>
            <b>Finish Time : </b>
            {new Date(trip.FinishDate).toLocaleString()}
          </div>
          <div>
            <b>Duration : </b>
            {getTimeDifference(trip.DepartDate, trip.FinishDate)}
          </div>
          <div>
            <b>Bus : </b>
            {trip.bus?.Name} - {trip.bus?.RegNo}
          </div>
          <div>
            <b>Driver : </b>
            {trip.driver?.Name}
          </div>
        </div>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openAddTrip}
        onCancel={() => setOpenAddTrip(false)}
        width={800}
        footer={null}
      >
        <div style={{ fontSize: "120%" }}>
          <h2 style={{ display: "inline" }}>Add new trip :</h2>
        </div>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <img
            src={imageUrlAddTrip}
            alt="img"
            style={{
              marginTop: "3%",
              marginLeft: "20%",
              width: "60%",
              height: "240px",
            }}
          />
          <FormControl style={{ marginTop: "2.2%", minWidth: "35%" }}>
            <InputLabel id="demo-simple-select-label">
              Start Province*
            </InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              value={startProvinceAddTripID}
              onChange={handleChangeStartProvinceAddTrip}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="StartProvince*"
            >
              {provinces.map((item) => {
                return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl
            style={{ marginTop: "2.2%", marginLeft: "2%", minWidth: "63%" }}
          >
            <InputLabel id="demo-simple-select-label">
              Start Station*
            </InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="StartStation*"
              onChange={handleChangeStartStationAddTrip}
              value={startStationAddTripID}
            >
              {startStationAddTrip.map((item) => {
                return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl style={{ marginTop: "2.2%", minWidth: "35%" }}>
            <InputLabel id="demo-simple-select-label">End Province*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              value={endProvinceAddTripID}
              onChange={handleChangeEndProvinceAddTrip}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="EndProvince*"
            >
              {provinces.map((item) => {
                return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl
            style={{ marginTop: "2.2%", marginLeft: "2%", minWidth: "63%" }}
          >
            <InputLabel id="demo-simple-select-label">End Station*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="endStation*"
              onChange={handleChangeEndStationAddTrip}
              value={endStationAddTripID}
            >
              {endStationAddTrip.map((item) => {
                return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl
            style={{
              marginTop: "2.2%",
              width: "38%",
              backgroundColor: "white",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                onChange={handleChangeDepartureTimeAddTrip}
                value={dayjs(departureTimeAddTrip)}
                label="Departure Time*"
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl
            style={{
              marginLeft: "2%",
              marginTop: "2.2%",
              width: "38%",
              backgroundColor: "white",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                onChange={handleChangeFinishTimeAddTrip}
                value={dayjs(finishTimeAddTrip)}
                label="Finish Time*"
              />
            </LocalizationProvider>
          </FormControl>
          <TextField
            margin="normal"
            required
            id="duration"
            label="Duration"
            name="duration"
            autoComplete="duration"
            autoFocus
            readOnly
            value={duration}
            style={{ marginLeft: "2%", width: "20%" }}
          />
          <TextField
            margin="normal"
            required
            id="price"
            label="Price (VND)"
            name="price"
            autoComplete="price"
            autoFocus
            value={priceAddTrip}
            onChange={(e) => setPriceAddTrip(e.target.value)}
            style={{ width: "15%" }}
          />
          <FormControl
            style={{ marginLeft: "2%", marginTop: "2.2%", width: "47%" }}
          >
            <InputLabel id="demo-simple-select-label">Bus*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 150,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Bus*"
              value={busAddTripID}
              onChange={handleChangeBusAddTrip}
            >
              {busAddTrip.map((item) => {
                return (
                  <MenuItem value={item.ID}>
                    {item.Name} - {item.RegNo}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            style={{ marginLeft: "2%", marginTop: "2.2%", minWidth: "34%" }}
          >
            <InputLabel id="demo-simple-select-label">Driver*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 150,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Driver*"
              onChange={handleChangeDriverAddTrip}
              value={driverAddTripID}
            >
              {driversAddTrip.map((item) => {
                return (
                  <MenuItem value={item.ID}>
                    {item.Name} - {item.LicenseClass}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => setOpenAddTrip(false)}
            style={{
              marginTop: "2%",
              marginLeft: "75%",
              backgroundColor: "red",
              display: "inline",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            style={{
              marginTop: "2%",
              marginLeft: "2%",
              backgroundColor: "green",
              display: "inline",
            }}
            onClick={handleAddNewTrip}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        width={800}
        footer={null}
      >
        <div style={{ fontSize: "120%" }}>
          <h2 style={{ display: "inline" }}>Edit trip information :</h2>
        </div>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <img
            src={imageUrlEditTrip}
            alt="img"
            style={{
              marginTop: "3%",
              marginLeft: "20%",
              width: "60%",
              height: "240px",
            }}
          />
          <FormControl style={{ marginTop: "2.2%", minWidth: "35%" }}>
            <InputLabel id="demo-simple-select-label">
              Start Province*
            </InputLabel>
            <Select
              readOnly
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              value={startProvinceEditTripID}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="StartProvince*"
            >
              <MenuItem value={startProvinceEditTrip.ID}>
                {startProvinceEditTrip.Name}
              </MenuItem>
              ;
            </Select>
          </FormControl>
          <FormControl
            style={{ marginTop: "2.2%", marginLeft: "2%", minWidth: "63%" }}
          >
            <InputLabel id="demo-simple-select-label">
              Start Station*
            </InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="StartStation*"
              readOnly
              value={startStationEditTripID}
            >
              <MenuItem value={startStationEditTrip.ID}>
                {startStationEditTrip.Name}
              </MenuItem>
              ;
            </Select>
          </FormControl>
          <FormControl style={{ marginTop: "2.2%", minWidth: "35%" }}>
            <InputLabel id="demo-simple-select-label">End Province*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              value={endProvinceEditTripID}
              onChange={handleChangeEndProvinceAddTrip}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="EndProvince*"
              readOnly
            >
              <MenuItem value={endProvinceEditTrip.ID}>
                {endProvinceEditTrip.Name}
              </MenuItem>
              ;
            </Select>
          </FormControl>
          <FormControl
            style={{ marginTop: "2.2%", marginLeft: "2%", minWidth: "63%" }}
          >
            <InputLabel id="demo-simple-select-label">End Station*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 300,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="endStation*"
              onChange={handleChangeEndStationAddTrip}
              value={endStationEditTripID}
              readOnly
            >
              <MenuItem value={endStationEditTrip.ID}>
                {endStationEditTrip.Name}
              </MenuItem>
              ;
            </Select>
          </FormControl>
          <FormControl
            style={{
              marginTop: "2.2%",
              width: "38%",
              backgroundColor: "white",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                onChange={handleChangeDepartureTimeEditTrip}
                value={dayjs(departureTimeEditTrip)}
                label="Departure Time*"
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl
            style={{
              marginLeft: "2%",
              marginTop: "2.2%",
              width: "38%",
              backgroundColor: "white",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                onChange={handleChangeFinishTimeEditTrip}
                value={dayjs(finishTimeEditTrip)}
                label="Finish Time*"
              />
            </LocalizationProvider>
          </FormControl>
          <TextField
            margin="normal"
            required
            id="duration"
            label="Duration"
            name="duration"
            autoComplete="duration"
            autoFocus
            readOnly
            value={durationEditTrip}
            style={{ marginLeft: "2%", width: "20%" }}
          />
          <TextField
            margin="normal"
            required
            id="price"
            label="Price (VND)"
            name="price"
            autoComplete="price"
            autoFocus
            value={priceEditTrip}
            onChange={(e) => setPriceEditTrip(e.target.value)}
            style={{ width: "15%" }}
          />
          <FormControl
            style={{ marginLeft: "2%", marginTop: "2.2%", width: "47%" }}
          >
            <InputLabel id="demo-simple-select-label">Bus*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 150,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Bus"
              value={busEditTripID}
              onChange={handleChangeBusEditTrip}
            >
              {busesEditTrip.map((item) => {
                return (
                  <MenuItem value={item.ID}>
                    {item.Name} - {item.RegNo}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            style={{ marginLeft: "2%", marginTop: "2.2%", minWidth: "34%" }}
          >
            <InputLabel id="demo-simple-select-label">Driver*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 150,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Driver"
              onChange={handleChangeDriverEditTrip}
              value={driverEditTripID}
            >
              {driversEditTrip.map((item) => {
                return (
                  <MenuItem value={item.ID}>
                    {item.Name} - {item.LicenseClass}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => setOpenEdit(false)}
            style={{
              marginTop: "2%",
              marginLeft: "75%",
              backgroundColor: "red",
              display: "inline",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            style={{
              marginTop: "2%",
              marginLeft: "2%",
              backgroundColor: "green",
              display: "inline",
            }}
            onClick={handleEditTrip}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Trip;
