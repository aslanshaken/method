// next
import Head from 'next/head';
// @mui
import { Container, Typography, Box, Alert } from '@mui/material';
// services
import { list } from 'src/services/payouts';
// @types
import { IPayout } from 'src/@types/payout';
// sections
import FileUpload from '../sections/@dashboard/payment/FileUpload';
import ReportsTable from '../sections/@dashboard/payment/ReportsTable';

// ----------------------------------------------------------------------

Index.getInitialProps = async (ctx: any) => {
  try {
    const { req } = ctx;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const serverHost = req ? `${protocol}://${req.headers.host}` : '';

    const payoutList = await list(serverHost);

    return { payoutList };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

type Props = {
  payoutList: IPayout[] | null;
  error: Error | null;
};

// ----------------------------------------------------------------------

export default function Index({ payoutList, error }: Props) {
  return (
    <>
      <Head>
        <title>Payment | Student Loan Disbursements</title>
      </Head>

      <Container maxWidth="xl" sx={{ py: 5, textAlign: 'center' }}>
        {error ? <Alert severity="error">Error: {error.message ?? error}</Alert> : ''}

        <Box mb={3} />

        <Typography variant="h3" component="h1" paragraph>
          Upload Payout XML File
        </Typography>

        <FileUpload />

        {payoutList ? (
          <Box mt={3}>
            <ReportsTable data={payoutList} />
          </Box>
        ) : (
          ''
        )}
      </Container>
    </>
  );
}
