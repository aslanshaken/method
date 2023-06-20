import axios from '../utils/axios';
// @types
import { IPayout, ISummaryList } from 'src/@types/payout';

// ----------------------------------------------------------------------

export async function getPreview(file: any): Promise<ISummaryList> {
  const response = await axios.put('/api/payouts', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('Payout preview generated successfully');
  return response.data;
}

export async function submit(file: any) : Promise<string>{
  const response = await axios.post('/api/payouts', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log('File uploaded successfully');
  return response.data;
}

export async function list(host: string): Promise<IPayout[]> {
  const response = await axios.get(`${host}/api/payouts`, {
    responseType: 'json',
  });
  return response.data;
}
