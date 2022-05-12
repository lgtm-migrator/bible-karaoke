import test from 'ava';
import { isValidAudioFile, sortInCanonicalOrder, lettersToNumber, createPhraseArray, createPhraseChars } from './util';

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

test('create phrase array', (t) => {
  const inputVerse = 'The words of Amos, who was!! among. the herdsmen? of Tekoa; wha:t he saw';
  const inputPhraseEndChars = '.?! : ;, \\u0065';
  const expectedResult = [
    'Th',
    'words of Amos',
    'who was',
    'among',
    'th',
    'h',
    'rdsm',
    'n',
    'of T',
    'koa',
    'wha',
    't h',
    'saw',
  ];
  const result = createPhraseArray(inputVerse, inputPhraseEndChars);
  t.deepEqual(result, expectedResult);
});

test('create phrase array split with spaces', (t) => {
  const inputVerse = 'The words of Amos, who was!! among. the herdsmen? of Tekoa; wha:t he saw';
  const inputPhraseEndChars = '\\s.?! : \\s;, \\u0065';
  const expectedResult = [
    'Th',
    'words',
    'of',
    'Amos',
    'who',
    'was',
    'among',
    'th',
    'h',
    'rdsm',
    'n',
    'of',
    'T',
    'koa',
    'wha',
    't',
    'h',
    'saw',
  ];
  const result = createPhraseArray(inputVerse, inputPhraseEndChars);
  t.deepEqual(result, expectedResult);
});

test('create phrase chars', (t) => {
  const input = '.?!:;,\\u0065\\s\\u0066';
  const result = createPhraseChars(input);
  t.deepEqual(result, ['.', '?', '!', ':', ';', ',', 'e', ' ', 'f']);
});
