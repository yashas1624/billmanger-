/** Movies & Events */
import React from 'react';
import { SectionHeader, Card, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function Movies() {
  return (
    <div className="px-4 pb-24">
      <SectionHeader title="Movies & Events" subtitle="Book tickets for movies & events" />

      <div className="grid grid-cols-2 gap-3 px-4">
        <Card className="p-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray50 text-paytm shadow-sm mb-3">
            <Icon name="movie" size="24" />
          </div>
          <h4 className="text-sm font-bold text-gray800 mb-1">Movie Tickets</h4>
          <p className="text-xs text-gray500 mb-3">Book movie tickets nearby</p>
          <Button size="sm" className="w-full">Book Now</Button>
        </Card>
        <Card className="p-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray50 text-paytm shadow-sm mb-3">
            <Icon name="ticket" size="24" />
          </div>
          <h4 className="text-sm font-bold text-gray800 mb-1">Events & Shows</h4>
          <p className="text-xs text-gray500 mb-3">Concerts, plays & more</p>
          <Button size="sm" className="w-full">Explore</Button>
        </Card>
      </div>
    </div>
  );
}
