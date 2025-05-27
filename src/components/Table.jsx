import { Container, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

export const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          padding: "1rem 4rem",
          borderRadius: "1rem",
          width: "100%",
          overflow: "hidden",
          height: "80vh",
          boxShadow: "none",
        }}
      >
        <Typography
          textAlign="center"
          variant="h4"
          sx={{
            marginBottom: "2rem",
            textTransform: "uppercase",
          }}
        >
          {heading}
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns?.map(col => ({ ...col, headerClassName: "custom-header" }))} // Add class
          rowHeight={rowHeight}
                    getRowId={(row) => row._id} // ✅ FIX: Use `_id` as unique identifier

          style={{
            height: "80%",
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

