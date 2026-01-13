--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.0

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
-- Data for Name: prefectures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefectures (id, code, name_ja, name_en, region) FROM stdin;
4e1dd685-d435-47c1-8c4c-a3d2d8c52f7d	1	北海道	Hokkaido	北海道・東北
2b29f66e-d2ac-44f7-9c4b-a87b6ed9cd55	2	青森県	Aomori	北海道・東北
bcf3ad4c-3011-476c-ac46-4225beb20245	3	岩手県	Iwate	北海道・東北
cf3c90e6-a906-42ee-b565-ae285775a692	4	宮城県	Miyagi	北海道・東北
78ab2fe1-acf3-43ec-b5b6-d880978171a1	5	秋田県	Akita	北海道・東北
c4e12789-930d-46e9-a335-ce34dc1a98e9	6	山形県	Yamagata	北海道・東北
b687a604-65ac-4c56-bc6a-301824239214	7	福島県	Fukushima	北海道・東北
dc8964b3-9b70-4075-86cf-097c09da195c	8	茨城県	Ibaraki	関東
c14a0c0b-ccd5-4b50-8cdc-3d62ed4dda98	9	栃木県	Tochigi	関東
f677fac3-9432-490f-bd68-8b49314eb8b3	10	群馬県	Gunma	関東
83162330-38fa-4529-bad1-03519fccc8b5	11	埼玉県	Saitama	関東
57fa2576-0d5c-4cd9-8446-9db0562d3d85	12	千葉県	Chiba	関東
9c386ac7-5bb0-4bd4-905d-9c2836fb148f	13	東京都	Tokyo	関東
89882b6e-18b2-4500-865d-d3e568e22147	14	神奈川県	Kanagawa	関東
43c5425e-5b34-46fb-9be3-20fb8c103cc1	15	新潟県	Niigata	中部
67bb2311-3ef9-4d75-a931-ede475a7717d	16	富山県	Toyama	中部
49d9acdd-436f-4078-9582-a706c7452a20	17	石川県	Ishikawa	中部
d05fac64-32f9-4fcc-bea2-78e967425b3a	18	福井県	Fukui	中部
5e25391e-993c-45a5-a79e-ff5134fad87c	19	山梨県	Yamanashi	中部
7893b692-acbb-4c28-b072-f0f82637e96a	20	長野県	Nagano	中部
1982021a-8aea-438c-9591-9069ff64fe04	21	岐阜県	Gifu	中部
d9236ca1-7b7b-491c-b2b4-92d7cab55b2b	22	静岡県	Shizuoka	中部
11ae1567-6ce1-41d1-a14b-14c8a9ad6ee8	23	愛知県	Aichi	中部
cb07bafd-77cb-48ec-9d54-4ca6aa804b3f	24	三重県	Mie	近畿
786b789f-3f3d-4d25-b624-63da125dd78c	25	滋賀県	Shiga	近畿
553979ca-d593-4097-9114-f17bc99ec0fb	26	京都府	Kyoto	近畿
cbb6c4a9-c41b-42e1-9501-e24968349a2e	27	大阪府	Osaka	近畿
eca9be42-5bc4-4d08-923a-7f47ac2f79bf	28	兵庫県	Hyogo	近畿
d93b6624-a7d8-4368-b158-0af93b456a2e	29	奈良県	Nara	近畿
477babb4-6a00-4ad6-ae4d-0ec1dd44209d	30	和歌山県	Wakayama	近畿
c1ba0e51-2a37-49cf-852f-11987ebdf765	31	鳥取県	Tottori	中国
8cde37fd-b9dc-4ef5-bfc9-e5409b0ce2b1	32	島根県	Shimane	中国
259d7d8a-c002-4ef5-b19c-f6254a4e5165	33	岡山県	Okayama	中国
417e0ca5-fe47-4f29-83f9-b21bb3dad0d4	34	広島県	Hiroshima	中国
12351930-98b7-4a8d-aa3f-6e50d6b81a8c	35	山口県	Yamaguchi	中国
d6a09126-c8d9-428d-8d72-1a512420fa19	36	徳島県	Tokushima	四国
5686ec89-f25c-4991-bb1e-c29db5f2ef21	37	香川県	Kagawa	四国
de7f3c88-72f7-4ed2-9c30-0bc19a4ef245	38	愛媛県	Ehime	四国
e03087ff-a034-4e5e-ac04-f5cdf9a231d7	39	高知県	Kochi	四国
098df387-ad89-4561-b0fc-7dd27fac1fd1	40	福岡県	Fukuoka	九州・沖縄
7e5bc2e0-ed17-43b1-a4f5-1af715839f80	41	佐賀県	Saga	九州・沖縄
71a198e1-d3f4-4589-8a9d-abf4cdc9a06d	42	長崎県	Nagasaki	九州・沖縄
7ee1c189-1331-4d86-a5d8-e5cca5d672b4	43	熊本県	Kumamoto	九州・沖縄
29850626-55e4-4aac-8553-fcfe281b3fed	44	大分県	Oita	九州・沖縄
e9595228-d63f-419a-aae6-09b7869cc5c4	45	宮崎県	Miyazaki	九州・沖縄
58bea02a-5a37-4788-a939-1e3ea5180246	46	鹿児島県	Kagoshima	九州・沖縄
5a128c36-479b-4d51-86d1-93e2f00113c3	47	沖縄県	Okinawa	九州・沖縄
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cities (id, prefecture_id, name, is_active, created_at, updated_at, is_23ward, display_order) FROM stdin;
e8c2af16-3f9e-4478-a5ca-748713fb71b8	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	立川・八王子	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	f	24
8145cf3e-b65c-4c6a-b82a-5298780bf3ad	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	江戸川区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	23
6c123974-b43e-4602-a96f-d7885c7e72a2	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	北区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	19
dd437385-be88-4328-b736-7c95ebdf9974	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	荒川区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	20
1137e4a4-4c3e-4eb3-8c44-c4be6b3acba1	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	吉祥寺・三鷹	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	f	25
b6684b06-d73a-445e-8ded-c518c64bd0cf	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	町田・多摩	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	f	26
321df8ce-4b86-4040-92f7-22b9444fb67d	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	西東京・東久留米	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	f	27
3f67daa3-d4ea-414b-ae4b-191d27d72da5	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	青梅・奥多摩	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	f	28
a0c7af05-4cbf-412e-a8e4-4d43d32b9c50	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	島しょ	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	f	29
2da03272-ade4-4e6f-9420-36a6cb59a6e1	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	千代田区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	1
e60f403b-03fc-4b1f-9ceb-f43c85ae5570	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	中央区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	2
ae15eae0-fd40-479d-919f-9aa0d7d94537	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	港区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	3
9255b494-a29f-46a8-93d6-df7c47bb0cab	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	新宿区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	4
2d44fd9f-4bd5-4a4a-a40f-bd379cd2f3e1	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	渋谷区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	5
d8b26746-4af4-4ff4-9077-964c98f5ccad	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	豊島区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	6
66551b39-ac69-44af-a736-5617d0ae4bc9	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	文京区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	7
29dd73ba-ea20-4e95-a4d3-0daccab0dfee	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	台東区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	8
234c7dbe-4cfd-4f89-bd53-5b2e1794912d	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	墨田区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	9
a09e71b9-5e30-4a32-abc5-b19a42cd53b7	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	江東区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	10
cde019aa-115f-4630-8667-f51edf0085c1	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	品川区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	11
86429557-a54e-47ec-88fe-1a5b7a0724cb	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	目黒区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	12
e1fb6d25-d8b3-4d9b-829e-d766cb779eeb	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	大田区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	13
e3556c27-e629-46d6-9830-abaf17b48d66	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	世田谷区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	14
5c83b6ca-d41d-40b6-a0db-07a3fc25a373	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	中野区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	15
cc5f7d92-5887-4016-9da5-8eecdf6e0b30	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	杉並区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	16
cfefc3e9-4959-4096-9cb1-b65437be3def	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	練馬区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	17
435acfbf-63fd-4868-a023-ccc44ce1bb14	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	板橋区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	18
39d6eca7-3036-483b-b183-1a0efab4bd59	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	足立区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	21
edf8153a-fbc5-49ca-80b8-e00f61d3f223	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	葛飾区	t	2025-11-05 11:59:19.416632+00	2025-11-05 11:59:19.416632+00	t	22
\.


