alter table public.newsletter_subscribers
add column if not exists is_active boolean not null default true;

alter table public.newsletter_subscribers
add column if not exists unsubscribe_token text unique;

update public.newsletter_subscribers
set unsubscribe_token = encode(gen_random_bytes(24), 'hex')
where unsubscribe_token is null;

alter table public.newsletter_subscribers
alter column unsubscribe_token set not null;
