import path from 'path';

const exampleHearThisProjectName = 'ExampleHearThisProject';
const exampleSABProjectName = 'ExampleSABProject';

export const testPaths = {
  exampleHearThisProjectName,
  exampleSABProjectName,
  exampleHearThisProjectPath: path.resolve(__dirname, 'fixtures', exampleHearThisProjectName),
  exampleSABProjectPath: path.resolve(__dirname, 'fixtures', exampleSABProjectName),
  fixtures: path.resolve(__dirname, 'fixtures'),
  frameImages: path.resolve(__dirname, 'images'),
};
