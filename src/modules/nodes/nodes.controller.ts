import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { NodesService } from './nodes.service';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get(':id/ancestors')
  async findAncestors(@Param('id', ParseUUIDPipe) id: string) {
    return await this.nodesService.findAncestors(id);
  }

  @Get(':id/descendants')
  async findDescendants(@Param('id', ParseUUIDPipe) id: string) {
    return await this.nodesService.findDescendants(id);
  }
}
