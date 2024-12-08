import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />,
      title: 'Fácil de usar',
      description: 'Interface intuitiva que simplifica seu trabalho.'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      title: 'Recursos avançados',
      description: 'Aumente sua produtividade com relatórios.'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-purple-500" />,
      title: 'Inteligencia Artificial',
      description: 'Tenha auxílio de uma inteligência artificial para tomada de decisão.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">AgroTech</h1>
            <Link
              to={"/auth"}
              className={
                cn(
                  buttonVariants(),
                  "bg-blue-600 hover:bg-blue-700",
                )
              }
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Revolucione sua produção agrícola
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Simplifique seus processos, aumente a produtividade e desbloqueie o potencial do seu plantio com a nossa solução.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to={"/dashboard"}
            className={
              cn(
                buttonVariants({ size: "lg" }),
                "bg-blue-600 hover:bg-blue-700",
              )
            }
          >
            Vamos começar
          </Link>
          <Link
            to={"/"}
            className={
              cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-blue-600 text-blue-600 hover:bg-blue-50",
              )
            }
          >
            Saiba mais
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher nossa solução?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  {feature.icon}
                  <CardTitle className="m-0">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Pronto para revolucionar?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Una-se a milhares de equipes que já aumentaram sua produtividade.
        </p>
        <Link
          to={"/dashboard"}
          className={
            cn(
              buttonVariants({ size: "lg" }),
              "bg-green-600 hover:bg-green-700",
            )
          }
        >
          Comece agora
        </Link>
      </div>
    </div >
  );
};
