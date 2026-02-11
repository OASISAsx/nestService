import { PaginationDto } from './PaginationDto';

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => ({
  total,
  page,
  limit,
  totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
});

export const getPagination = ({ page, limit }: PaginationDto) => {
  const take = limit;
  const skip = (page - 1) * take;

  return {
    take,
    skip,
    page,
    limit,
  };
};
