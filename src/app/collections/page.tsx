'use client'

import { useState } from 'react';
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import Collections from './collections';
import SingleCollectionMint from './singlemint';

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

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