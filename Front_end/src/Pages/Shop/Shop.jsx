import "react";
import Layout from "../../Components/Layouts/Layout";
import Section5 from "../Home/Section5";

function Shop() {
  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>Burger Shop App</h1>
          <p>Order online via mobile and grab exclusive 20% discounts!</p>
        </div>
      </div>
      <Section5 />
    </Layout>
  );
}

export default Shop;
