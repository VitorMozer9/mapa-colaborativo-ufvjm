--
-- PostgreSQL database dump
--

\restrict lOUCB5fJUb6SIPxHadAtfvNMOSH7tRUaYC22h6goPb0EQA8XaFCd1GZihMEdGJf

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-23 18:45:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 10 (class 2615 OID 21320)
-- Name: app; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA app;


ALTER SCHEMA app OWNER TO postgres;

--
-- TOC entry 11 (class 2615 OID 21321)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- TOC entry 9 (class 2615 OID 21319)
-- Name: geo; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA geo;


ALTER SCHEMA geo OWNER TO postgres;

--
-- TOC entry 4 (class 3079 OID 21214)
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- TOC entry 6422 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- TOC entry 2 (class 3079 OID 19801)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 6423 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 3 (class 3079 OID 20883)
-- Name: pgrouting; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrouting WITH SCHEMA public;


--
-- TOC entry 6424 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgrouting; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgrouting IS 'pgRouting Extension';


--
-- TOC entry 323 (class 1255 OID 21411)
-- Name: closest_walkway_to_point(double precision, double precision); Type: FUNCTION; Schema: geo; Owner: postgres
--

CREATE FUNCTION geo.closest_walkway_to_point(user_lon double precision, user_lat double precision) RETURNS TABLE(walkway_id integer, distance_meters double precision, snapped_point public.geometry)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        w.walkway_id,
        ST_Distance(w.geom::geography, ST_SetSRID(ST_Point(user_lon, user_lat), 4326)::geography) AS distance_meters,
        ST_ClosestPoint(w.geom, ST_SetSRID(ST_Point(user_lon, user_lat), 4326)) AS snapped_point
    FROM geo.walkway AS w
    ORDER BY w.geom <-> ST_SetSRID(ST_Point(user_lon, user_lat), 4326)
    LIMIT 1;
END;
$$;


ALTER FUNCTION geo.closest_walkway_to_point(user_lon double precision, user_lat double precision) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 239 (class 1259 OID 21380)
-- Name: events; Type: TABLE; Schema: app; Owner: postgres
--

CREATE TABLE app.events (
    event_id integer NOT NULL,
    title text NOT NULL,
    description text,
    start_at timestamp without time zone,
    end_at timestamp without time zone,
    poi_id integer
);


ALTER TABLE app.events OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 21379)
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: app; Owner: postgres
--

CREATE SEQUENCE app.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE app.events_event_id_seq OWNER TO postgres;

--
-- TOC entry 6425 (class 0 OID 0)
-- Dependencies: 238
-- Name: events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: postgres
--

ALTER SEQUENCE app.events_event_id_seq OWNED BY app.events.event_id;


--
-- TOC entry 241 (class 1259 OID 21396)
-- Name: user_account; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.user_account (
    user_id integer NOT NULL,
    email public.citext NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'user'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE auth.user_account OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 21395)
-- Name: user_account_user_id_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

CREATE SEQUENCE auth.user_account_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.user_account_user_id_seq OWNER TO postgres;

--
-- TOC entry 6426 (class 0 OID 0)
-- Dependencies: 240
-- Name: user_account_user_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: postgres
--

ALTER SEQUENCE auth.user_account_user_id_seq OWNED BY auth.user_account.user_id;


--
-- TOC entry 235 (class 1259 OID 21349)
-- Name: building; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.building (
    building_id integer NOT NULL,
    name text NOT NULL,
    geom public.geometry(Polygon,4326) NOT NULL
);


ALTER TABLE geo.building OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 21348)
-- Name: building_building_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.building_building_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.building_building_id_seq OWNER TO postgres;

--
-- TOC entry 6427 (class 0 OID 0)
-- Dependencies: 234
-- Name: building_building_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.building_building_id_seq OWNED BY geo.building.building_id;


--
-- TOC entry 231 (class 1259 OID 21323)
-- Name: poi; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.poi (
    poi_id integer NOT NULL,
    name text NOT NULL,
    category text,
    description text,
    geom public.geometry(Point,4326) NOT NULL
);


ALTER TABLE geo.poi OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 21322)
-- Name: poi_poi_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.poi_poi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.poi_poi_id_seq OWNER TO postgres;

--
-- TOC entry 6428 (class 0 OID 0)
-- Dependencies: 230
-- Name: poi_poi_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.poi_poi_id_seq OWNED BY geo.poi.poi_id;


