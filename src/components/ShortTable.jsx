import { Box, Container, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

export const Table = ({ rows, columns, heading, rowHeight = 52, headingStyle }) => {


  return (
    <Container sx={{ display: "flex" }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: "1rem",
          width: "100%",
          overflow: "hidden",
          height: headingStyle ? "100vh" : "50vh",
          boxShadow: "none",
        }}
      >
        {heading && (
          <Typography
            textAlign="center"
            variant="h5"
            color="#575059"
            sx={{
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            {heading}
          </Typography>
        )}

        <DataGrid
          rows={rows}
          columns={columns?.map((col) => ({ ...col, headerClassName: "custom-header" }))}
          getRowId={(row) => row._id} // ✅ FIX: Use `_id` as unique identifier
          rowHeight={rowHeight}
          style={{
            height: headingStyle ? "100%" : "80%",
          }}
          sx={{
            border: "none",
            ".table-header": {
              bgcolor: 'black',
              color: "white",
            },
          }}
        />
      </Paper>
    </Container>
  );
};
