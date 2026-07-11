"use client";

import { useEffect, useState } from 'react';
import { rpc, xdr, scValToNative } from '@stellar/stellar-sdk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ShieldCheck, XCircle, Activity } from 'lucide-react';

const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const server = new rpc.Server(rpcUrl);

interface AppEvent {
  id: string;
  type: 'issued' | 'revoked';
  credentialId: string;
  issuer: string;
  timestamp: Date;
  txHash: string;
}

export default function ActivityFeedPage() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID;
        if (!REGISTRY_ID) {
            setIsLoading(false);
            return;
        }

        // Fetch recent events from the soroban RPC
        // Note: The RPC getEvents endpoint allows fetching events for a contract.
        // We fetch the last 1000 ledgers.
        const latestLedger = await server.getLatestLedger();
        const startLedger = Math.max(1, latestLedger.sequence - 1000);

        const response = await server.getEvents({
          startLedger,
          filters: [
            {
              type: 'contract',
              contractIds: [REGISTRY_ID]
            }
          ],
          limit: 50
        });

        if (!mounted) return;

        const parsedEvents: AppEvent[] = response.events.map(ev => {
          // Simplistic parsing of our emitted event shapes
          // Actual parsing requires XDR decoding of `ev.topic` and `ev.value`
          // We will mock the topic interpretation for the UI demonstration
          let topicType = '';
          let credId = 'Unknown';
          try {
            if (ev.topic[0]) {
              topicType = scValToNative(ev.topic[0]) as string;
            }
            if (ev.topic[1]) {
              credId = scValToNative(ev.topic[1]) as string;
            }
          } catch (e) {
            topicType = ev.topic[0]?.toString() || '';
          }
          
          let issuerAddr = 'Unknown Address';
          try {
            if (ev.value) {
              const valNative = scValToNative(ev.value);
              if (Array.isArray(valNative) && valNative.length > 0) {
                issuerAddr = valNative[0] as string;
              }
            }
          } catch(e) {}

          const isIssue = topicType.includes('issued');
          return {
            id: ev.id,
            type: isIssue ? 'issued' : 'revoked',
            credentialId: credId,
            issuer: issuerAddr,
            timestamp: new Date(ev.ledgerClosedAt),
            txHash: ev.txHash
          };
        });

        setEvents(parsedEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchEvents();
    // Poll every 10 seconds for real-time feel
    const interval = setInterval(fetchEvents, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b-2 border-pure-black pb-4">
        <Activity className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-playfair text-[48px] leading-none text-pure-black font-bold tracking-tight mb-2">Live Activity Feed</h1>
          <p className="font-mono-label text-[12px] uppercase text-on-surface-variant tracking-wider">
            Real-time Soroban Contract Events
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-outline font-dot uppercase animate-pulse">
          Syncing with Stellar Ledger...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center p-12 text-outline border-2 border-dashed border-outline-variant">
          No recent activity found in the last 1000 ledgers.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <Card key={ev.id} className="rounded-none border-pure-black shadow-sm">
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {ev.type === 'issued' ? (
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    ) : (
                      <XCircle className="w-6 h-6 text-signal-red" />
                    )}
                    <div>
                      <CardTitle className="font-dot text-[16px] uppercase tracking-wider flex items-center gap-2">
                        {ev.type === 'issued' ? 'Credential Anchored' : 'Credential Revoked'}
                        <span className="font-mono text-[12px] bg-surface-variant px-2 py-0.5 text-pure-black">
                          {ev.credentialId}
                        </span>
                      </CardTitle>
                      <CardDescription className="font-mono-label text-[10px] mt-1 flex flex-col gap-1">
                        <span>{formatDistanceToNow(ev.timestamp, { addSuffix: true })}</span>
                        <span className="text-primary truncate max-w-[200px] sm:max-w-md">By Issuer: {ev.issuer}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${ev.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-surface-container border border-outline-variant text-[12px] font-dot uppercase hover:bg-surface-bright transition-colors"
                  >
                    View Tx
                  </a>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
