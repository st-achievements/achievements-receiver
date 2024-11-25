import { Controller, FORBIDDEN, Handler, ZBody } from '@st-api/core';
import { z } from 'zod';
import { FirebaseAdminFirestore, Logger } from '@st-api/firebase';
import { getAuthContext } from '@st-achievements/core';

@Controller({
  path: 'v1/ios-shortcuts/raw',
  method: 'POST',
})
export class IOSShortcutRawController implements Handler {
  constructor(private readonly firestore: FirebaseAdminFirestore) {}

  private readonly logger = Logger.create(this);

  async handle(@ZBody(z.any()) body: any): Promise<void> {
    const userId = getAuthContext().userId;
    if (userId !== 4096) {
      throw FORBIDDEN();
    }
    const doc = this.firestore
      .collection('workouts-raw')
      .doc(`u${userId}-${new Date().toISOString()}`);
    await doc.set({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body,
      userId,
      date: new Date(),
    });
    this.logger.debug(`doc = ${doc.id}`);
  }
}
