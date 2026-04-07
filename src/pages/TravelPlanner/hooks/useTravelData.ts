import { useState, useEffect } from 'react';
import { Destination, Itinerary, defaultDestinations } from '../types';

const STORAGE_KEYS = {
  destinations: 'travel_destinations',
  itineraries: 'travel_itineraries',
};

export default function useTravelData() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const storedDests = localStorage.getItem(STORAGE_KEYS.destinations);
    if (storedDests) {
      setDestinations(JSON.parse(storedDests));
    } else {
      setDestinations(defaultDestinations);
      localStorage.setItem(STORAGE_KEYS.destinations, JSON.stringify(defaultDestinations));
    }

    const storedItins = localStorage.getItem(STORAGE_KEYS.itineraries);
    if (storedItins) {
      setItineraries(JSON.parse(storedItins));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.destinations, JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.itineraries, JSON.stringify(itineraries));
  }, [itineraries]);

  const addDestination = (dest: Omit<Destination, 'id'>) => {
    const newId = Date.now().toString();
    setDestinations([...destinations, { ...dest, id: newId }]);
  };

  const updateDestination = (id: string, updated: Partial<Destination>) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, ...updated } : d));
  };

  const deleteDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const addItinerary = (itin: Omit<Itinerary, 'id' | 'createdAt'>) => {
    const newId = Date.now().toString();
    setItineraries([...itineraries, { ...itin, id: newId, createdAt: new Date().toISOString() }]);
  };

  const updateItinerary = (id: string, updated: Partial<Itinerary>) => {
    setItineraries(itineraries.map(i => i.id === id ? { ...i, ...updated } : i));
  };

  const deleteItinerary = (id: string) => {
    setItineraries(itineraries.filter(i => i.id !== id));
  };

  return {
    destinations,
    itineraries,
    addDestination,
    updateDestination,
    deleteDestination,
    addItinerary,
    updateItinerary,
    deleteItinerary,
  };
}