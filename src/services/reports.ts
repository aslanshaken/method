import axios from '../utils/axios';

// ----------------------------------------------------------------------

export async function getPaymentsBySourceReport(payoutId: number): Promise<void> {
  const response = await axios.get(`/api/reports/${payoutId}/payments-by-source`, {
    responseType: 'blob',
  });
  initiateFileDownload(response.data, 'payments_by_source_report.csv');
}

export async function getPaymentsByBranchReport(payoutId: number): Promise<void> {
  const response = await axios.get(`/api/reports/${payoutId}/payments-by-branch`, {
    responseType: 'blob',
  });
  initiateFileDownload(response.data, 'payments_by_branch_report.csv');
}

export async function getPaymentsReport(payoutId: number): Promise<void> {
  const response = await axios.get(`/api/reports/${payoutId}/payments`, {
    responseType: 'blob',
  });
  initiateFileDownload(response.data, 'all_payments_report.csv');
}

/**
 * Create an element for download file
 * @param file 
 * @param name 
 */
function initiateFileDownload(file: any, name: string): void {
  const blob = new Blob([file], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = name;
  link.click();
}
