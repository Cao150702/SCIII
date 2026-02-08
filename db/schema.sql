-- ResearchBridge MySQL schema
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  department VARCHAR(64) NULL,
  major VARCHAR(64) NULL,
  grade VARCHAR(32) NULL,
  campus VARCHAR(32) NULL,
  email VARCHAR(128) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  tags TEXT NULL,
  department VARCHAR(64) NOT NULL,
  level VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  campus VARCHAR(32) NOT NULL,
  capacity INT NOT NULL DEFAULT 10,
  deadline DATE NULL,
  teacher_id VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_teacher FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS project_members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  project_id BIGINT NOT NULL,
  student_id VARCHAR(32) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_project_member (project_id, student_id),
  CONSTRAINT fk_members_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_members_student FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS project_join_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  project_id BIGINT NOT NULL,
  student_id VARCHAR(32) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  decided_at TIMESTAMP NULL,
  decided_by VARCHAR(32) NULL,
  CONSTRAINT fk_requests_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_requests_student FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(32) NOT NULL,
  title VARCHAR(120) NOT NULL,
  body VARCHAR(255) NOT NULL,
  is_read TINYINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ratings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  project_id BIGINT NOT NULL,
  rater_id VARCHAR(32) NOT NULL,
  ratee_id VARCHAR(32) NOT NULL,
  score TINYINT NOT NULL,
  comment VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_rating (project_id, rater_id, ratee_id),
  CONSTRAINT fk_ratings_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_ratings_rater FOREIGN KEY (rater_id) REFERENCES users(id),
  CONSTRAINT fk_ratings_ratee FOREIGN KEY (ratee_id) REFERENCES users(id)
);

CREATE INDEX idx_projects_teacher ON projects(teacher_id);
CREATE INDEX idx_members_project ON project_members(project_id);
CREATE INDEX idx_members_student ON project_members(student_id);
CREATE INDEX idx_ratings_project ON ratings(project_id);
CREATE INDEX idx_ratings_ratee ON ratings(ratee_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at);
