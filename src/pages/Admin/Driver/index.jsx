import { Table } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal } from "antd";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ROLE_ID } from "../../../constant";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GENDER } from "../../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IOSSwitch } from "../../style";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import format from "date-fns/format";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";

export const Driver = () => {
  const roleID = Number(localStorage.getItem("RoleID"));

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Phone number",
      dataIndex: "Phonenumber",
      key: "Phonenumber",
    },
    {
      title: "License number",
      dataIndex: "LicenseNo",
      key: "LicenseNo",
    },
    {
      title: "Added date",
      dataIndex: "AddedDate",
      key: "AddedDate",
      render: (item) => {
        const date = new Date(item);
        return date.toLocaleDateString();
      },
    },
    {
      title: "Action",
      key: "action",
      width: "23%",
      render: (text, data) => {
        return (
          <>
            <IconButton
              onClick={() => handleDriverInfoClick(data)}
              aria-label="action"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => handleOpenEdit(data)}
              style={{ marginLeft: "5%" }}
              aria-label="action"
            >
              <EditIcon />
            </IconButton>
            <FormControlLabel
              style={{ marginLeft: "15px" }}
              control={
                <IOSSwitch
                  onClick={() => handleStatusChange(data)}
                  checked={data.IsActive ? true : false}
                />
              }
              label={data.IsActive ? "Active" : "Inactive"}
            />
          </>
        );
      },
    },
  ];

  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState({});
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openDriver, setOpenDriver] = useState(false);
  const [gender, setGender] = useState(10);
  const [licenseDate, setLicenseDate] = useState(null);
  const [licenseExpired, setLicenseExpired] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  //Edit
  const [editID, setEditID] = useState(0);
  const [name, setName] = useState("");
  const [genderEdit, setGenderEdit] = useState(10);
  const [cardID, setCardID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [licenseDateEdit, setLicenseDateEdit] = useState(null);
  const [licenseExpiredEdit, setLicenseExpiredEdit] = useState(null);
  const [licenseClass, setLicenseClass] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (
      (!accessToken &&
        (roleID !== ROLE_ID.Admin || roleID !== ROLE_ID.SuperAdmin)) ||
      (accessToken && roleID === ROLE_ID.User)
    ) {
      navigate("/");
    } else {
      axios
        .get("api/driver", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setDrivers(res.data);
        });
    }
  }, []);

  const handleSearchClick = async (event) => {
    event.preventDefault();

    await axios
      .get(`api/driver?filter=${search}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setDrivers(res.data);
      });
  };

  const handleDriverInfoClick = async (driver) => {
    setDriver(driver);
    setOpen(true);
  };

  const handleStatusChange = async (driver) => {
    const input = {
      DriverID: driver.ID,
      IsActive: !driver.IsActive,
    };

    await axios.patch(`api/driver/status`, input, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });

    await axios
      .get(`api/driver?filter=${search}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setDrivers(res.data);
      });
  };

  const handleAddDriverClick = () => {
    setOpenDriver(true);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleGenderEditChange = (event) => {
    setGenderEdit(event.target.value);
  };

  const handleOpenEdit = (driver) => {
    setEditID(driver.ID);
    setOpenEdit(true);
    setName(driver.Name);
    setGenderEdit(driver.Gender === GENDER.Male ? 10 : 20);
    setCardID(driver.CardID);
    setPhoneNumber(driver.Phonenumber);
    setLicenseNo(driver.LicenseNo);
    setLicenseDateEdit(driver.LicenseDate);
    setLicenseExpiredEdit(driver.LicenseExpiredDate);
    setLicenseClass(driver.LicenseClass);
    setAddress(driver.Address);
    setNote(driver.Note);
  };

  const handleCloseEditDriver = () => {
    setOpenEdit(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      Name: data.get("name"),
      Phonenumber: data.get("phoneNumber"),
      LicenseNo: data.get("licenseNo"),
      CardID: data.get("cardID"),
      Gender: gender === 10 ? GENDER.Male : GENDER.Femail,
      LicenseDate: !licenseDate
        ? null
        : licenseDate.toString().split("-").length === 3
        ? licenseDate
        : format(licenseDate["$d"], "yyyy-MM-dd"),
      LicenseExpiredDate: !licenseExpired
        ? null
        : licenseExpired.toString().split("-").length === 3
        ? licenseExpired
        : format(licenseExpired["$d"], "yyyy-MM-dd"),
      LicenseClass: data.get("licenseType"),
      Address: data.get("address"),
      Note: data.get("note"),
    };

    await axios
      .post(`api/driver`, body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(async (res) => {
        toast.success("Add new driver successfully!", {
          position: "bottom-left",
        });
        setOpenDriver(false);
        setLicenseDate(null);
        setLicenseExpired(null);
        setSearch("");
        await axios
          .get("api/driver", {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setDrivers(res.data);
          });
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  const handleCloseAddDriver = () => {
    setOpenDriver(false);
    setLicenseDate(null);
    setLicenseExpired(null);
  };

  const handleSubmitEditDriver = async () => {
    const body = {
      ID: editID,
      Name: name,
      Gender: genderEdit === 10 ? GENDER.Male : GENDER.Femail,
      CardID: cardID,
      Phonenumber: phoneNumber,
      LicenseNo: licenseNo,
      LicenseDate: !licenseDateEdit
        ? null
        : licenseDateEdit.toString().split("-").length === 3
        ? licenseDateEdit
        : format(licenseDateEdit["$d"], "yyyy-MM-dd"),
      LicenseExpiredDate: !licenseExpiredEdit
        ? null
        : licenseExpiredEdit.toString().split("-").length === 3
        ? licenseExpiredEdit
        : format(licenseExpiredEdit["$d"], "yyyy-MM-dd"),
      LicenseClass: licenseClass,
      Address: address,
      Note: note,
    };

    await axios
      .patch(`api/driver`, body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        toast.success("Edit driver successfully!", {
          position: "bottom-left",
        });
        axios
          .get(`api/driver?filter=${search}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setDrivers(res.data);
          });
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  const handleChangeLicenseDate = (newValue) => {
    if (newValue && newValue["$D"] && newValue["$y"] && newValue["$M"]) {
      setLicenseDate(newValue);
    } else {
      setLicenseDate(null);
    }
  };

  const handleChangeLicenseExpired = (newValue) => {
    if (newValue && newValue["$D"] && newValue["$y"] && newValue["$M"]) {
      setLicenseExpired(newValue);
    } else {
      setLicenseExpired(null);
    }
  };

  const handleChangeLicenseDateEdit = (newValue) => {
    if (newValue && newValue["$D"] && newValue["$y"] && newValue["$M"]) {
      setLicenseDateEdit(newValue);
    } else {
      setLicenseDateEdit(null);
    }
  };

  const handleChangeLicenseExpiredEdit = (newValue) => {
    if (newValue && newValue["$D"] && newValue["$y"] && newValue["$M"]) {
      setLicenseExpiredEdit(newValue);
    } else {
      setLicenseExpiredEdit(null);
    }
  };

  return (
    <>
      <Paper
        component="form"
        sx={{
          display: "inline-block",
          alignItems: "center",
          width: 500,
        }}
      >
        <IconButton aria-label="menu">
          <MenuIcon />
        </IconButton>
        <InputBase
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ml: 2, flex: 1, width: 400 }}
          placeholder="Search by name or license number"
        />
        <IconButton
          onClick={handleSearchClick}
          type="button"
          sx={{ p: "1%" }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <div style={{ display: "inline", marginLeft: "50%" }}>
        <Button
          onClick={() => handleAddDriverClick()}
          variant="contained"
          color="success"
          disabled={roleID === ROLE_ID.User ? true : false}
        >
          Add Driver
        </Button>
      </div>
      <div style={{ marginTop: "1%", marginRight: "3%" }}>
        <Table rowKey="Id" columns={columns} dataSource={drivers} />
      </div>
      <Modal
        destroyOnClose
        centered
        open={open}
        onCancel={() => setOpen(false)}
        width={800}
        footer={null}
      >
        <div style={{ "font-size": "120%" }}>
          <h2 style={{ display: "inline" }}>Driver information :</h2>
          <div
            style={{
              display: "inline",
              marginLeft: "4%",
              fontSize: "130%",
            }}
          >
            <b>{driver.Name}</b>
          </div>
          <div style={{ marginTop: "3%" }}>
            <b>Gender : </b>
            {driver.Gender}{" "}
          </div>
          <div>
            <b>Card ID : </b>
            {driver.CardID}{" "}
          </div>
          <div>
            <b>Phone number : </b>
            {driver.Phonenumber}{" "}
          </div>
          <div>
            <b>License number : </b>
            {driver.LicenseNo}{" "}
          </div>
          <div>
            <b>License date : </b>
            {new Date(driver.LicenseDate).toLocaleDateString()}{" "}
          </div>
          <div>
            <b>License expired date : </b>
            {new Date(driver.LicenseExpiredDate).toLocaleDateString()}{" "}
          </div>
          <div>
            <b>License class : </b>
            {driver.LicenseClass}{" "}
          </div>
          <div>
            <b>Address : </b>
            {driver.Address}{" "}
          </div>
          <div>
            <b>Added Date : </b>
            {new Date(driver.AddedDate).toLocaleString()}{" "}
          </div>
          <div>
            <b>Note : </b>
            {driver.Note}{" "}
          </div>
        </div>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openDriver}
        onCancel={handleCloseAddDriver}
        width={500}
        footer={null}
      >
        <div style={{ "font-size": "170%" }}>
          {" "}
          <b>Add new driver</b>
        </div>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            style={{ width: "100%" }}
          />
          <FormControl style={{ marginTop: "3.7%", minWidth: "35%" }}>
            <InputLabel id="demo-simple-select-label">Gender*</InputLabel>
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
          <TextField
            margin="normal"
            required
            id="cardID"
            label="Card ID"
            name="cardID"
            autoComplete="cardID"
            autoFocus
            style={{ marginLeft: "5%", width: "60%" }}
          />
          <TextField
            margin="normal"
            required
            id="phoneNumber"
            label="Phone number"
            name="phoneNumber"
            autoComplete="naphoneNumberme"
            autoFocus
            style={{ width: "48%" }}
          />
          <TextField
            margin="normal"
            required
            id="licenseNo"
            label="License Number"
            name="licenseNo"
            autoComplete="licenseNo"
            autoFocus
            style={{ marginLeft: "4%", width: "48%" }}
          />
          <div style={{ display: "inline" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={licenseDate}
                onChange={handleChangeLicenseDate}
                label="License date*"
                sx={{ marginTop: "3%", width: "38%" }}
              />
            </LocalizationProvider>
          </div>
          <div style={{ display: "inline" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={licenseExpired}
                onChange={handleChangeLicenseExpired}
                label="License expired*"
                sx={{ marginLeft: "3%", marginTop: "3%", width: "38%" }}
              />
            </LocalizationProvider>
          </div>
          <TextField
            margin="normal"
            required
            id="licenseType"
            label="Class"
            name="licenseType"
            autoComplete="licenseType"
            autoFocus
            style={{ marginLeft: "3%", width: "18%" }}
          />
          <TextField
            margin="normal"
            required
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            autoFocus
            style={{ width: "100%" }}
          />
          <TextField
            margin="normal"
            id="note"
            label="Note"
            name="note"
            autoComplete="note"
            autoFocus
            multiline
            rows={1}
            inputProps={{
              style: {
                height: "50px",
              },
            }}
            style={{ width: "100%" }}
          />
          <Button
            variant="contained"
            onClick={handleCloseAddDriver}
            style={{
              marginTop: "3%",
              marginLeft: "59%",
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
              marginTop: "3%",
              marginLeft: "2%",
              backgroundColor: "green",
              display: "inline",
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openEdit}
        onCancel={handleCloseEditDriver}
        width={500}
        footer={null}
      >
        <div style={{ "font-size": "170%" }}>
          {" "}
          <b>Edit driver information</b>
        </div>
        <Box noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            style={{ width: "100%" }}
          />
          <FormControl style={{ marginTop: "3.7%", minWidth: "35%" }}>
            <InputLabel id="demo-simple-select-label">Gender*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={genderEdit}
              label="gender*"
              onChange={handleGenderEditChange}
            >
              <MenuItem value={10}>Male</MenuItem>
              <MenuItem value={20}>Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            value={cardID}
            onChange={(e) => setCardID(e.target.value)}
            id="cardID"
            label="Card ID"
            name="cardID"
            autoComplete="cardID"
            autoFocus
            style={{ marginLeft: "5%", width: "60%" }}
          />
          <TextField
            margin="normal"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            id="phoneNumber"
            label="Phone number"
            name="phoneNumber"
            autoComplete="naphoneNumberme"
            autoFocus
            style={{ width: "48%" }}
          />
          <TextField
            margin="normal"
            required
            value={licenseNo}
            onChange={(e) => setLicenseNo(e.target.value)}
            id="licenseNo"
            label="License Number"
            name="licenseNo"
            autoComplete="licenseNo"
            autoFocus
            style={{ marginLeft: "4%", width: "48%" }}
          />
          <div style={{ display: "inline" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dayjs(licenseDateEdit)}
                onChange={handleChangeLicenseDateEdit}
                label="License date*"
                sx={{ marginTop: "3%", width: "38%" }}
              />
            </LocalizationProvider>
          </div>
          <div style={{ display: "inline" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dayjs(licenseExpiredEdit)}
                onChange={handleChangeLicenseExpiredEdit}
                label="License expired*"
                sx={{ marginLeft: "3%", marginTop: "3%", width: "38%" }}
              />
            </LocalizationProvider>
          </div>
          <TextField
            margin="normal"
            required
            value={licenseClass}
            onChange={(e) => setLicenseClass(e.target.value)}
            id="licenseType"
            label="Class"
            name="licenseType"
            autoComplete="licenseType"
            autoFocus
            style={{ marginLeft: "3%", width: "18%" }}
          />
          <TextField
            margin="normal"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            autoFocus
            style={{ width: "100%" }}
          />
          <TextField
            margin="normal"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            label="Note"
            name="note"
            autoComplete="note"
            autoFocus
            multiline
            rows={1}
            inputProps={{
              style: {
                height: "50px",
              },
            }}
            style={{ width: "100%" }}
          />
          <Button
            variant="contained"
            onClick={handleCloseEditDriver}
            style={{
              marginTop: "3%",
              marginLeft: "59%",
              backgroundColor: "red",
              display: "inline",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEditDriver}
            variant="contained"
            style={{
              marginTop: "3%",
              marginLeft: "2%",
              backgroundColor: "green",
              display: "inline",
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};
