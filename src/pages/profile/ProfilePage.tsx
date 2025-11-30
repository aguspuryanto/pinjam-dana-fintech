// src/pages/profile/ProfilePage.tsx
import { useState, useEffect, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/useLocalStorage'
import { Member } from '@/types/member'

export default function ProfilePage() {
  // Mock user data
  // const user = {
  //   name: 'John Doe',
  //   email: 'john@example.com',
  //   role: 'Administrator',
  //   joinDate: 'January 2023',
  // }
  
  const [userEmail] = useLocalStorage('userEmail', '')
  // console.log(userEmail)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [editableUser, setEditableUser] = useState<Member | null>(null)
  const [user, setUser] = useState<Member | null>(null)
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/members')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const members = await response.json()
        const foundUser = members.find((member: Member) => member.email === userEmail)
        
        if (foundUser) {
          const userData: Member = {
            ...foundUser,
            role: foundUser.role || 'Member',
            status: foundUser.status || 'active',
            createdAt: foundUser.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          setUser(userData)
          setEditableUser({...userData})
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (userEmail) {
      fetchUserData()
    }
  }, [userEmail])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editableUser) return
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    startTransition(async () => {
      try {
        // Update the user data in db.json via JSON Server API
        const response = await fetch(`api/members/${editableUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editableUser,
            updatedAt: new Date().toISOString()
          })
        });
        
        if (!response.ok) throw new Error('Gagal menyimpan profil')
        
        const updatedUser = await response.json()
        setUser(updatedUser)
        setEditableUser({...updatedUser})
        setSaveSuccess(true)
        
        // Sembunyikan pesan sukses setelah 3 detik
        setTimeout(() => setSaveSuccess(false), 3000)
      } catch (error) {
        console.error('Error menyimpan profil:', error)
        alert('Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.')
      } finally {
        setIsSaving(false)
      }
    })
  }

  // Add loading state
  if (!user || !editableUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
          Profile updated successfully!
        </div>
      )}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={editableUser.name} 
                  onChange={(e) => setEditableUser({...editableUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={editableUser.email} disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={editableUser.role} disabled />
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <Input value={editableUser.createdAt} disabled />
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditableUser({...user})} 
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}