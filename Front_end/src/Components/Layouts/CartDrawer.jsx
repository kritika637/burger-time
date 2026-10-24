import { useState } from "react";
import { Offcanvas, Stack, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/useCart";
import { useAuth } from "../../Context/useAuth";
import { config } from "../../config";

const availableCoupons = [
  {
    code: "TASTY50",
    desc: "Get 15% OFF on all signature burgers",
    type: "flat",
    value: 0.15,
  },
  {
    code: "HDFCFEST",
    desc: "Flat ₹100 OFF using HDFC Credit Cards",
    type: "fixed",
    value: 100,
    min: 500,
  },
  {
    code: "ICICIFOOD",
    desc: "10% Instant Discount via ICICI NetBanking",
    type: "flat",
    value: 0.1,
    min: 400,
  },
  {
    code: "UPIFREE",
    desc: "Flat ₹50 OFF on payments via UPI Apps",
    type: "fixed",
    value: 50,
    min: 250,
  },
  {
    code: "BURGERCRUNCH",
    desc: "20% Super Saver discount on orders above ₹600",
    type: "flat",
    value: 0.2,
    min: 600,
  },
  {
    code: "MIDNIGHT",
    desc: "Flat ₹40 OFF for late-night cravings",
    type: "fixed",
    value: 40,
    min: 200,
  },
  {
    code: "AXISBURGER",
    desc: "12% OFF using Axis Bank Debit Cards",
    type: "flat",
    value: 0.12,
    min: 350,
  },
  {
    code: "FREEPAYTM",
    desc: "Flat ₹30 Cashback/OFF via Paytm Wallet",
    type: "fixed",
    value: 30,
    min: 150,
  },
];

function CartDrawer({ show, handleClose }) {
  const { cartItems, addToCart, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCouponText, setAppliedCouponText] = useState("");

  const [openOffers, setOpenOffers] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const subTotal = getCartTotal();
  const deliveryCharge =
    subTotal > config.delivery.freeThreshold || subTotal === 0
      ? 0
      : config.delivery.fee;
  const gstTax = Math.round(subTotal * config.tax.gstRate);
  const finalPayable = subTotal - discount + deliveryCharge + gstTax;

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleProceedToCheckout = () => {
    handleClose();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  const handleApplyCoupon = (couponCodeToApply) => {
    const selectedCode = couponCodeToApply || promoCode;
    const coupon = availableCoupons.find(
      (c) => c.code === selectedCode.toUpperCase(),
    );

    if (!coupon) {
      showToast("Invalid Code! Try selecting from the offers list below.");
      return;
    }

    if (coupon.min && subTotal < coupon.min) {
      showToast(
        `Minimum order value of ₹${coupon.min} required for this coupon!`,
      );
      return;
    }

    let calculatedDiscount;
    if (coupon.type === "flat") {
      calculatedDiscount = Math.round(subTotal * coupon.value);
    } else {
      calculatedDiscount = coupon.value;
    }

    setDiscount(calculatedDiscount);
    setAppliedCouponText(coupon.code);
    setPromoCode(coupon.code);
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: "10000" }}
        >
          <div
            className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show shadow`}
            role="alert"
          >
            {toast.message}
          </div>
        </div>
      )}

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="cart-drawer"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="cart-drawer-title">
            YOUR FOOD BAG
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column justify-content-between p-3 cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="text-center my-auto py-5">
              <i className="bi bi-bag-x text-muted display-1 mb-3"></i>
              <h4 style={{ fontFamily: "var(--oswald-font)" }}>
                Your Cart is Empty
              </h4>
            </div>
          ) : (
            <>
              {/* 1. Scrollable Food Items List Panel */}
              <div className="cart_items_scroll flex-grow-1 pe-1 overflow-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between p-3 mb-2 bg-white rounded border shadow-sm"
                  >
                    <div style={{ flex: "1" }}>
                      <h6
                        className="mb-1"
                        style={{
                          fontFamily: "var(--oswald-font)",
                          fontWeight: "600",
                          fontSize: "1.15rem",
                          color: "var(--light-black)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {item.title}
                      </h6>
                      <small
                        className="text-muted d-block"
                        style={{
                          fontFamily: "var(--roboto-font)",
                          fontSize: "0.9rem",
                        }}
                      >
                        ₹{item.price} × {item.quantity}
                      </small>
                      <span
                        className="fw-bold text-danger d-block mt-1"
                        style={{
                          fontFamily: "var(--oswald-font)",
                          fontSize: "1.1rem",
                        }}
                      >
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {/* Counter Adjustments */}
                    <Stack
                      direction="horizontal"
                      gap={2}
                      className="bg-light border rounded p-1"
                    >
                      <button
                        className="border-0 bg-transparent text-muted px-2 py-1 fw-bold"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="bi bi-dash-lg"></i>
                      </button>
                      <span
                        className="fw-bold px-1"
                        style={{
                          fontFamily: "var(--oswald-font)",
                          minWidth: "15px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="border-0 bg-transparent text-danger px-2 py-1 fw-bold"
                        onClick={() => addToCart(item)}
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                    </Stack>
                  </div>
                ))}
              </div>

              {/* 2. Promo Input Field Area */}
              <div className="promo_input_wrapper mt-3 p-2 bg-white rounded border d-flex gap-2 shadow-sm">
                <input
                  type="text"
                  className="form-control text-uppercase border-secondary shadow-none"
                  placeholder="ENTER PROMO CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    fontFamily: "var(--roboto-font)",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  className="btn btn-dark fw-bold px-3"
                  onClick={() => handleApplyCoupon(null)}
                  style={{
                    fontFamily: "var(--oswald-font)",
                    letterSpacing: "0.5px",
                  }}
                >
                  APPLY
                </button>
              </div>

              {/* 3. Collapsible Coupons Drawer */}
              <div className="mt-2 mb-2">
                <div
                  onClick={() => setOpenOffers(!openOffers)}
                  className="d-flex justify-content-between align-items-center p-2.5 rounded border bg-white shadow-sm text-danger fw-bold"
                  style={{
                    cursor: "pointer",
                    fontFamily: "var(--oswald-font)",
                    letterSpacing: "0.5px",
                    fontSize: "0.95rem",
                  }}
                >
                  <span>
                    <i className="bi bi-tags-fill me-2 text-warning"></i>VIEW
                    AVAILABLE BANK & UPI OFFERS
                  </span>
                  <i
                    className={`bi bi-chevron-${openOffers ? "up" : "down"} text-muted fs-6`}
                  ></i>
                </div>

                <Collapse in={openOffers}>
                  <div
                    className="mt-2 p-2 bg-white rounded border shadow-sm overflow-auto offers_scroll_tray"
                    style={{ maxHeight: "160px" }}
                  >
                    {availableCoupons.map((coupon) => (
                      <div
                        key={coupon.code}
                        onClick={() => handleApplyCoupon(coupon.code)}
                        className={`p-2 mb-2 rounded border border-dashed d-flex align-items-center justify-content-between offer_item_row ${appliedCouponText === coupon.code ? "border-success bg-light" : ""}`}
                        style={{ cursor: "pointer", borderStyle: "dashed" }}
                      >
                        <div style={{ maxWidth: "75%" }}>
                          <span
                            className="badge bg-warning text-dark mb-1 fw-bold"
                            style={{ fontFamily: "var(--oswald-font)" }}
                          >
                            {coupon.code}
                          </span>
                          <p
                            className="m-0 text-muted small"
                            style={{
                              fontFamily: "var(--roboto-font)",
                              fontSize: "0.78rem",
                            }}
                          >
                            {coupon.desc}
                          </p>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger py-0 px-2 fw-bold"
                          style={{
                            fontSize: "0.75rem",
                            fontFamily: "var(--oswald-font)",
                          }}
                        >
                          {appliedCouponText === coupon.code
                            ? "APPLIED"
                            : "TAP"}
                        </button>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>

              {/* 4. Financial Breakdown Area */}
              <div
                className="billing_breakdown_block border-top pt-2"
                style={{ fontFamily: "var(--roboto-font)" }}
              >
                <div className="d-flex justify-content-between text-muted mb-1 small">
                  <span>Items Subtotal:</span>
                  <span className="fw-bold">₹{subTotal}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between text-success mb-1 small">
                    <span>Promo Coupon Discount ({appliedCouponText}):</span>
                    <span className="fw-bold">- ₹{discount}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between text-muted mb-1 small">
                  <span>Delivery Partner Fee:</span>
                  <span className="fw-bold">
                    {deliveryCharge === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between text-muted mb-2 small">
                  <span>Restaurant GST (5%):</span>
                  <span className="fw-bold">₹{gstTax}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 border-top pt-2">
                  <h5
                    className="m-0 fw-bold text-dark"
                    style={{
                      fontFamily: "var(--oswald-font)",
                      fontSize: "1.3rem",
                    }}
                  >
                    GRAND TOTAL:
                  </h5>
                  <h4
                    className="m-0 text-success fw-bold"
                    style={{
                      fontFamily: "var(--oswald-font)",
                      fontSize: "1.7rem",
                    }}
                  >
                    ₹{finalPayable}
                  </h4>
                </div>

                <button
                  className="btn btn-danger w-100 py-3 fw-bold"
                  onClick={handleProceedToCheckout}
                  style={{
                    background: "red",
                    borderRadius: "4px",
                    fontFamily: "var(--oswald-font)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {!isAuthenticated
                    ? "LOGIN TO CHECKOUT"
                    : `PROCEED TO CHECKOUT (₹${finalPayable})`}
                </button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default CartDrawer;
