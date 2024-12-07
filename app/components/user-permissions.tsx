'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"

interface Permission {
  view: boolean;
  edit: boolean;
  create: boolean;
  delete: boolean;
}

interface Permissions {
  positions: Permission;
  training: Permission;
  manager: Permission;
  operations: Permission;
  status: Permission;
  users: Permission;
}

interface UserPermissionsProps {
  userId: number;
  onClose: () => void;
}

export default function UserPermissions({ userId, onClose }: UserPermissionsProps) {
  const { toast } = useToast()
  const [permissions, setPermissions] = useState<Permissions>({
    positions: { view: false, edit: false, create: false, delete: false },
    training: { view: false, edit: false, create: false, delete: false },
    manager: { view: false, edit: false, create: false, delete: false },
    operations: { view: false, edit: false, create: false, delete: false },
    status: { view: false, edit: false, create: false, delete: false },
    users: { view: false, edit: false, create: false, delete: false },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/users/${userId}/permissions`)
        if (!response.ok) {
          throw new Error('Failed to fetch permissions')
        }
        const data = await response.json()
        if (Object.keys(data).length === 0) {
          // Si no hay permisos, usamos los valores por defecto
          setPermissions({
            positions: { view: false, edit: false, create: false, delete: false },
            training: { view: false, edit: false, create: false, delete: false },
            manager: { view: false, edit: false, create: false, delete: false },
            operations: { view: false, edit: false, create: false, delete: false },
            status: { view: false, edit: false, create: false, delete: false },
            users: { view: false, edit: false, create: false, delete: false },
          })
        } else {
          setPermissions(data)
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
        setError('Failed to fetch permissions. Please try again.')
        toast({
          title: "Error",
          description: "Failed to fetch permissions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchPermissions()
  }, [userId, toast])

  const handlePermissionChange = (section: keyof Permissions, permission: keyof Permission) => {
    if (permissions) {
      setPermissions(prev => ({
        ...prev!,
        [section]: {
          ...prev![section],
          [permission]: !prev![section][permission]
        }
      }))
    }
  }

  const handleSavePermissions = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions)
      })
      if (!response.ok) {
        throw new Error('Failed to update permissions')
      }
      toast({
        title: "Success",
        description: "Permissions updated successfully.",
      })
      onClose()
    } catch (error) {
      console.error('Error updating permissions:', error)
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading permissions...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (Object.keys(permissions).length === 0) {
    return <div>No permissions found.</div>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Manage Permissions</h2>
        {Object.entries(permissions).map(([section, perms]) => (
          <div key={section} className="mb-4">
            <h3 className="text-lg font-semibold capitalize mb-2">{section}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(perms).map(([perm, value]) => (
                <div key={perm} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${section}-${perm}`}
                    checked={value}
                    onCheckedChange={() => handlePermissionChange(section as keyof Permissions, perm as keyof Permission)}
                  />
                  <Label htmlFor={`${section}-${perm}`} className="capitalize">{perm}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSavePermissions}>Save Permissions</Button>
        </div>
      </div>
    </div>
  )
}

