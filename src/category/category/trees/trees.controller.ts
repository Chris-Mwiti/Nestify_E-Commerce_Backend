import { Controller, Get, Logger, ParseBoolPipe, Query } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { CategoryService } from 'src/category/category.service';
import { TreeLevel } from 'src/category/enums/tree-level.enum';
import { TreeLevelPipe } from 'src/category/pipes/tree-level.pipe';

@Controller('category/trees')
export class TreesController {
  private logger:Logger = new Logger(TreesController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findTreeByLevel(
    @Query('level', TreeLevelPipe) level: string,
    @Query('categoryId')
    categoryId: string,
    @Query('format', ParseBoolPipe) format?: boolean,
  ) {
   if(level == TreeLevel.ancestors){
    return await this.categoryService.findCategoryAncestors(categoryId, format);
   }
   return await this.categoryService.findCategoryDescendants(categoryId,format);
  }

  @Get()
  @Roles(Role.USER)
  async findAllTrees() {
    return this.categoryService.findAllCategoryTrees();
  }
}
