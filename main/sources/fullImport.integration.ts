import { join } from 'path';
import test from 'ava';
import { SOURCE_TYPES } from '../../src/App/constants';
import { BKProject } from '../models/projectFormat.model';
import { testPaths } from '../test/test-path-constants';
import SourceIndex from './index';

test('read-and-import-ht-project', (t) => {
  const source = SourceIndex.getSource(SOURCE_TYPES.hearThis);
  const project = source != null ? source.getBKProjects([testPaths.fixtures]) : [];
  const actual = source != null ? source.reloadProject(project[0]) : [];
  t.deepEqual(actual, expectedHT);
});

test('read-and-import-sab-project', (t) => {
  const source = SourceIndex.getSource(SOURCE_TYPES.scriptureAppBuilder);
  const project = source != null ? source.getBKProjects([testPaths.fixtures]) : [];
  const actual = source != null ? source.reloadProject(project[0]) : [];
  t.deepEqual(actual, expectedSAB);
});

const expectedHT: BKProject = {
  name: testPaths.exampleHearThisProjectName,
  folderPath: testPaths.exampleHearThisProjectPath,
  sourceType: 'hearThis',
  books: [
    {
      name: 'Book1',
      chapters: [
        {
          name: '0',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '0', '0.wav'),
                length: 2300,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '0', '1.wav'),
                length: 5500,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '0', '2.wav'),
                length: 9500,
              },
            ],
            length: 17300,
          },
          segments: [
            {
              segmentId: 1,
              text: 'Li Kalòcè̌ tatai theingǎ',
              verse: '0',
              startTime: 0,
              length: 2300,
              isHeading: true,
            },
            {
              segmentId: 2,
              text: 'Li Kalòcè̌ mè mwaǐ Pò̌lu tyanba Wein Kalòcè̌ ta-aòblonphao.',
              verse: '0',
              startTime: 2300,
              length: 5500,
              isHeading: false,
            },
            {
              segmentId: 3,
              text: 'Wein Kalòcè̌ ǔ mè aò bǎ Kǎn Asǐyǎ, Wein Ěphěsu amô̌nhtan dò aò dô̌ Rǒme tapain kalǎ.',
              verse: '0',
              startTime: 7800,
              length: 9500,
              isHeading: false,
            },
          ],
        },
        {
          name: '1',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '1', '1.wav'),
                length: 3200,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '1', '2.wav'),
                length: 6500,
              },
            ],
            length: 9700,
          },
          segments: [
            {
              segmentId: 2,
              text: 'Tamangaò̌ raò̌rî rî̌kaò̌',
              verse: '0',
              startTime: 0,
              length: 3200,
              isHeading: true,
            },
            {
              segmentId: 3,
              text: 'Tô̌, pracǎnsû̌, prathácô̌n dò Khrī, thapǔwaǐ Wein Kalòcè̌phao aò.',
              verse: '1-2',
              startTime: 3200,
              length: 6500,
              isHeading: false,
            },
          ],
        },
        {
          name: '2',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '2', '1.wav'),
                length: 13600,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '2', '2.wav'),
                length: 16500,
              },
            ],
            length: 30100,
          },
          segments: [
            {
              segmentId: 2,
              text: 'Khǐ thayû̌ daô theingǎ nathû̌ bakyadò khǐ rwǎn ma dô̌ nathû̌ ngǎ cwaǐmǎ, dô̌ Wein Lò̌dikǐphao ngǎ dò pra cô̌ usûba khǐ lakhan lakhan ngǎ cwaǐmǎ arîkaǐ.',
              verse: '1',
              startTime: 0,
              length: 13600,
              isHeading: false,
            },
            {
              segmentId: 3,
              text: 'Khǐ rwǎn ma cwaǐdò nathû̌ thá ka nî̌ba tamamo, ka aòbloncǔ dò tabathá, ka aòbábwaǐ dò tanāpau byan raò́ cwaǐdò ka theingǎ byan Bweca ta-aòhu aòbî mè mwaǐ Khrī.',
              verse: '2',
              startTime: 13600,
              length: 16500,
              isHeading: false,
            },
          ],
        },
        {
          name: '3',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book1', '3', '0.wav'),
                length: 1400,
              },
            ],
            length: 1400,
          },
          segments: [
            {
              segmentId: 1,
              text: 'Khǐ rwǎn ma cwaǐdò nathû̌ thá ka nî̌ba tamamo, ka aòbloncǔ dò tabathá, ka aòbábwaǐ dò tanāpau byan raò́ cwaǐdò ka theingǎ byan Bweca ta-aòhu aòbî mè mwaǐ Khrī.',
              verse: '2',
              startTime: 0,
              length: 1400,
              isHeading: false,
            },
          ],
        },
      ],
    },
    {
      name: 'Book2',
      chapters: [
        {
          name: '0',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '0', '1.wav'),
                length: 7600,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '0', '2.wav'),
                length: 20000,
              },
            ],
            length: 27600,
          },
          segments: [
            {
              segmentId: 2,
              text: 'Ngaò̌mò̌n',
              verse: '0',
              startTime: 0,
              length: 7600,
              isHeading: true,
            },
            {
              segmentId: 3,
              text: 'Tô̌ Pracǎnsû̌ dò pra thácô̌n dò Khrī YeSyǔ aò bǎ Wein Ephesu.',
              verse: '1',
              startTime: 7600,
              length: 20000,
              isHeading: false,
            },
          ],
        },
        {
          name: '1',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '1', '1.wav'),
                length: 10500,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '1', '2.wav'),
                length: 12400,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '1', '3.wav'),
                length: 11500,
              },
            ],
            length: 34400,
          },
          segments: [
            {
              segmentId: 2,
              text: 'Bweca marîmaraò́ pa dô̌ Khrī YeSyǔ khaucǎ',
              verse: '0',
              startTime: 0,
              length: 10500,
              isHeading: true,
            },
            {
              segmentId: 3,
              text: 'Lǎrî̌hǎ nathû̌ mwaǐ takhòwèphao dò ma takarǎn katǎ khaucǎ nathû̌ mwaǐ pra thû̌kaǐ.',
              verse: '1',
              startTime: 10500,
              length: 12400,
              isHeading: false,
            },
            {
              segmentId: 4,
              text: 'Beǐnu hǎ nathû̌ macǔ kǎn ǔ caǔ atadaô dò nathû̌ nadeǐn takrau tayaò aò dô̌ maolǎ laǒlǎn akhau.',
              verse: '2',
              startTime: 22900,
              length: 11500,
              isHeading: false,
            },
          ],
        },
        {
          name: '2',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '2', '2.wav'),
                length: 23200,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '2', '3.wav'),
                length: 10100,
              },
              {
                filename: join(testPaths.exampleHearThisProjectPath, 'Book2', '2', '4.wav'),
                length: 10400,
              },
            ],
            length: 43700,
          },
          segments: [
            {
              segmentId: 3,
              text: 'Akhaucǎ khǐ Pò̌lu, Khrī YeSyǔ pralau lanba dô̌ htòn kaǔ dô̌ nathû̌ pracô̌mwaǐ Yǔdaphao ngǎ.',
              verse: '1',
              startTime: 0,
              length: 23200,
              isHeading: false,
            },
            {
              segmentId: 4,
              text: 'Khǐ yû̌ dô̌ nathû̌ nāhyû̌n ba hô̌ Bweca atamarî maraò́ dò atadaô lanba khǐ dô̌ nathû̌ ngǎ rîkaǐ dò Bweca daô nāpau khǐ ta-aò hu aòbi dô̌ tadaôlaô̌ akaǔ thamǎ mè khǐ tyan ba hô̌ nathû̌ cwaǐ kakhau nu laki .',
              verse: '2~3',
              startTime: 23200,
              length: 10100,
              isHeading: false,
            },
            {
              segmentId: 5,
              text: 'Dò nathû̌ mwaǐ pha ba khǐ tatyan mè ka theingǎ khǐ tanāpau Khrī ta-aò hu aòbi aò thamǎ nè.',
              verse: '4',
              startTime: 33300,
              length: 10400,
              isHeading: false,
            },
          ],
        },
      ],
    },
  ],
};

