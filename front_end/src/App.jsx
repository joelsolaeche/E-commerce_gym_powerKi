import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductCatalog from './pages/ProductCatalog';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductManagement from './pages/ProductManagement';
import ProductAdminPage from './pages/ProductAdminPage';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/catalog" element={<ProductCatalog />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/product-management" element={<ProductAdminPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </Provider>
  );
}

export default App;
