import React from 'react';

import FooterNav1 from './FooterNav1';
import FooterNav2 from './FooterNav2';
import { defaultLang } from '../config.js';

const Footer = ({ lang = defaultLang }) => {
    return (
        <div className="footer-area footer-area-2 ptb-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-5 col-sm-6 col-xs-12 mar_b-30">
                        <div className="footer-wrapper">
                            <div className="footer-logo">
                                <img src="/assets/img/logo-n.png" alt="Logo" />
                            </div>
                            <p>Feetchy propose des lacets de qualité, pensés pour sublimer vos chaussures au quotidien. Styles, couleurs et finitions soignées pour donner une nouvelle vie à chaque paire.</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 hidden-sm col-xs-12 mar_b-30">
                        <FooterNav1 lang={lang} />
                    </div>
                    <div className="col-lg-3 col-md-3 hidden-sm col-xs-12 mar_b-30">
                        <FooterNav2 lang={lang} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;