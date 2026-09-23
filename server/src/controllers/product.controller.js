export class ProductController {
  constructor(productService) {
    this.productService = productService;
    this.create = this.create.bind(this);
    this.inactivate = this.inactivate.bind(this);
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

  async inactivate(req, res, next) {
    try {
      const product =
        await this.productService.inactivate(
          req.params.id,
        );

      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }
}
