import {
  BadRequestException,
  // CACHE_MANAGER,
  // Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
// import { Cache } from 'cache-manager';
import { CreateTodoDTO, QueryTodoDTO, UpdateTodoDTO } from './todo.dto';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>, // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: QueryTodoDTO) {
    // const key = `todo_all_${JSON.stringify(query)}`;
    // const cache: string = await this.cacheManager.get(key);
    // if (!cache) {
    const result = await this.todoRepository.findAndCount({
      select: ['id', 'title', 'activity_group_id', 'is_active', 'priority'],
      where: {
        activity_group_id: query.activity_group_id
          ? query.activity_group_id
          : Not(IsNull()),
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

  async create(createTodo: CreateTodoDTO) {
    const todo = this.todoRepository.create(createTodo);
    const createdTodo = await this.todoRepository.save(todo);
    // await this.cacheManager.reset();
    return createdTodo;
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Id is not a Number!');
    }
    // const key = `todo_single_${id}`;
    // const cache: string = await this.cacheManager.get(key);
    // if (!cache) {
    const todo = await this.todoRepository.findOne({
      select: ['id', 'title', 'is_active', 'priority'],
      where: {
        id,
      },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} Not Found`);
    }
    // await this.cacheManager.set(key, JSON.stringify(todo), { ttl: 0 });
    return todo;
    // }
    // return JSON.parse(cache);
  }

  async findOneWithoutCache(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Id is not a Number!');
    }
    const todo = await this.todoRepository.findOne({
      select: ['id', 'title', 'is_active', 'priority'],
      where: {
        id,
      },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} Not Found`);
    }
    return todo;
  }

  async deleteOne(id: number) {
    const todo = await this.findOneWithoutCache(id);
    await this.todoRepository.softRemove(todo);
    // await this.cacheManager.reset();
    return {};
  }

  async updateOne(data: { id: number; payload: UpdateTodoDTO }) {
    const todo = await this.todoRepository.preload({
      id: data.id,
      ...data.payload,
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${data.id} Not Found`);
    }
    const updatedTodo = await this.todoRepository.save(todo);
    // await this.cacheManager.reset();
    return updatedTodo;
  }
}
