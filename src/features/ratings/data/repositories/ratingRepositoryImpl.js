import { ratingRemoteDataSource } from '../datasources/ratingRemoteDataSource';

export const ratingRepositoryImpl = {
  create: (queueId, rating, feedback) =>
    ratingRemoteDataSource.create({ queue_id: queueId, rating, feedback }),
  list: () => ratingRemoteDataSource.list(),
};
