import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { Event } from './schemas/event.schema';

describe('EventsService', () => {
  let service: EventsService;

  const mockEvents = [
    { title: 'Talk 1', category: 'talk', status: 'draft' },
    { title: 'Meetup 1', category: 'meetup', status: 'confirmed' },
    { title: 'Talk 2', category: 'talk', status: 'confirmed' },
  ];

  const mockEventModel = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvents),
      }),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockEvents[0]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getModelToken(Event.name), useValue: mockEventModel },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all events without filters', async () => {
      const result = await service.findAll();
      expect(mockEventModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockEvents);
    });

    it('should apply category filter', async () => {
      await service.findAll('talk' as any);
      expect(mockEventModel.find).toHaveBeenCalledWith({ category: 'talk' });
    });

    it('should apply both filters', async () => {
      await service.findAll('meetup' as any, 'confirmed' as any);
      expect(mockEventModel.find).toHaveBeenCalledWith({
        category: 'meetup',
        status: 'confirmed',
      });
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      const result = await service.findOne('some-id');
      expect(mockEventModel.findById).toHaveBeenCalledWith('some-id');
      expect(result).toEqual(mockEvents[0]);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockEventModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne('bad-id')).rejects.toThrow('Event bad-id not found');
    });
  });
});
