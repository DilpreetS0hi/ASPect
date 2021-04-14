import React, { useState, useEffect } from "react";
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";

const NavMenu = () => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("expiration")
      ? true
      : false
  );

  useEffect(() => {
    const authenticationChecker = () => {
      if (
        localStorage.getItem("id") &&
        localStorage.getItem("token") &&
        localStorage.getItem("expiration")
      ) {
        setAuthenticated(true);
      }
    };
    authenticationChecker();
  }, [authenticated]);

  const onLogOut = () => {
    localStorage.clear();
    setAuthenticated(false);
  };

  return (
    <header>
      <Navbar className="navbar-expand-sm ng-white border-bottom mb-3" light>
        <Container>
          <NavbarBrand tag={Link} to="/">
            Student Portal
          </NavbarBrand>

          <ul className="navbar-nav flex-grow">
            {authenticated ? (
              <>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/dashboard">
                    Dashboard
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    tag={Link}
                    className="text-dark"
                    to="/"
                    onClick={onLogOut}
                  >
                    Logout
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/login">
                    Login
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/signup">
                    Sign Up
                  </NavLink>
                </NavItem>
              </>
            )}
          </ul>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavMenu;
