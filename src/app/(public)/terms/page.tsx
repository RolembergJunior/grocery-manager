import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | ListaAi",
  description:
    "Termos de Uso do aplicativo ListaAi - condições para utilização do serviço.",
};

const LAST_UPDATE = "04 de julho de 2026";
const CONTACT_EMAIL = "junior.45098@gmail.com";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Termos de Uso</h1>
      <p className="mb-8 text-sm text-gray-500">
        Última atualização: {LAST_UPDATE}
      </p>

      <section className="space-y-4">
        <p>
          Estes Termos de Uso regulam a utilização do aplicativo{" "}
          <strong>ListaAi</strong> e do site associado (&quot;serviço&quot;).
          Ao criar uma conta ou utilizar o serviço, você declara que leu,
          entendeu e concorda com estes termos.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        1. O serviço
      </h2>
      <section className="space-y-4">
        <p>
          O ListaAi é um aplicativo de gerenciamento de listas de compras que
          permite criar, organizar, sincronizar e compartilhar listas de
          compras, além de acompanhar preços e histórico de compras.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        2. Cadastro e conta
      </h2>
      <section className="space-y-4">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Para utilizar o serviço, é necessário criar uma conta com e-mail e
            senha ou com sua conta Google;
          </li>
          <li>
            Você é responsável por manter a confidencialidade das suas
            credenciais e por todas as atividades realizadas na sua conta;
          </li>
          <li>
            As informações fornecidas no cadastro devem ser verdadeiras e
            atualizadas;
          </li>
          <li>O serviço não é destinado a menores de 13 anos.</li>
        </ul>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        3. Assinaturas e pagamentos
      </h2>
      <section className="space-y-4">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            O ListaAi oferece funcionalidades gratuitas e funcionalidades
            adicionais mediante assinatura paga;
          </li>
          <li>
            Os pagamentos são processados pela Stripe e/ou pelo Google Play,
            conforme o canal de contratação;
          </li>
          <li>
            As assinaturas são renovadas automaticamente ao final de cada
            período, salvo cancelamento prévio;
          </li>
          <li>
            Você pode cancelar sua assinatura a qualquer momento. O acesso às
            funcionalidades pagas permanece ativo até o fim do período já
            pago;
          </li>
          <li>
            Valores e condições das assinaturas podem ser alterados mediante
            aviso prévio, aplicando-se apenas às renovações seguintes.
          </li>
        </ul>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        4. Uso aceitável
      </h2>
      <section className="space-y-4">
        <p>Ao utilizar o serviço, você se compromete a não:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Utilizar o serviço para fins ilícitos;</li>
          <li>
            Tentar acessar contas de terceiros ou áreas restritas do sistema;
          </li>
          <li>
            Interferir no funcionamento do serviço, incluindo tentativas de
            engenharia reversa, sobrecarga ou exploração de vulnerabilidades;
          </li>
          <li>
            Inserir conteúdo ofensivo, ilegal ou que viole direitos de
            terceiros nas listas compartilhadas.
          </li>
        </ul>
        <p>
          O descumprimento destes termos pode resultar na suspensão ou
          exclusão da conta.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        5. Conteúdo do usuário
      </h2>
      <section className="space-y-4">
        <p>
          O conteúdo que você cria no ListaAi (listas, produtos, observações)
          é seu. Ao utilizar o serviço, você nos concede uma licença limitada
          para armazenar e processar esse conteúdo exclusivamente para o
          funcionamento do serviço, incluindo sincronização entre dispositivos
          e compartilhamento com as pessoas que você autorizar.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        6. Privacidade
      </h2>
      <section className="space-y-4">
        <p>
          O tratamento dos seus dados pessoais é descrito na nossa{" "}
          <a href="/privacy-policy" className="text-blue-600 underline">
            Política de Privacidade
          </a>
          , que faz parte destes Termos de Uso.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        7. Disponibilidade e limitação de responsabilidade
      </h2>
      <section className="space-y-4">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Empregamos esforços razoáveis para manter o serviço disponível e
            seguro, mas ele é fornecido &quot;como está&quot;, sem garantia de
            disponibilidade ininterrupta ou ausência de erros;
          </li>
          <li>
            Não nos responsabilizamos por perdas decorrentes de indisponibilidade
            temporária, falhas de terceiros (como provedores de internet ou de
            pagamento) ou uso indevido da conta pelo usuário;
          </li>
          <li>
            Recomendamos que informações críticas não dependam exclusivamente
            do aplicativo.
          </li>
        </ul>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        8. Encerramento
      </h2>
      <section className="space-y-4">
        <p>
          Você pode encerrar sua conta a qualquer momento, conforme descrito na
          Política de Privacidade. Podemos suspender ou encerrar contas que
          violem estes termos, mediante notificação quando possível.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        9. Alterações nestes termos
      </h2>
      <section className="space-y-4">
        <p>
          Podemos atualizar estes Termos de Uso periodicamente. A versão mais
          recente estará sempre disponível nesta página. O uso continuado do
          serviço após a publicação de alterações constitui aceitação dos novos
          termos.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        10. Legislação aplicável e contato
      </h2>
      <section className="space-y-4">
        <p>
          Estes termos são regidos pelas leis da República Federativa do
          Brasil. Em caso de dúvidas, entre em contato pelo e-mail{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
