import { Col, Container, Row } from "react-bootstrap";
import { config } from "../../config";

function Section7() {
  return (
    <section className="contact_section">
      <Container>
        <Row className="justify-content-center">
          <Col sm={8} className="text-center">
            <h4>WE GUARANTEE 100% SATISFACTION</h4>
            <h2>30 Minutes Delivery!</h2>
            <p>
              "If your burger isn't hot, fresh, or as delicious as you expected,
              just let us know. We will replace it instantly—no questions asked!
              Because your taste matters to us.
            </p>
            <a href={config.brand.phoneLink} className="btn btn_red px-4 py-2 rounded-0">
              Call: {config.brand.phone}
            </a>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section7;
