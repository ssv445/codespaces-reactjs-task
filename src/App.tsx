import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Layout } from 'antd';
import './App.css';
import { Card,  Col, Row, List } from 'antd';
import {Pagination} from 'antd'
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

function Products({ products, pagination }: {products:IProduct[], pagination:IPagination}) {
  return (
    <div>
    <Row gutter={8}>
      {products.map(product => (
        <Col span={8}>
          <Product key={product.id} product={product} />
        </Col>
      ))}
    </Row>
      <Row>
        {/* onChange=PENDING */}
        <Pagination  defaultCurrent={pagination.page} total={pagination.total} showSizeChanger={ false} />
    </Row>
    </div>
  );
}

function Categories({ categories, selected=null }: {categories:string[], selected:string|null}) {
  return (
    <div>
      <List
      header={<h1>Filter By Category</h1>}
      bordered
        dataSource={categories}
        // onSelect need to change selected category
      renderItem={category => (
        <List.Item>
          {category}
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

function ProductModal({ product }: { product: IProduct }) {
  return (
    <Card hoverable
      cover={<img height="240" alt={product.title} src={product.thumbnail} />}
    >
      <p>{product.title} </p>
      <p>{product.description} </p>
      <p>${product.price}</p>
      <p>{product.brand} | { product.stock}</p>
    </Card>
  );
}

function App() {
  const page = 1;
  const limit = 6;
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 6, page: 1 });
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    let skip = (page - 1) * limit;

    fetch(`https://dummyjson.com/products/?skip=${skip}&limit=${limit}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.products);
        setProducts(data.products);
        setPagination({
          total: data.total,
          limit: data.limit,
          page: (data.skip / data.limit) + 1
        })

        let cats = data.products.map((product: IProduct) => (product.category))
          .filter((v:string, i:number, a:string[]) => (a.indexOf(v) == i) );
        setCategories(cats);
      });
  }, []);

  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider         theme="light"><Categories categories={ categories} selected={null}></Categories></Sider>
        <Content><Products products={products} pagination={pagination} /></Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>

  );
}


export default App;
