import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/AuthContext";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Menu from "./Pages/Menu/Menu";
import Shop from "./Pages/Shop/Shop";
import Blog from "./Pages/Blog/Blog";
import Contact from "./Pages/Contact/Contact";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Profile from "./Pages/Auth/Profile";
import Checkout from "./Pages/Checkout/Checkout";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
