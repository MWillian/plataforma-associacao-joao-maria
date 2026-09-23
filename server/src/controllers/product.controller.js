export class ProductController {
  constructor(productService) {
    this.productService = productService;
    this.create = this.create.bind(this);
  }

  async create(req, res, next) {
    try {
      const product = await this.productService.create(
        req.body ?? {},
      );

      return res.status(201).json(product);
    } catch (error) {
      return next(error);
    }
  }
}
