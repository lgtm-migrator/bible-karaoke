import test from 'ava';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp-promise';
import { combineFrames, mergeWavFiles } from './ffmpeg';
import { testPaths } from '../test/test-path-constants';

test('mergeWavFiles smoke test: multiple files: success', async (t) => {
  const wavFiles = [
    path.join(testPaths.exampleHearThisProjectPath, 'Book1', '1', '1.wav'),
    path.join(testPaths.exampleHearThisProjectPath, 'Book1', '1', '2.wav'),
  ];

  const newFilePath = await mergeWavFiles(wavFiles);

  t.true(fs.existsSync(newFilePath));
});

test('ffmpeg combineFrames creates video', async (t) => {
  tmp.setGracefulCleanup();
  const { path: directory, cleanup } = await tmp.dir({ unsafeCleanup: true });
  const ffmpegSettings = {
    audioFiles: [
      path.join(testPaths.exampleHearThisProjectPath, 'Book1', '1', '1.wav'),
      path.join(testPaths.exampleHearThisProjectPath, 'Book1', '1', '2.wav'),
    ],
    audioDuration: 9,
    imagesPath: testPaths.frameImages,
    framerateIn: 15,
    framerateOut: 15,
    outputName: path.join(directory, 'test.mp4'),
    backgroundType: 'color',
    backgroundUrl: '',
  };

  await combineFrames(ffmpegSettings);

  t.true(fs.existsSync(ffmpegSettings.outputName));
  cleanup();
});
