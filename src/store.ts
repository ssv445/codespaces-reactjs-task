import { createStore } from 'redux';
import { IProduct } from './interface/IProduct';
import { IStoreState } from './interface/IStoreState';

export type ICategoryPage = {
  total: number;
  per_page: number;
  pages: IProduct[];
};

const initialState: IStoreState = {
  products: [], // product_id -> porduct
  categorized: [], // category_id -> category products in paginated
  categories: [],
};

function productReducer(state: IStoreState = initialState, action) {
  let newState: IStoreState;
  switch (action.type) {
    case 'ADD_PRODUCT':
      newState = { ...state };
      newState.products[action.product.id] = action.product;
      return newState;

    case 'ADD_CATEGORY_PRODUCT_PAGE':
      // add to specific category & page
      newState = { ...state };
      if (newState.categorized[action.category] === undefined) {
        newState.categorized[action.category] = {
          total: 0,
          per_page: 0,
          pages: [],
        };
      }
      newState.categorized[action.category].total = action.total;
      newState.categorized[action.category].per_page = action.per_page;
      newState.categorized[action.category].pages[action.page] =
        action.products;

      //add to product index as well
      action.products.forEach((product) => {
        newState.products[product.id] = product;
      });
      return newState;

    case 'SET_CATEGORIES':
      newState = { ...state };
      newState.categories = action.categories;
      //update all data
      return newState;

    default:
      return state;
  }
}

const store = createStore(productReducer);

export { store };
