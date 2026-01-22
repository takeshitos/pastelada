import Container from '@/components/layouts/Container'
import Logo from '@/components/ui/Logo'
import VendorSelector from '@/components/vendor/VendorSelector'

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 py-8">
      <Container size="md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Sistema de Vendas
          </h1>
          <p className="text-base md:text-lg text-neutral-600">
            Selecione um vendedor para começar
          </p>
        </div>

        <VendorSelector />
      </Container>
    </main>
  )
}