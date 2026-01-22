'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import UserForm from '@/components/admin/UserForm';
import UsersList from '@/components/admin/UsersList';
import CertificateCard from '@/components/CertificateCard';

interface User {
  id: string;
  certificateNo: string;
  referenceNo: string;
  name: string;
  idNo: string;
  company: string;
  issuanceNo: string;
  issuedDate: Date;
  validUntil: Date;
  type: string;
  model?: string | null;
  trainer?: string | null;
  location?: string | null;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('admin');
    }
    return false;
  });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingCard, setViewingCard] = useState<User | null>(null);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/admin');
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setViewingCard(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setViewingCard(null);
    setShowForm(true);
  };

  const handleViewCard = (user: User) => {
    setViewingCard(user);
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleCardClose = () => {
    setViewingCard(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logo.jpeg"
                alt="e-Verification"
                width={60}
                height={60}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage certificates and users</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewingCard ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Certificate Card - {viewingCard.name}
              </h2>
              <Button onClick={handleCardClose} variant="outline">
                Back to List
              </Button>
            </div>

            <CertificateCard user={viewingCard} />
          </div>
        ) : !showForm ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
              <Button onClick={handleAddUser} size="lg">
                Add New User
              </Button>
            </div>

            <UsersList onEdit={handleEditUser} onViewCard={handleViewCard} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <Button onClick={handleFormClose} variant="outline">
                Back to List
              </Button>
            </div>

            <UserForm user={editingUser} onSuccess={handleFormClose} />
          </div>
        )}
      </main>
    </div>
  );
}
