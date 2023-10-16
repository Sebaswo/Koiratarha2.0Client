import { User } from './User';

export default interface ModifyMessageResponse {
  token?: string;
  message: string;
  user: User;
}
