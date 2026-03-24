import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, GitBranch, FileCode, Plus, CheckCircle2, ArrowRight,
  FolderTree, Code2, Globe, Users, Timer, Sparkles, ExternalLink
} from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function Contribute() {
  const { lang } = useI18n()
  const G = useGameText('contribute')
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
      <Link to="/" className="btn-ghost text-sm -ml-2 mb-8">
        <ChevronLeft size={18} />
        {G('back')}
      </Link>

      {/* Header */}
      <motion.div {...fadeUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Plus size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">{G('title')}</h1>
            <p className="text-text-muted text-sm">{G('subtitle')}</p>
          </div>
        </div>
        <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
          {L(
            'GameStol — проект с открытым кодом. Вы можете добавить свою любимую настольную игру за 30 минут. Вот как это сделать.',
            'GameStol is open source. You can add your favorite board game in 30 minutes. Here\'s how.'
          )}
        </p>
      </motion.div>

      {/* Quick start */}
      <motion.div {...fadeUp} className="card p-6 mb-8 border-accent/20">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          {G('quick_start')}
        </h2>
        <div className="bg-bg rounded-xl p-4 font-mono text-sm text-text-secondary overflow-x-auto">
          <p className="text-text-muted"># {G('clone_repo')}</p>
          <p className="text-emerald-400">git clone https://github.com/egorfedorov/gamestol.git</p>
          <p className="text-emerald-400">cd gamestol</p>
          <p className="text-emerald-400">npm install</p>
          <p className="text-emerald-400">npm run dev</p>
          <p className="mt-2 text-text-muted"># {G('open')} http://localhost:5173/gamestol/</p>
        </div>
      </motion.div>

      {/* Steps */}
      <div className="space-y-6 mb-12">
        {/* Step 1 */}
        <motion.div {...fadeUp} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">1</span>
            <h3 className="text-lg font-bold">{G('step1')}</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            {G('create_file_in')} <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs">src/games/YourGame.tsx</code>
          </p>
          <div className="bg-bg rounded-xl p-4 font-mono text-xs text-text-secondary overflow-x-auto leading-relaxed">
            <p className="text-text-muted">// src/games/YourGame.tsx</p>
            <p><span className="text-blue-400">import</span> {'{ useState }'} <span className="text-blue-400">from</span> <span className="text-emerald-400">'react'</span></p>
            <p><span className="text-blue-400">import</span> {'{ useI18n }'} <span className="text-blue-400">from</span> <span className="text-emerald-400">'../i18n'</span></p>
            <p><span className="text-blue-400">import</span> {'{ useGameText }'} <span className="text-blue-400">from</span> <span className="text-emerald-400">'../hooks/useGameText'</span></p>
            <p>&nbsp;</p>
            <p><span className="text-blue-400">export default function</span> <span className="text-amber-400">YourGame</span>() {'{'}</p>
            <p>  <span className="text-blue-400">const</span> {'{ t }'} = useI18n()</p>
            <p>  <span className="text-blue-400">const</span> G = useGameText(<span className="text-emerald-400">'your-game'</span>)</p>
            <p>  <span className="text-blue-400">const</span> [phase, setPhase] = useState(<span className="text-emerald-400">'setup'</span>)</p>
            <p>&nbsp;</p>
            <p>  <span className="text-text-muted">// Setup → Playing → End</span></p>
            <p>  <span className="text-blue-400">if</span> (phase === <span className="text-emerald-400">'setup'</span>) {'{'}</p>
            <p>    <span className="text-blue-400">return</span> ({'<div>..setup UI..</div>'})</p>
            <p>  {'}'}</p>
            <p>  <span className="text-text-muted">// ... more phases</span></p>
            <p>{'}'}</p>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div {...fadeUp} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">2</span>
            <h3 className="text-lg font-bold">{G('step2')}</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            {G('add_info_to')} <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs">src/games/registry.tsx</code>
          </p>
          <div className="bg-bg rounded-xl p-4 font-mono text-xs text-text-secondary overflow-x-auto leading-relaxed">
            <p>{'{'}</p>
            <p>  id: <span className="text-emerald-400">'your-game'</span>,</p>
            <p>  name: <span className="text-emerald-400">'Ваша Игра'</span>,</p>
            <p>  nameEn: <span className="text-emerald-400">'Your Game'</span>,</p>
            <p>  emoji: <span className="text-emerald-400">'🎲'</span>,</p>
            <p>  minPlayers: <span className="text-amber-400">2</span>,</p>
            <p>  maxPlayers: <span className="text-amber-400">10</span>,</p>
            <p>  difficulty: <span className="text-emerald-400">'easy'</span>, <span className="text-text-muted">// easy | medium | hard</span></p>
            <p>  hostMode: <span className="text-emerald-400">'none'</span>,  <span className="text-text-muted">// required | optional | none</span></p>
            <p>  tagline: {'{ ru: "...", en: "..." }'},</p>
            <p>  description: {'{ ru: "...", en: "..." }'},</p>
            <p>  howToPlay: {'{ ru: [...], en: [...] }'},</p>
            <p>  commonMistakes: {'{ ru: [...], en: [...] }'},</p>
            <p>  component: YourGame,</p>
            <p>{'}'}</p>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div {...fadeUp} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">3</span>
            <h3 className="text-lg font-bold">{G('step3')}</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            {G('add_text_to')} <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs">src/data/game-i18n.ts</code>
          </p>
          <div className="bg-bg rounded-xl p-4 font-mono text-xs text-text-secondary overflow-x-auto leading-relaxed">
            <p className="text-text-muted">// 12 languages supported</p>
            <p>your_game: {'{'}</p>
            <p>  title: {'{'} ru: <span className="text-emerald-400">'Ваша Игра'</span>, en: <span className="text-emerald-400">'Your Game'</span>, es: <span className="text-emerald-400">'Tu Juego'</span>, ... {'}'},</p>
            <p>  some_label: {'{'} ru: <span className="text-emerald-400">'...'</span>, en: <span className="text-emerald-400">'...'</span>, ... {'}'},</p>
            <p>{'}'}</p>
          </div>
        </motion.div>

        {/* Step 4 */}
        <motion.div {...fadeUp} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-bold">4</span>
            <h3 className="text-lg font-bold">{G('step4')}</h3>
          </div>
          <div className="bg-bg rounded-xl p-4 font-mono text-sm text-text-secondary overflow-x-auto">
            <p className="text-text-muted"># {G('create_branch')}</p>
            <p className="text-emerald-400">git checkout -b add-your-game</p>
            <p className="text-emerald-400">git add -A</p>
            <p className="text-emerald-400">git commit -m "Add YourGame"</p>
            <p className="text-emerald-400">git push origin add-your-game</p>
          </div>
          <p className="text-text-secondary text-sm mt-4">
            {G('pr_desc')}
          </p>
        </motion.div>
      </div>

      {/* UX Guidelines */}
      <motion.div {...fadeUp} className="mb-12">
        <h2 className="text-xl font-bold mb-6">{G('quality')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Globe, title: G('bilingual'), desc: G('bilingual_desc') },
            { icon: Users, title: G('instructions_title'), desc: G('instructions_desc') },
            { icon: Timer, title: G('mobile_ux'), desc: G('mobile_desc') },
            { icon: CheckCircle2, title: G('mistakes_title'), desc: G('mistakes_desc') },
            { icon: Code2, title: G('player_rules'), desc: G('player_rules_desc') },
            { icon: FolderTree, title: G('phases_title'), desc: G('phases_desc') },
          ].map((item, i) => (
            <div key={i} className="card p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <item.icon size={16} className="text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">{item.title}</p>
                <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Host mode guide */}
      <motion.div {...fadeUp} className="card p-6 mb-12">
        <h2 className="text-lg font-bold mb-4">{G('host_modes')}</h2>
        <div className="space-y-4">
          {[
            { mode: 'required', color: 'text-amber-400 bg-amber-400/10', title: G('host_required'), desc: L('Мафия, Данетки — ведущий управляет игрой, видит скрытую информацию. Добавьте скрипты для ведущего.', 'Mafia, Black Stories — host manages, sees hidden info. Add narrator scripts.') },
            { mode: 'optional', color: 'text-blue-400 bg-blue-400/10', title: G('host_optional'), desc: L('Что? Где? Когда? — можно с ведущим или без. Добавьте выбор режима.', 'Quiz — works with or without host. Add mode selector.') },
            { mode: 'none', color: 'text-emerald-400 bg-emerald-400/10', title: G('no_host'), desc: L('Alias, Крокодил — телефон ведёт всё. Поставил в центр и играй.', 'Alias, Charades — phone runs everything. Put in center and play.') },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`badge ${item.color} text-xs px-2 py-1 mt-0.5`}>{item.mode}</span>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-text-muted text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Project structure */}
      <motion.div {...fadeUp} className="card p-6 mb-12">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FolderTree size={18} className="text-accent" />
          {G('project_structure')}
        </h2>
        <div className="bg-bg rounded-xl p-4 font-mono text-xs text-text-secondary overflow-x-auto leading-relaxed">
          <p>src/</p>
          <p>  games/</p>
          <p>    <span className="text-accent">registry.tsx</span>      <span className="text-text-muted">{L('← каталог игр', '← game catalog')}</span></p>
          <p>    <span className="text-accent">MafiaGame.tsx</span>     <span className="text-text-muted">← 🎭</span></p>
          <p>    <span className="text-accent">AliasGame.tsx</span>     <span className="text-text-muted">← 💬</span></p>
          <p>    <span className="text-accent">YourGame.tsx</span>      <span className="text-text-muted">{L('← ваша игра', '← your game')}</span></p>
          <p>  data/</p>
          <p>    <span className="text-accent">game-i18n.ts</span>      <span className="text-text-muted">{L('← переводы', '← translations')}</span></p>
          <p>    <span className="text-accent">words.ts</span>          <span className="text-text-muted">{L('← слова для игр', '← word lists')}</span></p>
          <p>  hooks/</p>
          <p>    <span className="text-accent">useGameText.ts</span>    <span className="text-text-muted">{L('← хук переводов', '← translation hook')}</span></p>
          <p>    <span className="text-accent">useTimer.ts</span>       <span className="text-text-muted">{L('← таймер', '← timer')}</span></p>
          <p>  components/</p>
          <p>    <span className="text-accent">PlayerSetup.tsx</span>   <span className="text-text-muted">{L('← ввод игроков', '← player input')}</span></p>
          <p>    <span className="text-accent">Timer.tsx</span>         <span className="text-text-muted">{L('← визуальный таймер', '← visual timer')}</span></p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp} className="text-center">
        <a href="https://github.com/egorfedorov/gamestol" target="_blank" rel="noopener"
          className="btn-primary text-lg px-10 py-5 shadow-lg shadow-accent/20">
          <GitBranch size={20} />
          {G('open_github')}
          <ExternalLink size={16} />
        </a>
        <p className="text-text-muted text-sm mt-4">
          {G('fork_flow')}
        </p>
      </motion.div>
    </div>
  )
}
