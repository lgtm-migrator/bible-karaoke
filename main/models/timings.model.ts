import { ExtraTiming } from './projectFormat.model';

export type Timings = LineTiming[];

// this follows the spec ... ?
export interface LineTiming {
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

interface WordTiming {
  readonly word: string;
  readonly start: number;
  readonly end: number;
}
