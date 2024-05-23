import { Test } from '@nestjs/testing';
import { PubSub } from '@st-api/firebase';
import { mock } from 'vitest-mock-extended';

import { AppController } from './app.controller.js';
import { INVALID_WORKOUT } from './exceptions.js';
import { WorkoutInputDto } from './workout-input.dto.js';

describe('AppController', () => {
  vi.useFakeTimers({
    now: new Date(2024, 1, 2, 15, 42, 42, 0),
  });

  let controller: AppController;

  const pubSubMock = mock<PubSub>();
  const validInput: WorkoutInputDto = {
    id: ['1'],
    workoutActivityType: ['Running'],
    duration: ['1'],
    endTime: ['2024-05-01T22:42:42-03:00'],
    startTime: ['2024-05-01T22:42:42-03:00'],
    totalDistance: ['2 km'],
    totalEnergyBurned: ['3 kcal'],
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await Test.createTestingModule({
      providers: [
        {
          provide: PubSub,
          useFactory: () => pubSubMock,
        },
      ],
      controllers: [AppController],
    }).compile();
    controller = mod.get(AppController);
  });

  it('should create instance', () => {
    expect(controller).toBeDefined();
  });

  it.each(['INVALID_DATE', '2024-02-31', '14/02/2024', '14-02-2024'])(
    'should error when startTime is "%s"',
    async (value) => {
      await expect(() =>
        controller.postIOSShortcuts({ ...validInput, startTime: [value] }),
      ).rejects.toThrowException(
        INVALID_WORKOUT('Error: startTime: Invalid Date | Workout number: 0'),
      );
    },
  );

  it.each(['INVALID_DATE', '2024-02-31', '14/02/2024', '14-02-2024'])(
    'should error when endTime is "%s"',
    async (value) => {
      await expect(() =>
        controller.postIOSShortcuts({ ...validInput, endTime: [value] }),
      ).rejects.toThrowException(
        INVALID_WORKOUT('Error: endTime: Invalid Date | Workout number: 0'),
      );
    },
  );

  it.each([new Date().toISOString(), '2024-02-02T15:42:42-03:00'])(
    'should not throw error when startTime is "%s"',
    async (value) => {
      await controller.postIOSShortcuts({ ...validInput, startTime: [value] });
      expect(pubSubMock.publish).toHaveBeenCalledTimes(1);
    },
  );

  it.each([new Date().toISOString(), '2024-02-02T15:42:42-03:00'])(
    'should not throw error when endTime is "%s"',
    async (value) => {
      await controller.postIOSShortcuts({ ...validInput, endTime: [value] });
      expect(pubSubMock.publish).toHaveBeenCalledTimes(1);
    },
  );

  it('should call pub sub', async () => {
    await controller.postIOSShortcuts({
      id: ['69915BBA-8098-416E-B1D7-E5588155F510'],
      endTime: ['2024-04-01T19:57:57-03:00'],
      workoutActivityType: ['Traditional Strength Training'],
      totalDistance: [],
      duration: ['50,9'],
      totalEnergyBurned: ['257 kcal'],
      startTime: ['2024-04-01T19:07:01-03:00'],
    });
    expect(pubSubMock.publish).toHaveBeenCalledTimes(1);
  });
});
