import React from "react";
import { Helmet } from "react-helmet";

export default function NotFound() {
  return (
    <React.Fragment>
      <Helmet>
        <title>404: Not Found</title>
      </Helmet>

      <h1>
        404: Not Found
      </h1>
    </React.Fragment>
  );
}