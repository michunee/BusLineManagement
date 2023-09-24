import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { GENDER } from "../../../constant";
import format from "date-fns/format";
import { Modal } from "antd";
import { toast } from "react-toastify";
import Paper from "@mui/material/Paper";
import { ROLE_ID } from "../../../constant";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const personID = Number(localStorage.getItem("ID"));

  const [gender, setGender] = useState(10);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [cardID, setCardID] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const roleID = Number(localStorage.getItem("RoleID"));

  useEffect(() => {
    if (
      (!accessToken && roleID !== ROLE_ID.User) ||
      (accessToken &&
        (roleID === ROLE_ID.SuperAdmin || roleID === ROLE_ID.Admin))
    ) {
      navigate("/");
    } else {
      axios
        .get(`api/person/${personID}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setName(res.data.Name);
          setEmail(res.data.Email);
          setGender(res.data.Gender === GENDER.Male ? 10 : 20);
          setBirthDate(res.data.DateOfBirth);
          setCardID(res.data.CardID);
          setPhonenumber(res.data.Phonenumber);
          setAddress(res.data.Address);
          setNote(res.data.Note);
        });
    }
  }, []);

  const handleSaveInfo = async (event) => {
    event.preventDefault();
    const body = {
      Email: email,
      Name: name,
      CardID: cardID,
      Phonenumber: phonenumber,
      Gender: gender === 10 ? GENDER.Male : GENDER.Femail,
      DateOfBirth: !birthDate
        ? null
        : birthDate.toString().split("-").length === 3
        ? birthDate
        : format(birthDate["$d"], "yyyy-MM-dd"),
      Address: address,
      Note: note,
    };

    await axios
      .patch(`api/person`, body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        toast.success("Update profile successfully", {
          position: "bottom-left",
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { position: "bottom-left" });
      });
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      CurrentPassword: data.get("password"),
      NewPassword: data.get("newPassword"),
      ConfirmPassword: data.get("confirmPassword"),
    };

    await axios
      .patch(`api/person/password`, body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        toast.success("Change password successfully", {
          position: "bottom-left",
        });
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message, { position: "bottom-left" });
      });
  };

  const handleChangeBirthDate = (newValue) => {
    if (newValue && newValue["$D"] && newValue["$y"] && newValue["$M"]) {
      setBirthDate(newValue);
    } else {
      setBirthDate(null);
    }
  };

  return (
    <>
      <Paper
        style={{
          backgroundColor: "white",
          marginRight: "3%",
          paddingBottom: "3%",
          paddingTop: "3%",
        }}
        noValidate
        elevation={12}
      >
        <div style={{ fontSize: "140%", marginLeft: "3%" }}>
          <b>My Profile:</b>{" "}
        </div>
        <TextField
          margin="normal"
          required
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          style={{ marginLeft: "3%", marginTop: "3%", width: "46%" }}
        />
        <TextField
          margin="normal"
          required
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          disabled
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          style={{ marginTop: "3%", marginLeft: "2%", width: "46%" }}
        />
        <FormControl
          style={{ marginLeft: "3%", marginTop: "1.2%", minWidth: "20%" }}
        >
          <InputLabel id="demo-simple-select-label">Gender*</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="gender*"
            onChange={(e) => setGender(e.target.value)}
            value={gender}
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
          onChange={(e) => setCardID(e.target.value)}
          value={cardID}
          style={{ marginLeft: "2%", width: "35%" }}
        />
        <TextField
          margin="normal"
          required
          id="phonenumber"
          label="Phone number"
          name="phonenumber"
          autoComplete="phonenumber"
          autoFocus
          onChange={(e) => setPhonenumber(e.target.value)}
          value={phonenumber}
          style={{ marginLeft: "2%", width: "35%" }}
        />
        <div style={{ display: "inline" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of birth*"
              onChange={handleChangeBirthDate}
              value={dayjs(birthDate)}
              sx={{ marginLeft: "3%", marginTop: "1.2%", width: "20%" }}
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
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          style={{ marginLeft: "2%", width: "72%" }}
        />
        <TextField
          margin="normal"
          id="note"
          label="Note"
          name="note"
          autoComplete="note"
          autoFocus
          multiline
          onChange={(e) => setNote(e.target.value)}
          rows={1}
          inputProps={{
            style: {
              height: "50px",
            },
          }}
          value={note}
          style={{ marginLeft: "3%", width: "94%" }}
        />
        <Button
          type="submit"
          onClick={() => setOpen(true)}
          style={{ marginTop: "2%", marginLeft: "76%", backgroundColor: "red" }}
          variant="contained"
          color="success"
        >
          Change Password
        </Button>
        <Button
          type="submit"
          style={{ marginTop: "2%", marginLeft: "2%" }}
          variant="contained"
          color="success"
          onClick={handleSaveInfo}
        >
          Save
        </Button>
      </Paper>
      <Modal
        destroyOnClose
        centered
        open={open}
        onCancel={() => setOpen(false)}
        width={500}
        footer={null}
      >
        <div style={{ fontSize: "140%" }}>
          <b>Change Password :</b>
        </div>
        <Box
          component="form"
          onSubmit={handleChangePassword}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            style={{ width: "100%", marginTop: "6%" }}
            margin="normal"
            required
            type="password"
            id="password"
            label="Current Password"
            name="password"
            autoComplete="password"
            autoFocus
          />
          <TextField
            style={{ width: "100%", marginTop: "6%" }}
            margin="normal"
            required
            type="password"
            id="newpassword"
            label="New Password"
            name="newPassword"
            autoComplete="newpassword"
            autoFocus
          />
          <TextField
            style={{ width: "100%", marginTop: "6%" }}
            margin="normal"
            required
            type="password"
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            autoComplete="confirmPassword"
            autoFocus
          />
          <Button
            style={{
              marginTop: "3%",
              marginLeft: "58%",
              backgroundColor: "red",
            }}
            onClick={() => setOpen(false)}
            variant="contained"
            color="success"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            style={{ marginTop: "3%", marginLeft: "3%" }}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};
