import { BKChapter } from '../models/projectFormat.model';
import { Timings, LineTiming } from '../models/timings.model';

export function chapterFormatToTimings(chapter: BKChapter): Timings {
  const timings: Timings = [];
  for (const segment of chapter.segments) {
    const contentWords = segment.text.split(' ').filter((w) => w);

    // if the last timing data has start === end, then set end to the audio duration (end of chapter)
    let length = segment.length;
    let lastTiming;
    if (segment.extraTimings) {
      lastTiming = segment.extraTimings[segment.extraTimings.length - 1];
    }
    if (lastTiming && lastTiming.start === lastTiming.end) {
      length = chapter.audio.files[0].length;
    }

    const lineTiming: LineTiming = {
      type: 'caption',
      index: segment.segmentId,
      start: segment.startTime,
      end: segment.startTime + length,
      duration: length,
      content: segment.text,
      words: [],
      isHeading: segment.isHeading,
      extraTimings: segment.extraTimings ?? [],
    };
    formatPhrases(contentWords, lineTiming, chapter.audio.files[0].length);
    timings.push(lineTiming);
  }
  return timings;
}

interface PhraseTiming {
  words: string[];
  start: number;
  duration: number;
  end: number;
}

function formatPhrases(words: string[], lineTiming: LineTiming, audioLength: number) {
  const phraseTimings: PhraseTiming[] = [];
  if (lineTiming.extraTimings.length === 0) {
    phraseTimings.push({
      words,
      start: lineTiming.start,
      end: lineTiming.end,
      duration: lineTiming.end - lineTiming.start,
    });
  }
  for (const [index, currentTiming] of lineTiming.extraTimings.entries()) {
    const start = currentTiming.start;
    let end = currentTiming.end;
    if (index < lineTiming.extraTimings.length - 1) {
      const nextPhrase = lineTiming.extraTimings[index + 1];
      if (end > nextPhrase.start) {
        end = nextPhrase.start;
      }
      phraseTimings.push({
        words: words.slice(currentTiming.wordNum, nextPhrase.wordNum),
        start,
        end,
        duration: end - start,
      });
    } else {
      // if last timing data in segment, slice to end and set end to audio length if start and end are the same
      if (end === start) {
        end = audioLength;
      }
      phraseTimings.push({
        words: words.slice(currentTiming.wordNum),
        start,
        end,
        duration: end - start,
      });
    }
  }
  for (const section of phraseTimings) {
    formatWords(section, lineTiming);
  }
}

function formatWords(phrase: PhraseTiming, lineTiming: LineTiming): void {
  let start = phrase.start;
  let totalChars = -1;
  for (const word of phrase.words) {
    totalChars += word.length + 1;
  }
  for (const word of phrase.words) {
    // percent duration = wordLength/totalChars
    // NOTE: look at this if animation looks off.
    // +1 to account for an additional space after the word
    // problem might be last word in phrase...
    const percentDuration = (word.length + 1) / totalChars;

    // wordDuration = percentDuration * phrase.duration
    let end = start + Math.round(percentDuration * phrase.duration);

    // make sure end never goes beyond phrase.end
    if (end > phrase.end) {
      end = phrase.end;
    }

    lineTiming.words.push({ word, start, end });
    start = end;
  }
}
