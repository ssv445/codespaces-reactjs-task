import { IProduct } from './IProduct';
import { ICategoryPage } from "./ICategoryPage";

export type IStoreState = {
  products: IProduct[];
  categorized: ICategoryPage[];
  categories: string[];
};
