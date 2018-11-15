import nock = require('nock');

import config from '../../../config';
import { AvRequestQueryParams } from '../../alpha-vantage';

const mockAvEndpoint = <T>(
  queryParams: AvRequestQueryParams,
  statusCode: number,
  response: T
): void => {
  nock(config.app.ALPHA_VANTAGE_URL)
    .get('/query')
    .query({ ...queryParams, apikey: config.app.ALPHA_VANTAGE_API_KEY })
    .reply(statusCode, response);
};

export { mockAvEndpoint };
