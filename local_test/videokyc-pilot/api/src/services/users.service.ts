import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { NewUserDTO } from '../dto/new-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) { }
    async findOne(username: string): Promise<User | undefined> {
        return await this.userRepo.findOne({
            where: {
                username
            }
        });
    }

    async registerNewCustomer(newUserDTO: NewUserDTO): Promise<NewUserDTO> {
        const existingUser = await this.userRepo.findOne({
            where: {
                email: newUserDTO.email,
                username: newUserDTO.username
            }
        });

        if (existingUser != null) {
            throw new ConflictException(`Customer with the Email Id ${newUserDTO.email} already exists.`);
        }

        let user = new User({
            name: newUserDTO.name,
            email: newUserDTO.email,
            mobileNo: newUserDTO.mobileNo,
            password: newUserDTO.password,
            username: newUserDTO.username,
            userRole: newUserDTO.userRole
        });
        const newUser = await this.userRepo.save(user);

        let dtoModel = new NewUserDTO({
            id: newUser.id,
            name: newUser.name,
            userRole: newUser.userRole,
            email: newUser.email,
            mobileNo: newUser.mobileNo,
            username: newUser.username
        });

        return dtoModel;
    }

    async findOneById(id: number): Promise<User | undefined> {
        let data = await this.userRepo.findOne({
            where: {
                id
            }
        });

        //Deleting the secured information before sending to DTO
        var clone = Object.assign({}, data);
        delete clone.password;

        return clone;
    }

    async deleteAllEntries(): Promise<boolean> {
        await this.userRepo.delete({ id: MoreThan(0) });
        return true;
    }
}
