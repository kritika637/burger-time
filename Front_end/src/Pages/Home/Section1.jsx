import { Col, Container, Row } from "react-bootstrap";
import Burger from "../../assets/hero/hero-2.png";
import { Link } from "react-router-dom";

function Section1() {
  return (
    <section className="hero_section">
      <Container>
        <Row>
          <Col lg={7} className="mb-5 mb-lg-0">
            <div className="position-relative">
              <img src={Burger} alt="Hero" className="img-fluid" />
              <div className="price_badge">
                <div className="badge_text">
                  <h4 className="h4_xs">Order</h4>
                  <h4 className="h3_lg">Now</h4>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="hero_text text-center">
              <h1 className="text-white">CRAZY CRUNCHY BURGERS</h1>
              <h2 className="text-white">
                Freshly Grilled Patis & Spice Layers
              </h2>
              <p className="text-white pt-2 pb-4">
                "Experience the ultimate taste explosion with our authentic
                handmade patties, loaded with melted cheese and fresh veggies.
                Made fresh, served hot!"
              </p>
              <Link to="/shop" className="btn order_now">
                Order Now
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section1;
