import home from './data/home'

const sectionIds = ['panorama', 'vr', 'history', 'spirit', 'value', 'yunxiao', 'news'] as const

function SectionHead({
  eyebrow,
  title,
  moreHref
}: {
  eyebrow: string
  title: string
  moreHref?: string
}) {
  return (
    <div className="section__head">
      <div>
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
      </div>
      {moreHref ? (
        <a className="section__more" href={moreHref} target="_blank" rel="noreferrer">
          更多
        </a>
      ) : null}
    </div>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand" href="#top" aria-label={`${home.hero.title}${home.hero.subtitle}`}>
            {home.hero.title}
            {home.hero.subtitle}
          </a>
          <nav className="nav-list" aria-label="首页栏目">
            {home.navEntries.map((entry, index) => (
              <a href={`#${sectionIds[index]}`} key={entry.label}>
                {entry.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <img className="hero__image" src={home.hero.image} alt={`${home.hero.title}${home.hero.subtitle}`} />
          <div className="hero__content">
            <p className="hero__eyebrow">Xiangdongqu Digital Museum</p>
            <h1 className="hero__title">{home.hero.title}</h1>
            <p className="hero__desc">{home.hero.subtitle}</p>
            <div className="hero__actions">
              {home.hero.organizations.map((organization) => (
                <span className="secondary-button" key={organization}>
                  {organization}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="main-content">
          <nav className="quick-panel" aria-label="快速入口">
            {home.navEntries.map((entry, index) => (
              <a className="quick-entry" href={`#${sectionIds[index]}`} key={entry.label}>
                <span className="quick-entry__icon">
                  <img src={entry.icon} alt="" aria-hidden="true" />
                </span>
                <span className="quick-entry__label">{entry.label}</span>
              </a>
            ))}
          </nav>

          <section className="section" id="panorama">
            <SectionHead eyebrow="Panorama Canal" title={home.panorama.title} moreHref={home.panorama.sourceUrl} />
            <article className="panorama-card">
              <img className="panorama-card__image" src={home.panorama.image} alt={home.panorama.caption} />
              <div className="panorama-card__body">
                <h3 className="panorama-card__title">{home.panorama.caption}</h3>
                <p className="panorama-card__desc">
                  以水渠工程风貌为主视觉入口，呈现向东渠跨山越岭、汇水惠民的建设记忆。
                </p>
              </div>
            </article>
          </section>

          <section className="section" id="vr">
            <SectionHead eyebrow="Virtual Exhibition" title={home.vr.title} moreHref={home.vr.sourceUrl} />
            <article className="vr-card">
              <img className="vr-card__image" src={home.vr.image} alt={home.vr.name} />
              <div className="vr-card__shade" />
              <div>
                <div className="vr-card__badge">VR</div>
                <div className="vr-card__copy">
                  <strong className="vr-card__name">{home.vr.name}</strong>
                  <span className="vr-card__desc">{home.vr.description}</span>
                </div>
              </div>
            </article>
          </section>

          <section className="section" id="history">
            <SectionHead eyebrow="Historical Archives" title={home.history.title} />
            <div className="history-grid">
              {home.history.cards.map((card) => (
                <article className="history-card" key={card.title}>
                  <img className="history-card__image" src={card.image} alt={card.title} />
                  <div className="history-card__body">
                    <h3 className="history-card__title">{card.title}</h3>
                    <p className="history-card__meta">{card.subtitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section" id="spirit">
            <SectionHead eyebrow="Spiritual Connotation" title={home.spirit.title} moreHref={home.navEntries[3].sourceUrl} />
            <article className="spirit-card">
              <img className="spirit-card__image" src={home.spirit.image} alt={home.spirit.title} />
              <div className="spirit-card__panel">
                {home.spirit.keywords.map((keyword) => (
                  <strong className="spirit-card__keyword" key={keyword}>
                    {keyword}
                  </strong>
                ))}
              </div>
            </article>
          </section>

          <section className="section" id="value">
            <SectionHead eyebrow="Contemporary Value" title={home.value.title} moreHref={home.navEntries[4].sourceUrl} />
            <article className="value-card">
              <img className="value-card__icon" src="/assets/images/icon-value.png" alt="" aria-hidden="true" />
              <p className="value-card__summary">{home.value.summary}</p>
            </article>
          </section>

          <section className="section" id="yunxiao">
            <SectionHead eyebrow="Yunxiao Today" title={home.yunxiao.title} moreHref={home.yunxiao.sourceUrl} />
            <article className="yunxiao-card">
              <div className="yunxiao-card__body">
                <h3 className="yunxiao-card__title">{home.yunxiao.caption}</h3>
                <p className="yunxiao-card__desc">
                  从向东渠精神出发，连接今日云霄的城市山水、地方记忆与发展面貌。
                </p>
              </div>
              <img className="yunxiao-card__image" src={home.yunxiao.image} alt={home.yunxiao.caption} />
            </article>
          </section>

          <section className="section" id="news">
            <SectionHead eyebrow="News" title={home.news.title} moreHref={home.navEntries[6].sourceUrl} />
            <div className="news-list">
              {home.news.list.map((item) => (
                <a className="news-item" href={item.sourceUrl} target="_blank" rel="noreferrer" key={item.title}>
                  <span className="news-item__icon" aria-hidden="true" />
                  <span className="news-item__title">{item.title}</span>
                  <span className="news-item__source">{item.source}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div>
            <div className="site-footer__brand">
              {home.hero.title}
              {home.hero.subtitle}
            </div>
            <p className="site-footer__text">{home.hero.organizations.join(' / ')}</p>
          </div>
          <p className="site-footer__text">
            数据来源：{home.sourceBase}
            <br />
            核验日期：{home.sourceCheckedAt}
          </p>
        </div>
      </footer>
    </div>
  )
}
