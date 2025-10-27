-- Script pour créer correctement la table invoice_sequence
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Supprimer l'ancienne table
DROP TABLE IF EXISTS invoice_sequence CASCADE;

-- 2. Créer la table avec la bonne structure
-- IMPORTANT: id BIGSERIAL s'auto-incrémente automatiquement
CREATE TABLE invoice_sequence (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    current_number INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte d'unicité: une seule séquence par utilisateur et par année
    CONSTRAINT unique_owner_year UNIQUE(owner_id, year)
);

-- 3. Index pour améliorer les performances
CREATE INDEX idx_invoice_sequence_owner_year ON invoice_sequence(owner_id, year);

-- 4. Activer Row Level Security
ALTER TABLE invoice_sequence ENABLE ROW LEVEL SECURITY;

-- 5. Politique RLS: SELECT
CREATE POLICY "Users can view own sequences" 
    ON invoice_sequence FOR SELECT 
    USING (auth.uid() = owner_id);

-- 6. Politique RLS: INSERT
CREATE POLICY "Users can insert own sequences" 
    ON invoice_sequence FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

-- 7. Politique RLS: UPDATE
CREATE POLICY "Users can update own sequences" 
    ON invoice_sequence FOR UPDATE 
    USING (auth.uid() = owner_id);

-- 8. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_invoice_sequence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger pour appeler la fonction ci-dessus
CREATE TRIGGER invoice_sequence_updated_at
    BEFORE UPDATE ON invoice_sequence
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_sequence_updated_at();

-- 10. Vérification (optionnel - pour debug)
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'invoice_sequence';


