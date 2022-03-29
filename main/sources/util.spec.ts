import test from 'ava';
import { isValidAudioFile, sortInCanonicalOrder, lettersToNumber } from './util';

test('sorts books canonically', (t) => {
  const bookNames = ['Revelation', 'Genesis', 'Matthew', 'Psalms'];
  t.deepEqual(sortInCanonicalOrder(bookNames), ['Genesis', 'Psalms', 'Matthew', 'Revelation']);
});

test('appends unrecognised books to end', (t) => {
  const bookNames = ['Revelation', 'Genesis', 'Not-a-book', 'Matthew', 'Psalms'];
  t.deepEqual(sortInCanonicalOrder(bookNames), ['Genesis', 'Psalms', 'Matthew', 'Revelation', 'Not-a-book']);
});

test('check valid audio file', (t) => {
  const fileName = 'audioFile.wav';
  const audioFilters = ['mp3', 'wav'];
  t.true(isValidAudioFile(fileName, audioFilters));
});

test('check not valid audio file', (t) => {
  const fileName = 'notAnAudioFile.badExtension';
  const audioFilters = ['mp3', 'wav'];
  t.false(isValidAudioFile(fileName, audioFilters));
});

test('converts letters to numbers', (t) => {
  const tests = [
    { input: 'a', expectedOutput: 0 },
    { input: 'z', expectedOutput: 25 },
    { input: 'aa', expectedOutput: 26 },
    { input: 'zz', expectedOutput: 701 },
    { input: 'm', expectedOutput: 12 },
    { input: 'abcdefg', expectedOutput: 334123302 },
  ];
  for (const test of tests) {
    const result = lettersToNumber(test.input);
    t.is(result, test.expectedOutput);
  }
});
