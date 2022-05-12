import test from 'ava';
import { BKChapter } from '../models/projectFormat.model';
import { Timings } from '../models/timings.model';
import { chapterFormatToTimings } from './timings';

test('timings.chapterFormatToTimings test', (t) => {
  const chapter: BKChapter = {
    name: '1',
    audio: {
      files: [
        {
          filename: '0.mp3',
          length: 34600,
        },
        {
          filename: '1.mp3',
          length: 56400,
        },
      ],
    },
    segments: [
      {
        segmentId: 1,
        text: 'In the beginning God created the heavens and the earth.',
        verse: '1',
        startTime: 1040,
        length: 5300,
        isHeading: false,
      },
      {
        segmentId: 2,
        text: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
        verse: '2',
        startTime: 7040,
        length: 9300,
        isHeading: false,
      },
    ],
  };
  const expectedTimings: Timings = [
    {
      type: 'caption',
      index: 1,
      start: 1040,
      end: 6340,
      duration: 5300,
      content: 'In the beginning God created the heavens and the earth.',
      isHeading: false,
      words: [
        { end: 1324, start: 1040, word: 'In' },
        { end: 1703, start: 1324, word: 'the' },
        { end: 2649, start: 1703, word: 'beginning' },
        { end: 3028, start: 2649, word: 'God' },
        { end: 3785, start: 3028, word: 'created' },
        { end: 4164, start: 3785, word: 'the' },
        { end: 4921, start: 4164, word: 'heavens' },
        { end: 5300, start: 4921, word: 'and' },
        { end: 5679, start: 5300, word: 'the' },
        { end: 6340, start: 5679, word: 'earth.' },
      ],
      extraTimings: [],
    },
    {
      type: 'caption',
      index: 2,
      start: 7040,
      end: 16340,
      duration: 9300,
      content:
        'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
      isHeading: false,
      words: [
        { end: 7320, start: 7040, word: 'Now' },
        { end: 7600, start: 7320, word: 'the' },
        { end: 8020, start: 7600, word: 'earth' },
        { end: 8300, start: 8020, word: 'was' },
        { end: 8929, start: 8300, word: 'formless' },
        { end: 9209, start: 8929, word: 'and' },
        { end: 9698, start: 9209, word: 'empty,' },
        { end: 10327, start: 9698, word: 'darkness' },
        { end: 10607, start: 10327, word: 'was' },
        { end: 10957, start: 10607, word: 'over' },
        { end: 11237, start: 10957, word: 'the' },
        { end: 11796, start: 11237, word: 'surface' },
        { end: 12006, start: 11796, word: 'of' },
        { end: 12286, start: 12006, word: 'the' },
        { end: 12706, start: 12286, word: 'deep,' },
        { end: 12986, start: 12706, word: 'and' },
        { end: 13266, start: 12986, word: 'the' },
        { end: 13755, start: 13266, word: 'Spirit' },
        { end: 13965, start: 13755, word: 'of' },
        { end: 14245, start: 13965, word: 'God' },
        { end: 14525, start: 14245, word: 'was' },
        { end: 15154, start: 14525, word: 'hovering' },
        { end: 15504, start: 15154, word: 'over' },
        { end: 15784, start: 15504, word: 'the' },
        { end: 16340, start: 15784, word: 'waters.' },
      ],
      extraTimings: [],
    },
  ];

  const timings = chapterFormatToTimings(chapter);
  t.is(timings.length, 2);
  t.deepEqual(timings, expectedTimings);
});
