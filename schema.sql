-- Precision DB schema

CREATE TABLE IF NOT EXISTS projects (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id         SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  page       TEXT DEFAULT 'Home',
  author     TEXT DEFAULT 'Massimo P.',
  body       TEXT NOT NULL,
  status     TEXT DEFAULT 'active' CHECK (status IN ('active','resolved')),
  x_pct      NUMERIC(5,2),   -- posizione pin X %
  y_pct      NUMERIC(5,2),   -- posizione pin Y %
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed: progetto aperto.studio + 1 commento
INSERT INTO projects (name, url) VALUES ('Aperto Studio', 'https://aperto.studio');

INSERT INTO comments (project_id, page, author, body, x_pct, y_pct)
VALUES (1, 'Home', 'Massimo P.',
  'Il tagline "Entra pure, è Aperto" si taglia su mobile a 375px. Verificare il wrapping.',
  62, 14);
