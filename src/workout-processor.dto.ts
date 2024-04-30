import dayjs from 'dayjs';
import { z } from 'zod';

const DateSchema = z
  .string()
  .datetime()
  .transform((date) => dayjs(date).toISOString());
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

export interface WorkoutProcessorDto {
  username: string;
  workouts: WorkoutDto[];
}
