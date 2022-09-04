import {
  BadRequestException,
  // CACHE_MANAGER,
  // Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
// import { Cache } from 'cache-manager';
import {
  CreateActivityDTO,
  QueryActivityDTO,
  UpdateActivityDTO,
} from './activity.dto';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly dataSource: DataSource, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: QueryActivityDTO) {
    // const key = `activity_all_${JSON.stringify(query)}`;
    // const cache: string = await this.cacheManager.get(key);
    // if (!cache) {
    const result = await this.activityRepository.findAndCount({
      select: ['id', 'title', 'created_at'],
      where: {
        email: query.email ? query.email : Not(IsNull()),
      },
      // order: {
      //   id: 'DESC',
      // },
      skip: query.skip,
      take: query.limit,
    });
    // await this.cacheManager.set(key, JSON.stringify(result), { ttl: 0 });
    return result;
    // }
    // return JSON.parse(cache);
  }

  async create(createActivity: CreateActivityDTO) {
    const activity = this.activityRepository.create(createActivity);
    return await this.activityRepository.save(activity);
    // await this.cacheManager.reset();
    // return savedActivity;
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Id is not a Number!');
    }
    // const key = `activity_single_${id}`;
    // const cache: string = await this.cacheManager.get(key);
    // if (!cache) {
    const activity = await this.dataSource
      .getRepository(Activity)
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.todo_items', 'todo_items')
      .select([
        'activity.id',
        'activity.title',
        'activity.email',
        'activity.created_at',
        'todo_items.id',
        'todo_items.title',
        'todo_items.activity_group_id',
        'todo_items.is_active',
        'todo_items.priority',
      ])
      .andWhere({
        id,
      })
      // .orderBy('todo_items.id', 'DESC')
      .getOne();
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} Not Found`);
    }
    // await this.cacheManager.set(key, JSON.stringify(activity), { ttl: 0 });
    return activity;
    // }
    // return JSON.parse(cache);
  }

  async findOneWithoutCache(id: number) {
    const activity = await this.activityRepository.findOneBy({
      id,
    });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} Not Found`);
    }
    return activity;
  }

  async deleteOne(id: number) {
    const activity = await this.findOneWithoutCache(id);
    await this.activityRepository.softRemove(activity);
    // await this.cacheManager.reset();
    return {};
  }

  async updateOne(data: { id: number; payload: UpdateActivityDTO }) {
    const activity = await this.activityRepository.preload({
      id: data.id,
      ...data.payload,
    });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${data.id} Not Found`);
    }
    const updatedActivity = await this.activityRepository.save(activity);
    // await this.cacheManager.reset();
    return updatedActivity;
  }
}
