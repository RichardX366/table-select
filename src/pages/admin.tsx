import {
  Button,
  DropdownData,
  Input,
  SingleSearchInput,
} from '@bctc/components';
import { useEffect, useState } from 'react';
import a from '../../helpers/axios';
import { Table, User } from '@prisma/client';

export default function Admin() {
  const [tables, setTables] = useState<(Table & { users: User[] })[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<DropdownData | null>(null);
  const [role, setRole] = useState('');

  const fetchTables = async () => {
    const { data: response } = await a.get<(Table & { users: User[] })[]>(
      'getTables',
    );
    if (response) setTables(response);
  };

  const fetchUsers = async () => {
    const { data: response } = await a.get<User[]>('getUsers');
    if (!response) return;
    setUsers(response);
  };

  useEffect(() => {
    fetchTables();
    fetchUsers();
    document.title = 'Table Select';
  }, []);

  return (
    <main className='p-4'>
      <div className='w-full grid grid-cols-2 gap-4'>
        <Button onClick={fetchTables}>Update Tables</Button>
        <Button
          onClick={async () => {
            await a.delete('resetTables');
            fetchTables();
          }}
          className='bg-red-500 hover:bg-red-600 focus:ring-red-400'
        >
          Reset Tables
        </Button>
      </div>
      <div className='grid grid-cols-3 text-center mt-4 text-white gap-4'>
        {tables.map((table) => (
          <div className='border border-white p-2 rounded-lg' key={table.id}>
            <div className='flex justify-between'>
              <p className='text-xl text-left'>
                Table {table.id}: {table.disabled && 'Disabled'}
              </p>
              <Button
                size='sm'
                onClick={async () => {
                  const { status } = await a.put('updateTable', {
                    disabled: !table.disabled,
                    id: table.id,
                  });
                  if (status === 200) fetchTables();
                }}
              >
                {table.disabled ? 'Enable' : 'Disable'}
              </Button>
            </div>
            <p>{table.users.map((user) => user.name).join(', ')}</p>
          </div>
        ))}
      </div>
      <div className='my-4 flex gap-4'>
        <SingleSearchInput
          data={users.map((user) => ({
            id: user.id.toString(),
            title: user.name,
          }))}
          value={selectedUser}
          onChange={(v) => setSelectedUser(v)}
        />
        <Input value={role} onChange={setRole} placeholder='Role' />
        <Button
          onClick={async () => {
            if (selectedUser) {
              const { status } = await a.put('updateUser', {
                id: +selectedUser.id,
                role: role || null,
              });
              if (status === 200) fetchUsers();
            }
          }}
        >
          Set
        </Button>
        <Button
          onClick={async () => {
            await Promise.all(
              users.map((user) =>
                a.put('updateUser', {
                  id: +user.id,
                  role: user.name,
                }),
              ),
            );
            fetchUsers();
          }}
        >
          Personal Groups
        </Button>
        <Button
          onClick={async () => {
            await Promise.all(
              users.map((user) =>
                a.put('updateUser', {
                  id: +user.id,
                  role: null,
                }),
              ),
            );
            fetchUsers();
          }}
        >
          Reset Groups
        </Button>
      </div>
      <div className='text-white'>
        {users.map((user) => (
          <p key={user.id}>
            {user.name}: {user.role}
          </p>
        ))}
      </div>
    </main>
  );
}
