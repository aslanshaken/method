import { NextApiResponse } from 'next';
import { IErrorResponse } from './types';

// ----------------------------------------------------------------------

/**
 * Send success response to client with data.
 * @param res Client response.
 * @param data Data to send client response.
 * @param options Options to set response headers.
 * @param statusCode default `200`
 */
export const successResponse = (
  res: NextApiResponse,
  data: any,
  statusCode?: number | null
): void => {
  res.statusCode = statusCode || 200;
  res.setHeader('Content-Type', 'application/json');

  const strData = typeof data === 'string' ? data : JSON.stringify(data);
  res.write(strData);

  res.end();
  console.log('>> done');
};

// ----------------------------------------------------------------------

/**
 * Send error response to client with data.
 * @param res Client response.
 * @param data Data to send client response.
 * @param statusCode default `500`
 */
export const errorResponse = (
  res: NextApiResponse,
  data: Partial<IErrorResponse> & Record<string, any>,
  statusCode?: number | null
): void => {
  // set status code
  res.statusCode = statusCode || 500;
  res.setHeader('Content-Type', 'application/json');

  let message = 'Something went wrong.';

  if (res.statusCode === 403) {
    message = 'Request has been forbidden.';
  }

  data.status = res.statusCode;
  data.message = data.message || message;

  res.write(JSON.stringify(data));
  res.end();
  console.log('>> error');
};

/**
 * Send 404 - Page not found error without data.
 * @param res Client response.
 */
export const errorResponse404 = (res: NextApiResponse): void => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end();
  console.log('>> error 404');
};

/**
 * Send 405 - Method not allowed error without data.
 * @param res Client response.
 */
export const errorResponseMethodNotAllowed = (res: NextApiResponse): void => {
  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end();
  console.log('>> error 405');
};