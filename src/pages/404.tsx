// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Button, Container, Typography, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Head>
        <title> 404 Page Not Found | Student Loan Disbursements</title>
      </Head>

      <Container
        maxWidth="xl"
        sx={{
          height: '100vh',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Stack>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Button component={NextLink} href="/" size="large" variant="contained">
            Go to Home
          </Button>
        </Stack>
      </Container>
    </>
  );
}
