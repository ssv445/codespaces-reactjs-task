import * as React from 'react';
import { Col, Row, Pagination } from 'antd';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';
import { IProduct } from '../interface/IProduct';
import { Product } from '../components/Product';
import { Categories } from '../components/Categories';

import { IStoreState } from '../interface/IStoreState';

const { Sider, Content } = Layout;


export function ProductsPage({
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
        (state: IStoreState) => state.categorized[selectedCategory]?.pages[page] ?? []
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
                        showTotal={(total, range) => `Total ${total} items`} />
                </Row>
            </Content>
        </>
    );
}
