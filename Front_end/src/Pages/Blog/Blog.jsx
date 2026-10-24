import Layout from "../../Components/Layouts/Layout";
import Section6 from "../Home/Section6";

function Blog() {
  return (
    <Layout>
      <div className="inner_page_banner">
        <div className="banner_content">
          <h1>Customer Stories</h1>
          <p>What our foodies say about their favorite meals.</p>
        </div>
      </div>
      <Section6 />
    </Layout>
  );
}

export default Blog;
