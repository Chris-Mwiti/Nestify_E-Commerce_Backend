import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository, TreeRepository } from 'typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
    private readonly recordIdService: RecordIdGeneratorService,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      /**
       * @logger
       */
      this.loggerService.log('Creating category...');

      //Check if a category exists
      const doesCategoryExist = await this.categoryRepository.findOneBy({
        categoryName: createCategoryDto["categoryName"]
      })
      if(doesCategoryExist) throw new BadRequestException("Category already exists");

      const categoryId = this.recordIdService.generate('CATEGORY');
      let categoryObj = this.categoryRepository.create(createCategoryDto);
      categoryObj.categoryId = categoryId;

      //Fetch the parent category if any exist and append it
      if ('parentId' in createCategoryDto) {
        const parentCategory = await this.categoryRepository.findOne({
          where: {
            categoryId: createCategoryDto['parentId'],
          },
        });
        categoryObj.parent = parentCategory;
      }

      const createResponse = await this.categoryRepository.save(categoryObj);
      return createResponse;
    } catch (createErr) {
      /**
       * @logger
       */
      this.loggerService.error(createErr.message);

      if(createErr instanceof BadRequestException) throw createErr
      throw new InternalServerErrorException('Error while creating category');
    }
  }

  async findAllCategories() {
    try {
      /**
       * @logger
       */
      this.loggerService.log('Fetching categories...');

      const categories = await this.categoryRepository.find();
      return categories;
    } catch (fetchErr) {
      /**
       * @logger
       */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException('Error while fetching categories');
    }
  }

  async findOneCategory(id: string) {
    try {
      /**
       * @logger
       */
      this.loggerService.log('Fetching category...');
      const category = await this.categoryRepository.findOneBy({
        categoryId: id,
      });
      if (!category) throw new BadRequestException('Category does not exist');
      return category;
    } catch (fetchErr) {
      /**
       * @logger
       */
      this.loggerService.error(fetchErr.message);
      if (fetchErr instanceof BadRequestException) {
        throw fetchErr;
      }
      throw new InternalServerErrorException(
        'Error while fetching category...',
      );
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      /**
       * @logger
       */
      this.loggerService.log('Updating category...');

      //Parent category update
      if ('parentId' in updateCategoryDto) {
        let currCategory = await this.categoryRepository.findOne({
          where: {
            categoryId: id,
          },
          relations: ['parent', 'children'],
        });

        const parentCategory = await this.categoryRepository.findOne({
          where: {
            categoryId: updateCategoryDto['parentId'],
          },
        });

        if (!currCategory || !parentCategory)
          throw new BadRequestException('Category does not exist...');
        currCategory.parent = parentCategory;

        const udpatedCategory =
          await this.categoryRepository.save(currCategory);
        return udpatedCategory;
      }

      //Normal category upadate
      const updatedCategory = this.categoryRepository.update(
        {
          categoryId: id,
        },
        updateCategoryDto,
      );
      return updatedCategory;
    } catch (updateErr) {
      /**
       * @logger
       */
      this.loggerService.error(updateErr.message);
      if (updateErr instanceof BadRequestException) throw updateErr;
      throw new InternalServerErrorException('Error while updating category');
    }
  }

  async removeCategory(id: string) {
    try {
      /**
       * @logger
       */
      this.loggerService.log('Removing category...');
      const doesCategoryExist = this.categoryRepository.findOne({
        where: {
          categoryId: id
        }
      })
      if(!doesCategoryExist) throw new BadRequestException("Category does not exist");
      const removedCategory = this.categoryRepository.softDelete(id)
      return removedCategory;
    } catch (updateErr) {
      /**
       * @logger
       */
      this.loggerService.error(updateErr.message);
      if(updateErr instanceof BadRequestException) throw updateErr;
      throw new InternalServerErrorException('Error while updating category');
    }
  }

  /**
   * @TreeRelatedQueries
   */

  async findAllCategoryTrees() {
    try {
      /**
       * @logger
       */
      this.loggerService.log('Fetching category trees...');
      const trees = await this.categoryRepository.find({
        select: ['parent', 'children'],
        relations: ['parent', 'children']
      });
      return trees;
    } catch (fetchError) {
      /**
       * @logger
       */
      this.loggerService.error(fetchError.message);
      throw new InternalServerErrorException(
        'Error while fetching category trees',
      );
    }
  }

  async findRootCategories() {
    try {
      /**
       * @logger
       */
      this.loggerService.log('Fetching root categories...');
      const rootCategories = await this.categoryRepository.find({
        where: {
          parent: null,
        },
      });
      return rootCategories;
    } catch (fetchError) {
      /**@logger */
      this.loggerService.error(fetchError.message);
      throw new InternalServerErrorException(
        'Error while fetching root categories...',
      );
    }
  }

  async findCategoryDescendants(categoryId: string, formatTree?: boolean) {
    try {
      const categoryDescendants = await this.categoryRepository.findOne({
        where: {
          categoryId: categoryId,
        },
        select: {
          children: true,
        },
        relations: ['children'],
      });

      if (formatTree) {
        return categoryDescendants;
      }

      if(!categoryDescendants) throw new BadRequestException("Category could not be found");

      const flatCategoryDescendants = categoryDescendants.children.map(category => category.categoryName);
      return flatCategoryDescendants;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException(
        'Error while fetching descendants tree',
      );
    }
  }

  async findCategoryAncestors(categoryId: string, formatTree?: boolean) {
    try {
      const categoryAncestors = await this.categoryRepository.findOne({
        where: {
          categoryId: categoryId,
        },
        relations: ['parent'],
        select: ['parent'],
      });

      if(!categoryAncestors) throw new BadRequestException("Category could not be found");

      if(!categoryAncestors.parent) return {};

      if (formatTree) return categoryAncestors;

      return categoryAncestors.parent.categoryName;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);

      if(fetchErr instanceof BadRequestException) throw fetchErr

      throw new InternalServerErrorException(
        'Error while fetching ancestors tree',
      );
    }
  }

  async findCategoriesIn(...categoryIds:string[]){
      try {
        /**@logger */
        this.loggerService.log('Fetching In categories')
        const categories = await this.categoryRepository.find({
          where:{
            categoryId: In(categoryIds)
          }
        })
        if (!categories) throw new BadRequestException('Categories not found');
        return categories;
      } catch (fetchErr) {
        /**@logger */
        this.loggerService.error(fetchErr.message);
        if(fetchErr instanceof BadRequestException) throw fetchErr;
        throw new InternalServerErrorException('Error while fetching categories')
      }
  }
}
