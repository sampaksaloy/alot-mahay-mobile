import { ratingRepositoryImpl } from '../../data/repositories/ratingRepositoryImpl';

export async function submitRatingUseCase({ queueId, rating, feedback }) {
  if (!rating || rating < 1 || rating > 5) throw new Error('Pilia ang rating 1-5');
  return ratingRepositoryImpl.create(queueId, rating, feedback);
}
