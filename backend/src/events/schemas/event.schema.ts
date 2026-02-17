import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EventCategory {
  WORKSHOP = 'workshop',
  MEETUP = 'meetup',
  TALK = 'talk',
  SOCIAL = 'social',
}

export enum EventStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, enum: EventCategory })
  category: EventCategory;

  @Prop({ required: true })
  organizer: string;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
