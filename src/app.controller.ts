import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PubSubService } from '@st-achievements/core';
import { Exceptions, formatZodErrorString, ZBody, ZRes } from '@st-api/core';
import { Logger } from '@st-api/firebase';
import { z } from 'zod';

import {
  MAX_WORKOUTS_PER_REQUEST,
  WORKOUT_PROCESSOR_QUEUE,
} from './app.constants.js';
import {
  API_KEY_NOT_FOUND,
  INVALID_API_KEY,
  INVALID_WORKOUT,
  NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT,
} from './exceptions.js';
import { WorkoutInputDto } from './workout-input.dto.js';
import { WorkoutDto, WorkoutProcessorDto } from './workout-processor.dto.js';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly pubSubService: PubSubService) {}

  private readonly logger = Logger.create(this);

  @ApiOperation({
    summary: 'Handle workouts coming from iOS Shortcuts app',
  })
  @Exceptions([
    INVALID_WORKOUT,
    API_KEY_NOT_FOUND,
    INVALID_API_KEY,
    NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT,
  ])
  @ZRes(z.void(), HttpStatus.ACCEPTED)
  @Post('ios-shortcuts')
  async postIOSShortcuts(
    @ZBody() { username, ...body }: WorkoutInputDto,
  ): Promise<void> {
    this.logger.log(`username: ${username}`);
    this.logger.log('body', { body });
    const length = Math.max(
      ...Object.values(body).map((value) => value.length),
    );
    this.logger.log(`length: ${length}`);

    if (length > MAX_WORKOUTS_PER_REQUEST) {
      throw NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT();
    }

    const processorDto: WorkoutProcessorDto = {
      username,
      workouts: [],
    };
    for (let index = 0; index < length; index++) {
      const [duration, durationUnit] = body.duration[index]?.split(' ') ?? [];
      const [totalEnergyBurned, totalEnergyBurnedUnit] =
        body.totalEnergyBurned[index]?.split(' ') ?? [];
      const totalDistanceValue = body.totalDistance[index];
      const [totalDistance, totalDistanceUnit] =
        totalDistanceValue?.split(' ') ?? [];
      const workoutUnparsed = {
        id: body.id[index],
        endTime: body.endTime[index],
        startTime: body.startTime[index],
        workoutActivityType: body.workoutActivityType[index],
        duration,
        durationUnit,
        totalEnergyBurnedUnit,
        totalEnergyBurned,
        totalDistanceUnit,
        totalDistance,
      };
      const validationResult = WorkoutDto.safeParse(workoutUnparsed);
      if (!validationResult.success) {
        throw INVALID_WORKOUT(
          `Error: ${formatZodErrorString(validationResult.error)} | Workout number: ${index}`,
        );
      }
      processorDto.workouts.push(validationResult.data);
    }
    this.logger.info({ processorDto });
    await this.pubSubService.publish(WORKOUT_PROCESSOR_QUEUE, {
      json: processorDto,
    });
  }

  @ApiOperation({
    summary: 'Publish workouts to be processed asynchronously',
  })
  @Exceptions([API_KEY_NOT_FOUND, INVALID_API_KEY])
  @ZRes(z.void(), HttpStatus.ACCEPTED)
  @Post('workouts/batch')
  async postWorkoutsBatch(@ZBody() body: WorkoutProcessorDto): Promise<void> {
    await this.pubSubService.publish(WORKOUT_PROCESSOR_QUEUE, {
      json: body,
    });
  }
}
