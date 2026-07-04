import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | ListaAi",
  description:
    "Política de Privacidade do aplicativo ListaAi - saiba como coletamos, usamos e protegemos seus dados.",
};

const LAST_UPDATE = "04 de julho de 2026";
const CONTACT_EMAIL = "junior.45098@gmail.com";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Política de Privacidade
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Última atualização: {LAST_UPDATE}
      </p>

      <section className="space-y-4">
        <p>
          Esta Política de Privacidade descreve como o aplicativo{" "}
          <strong>ListaAi</strong> (&quot;nós&quot;, &quot;nosso&quot; ou
          &quot;aplicativo&quot;) coleta, usa, armazena e protege as
          informações dos usuários, em conformidade com a Lei Geral de
          Proteção de Dados (Lei nº 13.709/2018 - LGPD).
        </p>
        <p>
          Ao utilizar o ListaAi, você concorda com a coleta e o uso de
          informações de acordo com esta política.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        1. Dados que coletamos
      </h2>
      <section className="space-y-4">
        <p>Coletamos os seguintes tipos de dados:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Dados de cadastro:</strong> nome, endereço de e-mail e
            senha (armazenada de forma criptografada) quando você cria uma
            conta com e-mail e senha, ou nome, e-mail e foto de perfil quando
            você entra com sua conta Google.
          </li>
          <li>
            <strong>Conteúdo criado por você:</strong> listas de compras,
            produtos, categorias, quantidades, preços e observações que você
            registra no aplicativo.
          </li>
          <li>
            <strong>Dados de pagamento:</strong> caso você contrate uma
            assinatura, os pagamentos são processados pela Stripe e/ou pelo
            Google Play. Nós não armazenamos os dados completos do seu cartão
            de crédito — recebemos apenas o status da assinatura e
            identificadores de transação.
          </li>
          <li>
            <strong>Dados técnicos e de uso:</strong> informações básicas do
            dispositivo e métricas de uso anônimas para melhorar o desempenho
            e a estabilidade do aplicativo e do site.
          </li>
        </ul>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        2. Como usamos seus dados
      </h2>
      <section className="space-y-4">
        <p>Utilizamos os dados coletados para:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Criar e gerenciar sua conta;</li>
          <li>
            Sincronizar suas listas de compras entre dispositivos e permitir o
            compartilhamento de listas com outras pessoas, quando você optar
            por compartilhar;
          </li>
          <li>Processar pagamentos e gerenciar assinaturas;</li>
          <li>Melhorar a experiência, o desempenho e a segurança do serviço;</li>
          <li>
            Entrar em contato com você sobre assuntos relacionados à sua conta,
            quando necessário.
          </li>
        </ul>
        <p>
          <strong>Não vendemos</strong> seus dados pessoais a terceiros e não
          utilizamos seu conteúdo para publicidade.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        3. Compartilhamento com terceiros
      </h2>
      <section className="space-y-4">
        <p>
          Para funcionar, o ListaAi utiliza serviços de terceiros que podem
          processar dados em nosso nome:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Google Firebase</strong> (autenticação e banco de dados
            Firestore) — armazenamento seguro da sua conta e das suas listas.{" "}
            <a
              href="https://firebase.google.com/support/privacy"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de privacidade do Firebase
            </a>
            ;
          </li>
          <li>
            <strong>Stripe</strong> — processamento de pagamentos de
            assinaturas.{" "}
            <a
              href="https://stripe.com/privacy"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de privacidade da Stripe
            </a>
            ;
          </li>
          <li>
            <strong>Google Play</strong> — distribuição do aplicativo e, quando
            aplicável, cobrança de assinaturas;
          </li>
          <li>
            <strong>Vercel</strong> — hospedagem do site e métricas de
            desempenho anônimas.
          </li>
        </ul>
        <p>
          Esses provedores possuem suas próprias políticas de privacidade e
          medidas de segurança, e só recebem os dados necessários para prestar
          seus serviços.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        4. Armazenamento e segurança
      </h2>
      <section className="space-y-4">
        <p>
          Seus dados são armazenados em servidores seguros do Google Firebase.
          Adotamos medidas técnicas e organizacionais para proteger seus dados
          contra acesso não autorizado, perda ou alteração, incluindo
          criptografia em trânsito e controles de acesso.
        </p>
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa. Após a
          exclusão da conta, seus dados pessoais e listas são removidos dos
          nossos sistemas, ressalvadas obrigações legais de retenção (por
          exemplo, registros fiscais de pagamento).
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        5. Seus direitos (LGPD)
      </h2>
      <section className="space-y-4">
        <p>
          Nos termos da LGPD, você tem direito a: confirmar a existência de
          tratamento dos seus dados; acessar seus dados; corrigir dados
          incompletos ou desatualizados; solicitar a anonimização, bloqueio ou
          eliminação de dados desnecessários; solicitar a portabilidade;
          revogar o consentimento; e solicitar a exclusão da sua conta e dos
          dados associados.
        </p>
        <p>
          Para exercer qualquer um desses direitos, entre em contato pelo
          e-mail{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        6. Exclusão de conta e dados
      </h2>
      <section className="space-y-4">
        <p>
          Você pode solicitar a exclusão da sua conta e de todos os dados
          associados a qualquer momento, enviando um e-mail para{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          com o assunto &quot;Exclusão de conta&quot;, a partir do e-mail
          cadastrado. A exclusão será concluída em até 30 dias.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        7. Crianças e adolescentes
      </h2>
      <section className="space-y-4">
        <p>
          O ListaAi não é direcionado a menores de 13 anos e não coletamos
          intencionalmente dados de crianças. Se você acredita que uma criança
          nos forneceu dados pessoais, entre em contato para que possamos
          removê-los.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        8. Alterações nesta política
      </h2>
      <section className="space-y-4">
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. A
          versão mais recente estará sempre disponível nesta página, com a
          data da última atualização indicada no topo. Alterações relevantes
          poderão ser comunicadas dentro do aplicativo.
        </p>
      </section>

      <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
        9. Contato
      </h2>
      <section className="space-y-4">
        <p>
          Em caso de dúvidas sobre esta Política de Privacidade ou sobre o
          tratamento dos seus dados, entre em contato:
        </p>
        <p>
          <strong>E-mail:</strong>{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </main>
  );
}
