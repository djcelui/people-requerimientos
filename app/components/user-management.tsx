'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Checkbox } from "@/app/components/ui/checkbox"
import { PlusCircle, Trash2, Edit2, Settings } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import UserPermissions from './user-permissions'
import { useToast } from "@/app/components/ui/use-toast"

export default React.memo(function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: 'User',
    active: true
  })
  const [editingUser, setEditingUser] = useState(null)
  const [showPermissions, setShowPermissions] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users. Please try again.')
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        })
        toast({
          title: "Success",
          description: "User updated successfully.",
        })
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        })
        toast({
          title: "Success",
          description: "User created successfully.",
        })
      }
      fetchUsers()
      setNewUser({ name: '', email: '', role: 'User', active: true })
      setEditingUser(null)
    } catch (error) {
      console.error('Error submitting user:', error)
      toast({
        title: "Error",
        description: "Failed to submit user. Please try again.",
        variant: "destructive",
      })
    }
  }, [editingUser, newUser, fetchUsers, toast])

  const handleEdit = useCallback((user) => {
    setNewUser(user)
    setEditingUser(user)
  }, [])

  const handleDelete = useCallback(async (id) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      fetchUsers()
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }, [fetchUsers, toast])

  const handleManagePermissions = useCallback((userId) => {
    setSelectedUserId(userId)
    setShowPermissions(true)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Username</Label>
          <Input id="name" name="name" value={newUser.name} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={newUser.email} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={newUser.role}
            onValueChange={(value) => setNewUser(prev => ({...prev, role: value}))}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="active" 
            checked={newUser.active} 
            onCheckedChange={(checked) => {
              setNewUser((prev) => ({ ...prev, active: checked }));
            }}
          />
          <Label htmlFor="active">Active</Label>
        </div>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          {editingUser ? 'Update User' : 'Create User'}
        </Button>
      </form>

      {!isLoading && !error && users.length === 0 && <p>No users found.</p>}
      {!isLoading && !error && users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>{user.lastLogin || 'Never'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(user)} className="mr-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleManagePermissions(user.id)} className="mr-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {showPermissions && (
        <UserPermissions 
          userId={selectedUserId} 
          onClose={() => setShowPermissions(false)} 
        />
      )}
    </div>
  )
})

