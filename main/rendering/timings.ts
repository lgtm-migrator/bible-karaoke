import { BKChapter } from '../models/projectFormat.model';
import { Timings, SegmentTiming, PhraseTiming } from '../models/timings.model';

export function chapterFormatToTimings(chapter: BKChapter): Timings {
  const timings: Timings = [];
  for (const [index, segment] of chapter.segments.entries()) {
    const contentWords = segment.text.split(' ').filter((w) => w);

    // if the last timing data has start === end, then set end to the audio duration (end of chapter)
    const audioLength = chapter.audio.files[0].length;
    let end = segment.startTime + segment.length;
    if (index === chapter.segments.length - 1) {
      if (end === segment.startTime) {
        end = audioLength;
      }
      let lastTiming;
      if (segment.extraTimings) {
        lastTiming = segment.extraTimings[segment.extraTimings.length - 1];
      }
      if (lastTiming && lastTiming.start === lastTiming.end) {
        end = audioLength;
      }
    }

    const segmentTiming: SegmentTiming = {
      type: 'caption',
      index: segment.segmentId,
      start: segment.startTime,
      end: end,
      duration: segment.length,
      content: segment.text,
      words: [],
      isHeading: segment.isHeading,
      extraTimings: segment.extraTimings ?? [],
    };
    formatPhrases(contentWords, segmentTiming, audioLength);
    timings.push(segmentTiming);
  }
  return timings;
}

function formatPhrases(words: string[], segmentTiming: SegmentTiming, audioLength: number) {
  const phraseTimings: PhraseTiming[] = [];
  if (segmentTiming.extraTimings.length === 0) {
    phraseTimings.push({
      words,
      start: segmentTiming.start,
      end: segmentTiming.end,
      duration: segmentTiming.duration,
    });
  } else {
    for (const [index, currentTiming] of segmentTiming.extraTimings.entries()) {
      const start = currentTiming.start;
      let end = currentTiming.end;
      if (index < segmentTiming.extraTimings.length - 1) {
        const nextPhrase = segmentTiming.extraTimings[index + 1];
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
  }
  for (const section of phraseTimings) {
    formatWords(section, segmentTiming);
  }
}

function formatWords(phrase: PhraseTiming, segmentTiming: SegmentTiming): void {
  let start = phrase.start;
  let totalChars = 0;
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

    segmentTiming.words.push({ word, start, end });
    start = end;
  }
}
