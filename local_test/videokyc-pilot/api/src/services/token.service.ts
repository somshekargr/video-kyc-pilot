// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class TokenService {
//     constructor(private readonly jwtService: JwtService) { }

//     getTokenTypeFromWsToken(authToken: string): string {
//         try {
//             const decodedToken = this.jwtService.verify(authToken);
//             const tokenType = decodedToken['tokenType'];
//             return tokenType;
//         }
//         catch
//         {
//             throw Error("");
//         }
//     }
// }
