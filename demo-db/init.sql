--
-- PostgreSQL database dump
--

-- Dumped from database version 13.8
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hike_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hike_points (
    "hikeId" integer NOT NULL,
    "pointId" integer NOT NULL,
    index integer NOT NULL,
    type smallint DEFAULT '0'::smallint NOT NULL
);


--
-- Name: hikes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hikes (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    length numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    "expectedTime" integer DEFAULT 0 NOT NULL,
    ascent numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    difficulty smallint DEFAULT '0'::smallint NOT NULL,
    title character varying(500) DEFAULT ''::character varying NOT NULL,
    description character varying(1000) DEFAULT ''::character varying NOT NULL,
    "gpxPath" character varying(1024),
    distance numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    region public.citext DEFAULT ''::public.citext NOT NULL,
    province public.citext DEFAULT ''::public.citext NOT NULL,
    city public.citext DEFAULT ''::public.citext NOT NULL,
    country public.citext DEFAULT ''::public.citext NOT NULL
);


--
-- Name: hikes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hikes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hikes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hikes_id_seq OWNED BY public.hikes.id;


--
-- Name: huts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.huts (
    id integer NOT NULL,
    "pointId" integer NOT NULL,
    "numberOfBeds" integer,
    price numeric(12,2) DEFAULT '0'::numeric,
    title character varying(1024) DEFAULT ''::character varying NOT NULL,
    "userId" integer NOT NULL,
    "ownerName" character varying(1024),
    website character varying
);


--
-- Name: huts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.huts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: huts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.huts_id_seq OWNED BY public.huts.id;


--
-- Name: parking_lots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parking_lots (
    id integer NOT NULL,
    "pointId" integer NOT NULL,
    "maxCars" integer,
    "userId" integer NOT NULL,
    country character varying,
    region character varying,
    province character varying,
    city character varying
);


--
-- Name: parking_lots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.parking_lots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: parking_lots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parking_lots_id_seq OWNED BY public.parking_lots.id;


--
-- Name: points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.points (
    id integer NOT NULL,
    type smallint DEFAULT '0'::smallint NOT NULL,
    "position" public.geography(Point,4326),
    name character varying(256),
    address character varying(1024)
);


--
-- Name: points_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.points_id_seq OWNED BY public.points.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    password character varying(256) NOT NULL,
    "firstName" character varying(100) NOT NULL,
    "lastName" character varying(100) NOT NULL,
    role integer NOT NULL,
    email character varying(256) NOT NULL,
    "phoneNumber" character varying(10),
    verified boolean DEFAULT false NOT NULL,
    "verificationHash" character varying(256)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: hikes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hikes ALTER COLUMN id SET DEFAULT nextval('public.hikes_id_seq'::regclass);


--
-- Name: huts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.huts ALTER COLUMN id SET DEFAULT nextval('public.huts_id_seq'::regclass);


--
-- Name: parking_lots id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_lots ALTER COLUMN id SET DEFAULT nextval('public.parking_lots_id_seq'::regclass);


