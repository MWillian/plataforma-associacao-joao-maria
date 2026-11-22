export class NewsController {
  constructor(newsService) {
    this.newsService = newsService;
    this.list = this.list.bind(this);
    this.listHighlights = this.listHighlights.bind(this);
    this.findById = this.findById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.inactivate = this.inactivate.bind(this);
  }

  async list(req, res, next) {
    try {
      const result = await this.newsService.list(req.query);
      return res.status(200).json(result);
    } catch (error) { return next(error); }
  }

  async listHighlights(req, res, next) {
    try {
      return res.status(200).json(await this.newsService.listHighlights(req.query));
    } catch (error) { return next(error); }
  }

  async findById(req, res, next) {
    try {
      return res.status(200).json(await this.newsService.findById(req.params.id));
    } catch (error) { return next(error); }
  }

  async create(req, res, next) {
    try {
      return res.status(201).json(await this.newsService.create(req.body ?? {}));
    } catch (error) { return next(error); }
  }

  async update(req, res, next) {
    try {
      return res.status(200).json(await this.newsService.update(req.params.id, req.body ?? {}));
    } catch (error) { return next(error); }
  }

  async inactivate(req, res, next) {
    try {
      return res.status(200).json(await this.newsService.inactivate(req.params.id));
    } catch (error) { return next(error); }
  }
}
