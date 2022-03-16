import { spawnSync } from 'child_process';
import { EventEmitter } from 'events';
import fs from 'fs';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import winston from 'winston';
import { paths } from '../path-constants';

export async function combineVideos(
  videoPaths: string[],
  outputFilePath: string,
  notifyEvent?: EventEmitter
): Promise<void> {
  winston.info('Combining Videos');
  notifyEvent && notifyEvent.emit('Combining Videos');
  const args: string[] = ['-v', 'error'];
  const filterComplex: string[] = [];
  // create FFmpeg command to combine the videos (https://ffmpeg.org/ffmpeg-filters.html#concat)
  for (let i = 0; i < videoPaths.length; i++) {
    args.push('-i', `${i}.mp4`);
    filterComplex.push(`[${i}:0]`, `[${i}:1]`);
  }
  filterComplex.push(`concat=n=${videoPaths.length}:v=1:a=1`, '[v]', '[a]');
  args.push('-filter_complex', filterComplex.join(' '), '-map', '[v]', '-map', '[a]', 'outputFile.mp4');

  const ffmpeg = createFFmpeg({ log: true });

  (async () => {
    await ffmpeg.load();
    ffmpeg.setLogging(true);
    for (let i = 0; i < videoPaths.length; i++) {
      ffmpeg.FS('writeFile', `${i}.mp4`, await fetchFile(videoPaths[i]));
    }
    await ffmpeg.run(...args);
    await fs.promises.writeFile(outputFilePath, ffmpeg.FS('readFile', 'outputFile.mp4'));
    process.exit(0);
  })();

  // const combineProcess = spawnSync(paths.ffmpeg, args, { stdio: 'pipe', windowsHide: true });
  // const stderr = combineProcess.stderr.toString();
  // if (stderr !== '') {
  //   winston.error(stderr);
  //   throw new Error(stderr);
  // } else {
  //   winston.info('Videos Combined');
  //   notifyEvent && notifyEvent.emit('Videos Combined');
  // }
}
