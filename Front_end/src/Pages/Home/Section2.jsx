import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pizza from "../../assets/about/pizza.png";
import Salad from "../../assets/about/salad.png";
import Delivery from "../../assets/about/delivery-bike.png";

// Mock Data Cards
const mockData = [
  {
    image: Pizza,
    title: "Original Recipes",
    paragraph:
      "Our secret spice blends and signature burger sauces are crafted by top chefs to give you an unforgettable desi taste twist.",
  },
  {
    image: Salad,
    title: "100% Fresh Ingredients",
    paragraph:
      "From crunchy hand-picked lettuce to farm-fresh paneer and premium juicy chicken, we never compromise on quality.",
  },
  {
    image: Delivery,
    title: "Fastest Delivery",
    paragraph:
      "Hungry? Don't worry! Our delivery riders ensure your burgers land on your table piping hot and fresh within 30 minutes.",
  },
];

function Section2() {
  return (
    <>
      <section className="about_section">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center">
              <h2>The burger tastes better when you eat it with your family</h2>
              <p>
                Make your family weekend special with our Mega Family Combo
                Packs! Enjoy a rich variety of crispy veg maharajas, spicy
                paneer delights, large crinkle-cut fries, and refreshing cold
                drinks. Food bonds families closer, and we make it delicious!
              </p>
              <Link to="/menu" className="btn order_now btn_red">
                Explore Full Menu
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="about_wrapper">
        <Container>
          <Row className="justify-content-md-center">
            {mockData.map((cardData, index) => (
              <Col md={6} lg={4} className="mb-4 mb-md-0" key={index}>
                <div className="about_box text-center">
                  <div className="about_icon">
                    <img
                      src={cardData.image}
                      alt="icon"
                      className="img-fluid"
                    />
                  </div>
                  <h4>{cardData.title}</h4>
                  <p>{cardData.paragraph}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Section2;
