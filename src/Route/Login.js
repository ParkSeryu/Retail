import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CustomAlertDialog from "../components/CusomAlertDialog";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#65B7D9",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#65B7D9",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#65B7D9",
      },
    },
  },
})(TextField);

const useStyles = (theme) => ({
  paper: {
    marginTop: "20vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form: {
    width: "100%",
    color: "#FFFFFF",
  },

  typo: {
    color: "#6D7076",
  },

  textField_ID: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  textField_PW: {
    marginBottom: theme.spacing(1),
  },

  button: {
    marginTop: theme.spacing(1),
    height: "55px",
    backgroundColor: "#5EB3D7",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#5EB3D7",
    },
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      open: false,
      token: "inital",
      userName: "",
      ID: "",
      PW: "",
      backdrop: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClickAgree = () => {
    this.setState({
      open: false,
      loading: false,
    });
    this.successLogin();
  };

  handleClickDisagree = () => {
    this.setState({
      open: false,
      loading: false,
    });
  };

  componentDidMount() {
    window.sessionStorage.clear();

    let mobile = /iphone|ipad|ipod|android/i.test(
      navigator.userAgent.toLowerCase()
    );

    if (mobile) {
      this.checkAutoLogin();
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  checkAutoLogin() {
    let result;

    let userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf("android") > -1) {
      if (window.BRIDGE !== undefined) {
        let connectAndroidToken = window.BRIDGE.connectAndroid();
        this.setState(
          {
            token: connectAndroidToken,
          },
          () => {
            let form = new FormData();
            form.append("token", this.state.token);

            axios
              .post(
                "http://121.165.242.72:5050/retail/developer/index.php/login/findToken",
                form
              )
              .then((response) => {
                if (response.data.RESULT_CODE === "200") {
                  result = response.data.DATA.ID;
                  axios
                    .get(
                      "http://121.165.242.72:5050/retail/developer/index.php/login/getPassword",
                      {
                        params: {
                          id: result,
                        },
                      }
                    )
                    .then((response) => {
                      result = response.data.DATA;
                      this.signIn(result.USER_ID, result.PASSWORD);
                    });
                } else {
                  this.setState({
                    loading: false,
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        );
      } else {
        this.setState({
          loading: false,
        });
      }
      window.sessionStorage.setItem("userAgent", "android");
    } else if (
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1 ||
      userAgent.indexOf("ipod") > -1
    ) {
      window.sessionStorage.setItem("userAgent", "ios");
      this.setState({
        loading: false,
      });
    }
  }

  signIn(user_id, pass) {
    this.setState({
      loading: true,
    });

    let form = new FormData();
    form.append("id", user_id);
    form.append("pass", pass);

    axios
      .post(
        "http://121.165.242.72:5050/retail/developer/index.php/login/signIn",
        form
      )
      .then((response) => {
        console.log(response);
        if (response.data.RESULT_CODE === "200") {
          window.sessionStorage.setItem("user_id", response.data.DATA.USER_ID);
          window.sessionStorage.setItem(
            "user_name",
            response.data.DATA.USER_NAME
          );
          window.sessionStorage.setItem(
            "branch_cd",
            response.data.DATA.BRANCH_CD
          );
          window.sessionStorage.setItem(
            "branch_name",
            response.data.DATA.BRANCH_NAME
          );

          axios
            .get(
              "http://121.165.242.72:5050/retail/developer/index.php/login/searchOverlapToken",
              {
                params: {
                  id: response.data.DATA.USER_ID,
                },
              }
            )
            .then((response) => {
              if (response.data.RESULT_CODE === "200") {
                response.data.DATA.TOKEN === this.state.token
                  ? this.successLogin()
                  : this.setState({
                      open: true,
                    });
              } else {
                this.successLogin();
              }
            });
        } else {
          this.setState({
            loading: false,
          });
          alert(response.data.RESULT_MESSAGE);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  successLogin() {
    axios
      .get(
        "http://121.165.242.72:5050/retail/developer/index.php/login/programList",
        {
          params: {
            id: window.sessionStorage.getItem("user_id"),
            branch_cd: window.sessionStorage.getItem("branch_cd"),
          },
        }
      )
      .then((programList) => {
        if (programList.data.RESULT_CODE === "200") {
          let form = new FormData();
          form.append("id", window.sessionStorage.getItem("user_id"));
          form.append("token", this.state.token);
          axios
            .get("http://121.165.242.72:5050/retail/developer/index.php/code", {
              params: {
                branch_cd: window.sessionStorage.getItem("branch_cd"),
              },
            })
            .then((response) => {
              if (response.data.RESULT_CODE === "200") {
                console.log(response.data.DATA);
                window.sessionStorage.setItem(
                  "ware_house_list",
                  JSON.stringify(response.data.DATA_WARE_HOUSE)
                );

                window.sessionStorage.setItem(
                  "buy_cust_list",
                  JSON.stringify(response.data.DATA_BUY_CUST)
                );

                window.sessionStorage.setItem(
                  "sell_cust_list",
                  JSON.stringify(response.data.DATA_SELL_CUST)
                );

                window.sessionStorage.setItem(
                  "group_list",
                  JSON.stringify(response.data.DATA_GROUP_CD)
                );

                window.sessionStorage.setItem(
                  "class_list",
                  JSON.stringify(response.data.DATA_CLASS_CD)
                );

                window.sessionStorage.setItem(
                  "product_list",
                  JSON.stringify(response.data.DATA_PRODUCT_CD)
                );
              }
            })
            .catch((e) => {
              console.error(e);
            });
          axios
            .post(
              "http://121.165.242.72:5050/retail/developer/index.php/login/insertToken",
              form
            )
            .then((response) => {
              if (response.data.RESULT_CODE === "200")
                programList.data.COLUMN_TITLE.forEach((titleData) => {
                  window.sessionStorage.setItem(
                    titleData.OPTION_KIND.toString(),
                    titleData.OPTION_VALUE
                  );
                });

              window.sessionStorage.setItem(
                "program_list",
                JSON.stringify(programList.data.DATA)
              );

              this.props.history.replace({
                pathname: "/home",
              });
            });
        } else {
          this.setState({
            loading: false,
          });
          alert(programList.data.RESULT_MESSAGE);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h3" className={classes.typo}>
              Retail
            </Typography>
            <form className={classes.form} noValidate>
              <CssTextField
                className={classes.textField_ID}
                variant="outlined"
                required
                fullWidth
                id="ID"
                label="ID"
                name="ID"
                onChange={this.handleChange}
                value={this.state.ID}
                autoFocus
              />
              <CssTextField
                className={classes.textField_PW}
                variant="outlined"
                required
                fullWidth
                name="PW"
                label="PW"
                type="password"
                id="PW"
                onChange={this.handleChange}
                value={this.state.PW}
              />

              <Button
                className={classes.button}
                onClick={() => this.signIn(this.state.ID, this.state.PW)}
                fullWidth
                variant="contained"
              >
                <Typography variant="body1">LOGIN</Typography>
              </Button>
            </form>
          </div>
        </Container>

        <Backdrop className={classes.backdrop} open={this.state.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <CustomAlertDialog
          open={this.state.open}
          handleClickAgree={this.handleClickAgree}
          handleClickDisagree={this.handleClickDisagree}
        />
      </div>
    );
  }
}

export default withStyles(useStyles)(Login);
