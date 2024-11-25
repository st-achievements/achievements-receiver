import { getAuthContext, PubSubService } from '@st-achievements/core';
import {
  Controller,
  Exceptions,
  formatZodErrorString,
  Handler,
  ZBody,
  ZRes,
} from '@st-api/core';
import { FirebaseAdminFirestore, Logger } from '@st-api/firebase';
import { z } from 'zod';

import {
  MAX_WORKOUTS_PER_REQUEST,
  WORKOUT_PROCESSOR_QUEUE,
} from './app.constants.js';
import {
  INVALID_WORKOUT,
  NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT,
} from './exceptions.js';
import { WorkoutInputDto } from './workout-input.dto.js';
import { WorkoutDto, WorkoutProcessorDto } from './workout-processor.dto.js';
import { StatusCodes } from 'http-status-codes';

@Controller({
  path: 'v1/ios-shortcuts',
  method: 'POST',
  openapi: {
    summary: 'Handle workouts coming from iOS Shortcuts app',
  },
})
@Exceptions([INVALID_WORKOUT, NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT])
@ZRes(z.void(), StatusCodes.ACCEPTED)
export class IOSShortcutController implements Handler {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly firestore: FirebaseAdminFirestore,
  ) {}

  private readonly logger = Logger.create(this);

  async handle(
    @ZBody(WorkoutInputDto) { debug, workouts }: WorkoutInputDto,
  ): Promise<void> {
    const { userId } = getAuthContext();
    debug &&= userId === 4096;
    Logger.setContext(`u${userId}`);

    this.logger.log(`length: ${workouts.length}`);

    if (length > MAX_WORKOUTS_PER_REQUEST) {
      throw NUMBER_OF_WORKOUTS_EXCEEDED_LIMIT();
    }

    const processorDto: WorkoutProcessorDto = {
      workouts: [],
    };
    for (let index = 0; index < workouts.length; index++) {
      const workout = workouts[index]!;
      const [duration, durationUnit] = workout.duration?.split(' ') ?? [];
      const [totalEnergyBurned, totalEnergyBurnedUnit] =
        workout.totalEnergyBurned?.split(' ') ?? [];
      const totalDistanceValue = workout.totalDistance;
      const [totalDistance, totalDistanceUnit] =
        totalDistanceValue?.split(' ') ?? [];
      const workoutUnparsed = {
        id: workout.id,
        endTime: workout.endTime,
        startTime: workout.startTime,
        workoutActivityType: workout.workoutActivityType,
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
    if (debug) {
      const doc = this.firestore
        .collection('workouts')
        .doc(
          `u${userId}-${new Date().toISOString()}-${processorDto.workouts.length}`,
        );
      await doc.create({
        ...processorDto,
        userId,
      });
      this.logger.debug(`doc: ${doc.id}`);
    } else {
      await this.pubSubService.publish(WORKOUT_PROCESSOR_QUEUE, {
        json: processorDto,
      });
    }
  }
}
