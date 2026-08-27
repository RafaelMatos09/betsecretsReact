import { useState, type FormEvent } from 'react'
import './styles.css'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'

type AuthMode = 'login' | 'cadastro'

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isSignup = mode === 'cadastro'

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setSubmitted(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="auth-shell" aria-label="Acesso ao BetSecrets">
      <div className="auth-brand" aria-label="BetSecrets">
        <div className="brand-mark"><Sparkles size={18} strokeWidth={2.5} /></div>
        <span>bet<span>secrets</span></span>
      </div>

      <div className="auth-grid">
        <div className="auth-intro">
          <div className="eyebrow"><span className="live-dot" /> comunidade privada de bets</div>
          <h1>Suas melhores apostas, <em>em segredo.</em></h1>
          <p>Entre para acompanhar palpites exclusivos, compartilhar estratégias e apostar com quem entende do jogo.</p>
          <div className="trust-row">
            <div className="avatar-stack" aria-hidden="true"><span>LC</span><span>RM</span><span>JP</span><b>+2k</b></div>
            <span>apostadores já fazem parte</span>
          </div>
          <div className="quote-card">
            <div className="quote-top"><span className="quote-stars">★★★★★</span><span>membro verificado</span></div>
            <p>“O lugar onde meus palpites finalmente começaram a bater.”</p>
            <strong>Xuxeluf Brelie <small>• há 2 min</small></strong>
          </div>
        </div>

        <div className="auth-card">
          <div className="mode-tabs" role="tablist" aria-label="Tipo de acesso">
            <button type="button" role="tab" aria-selected={!isSignup} className={!isSignup ? 'active' : ''} onClick={() => changeMode('login')}>Entrar</button>
            <button type="button" role="tab" aria-selected={isSignup} className={isSignup ? 'active' : ''} onClick={() => changeMode('cadastro')}>Criar conta</button>
          </div>

          <div className="form-heading">
            <h2>{isSignup ? 'Crie seu acesso' : 'Bem-vindo de volta'}</h2>
            <p>{isSignup ? 'Comece a jogar junto com a comunidade.' : 'Acesse sua central de palpites.'}</p>
          </div>

          {submitted ? (
            <div className="success-state" role="status">
              <div className="success-icon"><Check size={25} /></div>
              <h3>{isSignup ? 'Conta criada!' : 'Tudo certo!'}</h3>
              <p>{isSignup ? 'Seu acesso ao BetSecrets está pronto.' : 'Você será direcionado para seus palpites.'}</p>
              <button type="button" className="primary-button" onClick={() => setSubmitted(false)}>Continuar <ArrowRight size={17} /></button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {isSignup && <label><span>Como podemos te chamar?</span><div className="input-wrap"><UserRound size={17} /><input required name="name" placeholder="Seu nome" autoComplete="name" /></div></label>}
              <label><span>E-mail</span><div className="input-wrap"><Mail size={17} /><input required type="email" name="email" placeholder="voce@email.com" autoComplete="email" /></div></label>
              <label><span>Senha</span><div className="input-wrap"><LockKeyhole size={17} /><input required minLength={6} type={showPassword ? 'text' : 'password'} name="password" placeholder="Mínimo de 6 caracteres" autoComplete={isSignup ? 'new-password' : 'current-password'} /><button type="button" className="icon-button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
              {isSignup ? <label className="check-label"><input required type="checkbox" /> <span>Eu concordo com os <a href="#termos">Termos de uso</a> e a Política de privacidade.</span></label> : <div className="form-options"><label className="check-label"><input type="checkbox" /> <span>Lembrar de mim</span></label><a href="#recuperar">Esqueci minha senha</a></div>}
              <button type="submit" className="primary-button">{isSignup ? 'Criar minha conta' : 'Entrar na conta'} <ArrowRight size={17} /></button>
            </form>
          )}
          <div className="secure-note"><ShieldCheck size={15} /> Seus dados estão protegidos e nunca serão compartilhados.</div>
        </div>
      </div>
      <footer>© 2024 BetSecrets <span>•</span> Jogue com responsabilidade. 18+</footer>
    </section>
  )
}

export default AuthPanel
