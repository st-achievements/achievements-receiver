import { ParamIntSchema } from '@st-api/core';

export const WORKOUT_PROCESSOR_QUEUE =
  'com.st-achievements.queue.usr_workout-processor.v1';
export const MAX_WORKOUTS_PER_REQUEST = ParamIntSchema.catch(() => 100).parse(
  process.env.USR_WR_MAX_WORKOUTS_PER_REQUEST,
);