--
-- Data for Name: atmosphere_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atmosphere_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
83a00aa2-633b-448a-b501-c6abea63795c	lively	にぎやか	t	2025-12-25 20:03:38.823564	2025-12-25 20:03:38.823564	1
1c8c1def-9ab0-4599-abf4-0a00feb26c19	moderate	ほどよい	t	2025-12-25 20:03:38.823564	2025-12-25 20:03:38.823564	2
9f4957e3-1df7-4d79-9110-b89502b036e2	calm	しっとり	t	2025-12-25 20:03:38.823564	2025-12-25 20:03:38.823564	3
\.


--
-- Data for Name: baggage_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baggage_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
07bb850c-c884-4ca3-a93b-4442144b0ed9	locker	ロッカー	t	2025-11-03 18:28:13.853788+00	2025-11-03 18:28:13.853788+00	1
e389110c-a443-4e86-8705-620497459314	cloak	クローク	t	2025-11-03 18:28:13.853788+00	2025-11-03 18:28:13.853788+00	2
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, created_at, comment) FROM stdin;
1	2025-11-29 03:40:03.481169+00	最高に楽しい夜にしたい！
2	2025-11-29 03:40:15.201444+00	初めての音箱でドキドキ
3	2025-11-29 03:40:30.046968+00	音楽をガンガン浴びたい気分
4	2025-12-26 03:54:40.153391+00	生演奏ライブ観てみたいな！
5	2025-12-26 03:54:53.620785+00	今日はどこに行こうかな？
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, name, email, message, created_at) FROM stdin;
f189140d-d7c8-4903-a461-907a76afa797	に	chloerickyb@gmail.com	に	2025-12-16 02:40:50.362316+00
eb5e43c2-6e41-4af4-aad6-3213c588c053	ni	chloerickyb@gmail.com	ni	2025-12-16 02:45:20.011151+00
fa15ee6e-3d21-4f0a-99c3-06ecea04310a	ni	chloerickyb@gmail.com	ni	2025-12-16 02:45:21.154446+00
c9c52703-77ae-465f-b4f0-cf7de2676ef7	あ	chloerickyb@gmail.com	さ	2025-12-16 02:53:32.529328+00
2b6ca9b6-063a-44b0-be1c-05e33843d613	西本浩章	chloerickyb@gmail.com	テスト配信	2025-12-16 06:28:41.078603+00
8b6a2f76-dc1d-4cd3-baf9-c42958c97bb1	にしもと	chloerickyb@gmail.com	テスト	2025-12-16 07:49:48.053218+00
5f5d23d0-2a7b-4f47-a4f9-57c3a4cb3668	さ	chloerickyb@gmail.com	さ	2025-12-21 12:02:45.627727+00
6415fa65-5588-4f19-987a-463c251af88a	お	chloerickyb@gmail.com	さ	2025-12-21 12:03:14.82487+00
d14c0a27-9e97-48f0-9d09-cd1cd98b8f19	さ	chloerickyb@gmail.com	さ	2025-12-21 12:03:31.16144+00
46f65d81-6410-4ee3-9b1e-a8cbbc1f5782	さ	chloerickyb@gmail.com	さ	2025-12-21 12:20:43.37532+00
4650c7ab-9670-4bd5-90f1-911ccc5e4b9f	あ	chloerickyb@gmail.com	さ	2025-12-21 12:42:51.530271+00
aca7566e-2774-473c-872b-a8546c6bd6d6	さ	chloerickyb@gmail.com	さ	2025-12-21 12:45:29.827391+00
05d0f329-593f-4cb0-8e12-6f37e078492d	さ	chloerickyb@gmail.com	さ	2025-12-21 12:57:48.280389+00
88ee89f0-f899-40db-90b7-1a9d3b6be86d	あ	chloerickyb@gmail.com	さ	2025-12-21 13:12:41.838903+00
19dc9ed3-0906-4d7d-a7ae-8c89933eb3a9	さ	chloerickyb@gmail.com	さ	2025-12-30 15:31:23.156852+00
\.


