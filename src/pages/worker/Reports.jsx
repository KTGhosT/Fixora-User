import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const WorkerReports = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Reports page coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default WorkerReports;