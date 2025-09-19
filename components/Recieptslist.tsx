'use client';

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doc } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { ChevronRight, FileText } from 'lucide-react';

function Recieptslist() {
  const router = useRouter();
  const { user } = useUser();
  const reciepts = useQuery(api.receipts.getReceipts, {
    userId: user?.id || "",
  });

  if (!user) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-gray-600'>Please sign in to view your receipts.</p>
      </div>
    );
  }

  if (!reciepts) {
    return (
      <div className='w-full p-8 text-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
        <p className='mt-2 text-gray-600'>Loading receipts...</p>
      </div>
    );
  }

  if (reciepts.length === 0) {
    return (
      <div className='w-full p-8 text-center border border-gray-200 rounded-lg bg-gray-50'>
        <p className='text-gray-600'>No receipts have been uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <h2 className='text-xl font-semibold mb-4'>Your Receipts</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reciepts.map((reciept: Doc<"receipts">) => (
              <TableRow
                key={reciept._id}
                className='cursor-pointer hover:bg-gray-50'
                onClick={() => router.push(`/receipt/${reciept._id}`)}
              >
                <TableCell className='py-2 text-center'>
                  <FileText className='h-5 w-5 text-red-500' />
                </TableCell>
                <TableCell className='font-medium'>
                  {reciept.fileDisplayName || reciept.filename}
                </TableCell>
                <TableCell>{new Date(reciept.uploadedAt).toLocaleString()}</TableCell>
                <TableCell>{formatFileSize(reciept.size)}</TableCell>
                <TableCell>
                  {reciept.transactionAmount
                    ? `${reciept.transactionAmount} ${reciept.currency || ""}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      reciept.status === 'pending'
                        ? "bg-yellow-100 text-yellow-800"
                        : reciept.status === 'processed'
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {reciept.status.charAt(0).toUpperCase() + reciept.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className='text-right'>
                  <ChevronRight className='h-5 w-5 text-gray-400 ml-auto' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Recieptslist;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
