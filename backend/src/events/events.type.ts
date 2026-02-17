import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EventCategory, EventStatus } from './schemas/event.schema';

registerEnumType(EventCategory, { name: 'EventCategory' });
registerEnumType(EventStatus, { name: 'EventStatus' });

@ObjectType()
export class EventType {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field()
  location: string;

  @Field(() => EventCategory)
  category: EventCategory;

  @Field()
  organizer: string;

  @Field(() => EventStatus)
  status: EventStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
