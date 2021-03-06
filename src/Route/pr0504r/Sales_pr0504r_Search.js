import React, { useState, useEffect } from "react";
import AppBars from "../../components/AppBars";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import axios from "axios";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";

// const CssTextField = withStyles({
//   root: {
//     "& label.Mui-focused": {
//       color: "#767980",
//     },
//     "& .MuiInput-underline:after": {
//       borderBottomColor: "#767980",
//     },
//     "& .MuiOutlinedInput-root": {
//       "&.Mui-focused fieldset": {
//         borderColor: "#767980",
//       },
//     },
//   },
// })(TextField);

const useStyles = (theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(10),
  },

  formControl: {
    minWidth: "100%",
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
    fontSize: "15px",
    backgroundColor: "#64B6D8",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#64B6D8",
    },
  },

  mulgyul: {
    marginTop: "2.5vh",
  },
});

function Sales_pr0504r_Search({ history }) {
  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (1 + today.getMonth())).slice(-2);
  let date = ("0" + today.getDate()).slice(-2);
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
    date_f: year + "-01-01",
    date_t: year + "-" + month + "-" + date,
    sell_cust_cd: "",
    branch_cd: window.sessionStorage.getItem("branch_cd"),
  });

  const { date_f, date_t } = inputs;

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const [open, setOpen] = React.useState(false);
  const [sellCust, setSellCust] = React.useState([]);
  const [sellCustCd, setSellCustCd] = React.useState("");

  const handleChange = (event) => {
    setSellCustCd(event.target.value);
    setInputs({
      ...inputs,
      sell_cust_cd: event.target.value,
    });
  };

  useEffect(() => {
    axios
      .get(
        "http://121.165.242.72:5050/retail/developer/index.php/code/sellCust",
        {
          params: {
            branch_cd: window.sessionStorage.getItem("branch_cd"),
            cust_sell_cls: "1",
          },
        }
      )
      .then(({ data }) => {
        if (data.RESULT_CODE === "200") {
          setSellCust(data.DATA);
        }
      })
      .catch((e) => {
        console.error(e); // ????????????
      });
  }, []);

  return (
    <>
      <AppBars programName={"??????????????? - ??????"} />
      <Container className={classes.form}>
        <Grid container spacing={3}>
          <Grid item xs={5} sm={6}>
            <TextField
              error
              label="????????? ??????"
              name="date_f"
              type="date"
              onChange={handleOnChange}
              value={date_f}
              fullWidth
            />
          </Grid>
          <Grid item xs={1} sm={6}>
            <Typography className={classes.mulgyul} align="center">
              ~
            </Typography>
          </Grid>
          <Grid item xs={5} sm={6}>
            <TextField
              error
              name="date_t"
              label="????????? ??????"
              type="date"
              onChange={handleOnChange}
              value={date_t}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="age-native-label-placeholder">
                ?????????
              </InputLabel>
              <NativeSelect
                label="simple-select-label"
                id="simple-select"
                value={sellCustCd}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  name: "?????????",
                  id: "age-native-label-placeholder",
                }}
              >
                <option value="">??????</option>
                {sellCust.map((itemList, index) => {
                  return (
                    <option value={itemList.CUST_CD} key={index}>
                      {itemList.CUST_NAME}
                    </option>
                  );
                })}
              </NativeSelect>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => {
                if (!date_f || !date_t) {
                  alert('"?????????" ???????????? ?????????.');
                } else {
                  window.sessionStorage.setItem(
                    "pr0504r_inputs",
                    JSON.stringify(inputs)
                  );
                  history.goBack();
                }
              }}
            >
              ??????
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
export default Sales_pr0504r_Search;
