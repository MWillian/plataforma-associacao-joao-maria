
import InputField from "../components/details/InputFieldLogin.jsx";

export function AdmLoginPage() {
  function handleSubmit(event) {
    event.preventDefault();

    // Aqui será implementada a autenticação.
    console.log("Tentativa de login");
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
                label="E-mail"
                type="email"
                placeholder="email@instituicao.com.br"
                required
              />

              <InputField
                label="Senha"
                type="password"
                placeholder="••••••••"
                required
              >
                <a
                  href="/recuperar-senha"
                  className="
                    text-sm font-medium
                    text-blue-600
                    transition hover:text-blue-800
                  "
                >
                  Esqueceu a senha?
                </a>
              </InputField>

              {/* Botão */}
              <button
                type="submit"
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
                Entrar no painel
              </button>

            </form>

            {/* Rodapé */}
            <footer className="
              mt-5 border-t border-slate-100
              pt-5 text-center
            ">

              <p className="text-sm text-slate-500">
                Não tem uma conta?{" "}
                <a
                  href="/cadastro"
                  className="
                    font-medium text-blue-600
                    hover:text-blue-800
                    transition
                  "
                >
                  Cadastrar-se
                </a>
              </p>

            </footer>

          </div>

        </section>

      </div>

    </main>
  );
}
