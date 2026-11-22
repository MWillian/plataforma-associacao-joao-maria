import { ClassController } from './controllers/class.controller.js';
import { ProductController } from './controllers/product.controller.js';
import { StudentController } from './controllers/student.controller.js';
import { ClassRepository } from './repositories/class.repository.js';
import { ProductRepository } from './repositories/product.repository.js';
import { StudentRepository } from './repositories/student.repository.js';
import { ClassService } from './services/class.service.js';
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

export {
  classController,
  productController,
  studentController,
};