--
-- Data for Name: customer_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
07f384a4-1780-42a0-a2b7-fe7a5cccb36b	solo	一人客多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	1
6b2fd0df-0947-498b-84ef-17c824f7f6e2	regulars	常連客多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	2
bb7cbf37-b0bc-4a44-ae21-4c70dd710fd6	male_more	男性多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	3
baf43256-c76a-475e-8b09-559cf8cd35de	female_more	女性多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	4
6195b357-c4da-430e-aa76-9a55d3bb6e0f	young_more	若者多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	5
972eb218-3da5-4730-81c8-83582ca17601	adult_more	大人世代多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	6
a9ed8485-f335-46c1-9875-86d763dcbaeb	senior_more	シニア世代多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	7
c3da5e2c-858b-4cfb-9e80-a8b54a43d3b5	working_people	社会人多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	8
4a326bbb-dff8-4b39-a4c8-d83fd6e2688a	couples	カップル多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	9
b846c8d4-2f28-4984-991a-e3bad2705d7b	foreigners	外国人多め	t	2025-11-03 18:53:59.610791+00	2025-11-03 18:53:59.610791+00	10
\.


--
-- Data for Name: drink_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drink_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
ee75adaf-2236-447a-a7cf-43b59c36326a	sparkling	スパークリング	t	2025-12-20 11:45:41.976494+00	2025-12-20 11:45:41.976494+00	90
80a2554f-751a-4b34-967e-9896035c7574	tequila	テキーラ	t	2025-12-30 13:00:55.16864+00	2025-12-30 13:00:55.16864+00	11
94102c3b-4339-48d0-92ec-77039cbe30f5	spirit_brandy	ブランデー	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	12
7946e488-119c-47f4-8ed9-1a60f42775c0	liqueur_kahlua	カルーア	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	14
c7bd2a54-2492-4080-ac2c-aff994fbf221	liqueur_malibu	マリブ	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	15
83f3f511-240f-4203-a699-867b78041a6b	liqueur_cassis	カシス	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	13
900a9249-93af-48a3-8634-f8f2c37d9dba	other_free_water	水無料	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	99
062e89fc-9ff9-40ff-8516-0563ecf432a7	nonalcohol_all	ノンアルコール	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	98
db150fd6-c58b-4cf8-988d-9bf1f8ea3905	soft_all	ソフトドリンク	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	97
163a4d46-d50d-4923-a591-a3557291c8e4	other_original	オリジナルドリンク	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	96
6ae8f963-9672-4b78-bd69-c4cf650f5bb6	beer_all	ビール	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	1
17b2a1f6-3950-4997-8175-f105bdc8aa7e	wine_all	ワイン	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	2
28f02134-cc47-4207-ada4-fa9f88d78720	whisky_all	ウイスキー	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	3
dd9fad25-671a-46b0-8736-9d17e6df557c	japanese_sake	日本酒	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	4
0cd588a5-d5b5-4645-9eaf-1972889d0616	japanese_umeshu	梅酒	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	5
42237b8b-e273-4956-ba98-1583df800793	japanese_all	焼酎	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	6
a33db2af-e357-4934-bd7e-af647e7d1ec6	japanese_sour	サワー	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	7
36dba0ad-7497-48c1-a1ca-dbef684ea39e	spirit_gin	ジン	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	8
f8f2f412-2c13-401a-9d17-5cd120dc68ea	spirit_vodka	ウォッカ	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	9
96705ec0-8258-4869-81e1-8685aea8f4b8	spirit_rum	ラム	t	2025-11-03 18:51:20.073659+00	2025-11-03 18:51:20.073659+00	10
\.


--
-- Data for Name: environment_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.environment_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
9090438b-8b88-46d2-a6c1-406674628117	station	駅	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	1
3c810a51-56d9-4e58-947d-25342752c3df	bus_stop	バス停	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	2
e496437b-49b8-4184-b16d-016eaee78b49	taxi_stand	タクシー乗り場	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	3
13b4cbca-6c2a-432e-9e8c-2589fb8af4a1	parking	駐車場	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	4
f260b411-3842-4a75-b471-00117d838185	convenience_store	コンビニ／スーパー	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	5
a7c635c0-c9c4-4373-a4b3-ee10013686ba	restaurant	飲食店	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	6
89cf15f6-2072-44bc-a56b-756be8346b50	vending_machine	自動販売機	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	7
c3017ff4-7884-4c7f-a4fb-0baa59d516e0	hotel	ホテル	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	8
12eff77c-9e92-419e-be6d-3569fb2c6abe	police_box	交番	t	2025-11-03 18:32:21.246582+00	2025-11-03 18:32:21.246582+00	9
\.