--
-- TOC entry 233 (class 1259 OID 21336)
-- Name: walkway; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.walkway (
    walkway_id integer NOT NULL,
    name text,
    geom public.geometry(LineString,4326) NOT NULL,
    is_accessible boolean DEFAULT true
);


ALTER TABLE geo.walkway OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 21362)
-- Name: walkway_topology; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.walkway_topology (
    id integer NOT NULL,
    walkway_id integer,
    source bigint,
    target bigint,
    cost double precision,
    reverse_cost double precision,
    geom public.geometry(LineString,4326)
);


ALTER TABLE geo.walkway_topology OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 21361)
-- Name: walkway_topology_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.walkway_topology_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.walkway_topology_id_seq OWNER TO postgres;

--
-- TOC entry 6429 (class 0 OID 0)
-- Dependencies: 236
-- Name: walkway_topology_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.walkway_topology_id_seq OWNED BY geo.walkway_topology.id;


--
-- TOC entry 232 (class 1259 OID 21335)
-- Name: walkway_walkway_id_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.walkway_walkway_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE geo.walkway_walkway_id_seq OWNER TO postgres;

--
-- TOC entry 6430 (class 0 OID 0)
-- Dependencies: 232
-- Name: walkway_walkway_id_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.walkway_walkway_id_seq OWNED BY geo.walkway.walkway_id;


--
-- TOC entry 6224 (class 2604 OID 21383)
-- Name: events event_id; Type: DEFAULT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.events ALTER COLUMN event_id SET DEFAULT nextval('app.events_event_id_seq'::regclass);


--
-- TOC entry 6225 (class 2604 OID 21399)
-- Name: user_account user_id; Type: DEFAULT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.user_account ALTER COLUMN user_id SET DEFAULT nextval('auth.user_account_user_id_seq'::regclass);


--
-- TOC entry 6222 (class 2604 OID 21352)
-- Name: building building_id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.building ALTER COLUMN building_id SET DEFAULT nextval('geo.building_building_id_seq'::regclass);


--
-- TOC entry 6219 (class 2604 OID 21326)
-- Name: poi poi_id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.poi ALTER COLUMN poi_id SET DEFAULT nextval('geo.poi_poi_id_seq'::regclass);


--
-- TOC entry 6220 (class 2604 OID 21339)
-- Name: walkway walkway_id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.walkway ALTER COLUMN walkway_id SET DEFAULT nextval('geo.walkway_walkway_id_seq'::regclass);


--
-- TOC entry 6223 (class 2604 OID 21365)
-- Name: walkway_topology id; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.walkway_topology ALTER COLUMN id SET DEFAULT nextval('geo.walkway_topology_id_seq'::regclass);


--
-- TOC entry 6414 (class 0 OID 21380)
-- Dependencies: 239
-- Data for Name: events; Type: TABLE DATA; Schema: app; Owner: postgres
--

COPY app.events (event_id, title, description, start_at, end_at, poi_id) FROM stdin;
\.


--
-- TOC entry 6416 (class 0 OID 21396)
-- Dependencies: 241
-- Data for Name: user_account; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.user_account (user_id, email, password_hash, role, created_at) FROM stdin;
\.


--
-- TOC entry 6410 (class 0 OID 21349)
-- Dependencies: 235
-- Data for Name: building; Type: TABLE DATA; Schema: geo; Owner: postgres
--

COPY geo.building (building_id, name, geom) FROM stdin;
\.


--
-- TOC entry 6406 (class 0 OID 21323)
-- Dependencies: 231
-- Data for Name: poi; Type: TABLE DATA; Schema: geo; Owner: postgres
--

