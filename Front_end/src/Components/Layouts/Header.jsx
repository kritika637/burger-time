import { useCart } from "../../Context/useCart";
import { useAuth } from "../../Context/useAuth";
import CartDrawer from "./CartDrawer";
import { Container, Nav, Navbar } from "react-bootstrap";
import "../../Styles/HeaderStyle.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/logo.png";
import { useState, useEffect, useRef } from "react";

function Header() {
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showDrawer, setShowDrawer] = useState(false);
  const [nav, setNav] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const closeTimer = useRef(null);
  const userMenuRef = useRef(null);
  const lastTouchTime = useRef(0);

  const isTouchRecent = () => Date.now() - lastTouchTime.current < 700;

  const openUserMenu = () => {
    if (isTouchRecent()) return;
    clearTimeout(closeTimer.current);
    setShowUserMenu(true);
  };

  const closeUserMenu = () => {
    if (isTouchRecent()) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setShowUserMenu(false), 200);
  };

  const handleAvatarPointerDown = (e) => {
    if (e.pointerType !== "mouse") {
      lastTouchTime.current = Date.now();
      setShowUserMenu((v) => !v);
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    if (isTouchRecent()) return;
    setShowUserMenu((v) => !v);
  };

  useEffect(() => {
    if (!showUserMenu) return;
    const handleOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        clearTimeout(closeTimer.current);
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    const changeValueOnScroll = () => {
      const scrollValue = document?.documentElement?.scrollTop;
      scrollValue > 100 ? setNav(true) : setNav(false);
    };

    window.addEventListener("scroll", changeValueOnScroll);
    return () => window.removeEventListener("scroll", changeValueOnScroll);
  }, []);

  const cartCount = getCartCount();

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header>
      <Navbar
        collapseOnSelect
        expand="lg"
        className={nav ? "sticky" : ""}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            <img src={Logo} alt="Logo" className="img-fluid" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/menu">
                Our Menu
              </Nav.Link>
              <Nav.Link as={Link} to="/shop">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/blog">
                Blog
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
                Contact
              </Nav.Link>

              {/* User Menu */}
              <Nav.Item className="d-flex align-items-center justify-content-center ms-lg-3 mt-3 mt-lg-0">
                {isAuthenticated ? (
                  <div
                    className="position-relative"
                    ref={userMenuRef}
                    onMouseEnter={openUserMenu}
                    onMouseLeave={closeUserMenu}
                  >
                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ cursor: "pointer" }}
                      onPointerDown={handleAvatarPointerDown}
                      onClick={handleAvatarClick}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "var(--bg-coffee)",
                          color: "var(--white)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--oswald-font)",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                        }}
                      >
                        {getInitials(user?.name)}
                      </div>
                    </div>

                    {showUserMenu && (
                      <div
                        className="position-absolute end-0 user-menu-dropdown bg-white rounded shadow-lg border py-2"
                        style={{
                          minWidth: "200px",
                          zIndex: "1001",
                        }}
                      >
                        <div className="px-3 pb-2 border-bottom mb-2">
                          <small
                            className="fw-bold d-block"
                            style={{ fontFamily: "var(--oswald-font)" }}
                          >
                            {user?.name}
                          </small>
                          <small className="text-muted">{user?.email}</small>
                        </div>
                        <Link
                          to="/profile"
                          className="d-block px-3 py-2 text-decoration-none"
                          style={{
                            fontFamily: "var(--oswald-font)",
                            color: "var(--light-black)",
                          }}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <i className="bi bi-person me-2"></i>My Profile
                        </Link>
                        <Link
                          to="/profile"
                          className="d-block px-3 py-2 text-decoration-none"
                          style={{
                            fontFamily: "var(--oswald-font)",
                            color: "var(--light-black)",
                          }}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <i className="bi bi-heart me-2"></i>Wishlist
                        </Link>
                        <div
                          className="px-3 py-2 text-danger fw-bold"
                          style={{
                            fontFamily: "var(--oswald-font)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>Logout
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="d-flex align-items-center gap-1"
                  >
                    <i className="bi bi-person fs-5"></i>
                    <span
                      style={{
                        fontFamily: "var(--oswald-font)",
                        fontWeight: "500",
                      }}
                    >
                      Login
                    </span>
                  </Nav.Link>
                )}
              </Nav.Item>

              {/* Cart trigger */}
              <Nav.Item className="d-flex align-items-center justify-content-center ms-lg-3 mt-3 mt-lg-0">
                <div
                  className="cart"
                  onClick={() => setShowDrawer(true)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-bag fs-4"></i>
                  {cartCount > 0 && (
                    <span className="roundpoint">{cartCount}</span>
                  )}
                </div>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CartDrawer show={showDrawer} handleClose={() => setShowDrawer(false)} />
    </header>
  );
}

export default Header;
