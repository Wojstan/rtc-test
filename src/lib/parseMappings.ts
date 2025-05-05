export type Mappings = Record<string, string>

export function parseMappings(mappingsRaw: string): Mappings {
  const mappings: Mappings = {}

  for (const pair of mappingsRaw.split(';')) {
    const [id, value] = pair.split(':')
    mappings[id] = value
  }

  return mappings
}
