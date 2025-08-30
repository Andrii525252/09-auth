import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === 'All' ? undefined : slug[0];
  return {
    title: `Notes: ${tag}`,
    description: `${tag} notes list`,
    openGraph: {
      title: `Notes: ${tag}`,
      description: `${tag} notes list`,
      url: `https://08-zustand-ten-kappa.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub logo',
        },
      ],
      type: 'article',
    },
  };
}

const NotesByCategory = async ({ params }: Props) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const page = 1;
  const perPage = 12;
  const search = '';
  const tag = slug[0] === 'all' ? undefined : slug[0];
  const data = await fetchNotes(page, perPage, search, tag);

  return <NotesClient initialData={data} tag={tag || 'All'} />;
};

export default NotesByCategory;
