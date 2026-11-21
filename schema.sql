-- 仕組みを基礎から（ITAIST）: ポッドキャストエピソード一覧
-- Supabase SQL Editor で実行する

create table if not exists public.podcast_episodes (
  id bigint generated always as identity primary key,
  number int not null unique,
  guid text unique,
  title text not null,
  description text,
  audio_url text,
  duration_sec int,
  published_at timestamptz,
  listened boolean not null default false,
  favorite boolean not null default false,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.podcast_episodes enable row level security;

revoke all on public.podcast_episodes from anon, authenticated;
grant select on public.podcast_episodes to anon, authenticated;

drop policy if exists "podcast_episodes public select" on public.podcast_episodes;
create policy "podcast_episodes public select"
  on public.podcast_episodes
  for select
  to anon, authenticated
  using (true);

insert into public.podcast_episodes (number, guid, title, description, audio_url, duration_sec, published_at, listened, favorite, memo) values
(1, 'ep-afc833d4-8044-4bf7-bde7-738f9e33e5c4', '第1回 エーアイはどうやって文章を作るのか',
 'AI・IT・金融の仕組みを基礎から学ぶポッドキャスト「ITAIST」の第1回。大規模言語モデルが文章を作る仕組み（次の言葉の予測、トークン、数字への変換、アテンション、学習、流暢さと正確さの違い）を、ハルカとユイが基礎から解説します。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-afc833d4-8044-4bf7-bde7-738f9e33e5c4.mp3', 293, '2026-11-01T21:58:15.000Z', true, false, ''),
(2, 'ep-685ea46f-eaa5-4835-b4ae-ae9c24c9c03d', '第2回 インターネットの通信はどうやって届くのか（修正版）',
 'ハルカとユイが、インターネットの通信が届く仕組みを基礎から解説します。パケット、IPアドレスとルーター、TCPによる確認、DNS、海底ケーブルまで。（音声の繰り返しが起きた箇所の言い回しを最小限に直して再生成した修正版です）',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-685ea46f-eaa5-4835-b4ae-ae9c24c9c03d.mp3', 440, '2026-11-01T22:26:53.000Z', true, false, ''),
(3, 'ep-6266568c-1b7f-49c9-a173-251b48ea1404', '第3回 株価はどうやって決まるのか',
 'ハルカとユイが、株価が決まる仕組みを基礎から解説します。買い注文と売り注文の一致、値動きの理由、時価総額まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-6266568c-1b7f-49c9-a173-251b48ea1404.mp3', 452, '2026-11-01T22:26:59.000Z', true, false, ''),
(4, 'ep-9d54fcaa-edf7-416c-80e9-44c2b161a691', '第4回 エーアイはどうやって画像を見分けるのか',
 'ハルカとユイが、エーアイが画像を見分ける仕組みを基礎から解説します。写真は数字の表、特徴を段階的に拾う方法、学習の仕組み、間違いやすさまで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-9d54fcaa-edf7-416c-80e9-44c2b161a691.mp3', 373, '2026-11-02T21:28:10.000Z', true, false, ''),
(5, 'ep-4e90048b-9fe4-4292-b40f-db22b593fa81', '第5回 コンピューターの中は全部数字？ゼロとイチの正体',
 'ハルカとユイが、コンピューターの中で文字も写真も音楽もゼロとイチの並びになっている仕組みを基礎から解説します。ビットとバイト、文字への番号割り当て、写真と音楽の数字化、計算の正体まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-4e90048b-9fe4-4292-b40f-db22b593fa81.mp3', 385, '2026-11-03T21:39:41.000Z', true, false, ''),
(6, 'ep-dce015a3-dd11-4836-899e-ee20e76c407e', '第6回 お金を借りるとなぜ利子がつくのか',
 'ハルカとユイが、利子と金利の仕組みを基礎から解説します。利子はお金を借りる使用料、金利はその割合、需要と供給と中央銀行の政策金利の役割まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-dce015a3-dd11-4836-899e-ee20e76c407e.mp3', 364, '2026-11-04T21:30:36.000Z', true, false, ''),
(7, 'ep-018a21f1-3f4b-49be-a050-f054f8b45dd6', '第7回 エーアイはどうやって学ぶのか',
 'ハルカとユイが、エーアイはどうやって学ぶのかを基礎から解説します。覚えることと学ぶことの違い、間違えながら少しずつ直す学習の仕組み、覚えすぎるとどうなるかまで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-018a21f1-3f4b-49be-a050-f054f8b45dd6.mp3', 372, '2026-11-05T21:30:11.000Z', false, false, ''),
(8, 'ep-61d7428b-9a29-44de-9424-8ec342ed772a', '第8回 Wi-Fiはどうやってつながるのか',
 'ハルカとユイが、Wi-Fiが電波でデータを運ぶ仕組みを基礎から解説します。ルーターの中継役、2.4ギガヘルツと5ギガヘルツの違い、暗号化と混雑の仕組みまで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-61d7428b-9a29-44de-9424-8ec342ed772a.mp3', 366, '2026-11-06T21:27:33.000Z', false, false, ''),
(9, 'ep-3fdf099b-2528-4d2e-bbaf-1febc7c96db5', '第9回 為替レートはどうやって決まるのか',
 'ハルカとユイが、為替レートはどうやって決まるのかを基礎から解説します。円高・円安の意味、需要と供給、金利差と貿易、景気と市場の気持ちまで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-3fdf099b-2528-4d2e-bbaf-1febc7c96db5.mp3', 323, '2026-11-07T21:31:20.000Z', false, false, ''),
(10, 'ep-0ae353ae-607d-4d07-973d-9dc275a27579', '第10回 エーアイはどうやって人の声を聞き取るのか',
 'ハルカとユイが、エーアイが人の声を聞き取る仕組みを基礎から解説します。音を数字に変える仕組み、音素と文脈の役割、ウェイクワードの話まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-0ae353ae-607d-4d07-973d-9dc275a27579.mp3', 353, '2026-11-08T21:26:28.000Z', false, false, ''),
(11, 'ep-389baf2a-bacb-4cf2-82b0-4d44dd5356b3', '第11回 パスワードはどうやって守られているのか',
 'ハルカとユイが、パスワードがどうやって守られているのかを基礎から解説します。ハッシュ化、ソルト、パスキー、二段階認証まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-389baf2a-bacb-4cf2-82b0-4d44dd5356b3.mp3', 358, '2026-11-09T21:26:25.000Z', false, false, ''),
(12, 'ep-ac8c2f37-9fba-4c56-9bca-4b5e004c28e2', '第12回 クレジットカードで払うと、お金はどうやって動いているのか',
 'ハルカとユイが、クレジットカード決済の仕組みを基礎から解説します。オーソリ、売上確定、加盟店手数料、締め日と支払日、分割・リボ払いの金利、3Dセキュア、ポイント還元まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-ac8c2f37-9fba-4c56-9bca-4b5e004c28e2.mp3', 339, '2026-11-10T21:27:09.000Z', false, false, ''),
(13, 'ep-080a51d2-b38c-4191-b34b-c89e33e8716e', '第13回 エーアイはどうやって間違えるのか',
 'ハルカとユイが、エーアイが自信たっぷりに間違える理由を基礎から解説します。らしさで言葉を選ぶ仕組み、知らないことを作ってしまう理由、数字が苦手なわけ、間違いを減らす聞き方まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-080a51d2-b38c-4191-b34b-c89e33e8716e.mp3', 293, '2026-11-11T21:27:07.000Z', false, false, ''),
(14, 'ep-be5d621f-043a-4570-bcdd-93f3e1c03f2b', '第14回 コンピューターはどうやって記憶しているのか',
 'ハルカとユイが、電源を切ると消える記憶と消えない記憶の違いを基礎から解説します。メモリとストレージ、ハードディスクとエスエスディー、クラウドの仕組みまで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-be5d621f-043a-4570-bcdd-93f3e1c03f2b.mp3', 439, '2026-11-12T21:33:05.000Z', false, false, ''),
(15, 'ep-ffdf63f6-a641-4fdf-a2aa-3e9fdecb2609', '第15回 投資信託って何だろう',
 'ハルカとユイが、投資信託の仕組みを基礎から解説します。株を買うのと何が違うのか、少額からの分散、信託報酬、インデックス型とアクティブ型、基準価額と分配金、積立まで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-ffdf63f6-a641-4fdf-a2aa-3e9fdecb2609.mp3', 363, '2026-11-13T21:31:53.000Z', false, false, ''),
(16, 'ep-1d0c0e78-f632-4ef1-9759-92a38ae8f351', '第16回 エーアイはどうやって絵を描くのか',
 'ハルカとユイが、エーアイが絵を描く仕組みを基礎から解説します。ノイズから絵を掘り出す拡散モデルの仕組み、言葉が絵を導く仕組み、段階的に絵ができあがる流れまで。',
 'https://muse.ai/podcasts/media/1348389855035184/f5b976a3-34bb-4203-99e6-287bc402ce67/ep-1d0c0e78-f632-4ef1-9759-92a38ae8f351.mp3', 301, '2026-11-14T22:02:17.000Z', false, false, '')
on conflict (number) do nothing;

notify pgrst, 'reload schema';
