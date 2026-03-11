import { toast } from 'sonner';

export function handleMutationError(error: any) {
  console.error('Mutation Error:', error);

  // ApiEnvelope structure: error.message, error.details[]
  const message = error.message || 'An unexpected error occurred';
  const details = error.details;

  if (Array.isArray(details) && details.length > 0) {
    // Show each validation error as a separate toast
    details.forEach((err: any) => {
      const field = err.field ? `${err.field}: ` : '';
      toast.error(`${field}${err.error || err.message || 'Validation failed'}`);
    });
  } else {
    // Fallback to top-level message
    toast.error(message);
  }
}
