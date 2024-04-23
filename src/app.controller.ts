import { Controller, Headers, HttpStatus, Post } from '@nestjs/common';
import { Exceptions, ZBody, ZRes } from '@st-api/core';
import { Logger, PubSub } from '@st-api/firebase';
import { z } from 'zod';

import { ApiKeyService } from './api-key.service.js';
import { API_KEY_HEADER, WORKOUT_PROCESSOR_QUEUE } from './app.constants.js';
import {
  API_KEY_NOT_SEND,
  INVALID_API_KEY,
  USER_DO_NOT_HAVE_ANY_API_KEY,
  USER_NOT_FOUND,
} from './exceptions.js';
import { WorkoutInputDto } from './workout-input.dto.js';
import { WorkoutProcessorDto } from './workout-processor.dto.js';

@Controller({
  version: '1',
})
export class AppController {
  constructor(
    private readonly pubSub: PubSub,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  private readonly logger = Logger.create(this);

  @Exceptions([
    INVALID_API_KEY,
    USER_NOT_FOUND,
    API_KEY_NOT_SEND,
    USER_DO_NOT_HAVE_ANY_API_KEY,
  ])
  @ZRes(z.void(), HttpStatus.ACCEPTED)
  @Post()
  async post(
    @ZBody() { username, ...body }: WorkoutInputDto,
    @Headers(API_KEY_HEADER) apiKey: string | undefined,
  ): Promise<void> {
    this.logger.log(`username: ${username}`);
    this.logger.log('body', { body });

    await this.apiKeyService.validate(username, apiKey);

    return;
    const length = Math.max(
      ...Object.values(body).map((value) => value.length),
    );
    this.logger.log(`length: ${length}`);
    const eventsToPublish: Promise<unknown>[] = [];
    for (let index = 0; index < length; index++) {
      const [duration, durationUnit] = body.duration[index]!.split(' ');
      const [totalEnergyBurned, totalEnergyBurnedUnit] =
        body.totalEnergyBurned[index]!.split(' ');
      const totalDistanceValue = body.totalDistance[index];
      const [totalDistance, totalDistanceUnit] = totalDistanceValue?.split(
        ' ',
      ) ?? [undefined, undefined];
      const processorDto: WorkoutProcessorDto = {
        id: body.id[index]!,
        username,
        endTime: new Date(body.endTime[index]!).toISOString(),
        startTime: new Date(body.startTime[index]!).toISOString(),
        workoutActivityType: body.workoutActivityType[index]!,
        duration: duration!.replaceAll(',', '.'),
        durationUnit: durationUnit!,
        totalEnergyBurnedUnit: totalEnergyBurnedUnit!,
        totalEnergyBurned: totalEnergyBurned!.replaceAll(',', '.'),
        totalDistanceUnit,
        totalDistance: totalDistance?.replace(',', '.'),
      };
      this.logger.log(`publishing row ${index}`, { processorDto });
      eventsToPublish.push(
        this.pubSub.publish(WORKOUT_PROCESSOR_QUEUE, {
          json: processorDto,
        }),
      );
    }
    await Promise.all(eventsToPublish);
    this.logger.log('published all');
  }
}
