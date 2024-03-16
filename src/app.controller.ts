import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ZBody, ZRes } from '@st-api/core';
import { Logger, PubSub } from '@st-api/firebase';
import { z } from 'zod';

import { WORKOUT_PROCESSOR_QUEUE } from './app.constants.js';
import { WorkoutInputDto } from './workout-input.dto.js';
import { WorkoutProcessorDto } from './workout-processor.dto.js';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly pubSub: PubSub) {}

  private readonly logger = Logger.create(this);

  @ZRes(z.void(), HttpStatus.ACCEPTED)
  @Post()
  async post(@ZBody() { username, ...body }: WorkoutInputDto): Promise<void> {
    this.logger.log(`username: ${username}`);
    this.logger.log('body', { body });
    const length = Math.max(
      ...Object.values(body).map((value) => value.length),
    );
    this.logger.log(`length: ${length}`);
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
      this.logger.log(`processorDto - row ${index}`, { processorDto });
      await this.pubSub.publish(WORKOUT_PROCESSOR_QUEUE, {
        json: processorDto,
      });
    }
  }
}
