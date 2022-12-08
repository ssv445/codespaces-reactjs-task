import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Layout } from 'antd';
import './App.css';
import { Card,  Col, Row, List } from 'antd';
import {Pagination} from 'antd'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {  Modal } from 'antd';
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch, Provider } from 'react-redux'
import {IStoreState, store} from './store';

const { Header, Footer, Sider, Content } = Layout;

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string,
  category: string,
  brand: string,
  stock:number
}

export interface IPagination{
  total: number,
  limit: number,
  page: number
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')|| '1');
  const limit = 6;
  const selectedCategory = searchParams.get('category') || 'ALL';
  const productId = parseInt(searchParams.get('productId') || '0') ;
  // const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 6, page: 1 });
  const products = useSelector((state:IStoreState) => state.categorized[selectedCategory]?.pages[page] ?? []);
  const dispatch = useDispatch();
  console.log('products list now is ', selectedCategory, page, products);

  function doProductSelect(productId) {
    let newSearchParams = searchParams;
    newSearchParams.set('productId',productId)
    setSearchParams(newSearchParams);
  }

  function doSetPage(pageNo) {
    let newSearchParams = searchParams;
    newSearchParams.set('page',pageNo)
    setSearchParams(newSearchParams);
  }


  useEffect(() => {
    let skip = (page - 1) * limit;

    let url = 'https://dummyjson.com/products/'
    if ( selectedCategory !== 'ALL') {
      url = 'https://dummyjson.com/products/category/' + selectedCategory;
    }

    fetch(`${url}?skip=${skip}&limit=${limit}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        dispatch({
          type: 'ADD_CATEGORY_PRODUCT_PAGE',
          category: selectedCategory,
          products: data.products,
          total: data.total,
          per_page: data.limit,
          page:page
        });

        setPagination({
          total: data.total,
          limit: data.limit,
          page: (data.skip / data.limit) + 1
        })


      });
  }, [page, selectedCategory, dispatch]);

   const productModal = productId ?  <ProductModal productId={productId}/> : <div></div>
  //const productModal = productId ?  <div>{productId}</div> : <div></div>

  return (
    <>
      <Sider theme="light">
      <Categories selected={selectedCategory}></Categories>

        </Sider>
        <Content>
      <Row gutter={8}>
      {products.map((product:IProduct) => (
        <Col span={8} onClick={() => { doProductSelect(product.id);  return false; }} >
          <Product key={product.id} product={product}  />
        </Col>
      ))}
      </Row>
      <Row>
        {/* onChange=PENDING */}
          <Pagination onChange={(page) => doSetPage(page)} defaultCurrent={pagination.page}
            total={pagination.total}
            showSizeChanger={false}       defaultPageSize={pagination.limit}

            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
  />
      </Row>
        {productModal}
                </Content>

    </>
  );
}

function Categories({ selected = null }: { selected: string | null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [categories, setCategories] = useState<string[]>([]);
  const categories: string[] = useSelector((state:IStoreState) => state.categories);
  const dispatch = useDispatch();
  //console.log('categories list now is ', categories);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/categories`)
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: 'SET_CATEGORIES',
          categories: ['ALL', ...data]
        });
      });
  }, [dispatch]);

   function doCategorySelect(category: string) {
    let newSearchParams = searchParams;
    newSearchParams.set('category',category)
    setSearchParams(newSearchParams);
  }
  return (
    <div>
      <List
      header={<h1>Filter By Category</h1>}
      bordered
      dataSource={categories}
        // onSelect need to change selected category
      renderItem={category => (
        <List.Item onClick={() => { doCategorySelect(category);  return false; }}>
          {category === selected ? (<strong>{category}</strong>) : (<>{category}</>)}
        </List.Item>
      )}
    />

    </div>
  );
}

function Product({ product }: { product: IProduct }) {
  return (
    <Card hoverable
      cover={<img height="240" alt={product.title} src={product.thumbnail} />}
    >
      <p>{product.title} | ${product.price}</p>
    </Card>
  );
}

function ProductModal({ productId }: { productId: number }) {
  const [open, setOpen] = useState(true);
  const [product, setProduct] = useState<IProduct>();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${productId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setProduct(data);
      });
        setOpen(true);

  }, [productId]);

  let productOrErrorCard = <div>Error</div>;

    if(product){
      productOrErrorCard = <Card hoverable
        cover={<img height="240" alt={product.title} src={product.thumbnail} />}
      >
        <p>{product.title} </p>
        <p>{product.description} </p>
        <p>${product.price}</p>
        <p>{product.brand} | {product.stock}</p>
      </Card>;
      }
  return (
    <>
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        {productOrErrorCard}
      </Modal>

    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/*",
    element: <ProductsPage />,
  },
]);


function App() {
  return (
    <Provider store={store}>
      <Layout>
      <Header>Header</Header>
      <Layout>
        <RouterProvider router={router} />

        </Layout>
      <Footer>Footer</Footer>
      </Layout>
    </Provider>
  );
}


export default App;
