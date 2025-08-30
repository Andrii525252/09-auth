import { fetchNoteByIdServer } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';
import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

type NoteDetailsModalProps = {
  params: Promise<{ id: string }>;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsModal({
  params,
}: NoteDetailsModalProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteByIdServer(id);

  return {
    title: `Preview: ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Preview: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `http://localhost:3000/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },
  };
}
