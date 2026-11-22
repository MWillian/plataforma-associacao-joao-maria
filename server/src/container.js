import { ClassController } from './controllers/class.controller.js';
import { NewsController } from './controllers/news.controller.js';
import { NoticeController } from './controllers/notice.controller.js';
import { ProductController } from './controllers/product.controller.js';
import { StudentController } from './controllers/student.controller.js';
import { ClassRepository } from './repositories/class.repository.js';
import { NewsRepository } from './repositories/news.repository.js';
import { NoticeRepository } from './repositories/notice.repository.js';
import { ProductRepository } from './repositories/product.repository.js';
import { StudentRepository } from './repositories/student.repository.js';
import { ClassService } from './services/class.service.js';
import {
  isEmailConfigured,
  sendNoticeEmail,
} from './services/email.service.js';
import { NewsService } from './services/news.service.js';
import { NoticeService } from './services/notice.service.js';
import { ProductService } from './services/product.service.js';
import { StudentService } from './services/student.service.js';

const productRepository = new ProductRepository();
const productService = new ProductService(
  productRepository,
);
const productController = new ProductController(
  productService,
);

const classRepository = new ClassRepository();
const classService = new ClassService(classRepository);
const classController = new ClassController(classService);

const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const studentController = new StudentController(studentService);

const newsController = new NewsController(
  new NewsService(new NewsRepository()),
);

const noticeController = new NoticeController(
  new NoticeService(new NoticeRepository(), {
    sendEmail: sendNoticeEmail,
    isEmailConfigured,
  }),
);

export {
  classController,
  newsController,
  noticeController,
  productController,
  studentController,
};
