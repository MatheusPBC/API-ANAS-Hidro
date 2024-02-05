export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly project: string;
  access_key?: string;
  secret_access_token_id?: string;
}
