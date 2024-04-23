import { Injectable } from '@nestjs/common';
import { Drizzle, iam, usr } from '@st-achievements/database';
import { Logger } from '@st-api/firebase';
import { compare, hash } from 'bcrypt';
import { and, desc, eq } from 'drizzle-orm';

import {
  API_KEY_NOT_SEND,
  INVALID_API_KEY,
  USER_DO_NOT_HAVE_ANY_API_KEY,
  USER_NOT_FOUND,
} from './exceptions.js';

@Injectable()
export class ApiKeyService {
  constructor(private readonly drizzle: Drizzle) {}

  private readonly logger = Logger.create(this);

  async validate(
    username: string,
    apiKeyReceived: string | undefined,
  ): Promise<void> {
    if (!apiKeyReceived) {
      this.logger.info('api-key not received');
      throw API_KEY_NOT_SEND();
    }
    const [result] = await this.drizzle
      .select({
        apiKey: {
          key: iam.apiKey.key,
        },
        userId: usr.user.id,
      })
      .from(usr.user)
      .leftJoin(
        iam.apiKey,
        and(eq(iam.apiKey.userId, usr.user.id), eq(iam.apiKey.active, true)),
      )
      .where(and(eq(usr.user.name, username)))
      .orderBy(desc(iam.apiKey.id))
      .limit(1);
    if (!result) {
      this.logger.error(`username = ${username} not found`);
      throw USER_NOT_FOUND();
    }
    const { apiKey } = result;
    if (!apiKey) {
      this.logger.error('user does not have any api-key registered or active');
      throw USER_DO_NOT_HAVE_ANY_API_KEY();
    }
    const isValidApiKey = await compare(apiKeyReceived, apiKey.key);
    if (!isValidApiKey) {
      this.logger.error('invalid api-key received');
      throw INVALID_API_KEY();
    }
  }
}
