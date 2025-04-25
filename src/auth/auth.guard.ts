import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        
        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = this.jwtService.verify<{ name: string, email: string}>(token, { algorithms: ['HS256'] });
            //TODO: pegar o usuário e adicionar na request

            return true;
        } catch(e) {
            console.log(e);
            throw new UnauthorizedException('Invalid Token', { cause: e });
        }
        

        return true;
    }
}
