import React, { Component } from "react";
import AppBars from "../../components/AppBars";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = (theme) => ({
  root: {
    width: "97%",
    border: "1px solid #black",
    marginLeft: "1.5vw",
    marginTop: "10vh",
  },

  accordionSummary: {
    borderTop: "1px solid #black",
  },

  summaryHeader: {
    fontSize: theme.typography.pxToRem(16),
    color: "#F13728",
    flexBasis: "70%",
  },

  summarySubHeader: {
    float: "right",
    marginLeft: "3vw",
    color: "#F13728",
    fontSize: theme.typography.pxToRem(16),
  },

  component: {
    overflow: "hidden",
    border: "1px solid #ddd",
  },

  itemView: {
    width: "100%",
  },

  card: {
    marginTop: "4vh",
  },

  buyCustName: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  dateText: {
    float: "right",
    fontSize: "11pt",
    fontWeight: "bold",
  },

  buyAmount: {
    float: "right",
  },

  paymentAmount: {
    float: "right",
  },

  amountText: {
    float: "right",
  },

  circular_progress: {
    position: "absolute",
    marginLeft: "40vw",
    marginTop: "45vh",
  },
});

class Purchase_pr0303r extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemList: [],
      toggle: false,
      expanded: [],
    };
  }

  handleChange = (panel) => (event, newExpanded) => {
    if (newExpanded) {
      this.setState({
        expanded: this.state.expanded.concat(panel),
      });
    } else {
      this.setState({
        expanded: this.state.expanded.filter((element) => element !== panel),
      });
    }
  };

  componentDidMount() {
    if (window.sessionStorage.getItem("pr0303r_inputs") === null) {
      if (window.sessionStorage.getItem("pr0303r_itemList") === null) {
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
          itemList: JSON.parse(
            window.sessionStorage.getItem("pr0303r_itemList")
          ),
          expanded: JSON.parse(
            window.sessionStorage.getItem("pr0303r_accordion")
          ),
        });
      }
    } else {
      this.loadItem();
    }
  }

  componentWillUnmount() {
    window.sessionStorage.setItem(
      "pr0303r_accordion",
      JSON.stringify(this.state.expanded)
    );
  }

  loadItem = async () => {
    this.setState({
      loading: true,
    });
    let data = JSON.parse(window.sessionStorage.getItem("pr0303r_inputs"));
    console.log("data : " + JSON.stringify(data));

    axios
      .get(
        "http://121.165.242.72:5050/retail/developer/index.php/retailPurchase_pr0303r/sum",
        {
          params: {
            date_f: data.date_f.replaceAll("-", ""),
            date_t: data.date_t.replaceAll("-", ""),
            buy_cust_cd: data.buy_cust_cd,
            branch_cd: data.branch_cd,
          },
        }
      )
      .then((response) => {
        console.log("response data receving");
        if (response.data.RESULT_CODE === "200") {
          // data라는 이름으로 json 파일에 있는 값에 state값을 바꿔준다.
          this.setState({
            loading: false, // load되었으니 false,
            itemList: response.data, // 비어있던 Itemlist는 data에 Item객체를 찾아넣어준다. ( Item : json파일에 있는 항목)
          });
          window.sessionStorage.setItem(
            "pr0303r_itemList",
            JSON.stringify(this.state.itemList)
          );
          window.sessionStorage.removeItem("pr0303r_inputs");
        } else {
          alert("조회된 내역이 없습니다.");
          this.setState({
            loading: false, // 이때는 load 가 false 유지
          });
        }
      })
      .catch((e) => {
        console.error(e); // 에러표시
        this.setState({
          loading: false, // 이때는 load 가 false 유지
        });
      });
  };

  render() {
    const { classes } = this.props;
    const itemList = this.state.itemList;
    console.log(this.state.expanded);
    return this.state.loading === false ? (
      <div>
        <AppBars programName={"매입처원장"} useSearch={"/pr0303r"} />
        <div className={classes.root}>
          {itemList.length !== 0 &&
            itemList.DATA_2.map((itemHeaderData, index) => {
              return (
                <Accordion
                  square
                  expanded={this.state.expanded.includes(index)}
                  onChange={this.handleChange(index)}
                  key={index}
                >
                  {itemHeaderData.NOW_AMOUNT > 0 ? (
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel-content"
                      id="panel-header"
                      className={classes.accordionSummary}
                    >
                      <span className={classes.summaryHeader}>
                        {itemHeaderData.BUY_CUST_NAME}
                      </span>
                      <span className={classes.summarySubHeader}>
                        {numberWithCommas(itemHeaderData.NOW_AMOUNT)}
                      </span>
                    </AccordionSummary>
                  ) : (
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel-content"
                      id="panel-header"
                    >
                      <span className={classes.summaryHeader}>
                        {itemHeaderData.BUY_CUST_NAME}
                      </span>
                      <span className={classes.summarySubHeader}>
                        {numberWithCommas(itemHeaderData.NOW_AMOUNT)}
                      </span>
                    </AccordionSummary>
                  )}
                  <AccordionDetails>
                    <Card className={classes.itemView}>
                      {itemList.DATA.map((itemdata, index) => {
                        if (
                          itemHeaderData.BUY_CUST_CD === itemdata.BUY_CUST_CD
                        ) {
                          return (
                            <Link
                              key={index}
                              to={{
                                pathname: "/pr0303r/detail",
                                state: { data: { itemdata } },
                              }}
                            >
                              <CardContent className={classes.component}>
                                <Typography gutterBottom variant="body1">
                                  <span className={classes.buyCustName}>
                                    {itemdata.BUY_CUST_NAME}
                                  </span>
                                  <span className={classes.dateText}>
                                    {itemdata.BUY_DATE.search("이월") === 0
                                      ? itemdata.BUY_DATE
                                      : itemdata.BUY_DATE.substring(0, 4) +
                                        "/" +
                                        itemdata.BUY_DATE.substring(4, 6) +
                                        "/" +
                                        itemdata.BUY_DATE.substring(6, 8)}
                                  </span>
                                </Typography>

                                <span className={classes.card}>
                                  <Typography gutterBottom variant="body1">
                                    <span>{"　"}</span>
                                    <span className={classes.buyAmount}>
                                      {"매입금액 : " +
                                        numberWithCommas(itemdata.BUY_AMOUNT)}
                                    </span>
                                  </Typography>
                                  <Typography gutterBottom variant="body1">
                                    <span>{"　"}</span>
                                    <span className={classes.paymentAmount}>
                                      {"지불액 : " +
                                        numberWithCommas(
                                          itemdata.PAYMENT_AMOUNT
                                        )}
                                    </span>
                                  </Typography>
                                  <Typography gutterBottom variant="body1">
                                    <span className={classes.amountText}>
                                      {"잔액 : " +
                                        numberWithCommas(itemdata.NOW_AMOUNT)}
                                    </span>
                                  </Typography>
                                </span>
                              </CardContent>
                            </Link>
                          );
                        } else return null;
                      })}
                    </Card>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </div>
      </div>
    ) : (
      <div className={classes.circular_progress}>
        <CircularProgress color="secondary" size={80} />
      </div>
    );
  }
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default withStyles(useStyles)(Purchase_pr0303r);
