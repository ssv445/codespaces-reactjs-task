import * as React from 'react';

import { useEffect, useState } from 'react';
import { Card, Col, Row, List, Pagination, Modal, Layout } from 'antd';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { IStoreState, store } from './store';
import './App.css';

const { Sider, Content } = Layout;

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  brand: string;
  stock: number;
}

export interface IPagination {
  total: number;
  limit: number;
  page: number;
}

function CategoryPage() {
  let { categoryId } = useParams<'categoryId'>();
  console.log('categoryId:', categoryId);
  // let category = categoryId.toString();
  return <ProductsPage selectedCategory={categoryId}></ProductsPage>;
}

function ProductsPage({
  selectedCategory = 'ALL',
}: {
  selectedCategory?: string;
}) {
  let location = useLocation();
  console.log('selectedCategory:', selectedCategory);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 6;

  const [pagination, setPagination] = useState({ total: 0, limit: 6, page: 1 });
  const products = useSelector(
    (state: IStoreState) =>
      state.categorized[selectedCategory]?.pages[page] ?? []
  );
  const dispatch = useDispatch();

  function doSetPage(pageNo) {
    let newSearchParams = searchParams;
    newSearchParams.set('page', pageNo);
    setSearchParams(newSearchParams);
  }

  const shouldFetchProducts = products.length === 0;
  useEffect(() => {
    let skip = (page - 1) * limit;
    let url = 'https://dummyjson.com/products';
    if (selectedCategory !== 'ALL') {
      url = 'https://dummyjson.com/products/category/' + selectedCategory;
    }

    if (shouldFetchProducts) {
      // console.log('fetching product list page',page,selectedCategory, products);

      fetch(`${url}?skip=${skip}&limit=${limit}`)
        .then((response) => response.json())
        .then((data) => {
          //sometime page
          dispatch({
            type: 'ADD_CATEGORY_PRODUCT_PAGE',
            category: selectedCategory,
            products: data.products,
            total: data.total,
            per_page: data.limit,
            page: page,
          });

          setPagination({
            total: data.total,
            limit: data.limit,
            page: data.skip / data.limit + 1,
          });
        });
    }
  }, [page, selectedCategory, dispatch, shouldFetchProducts]);

  return (
    <>
      <Sider theme="light">
        <Categories selected={selectedCategory}></Categories>
      </Sider>
      <Content>
        <Row gutter={8}>
          {products.map((product: IProduct) => (
            <Col key={product.id} span={8}>
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                state={{ backgroundLocation: location }}
              >
                <Product key={product.id} product={product} />
              </Link>
            </Col>
          ))}
        </Row>
        <Row>
          {/* onChange=PENDING */}
          <Pagination
            onChange={(page) => doSetPage(page)}
            defaultCurrent={pagination.page}
            total={pagination.total}
            showSizeChanger={false}
            defaultPageSize={pagination.limit}
            showTotal={(total, range) => `Total ${total} items`}
          />
        </Row>
      </Content>
    </>
  );
}

function Categories({ selected = null }: { selected: string | null }) {
  const categories: string[] = useSelector(
    (state: IStoreState) => state.categories
  );
  const dispatch = useDispatch();
  const shouldFetchCategories = categories.length === 0;

  useEffect(() => {
    if (shouldFetchCategories) {
      console.log('fetching categories');
      fetch(`https://dummyjson.com/products/categories`)
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: 'SET_CATEGORIES',
            categories: ['ALL', ...data],
          });
        });
    }
  }, [shouldFetchCategories, dispatch]);

  // function doCategorySelect(category: string) {
  //   let newSearchParams = searchParams;
  //   newSearchParams.set('category', category);
  //   newSearchParams.set('page', '1'); // reset to first page
  //   setSearchParams(newSearchParams);
  // }
  return (
    <div>
      <List
        header={<h1>Filter By Category</h1>}
        bordered
        dataSource={categories}
        // onSelect need to change selected category
        renderItem={(category) => (
          <List.Item>
            <Link key={category} to={`/category/${category}`}>
              {category === selected ? (
                <strong>{category}</strong>
              ) : (
                <>{category}</>
              )}
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
}

function Product({ product }: { product: IProduct }) {
  return (
    <Card
      hoverable
      cover={<img height="240" alt={product.title} src={product.thumbnail} />}
    >
      <p>
        {product.title} | ${product.price}
      </p>
    </Card>
  );
}

function ProductDetails() {
  let { productId } = useParams<'productId'>();
  const product = useSelector((state: IStoreState) =>
    productId ? state.products[productId] ?? null : null
  );

  const dispatch = useDispatch();
  const shouldFetchProduct = !product || product.id !== productId;
  useEffect(() => {
    if (shouldFetchProduct) {
      fetch(`https://dummyjson.com/products/${productId}`)
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: 'ADD_PRODUCT',
            product: data,
          });
        });
    }
  }, [productId, shouldFetchProduct, dispatch]);

  if (!product) {
    return <div>Product Not Found</div>;
  }
  return (
    <Card
      hoverable
      cover={<img height="240" alt={product.title} src={product.thumbnail} />}
    >
      <p>{product.title} </p>
      <p>{product.description} </p>
      <p>${product.price}</p>
      <p>
        {product.brand} | {product.stock}
      </p>
    </Card>
  );
}
function ProductModal() {
  let navigate = useNavigate();
  const [open, setOpen] = useState(true);
  let { productId } = useParams<'productId'>();

  function closeModal() {
    setOpen(false);
    navigate(-1);
  }
  useEffect(() => {
    setOpen(true);
  }, [productId]);

  return (
    <Modal
      centered
      open={open}
      onOk={() => closeModal()}
      onCancel={() => closeModal()}
    >
      <ProductDetails></ProductDetails>
    </Modal>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home </Link>
      </p>
    </div>
  );
}

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
