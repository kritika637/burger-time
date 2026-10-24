import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../Context/useCart";
import { useAuth } from "../../Context/useAuth";
import { config } from "../../config";
import Layout from "../../Components/Layouts/Layout";
import "../../Styles/AuthStyle.css";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, getAddresses, addAddress, saveOrder } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [paying, setPaying] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "Home",
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });

  useEffect(() => {
    getAddresses().then((addrs) => {
      setAddresses(addrs);
      if (addrs.length > 0) {
        const defaultAddr = addrs.find((a) => a.isDefault);
        setSelectedAddressId((prev) => prev || defaultAddr?.id || addrs[0]?.id);
      }
    });
  }, [getAddresses]);

  const subTotal = getCartTotal();
  const deliveryCharge =
    subTotal > config.delivery.freeThreshold || subTotal === 0
      ? 0
      : config.delivery.fee;
  const gstTax = Math.round(subTotal * config.tax.gstRate);
  const total = subTotal + deliveryCharge + gstTax;

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zip
    ) {
      showToast("Please fill all address fields");
      return;
    }
    const result = await addAddress(newAddress);
    if (!result.success) {
      showToast(result.message || "Failed to add address");
      return;
    }
    const updated = await getAddresses();
    setAddresses(updated);
    if (updated.length > 0) {
      setSelectedAddressId(updated[updated.length - 1].id);
    }
    setShowNewAddress(false);
    setNewAddress({
      label: "Home",
      fullName: user?.name || "",
      phone: user?.phone || "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    showToast("Address added!", "success");
  };

  const handlePayment = async () => {
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) {
      showToast("Please select a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      showToast("Your cart is empty");
      return;
    }

    setPaying(true);
    try {
      // Mock payment: simulate gateway processing, no real money involved
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockPaymentId = `pay_mock_${Date.now()}`;

      const result = await saveOrder({
        addressId: selectedAddressId,
        paymentId: mockPaymentId,
      });
      if (result.success) {
        setPlacedOrder(result.order);
        clearCart();
        setOrderSuccess(true);
      } else {
        showToast(result.message || "Failed to place order");
      }
    } finally {
      setPaying(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    navigate("/menu");
    return null;
  }

  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>Checkout</h1>
          <p>Complete your order in a few steps.</p>
        </div>
      </div>

      <section className="checkout_section">
        <Container>
          {toast.show && (
            <div className="auth_toast">
              <div
                className={`alert ${toast.type === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show shadow`}
              >
                {toast.message}
              </div>
            </div>
          )}

          {orderSuccess ? (
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <div className="checkout_card text-center py-5">
                  <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ fontSize: "5rem" }}
                  ></i>
                  <h3
                    className="mt-3"
                    style={{
                      fontFamily: "var(--lilita-font)",
                      color: "var(--bg-coffee)",
                    }}
                  >
                    ORDER PLACED!
                  </h3>
                  <p className="text-muted mb-2">
                    Your order has been confirmed successfully.
                  </p>
                  <p className="fw-bold mb-4">
                    Order ID: <span className="text-danger">{placedOrder?.orderId}</span>
                  </p>
                  <p className="text-muted small mb-4">
                    Payment ID: {placedOrder?.paymentId}
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <Link
                      to="/"
                      className="btn btn_red px-4 py-2 fw-bold"
                    >
                      BACK TO HOME
                    </Link>
                    <Link
                      to="/profile"
                      className="btn btn-outline-dark px-4 py-2 fw-bold"
                    >
                      VIEW ORDERS
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="g-4">
              {/* Left: Address + Items */}
              <Col lg={7}>
                {/* Delivery Address */}
                <div className="checkout_card">
                  <h5>
                    <i className="bi bi-geo-alt me-2"></i>DELIVERY ADDRESS
                  </h5>

                  {addresses.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <p>No saved addresses. Add one below.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2 mb-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`address_option ${selectedAddressId === addr.id ? "selected" : ""}`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <div className="d-flex align-items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1"
                            />
                            <div>
                              <span
                                className={`address_label ${addr.label.toLowerCase()}`}
                              >
                                {addr.label}
                              </span>
                              <p className="mb-0 mt-1 small">
                                <strong>{addr.fullName}</strong> — {addr.phone}
                              </p>
                              <p className="mb-0 small text-muted">
                                {addr.address}, {addr.city}, {addr.state} -{" "}
                                {addr.zip}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="btn btn-outline-dark btn-sm fw-bold"
                    onClick={() => setShowNewAddress(true)}
                  >
                    <i className="bi bi-plus-lg me-1"></i>ADD NEW ADDRESS
                  </button>
                </div>

                {/* Order Items */}
                <div className="checkout_card">
                  <h5>
                    <i className="bi bi-bag me-2"></i>ORDER ITEMS (
                    {cartItems.length})
                  </h5>
                  {cartItems.map((item) => (
                    <div key={item.id} className="checkout_item">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div>
                          <h6
                            className="mb-0"
                            style={{ fontFamily: "var(--oswald-font)" }}
                          >
                            {item.title}
                          </h6>
                          <small className="text-muted">
                            ₹{item.price} × {item.quantity}
                          </small>
                        </div>
                      </div>
                      <span
                        className="fw-bold"
                        style={{ fontFamily: "var(--oswald-font)" }}
                      >
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </Col>

              {/* Right: Payment Summary */}
              <Col lg={5}>
                <div className="checkout_card" style={{ position: "sticky", top: "100px" }}>
                  <h5>
                    <i className="bi bi-receipt me-2"></i>PAYMENT SUMMARY
                  </h5>

                  <div className="order_summary_row">
                    <span>Subtotal</span>
                    <span>₹{subTotal}</span>
                  </div>
                  <div className="order_summary_row">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-success fw-bold">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  <div className="order_summary_row">
                    <span>GST (5%)</span>
                    <span>₹{gstTax}</span>
                  </div>
                  <div className="order_summary_row total">
                    <span>TOTAL</span>
                    <span>₹{total}</span>
                  </div>

                  <button
                    className="btn btn-danger w-100 py-3 fw-bold mt-4"
                    onClick={handlePayment}
                    disabled={paying}
                    style={{
                      background: "red",
                      borderRadius: "4px",
                      fontFamily: "var(--oswald-font)",
                      letterSpacing: "0.5px",
                      fontSize: "1.1rem",
                    }}
                  >
                    {paying ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing payment...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-2"></i>PAY ₹{total}
                      </>
                    )}
                  </button>

                  <p className="text-center text-muted small mt-3 mb-0">
                    <i className="bi bi-shield-check me-1"></i>
                    Demo payment — no real money charged
                  </p>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* New Address Modal */}
      <Modal
        show={showNewAddress}
        onHide={() => setShowNewAddress(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: "var(--oswald-font)" }}>
            ADD DELIVERY ADDRESS
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="fw-bold">Label</Form.Label>
                <Form.Select
                  value={newAddress.label}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, label: e.target.value })
                  }
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Receiver name"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Phone number"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">Pincode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="110001"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                />
              </Col>
              <Col md={12}>
                <Form.Label className="fw-bold">Full Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="House no., Street, Area"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Set as default address"
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: e.target.checked,
                    })
                  }
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewAddress(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="fw-bold" onClick={handleAddAddress}>
            SAVE ADDRESS
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default Checkout;
