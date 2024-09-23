import { useNavigate } from 'react-router-dom';

import {
  Card,
  Grid,
  Table,
  TableRow,
  TableBody,
  Container,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { paramCase } from 'src/utils/change-case';

import { Scrollbar } from 'src/components/scrollbar';

import SubtripListRow from './basic-subtrip-table-row';
import { subtripConfig } from './basic-subtrip-table-config';

export default function SimpleSubtripList({ subtrips }) {
  const navigate = useNavigate();

  const handleDeleteRow = (id) => {
    // dispatch(deleteSubtrip(id)); // Add your delete logic here
  };

  const handleEditRow = (id) => {
    navigate(paths.dashboardsubtrip.edit(paramCase(id)));
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size="medium" sx={{ minWidth: 960 }}>
                  <TableHeadCustom headLabel={subtripConfig} />

                  <TableBody>
                    {subtrips.map((row) => (
                      <SubtripListRow
                        key={row._id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                    {subtrips.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography align="center">No subtrips found.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

function TableHeadCustom({ headLabel }) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
