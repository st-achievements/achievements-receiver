export interface AchievementProcessorDto {
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
  username: string;
}
