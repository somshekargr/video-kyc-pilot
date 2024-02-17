import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer, KYCStatus } from 'src/entity/customer.entity';
import { KYCSessionQueue } from 'src/entity/kyc-session-queue.entity';
import { MoreThan, Repository } from 'typeorm';
import { CustomerDTO } from '../dto/customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,
        @InjectRepository(KYCSessionQueue)
        private readonly kycSessionRepo: Repository<KYCSessionQueue>
    ) { }

    async registerNewCustomer(newRegistrationDTO: CustomerDTO): Promise<CustomerDTO> {
        const existingCustomer = await this.customerRepo.findOne({
            where: {
                panNumber: newRegistrationDTO.panNumber
            }
        });

        if (existingCustomer != null) {
            throw new ConflictException(`Customer with the PAM Number ${newRegistrationDTO.panNumber} already exists.`);
        }

        const newCustomer = await this.customerRepo.save(new Customer({
            name: newRegistrationDTO.name,
            panNumber: newRegistrationDTO.panNumber,
            email: newRegistrationDTO.email,
            phone: newRegistrationDTO.phone,
            kycStatus: newRegistrationDTO.kycStatus,
            dob: newRegistrationDTO.dob,
            careof: newRegistrationDTO.careof,
            photo: newRegistrationDTO.photo,
            villageTownCity: newRegistrationDTO.addressInfo.villageTownCity,
            aadharName: newRegistrationDTO.addressInfo.aadharName,
            country: newRegistrationDTO.addressInfo.country,
            street: newRegistrationDTO.addressInfo.street,
            state: newRegistrationDTO.addressInfo.state,
            post: newRegistrationDTO.addressInfo.post,
            pincode: newRegistrationDTO.addressInfo.pincode,
            location: newRegistrationDTO.addressInfo.location,
            landmark: newRegistrationDTO.addressInfo.landmark,
            house: newRegistrationDTO.addressInfo.house,
            district: newRegistrationDTO.addressInfo.district,
            subDistrict: newRegistrationDTO.addressInfo.subDistrict,
            registeredOn: new Date(),
            consentAccepted: newRegistrationDTO.consentAccepted
        }));

        return { ...newCustomer, id: newCustomer.id };
    }


    async isRegistered(panNumber: string): Promise<boolean> {
        const customer = await this.customerRepo.findOne({
            where: {
                panNumber: panNumber
            }
        });

        return customer === undefined ? false : true;
    }

    async findOne(id: number): Promise<CustomerDTO> {
        const customer = await this.customerRepo.findOne({
            where: {
                id: id
            }
        });

        let dto = this.getViewModel(customer);

        return dto;
    }


    getViewModel(customer: Customer): CustomerDTO {
        let dto: CustomerDTO = {
            id: customer.id,
            photo: customer.photo,
            careof: customer.careof,
            dob: customer.dob,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            panNumber: customer.panNumber,
            kycStatus: customer.kycStatus,
        };
        
        dto.addressInfo = {};
        dto.addressInfo.villageTownCity = customer.villageTownCity;
        dto.addressInfo.aadharName = customer.aadharName;
        dto.addressInfo.country = customer.country;
        dto.addressInfo.street = customer.street;
        dto.addressInfo.state = customer.state;
        dto.addressInfo.post = customer.post
        dto.addressInfo.pincode = customer.pincode;
        dto.addressInfo.location = customer.location;
        dto.addressInfo.landmark = customer.landmark;
        dto.addressInfo.house = customer.house;
        dto.addressInfo.district = customer.district;
        dto.addressInfo.subDistrict = customer.subDistrict;

        return dto;
    }

    async findOneByQueueId(queueId: number): Promise<CustomerDTO> {
        const queue = await this.kycSessionRepo.findOne({
            where: {
                id: queueId
            }
        });

        if (queue)
            return await this.findOne(queue.customerId);

        return null;
    }

    async getCustomerByPAN(panNumber: string): Promise<CustomerDTO> {
        const customer = await this.customerRepo.findOne({
            where: {
                panNumber: panNumber
            }
        });

        if (customer != undefined)
            return this.getViewModel(customer);

        return null;
    }

    async updateKycStatus(id: number, kycStatus: KYCStatus): Promise<boolean> {

        let customer = await this.customerRepo.findOne({
            where: {
                id: id
            }
        });

        if (customer == null) {
            throw new ConflictException(`Customer not found with the Id ${customer.id}.`);
        }

        customer.kycStatus = kycStatus;

        await this.customerRepo.save(customer);
        return true;
    }

    async deleteAllEntries(): Promise<boolean> {
        await this.customerRepo.delete({ id: MoreThan(0) });
        await this.kycSessionRepo.delete({ id: MoreThan(0) });
        return true;
    }
}
