"use client";

import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  // Fetch real analytics data
  const { data, isLoading } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
    initialData: {
      totalIssued: 0,
      activeIssuers: 0,
      volumeData: []
    }
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b-2 border-pure-black pb-4">
        <BarChart className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-playfair text-[48px] leading-none text-pure-black font-bold tracking-tight mb-2">Analytics</h1>
          <p className="font-mono-label text-[12px] uppercase text-on-surface-variant tracking-wider">
            Credential Issuance Metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-none border-pure-black shadow-[4px_4px_0_0_#0F0E0E]">
          <CardHeader className="pb-2">
            <CardTitle className="font-dot text-[14px] uppercase text-outline">Total Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-playfair font-bold text-pure-black">{data?.totalIssued || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-pure-black shadow-[4px_4px_0_0_#0F0E0E]">
          <CardHeader className="pb-2">
            <CardTitle className="font-dot text-[14px] uppercase text-outline">Active Issuers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-playfair font-bold text-pure-black">{data?.activeIssuers || 0}</div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-pure-black shadow-[4px_4px_0_0_#0F0E0E]">
          <CardHeader className="pb-2">
            <CardTitle className="font-dot text-[14px] uppercase text-outline">Network Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-primary font-dot uppercase tracking-wider text-[14px] mt-2">
              <Activity className="w-4 h-4 animate-pulse" /> Excellent
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-pure-black mt-8 shadow-[4px_4px_0_0_#0F0E0E]">
        <CardHeader>
          <CardTitle className="font-dot text-[16px] uppercase tracking-wider text-pure-black border-b border-outline-variant pb-4">
            Issuance Volume (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center font-dot uppercase text-outline animate-pulse">
              Loading chart data...
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.volumeData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCreds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E28EB" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1E28EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontFamily: 'monospace', fontSize: 12, fill: '#64748B' }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontFamily: 'monospace', fontSize: 12, fill: '#64748B' }} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: 0, border: '2px solid #0F0E0E', boxShadow: '4px 4px 0 0 #0F0E0E' }}
                    labelStyle={{ fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="credentials" 
                    stroke="#1E28EB" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCreds)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
