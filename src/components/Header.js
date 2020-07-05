import React from "react";
import { Link } from "react-router-dom";

import logo from "../images/logo-512.png";
import style from "./Header.css";

const NavItem = ({ name, url }) => (
  <Link to={ url } className={ style.NavItem }>
    { name }
  </Link>
);

const Nav = () => (
  <nav className={ style.Nav }>
    <NavItem name="About" url="/about" />
    <NavItem name="Blog" url="/blog" />
  </nav>
);

const Logo = () => (
  <Link className={ style.Logo } to="/">
    <img src={ logo } alt="Rojo" />
  </Link>
);

const Header = ({ siteTitle }) => (
  <header className={ style.Header }>
    <div className={ style.HeaderInner }>
      <Logo />
      <Nav />
    </div>
  </header>
);

export default Header;
