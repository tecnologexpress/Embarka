export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validateEmail(email);
    this.validateName(name);
  }

  private validateEmail(prm_email: string): void {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(prm_email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateName(prm_name: string): void {
    if (!prm_name || prm_name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
  }

  updateName(prm_new_name: string): UserEntity {
    return new UserEntity(
      this.id,
      prm_new_name,
      this.email,
      this.createdAt,
      new Date()
    );
  }

  updateEmail(prm_new_email: string): UserEntity {
    return new UserEntity(
      this.id,
      this.name,
      prm_new_email,
      this.createdAt,
      new Date()
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}