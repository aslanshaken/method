// @mui
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// @types
import { ISummaryList } from 'src/@types/payout';

// ----------------------------------------------------------------------

export default function SummaryTable(props: { data: ISummaryList }) {
  const {data} = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Total Payment Amount</TableCell>
          <TableCell>Number of Payments</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {Object.entries(data).map((item, index) => (
          <TableRow key={item[0]}>
            <TableCell>{item[0]}</TableCell>
            <TableCell>{item[1].totalPaymentAmount}</TableCell>
            <TableCell>{item[1].numPayments}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