COPY geo.poi (poi_id, name, category, description, geom) FROM stdin;
1	Almoxarifado	Logística	\N	0101000020E6100000BE515AA4AEC945C046C129EBFA3332C0
2	Biblioteca	Serviço	\N	0101000020E610000088FDF4CFBAC945C0AE9214383D3332C0
3	Centro de Pós CIpq	Acadêmico	\N	0101000020E610000040A561BB49C945C0FAEDAC99013332C0
4	DECOM	Departamento	\N	0101000020E61000003B7EBBA3DEC945C040BFDC68C43332C0
5	Departamento de Biologia	Departamento	\N	0101000020E6100000A74EEBA25CC945C02DCDD16B203232C0
6	Departamento de Educação Física	Departamento	\N	0101000020E6100000E3FF2B477CC945C0D67D22B46B3232C0
7	Departamento de Enfermagem	Departamento	\N	0101000020E6100000CAD2B9B373C945C0C3BFAA3F3E3232C0
8	Departamento de Farmácia	Departamento	\N	0101000020E6100000A303213658C945C01B39B4A3773232C0
9	Departamento Florestal	Departamento	\N	0101000020E61000004E116E4624C945C02EF6A398B73332C0
10	Departamento de Medicina	Departamento	\N	0101000020E610000048483FBC85C945C0E2EB35A4063232C0
11	Departamento de Odontologia	Departamento	\N	0101000020E6100000E2A0C5E26EC945C0D9CB2A67EB3132C0
12	Departamento de Agronomia	Departamento	\N	0101000020E610000009BBD51C6CC945C0173ECAD7B93332C0
13	Departamento de Química	Departamento	\N	0101000020E6100000DACB5CA7C6C945C09CE806F3DF3332C0
14	Departamento de Zootecnia	Departamento	\N	0101000020E6100000AE3B5B257EC945C008A79F64EC3332C0
15	Diretoria de Educação	Administração	\N	0101000020E6100000C7AC1161B0C945C0084EF03ED33332C0
16	Lanchonete do Pavilhão	Alimentação	\N	0101000020E6100000C975D105EEC945C00D2C27C9663332C0
17	Lanchonete Central	Alimentação	\N	0101000020E61000005A5BEEA298C945C0ADF0D3A1F53232C0
18	Bosque	Área Verde	\N	0101000020E610000039C1C137A4C945C04F4EB0DA463332C0
19	Portaria Principal	Entrada	\N	0101000020E6100000EDC87F4D4CCA45C0AA7A76102A3432C0
20	Reitoria	Administração	\N	0101000020E6100000DE8DDD81A3C945C0E7A304DA753332C0
\.


--
-- TOC entry 6408 (class 0 OID 21336)
-- Dependencies: 233
-- Data for Name: walkway; Type: TABLE DATA; Schema: geo; Owner: postgres
--

COPY geo.walkway (walkway_id, name, geom, is_accessible) FROM stdin;
1	Biblioteca ↔ DECOM	0102000020E61000000200000088FDF4CFBAC945C0AE9214383D3332C03B7EBBA3DEC945C040BFDC68C43332C0	t
2	Biblioteca ↔ Centro de Pós CIpq	0102000020E61000000200000088FDF4CFBAC945C0AE9214383D3332C040A561BB49C945C0FAEDAC99013332C0	t
3	DECOM ↔ Departamento de Química	0102000020E6100000020000003B7EBBA3DEC945C040BFDC68C43332C0DACB5CA7C6C945C09CE806F3DF3332C0	t
4	Departamento de Agronomia ↔ Departamento Florestal	0102000020E61000000200000009BBD51C6CC945C0173ECAD7B93332C04E116E4624C945C02EF6A398B73332C0	t
5	Departamento de Zootecnia ↔ Diretoria de Educação	0102000020E610000002000000AE3B5B257EC945C008A79F64EC3332C0C7AC1161B0C945C0084EF03ED33332C0	t
6	Lanchonete do Pavilhão ↔ DECOM	0102000020E610000002000000C975D105EEC945C00D2C27C9663332C03B7EBBA3DEC945C040BFDC68C43332C0	t
7	Lanchonete Central ↔ Centro de Pós CIpq	0102000020E6100000020000005A5BEEA298C945C0ADF0D3A1F53232C040A561BB49C945C0FAEDAC99013332C0	t
8	Bosque ↔ Biblioteca	0102000020E61000000200000039C1C137A4C945C04F4EB0DA463332C088FDF4CFBAC945C0AE9214383D3332C0	t
9	Reitoria ↔ Diretoria de Educação	0102000020E610000002000000DE8DDD81A3C945C0E7A304DA753332C0C7AC1161B0C945C0084EF03ED33332C0	t
10	Portaria ↔ DECOM	0102000020E610000002000000EDC87F4D4CCA45C0AA7A76102A3432C03B7EBBA3DEC945C040BFDC68C43332C0	t
\.


--
-- TOC entry 6412 (class 0 OID 21362)
-- Dependencies: 237
-- Data for Name: walkway_topology; Type: TABLE DATA; Schema: geo; Owner: postgres
--

COPY geo.walkway_topology (id, walkway_id, source, target, cost, reverse_cost, geom) FROM stdin;
\.


--
-- TOC entry 6218 (class 0 OID 20123)
-- Dependencies: 226
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- TOC entry 6431 (class 0 OID 0)
-- Dependencies: 238
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: app; Owner: postgres
--

SELECT pg_catalog.setval('app.events_event_id_seq', 1, false);


