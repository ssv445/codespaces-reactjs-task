import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ProductsPage } from './ProductsPage';

export function CategoryPage() {
  let { categoryId } = useParams<'categoryId'>();
  console.log('categoryId:', categoryId);
  // let category = categoryId.toString();
  return <ProductsPage selectedCategory={categoryId}></ProductsPage>;
}
