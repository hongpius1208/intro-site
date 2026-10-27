-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run
-- 방명록 테이블: 누구나 읽고 쓸 수 있지만, 수정·삭제는 불가

create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 30),
  message text not null check (char_length(message) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;

create policy "guestbook_read" on public.guestbook
  for select to anon, authenticated using (true);

create policy "guestbook_insert" on public.guestbook
  for insert to anon, authenticated with check (true);

grant select, insert on public.guestbook to anon, authenticated;
