import * as React from 'react';
import { Layout } from 'antd';
import { useLocation, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';
import { ProductDetails } from './pages/ProductDetails';
import { ProductModal } from './pages/ProductModal';
import { NoMatch } from './pages/NoMatch';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';

function App() {
  let location = useLocation();
  let state = location.state as { backgroundLocation?: Location };

  return (
    <Provider store={store}>
      <Layout>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/">
            <Route index element={<ProductsPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>

        {state?.backgroundLocation && (
          <Routes>
            <Route path="/products/:productId" element={<ProductModal />} />
          </Routes>
        )}
      </Layout>
    </Provider>
  );
}

export default App;
