const fs = require('fs');
const path = require('path');
const stream = require('stream');
const util = require('util');

const axios = require('axios').default;

const pipeline = util.promisify(stream.pipeline);

const { pictureNames, width, height } = require('./demo.json');

(async () => {
  try {
    for (let i = 0; i < pictureNames.length; ++i) {
      const { data: imageStream } = await axios.get(
        `https://api.lorem.space/image/house?w=${width}&h=${height}`,
        {
          responseType: 'stream',
        },
      );

      await pipeline(
        imageStream,
        fs.createWriteStream(
          path.join(__dirname, '../uploads/images', pictureNames[i]),
        ),
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
