import dayjs from 'dayjs';
import { z } from 'zod';

const DateSchema = z
  .string()
  .transform((date) =>
    dayjs(
      date,
      ['YYYY-MM-DD[T]HH:mm:ssZ', 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'],
      true,
    ),
  )
  .refine((date) => date.isValid(), {
    message: 'Invalid Date',
  })
  .transform((date) => date.toISOString());
const DoubleSchema = z
  .string()
  .regex(/^\d{1,6}([,.]\d{1,2})?$/)
  .transform((value) => value.replaceAll(',', '.'))
  .pipe(z.string().regex(/^\d{1,6}(\.\d{1,2})?$/));

export const WorkoutDto = z.object({
  id: z.string().trim().min(1),
  startTime: DateSchema,
  endTime: DateSchema,
  duration: DoubleSchema,
  durationUnit: z.string().optional(),
  totalDistance: DoubleSchema.optional(),
  totalDistanceUnit: z.string().optional(),
  workoutActivityType: z.string().trim().min(1),
  totalEnergyBurned: DoubleSchema,
  totalEnergyBurnedUnit: z.string(),
});

export type WorkoutDto = z.infer<typeof WorkoutDto>;

export const WorkoutProcessorDto = z.object({
  username: z.string().trim().min(1).max(255).openapi({
    example: 'stLmpp',
  }),
  workouts: WorkoutDto.array(),
});

export type WorkoutProcessorDto = z.infer<typeof WorkoutProcessorDto>;
