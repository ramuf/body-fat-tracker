--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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

ALTER TABLE IF EXISTS ONLY public.bodymetric DROP CONSTRAINT IF EXISTS bodymetric_user_id_fkey;
DROP INDEX IF EXISTS public.ix_user_email;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public.bodymetric DROP CONSTRAINT IF EXISTS bodymetric_pkey;
ALTER TABLE IF EXISTS ONLY public.alembic_version DROP CONSTRAINT IF EXISTS alembic_version_pkc;
DROP TABLE IF EXISTS public."user";
DROP TABLE IF EXISTS public.bodymetric;
DROP TABLE IF EXISTS public.alembic_version;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: bodymetric; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bodymetric (
    date date NOT NULL,
    weight double precision NOT NULL,
    body_fat_percentage double precision,
    muscle_mass double precision,
    water_percentage double precision,
    bmi double precision,
    notes character varying,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    ffmi double precision,
    bmr double precision
);


ALTER TABLE public.bodymetric OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    email character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    is_superuser boolean NOT NULL,
    full_name character varying(255),
    id uuid NOT NULL,
    hashed_password character varying NOT NULL,
    birth_date date,
    sex character varying,
    height double precision
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
3d82d46d29f6
\.


--
-- Data for Name: bodymetric; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bodymetric (date, weight, body_fat_percentage, muscle_mass, water_percentage, bmi, notes, id, user_id, ffmi, bmr) FROM stdin;
2025-11-26	60.4	35.2	15.4	47.3	24.2	\N	e092423b-6097-4f46-a6fd-bfe1f36fa6ab	ad14efa3-ea26-40c6-b914-c5640a882aad	15.7	1141
2025-11-26	65	23.9	16.1	55.6	21.2	\N	b2271c23-1004-4ecd-9d1d-15e50bb4981b	88780d08-bb4e-46c3-945c-5ed02ca2b407	16.2	1474
2025-11-28	60.2	35.1	15.4	47.3	24.1	\N	d8e6effa-ad79-4cf9-b781-688386e03a82	ad14efa3-ea26-40c6-b914-c5640a882aad	15.7	1139
2025-11-29	60	35.1	15.5	47.4	24	\N	19c31758-d43b-401b-b853-91376d93a5f6	ad14efa3-ea26-40c6-b914-c5640a882aad	15.6	1137
2025-11-30	59.7	34.9	15.6	47.5	23.9	\N	3273cf42-4d16-4f5f-b1f5-1beed9b40d2d	ad14efa3-ea26-40c6-b914-c5640a882aad	15.6	1134
2025-12-01	59.5	34.8	15.6	47.6	23.8	\N	02e847a0-fb50-47a6-865b-4c5a8b40f45e	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1132
2025-12-02	59.1	34.7	15.7	47.7	23.7	\N	a19a64cb-d107-4402-919a-5482cfa741ab	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1128
2025-12-03	59	34.6	15.8	47.7	23.6	\N	a17b5022-9d6c-41f7-b2c2-b83e24fa2156	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1127
2025-12-04	59.2	34.7	15.7	47.7	23.7	\N	f40d3632-d795-423e-ada7-65ba83e153ee	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1129
2025-12-10	59.2	34.7	15.7	47.4	23.7	\N	2735f099-e447-4242-b104-e7cfc6159d4a	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1124
2025-12-11	58.9	34.6	15.8	47.8	23.6	\N	97a31dca-c48b-48d3-892a-e1cfe24dcad1	ad14efa3-ea26-40c6-b914-c5640a882aad	15.4	1121
2025-12-12	59.3	34.8	15.7	47.6	23.8	\N	2e582554-c341-48bc-9fcb-8a135d31996e	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1125
2025-12-17	59.3	34.8	15.7	47.6	23.8	\N	6a9b08f8-8e6d-4897-8fe2-38f5ce34899e	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1125
2025-12-19	59.1	34.7	15.7	47.7	23.7	\N	78eae7d9-a889-44a5-9224-b6f8691cf765	ad14efa3-ea26-40c6-b914-c5640a882aad	15.5	1123
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (email, is_active, is_superuser, full_name, id, hashed_password, birth_date, sex, height) FROM stdin;
ramusga@gmail.com	t	f	Nuno Ferreira	88780d08-bb4e-46c3-945c-5ed02ca2b407	$2b$12$4E/5JG2UqMx0925x.g3N6OU0aq79nJbdcqHNsyayz10ktfV2EvP5G	1970-05-13	male	175
polleyba@pobox.com	t	f	Betsy Butler	ad14efa3-ea26-40c6-b914-c5640a882aad	$2b$12$eETv8k3m7z2rQWOur/5yBO0Kfbzcsz0JuLK7Huc7bt0DXLOqpKcXy	1966-12-09	female	158
\.


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: bodymetric bodymetric_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodymetric
    ADD CONSTRAINT bodymetric_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: ix_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_user_email ON public."user" USING btree (email);


--
-- Name: bodymetric bodymetric_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodymetric
    ADD CONSTRAINT bodymetric_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

