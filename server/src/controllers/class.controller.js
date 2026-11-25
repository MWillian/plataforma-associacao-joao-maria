export class ClassController {
  constructor(classService) {
    this.classService = classService;
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async list(_req, res, next) {
    try {
      const classes = await this.classService.list();

      return res.status(200).json(classes);
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const danceClass = await this.classService.create(
        req.body ?? {},
      );

      return res.status(201).json(danceClass);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const danceClass = await this.classService.update(
        req.params.id,
        req.body ?? {},
      );

      return res.status(200).json(danceClass);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await this.classService.remove(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
