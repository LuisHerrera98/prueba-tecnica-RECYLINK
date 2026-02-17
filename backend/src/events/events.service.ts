import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventCategory, EventStatus } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel(createEventDto);
    return event.save();
  }

  async findAll(category?: EventCategory, status?: EventStatus): Promise<Event[]> {
    const filter: Record<string, string> = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    return this.eventModel.find(filter).sort({ date: 1 }).exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event;
  }
}
