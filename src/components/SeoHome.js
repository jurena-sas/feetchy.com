import React from 'react';

const SeoHome = ({ initialHtml = '' }) => {
    if (!initialHtml) return null;

    return (
        <section className="seo-content home-page-2" style={{ marginBottom: '150px' }}>
            <div className="container">
                <div style={{ background: '#fafafa', padding: '50px', textAlign: 'center' }}>
                    <div className="row">
                        <div
                            className="col-lg-12 text-center"
                            dangerouslySetInnerHTML={{ __html: initialHtml }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SeoHome;
