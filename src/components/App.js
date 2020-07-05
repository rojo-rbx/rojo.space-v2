import React from "react";
import { Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

import MDXComponents from "./MDXComponents";

import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

export default function App() {
  return (
    <MDXComponents>
      <Helmet
        titleTemplate="%s | Rojo"
        defaultTitle="Rojo"
      >
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Helmet>

      <header>
        header
      </header>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/about">
          <About />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>

      <footer>
        footer
      </footer>
    </MDXComponents>
  );
}