import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventCategory, EventStatus } from '../schemas/event.schema';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsString()
  @IsOptional()
  organizer?: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}
