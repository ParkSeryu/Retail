import React, { Component } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import SearchBar from "./Purchase_pr0301r_Search";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .4)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(204, 213, 226, 1)",
    borderBottom: "1px solid rgba(0, 0, 0, .4)",
    marginBottom: -1,
    height: 56,
    "&$expanded": {
      minHeight: "100%",
    },
  },
  expandIcon: {
    padding: "0vh 1vw",
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles({
  root: {
    padding: "1vh 2vw",
  },
})(MuiAccordionDetails);

const useStyles = () => ({
  root: {
    width: "98vw",
    marginLeft: "1vw",
    marginTop: "63px",
  },

  test: {
    width: "100%",
  },

  left: {
    marginLeft: "10px",
  },

  right: {
    float: "right",
    marginRight: "10px",
  },

  summaryHeader: {
    fontFamily: "NanumGothic-ExtraBold",
    fontSize: "17px",
    color: "rgba(039, 032, 049, 1)",
    flexBasis: "100%",
  },

  summarySubHeader: {
    fontFamily: "NanumGothic-ExtraBold",
    fontSize: "17px",
    color: "rgba(039, 032, 049, 1)",
  },

  innerAccordion: {
    width: "100vw",
  },

  innerAccordionSummary: {
    backgroundColor: "rgba(204, 213, 226, 0.3)",
    minHeight: 48,
    height: 48,
  },

  innerSummaryHeader: {
    fontSize: "16px",
    color: "rgba(059, 056, 056, 1)",
    flexBasis: "100%",
  },

  innerSummarySubHeader: {
    fontSize: "16px",
    color: "rgba(059, 056, 056, 1)",
  },

  itemView: {
    width: "100%",
  },

  tableCenter: {
    width: "100%",
    fontSize: "15px",
    color: "rgba(059, 056, 056, 1)",
  },

  divider: {
    margin: "0 3vw",
  },

  circular_progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
});

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const nullCheck = (text) => {
  if (text === null) return " ";
  else return text;
};

class Purchase_pr0301r extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemList: [],
      openSearchToggle: true,
    };
  }

  loadItem = async (data) => {
    this.setState({
      loading: true,
    });

    axios
      .get(
        "http://121.165.242.72:5050/retail/developer/index.php/retailPurchase_pr0301r/retrieve",
        {
          params: {
            date_f: data.date_f !== null ? data.date_f.replaceAll("/", "") : "",
            date_t: data.date_t !== null ? data.date_t.replaceAll("/", "") : "",
            branch_cd: window.sessionStorage.getItem("branch_cd"),
            buy_cust_cd: data.buy_cust_cd,
            group_cd: data.group_cd,
            class_cd: data.class_cd,
            product_cd: data.product_cd,
          },
        }
      )
      .then((response) => {
        console.log("response data receving");
        if (response.data.RESULT_CODE === "200") {
          // data라는 이름으로 json 파일에 있는 값에 state값을 바꿔준다.
          this.setState({
            loading: false, // load되었으니 false,
            itemList: response.data, // 비어있던 Itemlist는 data에 Item객체를 찾아넣어준다. (Item : json파일에 있는 항목)
            openSearchToggle: false,
          });
        } else {
          alert(
            "조회된 내역이 없습니다.",
            this.setState({
              loading: false,
              itemList: "",
              openSearchToggle: true,
            })
          );
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
    console.log("pr0301r render");
    const { classes } = this.props;
    return this.state.loading === false ? (
      <div>
        <SearchBar
          programName={"매입현황"}
          useSearch={"/pr0301r"}
          parentState={this.loadItem}
          openSearchToggle={this.state.openSearchToggle}
        />
        <div className={classes.root}>
          {this.state.itemList.length !== 0 &&
            this.state.itemList.DATA.map((itemSumDateData, index) => {
              return (
                <Accordion
                  TransitionProps={{ unmountOnExit: true }}
                  square
                  key={index}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className={classes.summaryHeader}>
                      {itemSumDateData.BUY_DATE.substring(0, 4) +
                        "/" +
                        itemSumDateData.BUY_DATE.substring(4, 6) +
                        "/" +
                        itemSumDateData.BUY_DATE.substring(6, 8)}
                    </span>
                    <span className={classes.summarySubHeader}>
                      {numberWithCommas(itemSumDateData.TOT_AMOUNT)}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className={classes.innerAccordion}>
                      {this.state.itemList.DATA_2.map(
                        (itemSumCustData, index) => {
                          if (
                            itemSumDateData.BUY_DATE ===
                            itemSumCustData.BUY_DATE
                          ) {
                            return (
                              <Accordion
                                TransitionProps={{ unmountOnExit: true }}
                                square
                                key={index}
                              >
                                <AccordionSummary
                                  classes={{
                                    expandIcon: classes.expandIcon,
                                  }}
                                  className={classes.innerAccordionSummary}
                                  expandIcon={<ExpandMoreIcon />}
                                >
                                  <span className={classes.innerSummaryHeader}>
                                    {itemSumCustData.BUY_CUST_NAME}
                                  </span>
                                  <span
                                    className={classes.innerSummarySubHeader}
                                  >
                                    {numberWithCommas(
                                      itemSumCustData.TOT_AMOUNT
                                    )}
                                  </span>
                                </AccordionSummary>
                                {this.state.itemList.DATA_3.map(
                                  (itemDetailData, index) => {
                                    if (
                                      itemSumCustData.BUY_CUST_NAME ===
                                        itemDetailData.BUY_CUST_NAME &&
                                      itemSumCustData.BUY_DATE ===
                                        itemDetailData.BUY_DATE
                                    ) {
                                      return (
                                        <div
                                          className={classes.itemView}
                                          key={index}
                                        >
                                          <Divider
                                            className={classes.divider}
                                          />
                                          <AccordionDetails>
                                            <table
                                              className={classes.tableCenter}
                                            >
                                              <tbody>
                                                <tr>
                                                  <td colSpan="2">
                                                    {"품목 :   " +
                                                      nullCheck(
                                                        itemDetailData.CLASS_NAME
                                                      ) +
                                                      " "}
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    {"규격 :   " +
                                                      nullCheck(
                                                        itemDetailData.PRODUCT_NAME
                                                      ) +
                                                      " "}
                                                  </td>
                                                  <td align="right">
                                                    {"수량 :   " +
                                                      numberWithCommas(
                                                        nullCheck(
                                                          itemDetailData.QUANTITY
                                                        )
                                                      )}
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    {"Lot번호 :  "}
                                                    {nullCheck(
                                                      itemDetailData.LOT_NO
                                                    )}
                                                  </td>
                                                  <td align="right">
                                                    {"금액 :   "}
                                                    {numberWithCommas(
                                                      itemDetailData.TOT_AMOUNT
                                                    )}
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </AccordionDetails>
                                        </div>
                                      );
                                    } else return null;
                                  }
                                )}
                              </Accordion>
                            );
                          } else return null;
                        }
                      )}
                    </div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </div>
      </div>
    ) : (
      <div>
        <SearchBar programName={"매입현황"} />
        <div className={classes.circular_progress}>
          <CircularProgress color="secondary" size={60} />
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Purchase_pr0301r);
