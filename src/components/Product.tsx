import * as React from 'react';
import { Card } from 'antd';
import { IProduct } from '../interface/IProduct';

export function Product({ product }: { product: IProduct; }) {
    return (
        <Card
            style={{ margin: 4 }}
            hoverable
            cover={<img height="240" alt={product.title} src={product.thumbnail} />}
        >
            <p>
                {product.title} | ${product.price}
            </p>
        </Card>
    );
}
