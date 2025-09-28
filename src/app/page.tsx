import { createClient } from '@/utils/supabase/server'

export default async function Home() {
    const supabase = await createClient()
    const { data: instruments } = await supabase.from('instruments').select()
    return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}
