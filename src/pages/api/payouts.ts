import { NextApiRequest, NextApiResponse } from 'next';
import { parseString } from 'xml2js';
import multer from 'multer';
// api
import {
  errorResponse,
  errorResponseMethodNotAllowed,
  successResponse,
} from 'src/server/api/response';
// services
import { generateSummary, getAllPayouts, process } from 'src/server/services/PayoutService';

// ----------------------------------------------------------------------

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false, // enable reading of request body
  },
};

// ----------------------------------------------------------------------

const put = async (req: any, res: any) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Error while uploading file', err);
      return errorResponse(res, { message: 'Error while uploading file' }, 400);
    } else if (err) {
      console.error('Unknown error', err);
      return errorResponse(res, { message: err.message }, 400);
    }

    if (!req.file) {
      console.error('No file uploaded');
      return errorResponse(res, { message: 'No file was uploaded' }, 400);
    }

    try {
      const xmlData = req.file.buffer.toString();

      parseString(xmlData, (parseErr, result) => {
        if (parseErr) {
          console.error('Unable to parse XML file', parseErr);
          return errorResponse(res, { message: 'Error while uploading file' }, 400);
        }

        const summary = generateSummary(result.root.row);
        console.log('Summary generated');

        return successResponse(res, summary);
      });
    } catch (error) {
      console.error(error);
      return errorResponse(res, { message: error?.message });
    }
  });
};

const post = async (req: any, res: any) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Error while uploading file', err);
      return errorResponse(res, { message: 'Error while uploading file' }, 400);
    } else if (err) {
      console.error('Unknown error', err);
      return errorResponse(res, { message: err.message }, 400);
    }

    try {
      console.log('Payout processing request received');
      parseString(req.file.buffer.toString(), async (err, result) => {
        if (err) {
          console.error('Unable to parse XML file');
          return errorResponse(res, { message: 'Error while parsing XML file' });
        }

        try {
          process(result.root.row);
          return successResponse(res, 'Payments processing!', 202);
        } catch (e) {
          return errorResponse(res, {}, 500);
        }
      });
    } catch (error) {
      console.error(error);
      return errorResponse(res, { message: error?.message });
    }
  });
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    getAllPayouts().then((payouts) => successResponse(res, payouts));
  } catch (error) {
    console.error(error);
    return errorResponse(res, { message: error?.message });
  }
};

// ----------------------------------------------------------------------

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      put(req, res);
      break;
    case 'POST':
      post(req, res);
      break;
    case 'GET':
      get(req, res);
      break;
    default:
      errorResponseMethodNotAllowed(res);
      break;
  }
}
