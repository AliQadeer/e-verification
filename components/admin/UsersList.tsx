'use client';

import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

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

interface UsersListProps {
  onEdit: (user: User) => void;
}

export default function UsersList({ onEdit }: UsersListProps) {
  const { data: users, isLoading } = trpc.user.getAll.useQuery();
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const deleteMutation = trpc.user.delete.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
      setDeleteDialog(null);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600 mb-4">No users found. Create your first user to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {users.map((user: User) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* User Photo */}
                <div className="w-20 h-24 relative border-2 border-gray-300 rounded flex-shrink-0">
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* User Details */}
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-600">Name</div>
                    <div className="text-gray-900">{user.name}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600">Certificate No</div>
                    <div className="text-blue-700 font-medium">{user.certificateNo}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600">Reference No</div>
                    <div className="text-gray-900">{user.referenceNo}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600">ID No</div>
                    <div className="text-gray-900">{user.idNo}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600">Company</div>
                    <div className="text-gray-900">{user.company}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600">Type</div>
                    <div className="text-gray-900">{user.type}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600">Issued Date</div>
                    <div className="text-gray-900">{formatDate(user.issuedDate)}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600">Valid Until</div>
                    <div className="text-gray-900">{formatDate(user.validUntil)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    onClick={() => onEdit(user)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteDialog(user.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
