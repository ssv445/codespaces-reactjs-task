import { IProduct } from './IProduct';


export type ICategoryPage = {
  total: number;
  per_page: number;
  pages: IProduct[];
};
