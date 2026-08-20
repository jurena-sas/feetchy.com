import React from 'react';
import Link from 'next/link';
import { buildHomePath, defaultLang } from '../config';

const langMap = {
  fr: { label: 'Français', flag: '/assets/img/flag_fr.png' },
  en: { label: 'English', flag: '/assets/img/flag_en.png' },
  it: { label: 'Italiano', flag: '/assets/img/flag_it.png' },
  de: { label: 'Deutsch', flag: '/assets/img/flag_de.png' },
  es: { label: 'Español', flag: '/assets/img/flag_es.png' },
};

const LangSelect = ({ lang = defaultLang }) => {
    const current = langMap[lang] || langMap.fr;

    return (
        <>
            <div className="dropdown header-left-menu header-left-menu-lang">
                <div className="header-left-menu-avtive">
                    <img src={current.flag} alt={current.label} title={current.label} /> {current.label}{' '}
                    <i className="fa fa-angle-down"></i>
                </div>

                <ul className="dropdown-menu">
                    <li>
                        <Link href={buildHomePath('fr')} title="Français">
                            <img src="/assets/img/flag_fr.png" alt="Français" title="Français" /> Français
                        </Link>
                    </li>
                    <li>
                        <Link href={buildHomePath('en')} title="English">
                            <img src="/assets/img/flag_en.png" alt="English" title="English" /> English
                        </Link>
                    </li>
                    <li>
                        <Link href={buildHomePath('it')} title="Italiano">
                            <img src="/assets/img/flag_it.png" alt="Italiano" title="Italiano" /> Italiano
                        </Link>
                    </li>
                    <li>
                        <Link href={buildHomePath('de')} title="Deutsch">
                            <img src="/assets/img/flag_de.png" alt="Deutsch" title="Deutsch" /> Deutsch
                        </Link>
                    </li>
                    <li>
                        <Link href={buildHomePath('es')} title="Español">
                            <img src="/assets/img/flag_es.png" alt="Español" title="Español" /> Español
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default LangSelect;
