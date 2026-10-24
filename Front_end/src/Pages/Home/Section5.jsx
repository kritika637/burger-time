import "react";
import { Col, Container, Row, Carousel } from "react-bootstrap";
import StoreIOS from "../../assets/shop/appstore.png";
import StoreGoggle from "../../assets/shop/googleplay.png";
import DownloadImage from "../../assets/shop/e-shop.png";
import Brand1 from "../../assets/brands/brand-11.png";
import Brand2 from "../../assets/brands/brand-12.png";
import Brand3 from "../../assets/brands/brand-13.png";
import Brand4 from "../../assets/brands/brand-14.png";
import Brand5 from "../../assets/brands/brand-15.png";
import Brand6 from "../../assets/brands/brand-16.png";
import Brand7 from "../../assets/brands/brand-17.png";
import Brand8 from "../../assets/brands/brand-18.png";

function Section5() {
  return (
    <>
      <section className="shop_section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <h4>DOWNLOAD MOBILE APP &</h4>
              <h2>save up to 50%</h2>
              <p>
                {" "}
                Craving a juicy burger at midnight or hosting a party with
                friends? Order directly from our official mobile application to
                track your hot meal live, earn loyalty crunch-points, and grab
                free crispy fries with every meal!
              </p>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={StoreIOS}
                  alt="IOS"
                  className="img-fluid store me-3"
                />
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={StoreGoggle}
                  alt="Android"
                  className="img-fluid store me-3"
                />
              </a>
            </Col>
            <Col lg={6}>
              <img src={DownloadImage} alt="e-shop" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="brand_section">
        <Container>
          <Row>
            <Carousel>
              <Carousel.Item>
                <Carousel.Caption>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="brand_img">
                      <img src={Brand1} alt="brand-1" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand2} alt="brand-2" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand3} alt="brand-3" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand4} alt="brand-4" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand5} alt="brand-5" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand6} alt="brand-6" className="img-fluid" />
                    </div>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Carousel.Caption>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="brand_img">
                      <img src={Brand3} alt="brand-3" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand4} alt="brand-4" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand5} alt="brand-5" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand6} alt="brand-6" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand7} alt="brand-7" className="img-fluid" />
                    </div>
                    <div className="brand_img">
                      <img src={Brand8} alt="brand-8" className="img-fluid" />
                    </div>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Section5;
