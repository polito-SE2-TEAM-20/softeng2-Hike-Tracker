#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { ensureDir } from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import glob from 'globule';
import { uniqBy, prop, pick, clamp, clone } from 'ramda';
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
const HIKES_DIR = './result/gpx';

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

  await ensureDir(dest);
  await ensureDir(IMAGES_DIR);

  const allHikesSaved = []
  let fileIndex = 1;

  for (const file of fileList) {
    try {
      console.log('reading gpx', file);
      const fileName = path.basename(file)
      const contents = (readFileSync(file));
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "$"
      });
      const gpxData = parser.parse(contents).gpx;
      const pointsCount = gpxData.trk.trkseg.trkpt.length;

      let length = gpxData.trk.length ? parseFloat(gpxData.trk.length.replace(/,/g, '.')) : NaN;
      if (Number.isNaN(length)) {
        length = faker.datatype.float({ precision: 0.1, min: 3, max: 10 }) * 1000;
      }

      let ascent = gpxData.trk.ascent ? parseFloat(gpxData.trk.ascent.replace(/,/g, '.')) : NaN;
      if (Number.isNaN(ascent)) {
        ascent = faker.datatype.float({ precision: 0.1, min: 50, max: 940 });
      }

      // save gpx
      const filePath = path.join(HIKES_DIR, fileName);
      writeFileSync(filePath, contents);
      // save images
      const pictures = gpxData.metadata.pictures?.length ? [
        gpxData.metadata.pictures,
      ] : [];
      pictures.forEach(filename => {
        copyFileSync(path.join(SOURCE_DIR, 'processed', filename), path.join(IMAGES_DIR, filename));
      });

      const hike = {
        fileName,
        sourceFile: file,
        gpxPath: `/static/gpx/${fileName}`,
        title: gpxData.trk.name,
        description: (gpxData.metadata.desc ?? '').slice(0, 1000),
        expectedTime: gpxData.metadata.time,
        pictures: pictures.map(filename => `/static/images/${filename}`),
        ascent,
        length,
        userId: undefined,
        ...pick(['region', 'province', 'city', 'country'], gpxData.trk),
        difficulty: gpxData.trk.difficulty ?? 0,
        startPoint: gpxData.trk.startPoint ? {
          ...pick(['name', 'address', 'lon', 'lat'], gpxData.trk.startPoint)
        } : null,
        endPoint: gpxData.trk.endPoint ? {
          ...pick(['name', 'address', 'lon', 'lat'], gpxData.trk.endPoint)
        } : null,
        referencePoints: gpxData.trk.referencePoint?.ref?.length
          ? gpxData.trk.referencePoint.ref.map(ref => ({
            ...pick(['name', 'address', 'lon', 'lat'], ref),
            altitude: ref.elevation,
          }))
          : null,
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
      // console.log(gpxData.trk.trkseg);
      // throw new Error('123');

      allHikesSaved.push(hike);
      fileIndex++;
    } catch (error) {
      console.error(chalk.red(error));
    }
  }

  console.log('prepared', allHikesSaved.length, 'hikes');
  // now prepare sql for inserting them
  const usersSql = await prepareUsersSql();
  const hikesSql = prepareHikesSql(allHikesSaved);

  const houses = Array(20).fill(0).map(v => `${faker.datatype.uuid()}.jpg`);
  const indoors = Array(20).fill(0).map(v => `${faker.datatype.uuid()}.jpg`);

  // prepare demo.json file
  writeFileSync(path.join('./result/demo.json'), JSON.stringify({
    houses,
    indoors,
    width: 500,
    height: 500,
  }))

  // fill local db and export it
  const schemaSql = await prepareSchemaSql();
  const {sql:hutsSql,hutsCount} = prepareHutsSql(houses, indoors);
  writeFileSync(path.join('./result/init.sql'), [
    schemaSql,
    usersSql,
    hikesSql,
    hutsSql,
    await prepareHutWorkersSql(hutsCount, 7),
    await prepareParkingLotsSql()
  ].join('\n'));

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

    const friend = {
      id: 6,
      email: "francesco@friend.it",
      password: "lqeodp",
      firstName: "Francesco",
      lastName: "Grande",
      role: 1,
    };

    const localGuide = {
      id: LOCAL_GUIDE_ID,
      email: "antonio@localguide.it",
      password: "qwerty",
      firstName: "Antonio",
      lastName: "Battipaglia",
      role: 2
    };

    const platformManager = {
      id: 3,
      email: "vincenzo@admin.it",
      password: "asdfgh",
      firstName: "Vincenzo",
      lastName: "Sagristano",
      role: 3
    };

    const hutWorker = {
      id: 4,
      email: "erfan@hutworker.it",
      password: "098765",
      firstName: "Erfan",
      lastName: "Gholami",
      role: 4
    };

    const emergencyOperator = {
      id: 5,
      email: "laura@emergency.it",
      password: "hetise",
      firstName: "Laura",
      lastName: "Zurru",
      role: 5
    };

    const userSqls = await Promise.all([
      localGuide,
      hutWorker,
      emergencyOperator,
      hiker,
      platformManager,
      friend,
    ].map(async ({ id, email, password, firstName, lastName, role }) => {
      const passwordHashed = await hash(password, HASH_ROUNDS);
      const verified = true;
      const approved = true;

      return `
  INSERT INTO "public"."users" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "verified",
    "approved"
  ) VALUES(
    ${id},
    ${escape.literal(email)},
    ${escape.literal(passwordHashed)},
    ${escape.literal(firstName)},
    ${escape.literal(lastName)},
    ${role},
    ${verified ? 'true' : 'false'},
    ${approved ? 'true' : 'false'}
  );
  `}));

    return userSqls.join('\n');
  }

  async function prepareHutWorkersSql(hutsCount, minId) {
    // some random hut workers
    const hutWorkers = Array(hutsCount).fill(0).map((_, i) => {
      const sex = Math.random() < 0.5 ? 'male' : 'female';
      const firstName = faker.name.firstName(sex);
      const lastName = faker.name.lastName(sex);

      return {
        id: minId + i,
        email: `hutWorker${i}@gmail.com`,
        password: `soundsLike${i}`,
        firstName,
        lastName,
        role: 4,
        approved: i % 2 == 0,
        hutId: i + 1,
      }
    });

    const hutWorkersSql = await Promise.all(hutWorkers.map(async ({ id, hutId, approved, email, password, firstName, lastName, role }) => {
      const passwordHashed = await hash(password, HASH_ROUNDS);

      return `
      select public."insert_hut_worker"(
        ${(id)},
        ${escape.literal(email)},
        ${escape.literal(passwordHashed)},
        ${escape.literal(firstName)},
        ${escape.literal(lastName)},
        ${role},
        ${hutId},
        ${approved}
      );
    `}));

    return `
      CREATE OR REPLACE FUNCTION public.insert_hut_worker(
        hwid integer,
        email varchar,
        password varchar,
        first_name varchar,
        last_name varchar,
        role integer,
        hut_id integer,
        approved boolean
      ) RETURNS VOID AS
      $func$
      DECLARE
        user_id integer;
      BEGIN
      INSERT INTO "public"."users" (
        "id",
        "email",
        "password",
        "firstName",
        "lastName",
        "role",
        "verified",
        "approved"
      ) VALUES(
        hwid, email, password, first_name, last_name, role, true, approved
      ) returning id into user_id;

      INSERT INTO "public"."hut-worker" (
        "userId",
        "hutId"
      ) VALUES ( user_id, hut_id);
      END
      $func$ LANGUAGE plpgsql;

      ${hutWorkersSql.join('\n')}
  `;
  }
  // prepare final sql for all hikes
  function prepareHikesSql(hikes) {
    let hikesSql = '';

    hikes.forEach(({
      fileName,
      userId = LOCAL_GUIDE_ID,
      title,
      difficulty,
      gpxPath,
      country,
      region,
      province,
      city,
      length,
      ascent,
      expectedTime,
      description,
      pictures,
      startPoint = null,
      endPoint = null,
      referencePoints = null,
    }) => {
      hikesSql += `
      select public."insert_hike"(
        ${userId},
        ${escape.literal(title)},
        ${difficulty},
        ${escape.literal(gpxPath)},
        ${escape.literal(country)},
        ${escape.literal(region)},
        ${escape.literal(province)},
        ${escape.literal(city)},
        ${length},
        ${ascent},
        ${expectedTime},
        ${escape.literal(description)},
        ${escape.literal(JSON.stringify(pictures))}::jsonb,
        ${startPoint ? `${escape.literal(JSON.stringify(startPoint))}::jsonb` : 'NULL'},
        ${endPoint ? `${escape.literal(JSON.stringify(endPoint))}::jsonb` : 'NULL'},
        ${referencePoints ? `${escape.literal(JSON.stringify(referencePoints))}::jsonb` : 'NULL'}
      );
    `;
    });

    const sql = `
      CREATE OR REPLACE FUNCTION public.insert_hike(
        user_id integer,
        title varchar,
        difficulty integer,
        gpx_path varchar,
        country varchar,
        region varchar,
        province varchar,
        city varchar,
        length numeric(12,2),
        ascent numeric(12,2),
        expected_time integer,
        description varchar,
        pictures jsonb,
        start_point jsonb,
        end_point jsonb,
        reference_points jsonb
      )  RETURNS VOID AS
      $func$
      DECLARE
        hike_id integer;
        point_id integer;
        ref jsonb;
        i integer;
      BEGIN
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
        "description",
        "pictures"
      ) VALUES(
        user_id, title, difficulty, gpx_path,
        country, region, province, city,
        length, ascent, expected_time, description, pictures
      ) returning id into hike_id;

      -- create start end point if necessary
      if start_point is not null then
        insert into public.points (
          "type", "position", "name", "address"
        ) values (
          0,
          public.ST_SetSRID(public.ST_MakePoint((start_point->>'lon')::double precision, (start_point->>'lat')::double precision), 4326),
          (start_point->>'name')::varchar,
          (start_point->>'address')::varchar
        ) returning id into point_id;
        insert into public.hike_points (
          "hikeId", "pointId", "type", "index"
        ) values (
          hike_id,
          point_id,
          5,
          0
        );
      end if;

      -- end point --
      if end_point is not null then
        insert into public.points (
          "type", "position", "name", "address"
        ) values (
          0,
          public.ST_SetSRID(public.ST_MakePoint((end_point->>'lon')::double precision, (end_point->>'lat')::double precision), 4326),
          (end_point->>'name')::varchar,
          (end_point->>'address')::varchar
        ) returning id into point_id;
        insert into public.hike_points (
          "hikeId", "pointId", "type", "index"
        ) values (
          hike_id,
          point_id,
          6,
          100000
        );
      end if;

      -- reference points
      i = 1;
      if reference_points is not null then
        for ref in select * FROM jsonb_array_elements(reference_points)
        loop
          insert into public.points (
            "type", "position", "name", "address", "altitude"
          ) values (
            0,
            public.ST_SetSRID(public.ST_MakePoint((ref->>'lon')::double precision, (ref->>'lat')::double precision), 4326),
            (ref->>'name')::varchar,
            (ref->>'address')::varchar,
            (ref->>'altitude')::numeric(12,2)
          ) returning id into point_id;
          insert into public.hike_points (
            "hikeId", "pointId", "type", "index"
          ) values (
            hike_id,
            point_id,
            3,
            i
          );
          i = i + 1;
        end loop;
      end if;
      END
      $func$ LANGUAGE plpgsql;

      ${hikesSql}
    `;

    return sql;
  }

  function prepareHutsSql(houses, indoors) {
    const hutsAll = JSON.parse(readFileSync('./source/huts.json').toString());
    const everyNth = 15;
    const huts = hutsAll.filter((e, i) => i % everyNth === everyNth - 1);

    const toStatic = img => `/static/images/${img}`;

    const hutsCount = huts.length;
    // generate random images pool, they will be downloaded on backend build   
    const hutsSql = huts.map(hut => {
      const [name, ...other] = hut[2].split(' - ');
      const address = other.map(v => v.trim()).filter(v => !!v).join(', ');

      const workingTimeStart = faker.datatype.number({ min: 1, max: 9 });
      const workingTimeEnd = faker.datatype.number({ min: 18, max: 23 });

      const mainPicture = toStatic(shuffle(clone(houses))[0]);
      const indoorPics = shuffle(clone(indoors)).slice(0, 4).map(toStatic);

      const pictures = [mainPicture, ...indoorPics];

      return `
      select public."insert_hut"(
        ${LOCAL_GUIDE_ID},
        ${hut[0]},
        ${hut[1]},
        ${faker.datatype.number({ min: 1, max: 10 })},
        ${faker.datatype.number({ min: 35, max: 150 })}::numeric(12,2),
        ${escape.literal(name)},
        ${escape.literal(address)},
        ${escape.literal(faker.name.fullName())},
        ${escape.literal(faker.internet.url())},
        ${faker.datatype.number({ min: 260, max: 340, precision: 0.001 })},
        '${workingTimeStart.toString().padStart(2, '0')}:00:00'::time without time zone,
        '${workingTimeEnd.toString().padStart(2, '0')}:00:00'::time without time zone,
        ${escape.literal(faker.internet.email())},
        ${escape.literal(faker.phone.number('+39##########'))},
        ${escape.literal(JSON.stringify(pictures))}::jsonb,
        ${escape.literal(faker.lorem.sentences(faker.datatype.number({ min: 2, max: 5 }), '\n').slice(0, 1000))}
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
        elevation numeric(12,2),
        working_time_start time without time zone,
        working_time_end time without time zone,
        email varchar,
        phone_number varchar,
        pictures jsonb,
        description varchar
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
      "elevation",
      "workingTimeStart",
      "workingTimeEnd",
      "email",
      "phoneNumber",
      "pictures",
      "description"
    ) VALUES (
      user_id,
      point_id,
      number_of_beds,
      price,
      title,
      owner_name,
      website,
      elevation,
      working_time_start,
      working_time_end,
      email,
      phone_number,
      pictures,
      description
    );
    END
    $func$ LANGUAGE plpgsql;

    ${hutsSql}
  `;

    return {
      sql,
      hutsCount,
    };
  }

  async function prepareParkingLotsSql() {
    const parkingsAll = await xml.parseStringPromise(readFileSync('./source/parking.xml').toString());
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
    const filePath = path.join(DEST_DIR, `${fileIndex.toString().padStart(3, '0')}_${prepared}.gpx`);
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

  function shuffle(d) {
    for (let c = d.length - 1; c > 0; c--) {
      let b = Math.floor(Math.random() * (c + 1));
      let a = d[c];
      d[c] = d[b];
      d[b] = a;
    }

    return d;
  };
})()