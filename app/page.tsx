import Container from '@/components/layouts/Container'
import VendorSelector from '@/components/vendor/VendorSelector'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Container size="md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema Pastelada
          </h1>
          <p className="text-lg text-gray-600">
            Sistema de vendas para pastelaria
          </p>
        </div>

        <VendorSelector />
      </Container>
    </main>
  )
}