--
-- TOC entry 6432 (class 0 OID 0)
-- Dependencies: 240
-- Name: user_account_user_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.user_account_user_id_seq', 1, false);


--
-- TOC entry 6433 (class 0 OID 0)
-- Dependencies: 234
-- Name: building_building_id_seq; Type: SEQUENCE SET; Schema: geo; Owner: postgres
--

SELECT pg_catalog.setval('geo.building_building_id_seq', 1, false);


--
-- TOC entry 6434 (class 0 OID 0)
-- Dependencies: 230
-- Name: poi_poi_id_seq; Type: SEQUENCE SET; Schema: geo; Owner: postgres
--

SELECT pg_catalog.setval('geo.poi_poi_id_seq', 20, true);


--
-- TOC entry 6435 (class 0 OID 0)
-- Dependencies: 236
-- Name: walkway_topology_id_seq; Type: SEQUENCE SET; Schema: geo; Owner: postgres
--

SELECT pg_catalog.setval('geo.walkway_topology_id_seq', 1, false);


--
-- TOC entry 6436 (class 0 OID 0)
-- Dependencies: 232
-- Name: walkway_walkway_id_seq; Type: SEQUENCE SET; Schema: geo; Owner: postgres
--

SELECT pg_catalog.setval('geo.walkway_walkway_id_seq', 10, true);


--
-- TOC entry 6246 (class 2606 OID 21389)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- TOC entry 6248 (class 2606 OID 21410)
-- Name: user_account user_account_email_key; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.user_account
    ADD CONSTRAINT user_account_email_key UNIQUE (email);


--
-- TOC entry 6250 (class 2606 OID 21408)
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_id);


--
-- TOC entry 6239 (class 2606 OID 21359)
-- Name: building building_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.building
    ADD CONSTRAINT building_pkey PRIMARY KEY (building_id);


--
-- TOC entry 6233 (class 2606 OID 21333)
-- Name: poi poi_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.poi
    ADD CONSTRAINT poi_pkey PRIMARY KEY (poi_id);


--
-- TOC entry 6236 (class 2606 OID 21346)
-- Name: walkway walkway_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.walkway
    ADD CONSTRAINT walkway_pkey PRIMARY KEY (walkway_id);


--
-- TOC entry 6242 (class 2606 OID 21370)
-- Name: walkway_topology walkway_topology_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.walkway_topology
    ADD CONSTRAINT walkway_topology_pkey PRIMARY KEY (id);


--
-- TOC entry 6237 (class 1259 OID 21360)
-- Name: building_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX building_geom_gist ON geo.building USING gist (geom);


--
-- TOC entry 6231 (class 1259 OID 21334)
-- Name: poi_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX poi_geom_gist ON geo.poi USING gist (geom);


--
-- TOC entry 6234 (class 1259 OID 21347)
-- Name: walkway_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX walkway_geom_gist ON geo.walkway USING gist (geom);


--
-- TOC entry 6240 (class 1259 OID 21376)
-- Name: walkway_topology_geom_gist; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX walkway_topology_geom_gist ON geo.walkway_topology USING gist (geom);


--
-- TOC entry 6243 (class 1259 OID 21377)
-- Name: walkway_topology_source_idx; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX walkway_topology_source_idx ON geo.walkway_topology USING btree (source);


--
-- TOC entry 6244 (class 1259 OID 21378)
-- Name: walkway_topology_target_idx; Type: INDEX; Schema: geo; Owner: postgres
--

CREATE INDEX walkway_topology_target_idx ON geo.walkway_topology USING btree (target);


--
-- TOC entry 6252 (class 2606 OID 21390)
-- Name: events events_poi_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: postgres
--

ALTER TABLE ONLY app.events
    ADD CONSTRAINT events_poi_id_fkey FOREIGN KEY (poi_id) REFERENCES geo.poi(poi_id);


--
-- TOC entry 6251 (class 2606 OID 21371)
-- Name: walkway_topology walkway_topology_walkway_id_fkey; Type: FK CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.walkway_topology
    ADD CONSTRAINT walkway_topology_walkway_id_fkey FOREIGN KEY (walkway_id) REFERENCES geo.walkway(walkway_id) ON DELETE CASCADE;


-- Completed on 2025-11-23 18:45:08

--
-- PostgreSQL database dump complete
--

\unrestrict lOUCB5fJUb6SIPxHadAtfvNMOSH7tRUaYC22h6goPb0EQA8XaFCd1GZihMEdGJf

