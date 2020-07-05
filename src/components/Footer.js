import React from "react";
import { Link } from "react-router-dom";

import style from "./Footer.css";

const FooterNav = () => (
  <nav className={ style.FooterNav }>
    <a className={ style.NavItem }href="/docs">Docs</a>
    <Link className={ style.NavItem } to="/blog">Blog</Link>
  </nav>
);

const FooterAbout = () => (
  <div className={ style.FooterAbout }>
    <div>© {new Date().getFullYear()} Rojo</div>
  </div>
);

const Footer = () => (
  <footer className={ style.Footer }>
    <div className={ style.FooterMain }>
      <FooterAbout />
      <FooterNav />
    </div>
  </footer>
);

export default Footer;
