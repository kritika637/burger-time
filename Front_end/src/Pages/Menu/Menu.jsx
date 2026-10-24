import Layout from "../../Components/Layouts/Layout";
import Section3 from "../Home/Section3";

function Menu() {
  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>Our Menu</h1>
          <p>Freshly ground beef, crispy chicken, and vegan delights.</p>
        </div>
      </div>

      <Section3 isMenuPage={true} />
    </Layout>
  );
}

export default Menu;
