export class NoticeController {
  constructor(noticeService) {
    this.noticeService = noticeService;
    this.list = this.list.bind(this);
    this.create = this.create.bind(this);
<<<<<<< HEAD
    this.send = this.send.bind(this);
=======
>>>>>>> origin/main
    this.remove = this.remove.bind(this);
  }

  async list(_req, res, next) {
<<<<<<< HEAD
    try { return res.status(200).json(await this.noticeService.list()); }
    catch (error) { return next(error); }
=======
    try {
      return res.status(200).json(await this.noticeService.list());
    } catch (error) {
      return next(error);
    }
>>>>>>> origin/main
  }

  async create(req, res, next) {
    try {
<<<<<<< HEAD
      return res.status(201).json(await this.noticeService.create(req.auth.userId, req.body ?? {}));
    } catch (error) { return next(error); }
  }

  async send(req, res, next) {
    try {
      return res.status(200).json(await this.noticeService.send(req.params.id));
    } catch (error) { return next(error); }
=======
      const notice = await this.noticeService.create(
        req.auth.userId,
        req.body ?? {},
      );

      return res.status(201).json(notice);
    } catch (error) {
      return next(error);
    }
>>>>>>> origin/main
  }

  async remove(req, res, next) {
    try {
<<<<<<< HEAD
      await this.noticeService.remove(req.params.id);
      return res.status(204).send();
    } catch (error) { return next(error); }
=======
      const notice = await this.noticeService.remove(req.params.id);

      return res.status(200).json(notice);
    } catch (error) {
      return next(error);
    }
>>>>>>> origin/main
  }
}
