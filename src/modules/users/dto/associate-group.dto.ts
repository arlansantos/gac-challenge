import { IsUUID } from 'class-validator';

export class AssociateGroupDto {
  @IsUUID()
  groupId: string;
}
