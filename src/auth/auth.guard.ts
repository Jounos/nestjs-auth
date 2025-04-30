import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from 'generated/prisma';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService,
        private caslAbilityService: CaslAbilityService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        
        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = this.jwtService.verify<{ name: string, email: string, role: Roles, sub: string}>(token, { algorithms: ['HS256'] });
            //TODO: pegar o usuário e adicionar na request

            const user = await this.prismaService.user.findUnique({
                where: { id: payload.sub }
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }  

            request.user = user;
            this.caslAbilityService.createForUser(user);
            
            return true;
        } catch(e) {
            console.log(e);
            throw new UnauthorizedException('Invalid Token', { cause: e });
        }
    }
}
