import {
  app,
  ipcMain,
  shell,
  Menu,
  BrowserWindow,
  Event,
  IpcMainEvent,
  SaveDialogOptions,
  dialog,
  OpenDialogOptions,
  session,
} from 'electron';
import { getAssetURL } from 'electron-snowpack';
import fontList from 'font-list';
import fs from 'fs';
import { map, flatten } from 'lodash';
import path from 'path';
import winston from 'winston';
import { convert } from './commands/convert';
import { prepareLogger } from './commands/logger';
import { bkImport } from './import/hearThis/hearThisImport';
import isDev from '../utility/isDev';
import { AnimationSettings } from './models/animationSettings.model';
import { ConvertProject } from './models/convertFormat.model';
import { ProgressState } from './models/progressState.model';
import { Verses } from './models/verses.model';
import SourceIndex from './sources/index';
import { Project, getSampleVerses } from './sources/util';

let mainWindow: BrowserWindow | undefined;

export function createWindow(): void {
  prepareLogger();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "connect-src 'self' ws:",
          isDev() ? "script-src 'self' data: 'unsafe-eval' 'unsafe-inline'" : "script-src 'self'",
        ],
      },
    });
  });

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 970,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true,
      enableRemoteModule: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL(getAssetURL('index.html'));
  if (isDev()) {
    mainWindow.webContents.openDevTools();
  } else {
    Menu.setApplicationMenu(null);
  }

  mainWindow.maximize();

  mainWindow.on('closed', (): void => {
    mainWindow = undefined;
  });

  mainWindow.webContents.on('new-window', (event: Event, url: string): void => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  mainWindow.webContents.on('devtools-opened', (): void => {
    mainWindow?.focus();
    setImmediate((): void => {
      mainWindow?.focus();
    });
  });
}

function handleFileDialogs(): void {
  ipcMain.on('did-start-file-save-dialog', async (event: IpcMainEvent, options: SaveDialogOptions): Promise<void> => {
    if (mainWindow != null) {
      winston.log('info', 'File save dialog');
      const filePath = (await dialog.showSaveDialog(mainWindow, options)).filePath || '';
      event.sender.send('did-finish-file-save-dialog', filePath);
    }
  });
  ipcMain.on('did-start-file-open-dialog', async (event: IpcMainEvent, options: OpenDialogOptions): Promise<void> => {
    if (mainWindow != null) {
      winston.log('info', 'File open dialog');
      const filePaths = (await dialog.showOpenDialog(mainWindow, options)).filePaths;
      event.sender.send('did-finish-file-open-dialog', filePaths);
    }
  });
}

export function handleGetFonts(): void {
  ipcMain.on('did-start-getfonts', async (event: IpcMainEvent): Promise<void> => {
    winston.log('info', 'Getting system fonts');
    try {
      const fonts = await fontList.getFonts();
      event.sender.send(
        'did-finish-getfonts',
        // Font names with spaces are wrapped in quotation marks
        fonts.map((font: string) => font.replace(/^"|"$/g, '')).sort()
      );
    } catch (err) {
      event.sender.send('did-finish-getfonts', err);
    }
  });
}

export function handleGetSampleVerses(): void {
  ipcMain.on('did-start-getverses', (event: IpcMainEvent, args: Verses): void => {
    const { sourceDirectory } = args;
    winston.log('info', 'Getting sample verses', sourceDirectory);
    const verses = getSampleVerses(sourceDirectory);
    winston.log('info', 'Got sample verses', verses);
    event.sender.send('did-finish-getverses', verses);
  });
}

// NOTE: RootDirectories type is the [rootDirectories] property of App/store/Settings.js
// {
//   [constants.js - PROJECT_TYPE.hearThis]: string[]
//   [constants.js - PROJECT_TYPE.scriptureAppBuilder]: string[]
// }
interface RootDirectories {
  hearThis: string[];
  scriptureAppBuilder: string[];
}

export function handleGetProjects(): void {
  ipcMain.on('did-start-getprojectstructure', (event: IpcMainEvent, rootDirectories: RootDirectories): void => {
    const projects = flatten(
      map(rootDirectories, (directories: string[], projectType: string): Project[] => {
        // .getProjectStructure is in /src/main/sources/hear-this.ts or scripture-app-builder.ts
        const project = SourceIndex.getProject(projectType);
        return project != null ? project.getProjectStructure(directories) : [];
      })
    );
    event.sender.send('did-finish-getprojectstructure', projects);
  });
}

interface SubmissionArgs {
  combined: boolean;
  sourceDirectory?: string;
  project: ConvertProject;
  animationSettings: AnimationSettings;
}

interface SubmissionReturn {
  outputDirectory?: string;
  error?: Error;
}

export function handleSubmission(): void {
  ipcMain.on('did-start-conversion', async (event: IpcMainEvent, args: SubmissionArgs) => {
    const onProgress = ({ status, percent, remainingTime }: ProgressState): void => {
      const progress: ProgressState = { status: `${status} ${percent}%`, percent, remainingTime };
      event.sender.send('on-progress', progress);
    };
    winston.log('info', 'Starting conversion', args);
    let response;
    try {
      // ToDo: move this to the frontend and pass a subset of the selected chapters across the IPC.
      const bkProject = await bkImport(args.project);
      response = await convert(bkProject, args.combined, args.animationSettings, onProgress);
    } catch (err) {
      response = err;
    }

    let result: SubmissionReturn = { error: new Error('[unknown response]') };
    if (response) {
      result =
        typeof response === 'string'
          ? { outputDirectory: response }
          : { error: { name: 'Error', message: response.message, stack: response.stack } };
    }
    winston.log('info', 'Conversion process finished', result);
    if (result.outputDirectory && fs.existsSync(result.outputDirectory)) {
      shell.openPath(result.outputDirectory);
    }
    event.sender.send('did-finish-conversion', result);
  });
}

app.on('ready', (): void => {
  createWindow();
  handleSubmission();
  handleGetProjects();
  handleGetSampleVerses();
  handleGetFonts();
  handleFileDialogs();
  // **DEBUG** only
  ipcMain.on('message', (_, message) => {
    console.log(message);
  });
});

app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', (): void => {
  if (mainWindow == null) {
    createWindow();
  }
});
