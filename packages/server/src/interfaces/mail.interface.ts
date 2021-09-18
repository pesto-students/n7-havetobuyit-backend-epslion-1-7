export interface SendOptions {
  subject: string;
  to: {
    email: string;
    name: string;
    type: string;
  }[];
  from_name: string;
  from_email: string;
  html: string;
}
