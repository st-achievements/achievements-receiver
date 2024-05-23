import { zDto } from '@st-api/core';
import { z } from 'zod';

const PropertySchema = z
  .string()
  .max(10_000)
  .transform((text) =>
    text
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean),
  );

export const WorkoutInputSchema = z
  .object({
    id: PropertySchema.openapi({
      example:
        'f3001172-c158-45b7-80e5-72b509c2f543\n118b7214-e32b-4da0-a9db-f01c9d75ef41',
    }),
    startTime: PropertySchema.openapi({
      example: '2024-05-01T22:42:42-03:00\n2024-05-02T22:42:42-03:00',
      description: 'The format of the date must follow ISO 8601',
    }),
    endTime: PropertySchema.openapi({
      example: '2024-05-01T22:42:42-03:00\n2024-05-02T22:42:42-03:00',
      description: 'The format of the date must follow ISO 8601',
    }),
    duration: PropertySchema.openapi({
      example: '59,7\n76,9',
    }),
    totalDistance: PropertySchema.openapi({
      example: '3 km\n',
    }),
    workoutActivityType: PropertySchema.openapi({
      example: 'Running\nTraditional Strength Training',
    }),
    totalEnergyBurned: PropertySchema.openapi({
      example: '120 kcal\n302 kcal',
    }),
  })
  .openapi({
    description: `All properties can have multiple values. They must be separated by a line break (\\n).  
This is needed because of the format the iOS Shortcuts app sends the data.`,
  });

export class WorkoutInputDto extends zDto(WorkoutInputSchema) {}
