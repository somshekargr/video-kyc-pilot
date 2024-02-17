import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { ChangeTracking } from './entity-change-tracking-cols';

export enum UserRole {
  none = 0,
  administrator = 1,
  agent = 2
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'userType' } })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  mobileNo: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.none
  })
  userRole: UserRole;

  @Column(() => ChangeTracking, { prefix: false })
  changeTracking: ChangeTracking;

  constructor(initialValues?: Partial<User>) {
    if (initialValues) {
      Object.assign(this, initialValues);

      if (initialValues.password) {
        this.password = User.encryptPassword(initialValues.username, initialValues.password);
      }
    }
  }

  public static async compare(plainPassword: string, encryptedPassword: string) {
    const isMatch = await bcrypt.compare(plainPassword, encryptedPassword);

    return isMatch;
  }

  public static encryptPassword(username: string, password: string) {
    return bcrypt.hashSync(password, 10);
  }
}