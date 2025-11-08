import React from 'react';
import AssignmentUpload from 'src/app/components/AssignmentUpload';
import { useParams } from 'react-router-dom';

export default function AssignmentSubmitPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  if (!assignmentId) return <div>Invalid assignment.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Submit for assignment #{assignmentId}</h1>
      <AssignmentUpload assignmentId={assignmentId} />
    </div>
  );
}
