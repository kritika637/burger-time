import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import Layout from "../../Components/Layouts/Layout";
import "../../Styles/AuthStyle.css";

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  isDefault: false,
};

function Profile() {
  const {
    user,
    logout,
    updateProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getWishlist,
    toggleWishlist,
    getOrders,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [addresses, setAddresses] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    if (activeTab === "addresses") {
      getAddresses().then(setAddresses);
    } else if (activeTab === "wishlist") {
      getWishlist().then(setWishlistItems);
    } else if (activeTab === "orders") {
      getOrders().then(setOrders);
    }
  }, [activeTab, getAddresses, getWishlist, getOrders]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleProfileSave = async () => {
    const result = await updateProfile(profileData.name, profileData.phone);
    if (result.success) {
      showToast("Profile updated successfully!");
    } else {
      showToast(result.message || "Failed to update profile");
    }
  };

  const handleAddressSave = async () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zip
    ) {
      return;
    }
    const result = editingAddress
      ? await updateAddress(editingAddress.id, addressForm)
      : await addAddress(addressForm);
    if (!result.success) {
      showToast(result.message || "Failed to save address");
      return;
    }
    showToast(editingAddress ? "Address updated!" : "Address added!");
    const updated = await getAddresses();
    setAddresses(updated);
    setShowAddressModal(false);
    setEditingAddress(null);
    setAddressForm(emptyAddress);
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({ ...addr });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id) => {
    await deleteAddress(id);
    const updated = await getAddresses();
    setAddresses(updated);
    showToast("Address deleted!");
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
    const updated = await getAddresses();
    setAddresses(updated);
    showToast("Default address updated!");
  };

  const handleRemoveWishlist = async (id) => {
    await toggleWishlist(id);
    const updated = await getWishlist();
    setWishlistItems(updated);
    showToast("Removed from wishlist!");
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>My Account</h1>
          <p>Manage your profile, addresses, and wishlist.</p>
        </div>
      </div>

      <section className="profile_section">
        <Container>
          {toast.show && (
            <div className="auth_toast">
              <div className="alert alert-success alert-dismissible fade show shadow">
                {toast.message}
              </div>
            </div>
          )}

          <Row className="g-4">
            {/* Sidebar */}
            <Col lg={3} md={4}>
              <div className="profile_sidebar">
                <div className="profile_avatar">
                  {getInitials(user?.name)}
                </div>
                <h5>{user?.name}</h5>
                <p>{user?.email}</p>
                <div className="d-flex flex-column gap-1">
                  <div
                    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <i className="bi bi-person me-2"></i>My Profile
                  </div>
                  <div
                    className={`nav-link ${activeTab === "addresses" ? "active" : ""}`}
                    onClick={() => setActiveTab("addresses")}
                  >
                    <i className="bi bi-geo-alt me-2"></i>My Addresses
                  </div>
                  <div
                    className={`nav-link ${activeTab === "wishlist" ? "active" : ""}`}
                    onClick={() => setActiveTab("wishlist")}
                  >
                    <i className="bi bi-heart me-2"></i>Wishlist
                  </div>
                  <div
                    className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <i className="bi bi-receipt me-2"></i>My Orders
                  </div>
                  <div
                    className="nav-link text-danger"
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </div>
                </div>
              </div>
            </Col>

            {/* Content */}
            <Col lg={9} md={8}>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="profile_card">
                  <h5
                    style={{
                      fontFamily: "var(--lilita-font)",
                      color: "var(--bg-coffee)",
                      fontSize: "1.3rem",
                    }}
                  >
                    EDIT PROFILE
                  </h5>
                  <Form>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label className="fw-bold">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-bold">
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-bold">
                          Email (cannot change)
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={user?.email}
                          disabled
                        />
                      </Col>
                    </Row>
                    <button
                      type="button"
                      className="btn btn_red mt-4 px-4 py-2 fw-bold"
                      onClick={handleProfileSave}
                    >
                      SAVE CHANGES
                    </button>
                  </Form>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="profile_card">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5
                      className="mb-0"
                      style={{
                        fontFamily: "var(--lilita-font)",
                        color: "var(--bg-coffee)",
                        fontSize: "1.3rem",
                      }}
                    >
                      MY ADDRESSES
                    </h5>
                    <button
                      className="btn btn_red btn-sm px-3 py-2 fw-bold"
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressForm(emptyAddress);
                        setShowAddressModal(true);
                      }}
                    >
                      <i className="bi bi-plus-lg me-1"></i>ADD NEW
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-geo-alt display-1 mb-3 d-block"></i>
                      <h5>No addresses saved yet</h5>
                      <p>Add your first delivery address for faster checkout.</p>
                    </div>
                  ) : (
                    <Row className="g-3">
                      {addresses.map((addr) => (
                        <Col md={6} key={addr.id}>
                          <div
                            className={`address_card ${addr.isDefault ? "default" : ""}`}
                          >
                            <span
                              className={`address_label ${addr.label.toLowerCase()}`}
                            >
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="badge bg-success ms-2">
                                DEFAULT
                              </span>
                            )}
                            <h6 className="mt-2 mb-1">{addr.fullName}</h6>
                            <p className="mb-1 small text-muted">
                              {addr.address}, {addr.city}, {addr.state} -{" "}
                              {addr.zip}
                            </p>
                            <p className="small text-muted mb-2">
                              Phone: {addr.phone}
                            </p>
                            <div className="d-flex gap-2">
                              {!addr.isDefault && (
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handleSetDefault(addr.id)}
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditAddress(addr)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteAddress(addr.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div className="profile_card">
                  <h5
                    style={{
                      fontFamily: "var(--lilita-font)",
                      color: "var(--bg-coffee)",
                      fontSize: "1.3rem",
                    }}
                  >
                    MY WISHLIST
                  </h5>

                  {wishlistItems.length === 0 ? (
                    <div className="wishlist_empty">
                      <i className="bi bi-heart"></i>
                      <h5>Your wishlist is empty</h5>
                      <p>Save your favorite items for later!</p>
                      <Link to="/menu" className="btn btn_red px-4 py-2 fw-bold">
                        BROWSE MENU
                      </Link>
                    </div>
                  ) : (
                    <Row className="g-3 mt-2">
                      {wishlistItems.map((item) => (
                        <Col sm={6} lg={4} key={item.id}>
                          <div className="address_card">
                            <div className="d-flex align-items-start gap-3">
                              <img
                                src={item.menuItem?.image || item.image}
                                alt={item.menuItem?.title || item.title}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                              <div className="flex-grow-1">
                                <h6
                                  className="mb-1"
                                  style={{ fontFamily: "var(--oswald-font)" }}
                                >
                                  {item.menuItem?.title || item.title}
                                </h6>
                                <p className="mb-1 small text-muted">
                                  {(item.menuItem?.description || item.description || "")?.slice(0, 60)}...
                                </p>
                                <span
                                  className="fw-bold"
                                  style={{
                                    fontFamily: "var(--oswald-font)",
                                    color: "var(--light-red)",
                                  }}
                                >
                                  ₹{item.menuItem?.price || item.price}
                                </span>
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger mt-2 w-100"
                              onClick={() => handleRemoveWishlist(item.menuItem?.id || item.id)}
                            >
                              <i className="bi bi-heart-fill me-1"></i>Remove
                            </button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="profile_card">
                  <h5
                    style={{
                      fontFamily: "var(--lilita-font)",
                      color: "var(--bg-coffee)",
                      fontSize: "1.3rem",
                    }}
                  >
                    MY ORDERS
                  </h5>

                  {orders.length === 0 ? (
                    <div className="wishlist_empty">
                      <i className="bi bi-receipt"></i>
                      <h5>No orders yet</h5>
                      <p>Your order history will appear here.</p>
                      <Link to="/menu" className="btn btn_red px-4 py-2 fw-bold">
                        ORDER NOW
                      </Link>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="address_card"
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <span className="badge bg-success mb-1">
                                {order.orderStatus?.toUpperCase()}
                              </span>
                              <h6 className="mb-0">{order.orderId}</h6>
                            </div>
                            <small className="text-muted">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </small>
                          </div>
                          <div className="border-top pt-2 mt-2">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="d-flex justify-content-between small"
                              >
                                <span>
                                  {item.title} × {item.quantity}
                                </span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-top pt-2 mt-2 d-flex justify-content-between fw-bold">
                            <span>Total Paid:</span>
                            <span style={{ color: "var(--light-red)" }}>
                              ₹{order.total}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Address Modal */}
      <Modal
        show={showAddressModal}
        onHide={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: "var(--oswald-font)" }}>
            {editingAddress ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="fw-bold">Label</Form.Label>
                <Form.Select
                  value={addressForm.label}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, label: e.target.value })
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
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Phone number"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">Pincode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="110001"
                  value={addressForm.zip}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, zip: e.target.value })
                  }
                />
              </Col>
              <Col md={12}>
                <Form.Label className="fw-bold">
                  Full Address
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="House no., Street, Area"
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                />
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Set as default address"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      isDefault: e.target.checked,
                    })
                  }
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddressModal(false);
              setEditingAddress(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="fw-bold"
            onClick={handleAddressSave}
          >
            {editingAddress ? "UPDATE" : "SAVE"} ADDRESS
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default Profile;
