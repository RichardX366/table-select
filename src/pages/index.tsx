import { Button, Checkbox } from '@bctc/components';
import { Table, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import a from '../../helpers/axios';
import { useInterval } from '@mantine/hooks';

export default function Home() {
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [tables, setTables] = useState<(Table & { users: User[] })[]>([]);

  const fetchUsers = async () => {
    const { data: response } = await a.get<User[]>('getUsers');
    if (!response) return;
    setUsers(response);
    setUser((user) =>
      user ? response.find(({ id }) => id === user.id) : user,
    );
  };

  const fetchTables = async () => {
    const { data: response } = await a.get<(Table & { users: User[] })[]>(
      'getTables',
    );
    if (response) setTables(response);
  };

  const interval = useInterval(() => {
    console.log('a');
    fetchTables();
    fetchUsers();
  }, 1000);

  useEffect(() => {
    fetchUsers();
    fetchTables();
    interval.start();
    document.title = 'Table Select';
    return interval.stop();
    // eslint-disable-next-line
  }, []);

  return (
    <main className='p-4'>
      {user ? (
        <div className='text-white'>
          <h1 className='text-2xl'>{user.name}</h1>
          <h1 className='text-2xl'>Group: {user.role || 'N/A'}</h1>
          <div className='grid grid-cols-3 text-center mt-4 text-white gap-4'>
            {!user.tableId &&
              tables.map((table) => (
                <Button
                  disabled={table.disabled}
                  key={table.id}
                  onClick={async () => {
                    const { data: response } = await a.put('updateUser', {
                      id: user.id,
                      table: table.id,
                    });
                    if (response) fetchUsers();
                  }}
                >
                  Select Table {table.id}
                </Button>
              ))}
          </div>
        </div>
      ) : (
        <div className='bg-white p-4 rounded-lg'>
          <h1>Who Are You?</h1>
          {users.map((v) => (
            <Checkbox
              label={v.name}
              onChange={() => setSelectedUser(v.id)}
              value={v.id === selectedUser}
              key={v.id}
            />
          ))}
          <Button
            className='mt-2'
            onClick={() => setUser(users.find(({ id }) => id === selectedUser))}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
