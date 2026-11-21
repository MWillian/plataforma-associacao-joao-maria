export class ClassController {
  constructor(classService) {
    this.classService = classService;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.inactivate = this.inactivate.bind(this);
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

  async inactivate(req, res, next) {
    try {
      const danceClass = await this.classService.inactivate(
        req.params.id,
      );

      return res.status(200).json(danceClass);
    } catch (error) {
      return next(error);
    }
  }
}
