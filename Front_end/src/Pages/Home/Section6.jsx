import { Container, Row, Carousel } from "react-bootstrap";
import reviewData from "../../reviewData.json";

function Section6() {
  return (
    <section className="blog_section">
      <Container>
        <Row>
          <Carousel>
            {reviewData.map((review) => (
              <Carousel.Item key={review.id}>
                <Carousel.Caption>
                  <div className="user_img">
                    <img
                      src={`/images/blog/${review.image}`}
                      alt={review.name}
                      className="img-fluid"
                    />
                  </div>
                  <p>"{review.text}"</p>
                  <div className="item_rating mb-2">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <h5>BY {review.name}</h5>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Row>
      </Container>
    </section>
  );
}

export default Section6;
