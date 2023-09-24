import { Table } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { BUS_TYPE } from "../../../constant";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal } from "antd";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ROLE_ID } from "../../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import { IOSSwitch } from "../../style";
import { useNavigate } from "react-router-dom";

export default function Bus() {
  const roleID = Number(localStorage.getItem("RoleID"));

  const columns = [
    {
      title: "Figure",
      dataIndex: "ImageUrl",
      key: "ImageUrl",
      width: "15%",
      render: (item) => {
        return (
          <img src={item} alt="img" style={{ width: "100%", height: "90px" }} />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Reg number",
      dataIndex: "RegNo",
      key: "RegNo",
    },
    {
      title: "Type",
      dataIndex: "BusTypeID",
      key: "BusTypeID",
      render: (item) => {
        return BUS_TYPE[item];
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
              onClick={() => handleBusInfoClick(data)}
              aria-label="action"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              style={{ marginLeft: "5%" }}
              onClick={() => handleBusEditClick(data)}
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

  const [buses, setBuses] = useState([]);
  const [bus, setBus] = useState({});
  const [search, setSearch] = useState("");
  const [busType, setBusType] = useState(5);
  const [open, setOpen] = useState(false);
  const [openBus, setOpenBus] = useState(false);
  const [addBusType, setAddBusType] = useState(1);
  const [fileUrl, setfileUrl] = useState("");
  const [openBusEdit, setOpenBusEdit] = useState(false);
  const [busName, setBusName] = useState("");
  const [busRegNo, setBusRegNo] = useState("");
  const [busTypeID, setBusTypeID] = useState(1);
  const [busNote, setBusNote] = useState("");
  const [busImage, setBusImage] = useState("");
  const [busID, setBusID] = useState(0);
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
        .get("api/bus", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setBuses(res.data);
        });
    }
  }, []);

  const handleSearchClick = async (event) => {
    event.preventDefault();

    if (busType !== 5) {
      await axios
        .get(`api/bus?filter=${search}&busTypeID=${busType}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setBuses(res.data);
        });
    } else {
      await axios
        .get(`api/bus?filter=${search}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setBuses(res.data);
        });
    }
  };

  const handleChangeBusType = async (event) => {
    setBusType(event.target.value);

    if (event.target.value !== 5) {
      await axios
        .get(`api/bus?filter=${search}&busTypeID=${event.target.value}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setBuses(res.data);
        });
    } else {
      await axios
        .get(`api/bus?filter=${search}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setBuses(res.data);
        });
    }
  };

  const handleBusInfoClick = async (bus) => {
    setBus(bus);
    setOpen(true);
  };

  const handleStatusChange = async (bus) => {
    const input = {
      BusID: bus.ID,
      IsActive: !bus.IsActive,
    };

    await axios.patch(`api/bus/status`, input, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });

    if (busType !== 5) {
      await axios
        .get(`api/bus?filter=${search}&busTypeID=${busType}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setBuses(res.data);
        });
    } else {
      await axios
        .get(`api/bus?filter=${search}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setBuses(res.data);
        });
    }
  };

  const handleAddBusClick = async () => {
    setOpenBus(true);
    setfileUrl("");
  };

  const handleBusEditClick = async (bus) => {
    setOpenBusEdit(true);
    setBusID(bus.ID);
    setBusName(bus.Name);
    setBusRegNo(bus.RegNo);
    setBusTypeID(bus.BusTypeID);
    bus.Note ? setBusNote(bus.Note) : setBusNote("");
    setBusImage(bus.ImageUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      Name: data.get("name"),
      BusTypeID: addBusType,
      RegNo: data.get("regNo"),
      Note: data.get("note"),
      ImageUrl: fileUrl,
    };

    await axios
      .post("api/bus", body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(async (res) => {
        toast.success("Add new bus successfully!", {
          position: "bottom-left",
        });
        setOpenBus(false);
        setSearch("");
        setBusType(5);
        await axios
          .get("api/bus", {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            setBuses(res.data);
          });
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  const handleSubmitEditBus = async (event) => {
    event.preventDefault();
    const body = {
      ID: busID,
      Name: busName,
      BusTypeID: busTypeID,
      RegNo: busRegNo,
      Note: busNote,
      ImageUrl: busImage,
    };

    await axios
      .patch("api/bus", body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(async (res) => {
        toast.success("Edit bus information successfully!", {
          position: "bottom-left",
        });

        if (busType !== 5) {
          await axios
            .get(`api/bus?filter=${search}&busTypeID=${busType}`, {
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            })
            .then((res) => {
              setBuses(res.data);
            });
        } else {
          await axios
            .get(`api/bus?filter=${search}`, {
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            })
            .then((res) => {
              setBuses(res.data);
            });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "bottom-left",
        });
      });
  };

  const handleChangeAddBusType = (event) => {
    setAddBusType(event.target.value);
  };

  const handleSetFile = async (event) => {
    const data = new FormData();
    data.append("file", event.target.files[0]);

    let fileKey = "";

    await axios
      .post("api/upload", data)
      .then((res) => {
        fileKey = res.data.key;
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .get(`api/access?key=${fileKey}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setfileUrl(res.data.url);
      });
  };

  const handleSetBusImage = async (event) => {
    const data = new FormData();
    data.append("file", event.target.files[0]);

    let fileKey = "";

    await axios
      .post("api/upload", data)
      .then((res) => {
        fileKey = res.data.key;
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .get(`api/access?key=${fileKey}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        setBusImage(res.data.url);
      });
  };

  const handleCloseAddBus = () => {
    setOpenBus(false);
  };

  const handleCloseEditBus = () => {
    setOpenBusEdit(false);
  };

  return (
    <div>
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
          placeholder="Search by name or reg number"
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
      <FormControl
        style={{ marginLeft: "3%", width: "20%", backgroundColor: "white" }}
      >
        <InputLabel id="demo-simple-select-label">Bus Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={busType}
          onChange={handleChangeBusType}
          label="BusType"
        >
          <MenuItem value={5}>All</MenuItem>
          <MenuItem value={1}>{BUS_TYPE[1]}</MenuItem>
          <MenuItem value={2}>{BUS_TYPE[2]}</MenuItem>
          <MenuItem value={3}>{BUS_TYPE[3]}</MenuItem>
          <MenuItem value={4}>{BUS_TYPE[4]}</MenuItem>
        </Select>
      </FormControl>
      <div style={{ display: "inline", marginLeft: "29%" }}>
        <Button
          onClick={() => handleAddBusClick()}
          variant="contained"
          color="success"
          disabled={roleID === ROLE_ID.User ? true : false}
        >
          Add Bus
        </Button>
      </div>
      <div style={{ marginTop: "1%", marginRight: "3%" }}>
        <Table rowKey="Id" columns={columns} dataSource={buses} />
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
          <h2>Bus information :</h2>
          <img
            src={bus.ImageUrl}
            alt="img"
            style={{
              marginTop: "3%",
              marginLeft: "20%",
              width: "60%",
              height: "240px",
            }}
          />
          <div style={{ marginTop: "3%" }}>
            <b>Name : </b>
            {bus.Name}{" "}
          </div>
          <div>
            <b>Reg number : </b>
            {bus.RegNo}{" "}
          </div>
          <div>
            <b>Type : </b>
            {BUS_TYPE[bus.BusTypeID]}{" "}
          </div>
          <div>
            <b>Note : </b>
            {bus.Note}{" "}
          </div>
          <div>
            <b>Added Date : </b>
            {new Date(bus.AddedDate).toLocaleString()}{" "}
          </div>
        </div>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openBus}
        onCancel={handleCloseAddBus}
        width={600}
        footer={null}
      >
        <div style={{ "font-size": "170%" }}>
          {" "}
          <b>Add new bus</b>
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
          <TextField
            margin="normal"
            required
            id="regNo"
            label="Reg Number"
            name="regNo"
            autoComplete="regNo"
            autoFocus
            style={{ width: "47%" }}
          />
          <FormControl
            style={{
              marginLeft: "3%",
              marginTop: "2.8%",
              width: "50%",
              backgroundColor: "white",
            }}
          >
            <InputLabel id="demo-simple-select-label">Type*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={addBusType}
              onChange={handleChangeAddBusType}
              label="Type"
            >
              <MenuItem value={1}>{BUS_TYPE[1]}</MenuItem>
              <MenuItem value={2}>{BUS_TYPE[2]}</MenuItem>
              <MenuItem value={3}>{BUS_TYPE[3]}</MenuItem>
              <MenuItem value={4}>{BUS_TYPE[4]}</MenuItem>
            </Select>
          </FormControl>
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
          <div style={{ marginTop: "3%" }}>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden onChange={handleSetFile} />
            </Button>
            <img
              style={{ marginLeft: "5%", width: "380px", height: "200px" }}
              src={fileUrl || "error"}
              alt="BusImage"
            />
          </div>
          <Button
            variant="contained"
            onClick={handleCloseAddBus}
            style={{
              marginTop: "3%",
              marginLeft: "66%",
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
        centered
        open={openBusEdit}
        onCancel={handleCloseEditBus}
        width={600}
        footer={null}
      >
        <div style={{ "font-size": "170%" }}>
          {" "}
          <b>Edit bus information</b>
        </div>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            id="name"
            label="Name"
            name="name"
            value={busName}
            onChange={(e) => setBusName(e.target.value)}
            autoComplete="name"
            autoFocus
            style={{ width: "100%" }}
          />
          <TextField
            margin="normal"
            required
            id="regNo"
            label="Reg Number"
            name="regNo"
            value={busRegNo}
            onChange={(e) => setBusRegNo(e.target.value)}
            autoComplete="regNo"
            autoFocus
            style={{ width: "47%" }}
          />
          <FormControl
            style={{
              marginLeft: "3%",
              marginTop: "2.8%",
              width: "50%",
              backgroundColor: "white",
            }}
          >
            <InputLabel id="demo-simple-select-label">Type*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={busTypeID}
              onChange={(e) => setBusTypeID(e.target.value)}
              label="Type"
            >
              <MenuItem value={1}>{BUS_TYPE[1]}</MenuItem>
              <MenuItem value={2}>{BUS_TYPE[2]}</MenuItem>
              <MenuItem value={3}>{BUS_TYPE[3]}</MenuItem>
              <MenuItem value={4}>{BUS_TYPE[4]}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            id="note"
            label="Note"
            name="note"
            autoComplete="note"
            autoFocus
            multiline
            value={busNote}
            onChange={(e) => setBusNote(e.target.value)}
            rows={1}
            inputProps={{
              style: {
                height: "50px",
              },
            }}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: "3%" }}>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden onChange={handleSetBusImage} />
            </Button>
            <img
              style={{ marginLeft: "5%", width: "380px", height: "200px" }}
              src={busImage}
              alt="BusImage"
            />
          </div>
          <Button
            variant="contained"
            onClick={handleCloseEditBus}
            style={{
              marginTop: "3%",
              marginLeft: "66%",
              backgroundColor: "red",
              display: "inline",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmitEditBus}
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
    </div>
  );
}
