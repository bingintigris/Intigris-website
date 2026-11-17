import { tx } from '@/lib/cn';

/* The seven chapters both concepts walk through (one demo customer, Havenwerk BV). */
export type Step = { key: string; product: string; title: string; line: string; href?: string; cta?: string; time: string; color: string };

export const STEPS = (): Step[] => [
  { key: 'sales', product: 'Sales Cloud', time: '08:02', color: '#0176d3',
    title: tx('Every deal in view.', 'Elke deal in beeld.'),
    line: tx('Your pipeline, from the first email to the signed quote.', 'Je pipeline, van de eerste mail tot de getekende offerte.'),
    href: 'SalesCloud.html', cta: tx('About Sales Cloud', 'Over Sales Cloud') },
  { key: 'customer', product: 'Customer 360', time: '09:41', color: '#0176d3',
    title: tx('Behind every deal, a customer.', 'Achter elke deal zit een klant.'),
    line: tx('Contacts, quotes, activity and open cases on one record, for everyone.', 'Contacten, offertes, activiteit en open cases op één kaart, voor iedereen.') },
  { key: 'service', product: 'Service Cloud', time: '11:20', color: '#7f3ff5',
    title: tx('Customer questions, handled smartly.', 'Klantvragen, slim afgehandeld.'),
    line: tx('Every channel in one queue, with the SLA ticking and the history at hand.', 'Elk kanaal in één wachtrij, met de SLA in beeld en de historie bij de hand.'),
    href: 'ServiceCloud.html', cta: tx('About Service Cloud', 'Over Service Cloud') },
  { key: 'field', product: 'Field Service · FieldBuddy', time: '13:05', color: '#2e844a',
    title: tx('The right engineer, with the right part.', 'De juiste monteur, met het juiste onderdeel.'),
    line: tx('Planning, routes and work orders, on the board and on the phone.', 'Planning, routes en werkbonnen, op het planbord en op de telefoon.'),
    href: 'FieldService.html', cta: tx('About Field Service', 'Over Field Service') },
  { key: 'agent', product: 'Agentforce', time: '13:12', color: '#0176d3',
    title: tx('An agent that thinks along.', 'Een agent die meedenkt.'),
    line: tx('AI agents that prepare, answer and act, within your data and rules.', 'AI-agents die voorbereiden, antwoorden en handelen, binnen je eigen data en regels.'),
    href: 'Agentforce.html', cta: tx('About Agentforce', 'Over Agentforce') },
  { key: 'data', product: 'Data 360', time: '15:30', color: '#9ab8e2',
    title: tx('One picture, from every system.', 'Eén beeld, uit al je systemen.'),
    line: tx('Data 360 (formerly Data Cloud) unifies every source into one profile for people and agents.', 'Data 360 (voorheen Data Cloud) brengt elke bron samen in één profiel, voor mensen én agents.') },
  { key: 'slack', product: tx('Slack · integrations', 'Slack · koppelingen'), time: '16:45', color: '#4a154b',
    title: tx('Together in Slack. Connected to your ERP.', 'Samen in Slack. Gekoppeld aan je ERP.'),
    line: tx('Your team and agents work in Slack; Exact, AFAS or NetSuite stay in sync.', 'Je team en agents werken in Slack; Exact, AFAS of NetSuite blijven in sync.') },
];
