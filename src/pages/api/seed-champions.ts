import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import champions from '../../../data/champions.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const castedChampions = champions.map((champ) => ({
    ...champ,
    lanes: champ.lanes as string[],
  }));

  const { data, error } = await supabase
    .from('champions')
    .upsert(castedChampions, {
      onConflict: ['riot_id']
    });

  if (error) {
    return res.status(500).json({ message: 'Error seeding champions', error });
  }

  return res.status(200).json({ message: 'Champions seeded successfully!', data });
}
