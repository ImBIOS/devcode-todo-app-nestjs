import { Module } from '@nestjs/common';
import { ActivityModule } from './activity/activity.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [ActivityModule, TodoModule],
})
export class ModulesModule {}
