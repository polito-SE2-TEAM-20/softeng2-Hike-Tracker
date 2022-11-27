#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import glob from 'globule';
import { uniqBy, prop } from 'ramda';
import { randomInt } from 'crypto';
import escape from 'pg-escape';
import { hash } from 'bcrypt';
import { exec } from 'child_process';

const SOURCE_DIR = './source/';
const DEST_DIR = './result/';

const LOCAL_GUIDE_ID = 2;
const HASH_ROUNDS = 10;
const XML_TAG = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>';
const GPX_XMLNS = `xmlns="http://www.topografix.com/GPX/1/1"`;
const GPX_VERSION = `version="1.1"`;
const GPX_CREATOR = `creator="https://github.com/petele/gpx-split"`;
const GPX_TAG = `<gpx ${GPX_XMLNS} ${GPX_VERSION} ${GPX_CREATOR}>`;

(async () => {
  const source = SOURCE_DIR;
  const dest = DEST_DIR;

  const fileList = getGPXFileList(source);
  if (fileList.length === 0) {
    console.log('No files found, exiting...');
    process.exit();
  }
  if (!existsSync(dest)) {
    mkdirSync(dest);
  }

  const allHikesSaved = []
  for (const file of fileList) {
    try {
      console.log('reading file', file);
      const contents = JSON.parse((readFileSync(file)));

      const features = contents.features;

      const featuresPrepared = [];
      for (const feature of features) {
        const name = feature.properties.TRAILNAME;
        const difficulty = feature.properties.TRAILSURF
          ? feature.properties.TRAILSURF.includes('Unpaved')
            ? 2
            : randomInt(0, 3)
          : 0;

        if (!feature.geometry?.coordinates || !name
          || feature.geometry.type !== 'LineString') continue;

        const points = feature.geometry.coordinates.map(([lon, lat]) => ({ lat, lon }));

        featuresPrepared.push({
          name,
          country: 'USA',
          difficulty,
          points,
        });
      }

      const hikes = uniqBy(prop('name'), featuresPrepared);

      // write all hikes to gpx
      for (let i = 0, fileIndex = 1; i < hikes.length; ++i, ++fileIndex) {
        const hike = hikes[i];

        const { fileName } = await saveGPXFile({
          hike,
          fileIndex,
        });

        hike.fileName = fileName;

        allHikesSaved.push(hike);
      }

    } catch (error) {
      console.error(chalk.red(error));
    }
  }

  // now prepare sql for inserting them
  const schemaSql = await prepareSchemaSql()
  const usersSql = await prepareUsersSql();
  const hikesSql = prepareHikesSql(allHikesSaved);
  writeFileSync(join('./result/init.sql'), [schemaSql, usersSql, hikesSql].join('\n'));
})()

async function prepareSchemaSql() {
  return new Promise((res, rej) => {
    exec(`source .env && echo "$DB_PASSWORD" | pg_dump --no-owner --no-acl  -s --username germangorodnev hiking`, (error, stdout, stderr) => {
      if (error) {
        return rej(error);
      }

      // console.log(`stdout: ${stdout}`);
      // console.error(`stderr: ${stderr}`);

      return res(stdout);
    })
  })
}

function prepareTableSql() {
  return `
    CREATE USER softeng;
    CREATE DATABASE hiking;
    GRANT ALL PRIVILEGES ON DATABASE hiking TO softeng;
  `
}

async function prepareUsersSql() {
  const hiker = {
    id: 1,
    email: "german@hiker.it",
    password: "123456",
    firstName: "German",
    lastName: "Gorodnev",
    role: 0
  };

  const localGuide = {
    id: LOCAL_GUIDE_ID,
    email: "antonio@localguide.it",
    password: "123456",
    firstName: "Antonio",
    lastName: "Battipaglia",
    role: 2
  };

  const platformManager = {
    id: 3,
    email: "vincenzo@admin.it",
    password: "123456",
    firstName: "vincenzo",
    lastName: "Sagristano",
    role: 3
  };

  const hutWorker = {
    id: 4,
    email: "erfan@hutworker.it",
    password: "123456",
    firstName: "Erfan",
    lastName: "Gholami",
    role: 4
  };

  const emergencyOperator = {
    id: 5,
    email: "laura@emergency.it",
    password: "123456",
    firstName: "Laura",
    lastName: "Zurru",
    role: 5
  };

  const userSqls = await Promise.all([
    localGuide,
    hutWorker,
    emergencyOperator,
    hiker,
    platformManager
  ].map(async ({ id, email, password, firstName, lastName, role }) => {
    const passwordHashed = await hash(password, HASH_ROUNDS);
    const verified = true;

    return `
  INSERT INTO "public"."users" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "verified"
  ) VALUES(
    ${id},
    ${escape.literal(email)},
    ${escape.literal(passwordHashed)},
    ${escape.literal(firstName)},
    ${escape.literal(lastName)},
    ${role},
    ${verified ? 'true' : 'false'}
  );
  `}));

  return userSqls.join('\n');

}

// prepare final sql for all hikes
function prepareHikesSql(hikes) {
  let sql = '';

  hikes.forEach(({
    fileName,
    name,
    country,
    difficulty,
  }) => {
    const gpxPath = `/static/gpx/${fileName}`;

    sql += `
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        ${LOCAL_GUIDE_ID},
        ${escape.literal(name)},
        ${difficulty},
        ${escape.literal(gpxPath)},
        ${escape.literal(country)}
      );
    `;
  });

  return sql;
}


function getGPXFileList(dir) {
  const globOpts = {
    prefixBase: true,
    srcBase: dir,
  };
  return glob.find('*.geojson', globOpts).sort();
}

function saveGPXFile({ fileIndex, hike: { name, difficulty, points } }) {
  const prepared = name.replace(/[^a-z0-9]/gi, '_');
  let fileName = `${fileIndex.toString().padStart(3, '0')}_${prepared}.gpx`;
  const filePath = join(DEST_DIR, `${fileIndex.toString().padStart(3, '0')}_${prepared}.gpx`);
  let count = 0;
  let lines = [];
  lines.push(XML_TAG);
  lines.push(GPX_TAG);
  lines.push(`  <trk>`);
  lines.push(`    <name>${name}</name>`);
  lines.push(`    <difficulty>${difficulty}</difficulty>`);
  lines.push(`    <trkseg>`);
  points.forEach((point) => {
    lines.push(`      <trkpt lat="${point.lat}" lon="${point.lon}">`);
    if (point.time) {
      lines.push(`        <time>${point.time}</time>`);
    }
    if (point.ele) {
      lines.push(`        <ele>${point.ele}</ele>`);
    }
    if (point.hdop) {
      lines.push(`        <hdop>${point.hdop}</hdop>`);
    }
    lines.push(`      </trkpt>`);
    count++;
  });
  lines.push(`    </trkseg>`);
  lines.push(`  </trk>`);
  lines.push(`</gpx>`);
  console.log(` Saving ${chalk.cyan(count)} points to ${chalk.cyan(filePath)}`);
  writeFileSync(filePath, lines.join('\n'));

  return {
    fileName,
    filePath,
  }
}
