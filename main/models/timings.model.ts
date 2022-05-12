import { ExtraTiming } from './projectFormat.model';

export type Timings = SegmentTiming[];

// this follows the spec ... ?
export interface SegmentTiming {
  readonly type: 'caption';
  readonly index: number;
  readonly start: number;
  readonly end: number;
  readonly duration: number;
  readonly content: string;
  readonly words: WordTiming[];
  readonly isHeading: boolean;
  readonly extraTimings: ExtraTiming[];
}

export interface PhraseTiming {
  words: string[];
  start: number;
  duration: number;
  end: number;
}

interface WordTiming {
  readonly word: string;
  readonly start: number;
  readonly end: number;
}
