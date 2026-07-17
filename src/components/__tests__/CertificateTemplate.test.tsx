import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CertificateTemplate } from '@/components/CertificateTemplate';

describe('CertificateTemplate Component', () => {
  it('renders certificate with provided data', () => {
    const mockData = {
      title: 'CERTIFICATE',
      subtitle: 'OF COMPLETION',
      description: 'for successfully completing',
      eventName: 'Stellar Boot Camp',
      issuerName: 'Stellar Org',
      name: 'John Doe',
      date: '2023-10-27',
    };

    render(
      <CertificateTemplate 
        data={mockData} 
        credentialId="TEST-12345" 
      />
    );
    
    expect(screen.getByText('CERTIFICATE')).toBeInTheDocument();
    expect(screen.getByText('OF COMPLETION')).toBeInTheDocument();
    expect(screen.getByText('for successfully completing')).toBeInTheDocument();
    expect(screen.getByText('Stellar Boot Camp')).toBeInTheDocument();
    expect(screen.getByText('Stellar Org')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getAllByText('2023-10-27').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TEST-12345').length).toBeGreaterThan(0);
  });
});
