import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (classname merge)', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('handles conditional classes', () => {
      const result = cn('base', true && 'included', false && 'excluded')
      expect(result).toContain('base')
      expect(result).toContain('included')
      expect(result).not.toContain('excluded')
    })

    it('handles empty input', () => {
      const result = cn()
      expect(typeof result).toBe('string')
    })

    it('handles undefined values', () => {
      const result = cn('base', undefined, 'other')
      expect(result).toContain('base')
      expect(result).toContain('other')
    })
  })
})
