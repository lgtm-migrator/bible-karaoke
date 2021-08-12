import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import tempy from 'tempy';
import { AnimationSettings } from '../../../models/animationSettings.model';
import { ProgressState } from '../../../models/progressState.model';
import { BKProject } from '../../../models/projectFormat.model';
import { Timings } from '../../../models/timings.model';
import { render } from '../rendering/renderFrames';
import { RecordFrameEventData } from '../rendering/recordFrames';
import { chapterFormatToTimings } from '../rendering/timings';
import { combineFrames } from './ffmpeg';
import { combineVideos } from './combineVideos';

export async function convert(
  project: BKProject,
  isCombined: boolean,
  animationSettings: AnimationSettings,
  onProgress: (progress: ProgressState) => void
): Promise<string> {
  // Fix #178: make sure output directory exists
  fs.mkdirSync(animationSettings.output.directory, { recursive: true });
  const outputFilePath = path.join(animationSettings.output.directory, animationSettings.output.filename);
  const videoPathsToCombine: string[] = [];
  let percent = 0;
  const onRenderedProgress = ({ currentFrame, totalFrames }: RecordFrameEventData): void => {
    percent = (100 * currentFrame) / totalFrames;
    percent = Math.floor(percent > 100 ? 100 : percent);
    const remainingTime: string = calculateRemainTime({ currentFrame, totalFrames });
    onProgress({ status: 'Rendering video frames...', percent, remainingTime });
  };
  const notify = new EventEmitter();
  notify.addListener('rendered', onRenderedProgress);
  await tempy.directory.task(async (combineDirectory) => {
    for (const book of project.books) {
      for (const chapter of book.chapters) {
        await tempy.directory.task(async (imagesPath) => {
          const timings: Timings = chapterFormatToTimings(chapter);
          await render(animationSettings, imagesPath, timings, notify);

          const outputName = getOutputFilePath(
            isCombined,
            combineDirectory,
            animationSettings.output.directory,
            project.name,
            book.name,
            chapter.name
          );
          let audioFiles: string[] = [];
          if ('filename' in chapter.audio) {
            audioFiles = [chapter.audio.filename];
          } else {
            audioFiles = chapter.audio.files.map((f) => f.filename);
          }
          onProgress({ status: 'Combining video frames...', percent });
          await combineFrames({ audioFiles, imagesPath, framerateIn: 15, outputName });
          if (isCombined) {
            videoPathsToCombine.push(outputName);
          }
        });
      }
    }
    if (videoPathsToCombine.length > 0) {
      await combineVideos(videoPathsToCombine, outputFilePath);
    }
  });

  return animationSettings.output.directory;
}

let lastCurrentFrame = 0;
let lastUpdateFrameDate: Date | undefined;
function calculateRemainTime({ currentFrame, totalFrames }: RecordFrameEventData): string {
  let result = '';
  const currentDate: Date = new Date();

  // Skip calculating if it is the first run
  if (lastUpdateFrameDate != null) {
    // ((currentDate - lastUpdateFrameDate) / (currFrame - lastCurrentFrame)) * (totalFrame - currFrame)
    const spendTime = currentDate.valueOf() - lastUpdateFrameDate.valueOf(); // milliseconds
    const progressFrame = currentFrame - lastCurrentFrame;
    const spendTimePerFrame = spendTime / progressFrame;
    const remainingFrames = totalFrames - currentFrame;

    const estimateTime = remainingFrames * spendTimePerFrame; // milliseconds

    // Convert milliseconds to days, hours, minutes, seconds
    const days: number = parseFloat((estimateTime / 86400000).toFixed(0));
    const hours: number = parseFloat((estimateTime / 3600000).toFixed(0));
    const minutes: number = parseFloat((estimateTime / 60000).toFixed(0));
    const seconds: number = parseFloat((estimateTime / 1000).toFixed(0));

    if (seconds < 1) {
      result = '';
    } else if (seconds < 60) {
      result = `${seconds} second${seconds > 1 ? 's' : ''}`;
    } else if (minutes == 1) {
      result = `1 minute ${seconds - 60} seconds`;
    } else if (minutes < 60) {
      result = `${minutes} minutes`;
    } else if (hours < 24) {
      result = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      result = `${days} day${days > 1 ? 's' : ''}`;
    }

    if (result) {
      result = `Approximately ${result} remaining`;
    }
  }

  lastUpdateFrameDate = currentDate;
  lastCurrentFrame = currentFrame;

  // clear when it done
  if (currentFrame >= totalFrames) {
    lastUpdateFrameDate = undefined;
    lastCurrentFrame = 0;
  }

  return result;
}

function getOutputFilePath(
  isCombined: boolean,
  combineDirectory: string,
  outputDirectory: string,
  projectName: string,
  bookName: string,
  chapterName: string
): string {
  // Mii_Mark_1.mp4, Mii_Mark_2.mp4, Mii_Mark_3.mp4, Mii_Mark_4.mp4
  const outputFilename = `${projectName}_${bookName}_${chapterName}.mp4`;
  if (isCombined) {
    // when combining the output, then generate multiple files in a temp directory ready to combine.
    return path.join(combineDirectory, outputFilename);
  } else {
    // when not combining the output, then generate multiple files.
    return path.join(outputDirectory, outputFilename);
  }
}
