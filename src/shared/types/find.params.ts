// import {  } from '@prisma/client';
import { Prisma } from 'generated/prisma/client';

export type FindParams<T> = {
  where?: Prisma.UserWhereInput,
  select?: Prisma.UserSelect,
  include?: Prisma.UserInclude,
  orderBy?: Prisma.UserOrderByWithRelationInput,
  take?: number,   // limit
  skip?: number,   // pagination, page
};

export type FindOneParams<T> = Omit<FindParams<T>, 'take' | 'skip' | 'orderBy'>;
