export class NoticeController {
  constructor(noticeService) {
    this.noticeService = noticeService;
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
    this.remove = this.remove.bind(this);
  }

  async list(_req, res, next) {
    try {
      return res.status(200).json(await this.noticeService.list());
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const notice = await this.noticeService.create(
        req.auth.userId,
        req.body ?? {},
      );

      return res.status(201).json(notice);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const notice = await this.noticeService.remove(req.params.id);

      return res.status(200).json(notice);
    } catch (error) {
      return next(error);
    }
  }
}
