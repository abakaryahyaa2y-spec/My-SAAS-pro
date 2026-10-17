-- ==============================================================================
-- EduSaaS - Production SQL Schema with 100% Row Level Security (RLS)
-- Multi-Tenant Isolation & Mandatory Email Verification
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- 2.1. Organisations (Établissements scolaires)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    logo_url TEXT,
    phone TEXT,
    email TEXT,
    subscription_plan TEXT NOT NULL DEFAULT 'Mensuel' CHECK (subscription_plan IN ('Mensuel', 'Trimestriel', 'Annuel', 'Essai')),
    subscription_status TEXT NOT NULL DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled')),
    trial_ends_at TIMESTAMPTZ DEFAULT (now() + interval '3 days'),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.2. Profils Utilisateurs (Liés à auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'director' CHECK (role IN ('director', 'admin', 'accountant', 'teacher')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.3. Élèves & Inscriptions
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    birth_place TEXT NOT NULL,
    grade TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Inscrit' CHECK (status IN ('Inscrit', 'En attente', 'Radié')),
    enrollment_date TEXT NOT NULL DEFAULT to_char(now(), 'DD/MM/YYYY'),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.4. Finances & Trésorerie
CREATE TABLE IF NOT EXISTS public.finances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    student TEXT NOT NULL,
    grade TEXT NOT NULL,
    amount TEXT NOT NULL,
    amount_num NUMERIC(12, 2) NOT NULL DEFAULT 0,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Impayé' CHECK (status IN ('Payé', 'Impayé')),
    type TEXT NOT NULL DEFAULT 'Scolarité',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.5. Ressources Humaines & Personnel
CREATE TABLE IF NOT EXISTS public.hr_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    salary TEXT NOT NULL,
    salary_num NUMERIC(12, 2) NOT NULL DEFAULT 0,
    hire_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Actif' CHECK (status IN ('Actif', 'Inactif')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2.6. Abonnements SaaS & Facturation
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL CHECK (plan_name IN ('Mensuel', 'Trimestriel', 'Annuel')),
    price_fcfa NUMERIC(12, 2) NOT NULL,
    billing_email TEXT NOT NULL,
    billing_phone TEXT NOT NULL,
    trial_days INTEGER NOT NULL DEFAULT 3,
    trial_start TIMESTAMPTZ DEFAULT now() NOT NULL,
    trial_end TIMESTAMPTZ DEFAULT (now() + interval '3 days') NOT NULL,
    status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'canceled')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 3. ACTIVATION DE ROW LEVEL SECURITY (RLS) SUR TOUTES LES TABLES
-- ==============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. FONCTIONS DE SÉCURITÉ (SECURITY DEFINER)
-- ==============================================================================

-- 4.1. Vérifie si l'utilisateur connecté a un email vérifié
CREATE OR REPLACE FUNCTION public.is_email_verified()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email_confirmed_at') IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4.2. Récupère l'organisation_id de l'utilisateur connecté
CREATE OR REPLACE FUNCTION public.get_current_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ==============================================================================
-- 5. POLITIQUES RLS (POLICIES) MULTI-TENANT & EMAIL CONFIRMÉ
-- ==============================================================================

-- 5.1. Politiques ORGANIZATIONS
CREATE POLICY "org_select_policy" ON public.organizations
    FOR SELECT TO authenticated
    USING (id = public.get_current_org_id());

CREATE POLICY "org_update_policy" ON public.organizations
    FOR UPDATE TO authenticated
    USING (id = public.get_current_org_id() AND public.is_email_verified())
    WITH CHECK (id = public.get_current_org_id() AND public.is_email_verified());

-- 5.2. Politiques PROFILES
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated
    USING (organization_id = public.get_current_org_id());

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() AND public.is_email_verified())
    WITH CHECK (id = auth.uid() AND public.is_email_verified());

-- 5.3. Politiques STUDENTS
CREATE POLICY "students_select_policy" ON public.students
    FOR SELECT TO authenticated
    USING (organization_id = public.get_current_org_id());

CREATE POLICY "students_insert_policy" ON public.students
    FOR INSERT TO authenticated
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

CREATE POLICY "students_update_policy" ON public.students
    FOR UPDATE TO authenticated
    USING (organization_id = public.get_current_org_id() AND public.is_email_verified())
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

CREATE POLICY "students_delete_policy" ON public.students
    FOR DELETE TO authenticated
    USING (organization_id = public.get_current_org_id() AND public.is_email_verified());

-- 5.4. Politiques FINANCES
CREATE POLICY "finances_select_policy" ON public.finances
    FOR SELECT TO authenticated
    USING (organization_id = public.get_current_org_id());

CREATE POLICY "finances_insert_policy" ON public.finances
    FOR INSERT TO authenticated
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

CREATE POLICY "finances_update_policy" ON public.finances
    FOR UPDATE TO authenticated
    USING (organization_id = public.get_current_org_id() AND public.is_email_verified())
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

CREATE POLICY "finances_delete_policy" ON public.finances
    FOR DELETE TO authenticated
    USING (organization_id = public.get_current_org_id() AND public.is_email_verified());

-- 5.5. Politiques HR_STAFF
CREATE POLICY "hr_select_policy" ON public.hr_staff
    FOR SELECT TO authenticated
    USING (organization_id = public.get_current_org_id());

CREATE POLICY "hr_insert_policy" ON public.hr_staff
    FOR INSERT TO authenticated
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

CREATE POLICY "hr_update_policy" ON public.hr_staff
    FOR UPDATE TO authenticated
    USING (organization_id = public.get_current_org_id() AND public.is_email_verified())
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

CREATE POLICY "hr_delete_policy" ON public.hr_staff
    FOR DELETE TO authenticated
    USING (organization_id = public.get_current_org_id() AND public.is_email_verified());

-- 5.6. Politiques SUBSCRIPTIONS
CREATE POLICY "subscriptions_select_policy" ON public.subscriptions
    FOR SELECT TO authenticated
    USING (organization_id = public.get_current_org_id());

CREATE POLICY "subscriptions_insert_policy" ON public.subscriptions
    FOR INSERT TO authenticated
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

CREATE POLICY "subscriptions_update_policy" ON public.subscriptions
    FOR UPDATE TO authenticated
    USING (organization_id = public.get_current_org_id() AND public.is_email_verified())
    WITH CHECK (organization_id = public.get_current_org_id() AND public.is_email_verified());

-- ==============================================================================
-- 6. TRIGGERS AUTOMATIQUES
-- ==============================================================================

-- 6.1. Création automatique de l'organisation et du profil lors du Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
    school_name TEXT;
BEGIN
    school_name := COALESCE(NEW.raw_user_meta_data->>'school_name', 'Mon Établissement');

    -- Créer une nouvelle organisation avec 3 jours d'essai gratuit
    INSERT INTO public.organizations (name, email, subscription_plan, subscription_status, trial_ends_at)
    VALUES (school_name, NEW.email, 'Essai', 'trialing', now() + interval '3 days')
    RETURNING id INTO new_org_id;

    -- Créer le profil associé en tant que directeur
    INSERT INTO public.profiles (id, organization_id, full_name, role)
    VALUES (NEW.id, new_org_id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Directeur'), 'director');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencheur sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6.2. Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_finances_updated BEFORE UPDATE ON public.finances FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_hr_staff_updated BEFORE UPDATE ON public.hr_staff FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
