import React, { useState } from 'react';
// @mui
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Select,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';
// services
import {
  getPaymentsByBranchReport,
  getPaymentsBySourceReport,
  getPaymentsReport,
} from 'src/services/reports';

const BY_BRANCH_REPORT = 'branch';
const BY_SOURCE_REPORT = 'source';
const ALL_PAYMENTS_REPORT = 'all_payments';

export default function ReportsTable(props: { data: any }) {
  const [selectedReport, setSelectedReport] = useState<any>({});
  const payouts: any[] = props.data;

  const handleReportDownload = async (id: number) => {
    switch (selectedReport[id]) {
      case BY_BRANCH_REPORT:
        await getPaymentsByBranchReport(id);
        break;
      case BY_SOURCE_REPORT:
        await getPaymentsBySourceReport(id);
        break;
      default:
        await getPaymentsReport(id);
    }
    setSelectedReport('');
  };

  return payouts.length > 0 ? (
    <Table className="table">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Submitted Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell width={400}>Download</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {payouts?.map((payout) => (
          <TableRow key={payout.id}>
            <TableCell>{payout.id}</TableCell>
            <TableCell>{payout.created_at}</TableCell>
            <TableCell>{payout.status}</TableCell>
            <TableCell>
              {payout.status === 'complete' ? (
                <Box display="flex" alignItems="center">
                  <Select
                    value={selectedReport[payout.id] || ''}
                    onChange={(e) =>
                      setSelectedReport({
                        ...selectedReport,
                        [payout.id]: e.target.value,
                      })
                    }
                    sx={{ minWidth: 200 }}
                    size="small"
                  >
                    <MenuItem value="">Select option</MenuItem>
                    <MenuItem value={BY_BRANCH_REPORT}>By branch</MenuItem>
                    <MenuItem value={BY_SOURCE_REPORT}>By source</MenuItem>
                    <MenuItem value={ALL_PAYMENTS_REPORT}>All payments</MenuItem>
                  </Select>
                  {selectedReport[payout.id] && (
                    <Button
                      onClick={() => handleReportDownload(payout.id)}
                      variant="contained"
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      Download
                    </Button>
                  )}
                </Box>
              ) : (
                'Reports available once payout is complete'
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Typography>No Data</Typography>
  );
}
