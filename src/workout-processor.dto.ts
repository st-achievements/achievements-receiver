export interface WorkoutProcessorDto {
  username: string;
  workouts: WorkoutDto[];
}

export interface WorkoutDto {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  durationUnit: string;
  totalDistance?: string;
  totalDistanceUnit?: string;
  workoutActivityType: string;
  totalEnergyBurned: string;
  totalEnergyBurnedUnit: string;
}
