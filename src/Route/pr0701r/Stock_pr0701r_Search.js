import React, { useState, useEffect } from "react";
import AppBars from "../../components/AppBars";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CustomDialog from "../../components/CustomDialog";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DoneIcon from "@material-ui/icons/Done";
import Chip from "@material-ui/core/Chip";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#767980",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#767980",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#767980",
      },
    },
  },
})(TextField);

const useStyles = (theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(10),
  },

  textfield: {
    fontSize: "10",
  },

  span: {
    fontSize: "4vw",
    verticalAlign: "middle",
  },

  button: {
    marginTop: "2vh",
    height: "100%",
    width: "100%",
    fontFamily: "NanumGothic",
    fontSize: "14px",
    backgroundColor: "#67696F",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#67696F",
    },
  },

  mulgyul: {
    marginTop: "2.5vh",
  },

  radio: {
    marginLeft: "5vw",
  },

  chip: {
    marginRight: "0.5vw",
  },
});

function Stock_pr0701r_Search({ history }) {
  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (1 + today.getMonth())).slice(-2);
  let day = ("0" + today.getDate()).slice(-2);
  const classes = useStyles();

  window.addEventListener(
    "dialog",
    () => {
      setOpen(!open);
    },
    {
      once: true,
    }
  );

  const [inputs, setInputs] = useState({
    sumFlag: "detail",
    date: "",
    warehouse_cd: "",
    warehouse_name: "",
    warehouse_sum: false,
    group_cd: "",
    group_name: "",
    group_sum: false,
    class_cd: "",
    class_name: "",
    class_sum: false,
    product_cd: "",
    product_name: "",
    product_sum: false,
    lot_no: "",
    lot_sum: false,
  });

  const {
    sumFlag,
    date,
    warehouse_name,
    warehouse_sum,
    group_name,
    group_sum,
    class_name,
    class_sum,
    product_name,
    product_sum,
    lot_no,
    lot_sum,
  } = inputs;

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const [open, setOpen] = React.useState(false);
  const [codeListData, setCodeListData] = React.useState([]);
  const [codeKind, setCodeKind] = React.useState("");

  const handleClickOpen = (code_kind) => {
    setCodeKind(code_kind);
    axios
      .get("http://121.165.242.72:5050/retail/developer/index.php/code", {
        params: {
          branch_cd: window.sessionStorage.getItem("branch_cd"),
          code_kind: code_kind,
        },
      })
      .then(({ data }) => {
        if (data.RESULT_CODE === "200") {
          setCodeListData(data.DATA);
        }
        setOpen(true);
      })
      .catch((e) => {
        console.error(e); // 에러표시
      });
  };

  const handleClose = (codeName, codeCd) => {
    setOpen(false);
    if (codeCd === undefined) {
      codeName = "";
      codeCd = "";
    }
    //여기서 검사
    if (codeKind === "warehouse") {
      setInputs({ ...inputs, warehouse_cd: codeCd, warehouse_name: codeName });
    } else if (codeKind === "buy_cust") {
      setInputs({ ...inputs, buy_cust_cd: codeCd, buy_cust_name: codeName });
    } else if (codeKind === "gc") {
      setInputs({ ...inputs, group_cd: codeCd, group_name: codeName });
    } else if (codeKind === "cc") {
      setInputs({ ...inputs, class_cd: codeCd, class_name: codeName });
    } else if (codeKind === "pc") {
      setInputs({ ...inputs, product_cd: codeCd, product_name: codeName });
    }
  };

  const handleChipClick = (name) => {
    if (name === "warehouse_sum")
      setInputs({ ...inputs, warehouse_sum: !warehouse_sum });
    else if (name === "class_sum")
      setInputs({ ...inputs, class_sum: !class_sum });
    else if (name === "group_sum")
      setInputs({ ...inputs, group_sum: !group_sum });
    else if (name === "product_sum")
      setInputs({ ...inputs, product_sum: !product_sum });
    else if (name === "lot_sum") setInputs({ ...inputs, lot_sum: !lot_sum });
  };

  const handleRadioChange = (event) => {
    setInputs({ ...inputs, sumFlag: event.target.value });
  };

  useEffect(() => {
    setInputs({
      ...inputs,
      date: year + "-" + month + "-" + day,
    });
  }, []);

  return (
    <>
      <AppBars programName={"재고현황 - 검색"} />
      <Container className={classes.form}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              error
              label="기준일"
              name="date"
              type="date"
              onChange={handleOnChange}
              value={date}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <CssTextField
              name="warehouse_name"
              label="창고"
              onChange={handleOnChange}
              value={warehouse_name}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("warehouse")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              name="group_name"
              onChange={handleOnChange}
              value={group_name}
              label="분류"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("gc")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              name="class_name"
              onChange={handleOnChange}
              value={class_name}
              label={window.sessionStorage.getItem("CT003")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("cc")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              name="product_name"
              onChange={handleOnChange}
              value={product_name}
              fullWidth
              label={window.sessionStorage.getItem("CT004")}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("pc")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              name="lot_no"
              onChange={handleOnChange}
              value={lot_no}
              fullWidth
              label="Lot 번호"
            />
          </Grid>

          <Grid item xs={12} container justify="center">
            <RadioGroup
              className={classes.radio}
              aria-label="sumFlag"
              name="sumFlag"
              value={sumFlag}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel value="sum" control={<Radio />} label="집계" />
              <FormControlLabel
                value="detail"
                control={<Radio />}
                label="상세"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} container justify="center">
            {sumFlag === "sum" &&
              (warehouse_sum === false ? (
                <Chip
                  label="창고"
                  onClick={() => handleChipClick("warehouse_sum")}
                  variant="outlined"
                  className={classes.chip}
                />
              ) : (
                <Chip
                  label="창고"
                  onClick={() => handleChipClick("warehouse_sum")}
                  icon={<DoneIcon />}
                  variant="outlined"
                  color="primary"
                  className={classes.chip}
                />
              ))}
            {sumFlag === "sum" &&
              (class_sum === false ? (
                <Chip
                  label="분류"
                  onClick={() => handleChipClick("class_sum")}
                  variant="outlined"
                  className={classes.chip}
                />
              ) : (
                <Chip
                  label="분류"
                  onClick={() => handleChipClick("class_sum")}
                  icon={<DoneIcon />}
                  variant="outlined"
                  className={classes.chip}
                  color="primary"
                />
              ))}
            {sumFlag === "sum" &&
              (group_sum === false ? (
                <Chip
                  label={window.sessionStorage.getItem("CT003")}
                  onClick={() => handleChipClick("group_sum")}
                  variant="outlined"
                  className={classes.chip}
                />
              ) : (
                <Chip
                  label={window.sessionStorage.getItem("CT003")}
                  onClick={() => handleChipClick("group_sum")}
                  icon={<DoneIcon />}
                  variant="outlined"
                  className={classes.chip}
                  color="primary"
                />
              ))}
            {sumFlag === "sum" &&
              (product_sum === false ? (
                <Chip
                  label={window.sessionStorage.getItem("CT004")}
                  onClick={() => handleChipClick("product_sum")}
                  variant="outlined"
                  className={classes.chip}
                />
              ) : (
                <Chip
                  label={window.sessionStorage.getItem("CT004")}
                  onClick={() => handleChipClick("product_sum")}
                  icon={<DoneIcon />}
                  variant="outlined"
                  color="primary"
                  className={classes.chip}
                />
              ))}
            {sumFlag === "sum" &&
              (lot_sum === false ? (
                <Chip
                  label="Lot번호"
                  onClick={() => handleChipClick("lot_sum")}
                  variant="outlined"
                  className={classes.chip}
                />
              ) : (
                <Chip
                  label="Lot번호"
                  onClick={() => handleChipClick("lot_sum")}
                  icon={<DoneIcon />}
                  variant="outlined"
                  color="primary"
                  className={classes.chip}
                />
              ))}
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => {
                if (!date) {
                  alert('"기준일" 필수항목 입니다.');
                } else {
                  window.sessionStorage.setItem(
                    "pr0701r_inputs",
                    JSON.stringify(inputs)
                  );
                  history.goBack();
                }
              }}
            >
              조회
            </Button>

            {open === true
              ? window.sessionStorage.setItem("dialogFlag", "open")
              : window.sessionStorage.setItem("dialogFlag", "close")}
            <CustomDialog
              codeListData={codeListData}
              open={open}
              onClose={handleClose}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
export default Stock_pr0701r_Search;