const expectedSAB = {
  name: testPaths.exampleSABProjectName,
  folderPath: testPaths.exampleSABProjectPath,
  sourceType: 'scriptureAppBuilder',
  books: [
    {
      name: 'Mat',
      chapters: [
        {
          name: '1',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Matthew 1.mp3'),
                length: 5016,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'Verse 1 of Matthew,',
              verse: '1',
              startTime: 0,
              length: 1640,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 0,
                  end: 1640,
                },
              ],
            },
            {
              segmentId: 1,
              text: 'followed by verse 2,',
              verse: '2',
              startTime: 1640,
              length: 1600,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 1640,
                  end: 3240,
                },
              ],
            },
            {
              segmentId: 2,
              text: 'and then verse 3.',
              verse: '3',
              startTime: 3240,
              length: 1720,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 3240,
                  end: 4960,
                },
              ],
            },
          ],
        },
        {
          name: '2',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Matthew 2.mp3'),
                length: 6008,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'Matthew chapter 2, verse 1,',
              verse: '1',
              startTime: 0,
              length: 2011.0000000000002,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 0,
                  end: 1141,
                },
                {
                  wordNum: 3,
                  start: 1141,
                  end: 2011.0000000000002,
                },
              ],
            },
            {
              segmentId: 1,
              text: 'chapter 2, verse 2,',
              verse: '2',
              startTime: 2011.0000000000002,
              length: 2114,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 2011.0000000000002,
                  end: 3246,
                },
                {
                  wordNum: 2,
                  start: 3246,
                  end: 4125,
                },
              ],
            },
            {
              segmentId: 2,
              text: 'and chapter 2, verse 3.',
              verse: '3',
              startTime: 4125,
              length: 1835,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 4125,
                  end: 5152,
                },
                {
                  wordNum: 3,
                  start: 5152,
                  end: 5960,
                },
              ],
            },
          ],
        },
        {
          name: '3',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Matthew 3.mp3'),
                length: 6374,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'Matthew chapter 3, verse 1,',
              verse: '1',
              startTime: 0,
              length: 2214,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 0,
                  end: 1386,
                },
                {
                  wordNum: 3,
                  start: 1386,
                  end: 2214,
                },
              ],
            },
            {
              segmentId: 1,
              text: 'chapter 3, verse 2,',
              verse: '2',
              startTime: 2214,
              length: 1843.0000000000005,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 2214,
                  end: 3186,
                },
                {
                  wordNum: 2,
                  start: 3186,
                  end: 4057.0000000000005,
                },
              ],
            },
            {
              segmentId: 2,
              text: 'and chapter 3, verse 3.',
              verse: '3',
              startTime: 4057.0000000000005,
              length: 2262.9999999999995,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 4057.0000000000005,
                  end: 5399,
                },
                {
                  wordNum: 3,
                  start: 5399,
                  end: 6320,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Mrk',
      chapters: [
        {
          name: '1',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Mark 1.mp3'),
                length: 4752,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'Mark verse 1, Mark verse 2,',
              verse: '1-2',
              startTime: 0,
              length: 2820,
              isHeading: false,
              extraTimings: [],
            },
            {
              segmentId: 1,
              text: 'and Mark verse 3.',
              verse: '3',
              startTime: 2820,
              length: 1860,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 2820,
                  end: 4680,
                },
              ],
            },
          ],
        },
        {
          name: '2',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Mark 2.mp3'),
                length: 6531,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'Mark chapter 2, verse 1,',
              verse: '1',
              startTime: 0,
              length: 1868,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 0,
                  end: 717,
                },
                {
                  wordNum: 2,
                  start: 717,
                  end: 968,
                },
                {
                  wordNum: 3,
                  start: 968,
                  end: 1868,
                },
              ],
            },
            {
              segmentId: 1,
              text: 'Mark chapter 2, verse 2,',
              verse: '2',
              startTime: 1868,
              length: 2288,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 1868,
                  end: 2892,
                },
                {
                  wordNum: 2,
                  start: 2892,
                  end: 3188,
                },
                {
                  wordNum: 3,
                  start: 3188,
                  end: 4156,
                },
              ],
            },
            {
              segmentId: 2,
              text: 'and Mark chapter 2, verse 3.',
              verse: '3',
              startTime: 4156,
              length: 2324,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 4156,
                  end: 5600,
                },
                {
                  wordNum: 4,
                  start: 5600,
                  end: 6480,
                },
              ],
            },
          ],
        },
        {
          name: '3',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Mark 3.mp3'),
                length: 7027,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'Mark chapter 3, verse 1,',
              verse: '1',
              startTime: 0,
              length: 2200,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 0,
                  end: 1360,
                },
                {
                  wordNum: 3,
                  start: 1360,
                  end: 2200,
                },
              ],
            },
            {
              segmentId: 1,
              text: 'Mark chapter 3, verse 2,',
              verse: '2',
              startTime: 2200,
              length: 2300,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 2200,
                  end: 3614,
                },
                {
                  wordNum: 3,
                  start: 3614,
                  end: 4500,
                },
              ],
            },
            {
              segmentId: 2,
              text: 'and Mark chapter 3, verse 3.',
              verse: '3',
              startTime: 4500,
              length: 1550,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 4500,
                  end: 6050,
                },
                {
                  wordNum: 4,
                  start: 6050,
                  end: 6050,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Luk',
      chapters: [
        {
          name: '1',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Luke 1.mp3'),
                length: 5208,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'The book of Luke verse one, Luke verse two,',
              verse: '1-2',
              startTime: 0,
              length: 3500,
              isHeading: false,
              extraTimings: [],
            },
            {
              segmentId: 1,
              text: 'and Luke verse three.',
              verse: '3',
              startTime: 3500,
              length: 0,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 3500,
                  end: 3500,
                },
              ],
            },
          ],
        },
        {
          name: '2',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Luke 2.mp3'),
                length: 7549,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'The book of Luke chapter 2, verse one,',
              verse: '1',
              startTime: 0,
              length: 2850,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 0,
                  end: 2850,
                },
              ],
            },
            {
              segmentId: 1,
              text: 'Luke chapter 2, verse two,',
              verse: '2',
              startTime: 2850,
              length: 2110,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 2850,
                  end: 4960,
                },
              ],
            },
            {
              segmentId: 2,
              text: 'and Luke chapter 2, verse three.',
              verse: '3',
              startTime: 4960,
              length: 0,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 4960,
                  end: 4960,
                },
              ],
            },
          ],
        },
        {
          name: '3',
          audio: {
            files: [
              {
                filename: join(testPaths.exampleSABProjectPath, 'ExampleSABProject_audio', 'BK Test Luke 3.mp3'),
                length: 7549,
              },
            ],
          },
          segments: [
            {
              segmentId: 0,
              text: 'The book of Luke chapter 3, verse one,',
              verse: '1',
              startTime: 0,
              length: 2699,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 0,
                  end: 1813,
                },
                {
                  wordNum: 6,
                  start: 1813,
                  end: 2699,
                },
              ],
            },
            {
              segmentId: 1,
              text: 'Luke chapter 3, verse two,',
              verse: '2',
              startTime: 2699,
              length: 2301,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 2699,
                  end: 4205,
                },
                {
                  wordNum: 3,
                  start: 4205,
                  end: 5000,
                },
              ],
            },
            {
              segmentId: 2,
              text: 'and Luke chapter 3, verse three.',
              verse: '3',
              startTime: 5000,
              length: 1440,
              isHeading: false,
              extraTimings: [
                {
                  wordNum: 0,
                  start: 5000,
                  end: 6440,
                },
                {
                  wordNum: 4,
                  start: 6440,
                  end: 6440,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
