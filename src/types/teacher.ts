export interface TeacherData {
  firstName: string;
  lastName: string;
  email: string;
  address?: string | null;
  phone?: string | null;
  class?: {
    name: string;
  } | null;
  subject?: {
    name: string;
  } | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