--
-- Data for Name: event_trend_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_trend_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
1a61e61f-87e3-46ff-970a-17648fa44b2c	dj	DJ	t	2025-11-03 18:27:21.783705+00	2025-11-03 18:27:21.783705+00	1
b01cebc0-5cfd-437c-9334-a827ce1ddd2e	record	レコード	t	2025-11-03 18:27:21.783705+00	2025-11-03 18:27:21.783705+00	2
ec792cc0-6220-48e8-80f5-2a8e9292fadb	dance	ダンス	t	2025-11-03 18:27:21.783705+00	2025-11-03 18:27:21.783705+00	3
cb9cfab3-21de-4839-b168-c8dbb953c0ee	live_performance	生演奏	t	2025-11-03 18:27:21.783705+00	2025-11-03 18:27:21.783705+00	4
ac369b2d-9b22-4386-a948-0bdde5d24ab9	world_music	民族音楽	t	2025-11-03 18:27:21.783705+00	2025-11-03 18:27:21.783705+00	5
\.


--
-- Data for Name: other_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.other_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
b71f58d1-c6ec-437e-a660-4c45cc94ea2f	food\n	軽食あり	t	2025-12-20 10:34:08.735117+00	2025-12-20 10:34:08.735117+00	2
dbcc79d9-56cf-4b31-ac63-e5ec04bee823	reentry_ok	途中入退場OK\n	t	2025-12-20 10:35:30.215467+00	2025-12-20 10:35:30.215467+00	3
30627375-0f3a-4d33-b1dc-22a47d8079b8	barrier_free	バリアフリー	t	2025-11-03 18:32:34.396813+00	2025-11-03 18:32:34.396813+00	4
d51ea27e-23a3-4ae0-a231-4dd6d1ac97a3	wifi	Wi-Fiあり	t	2025-11-03 18:32:34.396813+00	2025-11-03 18:32:34.396813+00	1
\.


--
-- Data for Name: payment_method_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_method_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
65ba595d-8952-4a65-9827-709975c935ec	cash	現金	t	2025-11-03 18:47:43.223449+00	2025-11-03 18:47:43.223449+00	1
19082ef2-ec0c-46fc-b0bb-7ecd1780260b	credit_card	クレジットカード	t	2025-11-03 18:47:43.223449+00	2025-11-03 18:47:43.223449+00	2
99954206-d9f7-4d99-a813-0653d4cc5830	qr_code_payment	QRコード決済	t	2025-12-26 04:58:25.463558+00	2025-12-26 04:58:25.463558+00	3
a34551e1-48f0-4280-90bf-0860a94ccc49	contactless_payment	タッチ決済	t	2025-11-03 18:47:43.223449+00	2025-11-03 18:47:43.223449+00	4
7ce5d779-e493-4e28-b3af-b78c3b0b250a	other	その他	t	2025-12-20 10:59:21.107593+00	2025-12-20 10:59:21.107593+00	5
\.


--
-- Data for Name: price_range_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_range_definitions (id, key, label, description, is_active, created_at, updated_at, display_order) FROM stdin;
677ce313-d3df-4de7-998b-dcd99e6385c6	reasonable	低	〜2000円台	t	2025-11-03 18:32:47.053043+00	2025-11-03 18:32:47.053043+00	1
f0d35a5c-b1f1-48d3-af17-3d8900cd09f2	standard	中	3000円台〜	t	2025-11-03 18:32:47.053043+00	2025-11-03 18:32:47.053043+00	2
85fee28a-8fbc-460e-bb9a-ade30acbf31e	premium	高	5千円〜	t	2025-11-03 18:32:47.053043+00	2025-11-03 18:32:47.053043+00	3
\.


--
-- Data for Name: size_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.size_definitions (id, key, label, capacity_range, description, is_active, created_at, updated_at, display_order) FROM stdin;
49466dd6-d4a7-4018-915a-a2d727324d15	small	小箱	〜200人	部室くらい	t	2025-11-03 18:29:20.573938+00	2025-11-03 18:29:20.573938+00	1
e1eaf072-cd97-4dd4-b50e-9efd9e38f681	medium	中箱	200〜600人	教室くらい	t	2025-11-03 18:29:20.573938+00	2025-11-03 18:29:20.573938+00	2
22be3dd1-113d-4700-ab21-25f36393b641	large	大箱	600人〜	体育館くらい	t	2025-11-03 18:29:20.573938+00	2025-11-03 18:29:20.573938+00	3
\.


--
-- Data for Name: smoking_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.smoking_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
41d11cb1-1399-4f1a-9bf7-c47625cf0f88	no_smoking	禁煙	t	2025-11-03 18:31:55.716322+00	2025-11-03 18:31:55.716322+00	1
ecd05627-a719-4f53-82e4-ce9dc677c2c2	separated	分煙	t	2025-11-03 18:31:55.716322+00	2025-11-03 18:31:55.716322+00	2
224e59cb-9dd5-4377-8139-eb5bb22c497f	smoking	喫煙OK	t	2025-12-25 19:55:53.394505+00	2025-12-25 19:55:53.394505+00	3
\.


