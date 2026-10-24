import Layout from "../../Components/Layouts/Layout";
import Section2 from "../Home/Section2";
import { Container, Row, Col } from "react-bootstrap";
import { config } from "../../config";

function About() {
  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>About Our Brand</h1>
          <p>The story behind the craziest burgers in town.</p>
        </div>
      </div>

      {/* Main Content */}
      <Section2 />

      {/* Additional Stats Section */}
      <Container className="py-5 text-center">
        <Row>
          <Col md={4} className="mb-4">
            <h2 className="text-danger fw-bold display-5">{config.stats.outlets}</h2>
            <p className="text-muted text-uppercase fw-bold">Outlets Worldwide</p>
          </Col>
          <Col md={4} className="mb-4">
            <h2 className="text-danger fw-bold display-5">{config.stats.dailyCustomers}</h2>
            <p className="text-muted text-uppercase fw-bold">
              Happy Customers Daily
            </p>
          </Col>
          <Col md={4} className="mb-4">
            <h2 className="text-danger fw-bold display-5">{config.stats.yearsOfTrust}</h2>
            <p className="text-muted text-uppercase fw-bold">Years of Trust</p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default About;
