import { UserEntity } from './entidade/entidade';

export interface UserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryUserRepository implements UserRepository {
  private users: UserEntity[] = [];

  async findAll(): Promise<UserEntity[]> {
    return [...this.users];
  }

  async findById(prm_id: string): Promise<UserEntity | null> {
    return this.users.find(prm_user => prm_user.id === prm_id) || null;
  }

  async findByEmail(prm_email: string): Promise<UserEntity | null> {
    return this.users.find(prm_user => prm_user.email === prm_email) || null;
  }

  async save(prm_user: UserEntity): Promise<UserEntity> {
    const EXISTING_INDEX = this.users.findIndex(prm_u => prm_u.id === prm_user.id);
    
    if (EXISTING_INDEX >= 0) {
      this.users[EXISTING_INDEX] = prm_user;
    } else {
      this.users.push(prm_user);
    }
    
    return prm_user;
  }

  async delete(prm_id: string): Promise<boolean> {
    const INITIAL_LENGTH = this.users.length;
    this.users = this.users.filter(prm_user => prm_user.id !== prm_id);
    return this.users.length < INITIAL_LENGTH;
  }
}