--
-- Data for Name: store_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_types (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
33c7ece2-353b-4e15-87a5-851151eb31be	club	クラブ	t	2025-11-03 18:26:04.538643+00	2025-11-03 18:26:04.538643+00	1
432178e1-2a9d-4f3d-868e-daffa15a29ae	other	その他	t	2025-12-20 12:30:20.323034+00	2025-12-20 12:30:20.323034+00	4
5cad2af2-6746-4a2c-8165-16d76cdc9446	livehouse	ライブハウス	t	2025-11-03 18:26:04.538643+00	2025-11-03 18:26:04.538643+00	3
9be31103-04f2-41d5-a077-8b990766fe40	bar	バー	t	2025-11-03 18:26:04.538643+00	2025-11-03 18:26:04.538643+00	2
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stores (id, name, description, access, address, google_map_url, instagram_url, official_site_url, prefecture_id, city_id, store_type_id, size, price_range_id, created_at, updated_at, name_kana, x_url, facebook_url, tiktok_url, business_hours, payment_method_other, postcode) FROM stdin;
8e159e07-ebc0-4eef-934a-023fa5e67d46	The Black Room	光と闇が交差するバー。	原宿駅徒歩6分。	東京都渋谷区1-4-5	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/blackroom	https://blackroom.jp	1982021a-8aea-438c-9591-9069ff64fe04	\N	432178e1-2a9d-4f3d-868e-daffa15a29ae	22be3dd1-113d-4700-ab21-25f36393b641	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-12-04 08:20:52.17535	2025-12-30 03:38:40.093853	ぶらっく るーむ	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
05b4113d-6252-4d5f-9e85-e6440fe4b164	CLUB IKO	最新EDMが流れる大型クラブ。	渋谷駅から徒歩5分。	東京都渋谷区1-1-1	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/clubiko	https://clubiko.jp	5a128c36-479b-4d51-86d1-93e2f00113c3	\N	432178e1-2a9d-4f3d-868e-daffa15a29ae	e1eaf072-cd97-4dd4-b50e-9efd9e38f681	f0d35a5c-b1f1-48d3-af17-3d8900cd09f2	2025-12-04 08:20:52.17535	2025-12-30 03:38:49.380915	くらぶ いこ	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
cf181f4f-87c2-43ba-9a98-061341e1f7c4	CLUB ZENITH	音質にこだわるクラブ。	六本木駅徒歩3分。	東京都港区1-9-9	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/zenith	https://zenithclub.jp	1982021a-8aea-438c-9591-9069ff64fe04	\N	432178e1-2a9d-4f3d-868e-daffa15a29ae	e1eaf072-cd97-4dd4-b50e-9efd9e38f681	677ce313-d3df-4de7-998b-dcd99e6385c6	2025-12-04 08:20:52.17535	2025-12-30 03:39:04.907354	くらぶ ぜにす	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
c85ad429-a5c3-4768-a6f7-79ee39b24c61	SKY FALL BAR	夜景が見えるバー。	恵比寿徒歩5分。	東京都渋谷区3-3-3	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/skyfall	https://skyfall.jp	b687a604-65ac-4c56-bc6a-301824239214	\N	432178e1-2a9d-4f3d-868e-daffa15a29ae	49466dd6-d4a7-4018-915a-a2d727324d15	f0d35a5c-b1f1-48d3-af17-3d8900cd09f2	2025-12-04 08:20:52.17535	2025-12-30 03:38:44.151746	すかい ふぉーる	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
952bf0ab-abf3-46a8-8230-2f64aa4db308	Jazz & Soul	ジャズ演奏が楽しめるラウンジです。	渋谷駅徒歩7分	東京都渋谷区3-5-811	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/jazzandsoul	https://landfloor.jp	2b29f66e-d2ac-44f7-9c4b-a87b6ed9cd55	\N	9be31103-04f2-41d5-a077-8b990766fe40	49466dd6-d4a7-4018-915a-a2d727324d15	f0d35a5c-b1f1-48d3-af17-3d8900cd09f2	2025-11-20 05:35:15.309937	2026-01-05 02:46:32.990325	じゃずあんどそうる	https://x.com/clubiko	https://facebook.com/clubiko	https://tiktok.com/@clubiko	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
c0a27b62-457b-4bec-b0a0-d591f72b7644	CLUB NOVA	LED演出が派手なクラブ。	秋葉原徒歩8分。	東京都千代田区3-2-2	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/nova	https://clubnova.jp	cb07bafd-77cb-48ec-9d54-4ca6aa804b3f	\N	9be31103-04f2-41d5-a077-8b990766fe40	e1eaf072-cd97-4dd4-b50e-9efd9e38f681	f0d35a5c-b1f1-48d3-af17-3d8900cd09f2	2025-12-04 08:20:52.17535	2025-12-30 03:39:08.776349	くらぶ のゔぁ	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
f8182e28-7e74-43e2-a77a-1a1bee963300	Ghu	最新鋭の機材を詰め込んだ東京のくらぶ	渋谷駅徒歩5分	東京都港区1-9-9	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://emerald.jp	https://emerald.jp	cf3c90e6-a906-42ee-b565-ae285775a692	\N	432178e1-2a9d-4f3d-868e-daffa15a29ae	49466dd6-d4a7-4018-915a-a2d727324d15	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-12-18 16:51:17.310071	2025-12-30 03:38:41.747207	ぎゅー	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
03a86b49-ea5f-44c7-b83e-309a04ea053f	Land Floor	モダンな雰囲気のダイニングレストラン。	渋谷駅徒歩8分	東京都渋谷区○○2-9-6	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/landfloor	https://landfloor.jp	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	2d44fd9f-4bd5-4a4a-a40f-bd379cd2f3e1	5cad2af2-6746-4a2c-8165-16d76cdc9446	e1eaf072-cd97-4dd4-b50e-9efd9e38f681	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-11-20 05:35:15.309937	2025-12-30 03:38:36.905179	らんどふろあ	https://x.com/clubiko	https://facebook.com/clubiko	https://tiktok.com/@clubiko	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
c3c11520-9542-4bec-8e3d-8caec0d9652c	AURA TOKYO	ミニマルテクノ中心。	中目黒徒歩10分。	東京都目黒区2-2-2	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/aura	https://aura.jp	c14a0c0b-ccd5-4b50-8cdc-3d62ed4dda98	\N	432178e1-2a9d-4f3d-868e-daffa15a29ae	49466dd6-d4a7-4018-915a-a2d727324d15	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-12-04 08:20:52.17535	2025-12-30 03:38:47.920937	おーら とうきょう	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
f8096113-0ad8-4e43-9a5c-4ec712f8f5c7	CLUB IKO	エレクトロニックミュージック中心のクラブ。	渋谷駅徒歩5分	東京都渋谷区○○1-2-3	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/clubiko	https://clubiko.jp	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	39d6eca7-3036-483b-b183-1a0efab4bd59	432178e1-2a9d-4f3d-868e-daffa15a29ae	22be3dd1-113d-4700-ab21-25f36393b641	677ce313-d3df-4de7-998b-dcd99e6385c6	2025-11-20 05:35:15.309937	2025-12-30 03:38:35.344776	くらぶ いこー	https://x.com/clubiko	https://facebook.com/clubiko	https://tiktok.com/@clubiko	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
05ce2ea0-a3e1-4c1a-816f-67ae34d3f203	Blue Moon Bar	豊島区にある落ち着いたバー。	池袋駅徒歩6分	東京都豊島区○○4-2-1	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/bluemoon	https://landfloor.jp	9c386ac7-5bb0-4bd4-905d-9c2836fb148f	2da03272-ade4-4e6f-9420-36a6cb59a6e1	5cad2af2-6746-4a2c-8165-16d76cdc9446	e1eaf072-cd97-4dd4-b50e-9efd9e38f681	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-11-20 05:35:15.309937	2025-12-30 03:38:37.912679	ぶるーむーんばー	https://x.com/clubiko	https://facebook.com/clubiko	https://tiktok.com/@clubiko	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
ad8c4c63-533e-4bb1-8eb7-441f66f5d2cd	GOLDEN FOX LOUNGE	ウイスキー中心のラウンジ。	銀座徒歩4分！。	東京都中央区4-5-6	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/goldenfox	https://goldenfox.jp	c4e12789-930d-46e9-a335-ce34dc1a98e9	\N	9be31103-04f2-41d5-a077-8b990766fe40	49466dd6-d4a7-4018-915a-a2d727324d15	f0d35a5c-b1f1-48d3-af17-3d8900cd09f2	2025-12-04 08:20:52.17535	2025-12-30 03:38:39.388241	ごーるでん ふぉっくす	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
d2f34629-6454-4c36-936d-8a88a7064648	The Emerald Lounge	大人向けラウンジ。	新宿駅徒歩7分。	東京都新宿区1-2-3	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/emerald	https://emerald.jp	259d7d8a-c002-4ef5-b19c-f6254a4e5165	\N	5cad2af2-6746-4a2c-8165-16d76cdc9446	49466dd6-d4a7-4018-915a-a2d727324d15	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-12-04 08:20:52.17535	2025-12-30 03:38:42.709687	えめらるど らうんじ	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
8e43942e-c5c3-4580-989d-9b94e6915403	NIGHT CANYON！	アンダーグラウンド系イベント。	下北沢徒歩5分。	東京都世田谷区5-2-1	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/canyon	https://nightcanyon.jp	cbb6c4a9-c41b-42e1-9501-e24968349a2e	\N	33c7ece2-353b-4e15-87a5-851151eb31be	e1eaf072-cd97-4dd4-b50e-9efd9e38f681	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-12-04 08:20:52.17535	2025-12-30 03:38:46.531341	ないと きゃにおん	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
86ea947c-14af-46d9-9827-834b72f0e8ae	BAR LUMINA	幻想的な光に包まれたバー。	池袋駅徒歩4分。	東京都豊島区1-1-1	https://www.google.com/maps/place/ATOM+TOKYO+-SHIBUYA-/@35.6583059,139.6928299,16z/data=!3m2!4b1!5s0x60188caa117a3065:0xdc6acc5817c580f5!4m6!3m5!1s0x60188caa122d0481:0x5261f787f67350d2!8m2!3d35.6583059!4d139.6954048!16s%2Fg%2F11b6_p_tjn?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D	https://instagram.com/lumina	https://lumina-bar.jp	12351930-98b7-4a8d-aa3f-6e50d6b81a8c	\N	5cad2af2-6746-4a2c-8165-16d76cdc9446	49466dd6-d4a7-4018-915a-a2d727324d15	85fee28a-8fbc-460e-bb9a-ade30acbf31e	2025-12-04 08:20:52.17535	2025-12-30 03:38:53.138957	ばー るみな	https://emerald.jp	https://emerald.jp	https://emerald.jp	月曜 20:00~3:00\n火曜 20:00~3:00\n水曜 20:00~3:00\n木曜 20:00~3:00\n金曜 20:00~3:00 \n土曜 20:00~3:00 \n日曜 20:00~3:00 \n祝日 20:00~3:00	PayPay	111-1111
\.


--
-- Data for Name: store_atmospheres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_atmospheres (id, store_id, atmosphere_id, created_at) FROM stdin;
99b2cb49-106d-4456-a630-9f276fa2222d	952bf0ab-abf3-46a8-8230-2f64aa4db308	83a00aa2-633b-448a-b501-c6abea63795c	2025-12-30 06:52:31.679197
\.


--
-- Data for Name: store_awards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_awards (id, store_id, title, year, created_at) FROM stdin;
1de31364-e514-44f2-b531-122945dc96b1	952bf0ab-abf3-46a8-8230-2f64aa4db308	王様のブランチ大賞	2014	2025-12-13 10:50:25.834118+00
b7d55631-a0a2-4ec6-8eb9-d9e67f1d68ec	952bf0ab-abf3-46a8-8230-2f64aa4db308	日本ClubTOP200選出	2022	2025-12-13 05:25:54.593443+00
\.


--
-- Data for Name: store_baggage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_baggage (id, store_id, baggage_id, created_at) FROM stdin;
a397a951-9af8-4452-b8cd-dc9b12143280	952bf0ab-abf3-46a8-8230-2f64aa4db308	e389110c-a443-4e86-8705-620497459314	2025-12-30 06:52:59.149822+00
\.


--
-- Data for Name: store_customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_customers (id, store_id, customer_id, created_at) FROM stdin;
3c2229fd-ecc9-4936-b773-8d4ade311fcb	952bf0ab-abf3-46a8-8230-2f64aa4db308	6b2fd0df-0947-498b-84ef-17c824f7f6e2	2025-12-30 06:53:21.985125+00
\.


--
-- Data for Name: store_drinks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_drinks (id, store_id, drink_id, created_at) FROM stdin;
ef8ac216-19c5-4cc4-91fd-483568cb77a9	952bf0ab-abf3-46a8-8230-2f64aa4db308	900a9249-93af-48a3-8634-f8f2c37d9dba	2025-12-30 06:53:55.66121+00
c29f5074-cc8e-408e-b6d4-c4b1aa2f0da8	952bf0ab-abf3-46a8-8230-2f64aa4db308	7946e488-119c-47f4-8ed9-1a60f42775c0	2025-12-30 06:54:09.982751+00
c2667e67-549c-4890-bb65-8c9b84ea9820	952bf0ab-abf3-46a8-8230-2f64aa4db308	28f02134-cc47-4207-ada4-fa9f88d78720	2025-12-30 06:54:24.056184+00
df067704-4284-4909-a431-9bea2e40122f	952bf0ab-abf3-46a8-8230-2f64aa4db308	ee75adaf-2236-447a-a7cf-43b59c36326a	2025-12-30 06:54:38.123882+00
\.


--
-- Data for Name: store_environment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_environment (id, store_id, environment_id, created_at) FROM stdin;
18e60423-1d2f-4923-8a2a-be8f6eb7a534	ad8c4c63-533e-4bb1-8eb7-441f66f5d2cd	89cf15f6-2072-44bc-a56b-756be8346b50	2025-12-30 03:49:48.677229+00
93c11422-d833-4cab-aefd-656530acb3ec	952bf0ab-abf3-46a8-8230-2f64aa4db308	3c810a51-56d9-4e58-947d-25342752c3df	2025-12-30 03:49:34.792902+00
\.


--
-- Data for Name: store_event_trends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_event_trends (id, store_id, event_trend_id, created_at) FROM stdin;
f84dd9d8-96b5-41df-ad6a-389f2aa7af50	952bf0ab-abf3-46a8-8230-2f64aa4db308	cb9cfab3-21de-4839-b168-c8dbb953c0ee	2025-12-30 03:48:49.799804+00
4abf6f67-c8ca-4198-ac68-9e04dd668b96	952bf0ab-abf3-46a8-8230-2f64aa4db308	b01cebc0-5cfd-437c-9334-a827ce1ddd2e	2025-12-30 03:49:10.957748+00
\.


--
-- Data for Name: store_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_images (id, store_id, image_url, order_num, is_main, created_at, updated_at) FROM stdin;
880ff507-168b-4d34-b8f4-319e5f7fe4c2	03a86b49-ea5f-44c7-b83e-309a04ea053f	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/1.svg	1	t	2025-11-20 06:23:29.771961+00	2025-11-21 14:21:43.769927+00
b2fea3c6-4a8c-4494-93b9-a7def93cff6b	03a86b49-ea5f-44c7-b83e-309a04ea053f	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/2.svg	2	f	2025-11-20 06:23:29.771961+00	2025-11-21 14:21:43.769927+00
b71bbee7-1473-4d2b-8e43-b6dadb495838	03a86b49-ea5f-44c7-b83e-309a04ea053f	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/3.svg	3	f	2025-11-20 06:23:29.771961+00	2025-11-21 14:21:43.769927+00
3a94e258-31c3-4e15-878f-1a808dea959c	03a86b49-ea5f-44c7-b83e-309a04ea053f	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/4.svg	4	f	2025-11-20 06:23:29.771961+00	2025-11-21 14:21:43.769927+00
f1d2fd41-0cb7-4ab3-bc3a-c71f011b4def	03a86b49-ea5f-44c7-b83e-309a04ea053f	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/5.svg	5	f	2025-11-20 06:23:29.771961+00	2025-11-21 14:21:43.769927+00
a762903f-70cc-494e-ba8f-f141491fa6b8	05ce2ea0-a3e1-4c1a-816f-67ae34d3f203	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/1.svg	1	t	2025-11-20 06:23:37.348725+00	2025-11-21 14:21:43.769927+00
dac5a25a-8ed4-4fd7-a9ed-c66cebdb9975	05ce2ea0-a3e1-4c1a-816f-67ae34d3f203	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/2.svg	2	f	2025-11-20 06:23:37.348725+00	2025-11-21 14:21:43.769927+00
02f0652c-9cf1-49f9-99fb-6b8d27cfe2c2	05ce2ea0-a3e1-4c1a-816f-67ae34d3f203	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/3.svg	3	f	2025-11-20 06:23:37.348725+00	2025-11-21 14:21:43.769927+00
a35f2f00-120a-4852-8551-83f872fb6897	05ce2ea0-a3e1-4c1a-816f-67ae34d3f203	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/4.svg	4	f	2025-11-20 06:23:37.348725+00	2025-11-21 14:21:43.769927+00
8815eccf-42c9-4139-ae6b-85acd03285bf	05ce2ea0-a3e1-4c1a-816f-67ae34d3f203	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/5.svg	5	f	2025-11-20 06:23:37.348725+00	2025-11-21 14:21:43.769927+00
a9e62064-49b0-4ab7-bf6e-3e0bf4ce30fa	952bf0ab-abf3-46a8-8230-2f64aa4db308	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/1.svg	1	t	2025-11-20 06:23:44.766007+00	2025-11-21 14:21:43.769927+00
229a93de-d428-4668-b1b4-97d159daca64	952bf0ab-abf3-46a8-8230-2f64aa4db308	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/2.svg	2	f	2025-11-20 06:23:44.766007+00	2025-11-21 14:21:43.769927+00
03153cbd-7650-4929-bb97-2ec2aa91af0e	952bf0ab-abf3-46a8-8230-2f64aa4db308	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/3.svg	3	f	2025-11-20 06:23:44.766007+00	2025-11-21 14:21:43.769927+00
0c7da8d9-2102-492d-97c4-04268f1a21e2	952bf0ab-abf3-46a8-8230-2f64aa4db308	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/4.svg	4	f	2025-11-20 06:23:44.766007+00	2025-11-21 14:21:43.769927+00
8df6c6af-8314-41ae-a630-dadea17485ab	952bf0ab-abf3-46a8-8230-2f64aa4db308	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/5.svg	5	f	2025-11-20 06:23:44.766007+00	2025-11-21 14:21:43.769927+00
9b4dc104-6e0c-4e5c-a7d6-ac50463d0539	f8096113-0ad8-4e43-9a5c-4ec712f8f5c7	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/1.svg	1	t	2025-11-20 06:23:51.668536+00	2025-11-21 14:21:43.769927+00
822d2c4f-a01b-42ee-97e5-5ba7dca0ca79	f8096113-0ad8-4e43-9a5c-4ec712f8f5c7	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/2.svg	2	f	2025-11-20 06:23:51.668536+00	2025-11-21 14:21:43.769927+00
36f5c402-6092-4194-b091-b2a3a6c44013	f8096113-0ad8-4e43-9a5c-4ec712f8f5c7	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/3.svg	3	f	2025-11-20 06:23:51.668536+00	2025-11-21 14:21:43.769927+00
9d23482d-2c2a-4d44-a9ce-bfd77fa6d257	f8096113-0ad8-4e43-9a5c-4ec712f8f5c7	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/4.svg	4	f	2025-11-20 06:23:51.668536+00	2025-11-21 14:21:43.769927+00
da004716-b4ab-4973-bb3d-8157a5d663fa	f8096113-0ad8-4e43-9a5c-4ec712f8f5c7	https://psrgxziiqjicfvevdaaw.supabase.co/storage/v1/object/public/store-images/5.svg	5	f	2025-11-20 06:23:51.668536+00	2025-11-21 14:21:43.769927+00
\.


--
-- Data for Name: store_media_mentions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_media_mentions (id, store_id, media_name, created_at, year) FROM stdin;
94a3e298-aada-48e3-9b4e-66b9ad23ef31	952bf0ab-abf3-46a8-8230-2f64aa4db308	TV王様のブランチにて紹介	2025-12-13 05:27:09.399931+00	2024
9b0448fe-4563-4763-a661-499e7542e30e	952bf0ab-abf3-46a8-8230-2f64aa4db308	ヒカキンTV撮影場所	2025-12-13 10:53:19.237853+00	2013
\.


--
-- Data for Name: store_other; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_other (id, store_id, other_id, created_at) FROM stdin;
02eb1637-c73d-47df-8240-5920d3f8027f	952bf0ab-abf3-46a8-8230-2f64aa4db308	d51ea27e-23a3-4ae0-a231-4dd6d1ac97a3	2025-12-30 03:42:31.658024+00
\.


--
-- Data for Name: store_payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_payment_methods (id, store_id, payment_method_id, created_at) FROM stdin;
ece00d67-7430-4abf-8a8b-b979b9950fe5	952bf0ab-abf3-46a8-8230-2f64aa4db308	7ce5d779-e493-4e28-b3af-b78c3b0b250a	2025-12-26 04:45:58.947501+00
650ac4f7-6ebf-42e8-ab40-995df3961865	952bf0ab-abf3-46a8-8230-2f64aa4db308	65ba595d-8952-4a65-9827-709975c935ec	2025-12-30 03:42:02.516199+00
\.


--
-- Data for Name: store_smoking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_smoking (id, store_id, smoking_id, created_at) FROM stdin;
7878feb0-08c2-40ce-8cf7-6f211ced568e	952bf0ab-abf3-46a8-8230-2f64aa4db308	ecd05627-a719-4f53-82e4-ce9dc677c2c2	2025-12-30 03:41:15.772411+00
\.


--
-- Data for Name: toilet_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.toilet_definitions (id, key, label, is_active, created_at, updated_at, display_order) FROM stdin;
3cc27d95-3def-436b-a183-a9646fbee6cb	separate	男女別	t	2025-11-03 18:28:52.568634+00	2025-11-03 18:28:52.568634+00	1
9046cce5-bea6-4ae0-9666-334c1f7b87b6	unisex	男女共用	t	2025-11-03 18:28:52.568634+00	2025-11-03 18:28:52.568634+00	2
312ce4fa-353a-4b29-8204-831089ac1684	multipurpose	多目的	t	2025-11-03 18:28:52.568634+00	2025-11-03 18:28:52.568634+00	3
\.


--
-- Data for Name: store_toilet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_toilet (id, store_id, toilet_id, created_at) FROM stdin;
7f544052-8f12-480d-b304-1509142126e2	952bf0ab-abf3-46a8-8230-2f64aa4db308	9046cce5-bea6-4ae0-9666-334c1f7b87b6	2025-12-30 03:40:50.288778+00
3a52cbf7-1dfa-4d8e-878d-99eea177c6c2	03a86b49-ea5f-44c7-b83e-309a04ea053f	9046cce5-bea6-4ae0-9666-334c1f7b87b6	2025-12-30 16:06:48.354871+00
\.


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

