import { IProduct } from "./IProduct";
import { ICategoryPage } from '../store';

export type IStoreState = {
    products: IProduct[];
    categorized: ICategoryPage[];
    categories: string[];
};
