import { Controller, Get, ParseBoolPipe, Query } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { CategoryService } from 'src/category/category.service';
import { TreeLevel } from 'src/category/enums/tree-level.enum';
import { TreeLevelPipe } from 'src/category/pipes/tree-level.pipe';

@Controller('category/trees')
export class TreesController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findTreeByLevel(
    @Query('level', TreeLevelPipe) level: TreeLevel,
    @Query('categoryId')
    categoryId: string,
    @Query('format', ParseBoolPipe) format?: boolean,
  ) {
    switch (level) {
      case TreeLevel.ancestors:
        return await this.categoryService.findCategoryAncestors(
          categoryId,
          format,
        );
      case TreeLevel.descendants:
        return await this.categoryService.findCategoryDescendants(
          categoryId,
          format,
        );
    }
  }

  @Get()
  @Roles(Role.USER)
  async findAllTrees() {
    return this.categoryService.findAllCategoryTrees();
  }
}
