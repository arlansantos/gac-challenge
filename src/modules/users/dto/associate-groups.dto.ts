import { IsArray, IsUUID } from 'class-validator';

export class AssociateGroupsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  groups: string[];
}
