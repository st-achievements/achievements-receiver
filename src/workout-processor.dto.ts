import { zDto } from '@st-api/core';
import dayjs from 'dayjs';
import { z } from 'zod';

import { MAX_WORKOUTS_PER_REQUEST } from './app.constants.js';

const DateSchema = z
  .string()
  .trim()
  .datetime({ offset: true })
  .transform((date) => dayjs(date))
  .refine((date) => date.isValid(), {
    message: 'Invalid Date',
  })
  .transform((date) => date.toISOString());
const DoubleSchema = z
  .string()
  .trim()
  .regex(/^\d{1,6}([,.]\d{1,2})?$/)
  .transform((value) => value.replaceAll(',', '.'))
  .pipe(z.string().regex(/^\d{1,6}(\.\d{1,2})?$/));
const UnitSchema = z.string().trim().min(1).max(10);

export const WorkoutDto = z.object({
  id: z.string().trim().min(1).max(255).openapi({
    example: 'f3001172-c158-45b7-80e5-72b509c2f543',
  }),
  startTime: DateSchema,
  endTime: DateSchema,
  duration: DoubleSchema.openapi({
    example: '20.14',
  }),
  durationUnit: UnitSchema.optional().openapi({
    example: 'hour',
  }),
  totalDistance: DoubleSchema.optional().openapi({
    example: '15.33',
  }),
  totalDistanceUnit: UnitSchema.optional().openapi({
    example: 'km',
  }),
  workoutActivityType: z.string().trim().min(1).max(255).openapi({
    example: 'Traditional Strength Training',
  }),
  totalEnergyBurned: DoubleSchema.openapi({
    example: '125.92',
  }),
  totalEnergyBurnedUnit: UnitSchema.optional().openapi({
    example: 'kcal',
  }),
});

export type WorkoutDto = z.infer<typeof WorkoutDto>;

export class WorkoutProcessorDto extends zDto(
  z.object({
    username: z.string().trim().min(1).max(255).openapi({
      example: 'stLmpp',
    }),
    workouts: WorkoutDto.array().max(MAX_WORKOUTS_PER_REQUEST),
  }),
) {}
