import { NextApiRequest, NextApiResponse } from 'next';
// api
import {
  errorResponse,
  errorResponseMethodNotAllowed,
  successResponse,
} from 'src/server/api/response';
// services
import { getPaymentsReport } from 'src/server/services/ReportingService';

// ----------------------------------------------------------------------

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('Request for payments report');
    const { id } = req.query;

    getPaymentsReport(+`${id}`).then((report) => {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="payments_by_source_report.csv"');
      successResponse(res, report);
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, { message: error?.message });
  }
};

// ----------------------------------------------------------------------

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      get(req, res);
      break;
    default:
      errorResponseMethodNotAllowed(res);
      break;
  }
}
