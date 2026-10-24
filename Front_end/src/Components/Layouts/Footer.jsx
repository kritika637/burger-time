import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { config } from "../../config";

function Footer() {
  return (
    <footer>
      <Container>
        <Row className="justify-content-center text-center gy-5">
          {/* Location Box */}
          <Col sm={6} lg={3} className="footer_box">
            <h5>Location</h5>
            <p>{config.brand.address.street},</p>
            <p>{config.brand.address.city}, {config.brand.address.zip}</p>
            <p>{config.brand.address.country}</p>
          </Col>

          {/* Working Hours Box */}
          <Col sm={6} lg={3} className="footer_box">
            <h5>Working Hours</h5>
            <p>{config.brand.hours.weekdays}</p>
            <p>{config.brand.hours.saturday}</p>
            <p>{config.brand.hours.sunday}</p>
          </Col>

          {/* Order Now Box */}
          <Col sm={6} lg={3} className="footer_box">
            <h5>Order Now</h5>
            <p>Fresh & Crispy Burgers at Doorstep</p>
            <a href={config.brand.phoneLink} className="calling">
              {config.brand.phone}
            </a>
          </Col>

          {/* Follow Us Box */}
          <Col sm={6} lg={3} className="footer_box">
            <h5>Follow Us</h5>
            <p>Join our foodie community on social media</p>
            <ul className="social_links list-unstyled p-0 m-0 d-flex justify-content-center gap-3">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer">
                  <i className="bi bi-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer">
                  <i className="bi bi-youtube"></i>
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Copyright Bar */}
      <div className="copy_right">
        <Container>
          <Row className="align-items-center text-center">
            <Col>
              <ul className="copy_links list-unstyled p-0 m-0 d-flex flex-wrap justify-content-center gap-2 gap-sm-4">
                <li>
                  <span>© {new Date().getFullYear()} {config.brand.name}. All Rights Reserved</span>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/menu">Our Menu</Link>
                </li>
                <li>
                  <span>Privacy Policy</span>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
