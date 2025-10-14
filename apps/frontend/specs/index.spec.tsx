import React from 'react';
import { render } from '@testing-library/react';
import { Providers } from '../src/app/providers';
import { CustomPackagePage } from '../src/features/custom-package/components/CustomPackagePage';

describe('CustomPackagePage', () => {
  it('renders the hero headline', () => {
    const { getByRole } = render(
      <Providers>
        <CustomPackagePage />
      </Providers>
    );

    expect(
      getByRole('heading', { level: 1, name: 'Kendi Paketini Oluştur' })
    ).toBeInTheDocument();
  });
});