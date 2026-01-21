import { 
  formatCurrency, 
  reaisToCents, 
  validatePhone, 
  validateName, 
  getDateRange, 
  formatDateForAPI
} from './utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format cents to Brazilian currency', () => {
      // Test the actual output format
      const result = formatCurrency(1000)
      expect(result).toMatch(/R\$\s*10,00/)
      expect(formatCurrency(150)).toMatch(/R\$\s*1,50/)
      expect(formatCurrency(0)).toMatch(/R\$\s*0,00/)
    })
  })

  describe('reaisToCents', () => {
    it('should convert reais to cents', () => {
      expect(reaisToCents(10.50)).toBe(1050)
      expect(reaisToCents(1)).toBe(100)
      expect(reaisToCents(0)).toBe(0)
    })
  })

  describe('validatePhone', () => {
    it('should validate phone numbers (only digits)', () => {
      expect(validatePhone('11999887766')).toBe(true)
      expect(validatePhone('123')).toBe(true)
      expect(validatePhone('')).toBe(false) // empty should be invalid
      expect(validatePhone('11-99988-7766')).toBe(false)
      expect(validatePhone('abc')).toBe(false)
    })
  })

  describe('validateName', () => {
    it('should validate names (minimum 2 characters)', () => {
      expect(validateName('João')).toBe(true)
      expect(validateName('AB')).toBe(true)
      expect(validateName('A')).toBe(false)
      expect(validateName('')).toBe(false)
      expect(validateName('  ')).toBe(false) // only spaces
    })
  })

  describe('getDateRange', () => {
    it('should return correct date ranges', () => {
      const today = getDateRange('today')
      const sevenDays = getDateRange('7days')
      const month = getDateRange('month')

      // Test that start date is before end date
      expect(today.startDate.getTime()).toBeLessThan(today.endDate.getTime())
      expect(sevenDays.startDate.getTime()).toBeLessThan(sevenDays.endDate.getTime())
      expect(month.startDate.getTime()).toBeLessThan(month.endDate.getTime())

      // Test that 7 days range is longer than today
      expect(sevenDays.startDate.getTime()).toBeLessThan(today.startDate.getTime())

      // Test that month starts on day 1
      expect(month.startDate.getDate()).toBe(1)
    })
  })

  describe('formatDateForAPI', () => {
    it('should format date as ISO string', () => {
      const date = new Date('2024-01-15T10:30:00.000Z')
      expect(formatDateForAPI(date)).toBe('2024-01-15T10:30:00.000Z')
    })
  })
})