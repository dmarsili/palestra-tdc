export default function AboutPage() {
  return (
    <div className="px-6 py-8 space-y-4">
      <h1 className="text-2xl font-bold">Sobre a demo</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Esta aplicação demonstra em poucos minutos como estruturar camadas (domínio, aplicação, infraestrutura e UI)
        usando Next.js, TypeScript e Tailwind. O tema é a evolução de líderes de tecnologia e a relação com
        participação no TDC e métricas de engenharia. Os dados são mockados em JSON local.
      </p>
    </div>
  );
}


