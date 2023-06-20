import { ChangeEvent, useState } from 'react';
// @mui
import { Box, Button, InputAdornment, TextField, Alert, Stack } from '@mui/material';
// services
import * as payouts from 'src/services/payouts';
import SummaryTable from './SummaryTable';
// @types
import { ISummaryList } from 'src/@types/payout';

// ----------------------------------------------------------------------

export default function FileUpload() {
  // states
  const [file, setFile] = useState<any>(null);
  const [data, setData] = useState<ISummaryList | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const formData = new FormData();
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.files) {
      formData.append('file', inputElement.files[0]);
      setFile(formData);
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    try {
      const response = await payouts.getPreview(file);
      setData(response);
    } catch (e) {
      setError(e);
    }
  };

  const handleConfirm = async () => {
    try {
      await payouts.submit(file);
      window.location.reload();
    } catch (e) {
      setError(e);
    }
  };

  const handleCancel = () => {
    setData(null);
    setFile(null);
  };

  if (error) return <Alert severity="error">Error: {error.message ?? error}</Alert>;

  if (data)
    return (
      <Stack mb={3}>
        <SummaryTable data={data} />

        <Box mb={5} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" color="secondary" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    );

  return (
    <Box>
      <TextField
        type="file"
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" type="submit" onClick={handleUpload} disabled={!file}>
                Upload
              </Button>
            </InputAdornment>
          ),
        }}
        helperText={file ? '' : 'Please select a file to upload.'}
        FormHelperTextProps={{
          sx: {
            color: 'error.main',
          },
        }}
      />
    </Box>
  );
}
