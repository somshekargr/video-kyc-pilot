import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum KYCStatus {
  notStarted = 0,
  scheduled = 1,
  inProgress = 2,
  toBeAudited = 3,
  agentRejected = 4,
  accepted = 5,
  rejected = 6
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  panNumber: string;

  @Column()
  @Column({ nullable: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  careof: string;

  @Column({ nullable: false, default: true })
  consentAccepted: boolean;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: false, default: new Date() })
  registeredOn: Date;

  @Column({ nullable: true })
  villageTownCity: string;

  @Column({ nullable: true })
  aadharName: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  post: string;

  @Column({ nullable: true })
  pincode: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  landmark: string;

  @Column({ nullable: true })
  house: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  subDistrict?: string;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.notStarted
  })
  kycStatus: KYCStatus;

  constructor(initialValues?: Partial<Customer>) {
    if (initialValues) {
      this.name = initialValues.name;
      this.panNumber = initialValues.panNumber;
      this.email = initialValues.email;
      this.phone = initialValues.phone;
      this.careof = initialValues.careof;
      this.photo = initialValues.photo;
      this.dob = initialValues.dob;
      this.villageTownCity = initialValues.villageTownCity;
      this.aadharName = initialValues.aadharName;
      this.country = initialValues.country;
      this.street = initialValues.street;
      this.state = initialValues.state;
      this.post = initialValues.post;
      this.pincode = initialValues.pincode;
      this.location = initialValues.location;
      this.landmark = initialValues.landmark;
      this.house = initialValues.house;
      this.district = initialValues.district;
      this.subDistrict = initialValues.subDistrict;
      this.registeredOn = initialValues.registeredOn;
    }
  }
}