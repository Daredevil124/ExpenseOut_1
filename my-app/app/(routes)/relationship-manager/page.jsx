// Dashboard UI for Relationship Manager
// Features:
// - Table layout inspired by spreadsheets
// - New button to add rows
// - User dropdown with custom option
// - Role column (read-only or dropdown if custom user)
// - Manager dropdown/input (cannot be same as user)
// - Email input
// - Send Password button (only for existing users)
//
// Assumes API endpoints exist for fetching users, creating/updating relationships, and sending password emails.

'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';

const EMPTY_ROW = {
  user: '',
  role: '',
  manager: '',
  email: '',
  isCustomUser: false,
  isCustomRole: false,
  isCustomManager: false,
  isNew: true,
};



export default function RelationshipManagerDashboard() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users for dropdowns
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data.users || []);
        setManagers(data.users || []);
      } catch (e) {
        setUsers([]);
        setManagers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Fetch existing relationships
  useEffect(() => {
    async function fetchRelationships() {
      setLoading(true);
      try {
        const res = await fetch('/api/relationship-manager');
        const data = await res.json();
        const fetchedRows = (data.relationships || []).map(r => ({
          user: r.username,
          role: r.role,
          manager: r.manager,
          email: r.email,
          isCustomUser: false,
          isCustomRole: false,
          isCustomManager: false,
          isNew: false,
        }));
        // If no data is fetched, show the hardcoded row
  setRows(fetchedRows);
      } catch (e) {
  setRows([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRelationships();
  }, []);

  // Add new row
  const handleAddRow = () => {
    setRows(prev => [
      { ...EMPTY_ROW },
      ...prev,
    ]);
  };

  // Mark row as dirty (edited)
  const markDirty = (row, field) => {
    // If user column is changed, mark for userChange
    if (field === 'user') return { ...row, isDirty: true, userChanged: true };
    return { ...row, isDirty: true };
  };

  // Handle user dropdown selection
  const handleUserDropdown = (idx, value) => {
    setRows(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      const isCustom = value === 'custom';
      // Track previous username only if not already set and user is changing
      const prevUsername = row.prevUsername || row.user;
      // Preserve other fields so PUT has all required data
      return markDirty({
        ...row,
        prevUsername,
        user: isCustom ? '' : value,
        isCustomUser: isCustom,
        role: isCustom ? '' : (users.find(u => u.username === value)?.role || row.role || ''),
        isCustomRole: isCustom,
        manager: row.manager || '',
        isCustomManager: row.isCustomManager || false,
        email: row.email || '',
      }, 'user');
    }));
  };

  // Handle user input typing (custom)
  const handleUserInput = (idx, value) => {
    setRows(prev => prev.map((row, i) => i === idx ? markDirty({ ...row, user: value }, 'user') : row));
  };

  // Handle role dropdown selection (for custom user)
  const handleRoleDropdown = (idx, value) => {
    setRows(prev => prev.map((row, i) => i === idx ? markDirty({ ...row, role: value, isCustomRole: value === 'custom' }) : row));
  };

  // Handle role input typing (custom)
  const handleRoleInput = (idx, value) => {
    setRows(prev => prev.map((row, i) => i === idx ? markDirty({ ...row, role: value }) : row));
  };

  // Handle manager dropdown selection
  const handleManagerDropdown = (idx, value) => {
    setRows(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      const isCustom = value === 'custom';
      return markDirty({
        ...row,
        manager: isCustom ? '' : value,
        isCustomManager: isCustom,
      });
    }));
  };

  // Handle manager input typing (custom)
  const handleManagerInput = (idx, value) => {
    setRows(prev => prev.map((row, i) => i === idx ? markDirty({ ...row, manager: value }) : row));
  };

  // Handle email change
  const handleEmailChange = (idx, value) => {
    setRows(prev => prev.map((row, i) => i === idx ? markDirty({ ...row, email: value }) : row));
  };

  // Handle save for new row (calls API)
  const handleSaveRow = async (idx) => {
    const row = rows[idx];
    // If user column was changed, delete old and create new
    if (row.userChanged) {
      try {
        // Delete old row (by previous username)
        if (row.prevUsername) {
          await fetch('/api/relationship-manager', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: row.prevUsername }),
          });
        }
        // Create new row
        const res = await fetch('/api/relationship-manager', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: row.user,
            role: row.role,
            manager: row.manager,
            email: row.email,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setRows(prev => prev.map((r, i) => i === idx ? { ...r, isNew: false, isDirty: false, userChanged: false, prevUsername: undefined } : r));
          alert('Row saved!');
        } else {
          alert(data.error || 'Failed to save row');
        }
      } catch (err) {
        alert('Failed to save row');
      }
      return;
    }
    // If manager or other field changed, PATCH
    const isEdit = !row.isNew;
    try {
      const res = await fetch('/api/relationship-manager', {
        method: isEdit ? 'PATCH' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: row.user,
          role: row.role,
          manager: row.manager,
          email: row.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRows(prev => prev.map((r, i) => i === idx ? { ...r, isNew: false, isDirty: false } : r));
        alert('Row saved!');
      } else {
        alert(data.error || 'Failed to save row');
      }
    } catch (err) {
      alert('Failed to save row');
    }
  };

  // Send password handler (placeholder for now)
  const handleSendPassword = async (row) => {
    // TODO: Implement actual email sending via backend
    alert(`Password email would be sent to ${row.email}`);
  };

  // Render dropdown for users
  const renderUserDropdown = (row, idx) => (
    <select
      value={row.isCustomUser ? 'custom' : row.user}
      onChange={e => handleUserDropdown(idx, e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option key="select-user" value="">Select user</option>
      {users.map(u => (
        <option key={u.username} value={u.username}>{u.username}</option>
      ))}
      <option key="custom-user" value="custom">Custom</option>
    </select>
  );

  // Render dropdown for role
  const renderRoleDropdown = (row, idx) => (
    <select
      value={row.role}
      onChange={e => handleRoleDropdown(idx, e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option key="select-role" value="">Select role</option>
      <option key="admin-role" value="admin">admin</option>
      <option key="manager-role" value="manager">manager</option>
      <option key="employee-role" value="employee">employee</option>
      <option key="custom-role" value="custom">Custom</option>
    </select>
  );

  // Render dropdown for manager
  const renderManagerDropdown = (row, idx) => (
    <select
      value={row.isCustomManager ? 'custom' : row.manager}
      onChange={e => handleManagerDropdown(idx, e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option key="select-manager" value="">Select manager</option>
      {managers.filter(m => m.username !== row.user).map(m => (
        <option key={m.username} value={m.username}>{m.username}</option>
      ))}
      <option key="custom-manager" value="custom">Custom</option>
    </select>
  );

  // Render manager input (if custom)
  const renderManagerInput = (row, idx) => (
    <Input
      value={row.manager}
      onChange={e => handleManagerInput(idx, e.target.value)}
      placeholder="Enter manager name"
      className="border rounded px-2 py-1"
    />
  );

  // Render role input (if custom)
  const renderRoleInput = (row, idx) => (
    <Input
      value={row.role}
      onChange={e => handleRoleInput(idx, e.target.value)}
      placeholder="Enter role"
      className="border rounded px-2 py-1"
    />
  );

  // Render user input (if custom)
  const renderUserInput = (row, idx) => (
    <Input
      value={row.user}
      onChange={e => handleUserInput(idx, e.target.value)}
      placeholder="Enter username"
      className="border rounded px-2 py-1"
    />
  );

  return (
    <div className="p-6 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
      <div className="flex items-center mb-4">
        <Button onClick={handleAddRow} className="mr-4">New</Button>
        <h2 className="text-2xl font-bold">Relationship Manager Dashboard</h2>
      </div>
      <Card className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Manager</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b">
                {/* Track previous username for delete logic */}
                {row.userChanged && !row.prevUsername && (row.prevUsername = row.user)}
                <td className="px-4 py-2 border">
                  {row.isCustomUser ? renderUserInput(row, idx) : renderUserDropdown(row, idx)}
                </td>
                <td className="px-4 py-2 border">
                  {row.isCustomUser ? (row.isCustomRole ? renderRoleInput(row, idx) : renderRoleDropdown(row, idx)) : (
                    <Input value={row.role} readOnly className="border rounded px-2 py-1 bg-gray-50" />
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {row.isCustomManager ? renderManagerInput(row, idx) : renderManagerDropdown(row, idx)}
                </td>
                <td className="px-4 py-2 border">
                  <Input value={row.email} onChange={e => handleEmailChange(idx, e.target.value)} className="border rounded px-2 py-1" placeholder="Enter email address" />
                </td>
                <td className="px-4 py-2 border text-center">
                  {(row.isNew || row.isDirty) ? (
                    <Button onClick={() => handleSaveRow(idx)} variant="default">Save</Button>
                  ) : (
                    <Button onClick={() => handleSendPassword(row)} variant="outline">Send Password</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
