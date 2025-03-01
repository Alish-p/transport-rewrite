import Box from '@mui/material/Box';

import { UserCard } from './user-card';

// ----------------------------------------------------------------------

export function UserCardList({ users }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
    >
      {users.map((user, idx) => (
        <UserCard key={user.id} user={user} idx={idx} />
      ))}
    </Box>
  );
}
