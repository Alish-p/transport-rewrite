import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _appFeatured = [...Array(3)].map((_, index) => ({
  id: _mock.id(index + 3),
  title: _mock.postTitle(index + 3),
  description: _mock.sentence(index + 3),
  coverUrl: _mock.image.cover(index + 3),
}));
