// // src/infrastructure/http/controllers/AuthController.ts
// import { Request, Response, NextFunction } from 'express';
// import { AuthService } from '../../../application/AuthService';
// import { Role } from '../../../domain/Role';

// export class AuthController {
//   constructor(
//     private readonly authService: AuthService // <- injected dependency
//   ) {}

//   register = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, email, password, role } = req.body;

//       const result = await this.authService.register(
//         name,
//         email,
//         password,
//         role as Role
//       );

//       res.status(201).json({
//         user: {
//           id: result.user.id,
//           name: result.user.name,
//           email: result.user.email,
//           role: result.user.role,
//         },
//         token: result.token,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

//   login = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, password } = req.body;
//       const result = await this.authService.login(email, password);

//       res.json({
//         user: {
//           id: result.user.id,
//           name: result.user.name,
//           email: result.user.email,
//           role: result.user.role,
//         },
//         token: result.token,
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
// }