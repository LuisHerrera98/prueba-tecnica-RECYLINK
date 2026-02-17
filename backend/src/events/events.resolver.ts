import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { EventType } from './events.type';
import { EventCategory, EventStatus } from './schemas/event.schema';

@Resolver(() => EventType)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [EventType], { name: 'events' })
  findAll(
    @Args('category', { type: () => EventCategory, nullable: true }) category?: EventCategory,
    @Args('status', { type: () => EventStatus, nullable: true }) status?: EventStatus,
  ) {
    return this.eventsService.findAll(category, status);
  }

  @Query(() => EventType, { name: 'event' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.eventsService.findOne(id);
  }
}
