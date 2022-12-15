import * as React from 'react';
import { useEffect } from 'react';
import { List } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IStoreState } from "../interface/IStoreState";

export function Categories({ selected = null }: { selected: string | null; }) {
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
        <List
            header={<h1>Filter By Category</h1>}
            bordered
            dataSource={categories}
            // onSelect need to change selected category
            renderItem={(category) => (
                <List.Item>
                    <Link key={category} to={category !== 'ALL' ? `/category/${category}` : '/'}>
                        {category === selected ? (
                            <strong>{category}</strong>
                        ) : (
                            <span>{category}</span>
                        )}
                    </Link>
                </List.Item>
            )} />
    );
}