--
-- Name: points id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points ALTER COLUMN id SET DEFAULT nextval('public.points_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: parking_lots PK_27af37fbf2f9f525c1db6c20a48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_lots
    ADD CONSTRAINT "PK_27af37fbf2f9f525c1db6c20a48" PRIMARY KEY (id);


--
-- Name: points PK_57a558e5e1e17668324b165dadf; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.points
    ADD CONSTRAINT "PK_57a558e5e1e17668324b165dadf" PRIMARY KEY (id);


--
-- Name: hike_points PK_7fc686c35c52228d8494a7c4947; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hike_points
    ADD CONSTRAINT "PK_7fc686c35c52228d8494a7c4947" PRIMARY KEY ("hikeId", "pointId");


--
-- Name: hikes PK_881b1b0345363b62221642c4dcf; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hikes
    ADD CONSTRAINT "PK_881b1b0345363b62221642c4dcf" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: huts PK_adcd88a1c922beb9143eb3bdfec; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.huts
    ADD CONSTRAINT "PK_adcd88a1c922beb9143eb3bdfec" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: hike_points_hikeId_index_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hike_points_hikeId_index_idx" ON public.hike_points USING btree ("hikeId", index);


--
-- Name: points_position_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX points_position_idx ON public.points USING gist ("position");


--
-- Name: hikes FK_3a853c2e56855fa75564bc82b95; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hikes
    ADD CONSTRAINT "FK_3a853c2e56855fa75564bc82b95" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: huts FK_4a2dcd9958cff25c15716d39ace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.huts
    ADD CONSTRAINT "FK_4a2dcd9958cff25c15716d39ace" FOREIGN KEY ("pointId") REFERENCES public.points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: huts FK_6c722f6be150f27b3b63b572dd6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.huts
    ADD CONSTRAINT "FK_6c722f6be150f27b3b63b572dd6" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parking_lots FK_887e0df89863e659bb84db732de; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_lots
    ADD CONSTRAINT "FK_887e0df89863e659bb84db732de" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parking_lots FK_bcefe331ee2ad14ff880bdfddc5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_lots
    ADD CONSTRAINT "FK_bcefe331ee2ad14ff880bdfddc5" FOREIGN KEY ("pointId") REFERENCES public.points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hike_points hike_points_hikeId_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hike_points
    ADD CONSTRAINT "hike_points_hikeId_fk" FOREIGN KEY ("hikeId") REFERENCES public.hikes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hike_points hike_points_pointId_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hike_points
    ADD CONSTRAINT "hike_points_pointId_fk" FOREIGN KEY ("pointId") REFERENCES public.points(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--



  INSERT INTO "public"."users" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "verified"
  ) VALUES(
    2,
    'antonio@localguide.it',
    '$2b$10$PsDLaB2wKWoCBwsakInnSeNSTSwT3RHKQHlye0yMmF8IWJ3JdG9GG',
    'Antonio',
    'Battipaglia',
    2,
    true
  );
  

  INSERT INTO "public"."users" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "verified"
  ) VALUES(
    4,
    'erfan@hutworker.it',
    '$2b$10$cHHkJ3DXfRQwPTc5PSl65u5fW6XC0uAtwkVojAgrDFeJsQJkUwr3y',
    'Erfan',
    'Gholami',
    4,
    true
  );
  

  INSERT INTO "public"."users" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "verified"
  ) VALUES(
    5,
    'laura@emergency.it',
    '$2b$10$rrupUqcjIEiWZST7umQ03urSZrOiBP./pdZSZKVLTqOUbmlvTCszG',
    'Laura',
    'Zurru',
    5,
    true
  );
  

  INSERT INTO "public"."users" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "verified"
  ) VALUES(
    1,
    'german@hiker.it',
    '$2b$10$/yIBlLhRVRRK/BL8OACFD.fkUYpgEkAlz0FHtmBZ44cB095/ovnu6',
    'German',
    'Gorodnev',
    0,
    true
  );
  

  INSERT INTO "public"."users" (
    "id",
    "email",
    "password",
    "firstName",
    "lastName",
    "role",
    "verified"
  ) VALUES(
    3,
    'vincenzo@admin.it',
    '$2b$10$UD9sbtXwINAIPuK/bPCTZ.0aLQz0rnGIVGXkLh73namMJQgk6FlZu',
    'vincenzo',
    'Sagristano',
    3,
    true
  );
  

      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Airline Trail - Detour',
        2,
        '/static/gpx/001_Airline_Trail___Detour.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Airline Trail',
        2,
        '/static/gpx/002_Airline_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Colchester Railroad',
        0,
        '/static/gpx/003_Colchester_Railroad.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Willimantic Flower Bridge',
        2,
        '/static/gpx/004_Willimantic_Flower_Bridge.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Willimantic Pedestrian Bridge',
        1,
        '/static/gpx/005_Willimantic_Pedestrian_Bridge.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Two Sister''S Preserve Loop Trail',
        2,
        '/static/gpx/006_Two_Sister_S_Preserve_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Putnam River Trail',
        0,
        '/static/gpx/007_Putnam_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Airline Trail Bypass',
        2,
        '/static/gpx/008_Airline_Trail_Bypass.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Indian Neck',
        1,
        '/static/gpx/009_Indian_Neck.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Stony Creek',
        2,
        '/static/gpx/010_Stony_Creek.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quarry-Westwoods',
        2,
        '/static/gpx/011_Quarry_Westwoods.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Short Beach',
        2,
        '/static/gpx/012_Short_Beach.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Charter Oak Greenway',
        1,
        '/static/gpx/013_Charter_Oak_Greenway.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bissell Greenway',
        1,
        '/static/gpx/014_Bissell_Greenway.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Riverfront Trail System',
        1,
        '/static/gpx/015_Riverfront_Trail_System.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Millers Pond Park Trail',
        2,
        '/static/gpx/016_Millers_Pond_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mattabesett Trail',
        2,
        '/static/gpx/017_Mattabesett_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Jefferson Park Trail',
        2,
        '/static/gpx/018_Jefferson_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Cockaponset Trail',
        2,
        '/static/gpx/019_Cockaponset_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mt. Nebo Park',
        1,
        '/static/gpx/020_Mt__Nebo_Park.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        ' ',
        2,
        '/static/gpx/021__.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Proposed Trail',
        2,
        '/static/gpx/022_Proposed_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Blinnshed Ridge Trail',
        2,
        '/static/gpx/023_Blinnshed_Ridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Neck River Trail',
        2,
        '/static/gpx/024_Neck_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Unnamed Trail',
        2,
        '/static/gpx/025_Unnamed_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Oil Mill Brook Trail',
        2,
        '/static/gpx/026_Oil_Mill_Brook_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Chatfield Trail',
        2,
        '/static/gpx/027_Chatfield_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Unamed Trail',
        2,
        '/static/gpx/028_Unamed_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Lost Pond Trail',
        2,
        '/static/gpx/029_Lost_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Ccc Camp Hadley Trail',
        2,
        '/static/gpx/030_Ccc_Camp_Hadley_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Double Loop Trail',
        2,
        '/static/gpx/031_Double_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Over Brook Trail',
        2,
        '/static/gpx/032_Over_Brook_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Cockaponset Forest Trail',
        2,
        '/static/gpx/033_Cockaponset_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pattaconk Trail',
        2,
        '/static/gpx/034_Pattaconk_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Westwoods Forest Trail',
        2,
        '/static/gpx/035_Westwoods_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Blinnshed Loop Trail',
        2,
        '/static/gpx/036_Blinnshed_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Unnamed Tsail',
        2,
        '/static/gpx/037_Unnamed_Tsail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Messerschmidt Wma Trail',
        1,
        '/static/gpx/038_Messerschmidt_Wma_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Westwoods Nature Trail',
        2,
        '/static/gpx/039_Westwoods_Nature_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Enduro',
        2,
        '/static/gpx/040_Enduro.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Land Trust Trail',
        2,
        '/static/gpx/041_Land_Trust_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Beaver Brook Park Trail',
        1,
        '/static/gpx/042_Beaver_Brook_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Housatonic Forest Trail',
        0,
        '/static/gpx/043_Housatonic_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Farmington Canal Trail',
        0,
        '/static/gpx/044_Farmington_Canal_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Beckley Furnace Park Path',
        0,
        '/static/gpx/045_Beckley_Furnace_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Farmington River Trail',
        1,
        '/static/gpx/046_Farmington_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Farminton Canal Trail',
        1,
        '/static/gpx/047_Farminton_Canal_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Farminton River Trail',
        2,
        '/static/gpx/048_Farminton_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hop River Trail',
        1,
        '/static/gpx/049_Hop_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hoprivertrail - Detouraround316',
        2,
        '/static/gpx/050_Hoprivertrail___Detouraround316.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hop River Trail - Long Hill Rd.',
        2,
        '/static/gpx/051_Hop_River_Trail___Long_Hill_Rd_.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hop River Trail - Rockville Spur',
        1,
        '/static/gpx/052_Hop_River_Trail___Rockville_Spur.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Housatonic Rail Trail',
        0,
        '/static/gpx/053_Housatonic_Rail_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Middletown Bikeway',
        1,
        '/static/gpx/054_Middletown_Bikeway.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mattabesett Trolley Trail',
        2,
        '/static/gpx/055_Mattabesett_Trolley_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Moosup Valley State Park Trail',
        1,
        '/static/gpx/056_Moosup_Valley_State_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinnebaug River Trail',
        1,
        '/static/gpx/057_Quinnebaug_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tracey Road Trail',
        1,
        '/static/gpx/058_Tracey_Road_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Trolley Trail',
        0,
        '/static/gpx/059_Trolley_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinnebaug Hatchery Trail',
        2,
        '/static/gpx/060_Quinnebaug_Hatchery_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hopeville Park Trail',
        2,
        '/static/gpx/061_Hopeville_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hopeville Park Path',
        1,
        '/static/gpx/062_Hopeville_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nehantic Trail',
        2,
        '/static/gpx/063_Nehantic_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Camp Columbia Trail',
        0,
        '/static/gpx/064_Camp_Columbia_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shelton Land Trust Trail',
        0,
        '/static/gpx/065_Shelton_Land_Trust_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Dinosaur Park Sidewalk',
        0,
        '/static/gpx/066_Dinosaur_Park_Sidewalk.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Dinosaur Park Trail',
        0,
        '/static/gpx/067_Dinosaur_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Access Road',
        1,
        '/static/gpx/068_Access_Road.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Day Pond Park Path',
        0,
        '/static/gpx/069_Day_Pond_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Day Pond Park Trail',
        1,
        '/static/gpx/070_Day_Pond_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Salmon River Trail',
        0,
        '/static/gpx/071_Salmon_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Salmon River Trial',
        1,
        '/static/gpx/072_Salmon_River_Trial.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Dennis Hill Park Trail',
        0,
        '/static/gpx/073_Dennis_Hill_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Railroad Trail',
        0,
        '/static/gpx/074_Railroad_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Gillette Castle Trail',
        2,
        '/static/gpx/075_Gillette_Castle_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kent Falls Park Path',
        2,
        '/static/gpx/076_Kent_Falls_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kent Falls Park Trail',
        1,
        '/static/gpx/077_Kent_Falls_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Lovers Leap Park Trail',
        1,
        '/static/gpx/078_Lovers_Leap_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Enders Forest Trail',
        1,
        '/static/gpx/079_Enders_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Gay City Park Path',
        0,
        '/static/gpx/080_Gay_City_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Gay City Park Trail',
        0,
        '/static/gpx/081_Gay_City_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Split Rock Trail',
        0,
        '/static/gpx/082_Split_Rock_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Gillette Castle Path',
        1,
        '/static/gpx/083_Gillette_Castle_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Great Pond Forest Trail',
        1,
        '/static/gpx/084_Great_Pond_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Haddam Meadows Park Trail',
        0,
        '/static/gpx/085_Haddam_Meadows_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Haley Farm Park Trail',
        2,
        '/static/gpx/086_Haley_Farm_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hammonasset Park Path',
        0,
        '/static/gpx/087_Hammonasset_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nature Trail',
        1,
        '/static/gpx/088_Nature_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hammonasset Bike Path',
        1,
        '/static/gpx/089_Hammonasset_Bike_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hammonasset Park Boardwalk',
        1,
        '/static/gpx/090_Hammonasset_Park_Boardwalk.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Meigs Point Jetty',
        2,
        '/static/gpx/091_Meigs_Point_Jetty.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Willard Island Nature Trail',
        1,
        '/static/gpx/092_Willard_Island_Nature_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Moraine Nature Trail',
        2,
        '/static/gpx/093_Moraine_Nature_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Haystack Park Trail',
        1,
        '/static/gpx/094_Haystack_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Higganum Reservoir Park Trail',
        1,
        '/static/gpx/095_Higganum_Reservoir_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Appalachian Trail',
        1,
        '/static/gpx/096_Appalachian_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mohawk Trail',
        1,
        '/static/gpx/097_Mohawk_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pine Knob Loop',
        1,
        '/static/gpx/098_Pine_Knob_Loop.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Appalachian/Pine Knob Loop',
        1,
        '/static/gpx/099_Appalachian_Pine_Knob_Loop.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'White Mountain Trail',
        1,
        '/static/gpx/100_White_Mountain_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'River Trail',
        0,
        '/static/gpx/101_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hurd Park Trail',
        2,
        '/static/gpx/102_Hurd_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hurd Park Path',
        1,
        '/static/gpx/103_Hurd_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Paugussett Trail',
        0,
        '/static/gpx/104_Paugussett_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Waterfall Trail',
        0,
        '/static/gpx/105_Waterfall_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Paugussett Trail Connector',
        2,
        '/static/gpx/106_Paugussett_Trail_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Minetto Park Trail',
        0,
        '/static/gpx/107_Minetto_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Coincident Macedonia Brook Rd',
        2,
        '/static/gpx/108_Coincident_Macedonia_Brook_Rd.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Coincident Weber Road',
        1,
        '/static/gpx/109_Coincident_Weber_Road.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Macedonia Ridge Trail',
        2,
        '/static/gpx/110_Macedonia_Ridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Cobble Mountain Trail',
        0,
        '/static/gpx/111_Cobble_Mountain_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shenipsit Trail',
        0,
        '/static/gpx/112_Shenipsit_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Meshomasic Forest Trail',
        0,
        '/static/gpx/113_Meshomasic_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Crest Trail',
        1,
        '/static/gpx/114_Crest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Campground Trail',
        0,
        '/static/gpx/115_Campground_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Brook Trail',
        2,
        '/static/gpx/116_Brook_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kettletown Park Trail',
        2,
        '/static/gpx/117_Kettletown_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'North Ridge Trail',
        2,
        '/static/gpx/118_North_Ridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'North Ridge Loop Trail',
        0,
        '/static/gpx/119_North_Ridge_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Miller Brook Connector Trail',
        1,
        '/static/gpx/120_Miller_Brook_Connector_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Miller Trail',
        0,
        '/static/gpx/121_Miller_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Miller Trail Spur',
        1,
        '/static/gpx/122_Miller_Trail_Spur.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pomperaug Trail',
        1,
        '/static/gpx/123_Pomperaug_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Brook Trail Access',
        1,
        '/static/gpx/124_Brook_Trail_Access.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Waramaug Lake Park Trail',
        0,
        '/static/gpx/125_Waramaug_Lake_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Well Groomed Trail',
        0,
        '/static/gpx/126_Well_Groomed_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mashamoquet Brook Park Trail',
        0,
        '/static/gpx/127_Mashamoquet_Brook_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shenipsit Trail Spur',
        2,
        '/static/gpx/128_Shenipsit_Trail_Spur.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shenipsit',
        2,
        '/static/gpx/129_Shenipsit.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nassahegon Forest Trail',
        1,
        '/static/gpx/130_Nassahegon_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tunxis Trail',
        2,
        '/static/gpx/131_Tunxis_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Black Spruce Bog Trail',
        2,
        '/static/gpx/132_Black_Spruce_Bog_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mohawk Forest Trail',
        0,
        '/static/gpx/133_Mohawk_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Ethan Allen Youth Trail',
        2,
        '/static/gpx/134_Ethan_Allen_Youth_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Punch Brook Trail',
        1,
        '/static/gpx/135_Punch_Brook_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Red Cedar Lake Trail',
        1,
        '/static/gpx/136_Red_Cedar_Lake_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Under Mountain Trail',
        2,
        '/static/gpx/137_Under_Mountain_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mount Tom Trail',
        1,
        '/static/gpx/138_Mount_Tom_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Naugatuck Trail',
        1,
        '/static/gpx/139_Naugatuck_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nehantic Forest Trail',
        1,
        '/static/gpx/140_Nehantic_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Naugatuck Forest Trail',
        0,
        '/static/gpx/141_Naugatuck_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Naugatuck Spur',
        1,
        '/static/gpx/142_Naugatuck_Spur.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Whitemore Trail',
        1,
        '/static/gpx/143_Whitemore_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinnipiac Trail',
        1,
        '/static/gpx/144_Quinnipiac_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nehantic Forest Trai',
        0,
        '/static/gpx/145_Nehantic_Forest_Trai.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nepaug Forest Trail',
        0,
        '/static/gpx/146_Nepaug_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Naugatuck',
        2,
        '/static/gpx/147_Naugatuck.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nyantaquit Trail',
        1,
        '/static/gpx/148_Nyantaquit_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tipping Rock Loop Trail',
        0,
        '/static/gpx/149_Tipping_Rock_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Valley Outlook Trail',
        0,
        '/static/gpx/150_Valley_Outlook_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shelter 4 Loop Trail',
        0,
        '/static/gpx/151_Shelter_4_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Osbornedale Park Trail',
        0,
        '/static/gpx/152_Osbornedale_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Unnamed',
        0,
        '/static/gpx/153_Unnamed.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Paugnut Forest Trail',
        2,
        '/static/gpx/154_Paugnut_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Charles L Pack Trail',
        0,
        '/static/gpx/155_Charles_L_Pack_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Peoples Forest Trail',
        1,
        '/static/gpx/156_Peoples_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Putnam Memorial Trail',
        0,
        '/static/gpx/157_Putnam_Memorial_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Platt Hill Park Trail',
        2,
        '/static/gpx/158_Platt_Hill_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Metacomet Trail',
        1,
        '/static/gpx/159_Metacomet_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Metacomet Trail Bypass',
        0,
        '/static/gpx/160_Metacomet_Trail_Bypass.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Penwood Park Trail',
        2,
        '/static/gpx/161_Penwood_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quadick Park Path',
        1,
        '/static/gpx/162_Quadick_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quadick Red Trail',
        0,
        '/static/gpx/163_Quadick_Red_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pootatuck Forest Trail',
        0,
        '/static/gpx/164_Pootatuck_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'River Highland Park Trail',
        2,
        '/static/gpx/165_River_Highland_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tunxis',
        1,
        '/static/gpx/166_Tunxis.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Old Furnace Trail',
        2,
        '/static/gpx/167_Old_Furnace_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Old Furnace Park Trail',
        2,
        '/static/gpx/168_Old_Furnace_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kestral Trail',
        2,
        '/static/gpx/169_Kestral_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Warbler Trail',
        0,
        '/static/gpx/170_Warbler_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Muir Trail',
        0,
        '/static/gpx/171_Muir_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shadow Pond Nature Trail',
        2,
        '/static/gpx/172_Shadow_Pond_Nature_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Jesse Gerard Trail',
        1,
        '/static/gpx/173_Jesse_Gerard_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Robert Ross Trail',
        2,
        '/static/gpx/174_Robert_Ross_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Agnes Bowen Trail',
        2,
        '/static/gpx/175_Agnes_Bowen_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Elliot Bronson Trail',
        0,
        '/static/gpx/176_Elliot_Bronson_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Walt Landgraf Trail',
        2,
        '/static/gpx/177_Walt_Landgraf_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Squantz Pond Park Trail',
        0,
        '/static/gpx/178_Squantz_Pond_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Putnam Memorial Museum Trail',
        0,
        '/static/gpx/179_Putnam_Memorial_Museum_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinnipiac Park Trail',
        2,
        '/static/gpx/180_Quinnipiac_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Boardwalk',
        1,
        '/static/gpx/181_Boardwalk.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Rocky Neck Park Sidewalk',
        1,
        '/static/gpx/182_Rocky_Neck_Park_Sidewalk.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Rocky Neck Park Path',
        1,
        '/static/gpx/183_Rocky_Neck_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Rocky Neck Park Trail',
        0,
        '/static/gpx/184_Rocky_Neck_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Rope Swing',
        1,
        '/static/gpx/185_Rope_Swing.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sherwood Island Park Path',
        2,
        '/static/gpx/186_Sherwood_Island_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sleeping Giant Park Trail',
        0,
        '/static/gpx/187_Sleeping_Giant_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sherwood Island Nature Trail',
        0,
        '/static/gpx/188_Sherwood_Island_Nature_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sleeping Giant Park Path',
        1,
        '/static/gpx/189_Sleeping_Giant_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tower Trail',
        2,
        '/static/gpx/190_Tower_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinnipiac Trail Spur',
        1,
        '/static/gpx/191_Quinnipiac_Trail_Spur.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Southford Falls Park Trail',
        2,
        '/static/gpx/192_Southford_Falls_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tunxis Forest Trail',
        0,
        '/static/gpx/193_Tunxis_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sleeping Giant Trail',
        0,
        '/static/gpx/194_Sleeping_Giant_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Stratton Brook Park Path',
        0,
        '/static/gpx/195_Stratton_Brook_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bike Trail',
        1,
        '/static/gpx/196_Bike_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Stratton Brook Park Trail',
        2,
        '/static/gpx/197_Stratton_Brook_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Simsbury Park Trail',
        0,
        '/static/gpx/198_Simsbury_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Wolcott Trail',
        1,
        '/static/gpx/199_Wolcott_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Madden Fyler Pond Trail',
        0,
        '/static/gpx/200_Madden_Fyler_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sunny Brook Park Trail',
        1,
        '/static/gpx/201_Sunny_Brook_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Fadoir Spring Trail',
        0,
        '/static/gpx/202_Fadoir_Spring_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Fadoir Trail',
        0,
        '/static/gpx/203_Fadoir_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Walnut Mountain Trail',
        2,
        '/static/gpx/204_Walnut_Mountain_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Wolcott',
        0,
        '/static/gpx/205_Wolcott.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Old Metacomet Trail',
        1,
        '/static/gpx/206_Old_Metacomet_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Talcott Mountain Park Trail',
        2,
        '/static/gpx/207_Talcott_Mountain_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Falls Brook Trail',
        2,
        '/static/gpx/208_Falls_Brook_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Whittemore Glen Trail',
        2,
        '/static/gpx/209_Whittemore_Glen_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Wharton Brook Park Trail',
        0,
        '/static/gpx/210_Wharton_Brook_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Larkin Bridle Trail',
        0,
        '/static/gpx/211_Larkin_Bridle_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bluff Point Bike Path',
        0,
        '/static/gpx/212_Bluff_Point_Bike_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bluff Point Trail',
        0,
        '/static/gpx/213_Bluff_Point_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Hrt - Main Street Spur',
        2,
        '/static/gpx/214_Hrt___Main_Street_Spur.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Laurel Brook Trail',
        2,
        '/static/gpx/215_Laurel_Brook_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Wadsworth Falls Park Trail',
        2,
        '/static/gpx/216_Wadsworth_Falls_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'White Birch Trail',
        2,
        '/static/gpx/217_White_Birch_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Red Cedar Trail',
        2,
        '/static/gpx/218_Red_Cedar_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Little Falls Trail',
        2,
        '/static/gpx/219_Little_Falls_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Deer Trail',
        2,
        '/static/gpx/220_Deer_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Rockfall Land Trust Trail',
        2,
        '/static/gpx/221_Rockfall_Land_Trust_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bridge Trail',
        2,
        '/static/gpx/222_Bridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Main Trail',
        2,
        '/static/gpx/223_Main_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'American Legion Forest Trail',
        2,
        '/static/gpx/224_American_Legion_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Turkey Vultures Ledges Trail',
        2,
        '/static/gpx/225_Turkey_Vultures_Ledges_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Henry R Buck Trail',
        2,
        '/static/gpx/226_Henry_R_Buck_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mashapaug Pond View Trail',
        2,
        '/static/gpx/227_Mashapaug_Pond_View_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bigelow Hollow Park Trail',
        2,
        '/static/gpx/228_Bigelow_Hollow_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Breakneck Pond View Trail',
        2,
        '/static/gpx/229_Breakneck_Pond_View_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'East Ridge Trail',
        2,
        '/static/gpx/230_East_Ridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bigelow Pond Loop Trail',
        2,
        '/static/gpx/231_Bigelow_Pond_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Ridge Trail',
        2,
        '/static/gpx/232_Ridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nipmuck Trail',
        2,
        '/static/gpx/233_Nipmuck_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mattatuck Trail',
        2,
        '/static/gpx/234_Mattatuck_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Black Rock Park Trail',
        2,
        '/static/gpx/235_Black_Rock_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Poquonnock River Walk',
        2,
        '/static/gpx/236_Poquonnock_River_Walk.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kempf & Shenipsit Trail',
        2,
        '/static/gpx/237_Kempf___Shenipsit_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kempf Trail',
        2,
        '/static/gpx/238_Kempf_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Railroad Bed',
        0,
        '/static/gpx/239_Railroad_Bed.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mohegan Trail',
        2,
        '/static/gpx/240_Mohegan_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Burr Pond Park Trail',
        1,
        '/static/gpx/241_Burr_Pond_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Burr Pond Park Path',
        0,
        '/static/gpx/242_Burr_Pond_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Campbell Falls Trail',
        0,
        '/static/gpx/243_Campbell_Falls_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Deep Woods Trail',
        2,
        '/static/gpx/244_Deep_Woods_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Chimney Trail',
        2,
        '/static/gpx/245_Chimney_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Chimney Connector Trail',
        2,
        '/static/gpx/246_Chimney_Connector_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'East Woods Trail',
        2,
        '/static/gpx/247_East_Woods_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'East Woods Connector Trail',
        2,
        '/static/gpx/248_East_Woods_Connector_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Covered Bridge Connector Trail',
        2,
        '/static/gpx/249_Covered_Bridge_Connector_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Covered Bridge Trail',
        2,
        '/static/gpx/250_Covered_Bridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Lookout Trail',
        2,
        '/static/gpx/251_Lookout_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Chatfield Hollow Park Trail',
        2,
        '/static/gpx/252_Chatfield_Hollow_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Lookout Spur Trail',
        2,
        '/static/gpx/253_Lookout_Spur_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Chimney Spur Trail',
        2,
        '/static/gpx/254_Chimney_Spur_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Deep Woods Access Trail',
        2,
        '/static/gpx/255_Deep_Woods_Access_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'West Crest Trail',
        2,
        '/static/gpx/256_West_Crest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Chatfield Park Path',
        2,
        '/static/gpx/257_Chatfield_Park_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pond Trail',
        2,
        '/static/gpx/258_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Paul F Wildermann',
        2,
        '/static/gpx/259_Paul_F_Wildermann.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Cockaponset Forest Path',
        2,
        '/static/gpx/260_Cockaponset_Forest_Path.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kay Fullerton Trail',
        2,
        '/static/gpx/261_Kay_Fullerton_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinimay Trail',
        2,
        '/static/gpx/262_Quinimay_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Cowboy Way Trail',
        2,
        '/static/gpx/263_Cowboy_Way_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Muck Rock Road Trail',
        2,
        '/static/gpx/264_Muck_Rock_Road_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Weber Road Trail',
        2,
        '/static/gpx/265_Weber_Road_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Beechnut Bog Trail',
        2,
        '/static/gpx/266_Beechnut_Bog_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Wood Road Trail',
        2,
        '/static/gpx/267_Wood_Road_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bumpy Hill Road Trail',
        2,
        '/static/gpx/268_Bumpy_Hill_Road_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kristens Way Trail',
        2,
        '/static/gpx/269_Kristens_Way_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Messerschmidt Lane Trail',
        2,
        '/static/gpx/270_Messerschmidt_Lane_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tower Hill Connector Trail',
        2,
        '/static/gpx/271_Tower_Hill_Connector_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mattabesset Trail',
        2,
        '/static/gpx/272_Mattabesset_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mattabasset Trail',
        2,
        '/static/gpx/273_Mattabasset_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Old Mattebesset Trail',
        2,
        '/static/gpx/274_Old_Mattebesset_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Huntington Park Trail',
        2,
        '/static/gpx/275_Huntington_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Huntington Ridge Trail',
        2,
        '/static/gpx/276_Huntington_Ridge_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Aspetuck Valley Trail',
        2,
        '/static/gpx/277_Aspetuck_Valley_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Vista Trail',
        2,
        '/static/gpx/278_Vista_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Devils Hopyard Park Trail',
        2,
        '/static/gpx/279_Devils_Hopyard_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Witch Hazel/Millington Trail',
        2,
        '/static/gpx/280_Witch_Hazel_Millington_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Millington Trail',
        2,
        '/static/gpx/281_Millington_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Loop Trail',
        2,
        '/static/gpx/282_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Witch Hazel Trail',
        2,
        '/static/gpx/283_Witch_Hazel_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Woodcutters Trail',
        2,
        '/static/gpx/284_Woodcutters_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Chapman Falls Trail',
        2,
        '/static/gpx/285_Chapman_Falls_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Devils Oven Spur Trail',
        2,
        '/static/gpx/286_Devils_Oven_Spur_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Maxs Trail',
        2,
        '/static/gpx/287_Maxs_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Machimoodus Park Trail',
        2,
        '/static/gpx/288_Machimoodus_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Fishermans Trail',
        0,
        '/static/gpx/289_Fishermans_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Ccc Trail',
        2,
        '/static/gpx/290_Ccc_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Natchaug Trail',
        2,
        '/static/gpx/291_Natchaug_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Natchaug Forest Trail',
        2,
        '/static/gpx/292_Natchaug_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Goodwin Forest Trail',
        2,
        '/static/gpx/293_Goodwin_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pine Acres Pond Trail',
        2,
        '/static/gpx/294_Pine_Acres_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Brown Hill Pond Trail',
        2,
        '/static/gpx/295_Brown_Hill_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Yellow White Loop Trail',
        2,
        '/static/gpx/296_Yellow_White_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Red Yellow Connector Trail',
        2,
        '/static/gpx/297_Red_Yellow_Connector_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Governor''S Island Trail',
        2,
        '/static/gpx/298_Governor_S_Island_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Goodwin Foresttrail',
        2,
        '/static/gpx/299_Goodwin_Foresttrail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Forest Discovery Trail',
        2,
        '/static/gpx/300_Forest_Discovery_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Goodwin Heritage Trail',
        2,
        '/static/gpx/301_Goodwin_Heritage_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Crest',
        2,
        '/static/gpx/302_Crest.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mansfield Hollow Park Trail',
        0,
        '/static/gpx/303_Mansfield_Hollow_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nipmuck Trail - East Branch',
        0,
        '/static/gpx/304_Nipmuck_Trail___East_Branch.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nipmuck Alternate',
        2,
        '/static/gpx/305_Nipmuck_Alternate.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mashamoquet Brook Nature Trail',
        0,
        '/static/gpx/306_Mashamoquet_Brook_Nature_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nipmuck Forest Trail',
        2,
        '/static/gpx/307_Nipmuck_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Morey Pond Trail',
        2,
        '/static/gpx/308_Morey_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nipmuck Foreat Trail',
        2,
        '/static/gpx/309_Nipmuck_Foreat_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pharisee Rock Trail',
        2,
        '/static/gpx/310_Pharisee_Rock_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pachaug Forest Trail',
        2,
        '/static/gpx/311_Pachaug_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pachaug Trail',
        2,
        '/static/gpx/312_Pachaug_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Canonicus Trail',
        2,
        '/static/gpx/313_Canonicus_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pachaug',
        2,
        '/static/gpx/314_Pachaug.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Laurel Loop Trail',
        2,
        '/static/gpx/315_Laurel_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pachaug/Nehantic Connector',
        2,
        '/static/gpx/316_Pachaug_Nehantic_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pachaug/Tippecansett Connector',
        2,
        '/static/gpx/317_Pachaug_Tippecansett_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nehantic/Pachaug Connector',
        2,
        '/static/gpx/318_Nehantic_Pachaug_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinebaug/Pachaug Connector',
        2,
        '/static/gpx/319_Quinebaug_Pachaug_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinebaug Trail',
        2,
        '/static/gpx/320_Quinebaug_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pachaug/Narragansett Connector',
        2,
        '/static/gpx/321_Pachaug_Narragansett_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Narragansett Trail',
        2,
        '/static/gpx/322_Narragansett_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Green Falls Loop Trail',
        2,
        '/static/gpx/323_Green_Falls_Loop_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Green Falls Water Access Trail',
        2,
        '/static/gpx/324_Green_Falls_Water_Access_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Freeman Trail',
        2,
        '/static/gpx/325_Freeman_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tippecansett Trail',
        2,
        '/static/gpx/326_Tippecansett_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Tippecansett/Freeman Trail',
        2,
        '/static/gpx/327_Tippecansett_Freeman_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Green Falls Pond Trail',
        2,
        '/static/gpx/328_Green_Falls_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nehantic/Pachaug Trail',
        2,
        '/static/gpx/329_Nehantic_Pachaug_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Phillips Pond Spur Trail',
        2,
        '/static/gpx/330_Phillips_Pond_Spur_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quinebaug/Nehantic Connector',
        2,
        '/static/gpx/331_Quinebaug_Nehantic_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nehantic/Quinebaug Connector',
        0,
        '/static/gpx/332_Nehantic_Quinebaug_Connector.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Patagansett Trail',
        2,
        '/static/gpx/333_Patagansett_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Paugussett Forest Trail',
        2,
        '/static/gpx/334_Paugussett_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Zoar Trail',
        2,
        '/static/gpx/335_Zoar_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Lillinonah Trail',
        2,
        '/static/gpx/336_Lillinonah_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Zoar Trail (Old)',
        2,
        '/static/gpx/337_Zoar_Trail__Old_.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Upper Gussy Trail',
        2,
        '/static/gpx/338_Upper_Gussy_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Pierrepont Park Trail',
        2,
        '/static/gpx/339_Pierrepont_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shenipsit Forest Trail',
        2,
        '/static/gpx/340_Shenipsit_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Quary Trail',
        2,
        '/static/gpx/341_Quary_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Shenipsit Forest Road',
        2,
        '/static/gpx/342_Shenipsit_Forest_Road.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Topsmead Forest Trail',
        2,
        '/static/gpx/343_Topsmead_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Edith M Chase Ecology Trail',
        2,
        '/static/gpx/344_Edith_M_Chase_Ecology_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bernard H Stairs Trail',
        2,
        '/static/gpx/345_Bernard_H_Stairs_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'West Rock Park Trail',
        2,
        '/static/gpx/346_West_Rock_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'West Rock Summit Trail',
        2,
        '/static/gpx/347_West_Rock_Summit_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Regicides Trail',
        2,
        '/static/gpx/348_Regicides_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sanford Feeder Trail',
        0,
        '/static/gpx/349_Sanford_Feeder_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'North Summit Trail',
        2,
        '/static/gpx/350_North_Summit_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Westville Feeder Trail',
        2,
        '/static/gpx/351_Westville_Feeder_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'West Rock Park Road',
        2,
        '/static/gpx/352_West_Rock_Park_Road.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Bennetts Pond Trail',
        1,
        '/static/gpx/353_Bennetts_Pond_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Ives Trail',
        2,
        '/static/gpx/354_Ives_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Ridgefield Open Space Trail',
        2,
        '/static/gpx/355_Ridgefield_Open_Space_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'George Dudley Seymour Park Trail',
        0,
        '/static/gpx/356_George_Dudley_Seymour_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Grta',
        1,
        '/static/gpx/357_Grta.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mohegan Forest Trail',
        2,
        '/static/gpx/358_Mohegan_Forest_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Mount Bushnell Trail',
        2,
        '/static/gpx/359_Mount_Bushnell_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Nye Holman Trail',
        2,
        '/static/gpx/360_Nye_Holman_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Al''S Trail',
        2,
        '/static/gpx/361_Al_S_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Salt Rock State Park Trail',
        2,
        '/static/gpx/362_Salt_Rock_State_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Scantic River Trail',
        0,
        '/static/gpx/363_Scantic_River_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Scantic River Park Trail',
        2,
        '/static/gpx/364_Scantic_River_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Scantic Park Access',
        2,
        '/static/gpx/365_Scantic_Park_Access.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Sunrise Park Trail',
        0,
        '/static/gpx/366_Sunrise_Park_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kitchel Trail',
        0,
        '/static/gpx/367_Kitchel_Trail.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Old Driveway',
        0,
        '/static/gpx/368_Old_Driveway.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Kitchel',
        0,
        '/static/gpx/369_Kitchel.gpx',
        'USA'
      );
    
      INSERT INTO "public"."hikes" (
        "userId",
        "title",
        "difficulty",
        "gpxPath",
        "country"
      ) VALUES(
        2,
        'Driveway',
        1,
        '/static/gpx/370_Driveway.gpx',
        'USA'
      );
    