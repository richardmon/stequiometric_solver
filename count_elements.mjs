import { readFile }  from 'fs/promises';

(async () => {
  const file = await readFile('./elements.json');
  const jsonData = JSON.parse(file);
  console.assert(jsonData.length === 118); // do we have all the elements
})()
