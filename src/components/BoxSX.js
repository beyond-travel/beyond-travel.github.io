import * as React from 'react';
import Box from '@mui/material/Box';

export default function BoxSx({ color }) {
    return (
        <Box
            sx={{
                width: 40,
                height: 10,
                backgroundColor: color,
                '&:hover': {
                    backgroundColor: color,
                    opacity: [0.9, 0.8, 0.7],
                },
            }}
        />
    );
}