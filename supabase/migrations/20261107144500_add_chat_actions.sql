create table if not exists public.chat_hides (
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, conversation_id)
);

alter table public.chat_hides enable row level security;
grant select, insert, update, delete on public.chat_hides to authenticated;

create policy "Users can view their own hidden chats"
  on public.chat_hides for select to authenticated
  using (user_id = auth.uid());

create policy "Users can hide their own chats"
  on public.chat_hides for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can unhide their own chats"
  on public.chat_hides for delete to authenticated
  using (user_id = auth.uid());

create policy "Users can update their own hidden chats"
  on public.chat_hides for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table if not exists public.user_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create index if not exists user_blocks_blocked_id_idx
  on public.user_blocks (blocked_id);

alter table public.user_blocks enable row level security;
grant select, insert, update, delete on public.user_blocks to authenticated;

create policy "Users can view their own blocks"
  on public.user_blocks for select to authenticated
  using (blocker_id = auth.uid());

create policy "Users can block other users"
  on public.user_blocks for insert to authenticated
  with check (blocker_id = auth.uid());

create policy "Users can unblock users they blocked"
  on public.user_blocks for delete to authenticated
  using (blocker_id = auth.uid());

create policy "Users can update their own blocks"
  on public.user_blocks for update to authenticated
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());

create or replace function public.prevent_blocked_user_messages()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if exists (
    select 1
    from public.conversations c
    join public.user_blocks b
      on (b.blocker_id = c.buyer_id and b.blocked_id = c.vendor_id)
      or (b.blocker_id = c.vendor_id and b.blocked_id = c.buyer_id)
    where c.id = new.conversation_id
  ) then
    raise exception using
      errcode = '42501',
      message = 'Messaging is unavailable because one participant blocked the other';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_blocked_user_messages on public.messages;
create trigger prevent_blocked_user_messages
  before insert on public.messages
  for each row execute function public.prevent_blocked_user_messages();
