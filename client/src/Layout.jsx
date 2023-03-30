import React from "react";
import Menu from "./Menu";
import './styles.css';

const Layout = ({
  title = "Title",
  description = "Description",
  className,
  children,
}) => (
  <div>
    <Menu />

    <div className="jumbotron jumbotron-fluid">
      <div className="container text-center">
        <h3 className="display-4  font-weight-bold">{title}</h3>
        <h4 className="lead ">{description}</h4>
      </div>
    </div>
    <div className={className}>{children}</div>
  </div>
);

export default Layout;