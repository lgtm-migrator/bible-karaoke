import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import _ from 'lodash';
import usfm from 'usfm-js';
import { SOURCE_TYPES } from '../../src/App/constants';
import { BKBook, BKChapter, BKProject, BKSegment, ExtraTiming } from '../models/projectFormat.model';
import ProjectSource from '../models/projectSource.model';
import { createPhraseArray, getDirectories, lettersToNumber } from './util';

interface SfmJson {
  chapters?: {
    [chapterNumber: number]: {
      verseObjects: {
        [verseNumber: number]: {
          type: string;
          text: string;
        };
      };
    };
  };
}

class ScriptureAppBuilder implements ProjectSource {
  readonly SOURCE_TYPE = SOURCE_TYPES.scriptureAppBuilder;

  getBKProjects(rootDirectories: string[]): BKProject[] {
    try {
      return _.flatten(
        rootDirectories
          .filter((directory: string) => fs.existsSync(directory))
          .map((directory: string) => {
            return getDirectories(directory)
              .map((name: string) => this.makeProject(name, directory))
              .flat()
              .filter((project: BKProject) => project.books.length);
          })
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  reloadProject(project: BKProject): BKProject {
    return project;
  }

  private makeProject(projectName: string, directory: string): BKProject | BKProject[] {
    const emptyProject: BKProject = {
      name: projectName,
      folderPath: path.join(directory, projectName),
      sourceType: this.SOURCE_TYPE,
      books: [],
    };
    const fileName = path.join(directory, projectName, projectName + '.appDef');
    let contents;
    try {
      contents = fs.readFileSync(fileName, 'utf8');
    } catch (error) {
      console.error(error);
      return emptyProject;
    }
    const dom = new JSDOM(contents, { contentType: 'text/xml' });
    const xmlDoc = dom.window.document;
    const booksIdElements = xmlDoc.querySelectorAll('books[id]');
    const collectionIds = _.map(booksIdElements, (element) => element.id ?? undefined).filter((e) => e != null);

    if (collectionIds.length === 1) {
      const project: BKProject = {
        name: projectName,
        folderPath: path.join(directory, projectName),
        sourceType: this.SOURCE_TYPE,
        books: this.makeBooks(xmlDoc, projectName, directory, collectionIds[0]),
      };
      return project;
    } else if (collectionIds.length > 1) {
      const projects: BKProject[] = collectionIds.map((id) => {
        const project: BKProject = {
          name: projectName + ' - ' + id,
          folderPath: path.join(directory, projectName),
          sourceType: this.SOURCE_TYPE,
          books: this.makeBooks(xmlDoc, projectName, directory, id),
        };
        return project;
      });
      return projects;
    } else {
      return emptyProject;
    }
  }

  private makeBooks(xmlDoc: Document, projectName: string, directory: string, collectionId: string): BKBook[] {
    const books: BKBook[] = [];
    const bookIdSelector = "books[id='" + collectionId + "'] > book[id]";
    const bookIds = _.map(xmlDoc.querySelectorAll(bookIdSelector), (n) => (n.id ? n.id : undefined)).filter(
      (id) => id != null && id !== ''
    );
    for (const bookId of bookIds) {
      const bookNameSelector = "book[id='" + bookId + "'] > name";
      const bookFileNameSelector = "book[id='" + bookId + "'] > filename";

      const bookName = xmlDoc.querySelector(bookNameSelector)?.textContent;
      const bookFileName = xmlDoc.querySelector(bookFileNameSelector)?.textContent;
      if (!bookFileName || !bookName || !bookId) {
        return [];
      }
      // we only work with .sfm files at the moment, so cancel if is .usx or other
      if (!bookFileName.toLowerCase().endsWith('.sfm')) {
        return [];
      }
      const sfmFileName = path.join(directory, projectName, projectName + '_data', 'books', collectionId, bookFileName);

      let sfmJson: SfmJson = {};
      try {
        sfmJson = usfm.toJSON(fs.readFileSync(sfmFileName, 'utf8'));
      } catch (error) {
        console.error(error);
      }
      if (!sfmJson) {
        continue;
      }

      const book: BKBook = {
        name: bookName,
        chapters: this.makeChapters(bookId, sfmJson, xmlDoc, projectName, directory),
      };

      if (book.chapters.length > 0) {
        books.push(book);
      }
    }
    return books;
  }

  private makeChapters(
    bookId: string,
    sfmJson: SfmJson,
    xmlDoc: Document,
    projectName: string,
    directory: string
  ): BKChapter[] {
    const chapters: BKChapter[] = [];

    let phraseEndChars: string[] = [];
    const phraseEndCharsString = xmlDoc
      .querySelector('feature[name=audio-phrase-end-chars]')
      ?.attributes.getNamedItem('value')?.value;
    if (phraseEndCharsString) {
      phraseEndChars = phraseEndCharsString.split(' ');
    }

    // there are two different schemas
    let isPageSchema = true;

    let chapterNumbers = _.map(
      xmlDoc.querySelectorAll("book[id='" + bookId + "'] > page[num] > audio > timing-filename"),
      (n) => n.parentElement?.parentElement?.attributes.getNamedItem('num')?.value ?? undefined
    ).filter((cn) => cn != null && cn !== '');
    if (chapterNumbers.length === 0) {
      // attempt to use old schema
      isPageSchema = false;
      chapterNumbers = _.map(
        xmlDoc.querySelectorAll("book[id='" + bookId + "'] > audio[chapter] > timing-filename"),
        (n) => n.parentElement?.attributes.getNamedItem('chapter')?.value ?? undefined
      ).filter((cn) => cn != null && cn !== '');
    }
    if (chapterNumbers.length === 0) {
      return [];
    }

    for (const chapterNumber of chapterNumbers) {
      const fileSelector = isPageSchema
        ? "book[id='" + bookId + "'] > page[num='" + chapterNumber + "'] > audio > filename"
        : "book[id='" + bookId + "'] > audio[chapter='" + chapterNumber + "'] > filename";

      const timingFileSelector = isPageSchema
        ? "book[id='" + bookId + "'] > page[num='" + chapterNumber + "'] > audio > timing-filename"
        : "book[id='" + bookId + "'] > audio[chapter='" + chapterNumber + "'] > timing-filename";

      const audioFileName = xmlDoc.querySelector(fileSelector)?.textContent;
      const audioFileLength = xmlDoc.querySelector(fileSelector)?.getAttribute('len');
      const timingFileName = xmlDoc.querySelector(timingFileSelector)?.textContent;
      // cancel if anything can't be found
      if (!audioFileName || !audioFileLength || !timingFileName || !chapterNumber) {
        return [];
      }

      const audioFile = this.calculateAudioFile(audioFileName, directory, projectName);
      if (!audioFile) {
        return [];
      }

      const segments: BKSegment[] = this.makeSegments(
        sfmJson,
        +chapterNumber,
        phraseEndChars,
        timingFileName,
        projectName,
        directory
      );
      if (segments.length > 0) {
        chapters.push({
          name: chapterNumber,
          audio: { files: [{ filename: audioFile, length: parseInt(audioFileLength) }] },
          segments,
        });
      }
    }

    return chapters;
  }

  private makeSegments(
    sfmJson: SfmJson,
    chapterNumber: number,
    phraseEndChars: string[],
    timingFileName: string,
    projectName: string,
    directory: string
  ): BKSegment[] {
    const segments: BKSegment[] = [];

    const timingFileFullName = path.join(directory, projectName, projectName + '_data', 'timings', timingFileName);

    let timingFileContent;

    try {
      timingFileContent = fs.readFileSync(timingFileFullName, 'utf8');
    } catch (error) {
      console.error(error);
      return [];
    }

    // Regex to match the timing lines in the timing file
    // tab separated list with possible decimals
    // representing respectively: start time, end time, verse number
    // e.g. 124.12  123  1
    // verse number can be a number representing a verse, a number followed by a letter representing a phrase (separated by phraseEndChars), blank representing the next phrase in the current verse, or can be followed by an underscore and number representing that numbered word in the phrase or verse
    // e.g. 1.2 2.1 1b_3 (meaning 3rd word of second phrase in first verse)
    // https://software.sil.org/downloads/r/scriptureappbuilder/Scripture-App-Builder-06-Using-Audacity-for-Audio-Text-Synchronization.pdf
    const timingPattern = /(\d+\.?\d*)\t(\d+\.?\d*)\t(\d+[a-z]*_?\d*)?/gs;

    let timingMatches;
    const timingData = [];
    while ((timingMatches = timingPattern.exec(timingFileContent))) {
      //this is where we get the start time, duration, and verse number from the timing file
      timingData.push({
        startTime: parseFloat(timingMatches[1]) * 1000,
        endTime: parseFloat(timingMatches[2]) * 1000,
        verse: timingMatches[3],
      });
    }

    const chapterJson = sfmJson.chapters ? sfmJson.chapters[chapterNumber] : undefined;
    if (!chapterJson) {
      return [];
    }
    let currentTimingIndex = 0;
    for (const verseNumber in chapterJson) {
      if (currentTimingIndex === -1) {
        break;
      }
      const startTime = timingData[currentTimingIndex].startTime;
      let endTime = timingData[currentTimingIndex].endTime;
      let wordNumber = 0;
      let phraseNumber = 0;
      let phraseArray: string[] = [];
      if (chapterJson[verseNumber].verseObjects[0].text) {
        phraseArray = createPhraseArray(chapterJson[verseNumber].verseObjects[0].text, phraseEndChars);
      }

      const extraTiming: ExtraTiming[] = [];

      // gets timing info if the verse number is correct or if it is blank (blank meaning next phrase of current verse)
      while (
        parseInt(timingData[currentTimingIndex].verse) === parseInt(verseNumber) ||
        !timingData[currentTimingIndex].verse
      ) {
        // if start and end times are the same, set end time to start of next timing
        // if it is the last timing data of the chapter, leave them the same and timings.ts will sort it out
        if (timingData[currentTimingIndex].startTime === timingData[currentTimingIndex].endTime) {
          if (currentTimingIndex < timingData.length - 1) {
            endTime = timingData[currentTimingIndex + 1].startTime;
          }
        } else {
          endTime = timingData[currentTimingIndex].endTime;
        }

        // match the verse string from the timing data:
        // verse number, then letter to indicate phrase number, underscore then word number
        // e.g. 1b_3; verse 1, phrase 2, word 3
        const verseRegex = /\d+([a-z]*)_?(\d*)/;
        let match: RegExpMatchArray | null = [];
        if (!timingData[currentTimingIndex].verse) {
          extraTiming.push({ wordNum: wordNumber, time: timingData[currentTimingIndex].startTime });
        } else {
          match = timingData[currentTimingIndex].verse.match(verseRegex);
        }
        if (match) {
          // match[1] is the letter representing the phrase
          if (match[1]) {
            const letterNumber = lettersToNumber(match[1]);
            while (phraseNumber < letterNumber) {
              if (phraseArray[phraseNumber]) {
                wordNumber += phraseArray[phraseNumber].split(' ').length;
              }
              phraseNumber++;
            }
            // skip for first phrase (covered by verse start time)
            if (wordNumber !== 0) {
              // match[2] is the word number within the phrase
              if (match[2]) {
                extraTiming.push({
                  wordNum: wordNumber + parseInt(match[2]),
                  time: timingData[currentTimingIndex].startTime,
                });
              } else {
                extraTiming.push({ wordNum: wordNumber, time: timingData[currentTimingIndex].startTime });
              }
            }
          } else if (match[2]) {
            extraTiming.push({ wordNum: parseInt(match[2]), time: timingData[currentTimingIndex].startTime });
          }
        }

        if (phraseArray[phraseNumber]) {
          wordNumber += phraseArray[phraseNumber].split(' ').length;
        }
        phraseNumber++;

        // exit if the end of the timing data is reached
        if (currentTimingIndex < timingData.length - 1) {
          currentTimingIndex++;
        } else {
          currentTimingIndex = -1;
          break;
        }
      }
      const text = chapterJson[verseNumber].verseObjects[0].text;
      // skip segment if missing timing info
      if (startTime == null || endTime == null || !text) {
        continue;
      }
      segments.push({
        segmentId: parseInt(verseNumber),
        text,
        verse: verseNumber,
        startTime,
        length: endTime - startTime,
        isHeading: false,
        extraTiming,
      });
    }
    return segments;
  }

  private calculateAudioFile(oldFile: string, directory: string, projectName: string): string | undefined {
    if (fs.existsSync(oldFile)) {
      return oldFile;
    }
    const split = oldFile.split(path.sep);
    const dirList = fs.readdirSync(path.join(directory, projectName));
    dirList.splice(dirList.indexOf(projectName + '.appDef'), 1);
    dirList.splice(dirList.indexOf(projectName + '_data'), 1);
    for (const dirName in dirList) {
      if (split.includes(dirName)) {
        const audioFile = path.join(directory, projectName, ...split.slice(split.lastIndexOf(dirName)));
        if (fs.existsSync(audioFile)) {
          return audioFile;
        }
      }
    }
    if (dirList.length === 1) {
      const audioFile = path.join(directory, projectName, dirList[0], split[split.length - 1]);
      if (fs.existsSync(audioFile)) {
        return audioFile;
      }
    }
    return undefined;
  }
}

export default new ScriptureAppBuilder();
