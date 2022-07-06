import { Request, Response } from 'express';
import CreateProductSevice from '../services/CreateProductService';
import DeleteProductSevice from '../services/DeleteProductService';
import ListProductSevice from '../services/ListProductService';
import ShowProductSevice from '../services/ShowProductServer';
import UpdateProductSevice from '../services/UpdateProductService';

export default class ProductsController {
  public async index(req: Request, res: Response) {
    const listProducts = new ListProductSevice();

    const product = await listProducts.execute();

    return res.json(product);
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    const showProduct = new ShowProductSevice();

    const product = await showProduct.execute({ id });

    return res.json(product);
  }

  public async create(req: Request, res: Response) {
    const { name, price, quantity } = req.body;

    const CreateProduct = new CreateProductSevice();

    const product = await CreateProduct.execute({
      name,
      price,
      quantity,
    });

    return res.json(product);
  }

  public async update(req: Request, res: Response) {
    const { name, price, quantity } = req.body;
    const { id } = req.params;
    const updateProduct = new UpdateProductSevice();

    const product = await updateProduct.execute({
      id,
      name,
      price,
      quantity,
    });
    return res.json(product);
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    const deleteProduct = new DeleteProductSevice();

    const product = await deleteProduct.execute({ id });

    return res.json([]);
  }
}
