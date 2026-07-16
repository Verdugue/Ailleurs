import type { Coords } from '../types'

/**
 * Météo actuelle via l'API Open-Meteo. Gratuit, sans clé API.
 */

export interface CityWeather {
  temperature: number
  label: string
  emoji: string
}

const WMO: { codes: number[]; label: string; emoji: string }[] = [
  { codes: [0], label: 'Ciel dégagé', emoji: '☀️' },
  { codes: [1], label: 'Plutôt dégagé', emoji: '🌤️' },
  { codes: [2], label: 'Partiellement nuageux', emoji: '⛅' },
  { codes: [3], label: 'Couvert', emoji: '☁️' },
  { codes: [45, 48], label: 'Brouillard', emoji: '🌫️' },
  { codes: [51, 53, 55, 56, 57], label: 'Bruine', emoji: '🌦️' },
  { codes: [61, 63, 65, 66, 67], label: 'Pluie', emoji: '🌧️' },
  { codes: [71, 73, 75, 77], label: 'Neige', emoji: '🌨️' },
  { codes: [80, 81, 82], label: 'Averses', emoji: '🌦️' },
  { codes: [85, 86], label: 'Averses de neige', emoji: '🌨️' },
  { codes: [95, 96, 99], label: 'Orage', emoji: '⛈️' },
]

function describe(code: number): { label: string; emoji: string } {
  const found = WMO.find((w) => w.codes.includes(code))
  return found ?? { label: 'Météo', emoji: '🌍' }
}

export async function fetchWeather(center: Coords): Promise<CityWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${center.lat}&longitude=${center.lon}` +
    `&current=temperature_2m,weather_code`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)

  const json = (await res.json()) as {
    current?: { temperature_2m?: number; weather_code?: number }
  }
  const temp = json.current?.temperature_2m
  const code = json.current?.weather_code
  if (temp === undefined || code === undefined) throw new Error('Réponse météo incomplète')

  return { temperature: Math.round(temp), ...describe(code) }
}
