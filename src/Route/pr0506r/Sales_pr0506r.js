import React, { Component } from "react";
import AppBars from "../../components/AppBars";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const useStyles = () => ({
  component: {
    overflow: "hidden",
    borderBottom: "1px solid #ddd",
    padding: "10px",
  },

  subComponent: {
    backgroundColor: "#4A4F5A",
    padding: "10px",
    color: "white",
  },

  totalComponent: {
    backgroundColor: "#7B7B7B",
    padding: "10px",
    color: "white",
  },

  dateText: {
    float: "right",
    marginRight: "1vw",
  },

  sellCustNameText: {
    marginBottom: "0.5vh",
    float: "left",
    marginLeft: "1vw",
  },

  amountText: {
    float: "right",
    marginTop: "1.5vh",
    marginRight: "1vw",
    clear: "both",
  },

  subTotal: {
    marginLeft: "8vw",
  },

  subTotalAmount: {
    float: "right",
    marginRight: "1vw",
  },

  itemview: {
    marginTop: "9vh",
  },

  circular_progress: {
    position: "absolute",
    marginLeft: "40vw",
    marginTop: "45vh",
  },
});

class Sales_pr0506r extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemList: [],
      toggle: false,
      total_amount: 0,
    };
  }

  componentDidMount() {
    if (window.sessionStorage.getItem("pr0506r_inputs") === null) {
      if (window.sessionStorage.getItem("pr0506r_itemList") === null) {
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
          itemList: JSON.parse(
            window.sessionStorage.getItem("pr0506r_itemList")
          ),
          total_amount: window.sessionStorage.getItem("pr0506r_total_amount"),
        });
      }
    } else {
      this.loadItem();
    }
  }

  loadItem = async () => {
    this.setState({
      loading: true,
    });
    let data = JSON.parse(window.sessionStorage.getItem("pr0506r_inputs"));
    console.log(data);
    axios
      .get(
        "http://121.165.242.72:5050/retail/developer/index.php/retailSales_pr0506r/retrieve",
        {
          params: {
            date_f: data.date_f.replaceAll("-", ""),
            date_t: data.date_t.replaceAll("-", ""),
            branch_cd: window.sessionStorage.getItem("branch_cd"),
            sell_cust_cd: data.sell_cust_cd,
            group_cd: data.group_cd,
            class_cd: data.class_cd,
            product_cd: data.product_cd,
            lot_no: data.lot_no,
          },
        }
      )
      .then((response) => {
        console.log("response data receving");
        console.log(response);
        if (response.data.RESULT_CODE === "200") {
          // data?????? ???????????? json ????????? ?????? ?????? state?????? ????????????.
          this.setState({
            loading: false, // load???????????? false,
            itemList: response.data.DATA, // ???????????? Itemlist??? data??? Item????????? ??????????????????. ( Item : json????????? ?????? ??????)
            total_amount: response.data.TOTAL_AMOUNT,
          });
          window.sessionStorage.setItem(
            "pr0506r_itemList",
            JSON.stringify(this.state.itemList)
          );
          window.sessionStorage.setItem(
            "pr0506r_total_amount",
            this.state.total_amount
          );

          window.sessionStorage.removeItem("pr0506r_inputs");
        } else {
          alert("????????? ????????? ????????????.");
          this.setState({
            loading: false, // ????????? load ??? false ??????
          });
        }
      })
      .catch((e) => {
        console.error(e); // ????????????
        this.setState({
          loading: false, // ????????? load ??? false ??????
        });
      });
  };

  render() {
    const { classes } = this.props;
    const itemList = this.state.itemList;

    return this.state.loading === false ? (
      <div>
        <AppBars programName={"????????????"} useSearch={"pr0506r"} />
        <ul className={classes.itemview}>
          {console.log(itemList)}
          {itemList.map((itemdata, index) => {
            return itemdata.SORT_SEQ === "1" ? (
              <Link
                key={itemdata.SELL_NO + itemdata.SELL_SEQ}
                to={{
                  pathname: "/pr0506r/detail",
                  state: { data: { itemdata } },
                }}
              >
                <li className={classes.component}>
                  <span className={classes.dateText}>
                    {itemdata.SELL_DATE.substring(0, 4) +
                      "/" +
                      itemdata.SELL_DATE.substring(4, 6) +
                      "/" +
                      itemdata.SELL_DATE.substring(6, 8)}
                  </span>
                  <p className={classes.sellCustNameText}>
                    {itemdata.SELL_CUST_NAME}
                  </p>
                  <span className={classes.amountText}>
                    {itemdata.SELL_TYPE + "  "}
                    {numberWithCommas(itemdata.TOT_AMOUNT)}
                  </span>
                </li>
              </Link>
            ) : (
              <li className={classes.subComponent} key={index}>
                <span className={classes.subTotal}>??????</span>
                <span className={classes.subTotalAmount}>
                  {numberWithCommas(itemdata.TOT_AMOUNT)}
                </span>
              </li>
            );
          })}
          {this.state.total_amount !== 0 && (
            <li className={classes.totalComponent}>
              <span className={classes.subTotal}>??????</span>
              <span className={classes.subTotalAmount}>
                {numberWithCommas(this.state.total_amount)}
              </span>
            </li>
          )}
        </ul>
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

export default withStyles(useStyles)(Sales_pr0506r);
