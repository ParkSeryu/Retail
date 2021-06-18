import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Login from "./Route/Login";
import Home from "./Route/Home";

import Purchase_pr0301r from "./Route/pr0301r/Purchase_pr0301r";
import Sales_pr0501r from "./Route/pr0501r/Sales_pr0501r";

function App() {
  return (
    <>
      <HashRouter>
        <Route path="/" exact component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/pr0301r" component={Purchase_pr0301r} />
        <Route path="/pr0501r" component={Sales_pr0501r} />
      </HashRouter>
    </>
  );
}

export default App;
