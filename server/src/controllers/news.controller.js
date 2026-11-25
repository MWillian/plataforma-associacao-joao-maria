export class NewsController {
  constructor(newsService) {
    this.newsService = newsService;
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async list(_req, res, next) {
    try {
      return res.status(200).json(await this.newsService.list());
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const news = await this.newsService.create(req.body ?? {});

      return res.status(201).json(news);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const news = await this.newsService.update(
        req.params.id,
        req.body ?? {},
      );

      return res.status(200).json(news);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await this.newsService.remove(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
