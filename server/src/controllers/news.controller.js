export class NewsController {
  constructor(newsService) {
    this.newsService = newsService;
    this.list = this.list.bind(this);
<<<<<<< HEAD
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
=======
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.unpublish = this.unpublish.bind(this);
  }

  async list(_req, res, next) {
    try {
      return res.status(200).json(await this.newsService.list());
    } catch (error) {
      return next(error);
    }
>>>>>>> origin/main
  }

  async create(req, res, next) {
    try {
<<<<<<< HEAD
      return res.status(201).json(await this.newsService.create(req.body ?? {}));
    } catch (error) { return next(error); }
=======
      const news = await this.newsService.create(req.body ?? {});

      return res.status(201).json(news);
    } catch (error) {
      return next(error);
    }
>>>>>>> origin/main
  }

  async update(req, res, next) {
    try {
<<<<<<< HEAD
      return res.status(200).json(await this.newsService.update(req.params.id, req.body ?? {}));
    } catch (error) { return next(error); }
  }

  async inactivate(req, res, next) {
    try {
      return res.status(200).json(await this.newsService.inactivate(req.params.id));
    } catch (error) { return next(error); }
=======
      const news = await this.newsService.update(
        req.params.id,
        req.body ?? {},
      );

      return res.status(200).json(news);
    } catch (error) {
      return next(error);
    }
  }

  async unpublish(req, res, next) {
    try {
      const news = await this.newsService.unpublish(req.params.id);

      return res.status(200).json(news);
    } catch (error) {
      return next(error);
    }
>>>>>>> origin/main
  }
}
