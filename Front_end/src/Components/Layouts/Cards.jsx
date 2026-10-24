import { useState } from "react";
import { Col, Card } from "react-bootstrap";
import { useCart } from "../../Context/useCart";
import WishlistHeart from "./WishlistHeart";

function Cards({
  id,
  image,
  rating,
  title,
  paragraph,
  price,
  renderRatingIcons,
}) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [imgError, setImgError] = useState(false);

  const currentQuantity = getItemQuantity(id);
  const productInfo = { id, image, rating, title, paragraph, price };

  return (
    <Col sm={6} lg={4} xl={3} className="mb-4">
      <Card className="overflow-hidden h-100 shadow-sm border-0 menu_card_item">
        <div className="overflow-hidden position-relative">
          {imgError ? (
            <div
              className="d-flex align-items-center justify-content-center bg-light"
              style={{ height: "200px" }}
            >
              <i className="bi bi-image text-muted display-4"></i>
            </div>
          ) : (
            <Card.Img
              variant="top"
              src={image}
              className="img-fluid"
              onError={() => setImgError(true)}
            />
          )}
          <div
            className="position-absolute"
            style={{ top: "10px", right: "10px" }}
          >
            <WishlistHeart productId={id} />
          </div>
        </div>
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <div className="item_rating mb-2">{renderRatingIcons(rating)}</div>
            <Card.Title
              className="fw-bold"
              style={{ fontFamily: "var(--oswald-font)" }}
            >
              {title}
            </Card.Title>
            <Card.Text
              className="text-muted small"
              style={{ fontFamily: "var(--roboto-font)" }}
            >
              {paragraph}
            </Card.Text>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <h5
              className="mb-0 fw-bold"
              style={{ fontFamily: "var(--oswald-font)" }}
            >
              ₹{price}
            </h5>

            <div className="add_to_card">
              {currentQuantity === 0 ? (
                <button
                  className="btn order_now py-2 px-3 border-0 btn-sm"
                  onClick={() => addToCart(productInfo)}
                  style={{
                    background: "var(--yellow)",
                    color: "var(--light-black)",
                    fontWeight: "700",
                    fontFamily: "var(--oswald-font)",
                  }}
                >
                  <i className="bi bi-bag me-2"></i>ADD TO CART
                </button>
              ) : (
                <div
                  className="d-flex align-items-center rounded overflow-hidden"
                  style={{ border: "2px solid var(--yellow)" }}
                >
                  <button
                    className="btn btn-sm text-dark px-2 border-0 fw-bold"
                    style={{ background: "var(--yellow)" }}
                    onClick={() => removeFromCart(id)}
                  >
                    <i className="bi bi-dash-lg"></i>
                  </button>
                  <span
                    className="fw-bold px-3"
                    style={{
                      fontFamily: "var(--oswald-font)",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {currentQuantity}
                  </span>
                  <button
                    className="btn btn-sm text-dark px-2 border-0 fw-bold"
                    style={{ background: "var(--yellow)" }}
                    onClick={() => addToCart(productInfo)}
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Cards;
