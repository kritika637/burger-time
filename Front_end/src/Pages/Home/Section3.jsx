import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import menuData from "../../menuData.json";
import Cards from "../../Components/Layouts/Cards";

import { FaLayerGroup, FaHamburger } from "react-icons/fa";
import { GiFrenchFries, GiSodaCan, GiMeal } from "react-icons/gi";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i
        key={i}
        className={`bi ${i <= Math.floor(rating) ? "bi-star-fill" : "bi-star"} text-warning me-1`}
      ></i>,
    );
  }
  return stars;
};

const categories = [
  { id: "all", name: "All Feast", icon: <FaLayerGroup /> },
  { id: "burger", name: "Burgers", icon: <FaHamburger /> },
  { id: "sides", name: "Fries & Sides", icon: <GiFrenchFries /> },
  { id: "beverages", name: "Drinks & Dips", icon: <GiSodaCan /> },
  { id: "combos", name: "Value Combos", icon: <GiMeal /> },
];

function Section3({ isMenuPage = false }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";
  const vegFilter = searchParams.get("diet") || "all";

  const updateFilters = (newCategory, newDiet) => {
    setSearchParams({
      category: newCategory || selectedCategory,
      diet: newDiet || vegFilter,
    });
  };

  const filteredItems = menuData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "burger" &&
        (item.category === "veg-burger" ||
          item.category === "nonveg-burger")) ||
      item.category === selectedCategory ||
      (selectedCategory === "beverages" && item.category === "beverages");

    let matchesDiet = true;
    const searchText = `${item.title} ${item.desc}`.toLowerCase();
    const isItemNonVeg =
      item.category === "nonveg-burger" ||
      searchText.includes("chicken") ||
      searchText.includes("mutton") ||
      searchText.includes("egg") ||
      searchText.includes("fish") ||
      searchText.includes("bacon") ||
      searchText.includes("pepperoni");

    if (vegFilter === "veg") matchesDiet = !isItemNonVeg;
    else if (vegFilter === "non-veg") matchesDiet = isItemNonVeg;

    return matchesCategory && matchesDiet;
  });

  const visibleItems = isMenuPage ? filteredItems : filteredItems.slice(0, 8);

  return (
    <section className="menu_section py-5">
      <Container>
        {!isMenuPage && (
          <Row className="text-center mb-4">
            <Col>
              <h2
                style={{
                  fontFamily: "var(--lilita-font)",
                  fontSize: "2.8rem",
                  color: "var(--bg-coffee)",
                }}
              >
                OUR CRAZY BURGERS & SIDES
              </h2>
            </Col>
          </Row>
        )}

        {/* Category Carousel */}
        <div className="category_carousel_container d-flex align-items-center justify-content-center gap-3 mb-4 pb-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters(cat.id, vegFilter)}
              className="d-flex align-items-center gap-2 py-2 px-4 border-0 shadow-sm"
              style={{
                background:
                  selectedCategory === cat.id ? "var(--bg-coffee)" : "#fff",
                color:
                  selectedCategory === cat.id ? "#fff" : "var(--light-black)",
                fontWeight: "700",
                borderRadius: "25px",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Diet Toggle */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button
            onClick={() =>
              updateFilters(
                selectedCategory,
                vegFilter === "veg" ? "all" : "veg",
              )
            }
            className="btn d-flex align-items-center gap-2 px-3 py-1.5 fw-bold"
            style={{
              border: "2px solid #28a745",
              background: vegFilter === "veg" ? "#28a745" : "transparent",
              color: vegFilter === "veg" ? "#fff" : "#28a745",
              borderRadius: "20px",
            }}
          >
            VEG ONLY
          </button>
          <button
            onClick={() =>
              updateFilters(
                selectedCategory,
                vegFilter === "non-veg" ? "all" : "non-veg",
              )
            }
            className="btn d-flex align-items-center gap-2 px-3 py-1.5 fw-bold"
            style={{
              border: "2px solid #dc3545",
              background: vegFilter === "non-veg" ? "#dc3545" : "transparent",
              color: vegFilter === "non-veg" ? "#fff" : "#dc3545",
              borderRadius: "20px",
            }}
          >
            NON-VEG ONLY
          </button>
        </div>

        {/* Grid */}
        <Row className="gy-4">
          {visibleItems.length > 0 ? (
            visibleItems.map((product) => (
              <Cards
                key={product.id}
                {...product}
                paragraph={product.desc}
                renderRatingIcons={renderStars}
              />
            ))
          ) : (
            <Col className="text-center py-5">
              <h4>No items found.</h4>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
}

export default Section3;
