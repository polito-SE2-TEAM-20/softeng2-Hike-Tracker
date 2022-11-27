#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import glob from 'globule';
import { uniqBy, prop } from 'ramda';
import { randomInt } from 'crypto';
import escape from 'pg-escape'

const SOURCE_DIR = './source/';
const DEST_DIR = './result/';

// prepare final sql for all hikes
function prepareSql(hikes) {
  let sql = '';
  const hikesFiles = glob.find('*.geojson', {
    prefixBase: true,
    srcBase: DEST_DIR,
  }).sort();

  hikesFiles.forEach(file => {
    const filename = path.basename(file);
    const gpxPath = `/static/gpx/${filename}`;

    sql +=`
      INSERT INTO "public"."hikes" ("title", "gpxPath") VALUES('${escape.string(name)}', '${gpxPath}');
    `;
  })
}

(async () => {

})()