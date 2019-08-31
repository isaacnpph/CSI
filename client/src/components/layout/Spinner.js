import React, { Fragment } from "react";
import spinner from "./dualspin.gif";
// import { Spinner } from "reactstrap";

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{
        width: "3rem",
        height: "3rem",
        margin: "auto",
        display: "block"
      }}
      alt="Loading..."
    />
    {/* <Spinner style={{ width: "3rem", height: "3rem" }} />{" "} */}
  </Fragment>
);
