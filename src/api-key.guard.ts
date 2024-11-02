import { API_KEY_NOT_FOUND, INVALID_API_KEY } from './exceptions.js';
import { API_KEY_SECRET } from './secrets.js';
import { Injectable } from '@stlmpp/di';
import { CanActivate, HandlerContext } from '@st-api/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  handle(context: HandlerContext) {
    const validApiKey = API_KEY_SECRET.value();
    if (!validApiKey) {
      throw API_KEY_NOT_FOUND();
    }
    const apiKey = String(context.headers['x-api-key']);
    if (validApiKey !== apiKey) {
      throw INVALID_API_KEY();
    }
    return true;
  }
}
