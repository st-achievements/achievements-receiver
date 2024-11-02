import { Controller, Handler, ZBody, ZRes } from '@st-api/core';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { WorkoutProcessorDto } from './workout-processor.dto.js';
import { Logger } from '@st-api/firebase';
import { getAuthContext, PubSubService } from '@st-achievements/core';
import { WORKOUT_PROCESSOR_QUEUE } from './app.constants.js';

@ZRes(z.void(), StatusCodes.ACCEPTED)
@Controller({
  path: 'v1/workouts/batch',
  method: 'POST',
  openapi: {
    summary: 'Publish workouts to be processed asynchronously',
  },
})
export class WorkoutsBatchController implements Handler {
  constructor(private readonly pubSubService: PubSubService) {}

  private readonly logger = Logger.create(this);

  async handle(
    @ZBody(WorkoutProcessorDto) body: WorkoutProcessorDto,
  ): Promise<void> {
    Logger.setContext(`u${getAuthContext().userId}`);
    this.logger.log('body', { body });
    await this.pubSubService.publish(WORKOUT_PROCESSOR_QUEUE, {
      json: body,
    });
  }
}
