import { PaginationDto } from './PaginationDto';

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

type PaginationResult = {
  take?: number;
  skip?: number;
  page: number;
  limit: number;
};

export const getPagination = (dto?: PaginationDto): PaginationResult => {
  const page = Number(dto?.page);
  const limit = Number(dto?.limit);

  if (!page || !limit || page < 1 || limit < 1) {
    return {
      page: 1,
      limit: 10,
      take: undefined,
      skip: undefined, // 👈 ต้องเป็น undefined ไม่ใช่ไม่มี key
    };
  }

  return {
    page,
    limit,
    take: limit,
    skip: (page - 1) * limit,
  };
};
