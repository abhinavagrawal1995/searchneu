import fs from 'fs-promise';
import path from 'path';

import camd from '../camd';


it('should work for profile page', async (done) => {

  const body = await fs.readFile(path.join(__dirname, 'data', 'camd', 'profile.html'));

  let url = 'https://camd.northeastern.edu/gamedesign/people/jason-duhaime/'

  let output = camd.parseDetailpage(url, body)

  expect(output).toMatchSnapshot()

  done()
});

