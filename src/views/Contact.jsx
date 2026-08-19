import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = ({ lang = 'fr' }) => {
    return (
        <div>
            <Header lang={lang} />
            <div className="page-title-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="page-title">
                                <h3>Contact Us</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="google-map-area ptb-80">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="google-map" id="map">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contuct-form-area pb-80">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="contuct-form">
                                <form>
                                    <div className="form-group contuct_f">
                                        <label htmlFor="contactName">Name <span>*</span></label>
                                        <input type="text" className="form-control" id="contactName" placeholder="Name" />
                                    </div>
                                    <div className="form-group contuct_f">
                                        <label htmlFor="contactEmail">Email <span>*</span></label>
                                        <input type="email" className="form-control" id="contactEmail" placeholder="Email" />
                                    </div>
                                    <div className="form-group contuct_f">
                                        <label htmlFor="contactPhone">Phone Number</label>
                                        <input type="text" className="form-control" id="contactPhone" placeholder="Phone Number" />
                                    </div>
                                    <div className="form-group contuct_f">
                                        <label htmlFor="contactMessage">What is on your mind? <span>*</span></label>
                                        <textarea className="form-control" id="contactMessage" rows="3"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-default contact-btn">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer lang={lang} />
        </div>
    );
};

export default Contact;