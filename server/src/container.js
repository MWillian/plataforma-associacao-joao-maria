import { ClassController } from './controllers/class.controller.js';
import { ProductController } from './controllers/product.controller.js';
import { ClassRepository } from './repositories/class.repository.js';
import { ProductRepository } from './repositories/product.repository.js';
import { ClassService } from './services/class.service.js';
import { ProductService } from './services/product.service.js';

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

export { classController, productController };
