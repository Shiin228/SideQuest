-- Optional: the sample data from the original MySQL database (database/sidequest.sql).
-- Run after migrations/20261009000000_init.sql if you want the old accounts and quests.
-- Existing passwords keep working — the site understands PHP's bcrypt hashes.
-- The Admin account (freelancer) logs in with username "admin" and password "admin123".

insert into public.users (id, username, email, password_hash, role, created_at) values
  (26, 'Admin',       'Admin@Admin.com',           '$2b$10$MQpHOGszImhNnFkf.xVhFe9xKIQ76rgQAk7nDbl9DBk6rHxsFmvqK', 'freelancer', '2025-07-17 16:30:26'),
  (27, 'ClientAdmin', 'Admin@AdminClient.com',     '$2y$10$5uuO9/7KLf73eXqNPkXwSO7shAEibZIiZuXnhklM5UD/K.OSjtNPq', 'client',     '2025-07-17 16:31:16'),
  (28, 'Noclipper',   'jimielbalitayo9@gmail.com', '$2y$10$YN4hdhLELhXtpIujuH53WeSEu52eTniadBOuDIwxIQrLu0m/WcqXS', 'client',     '2025-07-19 19:10:31')
on conflict (id) do nothing;

insert into public.freelancers (id, user_id, firstname, middlename, lastname, phone, dob, address, created_at) values
  (2, 26, 'Admin', 'Admin', 'Admin', '00000000000', '2025-07-18', 'Admin Hotel', '2025-07-17 16:30:26')
on conflict (id) do nothing;

insert into public.individual_clients (id, user_id, firstname, middlename, lastname, phone, dob, address, created_at) values
  (3, 27, 'Admin',  'Admin', 'Admin',    '00000000000', '2025-07-18', 'Admin Hotel', '2025-07-17 16:31:16'),
  (4, 28, 'Jimiel', 'Dinio', 'Balitayo', '09951534133', '2004-04-12', E'22 Valdefuente - Fortaleza Rd, Brgy. Cruz Roja, Purok 3\nHouse no. 254', '2025-07-19 19:10:31')
on conflict (id) do nothing;

insert into public.quests (id, title, description, posted_by, deadline, status, created_at, reward) values
  (8,  'I need homework help!',                E'What''s the powerhouse of the cell?\nSend me anything! pdf or pictures.\nThanks!', 27, '2025-07-22', 'completed', '2025-07-19 09:30:43', 50.00),
  (10, 'I need someone to draw!',              'Ill send you the details! Email me!',          27, '2025-07-30', 'completed', '2025-07-19 18:15:33', 4000.00),
  (11, 'I need someone to edit!',              'Ill email you the details!',                   27, '2025-07-29', 'open',      '2025-07-19 18:22:11', 2077.00),
  (12, 'Can someone draw Space Urchin Fanart?', 'Contact me in email and ill send references!', 28, '2025-07-21', 'open',      '2025-07-19 19:11:22', 1000.00)
on conflict (id) do nothing;

insert into public.quest_assignments (id, quest_id, freelancer_id, accepted_at, status, proof_file) values
  (8,  8,  26, '2025-07-19 09:41:57', 'completed', 'uploads/687be56e61c4f_Answer.png'),
  (10, 10, 26, '2025-07-19 18:20:18', 'completed', 'uploads/687bec757fd1c_Descender Suit Poster.png')
on conflict (id) do nothing;

-- Move the id counters past the imported rows so new sign-ups and quests don't collide.
select setval(pg_get_serial_sequence('public.users', 'id'),              (select max(id) from public.users));
select setval(pg_get_serial_sequence('public.freelancers', 'id'),        (select max(id) from public.freelancers));
select setval(pg_get_serial_sequence('public.individual_clients', 'id'), (select max(id) from public.individual_clients));
select setval(pg_get_serial_sequence('public.businesses', 'id'),         greatest(1, (select coalesce(max(id), 1) from public.businesses)), (select count(*) > 0 from public.businesses));
select setval(pg_get_serial_sequence('public.quests', 'id'),             (select max(id) from public.quests));
select setval(pg_get_serial_sequence('public.quest_assignments', 'id'),  (select max(id) from public.quest_assignments));
