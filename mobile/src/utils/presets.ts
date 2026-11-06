import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TreeNode } from '../types/tree';

export interface JourneyPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  tree: TreeNode;
}

export const JOURNEY_PRESETS: JourneyPreset[] = [
  {
    id: 'tokyo-flight',
    name: 'Tokyo Trip (Flight & Hotel)',
    description: 'Includes luggage, cabin backpack, travel documents & home departure checks.',
    icon: '✈️',
    tree: {
      id: 'root-tokyo',
      title: 'Trip to Tokyo ✈️',
      completed: false,
      isExpanded: true,
      category: 'general',
      children: [
        {
          id: 'bag-main',
          title: 'Main Luggage (Check-in Bag)',
          completed: false,
          isExpanded: true,
          category: 'suitcase',
          notes: 'Max 23kg allowance',
          children: [
            {
              id: 'bag-laptop',
              title: 'Laptop & Charger',
              completed: false,
              isExpanded: true,
              category: 'tech',
              children: []
            },
            {
              id: 'bag-toothbrush',
              title: 'Toothbrush & Toiletries Kit',
              completed: false,
              isExpanded: true,
              category: 'toiletries',
              children: []
            },
            {
              id: 'bag-wallet',
              title: 'Wallet & Foreign Currency (JPY)',
              completed: false,
              isExpanded: true,
              category: 'wallet',
              children: []
            },
            {
              id: 'bag-clothes',
              title: 'Clothing & Apparel',
              completed: false,
              isExpanded: true,
              category: 'clothes',
              children: [
                { id: 'c-shirts', title: '4x T-Shirts & Shirts', completed: false, children: [], category: 'clothes' },
                { id: 'c-pants', title: '2x Pants & Jeans', completed: false, children: [], category: 'clothes' },
                { id: 'c-jacket', title: 'Warm Fleece Jacket', completed: false, children: [], category: 'clothes' },
                { id: 'c-socks', title: 'Socks & Underwear', completed: false, children: [], category: 'clothes' }
              ]
            },
            {
              id: 'bag-shoes',
              title: 'Comfortable Walking Sneakers',
              completed: false,
              isExpanded: true,
              category: 'general',
              children: []
            }
          ]
        },
        {
          id: 'backpack-cabin',
          title: 'Cabin Backpack',
          completed: false,
          isExpanded: true,
          category: 'backpack',
          notes: 'Keep with you under the seat',
          children: [
            {
              id: 'docs-group',
              title: 'Essential Documents',
              completed: false,
              isExpanded: true,
              category: 'documents',
              children: [
                { id: 'doc-passport', title: 'Passport & Visa Copy', completed: false, children: [], category: 'documents' },
                { id: 'doc-tickets', title: 'Boarding Passes & Itinerary', completed: false, children: [], category: 'documents' },
                { id: 'doc-hotel', title: 'Hotel Booking Confirmation', completed: false, children: [], category: 'documents' }
              ]
            },
            {
              id: 'tech-cabin',
              title: 'In-Flight Tech',
              completed: false,
              isExpanded: true,
              category: 'tech',
              children: [
                { id: 't-headphones', title: 'Noise-Cancelling Headphones', completed: false, children: [], category: 'tech' },
                { id: 't-powerbank', title: '10,000mAh Power Bank', completed: false, children: [], category: 'tech' },
                { id: 't-cables', title: 'USB-C Charging Cable', completed: false, children: [], category: 'tech' }
              ]
            },
            {
              id: 'cabin-meds',
              title: 'Motion Sickness & Pain Relief Meds',
              completed: false,
              isExpanded: true,
              category: 'medicine',
              children: []
            }
          ]
        },
        {
          id: 'person-pockets',
          title: 'On-Person / Pockets',
          completed: false,
          isExpanded: true,
          category: 'bag',
          children: [
            { id: 'p-phone', title: 'Smartphone', completed: false, children: [], category: 'tech' },
            { id: 'p-keys', title: 'House & Car Keys', completed: false, children: [], category: 'keys' },
            { id: 'p-sunglasses', title: 'UV Sunglasses', completed: false, children: [], category: 'general' }
          ]
        },
        {
          id: 'home-departure',
          title: 'Home Pre-Departure Checks',
          completed: false,
          isExpanded: true,
          category: 'home',
          children: [
            { id: 'h-trash', title: 'Empty Kitchen & Bathroom Trash', completed: false, children: [], category: 'home' },
            { id: 'h-water', title: 'Shut Off Main Water Valve', completed: false, children: [], category: 'home' },
            { id: 'h-ac', title: 'Turn Off Thermostat & AC', completed: false, children: [], category: 'home' },
            { id: 'h-lock', title: 'Lock All Windows & Front Door', completed: false, children: [], category: 'home' }
          ]
        }
      ]
    }
  },
  {
    id: 'weekend-getaway',
    name: 'Weekend Getaway',
    description: 'Quick 2-day road trip checklist.',
    icon: '🚗',
    tree: {
      id: 'root-weekend',
      title: 'Weekend Road Trip 🚗',
      completed: false,
      isExpanded: true,
      category: 'general',
      children: [
        {
          id: 'duffel-bag',
          title: 'Duffel Bag',
          completed: false,
          isExpanded: true,
          category: 'bag',
          children: [
            { id: 'w-clothes', title: 'Casual Outfits & Sleepwear', completed: false, children: [], category: 'clothes' },
            { id: 'w-toiletries', title: 'Toothbrush & Travel Deodorant', completed: false, children: [], category: 'toiletries' },
            { id: 'w-swim', title: 'Swimwear & Microfiber Towel', completed: false, children: [], category: 'general' },
            { id: 'w-charger', title: 'Phone & Watch Charger', completed: false, children: [], category: 'tech' }
          ]
        },
        {
          id: 'car-trunk',
          title: 'Car Trunk & Snacks',
          completed: false,
          isExpanded: true,
          category: 'suitcase',
          children: [
            { id: 'c-cooler', title: 'Cooler with Cold Drinks', completed: false, children: [], category: 'food' },
            { id: 'c-snacks', title: 'Energy Bars & Trail Mix', completed: false, children: [], category: 'food' },
            { id: 'c-firstaid', title: 'Emergency First Aid Kit', completed: false, children: [], category: 'medicine' },
            { id: 'c-aux', title: 'AUX Cable / Car Bluetooth', completed: false, children: [], category: 'tech' }
          ]
        }
      ]
    }
  },
  {
    id: 'blank-trip',
    name: 'Start Blank',
    description: 'A clean slate to organize your custom containers and items.',
    icon: '📝',
    tree: {
      id: 'root-blank',
      title: 'My Journey',
      completed: false,
      isExpanded: true,
      category: 'general',
      children: [
        {
          id: 'bag-default',
          title: 'Bag',
          completed: false,
          isExpanded: true,
          category: 'bag',
          children: [
            { id: 'item-wallet', title: 'Wallet', completed: false, children: [], category: 'wallet' },
            { id: 'item-toothbrush', title: 'Toothbrush', completed: false, children: [], category: 'toiletries' },
            { id: 'item-laptop', title: 'Laptop', completed: false, children: [], category: 'tech' }
          ]
        }
      ]
    }
  }
];

const STORAGE_KEY = '@allset_journey_tree_data';

export async function loadSavedTreeAsync(): Promise<TreeNode> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.children) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load tree from storage:', err);
  }
  return JOURNEY_PRESETS[0].tree;
}

export async function saveTreeAsync(tree: TreeNode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch (err) {
    console.error('Failed to save tree to storage:', err);
  }
}

