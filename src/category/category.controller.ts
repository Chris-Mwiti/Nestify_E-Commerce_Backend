import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { RoleGuard } from 'src/auth/auth-guard/role/role.guard';
import { AuthGuard } from 'src/auth/auth-guard/auth-guard.guard';

@Controller('category')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @Roles(Role.USER)
  async findAll() {
    return this.categoryService.findAllCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOneCategory(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoryService.removeCategory(id);
  }

}
