/** Travel - Bus, Train, Flight */
import React from 'react';
import { SectionHeader, Card, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

const TRAVEL_OPTIONS = [
  { id: 'bus', label: 'Bus Tickets', icon: 'ticket', color: '#005bbb', desc: 'Intercity & intracity buses' },
  { id: 'train', label: 'Train Tickets', icon: 'ticket', color: '#00b86b', desc: 'IRCTC train booking' },
  { id: 'flight', label: 'Flight Tickets', icon: 'ticket', color: '#ff9500', desc: 'Domestic & international' },
  { id: 'metro', label: 'Metro Card', icon: 'metro', color: '#8e44ad', desc: 'Recharge metro card' },
];

export default function Travel() {
  return (
    <div className="px-4 pb-24">
      <SectionHeader title="Book Travel" subtitle="Buses, trains, flights & more" />

      <div className="grid grid-cols-2 gap-3 px-4">
        {TRAVEL_OPTIONS.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray50 text-paytm shadow-sm mb-3">
              <Icon name={t.icon} size="24" />
            </div>
            <h4 className="text-sm font-bold text-gray800 mb-1">{t.label}</h4>
            <p className="text-xs text-gray500 mb-3">{t.desc}</p>
            <Button size="sm" className="w-full">Book Now</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
