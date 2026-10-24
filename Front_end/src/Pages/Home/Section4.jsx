import { Col, Container, Row } from "react-bootstrap";
import PromotionImage from "../../assets/promotion/pro.png";

function Section4() {
  return (
    <>
      <section className="promotion_section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center mb-5 mb-lg-0">
              <img src={PromotionImage} alt="Promotion" className="img-fluid" />
            </Col>
            <Col lg={6} className="px-5">
              <h2>NOTHING BRINGS PEOPLE TOGETHER LIKE A GOOD BURGER</h2>
              <p>
                Whether it's a midnight craving or a party with friends, our
                double-decker loaded cheese burgers are here to save the day.
                Download our official mobile app now and get flat 50% OFF on
                your first three orders!
              </p>
              <ul>
                <li>
                  <p>
                    Made daily with 100% fresh, locally sourced premium
                    ingredients and grilled to perfection.
                  </p>
                </li>
                <li>
                  <p>
                    Layered with premium liquid cheese burst that makes every
                    single bite super juicy.
                  </p>
                </li>
                <li>
                  <p>
                    Delivered piping hot straight to your doorstep with our
                    dedicated lightning-fast riders.
                  </p>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
      {/* BG Parallax Scroll */}
      <section className="bg_parallax_scroll"></section>
    </>
  );
}

export default Section4;
