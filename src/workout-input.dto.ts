import { z } from 'zod';

const PropertySchema = z
  .string()
  .max(10_000)
  .trim()
  .transform((value) => value || undefined);

export const WorkoutInputDto = z.object({
  workouts: z
    .object({
      id: PropertySchema.openapi({
        example: 'f3001172-c158-45b7-80e5-72b509c2f543',
      }),
      startTime: PropertySchema.openapi({
        example: '2024-05-01T22:42:42-03:00',
        description: 'The format of the date must follow ISO 8601',
      }),
      endTime: PropertySchema.openapi({
        example: '2024-05-01T22:42:42-03:00',
        description: 'The format of the date must follow ISO 8601',
      }),
      duration: PropertySchema.openapi({
        example: '59,7',
      }),
      totalDistance: PropertySchema.openapi({
        example: '3 km',
      }).optional(),
      workoutActivityType: PropertySchema.openapi({
        example: 'Running',
      }),
      totalEnergyBurned: PropertySchema.openapi({
        example: '120 kcal',
      }),
    })
    .array(),
  debug: z.boolean().optional().openapi({
    description: 'Only used to debug',
  }),
});

export type WorkoutInputDto = z.output<typeof WorkoutInputDto>;
