// import { SetMetadata } from '@nestjs/common';

// // 'roles' metadata'sını set ediyoruz
// export const Roles = (...roles: string[]) => SetMetadata('roles', roles);


import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);