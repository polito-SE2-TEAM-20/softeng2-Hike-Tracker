#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import chalk from 'chalk';
import glob from 'globule';
import { uniqBy, prop, pick, clamp } from 'ramda';
import { randomInt } from 'crypto';
import escape from 'pg-escape';
import { hash } from 'bcrypt';
import { exec } from 'child_process';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'
import { faker } from '@faker-js/faker';
import * as xml from 'xml2js';
import { countries } from 'country-data'

faker.locale = 'it';

const SOURCE_DIR = './prove/';
const DEST_DIR = './result/gpx';
const IMAGES_DIR = './result/images';

const LOCAL_GUIDE_ID = 2;
const HASH_ROUNDS = 10;
const DB_USERNAME = 'germangorodnev'

const XML_TAG = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>';
const GPX_XMLNS = `xmlns="http://www.topografix.com/GPX/1/1"`;
const GPX_VERSION = `version="1.1"`;
const GPX_CREATOR = `creator="https://github.com/petele/gpx-split"`;
const GPX_TAG = `<gpx ${GPX_XMLNS} ${GPX_VERSION} ${GPX_CREATOR}>`;

(async () => {
  const source = SOURCE_DIR;
  const dest = DEST_DIR;

  const fileList = getTestFilesList(source);
  if (fileList.length === 0) {
    console.log('No files found, exiting...');
    process.exit();
  }
  if (!existsSync(dest)) {
    mkdirSync(dest);
  }

  const allHikesSaved = []
  let fileIndex = 1;

  for (const file of fileList) {
    try {
      console.log('reading gpx', file);
      const fileName = basename(file)
      const contents = (readFileSync(file));
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "$"
      });
      const gpxData = parser.parse(contents).gpx;
      const hike = {
        fileName,
        title: gpxData.trk.name,
        description: gpxData.metadata.desc,
        expectedTime: gpxData.metadata.time,
        pictures: gpxData.metadata.pictures?.length ? [
          `/static/images/${gpxData.metadata.pictures}`
        ] : [],
        ascent: 1,
        ...pick(['region', 'province', 'city', 'country', 'difficulty'], gpxData.trk),
      }

      /**
        gpx: {
          metadata: {
            author: {
              email: '',
              firstName: 'Mary',
              lastName: 'Anderson',
              phoneNumber: 321456783
            },
            desc: 'Durante il periodo invernale la strada è pulita solo fino all’abitato di Città, sarà necessario quindi lasciare l’auto qui e proseguire a piedi.',
            time: 80,
            pictures: '3.jpg',
            bounds: ''
          },
          trk: {
            name: 'Amprimo',
            difficulty: 2,
            country: 'Italia',
            region: 'Piemonte',
            province: 'Torino',
            city: 'Bussoleno',
            startPoint?: {
              name: 'Start Point',
              address: 'Rifugio Amprimo, Via Rio Gerardo, Giordani, Mattie, Torino, Piemonte, 10053, Italia',
              lat: 45.102780737,
              lon: 7.165559804
            },
            endPoint?: {
              name: 'Start Point',
              address: 'Rifugio Amprimo, Via Rio Gerardo, Giordani, Mattie, Torino, Piemonte, 10053, Italia',
              lat: 45.102780737,
              lon: 7.165559804
            },
            referencePoint?: {
              ref: [{
                name: 'Ref Point 2',
                address: '',
                elevation: 1283.605,
                lat: 45.102886551,
                lon: 7.158207147
              }]
            },
            trkseg: [Object]
          }
        }
       */
      console.log(gpxData.trk.trkseg);
      throw new Error('123');

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

        if (!points.length
          || points.length < 25) { continue; }

        featuresPrepared.push({
          name,
          country: 'USA',
          difficulty,
          points,
        });
      }

      const hikes = uniqBy(prop('name'), featuresPrepared);

      // write all hikes to gpx
      for (let i = 0; i < hikes.length; ++i) {
        const hike = hikes[i];

        const { fileName } = await saveGPXFile({
          hike,
          fileIndex,
        });
        ++fileIndex;

        hike.fileName = fileName;

        allHikesSaved.push(hike);
      }

      console.log('prepared', allHikesSaved.length, 'hikes');
      // now prepare sql for inserting them
      const usersSql = await prepareUsersSql();
      const hikesSql = prepareHikesSql(allHikesSaved);

      // fill local db and export it

      const schemaSql = await prepareSchemaSql()
      writeFileSync(join('./result/init.sql'), [
        schemaSql,
        usersSql,
        hikesSql,
        prepareHutsSql(),
        await prepareParkingLotsSql()
      ].join('\n'));
    } catch (error) {
      console.error(chalk.red(error));
    }
  }


  async function prepareSchemaSql() {
    return new Promise((res, rej) => {
      exec(`source .env && echo "$DB_PASSWORD" | pg_dump -s --no-owner --no-acl --username ${DB_USERNAME} hiking`, (error, stdout, stderr) => {
        if (error) {
          return rej(error);
        }

        // console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);

        return res(stdout);
      })
    })
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

    let maxPoints = 0;
    hikes.forEach(({
      fileName,
      name,
      difficulty,
      points
    }) => {
      if (points.length > maxPoints) {
        maxPoints = points.length;
      }

      const gpxPath = `/static/gpx/${fileName}`;

      const country = 'USA';
      const city = faker.address.city()
      const province = '';
      const region = faker.address.state();

      const pointsCount = points.length;
      const lengthMin = clamp(0.05, 1, pointsCount / 1500) * 1 + 0.5;
      const lengthMax = clamp(0.05, 1, pointsCount / 1500) * 20 + 0.5;
      const length = faker.datatype.float({ precision: 0.1, min: lengthMin, max: lengthMax });
      const ascent = faker.datatype.float({ precision: 0.1, min: 5, max: 30 });
      const expectedTime = +((length / faker.datatype.float({ precision: 0.01, min: 3.5, max: 5 }) * 60).toFixed(3));
      const description = '';

      sql += `
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country",
        "region",
        "province",
        "city",
        "length",
        "ascent",
        "expectedTime",
        "description"
      ) VALUES(
        ${LOCAL_GUIDE_ID},
        ${escape.literal(name)},
        ${difficulty},
        ${escape.literal(gpxPath)},
        ${escape.literal(country)},
        ${escape.literal(region)},
        ${escape.literal(province)},
        ${escape.literal(city)},
        ${length},
        ${ascent},
        ${expectedTime},
        ${escape.literal(description)}
      );
    `;
    });

    console.log('----- MNAX POINTS', maxPoints)

    return sql;
  }

  function prepareHutsSql() {
    const hutsAll = JSON.parse(readFileSync(join(SOURCE_DIR, 'huts.json')).toString());
    const everyNth = 15;
    const huts = hutsAll.filter((e, i) => i % everyNth === everyNth - 1);

    const hutsSql = huts.map(hut => {
      const [name, ...other] = hut[2].split(' - ');
      const address = other.map(v => v.trim()).filter(v => !!v).join(', ');

      return `
      select public."insert_hut"(
        ${LOCAL_GUIDE_ID},
        ${hut[0]},
        ${hut[1]},
        ${faker.datatype.number({ min: 1, max: 10 })},
        ${faker.datatype.number({ min: 35, max: 150 })},
        ${escape.literal(name)},
        ${escape.literal(address)},
        ${escape.literal(faker.name.fullName())},
        ${escape.literal(faker.internet.url())},
        null
      );
    `;
    }).join('\n');

    const sql = `
    CREATE OR REPLACE FUNCTION public.insert_hut(
        user_id integer,
        lat double precision,
        lon double precision,
        number_of_beds integer,
        price numeric(12,2),
        title varchar,
        address varchar,
        owner_name varchar,
        website varchar,
        elevation numeric(12,2)
    )  RETURNS VOID AS
    $func$
    DECLARE
      point_id integer;
    BEGIN
    insert into public.points (
      "type", "position", "name", "address"
    ) values (
      0,
      public.ST_SetSRID(public.ST_MakePoint(lon, lat), 4326),
      title,
      address
    ) returning id into point_id;

    INSERT INTO "public"."huts" (
      "userId",
      "pointId",
      "numberOfBeds",
      "price",
      "title",
      "ownerName",
      "website",
      "elevation"
    ) VALUES (
      user_id,
      point_id,
      number_of_beds,
      price,
      title,
      owner_name,
      website,
      elevation
    );
    END
    $func$ LANGUAGE plpgsql;

    ${hutsSql}
  `;

    return sql;
  }

  async function prepareParkingLotsSql() {
    const parkingsAll = await xml.parseStringPromise(readFileSync(join(SOURCE_DIR, 'parking.xml')).toString());
    const everyNth = 100;

    const parkings = parkingsAll.osm.node.filter((e, i) => i % everyNth === everyNth - 1);
    // console.log(parkings[0].tag);

    const getTag = (tags, name) => tags ? tags.find(t => t.$.k === name)?.$?.v : undefined;

    const parkingsSql = parkings.map(parking => {
      const tags = parking.tag
      const lat = parking.$.lat;
      const lon = parking.$.lon;
      const name = getTag(tags, 'name');

      const maybeCap = getTag(tags, 'capacity');
      const capacity = maybeCap && !Number.isNaN(+maybeCap) ? +maybeCap : faker.datatype.number({ min: 25, max: 300 });

      const mbcountry = getTag(tags, 'addr:country');
      const country = mbcountry ? countries[mbcountry.toUpperCase()]?.name : 'Italy';
      const city = getTag(tags, 'addr:city') || faker.address.city();
      const street = getTag(tags, 'addr:street') || faker.address.street();
      const housenumber = getTag(tags, 'addr:housenumber') || faker.address.buildingNumber();

      const address = `${housenumber} ${street}, ${city}, ${country}`;
      const region = faker.address.state();
      const province = '';

      return `
      select public."insert_parking_lot"(
        ${LOCAL_GUIDE_ID},
        ${lat},
        ${lon},
        ${escape.literal(name)},
        ${capacity},
        ${escape.literal(address)},
        ${escape.literal(city)},
        ${escape.literal(country)},
        ${escape.literal(region)},
        ${escape.literal(province)}
      );
    `;
    }).join('\n');

    const sql = `
    CREATE OR REPLACE FUNCTION public.insert_parking_lot(
        user_id integer,
        lat double precision,
        lon double precision,
        name varchar,
        max_cars integer,
        address varchar,
        city varchar,
        country varchar,
        region varchar,
        province varchar
    )  RETURNS VOID AS
    $func$
    DECLARE
      point_id integer;
    BEGIN
    insert into public.points (
      "type", "position", "name", "address"
    ) values (
      0,
      public.ST_SetSRID(public.ST_MakePoint(lon, lat), 4326),
      '',
      address
    ) returning id into point_id;

    INSERT INTO "public"."parking_lots" (
      "userId",
      "pointId",
      "maxCars",
      "country",
      "region",
      "province",
      "city"
    ) VALUES (
      user_id,
      point_id,
      max_cars,
      country,
      region,
      province,
      city
    );
    END
    $func$ LANGUAGE plpgsql;

    ${parkingsSql}
  `;

    return sql;
  }

  function getGPXFileList(dir) {
    const globOpts = {
      prefixBase: true,
      srcBase: dir,
    };
    return glob.find('*.geojson', globOpts).sort();
  }

  function getTestFilesList(dir) {
    return glob.find('*.gpx', {
      prefixBase: true,
      srcBase: dir,
    }).sort();
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
    // console.log(` Saving ${chalk.cyan(count)} points to ${chalk.cyan(filePath)}`);
    writeFileSync(filePath, lines.join('\n'));

    return {
      fileName,
      filePath,
    }
  }
})()