import { IProduct } from './IProduct';


export type ICategoryPage = {
  total: number;
  limit: number;
  pages: IProduct[];
  page: number
};
