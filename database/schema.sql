-- Storm Garage Chatbot Database Schema

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_ip VARCHAR(45),
    user_agent TEXT
);

-- Scooter models and service times
CREATE TABLE IF NOT EXISTS scooter_models (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    estimated_service_time INTEGER NOT NULL, -- in minutes
    common_issues TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    scooter_brand VARCHAR(100) NOT NULL,
    scooter_model VARCHAR(100) NOT NULL,
    issue_description TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    estimated_duration INTEGER NOT NULL, -- in minutes
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    workbench_number INTEGER, -- 1 or 2
    assigned_slot_id INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time slots for scheduling (2 workbenches)
CREATE TABLE IF NOT EXISTS time_slots (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    workbench_number INTEGER NOT NULL CHECK (workbench_number IN (1, 2)),
    is_available BOOLEAN DEFAULT TRUE,
    appointment_id INTEGER REFERENCES appointments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Insert default scooter models
INSERT INTO scooter_models (brand, model, estimated_service_time, common_issues) VALUES
('Xiaomi', 'Mi Electric Scooter', 60, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Motor arızası']),
('Xiaomi', 'Mi Pro 2', 75, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Elektronik arıza']),
('Ninebot', 'ES2', 60, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Katlanma mekanizması']),
('Ninebot', 'ES4', 75, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Süspansiyon']),
('Segway', 'Ninebot Max', 90, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Motor bakımı']),
('Kugoo', 'S1', 45, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Genel bakım']),
('Kugoo', 'M4', 60, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Süspansiyon']),
('Diğer', 'Genel Model', 60, ARRAY['Fren problemi', 'Batarya sorunu', 'Lastik değişimi', 'Genel arıza']);

-- Insert default admin user (password: admin)
INSERT INTO admin_users (username, password_hash) VALUES
('admin', 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_time_slots_workbench ON time_slots(workbench_number);
