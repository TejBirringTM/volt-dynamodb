import logger from '@/_framework_/logger';
import { serializeError as serialiseError } from 'serialize-error';

export { VoltError } from './_volt-error';

export function logError(error: unknown): void {
  logger.error(serialiseError(error));
}
