import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.createCollection(createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionsService.findAllCollections();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOneCollection(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionsService.updateCollection(id,updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionsService.removeCollection(id);
  }
}
