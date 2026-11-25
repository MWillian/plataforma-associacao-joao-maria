export class StudentController {
  constructor(studentService) {
    this.studentService = studentService;
    this.list = this.list.bind(this);
    this.listByClass = this.listByClass.bind(this);
    this.enroll = this.enroll.bind(this);
    this.unenroll = this.unenroll.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async list(_req, res, next) {
    try {
      const students = await this.studentService.list();

      return res.status(200).json(students);
    } catch (error) {
      return next(error);
    }
  }

  async listByClass(req, res, next) {
    try {
      const students = await this.studentService.listByClass(
        req.params.classId,
      );

      return res.status(200).json(students);
    } catch (error) {
      return next(error);
    }
  }

  async enroll(req, res, next) {
    try {
      const student = await this.studentService.enroll(
        req.params.classId,
        req.body ?? {},
      );

      return res.status(200).json(student);
    } catch (error) {
      return next(error);
    }
  }

  async unenroll(req, res, next) {
    try {
      const student = await this.studentService.unenroll(
        req.params.classId,
        req.params.studentId,
      );

      return res.status(200).json(student);
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const student = await this.studentService.create(
        req.body ?? {},
      );

      return res.status(201).json(student);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const student = await this.studentService.update(
        req.params.id,
        req.body ?? {},
      );

      return res.status(200).json(student);
    } catch (error) {
      return next(error);
    }
  }

  async remove(req, res, next) {
    try {
      await this.studentService.remove(req.params.id);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
