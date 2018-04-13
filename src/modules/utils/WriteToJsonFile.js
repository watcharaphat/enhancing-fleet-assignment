import fs from 'fs';
import mkdirp from 'mkdirp';

export function writeToJsonFile(filepath, data) {
  // Crate all needed directories in filepath
  const splitFilepath = filepath.split('/');
  splitFilepath.pop();
  const dirToCreate = splitFilepath.join('/');
  mkdirp.sync(dirToCreate);

  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing a JSON file:', error);
  }
}
