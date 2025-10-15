import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const WorkerCalls = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calls
      </Typography>
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Calls page coming soon...
        </Typography>
      </Paper>
    </Box>
  );
};

export default WorkerCalls;