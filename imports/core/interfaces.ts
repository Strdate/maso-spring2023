interface TeamScore {
    tasks: number;
    total: number;
}

interface EntityInstance {
    id: number
    category: EntityCategory
    spriteMapOffset: [number, number]
    position: [number, number]
    facingDir?: FacingDir
  }

type EntityCategory = 'MONSTER'

type FacingDir = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT'

export { TeamScore, EntityInstance, EntityCategory, FacingDir }