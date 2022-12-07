import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Layout } from 'antd';
import './App.css';
import { Card,  Col, Row } from 'antd';
import {Pagination} from 'antd'
const { Header, Footer, Sider, Content } = Layout;

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail:string,
}

export interface IPagination{
  total:number, limit:number, page:number
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

function Product({ product }: { product: IProduct }) {
  return (
    <Card title={product.name} hoverable
      cover={<img height="240" alt={product.name} src={product.thumbnail} />}
    >
      <p>{product.description}</p>
      <p>${product.price}</p>
    </Card>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const page = 1;
  const limit = 6;
  const [pagination, setPagination] = useState({total:0, limit:6, page:1});

  useEffect(() => {
    let skip = (page - 1) * limit;

    fetch(`https://dummyjson.com/products/?skip=${skip}&limit=${limit}`)
      .then(response => response.json())
      .then(data => {
        //console.log(data);
        setProducts(data.products);
        setPagination({
          total: data.total,
          limit: data.limit,
          page: (data.skip / data.limit) + 1
        })
      });
  }, []);

  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content><Products products={products} pagination={pagination} /></Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>

  );
}


export default App;
