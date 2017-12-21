import search from '../search';
import searchTestResultObjects from './searchTestResultObjects.json';

it('expandRefsSliceForMatchingScores 1', () => {
  const refs = [
    { ref:'ref one', score:1 },
    { ref:'ref two', score:1 },
    { ref:'ref three', score:1 },
    { ref:'ref four', score:1 },
    { ref:'ref five', score:1 },
    { ref:'ref six', score:1 },
    { ref:'ref seven', score:2 },
    { ref:'ref eight', score:2 },
    { ref:'ref nine', score:2 },
    { ref:'ref ten', score:2 },
    { ref:'ref 11', score:2 },
    { ref:'ref 12', score:2 },
    { ref:'ref 13', score:2 },
    { ref:'ref 14', score:2 },
  ];


  const { maxIndex, minIndex } = search.expandRefsSliceForMatchingScores(refs, 3, 8);

  expect(minIndex).toEqual(0);
  expect(maxIndex).toEqual(refs.length - 1);
});


it('expandRefsSliceForMatchingScores expand min but not max', () => {
  const refs = [
    { ref:'ref one', score:1 },
    { ref:'ref two', score:1 },
    { ref:'ref three', score:1 },
    { ref:'ref four', score:1 },
    { ref:'ref five', score:1 },
    { ref:'ref six', score:1 },
    { ref:'ref seven', score:2 },
    { ref:'ref eight', score:2 },
    { ref:'ref nine', score:3 },
    { ref:'ref ten', score:3 },
    { ref:'ref 11', score:3 },
    { ref:'ref 12', score:3 },
    { ref:'ref 13', score:3 },
    { ref:'ref 14', score:3 },
  ];


  const { maxIndex, minIndex } = search.expandRefsSliceForMatchingScores(refs, 3, 7);

  expect(minIndex).toEqual(0);
  expect(maxIndex).toEqual(7);
});


it('expandRefsSliceForMatchingScores expand max but not min', () => {
  const refs = [
    { ref:'ref one', score:1 },
    { ref:'ref two', score:1 },
    { ref:'ref three', score:1 },
    { ref:'ref four', score:1 },
    { ref:'ref five', score:1 },
    { ref:'ref six', score:1 },
    { ref:'ref seven', score:2 },
    { ref:'ref eight', score:2 },
    { ref:'ref nine', score:3 },
    { ref:'ref ten', score:3 },
    { ref:'ref 11', score:3 },
    { ref:'ref 12', score:3 },
    { ref:'ref 13', score:3 },
    { ref:'ref 14', score:3 },
  ];


  const { maxIndex, minIndex } = search.expandRefsSliceForMatchingScores(refs, 6, 8);

  expect(minIndex).toEqual(6);
  expect(maxIndex).toEqual(13);
});


it('expandRefsSliceForMatchingScores expand neither', () => {
  const refs = [
    { ref:'ref one', score:1 },
    { ref:'ref two', score:1 },
    { ref:'ref three', score:1 },
    { ref:'ref four', score:1 },
    { ref:'ref five', score:1 },
    { ref:'ref six', score:1 },
    { ref:'ref seven', score:2 },
    { ref:'ref eight', score:2 },
    { ref:'ref nine', score:3 },
    { ref:'ref ten', score:3 },
    { ref:'ref 11', score:3 },
    { ref:'ref 12', score:3 },
    { ref:'ref 13', score:3 },
    { ref:'ref 14', score:3 },
  ];


  const { maxIndex, minIndex } = search.expandRefsSliceForMatchingScores(refs, 6, 7);

  expect(minIndex).toEqual(6);
  expect(maxIndex).toEqual(7);
});


it('expandRefsSliceForMatchingScores lessen max if refs length is small', () => {
  const refs = [
    { ref:'ref one', score:1 },
    { ref:'ref two', score:2 },
    { ref:'ref three', score:3 },
    { ref:'ref four', score:4 },
  ];


  const { maxIndex, minIndex } = search.expandRefsSliceForMatchingScores(refs, 0, 7);

  expect(minIndex).toEqual(0);
  expect(maxIndex).toEqual(3);
});


it('sortObjectsAfterScore works on empty array', () => {
  const objects = search.sortObjectsAfterScore([]);
  expect(objects.length).toEqual(0);
});


it('sortObjectsAfterScore works on empty array', () => {
  const objects = search.sortObjectsAfterScore(searchTestResultObjects);
  expect(objects[0].class.classId).toEqual('4100');
  expect(objects.length).toEqual(4);


  // The other three order does not matter
  const otherClassIds = [];
  for (let i = 1; i < objects.length; i++) {
    otherClassIds.push(objects[i].class.classId);
  }

  // Sort them here before comparing
  expect(otherClassIds.sort()).toEqual(['5360', '6285', '7305']);
});

