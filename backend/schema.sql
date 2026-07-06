create table
    users (
        id uuid primary key default gen_random_uuid (),
        email varchar(255) unique not null,
        username varchar(100) not null,
        password_hash text,
        avatar text,
        auth_provider varchar(50) default 'local',
        google_id varchar(255) unique,
        is_verified boolean default false,
        created_at timestamptz default current_timestamp not null,
        updated_at timestamptz default current_timestamp not null
    );

create table
    projects (
        id uuid primary key default gen_random_uuid (),
        name varchar(255) not null,
        environment varchar(50) not null check (environment in ('prod', 'dev')),
        api_key varchar(255) unique not null,
        created_at timestamptz default current_timestamp not null,
        updated_at timestamptz default current_timestamp not null
    );

create table
    error_logs (
        id uuid primary key default gen_random_uuid (),
        project_id uuid references projects (id) on delete cascade,
        error_message text not null,
        stack_trace text not null,
        error_fingerprint varchar(64),
        error_count int default 1,
        ai_reason text,
        ai_suggestion text,
        ai_status varchar(20) default 'pending' check (ai_status in ('pending', 'completed', 'failed')),
        status varchar(20) default 'unresolved' check (status in ('unresolved', 'resolved')),
        created_at timestamptz default current_timestamp not null,
        updated_at timestamptz default current_timestamp not null
    );

create table
    test_generations (
        id uuid primary key default gen_random_uuid (),
        project_id uuid references projects (id) on delete cascade,
        file_name varchar(255) not null,
        swagger_content text not null,
        generated_code text not null,
        created_at timestamptz default current_timestamp not null,
        updated_at timestamptz default current_timestamp not null
    );

create index idx_errors_project on error_logs (project_id);

create index idx_errors_fingerprint on error_logs (error_fingerprint);