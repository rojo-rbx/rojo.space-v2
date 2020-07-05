import React from "react";
import { Switch, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

import MDXComponents from "./MDXComponents";
import Header from "./Header";
import Footer from "./Footer";

import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

import style from "./App.css";

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

      <Header />

      <div className={ style.Main }>
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
      </div>

      <Footer />
    </MDXComponents>
  );
}