import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Providers from '@/components/Providers';

describe('Providers Component', () => {
  it('renders children within providers', () => {
    render(
      <Providers>
        <div data-testid="child">Test Child</div>
      </Providers>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
