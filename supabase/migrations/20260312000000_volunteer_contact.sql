-- Migration: Create volunteer_applications and contact_messages tables

-- Volunteer Applications Table
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    interest TEXT NOT NULL,
    availability TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Optional but recommended)
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public submissions (Adjust based on security requirements)
CREATE POLICY "Allow public submissions for volunteer_applications" ON public.volunteer_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public submissions for contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Allow admins to read/update/delete (Assumes admin role or specific user IDs)
-- This is a generic policy, customize as needed for your auth setup
CREATE POLICY "Allow admins full access to volunteer_applications" ON public.volunteer_applications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow admins full access to contact_messages" ON public.contact_messages FOR ALL USING (auth.role() = 'service_role');
