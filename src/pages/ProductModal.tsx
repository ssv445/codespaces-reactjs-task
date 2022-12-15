import * as React from 'react';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetails } from './ProductDetails';

export function ProductModal() {
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
