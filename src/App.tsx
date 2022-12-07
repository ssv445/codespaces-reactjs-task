import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Layout } from 'antd';
import './App.css';
import { Card,  Col, Row } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail:string,
}

function Products({ products }: {products:IProduct[]}) {
  return (
    <Row gutter={8}>

      {products.map(product => (
        <Col span={8}>
          <Product key={product.id} product={product} />
        </Col>
      ))}
    </Row>
  );
}

function Product({ product }: { product: IProduct }) {
  return (
    <Card title={product.name} hoverable
      cover={<img height="240"  alt={product.name} src={product.thumbnail} />}
>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </Card>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const page = 1;
  const limit = 10;
  useEffect(() => {
    let skip = (page - 1) * limit;

    fetch(`https://dummyjson.com/products/?skip=${skip}&limit=${limit}`)
      .then(response => response.json())
      .then(data => setProducts(data.products));
  }, []);

  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content><Products products={products} /></Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>

  );
}


export default App;
