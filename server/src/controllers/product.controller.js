export class ProductController {
  constructor(productService) {
    this.productService = productService;
    this.listHighlights =
      this.listHighlights.bind(this);
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.inactivate = this.inactivate.bind(this);
    this.activate = this.activate.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async listHighlights(req, res, next) {
    try {
      const result =
        await this.productService.listHighlights(
          req.query ?? {},
        );

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await this.productService.list(
        req.query ?? {},
      );

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
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

  async remove(req, res, next) {
    try {
      await this.productService.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const product = await this.productService.activate(
        req.params.id,
      );

      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await this.productService.update(
        req.params.id,
        req.body ?? {},
      );

      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }
}
