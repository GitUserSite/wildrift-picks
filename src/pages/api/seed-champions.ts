import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import champions from '../../../data/champions.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('champions')
      .upsert(champions, {
        onConflict: ['riot_id'],
      });

    if (error) {
      console.error('❌ Seeding error:', error);
      return res.status(500).json({ message: 'Error seeding champions', error });
    }

    console.log(`✅ Seeded ${data?.length || 0} champions.`);
    return res.status(200).json({
      message: `Champions seeded successfully`,
      inserted: data?.length || 0,
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ message: 'Unexpected error occurred', err });
  }
}
