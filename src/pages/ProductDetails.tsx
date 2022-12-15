import * as React from 'react';
import { useEffect } from 'react';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IStoreState } from "../interface/IStoreState";

export function ProductDetails() {
    let { productId } = useParams<'productId'>();
    const product = useSelector((state: IStoreState) => productId ? state.products[productId] ?? null : null
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
