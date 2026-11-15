
import { useState } from 'react';
import { api } from '../services/api.js';
import { setAccessToken } from '../services/auth.js';
import InputField from "../components/details/InputFieldLogin.jsx";

export function AdmLoginPage({ onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/auth/login', form);

      if (!data?.accessToken) {
        throw new Error('A resposta de autenticação não possui um token.');
      }

      setAccessToken(data.accessToken);
      onLogin?.(data.user);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Não foi possível realizar o login.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="
      min-h-screen w-full
      bg-gradient-to-br from-[#192957] to-[#1E3F99]
      flex items-center justify-center
      px-6 py-10
    ">

      <div className="
        mx-auto grid w-full max-w-[1180px]
        grid-cols-1 items-center gap-12
        lg:grid-cols-2 lg:gap-16
      ">

        {/* Área institucional */}
        <section className="
          flex flex-col items-center
          justify-center gap-12
        ">

          <img
            src="/logo-joao-maria.png"
            alt="Associação Comunitária João Maria"
            className="
              w-full max-w-[334px]
              rounded-md object-contain
            "
          />

        </section>

        {/* Área de autenticação */}
        <section className="
          flex w-full justify-center
          lg:justify-end
        ">

          <div className="
            w-full max-w-[448px]
            rounded-2xl bg-white
            px-8 py-8
            shadow-xl
            sm:px-8 sm:py-9
          ">

            {/* Cabeçalho */}
            <header className="mb-7">

              <h1 className="
                text-2xl font-bold
                tracking-tight text-[#1B2B59]
              ">
                Bem-vindo (a)
              </h1>

              <p className="
                mt-1 text-sm text-slate-500
              ">
                Acesse o painel administrativo
              </p>

            </header>

            {/* Formulário */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >

              <InputField
                id="login-email"
                name="email"
                label="E-mail"
                type="email"
                placeholder="email@instituicao.com.br"
                value={form.email}
                onChange={handleChange}
                required
              />

              <InputField
                id="login-password"
                name="password"
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />

              {/* Botão */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-[-1px] h-10 w-full
                  rounded-lg bg-[#2050DE]
                  text-sm font-medium text-white
                  transition duration-200
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-400
                  focus:ring-offset-2
                "
              >
                {isSubmitting ? 'Entrando...' : 'Entrar no painel'}
              </button>

            </form>

            {error && (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {/* Rodapé */}
            <footer className="
              mt-5 border-t border-slate-100
              pt-5 text-center
            ">

              <p className="text-sm text-slate-500">
                Contas administrativas são criadas pelo responsável do sistema.
              </p>

            </footer>

          </div>

        </section>

      </div>

    </main>
  );
}
