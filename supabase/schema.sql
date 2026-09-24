-- Esquema de la bandeja de reseñas.

create table if not exists restaurants (
    id   text primary key,
    name text not null
);

create table if not exists locations (
    id            text primary key,
    restaurant_id text not null references restaurants (id),
    name          text not null
);

create table if not exists reviews (
    id           text primary key,
    location_id  text not null references locations (id),
    author       text not null,
    rating       smallint check (rating between 1 and 5),
    text         text not null default '',
    published_at timestamptz not null,
    updated_at   timestamptz not null,
    reply_text   text,
    replied_at   timestamptz,
    constraint reply_complete check ((reply_text is null) = (replied_at is null))
);

-- RLS prendido y sin políticas: la llave anon no puede leer ni escribir nada.
-- Todo el acceso pasa por el servidor con service_role, que saltea RLS.
alter table restaurants enable row level security;
alter table locations   enable row level security;
alter table reviews     enable row level security;

grant select, insert, update on restaurants, locations, reviews to service_role;