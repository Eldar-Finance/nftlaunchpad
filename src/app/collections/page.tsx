'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import Collections from './collections';
import SingleCollectionMint from './singlemint';

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const select = searchParams.get('select');
    if (select) {
      setSelectedCollection(select);
    }
  }, [searchParams]);

  const handleCollectionSelect = (collectionId: string) => {
    setSelectedCollection(collectionId);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
  };

  return (
    <>
      <ClientHooks />
      <AuthRedirectWrapper requireAuth={false}>
        {selectedCollection ? (
          <SingleCollectionMint 
            collectionId={selectedCollection} 
            onBackClick={handleBackToCollections}
          />
        ) : (
          <Collections onCollectionSelect={handleCollectionSelect} />
        )}
      </AuthRedirectWrapper>
    </>
  );
}