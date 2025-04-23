import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import championsRaw from '../../../data/champions.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Convert 'lanes' array to a comma-separated string
    const champions = championsRaw.map((champ) => ({
      ...champ,
      lanes: (champ.lanes as string[]).join(', ')
    }));

    const { data, error } = await supabase
      .from('champions')
      .upsert(champions, {
        onConflict: ['riot_id']
      });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ message: 'Failed to seed champions', error });
    }

    return res.status(200).json({ message: 'Champions seeded!', data });
  } catch (err) {
    console.error('Unexpected Error:', err);
    return res.status(500).json({ message: 'Unexpected error', error: err });
  }
}
