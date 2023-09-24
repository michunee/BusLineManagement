import { Table } from "antd";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import {
  AccountContainer,
  PersonInfoContainer,
  CreateAdminContainer,
} from "./style";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Modal } from "antd";
import { ROLE_ID } from "../../../constant";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import format from "date-fns/format";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GENDER } from "../../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { IOSSwitch } from "../../style";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Phone number",
      dataIndex: "Phonenumber",
      key: "Phonenumber",
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
      width: "32%",
      render: (text, data) => {
        return (
          <>
            <IconButton
              aria-label="action"
              onClick={() => handlePersonInfoClick(data)}
            >
              <VisibilityIcon />
            </IconButton>
            <FormControlLabel
              style={{ marginLeft: "15px" }}
              control={
                <IOSSwitch
                  onClick={() => handleStatusChange(data)}
                  disabled={
                    currentUserID === data.ID ||
                    data.RoleID === ROLE_ID.SuperAdmin
                      ? true
                      : false
                  }
                  checked={data.IsActive ? true : false}
                />
              }
              label={data.IsActive ? "Active" : "Inactive"}
            />
            <FormControlLabel
              style={{ marginLeft: "15px" }}
              control={
                <IOSSwitch
                  onClick={() => handleRoleChange(data)}
                  disabled={
                    roleID === ROLE_ID.SuperAdmin && data.ID !== currentUserID
                      ? false
                      : true
                  }
                  checked={
                    data.RoleID === ROLE_ID.SuperAdmin ||
                    data.RoleID === ROLE_ID.Admin
                      ? true
                      : false
                  }
                />
              }
              label={
                data.RoleID === ROLE_ID.Admin ||
                data.RoleID === ROLE_ID.SuperAdmin
                  ? data.RoleID === ROLE_ID.SuperAdmin
                    ? "SuperAdmin"
                    : "Admin"
                  : "User"
              }
            />
          </>
        );
      },
    },
  ];
  const [persons, setPersons] = useState([]);
  const [person, setPerson] = useState({});
  const [open, setOpen] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [birthDate, setBirthDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [gender, setGender] = useState(10);
  const [search, setSearch] = useState("");

  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const currentUserID = Number(localStorage.getItem("ID"));
  const roleID = Number(localStorage.getItem("RoleID"));

  const handlePersonInfoClick = async (person) => {
    setPerson(person);
    setOpen(true);
  };

  const handleStatusChange = async (person) => {
    const input = {
      PersonID: person.ID,
      IsActive: !person.IsActive,
    };

    await axios.patch(`api/person/status`, input, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });

    await axios
      .get(`api/person?filter=${search}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setPersons(res.data);
      });
  };

  const handleRoleChange = async (person) => {
    const input = {
      PersonID: person.ID,
      RoleID: person.RoleID === ROLE_ID.User ? ROLE_ID.Admin : ROLE_ID.User,
    };
    await axios.patch(`api/person/role`, input, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });

    await axios
      .get(`api/person?filter=${search}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setPersons(res.data);
      });
  };

  useEffect(() => {
    if (
      (!accessToken &&
        (roleID !== ROLE_ID.Admin || roleID !== ROLE_ID.SuperAdmin)) ||
      (accessToken && roleID === ROLE_ID.User)
    ) {
      navigate("/");
    } else {
      axios
        .get("api/person", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setPersons(res.data);
        });
    }
  }, []);

  const handleCreateAdminClick = () => {
    setOpenAdmin(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(birthDate);
    const data = new FormData(event.currentTarget);
    const body = {
      Email: data.get("email"),
      Password: data.get("password"),
      Name: data.get("name"),
      ConfirmPassword: data.get("confirmPassword"),
      CardID: data.get("cardID"),
      Phonenumber: data.get("phonenumber"),
      Gender: gender === 10 ? GENDER.Male : GENDER.Femail,
      DateOfBirth: !birthDate
        ? null
        : birthDate.toString().split("-").length === 3
        ? birthDate
        : format(birthDate["$d"], "yyyy-MM-dd"),
      Address: data.get("address"),
      Note: data.get("note"),
    };

    await axios
      .post("api/person", body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(async (res) => {
        toast.success("Create admin successfully!", {
          position: "bottom-left",
        });
        setOpenAdmin(false);
        setBirthDate(format(new Date(), "yyyy-MM-dd"));
        setSearch("");
        await axios
          .get("api/person", {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setPersons(res.data);
          });
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSearchClick = async (event) => {
    event.preventDefault();

    await axios
      .get(`api/person?filter=${search}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setPersons(res.data);
      });
  };

  const handleCloseAdmin = () => {
    setOpenAdmin(false);
    setBirthDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleBirthDateChange = (event) => {
    if (event && event["$D"] && event["$y"] && event["$M"]) {
      setBirthDate(format(event["$d"], "yyyy-MM-dd"));
    } else {
      setBirthDate(null);
    }
  };

  return (
    <AccountContainer>
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
          placeholder="Search by name or email"
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
      <div className="create-admin-btn">
        <Button
          onClick={() => handleCreateAdminClick()}
          variant="contained"
          color="success"
          disabled={
            roleID === ROLE_ID.User || roleID === ROLE_ID.Admin ? true : false
          }
        >
          Create Admin
        </Button>
      </div>
      <div className="account-container">
        <Table rowKey="Id" columns={columns} dataSource={persons} />
      </div>
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        width={800}
        footer={null}
      >
        <PersonInfoContainer>
          <div style={{ "font-size": "120%" }}>
            <h2 style={{ display: "inline" }}>Person information :</h2>
            <div className="person-name">
              <b>{person.Name}</b>
            </div>
            <br />
            <br />
            <div>
              <b>Email : </b>
              {person.Email}{" "}
            </div>
            <div>
              <b>Gender : </b>
              {person.Gender}{" "}
            </div>
            <div>
              <b>Date of birth : </b>
              {new Date(person.DateOfBirth).toLocaleDateString()}{" "}
            </div>
            <div>
              <b>Card ID : </b>
              {person.CardID}{" "}
            </div>
            <div>
              <b>Address : </b>
              {person.Address}{" "}
            </div>
            <div>
              <b>Phone number : </b>
              {person.Phonenumber}{" "}
            </div>
            <div>
              <b>Note : </b>
              {person.Note}{" "}
            </div>
            <div>
              <b>Added Date : </b>
              {new Date(person.AddedDate).toLocaleString()}{" "}
            </div>
            <div>
              <b>IsVerify : </b>
              {person.IsVerify ? "Yes" : "No"}
            </div>
          </div>
        </PersonInfoContainer>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openAdmin}
        onCancel={handleCloseAdmin}
        width={800}
        footer={null}
      >
        <div style={{ "font-size": "170%" }}>
          {" "}
          <b>Create new Admin</b>
        </div>
        <CreateAdminContainer>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              style={{ width: "49%" }}
            />
            <TextField
              margin="normal"
              required
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              style={{ marginLeft: "3%", width: "48%" }}
            />

            <TextField
              margin="normal"
              required
              type="password"
              id="password"
              label="Password"
              name="password"
              autoComplete="password"
              autoFocus
              style={{ width: "49%" }}
            />
            <TextField
              margin="normal"
              required
              type="password"
              id="confirmPassword"
              label="Confirm password"
              name="confirmPassword"
              autoComplete="confirmPassword"
              autoFocus
              style={{ marginLeft: "3%", width: "48%" }}
            />
            <FormControl style={{ marginTop: "2.2%", minWidth: "20%" }}>
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
              style={{ marginLeft: "3%", width: "37%" }}
            />
            <TextField
              margin="normal"
              required
              id="phonenumber"
              label="Phone number"
              name="phonenumber"
              autoComplete="phonenumber"
              autoFocus
              style={{ marginLeft: "3%", width: "37%" }}
            />
            <div className="date-of-birth-field">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of birth*"
                  sx={{ marginTop: "2%", width: "20%" }}
                  value={dayjs(birthDate)}
                  onChange={handleBirthDateChange}
                />
              </LocalizationProvider>
            </div>
            <TextField
              margin="normal"
              required
              id="address"
              label="Address"
              name="address"
              autoComplete="address"
              autoFocus
              style={{ marginLeft: "3%", width: "77%" }}
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
              onClick={handleCloseAdmin}
              style={{
                marginTop: "2%",
                "margin-left": "75%",
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
            >
              Submit
            </Button>
          </Box>
        </CreateAdminContainer>
      </Modal>
    </AccountContainer>
  );
};

export default Account;
