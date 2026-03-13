import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djwipzgrytxgashubycs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqd2lwemdyeXR4Z2FzaHVieWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDMyNDgsImV4cCI6MjA4ODYxOTI0OH0.mg6jSuOnl2eFftFJqg76HZ1jZPe1AvSaU4LIYGAkSK8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFetch() {
    const { data, error } = await supabase.from('appeals').select('*')
    console.log('Appeals error:', error)
    console.log('Appeals count:', data?.length)

    const { data: subData, error: subError } = await supabase.from('subprojects').select('*')
    console.log('Subprojects error:', subError)
    console.log('Subprojects count:', subData?.length)
}

testFetch()
