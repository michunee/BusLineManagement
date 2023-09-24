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
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import { IOSSwitch } from "../../style";
import { useNavigate } from "react-router-dom";
import { ROLE_ID } from "../../../constant";

export const Station = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Province",
      dataIndex: "province",
      key: "province",
      render: (item) => {
        return item.Name;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "30%",
      render: (text, data) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenStationInfo(data)}
              aria-label="action"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => handleOpenEditStationInfo(data)}
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

  const [stations, setStations] = useState([]);
  const [province, setProvince] = useState([]);
  const [provinceID, setProvinceID] = useState(64);
  const [search, setSearch] = useState("");
  const [station, setStation] = useState({});
  const [open, setOpen] = useState(false);
  const [openStation, setOpenStation] = useState(false);

  //Add station
  const [provinceAdd, setProvinceAdd] = useState([]);
  const [provinceIDAdd, setProvinceIDAdd] = useState(1);

  //Edit station
  const [openEditStation, setOpenEditStation] = useState(false);
  const [nameEdit, setNameEdit] = useState("");
  const [addressEdit, setAddressEdit] = useState("");
  const [noteEdit, setNoteEdit] = useState("");
  const [provinceIDEdit, setProvinceIDEdit] = useState(1);
  const [provincesEdit, setProvincesEdit] = useState([]);
  const [stationID, setStationID] = useState(0);

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
      axios.get("api/station").then((res) => {
        setStations(res.data);
      });

      axios.get("api/province").then((res) => {
        setProvince(res.data);
      });
    }
  }, []);

  const handleSearchStation = () => {
    if (provinceID !== 64) {
      axios
        .get(`api/station?filter=${search}&provinceID=${provinceID}`)
        .then((res) => {
          setStations(res.data);
        });
    } else {
      axios.get(`api/station?filter=${search}`).then((res) => {
        setStations(res.data);
      });
    }
  };

  const handleChangeProvince = (e) => {
    setProvinceID(e.target.value);
    if (e.target.value !== 64) {
      axios
        .get(`api/station?filter=${search}&provinceID=${e.target.value}`)
        .then((res) => {
          setStations(res.data);
        });
    } else {
      axios.get(`api/station?filter=${search}`).then((res) => {
        setStations(res.data);
      });
    }
  };

  const handleStatusChange = async (station) => {
    const input = {
      StationID: station.ID,
      IsActive: !station.IsActive,
    };

    await axios.patch(`api/station/status`, input, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    });

    if (provinceID !== 64) {
      await axios
        .get(`api/station?filter=${search}&provinceID=${provinceID}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setStations(res.data);
        });
    } else {
      await axios
        .get(`api/station?filter=${search}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          setStations(res.data);
        });
    }
  };

  const handleOpenStationInfo = (station) => {
    setStation(station);
    setOpen(true);
  };

  const handleOpenAddStationClick = async () => {
    setOpenStation(true);
    setProvinceIDAdd(1);
    axios.get("api/province").then((res) => {
      setProvinceAdd(res.data);
    });
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = {
      Name: data.get("name"),
      ProvinceID: provinceIDAdd,
      Address: data.get("address"),
      Note: data.get("note"),
    };

    await axios
      .post(`api/station`, body, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        toast.success("Add station successfully!", {
          position: "bottom-left",
        });

        axios.get(`api/station`).then((res) => {
          setStations(res.data);
          setSearch("");
          setProvinceID(64);
          setOpenStation(false);
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message, { position: "bottom-left" });
      });
  };

  const handleCloseAddStation = async () => {
    setOpenStation(false);
  };

  const handleOpenEditStationInfo = async (station) => {
    setOpenEditStation(true);
    setStationID(station.ID);
    setNameEdit(station.Name);
    setAddressEdit(station.Address);
    setNoteEdit(station.Note);
    setProvinceIDEdit(station.province?.ID);
    axios.get("api/province").then((res) => {
      setProvincesEdit(res.data);
    });
  };

  const handleCloseEditStation = async () => {
    setOpenEditStation(false);
  };

  const handleSubmitEditStation = async () => {
    const input = {
      ID: stationID,
      Name: nameEdit,
      Note: noteEdit,
      Address: addressEdit,
    };

    await axios
      .patch(`api/station`, input, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        toast.success("Edit station successfully!", {
          position: "bottom-left",
        });
        if (provinceID !== 64) {
          axios
            .get(`api/station?filter=${search}&provinceID=${provinceID}`)
            .then((res) => {
              setStations(res.data);
            });
        } else {
          axios.get(`api/station?filter=${search}`).then((res) => {
            setStations(res.data);
          });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message, { position: "bottom-left" });
      });
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
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          sx={{ ml: 2, flex: 1, width: 400 }}
          placeholder="Search by name or address"
        />
        <IconButton
          onClick={handleSearchStation}
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
        <InputLabel id="demo-simple-select-label">Province</InputLabel>
        <Select
          MenuProps={{
            style: {
              maxHeight: 400,
            },
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Province"
          value={provinceID}
          onChange={handleChangeProvince}
        >
          <MenuItem value={64}>All</MenuItem>
          {province.map((item) => {
            return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <div style={{ display: "inline", marginLeft: "26%" }}>
        <Button
          onClick={() => handleOpenAddStationClick()}
          variant="contained"
          color="success"
        >
          Add Station
        </Button>
      </div>
      <div style={{ marginTop: "1%", marginRight: "3%" }}>
        <Table rowKey="Id" columns={columns} dataSource={stations} />
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
          <h2>Station information :</h2>
          <div style={{ marginTop: "3%" }}>
            <b>Name : </b>
            {station.Name}{" "}
          </div>
          <div>
            <b>Province : </b>
            {station.province?.Name}{" "}
          </div>
          <div>
            <b>Address : </b>
            {station.Address}{" "}
          </div>
          <div>
            <b>Note : </b>
            {station.Note}{" "}
          </div>
        </div>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openStation}
        onCancel={handleCloseAddStation}
        width={800}
        footer={null}
      >
        <div style={{ "font-size": "170%" }}>
          {" "}
          <b>Add new station</b>
        </div>
        <Box
          onSubmit={handleAddStation}
          component="form"
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
            style={{ width: "65%" }}
          />
          <FormControl
            style={{
              marginLeft: "2%",
              marginTop: "2%",
              width: "33%",
              backgroundColor: "white",
            }}
          >
            <InputLabel id="demo-simple-select-label">Province*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 400,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Province*"
              value={provinceIDAdd}
              onChange={(e) => setProvinceIDAdd(e.target.value)}
            >
              {provinceAdd.map((item) => {
                return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
              })}
            </Select>
          </FormControl>
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
            onClick={handleCloseAddStation}
            style={{
              marginTop: "3%",
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
        open={open}
        onCancel={() => setOpen(false)}
        width={800}
        footer={null}
      >
        <div style={{ "font-size": "120%" }}>
          <h2>Station information :</h2>
          <div style={{ marginTop: "3%" }}>
            <b>Name : </b>
            {station.Name}{" "}
          </div>
          <div>
            <b>Province : </b>
            {station.province?.Name}{" "}
          </div>
          <div>
            <b>Address : </b>
            {station.Address}{" "}
          </div>
          <div>
            <b>Note : </b>
            {station.Note}{" "}
          </div>
        </div>
      </Modal>
      <Modal
        destroyOnClose
        centered
        open={openEditStation}
        onCancel={handleCloseEditStation}
        width={800}
        footer={null}
      >
        <div style={{ "font-size": "170%" }}>
          {" "}
          <b>Edit station information</b>
        </div>
        <Box noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            value={nameEdit}
            onChange={(e) => setNameEdit(e.target.value)}
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            style={{ width: "65%" }}
          />
          <FormControl
            style={{
              marginLeft: "2%",
              marginTop: "2%",
              width: "33%",
              backgroundColor: "white",
            }}
          >
            <InputLabel id="demo-simple-select-label">Province*</InputLabel>
            <Select
              MenuProps={{
                style: {
                  maxHeight: 400,
                },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Province*"
              value={provinceIDEdit}
              readOnly
            >
              {provincesEdit.map((item) => {
                return <MenuItem value={item.ID}>{item.Name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            value={addressEdit}
            onChange={(e) => setAddressEdit(e.target.value)}
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
            value={noteEdit}
            onChange={(e) => setNoteEdit(e.target.value)}
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
            onClick={handleCloseEditStation}
            style={{
              marginTop: "3%",
              marginLeft: "75%",
              backgroundColor: "red",
              display: "inline",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEditStation}
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
    </div>
  );
};
